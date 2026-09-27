/**
 * Storage.
 *
 * Two implementations behind one interface. Neon Postgres in production;
 * a JSON file under `.state/` when `DATABASE_URL` is unset, which is what
 * makes `npm run dev` work with no accounts, no provisioning and no signup —
 * the difference between a contributor starting in one minute or twenty.
 *
 * The file store is development-only by construction: serverless instances do
 * not share a filesystem, so in production it would silently fragment progress
 * across instances. `storageKind()` exists so the board can say which is live.
 */

import { neon } from "@neondatabase/serverless";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { StoredEvent } from "../shared/protocol.js";

/** The subset of Neon's tagged-template client this module uses. */
type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, unknown>[]>;

export interface SessionRow {
  id: string;
  displayName: string;
  startedAt: number;
  lastSeenAt: number;
}

export interface Store {
  kind: "postgres" | "file";
  createSession(row: SessionRow): Promise<void>;
  getSession(id: string): Promise<SessionRow | null>;
  touchSession(id: string, at: number): Promise<void>;
  listSessions(): Promise<SessionRow[]>;
  appendEvents(events: StoredEvent[]): Promise<void>;
  eventsFor(sessionId: string): Promise<StoredEvent[]>;
  allEvents(limit?: number): Promise<StoredEvent[]>;
}

/* ------------------------------------------------------------- postgres */

class PostgresStore implements Store {
  readonly kind = "postgres" as const;
  private ready: Promise<void> | null = null;

  constructor(private readonly sql: Sql) {}

  /** Lazily creates the schema once per instance, not once per request. */
  private ensure(): Promise<void> {
    this.ready ??= (async () => {
      await this.sql`
        create table if not exists sessions (
          id            text primary key,
          display_name  text   not null,
          started_at    bigint not null,
          last_seen_at  bigint not null
        )`;
      await this.sql`
        create table if not exists events (
          id          text   primary key,
          session_id  text   not null,
          at          bigint not null,
          type        text   not null,
          payload     jsonb  not null default '{}'::jsonb
        )`;
      await this.sql`create index if not exists events_session_idx on events (session_id)`;
      await this.sql`create index if not exists events_at_idx on events (at desc)`;
    })();

    return this.ready;
  }

  async createSession(row: SessionRow): Promise<void> {
    await this.ensure();
    await this.sql`
      insert into sessions (id, display_name, started_at, last_seen_at)
      values (${row.id}, ${row.displayName}, ${row.startedAt}, ${row.lastSeenAt})
      on conflict (id) do nothing`;
  }

  async getSession(id: string): Promise<SessionRow | null> {
    await this.ensure();
    const rows = await this.sql`select * from sessions where id = ${id} limit 1`;
    return rows.length > 0 ? toSession(rows[0]) : null;
  }

  async touchSession(id: string, at: number): Promise<void> {
    await this.ensure();
    await this.sql`update sessions set last_seen_at = ${at} where id = ${id}`;
  }

  async listSessions(): Promise<SessionRow[]> {
    await this.ensure();
    const rows = await this.sql`select * from sessions order by started_at asc`;
    return rows.map(toSession);
  }

  async appendEvents(events: StoredEvent[]): Promise<void> {
    if (events.length === 0) return;
    await this.ensure();

    // One statement per event. At this scale (~12k events across a meeting)
    // the round trips are irrelevant and a hand-built multi-row VALUES clause
    // would give up the driver's parameterisation for nothing.
    for (const event of events) {
      await this.sql`
        insert into events (id, session_id, at, type, payload)
        values (${event.id}, ${event.sessionId}, ${event.at}, ${event.type},
                ${JSON.stringify(event.payload)}::jsonb)
        on conflict (id) do nothing`;
    }
  }

  async eventsFor(sessionId: string): Promise<StoredEvent[]> {
    await this.ensure();
    const rows = await this.sql`
      select * from events where session_id = ${sessionId} order by at asc`;
    return rows.map(toEvent);
  }

  async allEvents(limit = 20_000): Promise<StoredEvent[]> {
    await this.ensure();
    const rows = await this.sql`select * from events order by at asc limit ${limit}`;
    return rows.map(toEvent);
  }
}

function toSession(row: Record<string, unknown>): SessionRow {
  return {
    id: String(row.id),
    displayName: String(row.display_name),
    startedAt: Number(row.started_at),
    lastSeenAt: Number(row.last_seen_at),
  };
}

function toEvent(row: Record<string, unknown>): StoredEvent {
  return {
    id: String(row.id),
    sessionId: String(row.session_id),
    at: Number(row.at),
    type: row.type as StoredEvent["type"],
    payload: (row.payload ?? {}) as Record<string, unknown>,
  };
}

/* ----------------------------------------------------------------- file */

interface FileShape {
  sessions: SessionRow[];
  events: StoredEvent[];
}

class FileStore implements Store {
  readonly kind = "file" as const;

  constructor(private readonly file: string) {}

  private read(): FileShape {
    try {
      return JSON.parse(readFileSync(this.file, "utf8")) as FileShape;
    } catch {
      return { sessions: [], events: [] };
    }
  }

  private write(data: FileShape): void {
    mkdirSync(dirname(this.file), { recursive: true });
    writeFileSync(this.file, JSON.stringify(data));
  }

  async createSession(row: SessionRow): Promise<void> {
    const data = this.read();
    if (!data.sessions.some((s) => s.id === row.id)) data.sessions.push(row);
    this.write(data);
  }

  async getSession(id: string): Promise<SessionRow | null> {
    return this.read().sessions.find((s) => s.id === id) ?? null;
  }

  async touchSession(id: string, at: number): Promise<void> {
    const data = this.read();
    const session = data.sessions.find((s) => s.id === id);
    if (!session) return;
    session.lastSeenAt = at;
    this.write(data);
  }

  async listSessions(): Promise<SessionRow[]> {
    return this.read().sessions.sort((a, b) => a.startedAt - b.startedAt);
  }

  async appendEvents(events: StoredEvent[]): Promise<void> {
    if (events.length === 0) return;
    const data = this.read();
    const seen = new Set(data.events.map((e) => e.id));
    for (const event of events) if (!seen.has(event.id)) data.events.push(event);
    this.write(data);
  }

  async eventsFor(sessionId: string): Promise<StoredEvent[]> {
    return this.read().events
      .filter((e) => e.sessionId === sessionId)
      .sort((a, b) => a.at - b.at);
  }

  async allEvents(limit = 20_000): Promise<StoredEvent[]> {
    return this.read().events.sort((a, b) => a.at - b.at).slice(-limit);
  }
}

/* ------------------------------------------------------------- selection */

let cached: Store | null = null;

export function store(): Store {
  if (cached) return cached;

  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    cached = new PostgresStore(neon(url) as unknown as Sql);
  } else {
    cached = new FileStore(resolve(process.env.STATE_DIR ?? ".state", "store.json"));
  }

  return cached;
}

export const storageKind = (): Store["kind"] => store().kind;
