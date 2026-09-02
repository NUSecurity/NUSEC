import { Challenge, Meeting } from "@/ctf/types";
import gm1 from "./gm-1";

/**
 * Every meeting whose challenge pages should resolve.
 *
 * To run GM-2:
 *   1. Add `public/ctf/gm-2/` with that meeting's artifacts.
 *   2. Add `src/ctf/meetings/gm-2.ts` (copy gm-1.ts as a starting point).
 *   3. Add its flags to `api/ctfValidator.ts`.
 *   4. Add it to the array below.
 *
 * To retire GM-1, either flip `active: false` in its manifest (page still
 * resolves, marked archived) or delete its manifest, its line below, its
 * `public/ctf/gm-1/` folder, and its flags in the validator.
 *
 * Order matters only for `currentMeeting` — newest first.
 */
export const meetings: Meeting[] = [gm1];

/** The meeting `/challenges` and the "latest" link point at. */
export const currentMeeting: Meeting | undefined = meetings.find(
  (meeting) => meeting.active !== false,
);

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
