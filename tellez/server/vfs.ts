/**
 * The virtual filesystem.
 *
 * Every node knows three things: where it lives, what it takes to open it, and
 * how to turn itself into a wire payload. Adding a file type means adding a
 * subclass here and a viewer app on the client — never touching the resolver,
 * the API handlers, or the world.
 *
 * Authors should not use `new` directly. The builder functions at the bottom
 * (`dir`, `text`, `sheet`, ...) fill in sensible metadata and are what every
 * recipe in ARCHITECTURE.md §7 uses.
 */

import type {
  AppId, Cell, ChatMessage, MailMessage, NodeAttribute, NodeContent,
  NodeKind, NodeMeta, NodeSummary, ObjectiveId, SecretId,
} from "../shared/protocol.js";
import { alwaysOpen, type LockRule, type Progress } from "./locks.js";

/**
 * `concealed` nodes are omitted from their parent's listing until their lock
 * opens; `listed` nodes are always visible and refuse on open.
 *
 * Use `concealed` for a folder whose existence is the discovery, and `listed`
 * for a file whose existence is obvious but whose contents are protected. A
 * `listed` lock is the rarer of the two: a padlock in a file listing is a
 * treasure map straight to the interesting material.
 */
export type Visibility = "listed" | "concealed";

export interface NodeOptions {
  meta?: Partial<NodeMeta>;
  lock?: LockRule;
  visibility?: Visibility;
  reveals?: ObjectiveId[];
}

/** Context a node may consult while rendering itself. */
export interface ContentContext {
  progress: Progress;
  /** Signed, session-scoped URL for a gated binary. */
  assetUrl(assetName: string): string;
}

export abstract class VfsNode {
  abstract readonly kind: NodeKind;

  readonly path: string;
  readonly meta: NodeMeta;
  readonly lock: LockRule;
  readonly visibility: Visibility;
  readonly reveals: ObjectiveId[];

  /** Filled in by the world when the owning module is registered. */
  moduleId = "";

  constructor(path: string, options: NodeOptions = {}, sizeHint = 0) {
    this.path = normalisePath(path);
    this.lock = options.lock ?? alwaysOpen;
    this.visibility = options.visibility ?? "listed";
    this.reveals = options.reveals ?? [];

    const now = Date.UTC(2026, 0, 1);
    this.meta = {
      createdAt: options.meta?.createdAt ?? now,
      modifiedAt: options.meta?.modifiedAt ?? options.meta?.createdAt ?? now,
      accessedAt: options.meta?.accessedAt ?? options.meta?.modifiedAt ?? now,
      sizeBytes: options.meta?.sizeBytes ?? sizeHint,
      attributes: options.meta?.attributes ?? [],
      deleted: options.meta?.deleted,
      owner: options.meta?.owner,
    };
  }

  get name(): string {
    const segments = this.path.split("/");
    return segments[segments.length - 1] || this.path;
  }

  get parentPath(): string | null {
    const index = this.path.lastIndexOf("/");
    return index <= 0 ? null : this.path.slice(0, index);
  }

  get hidden(): boolean {
    return this.meta.attributes.includes("hidden");
  }

  summary(): NodeSummary {
    return { path: this.path, name: this.name, kind: this.kind, meta: this.meta };
  }
}

export class Directory extends VfsNode {
  readonly kind = "dir" as const;
}

export abstract class FileNode extends VfsNode {
  abstract readonly opensWith: AppId;
  abstract content(ctx: ContentContext): NodeContent;
}

/* -------------------------------------------------------------- subclasses */

export class TextFile extends FileNode {
  readonly kind = "text" as const;
  readonly opensWith = "notepad";

  constructor(path: string, private readonly body: string, options?: NodeOptions) {
    super(path, options, body.length);
  }

  content(): NodeContent {
    return { kind: "text", body: this.body };
  }
}

export class SheetFile extends FileNode {
  readonly kind = "sheet" as const;
  readonly opensWith = "sheets";

  constructor(
    path: string,
    private readonly columns: string[],
    private readonly rows: Cell[][],
    private readonly note?: string,
    options?: NodeOptions,
  ) {
    super(path, options, rows.length * columns.length * 12);
  }

  content(): NodeContent {
    return { kind: "sheet", columns: this.columns, rows: this.rows, note: this.note };
  }
}

export class MailArchive extends FileNode {
  readonly kind = "mail" as const;
  readonly opensWith = "mail";

  constructor(path: string, private readonly messages: MailMessage[], options?: NodeOptions) {
    super(path, options, messages.reduce((n, m) => n + m.body.length, 0));
  }

  content(): NodeContent {
    return { kind: "mail", messages: this.messages };
  }
}

export class ChatLog extends FileNode {
  readonly kind = "chat" as const;
  readonly opensWith = "messenger";

  constructor(path: string, private readonly messages: ChatMessage[], options?: NodeOptions) {
    super(path, options, messages.reduce((n, m) => n + m.body.length, 0));
  }

  content(): NodeContent {
    return { kind: "chat", messages: this.messages };
  }
}

export class ImageFile extends FileNode {
  readonly kind = "image" as const;
  readonly opensWith = "photos";

  constructor(
    path: string,
    readonly asset: string,
    private readonly caption?: string,
    options?: NodeOptions,
  ) {
    super(path, options, 240_000);
  }

  content(ctx: ContentContext): NodeContent {
    return { kind: "image", assetUrl: ctx.assetUrl(this.asset), caption: this.caption };
  }
}

export class VideoFile extends FileNode {
  readonly kind = "video" as const;
  readonly opensWith = "media";

