import type { ClientEvent, EventType } from "#shared/protocol";

/**
 * Batched, fire-and-forget telemetry.
 *
 * Flushes every two seconds or at ten queued, whichever comes first, and uses
 * `keepalive` so a closing tab still reports. A failed flush is dropped rather
 * than retried into a queue that grows without bound — telemetry must never be
 * able to degrade the experience it is measuring.
 *
 * Note the server only accepts the event types the client is genuinely the
 * authority on. It will not take `objective.reached` from here; objectives are
 * decided by the server when it actually serves something.
 */

const FLUSH_MS = 2000;
const MAX_QUEUED = 10;

let queue: ClientEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function send(batch: ClientEvent[]): void {
  if (batch.length === 0) return;

  void fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events: batch }),
    keepalive: true,
  }).catch(() => {
    /* Dropped on purpose. See above. */
  });
}

export function flush(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  const batch = queue;
  queue = [];
  send(batch);
}

export function emit(type: EventType, payload?: Record<string, unknown>): void {
  queue.push({ type, at: Date.now(), payload });

  if (queue.length >= MAX_QUEUED) return flush();
  timer ??= setTimeout(flush, FLUSH_MS);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}
