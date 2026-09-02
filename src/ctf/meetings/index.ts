import { Challenge, Meeting } from "@/ctf/types";
import miniCtf from "./mini-ctf";

/**
 * Every meeting whose challenge pages should resolve.
 *
 * The mini-CTF lives at a fixed slug, so `/challenges/mini-ctf` is the same
 * link every meeting. Running the next one is a content swap, not a rebuild:
 *
 *   1. Replace the files in `public/ctf/mini-ctf/`.
 *   2. Rewrite the challenges in `mini-ctf.ts`.
 *   3. Replace the flags in `api/ctfValidator.ts`.
 *
 * Nothing here changes. If you ever want to keep an old meeting readable
 * alongside the current one, give it its own slug (`mini-ctf-1`, say), add its
 * manifest to the array below, and set `active: false` on it so its flags stop
 * being accepted.
 */
export const meetings: Meeting[] = [miniCtf];

export function getMeeting(slug: string | undefined): Meeting | undefined {
  return meetings.find((meeting) => meeting.slug === slug);
}

export function getChallenge(
  meetingSlug: string | undefined,
  challengeSlug: string | undefined,
): { meeting: Meeting; challenge: Challenge } | undefined {
  const meeting = getMeeting(meetingSlug);
  const challenge = meeting?.challenges.find(
    (item) => item.slug === challengeSlug,
  );
  return meeting && challenge ? { meeting, challenge } : undefined;
}