  constructor(
    path: string,
    /**
     * An absolute URL, not an asset name. Video exceeds both the 4.5 MB
     * function response cap and the 50 MB bundle cap, so the bytes live in
     * Blob storage or `public/` and it is the *URL* that is gated — the player
     * never receives it until the node's lock opens. See ARCHITECTURE.md §9.3.
     */
    private readonly url: string,
    private readonly poster?: string,
    private readonly caption?: string,
    options?: NodeOptions,
  ) {
    super(path, options, 48_000_000);
  }

  content(): NodeContent {
    return { kind: "video", assetUrl: this.url, poster: this.poster, caption: this.caption };
  }
}

export class ArchiveFile extends FileNode {
  readonly kind = "archive" as const;
  readonly opensWith = "archive";

  constructor(
    path: string,
    readonly entries: VfsNode[],
    private readonly passphrase?: SecretId,
    options?: NodeOptions,
  ) {
    super(path, options, 64_000);
  }

  private isOpen(progress: Progress): boolean {
    return this.passphrase === undefined || progress.secrets.has(this.passphrase);
  }

  content(ctx: ContentContext): NodeContent {
    const open = this.isOpen(ctx.progress);
    return {
      kind: "archive",
      locked: !open,
      // A locked archive still lists its filenames, exactly like a real one.
      // That is the point: the names are a clue, the contents are the prize.
      entries: this.entries.map((entry) => entry.summary()),
    };
  }
}

export class EncryptedFile extends FileNode {
  readonly kind = "encrypted" as const;
  readonly opensWith = "archive";

  constructor(
    path: string,
    readonly passphrase: SecretId,
    private readonly hint?: string,
    options?: NodeOptions,
  ) {
    super(path, { ...options, meta: { ...options?.meta, attributes: ["encrypted"] } }, 12_000);
  }

  content(): NodeContent {
    return { kind: "encrypted", hint: this.hint };
  }
}

export class ShortcutFile extends FileNode {
  readonly kind = "shortcut" as const;
  readonly opensWith = "shortcut";

  constructor(
    path: string,
    readonly target: string,
    readonly targetKind: "path" | "url",
    options?: NodeOptions,
  ) {
    super(path, options, 512);
  }

  content(): NodeContent {
    return { kind: "shortcut", target: this.target, targetKind: this.targetKind };
  }
}

export class BinaryFile extends FileNode {
  readonly kind = "binary" as const;
  readonly opensWith = "hex";

  constructor(path: string, private readonly hexPreview: string, options?: NodeOptions) {
    super(path, options, 1_048_576);
  }

  content(): NodeContent {
    return { kind: "binary", hexPreview: this.hexPreview };
  }
}

/* ----------------------------------------------------------------- paths */

/** Canonical form: forward slashes, no trailing slash, no empty segments. */
export function normalisePath(raw: string): string {
  const cleaned = raw.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/$/, "");
  return cleaned.length === 0 ? "/" : cleaned;
}

/**
 * Windows is case-insensitive and players reach paths by clicking, but the API
 * takes a path parameter and someone will hand-type one. Folding case here
 * costs nothing and removes a class of "why doesn't this work" during a live
 * meeting.
 */
export function pathKey(raw: string): string {
  return normalisePath(raw).toLowerCase();
}

/* -------------------------------------------------------------- builders */

/** Epoch millis from an ISO-ish string, for readable timestamps in content. */
export function ts(iso: string): number {
  const parsed = Date.parse(iso.includes("Z") ? iso : `${iso}Z`);
  if (Number.isNaN(parsed)) throw new Error(`ts(): unparseable date ${iso}`);
  return parsed;
}

/** Marks a node as sitting in the recycle bin, remembering where it came from. */
export function deletedFrom(originalPath: string, at: number): Partial<NodeMeta> {
  return { deleted: { at, originalPath: normalisePath(originalPath) } };
}

export const attrs = (...values: NodeAttribute[]): Partial<NodeMeta> => ({ attributes: values });

export const dir = (path: string, options?: NodeOptions) => new Directory(path, options);

export const text = (path: string, body: string, options?: NodeOptions) =>
  new TextFile(path, body, options);

export const sheet = (
  path: string,
  columns: string[],
  rows: Cell[][],
  note?: string,
  options?: NodeOptions,
) => new SheetFile(path, columns, rows, note, options);

export const mail = (path: string, messages: MailMessage[], options?: NodeOptions) =>
  new MailArchive(path, messages, options);

export const chat = (path: string, messages: ChatMessage[], options?: NodeOptions) =>
  new ChatLog(path, messages, options);

export const image = (path: string, asset: string, caption?: string, options?: NodeOptions) =>
  new ImageFile(path, asset, caption, options);

export const video = (
  path: string, url: string, poster?: string, caption?: string, options?: NodeOptions,
) => new VideoFile(path, url, poster, caption, options);

export const archive = (
  path: string, entries: VfsNode[], passphrase?: SecretId, options?: NodeOptions,
) => new ArchiveFile(path, entries, passphrase, options);

export const encrypted = (
  path: string, passphrase: SecretId, hint?: string, options?: NodeOptions,
) => new EncryptedFile(path, passphrase, hint, options);

export const link = (
  path: string, target: string, targetKind: "path" | "url" = "url", options?: NodeOptions,
) => new ShortcutFile(path, target, targetKind, options);

export const binary = (path: string, hexPreview: string, options?: NodeOptions) =>
  new BinaryFile(path, hexPreview, options);
