import { useCallback, useEffect, useState } from "react";

/**
 * Solved-challenge tracking, kept in localStorage and scoped per meeting so a
 * new GM starts everyone from zero without touching old keys.
 *
 * Each entry also holds the letter the checker issued for that solve. The
 * letter is stored rather than recomputed because the client has no idea what
 * the word is — only the server does.
 */
const storageKey = (meetingSlug: string) => `nusec:ctf:${meetingSlug}`;

export interface SolvedEntry {
  /** The letter this challenge was worth, exactly as the checker sent it. */
  letter?: string;
  /** 0-based position of that letter in the meeting-wide word. */
  index?: number;
  total?: number;
}

function isEntry(value: unknown): value is SolvedEntry {
  return typeof value === "object" && value !== null;
}

function read(meetingSlug: string): Map<string, SolvedEntry> {
  try {
    const raw = window.localStorage.getItem(storageKey(meetingSlug));
    const parsed: unknown = raw ? JSON.parse(raw) : {};

    // Earlier builds stored a bare array of slugs; treat those as solved but
    // letterless rather than throwing the progress away.
    if (Array.isArray(parsed)) {
      return new Map(
        parsed.filter((slug) => typeof slug === "string").map((slug) => [slug, {}]),
      );
    }

    if (!isEntry(parsed)) return new Map();

    return new Map(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([, entry]) => isEntry(entry))
        .map(([slug, entry]) => [slug, entry as SolvedEntry]),
    );
  } catch {
    return new Map();
  }
}

function write(meetingSlug: string, solved: Map<string, SolvedEntry>) {
  try {
    window.localStorage.setItem(
      storageKey(meetingSlug),
      JSON.stringify(Object.fromEntries(solved)),
    );
  } catch {
    /* ignore */
  }
}

export function useProgress(meetingSlug: string) {
  const [solved, setSolved] = useState<Map<string, SolvedEntry>>(() => new Map());

  useEffect(() => {
    setSolved(read(meetingSlug));
  }, [meetingSlug]);

  const markSolved = useCallback(
    (challengeSlug: string, entry: SolvedEntry = {}) => {
      setSolved((previous) => {
        const existing = previous.get(challengeSlug);

        // Re-solving with nothing new to record shouldn't churn state.
        if (existing && entry.letter === undefined) return previous;
        if (existing?.letter === entry.letter && existing?.index === entry.index) {
          return previous;
        }

        const next = new Map(previous).set(challengeSlug, { ...existing, ...entry });
        write(meetingSlug, next);
        return next;
      });
    },
    [meetingSlug],
  );

  return { solved, markSolved };
}
