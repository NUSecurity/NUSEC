import { useCallback, useEffect, useState } from "react";

/**
 * Solved-challenge tracking, kept in localStorage and scoped per meeting so a
 * new GM starts everyone from zero without touching old keys.
 */
const storageKey = (meetingSlug: string) => `nusec:ctf:${meetingSlug}`;

function read(meetingSlug: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(storageKey(meetingSlug));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : []);
  } catch {
    // Private browsing, disabled storage, or corrupted value — progress is a
    // convenience, so fall back to an empty set rather than breaking the page.
    return new Set();
  }
}

function write(meetingSlug: string, solved: Set<string>) {
  try {
    window.localStorage.setItem(
      storageKey(meetingSlug),
      JSON.stringify([...solved]),
    );
  } catch {
    /* ignore */
  }
}

export function useProgress(meetingSlug: string) {
  const [solved, setSolved] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setSolved(read(meetingSlug));
  }, [meetingSlug]);

  const markSolved = useCallback(
    (challengeSlug: string) => {
      setSolved((previous) => {
        if (previous.has(challengeSlug)) return previous;
        const next = new Set(previous).add(challengeSlug);
        write(meetingSlug, next);
        return next;
      });
    },
    [meetingSlug],
  );

  return { solved, markSolved };
}
