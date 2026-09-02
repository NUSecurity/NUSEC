import { Challenge, Meeting } from "@/ctf/types";
import miniCtf from "./mini-ctf";

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
