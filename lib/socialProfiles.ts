/**
 * The five fictional platforms behind the "Paper Trail" challenge.
 *
 * Everything here is invented — the person, the sites, the town. The point is
 * that no single profile gives anything away; each answer needs two sources
 * cross-referenced, which is the actual OSINT skill. The OPSEC lesson is that
 * every answer is also a password-reset question.
 *
 * Like the other portals, the tree is public and only the flag is withheld,
 * so the answer check lives on the server.
 */

export interface ProfileItem {
  title?: string;
  subtitle?: string;
  meta?: string;
  body?: string;
  /** Location or repository tag, rendered as a chip. */
  tag?: string;
}

export interface ProfileSection {
  heading: string;
  items: ProfileItem[];
}

export interface Platform {
  id: string;
  name: string;
  /** Shown in the fake address bar. */
  domain: string;
  tagline: string;
  accent: string;
  layout: "profile" | "feed" | "grid" | "activity" | "code";
  handle: string;
  displayName: string;
  bio: string;
  stats: string;
  sections: ProfileSection[];
}

export const platforms: Platform[] = [
  {
    id: "linkify",
    name: "Linkify",
    domain: "linkify.example/in/dana-whitlock",
    tagline: "Your professional network",
    accent: "#2C6FD1",
    layout: "profile",
    handle: "dana-whitlock",
    displayName: "Dana Whitlock",
    bio: "Infrastructure analyst. Opinions my own.",
    stats: "412 connections",
    sections: [
      {
        heading: "Experience",
        items: [
          {
            title: "Senior Infrastructure Analyst",
            subtitle: "— not announcing this one yet —",
            meta: "Aug 2026 – Present",
            body: "New role, details to follow.",
          },
          {
            title: "Infrastructure Analyst",
            subtitle: "Regional Transit Authority",
            meta: "2023 – 2026",
            body: "Network monitoring and capacity planning across the regional bus fleet.",
          },
          {
            title: "IT Support Technician",
            subtitle: "Northfield Community College",
            meta: "2021 – 2023",
          },
        ],
      },
      {
        heading: "Education",
        items: [
          {
            title: "Northfield Community College",
            subtitle: "Network Administration",
            meta: "2019 – 2021",
          },
        ],
      },
    ],
  },
  {
    id: "chirp",
    name: "Chirp",
    domain: "chirp.example/dwhitlock",
    tagline: "say it in 200",
    accent: "#E8792B",
    layout: "feed",
    handle: "@dwhitlock",
    displayName: "dana",
    bio: "infra nerd · dog person · 34B survivor",
    stats: "1,204 chirps · 318 following",
    sections: [
      {
        heading: "Chirps",
        items: [
          {
            meta: "3 weeks ago",
            body: "new gig starts Monday and I can't say where yet 🤐",
          },
          {
            meta: "2 weeks ago",
            body: "the 34B is late again. third time this week. I could have walked.",
          },
          {
            meta: "12 days ago",
            body: "ok the coffee at the new place is genuinely unreal, I take back everything",
          },
          {
            meta: "9 days ago",
            body: "your stripper name is your first pet + the street you grew up on. mine is Pickles Ashgrove 😂 reply with yours",
          },
          {
            meta: "9 days ago",
            body: "three people replied with what are very obviously their bank security answers. never change, internet",
          },
          {
            meta: "4 days ago",
            body: "someone please tell the dog that 6am is not a reasonable wake up time",
          },
        ],
      },
    ],
  },
  {
    id: "pixelgram",
    name: "PixelGram",
    domain: "pixelgram.example/bisc.wits",
    tagline: "moments, squared",
    accent: "#D6336C",
    layout: "grid",
    handle: "@bisc.wits",
    displayName: "bisc.wits",
    bio: "runs · dogs · bad coffee",
    stats: "96 posts · 540 followers",
    sections: [
      {
        heading: "Posts",
        items: [
          { body: "day one at the new place ☕", tag: "Helixgrid Labs", meta: "3 weeks ago" },
          { body: "new desk, same posture problems", tag: "Helixgrid Labs", meta: "2 weeks ago" },
          { body: "home sweet home 🌅", tag: "Elmwood Park", meta: "11 days ago" },
          { body: "beach day with the goofball 🐕", tag: "Coldwater Beach", meta: "8 days ago" },
          { body: "sunday long run, done and dusted", tag: "Elmwood Park", meta: "5 days ago" },
          { body: "this is what 6am looks like, apparently", tag: "Elmwood Park", meta: "4 days ago" },
        ],
      },
    ],
  },
  {
    id: "roamly",
    name: "Roamly",
    domain: "roamly.example/athletes/dana.w",
    tagline: "every mile, logged",
    accent: "#2FA84F",
    layout: "activity",
    handle: "dana.w",
    displayName: "Dana W.",
    bio: "Running slowly since 2019.",
    stats: "184 activities this year",
    sections: [
      {
        heading: "Recent activities",
        items: [
          {
            title: "Morning loop",
            subtitle: "5.2 km · 31:04 · 142 bpm",
            meta: "Sep 8, 6:42 AM",
            tag: "Elmwood Park, Brayton",
          },
          {
            title: "Slow jog w/ Biscuit",
            subtitle: "3.1 km · 24:50 · lots of stops",
            meta: "Sep 6, 7:10 AM",
            tag: "Elmwood Park, Brayton",
          },
          {
            title: "Commute home",
            subtitle: "8.4 km · 47:12",
            meta: "Sep 4, 5:55 PM",
            tag: "Helixgrid Labs → Elmwood Park",
          },
          {
            title: "Long run",
            subtitle: "16.0 km · 1:38:22",
            meta: "Sep 1, 8:00 AM",
            tag: "Brayton Riverfront",
          },
        ],
      },
    ],
  },
  {
    id: "devhub",
    name: "DevHub",
    domain: "devhub.example/bisc-wits",
    tagline: "where code lives",
    accent: "#7A5AF8",
    layout: "code",
    handle: "bisc-wits",
    displayName: "bisc-wits",
    bio: "infra scripts, mostly.",
    stats: "Member of: helixgrid-labs",
    sections: [
      {
        heading: "Repositories",
        items: [
          {
            title: "fleet-monitor",
            subtitle: "Python · 12 commits",
            meta: "updated 5 days ago",
            tag: "helixgrid-labs",
          },
          {
            title: "dotfiles",
            subtitle: "Shell · 84 commits",
            meta: "updated 3 weeks ago",
            tag: "public",
          },
        ],
      },
      {
        heading: "Recent commits — dotfiles",
        items: [
          {
            title: "tidy up zsh aliases",
            subtitle: "dw.offgrid@quillmail.com",
            meta: "3 weeks ago",
          },
          {
            title: "add work proxy config",
            subtitle: "d.whitlock@helixgrid-labs.com",
            meta: "2 weeks ago",
          },
          {
            title: "stop committing my shell history, idiot",
            subtitle: "dw.offgrid@quillmail.com",
            meta: "8 days ago",
          },
        ],
      },
    ],
  },
];

export interface Question {
  id: string;
  prompt: string;
  placeholder: string;
}

/** Deliberately the same five fields a helpdesk uses to verify a caller. */
export const questions: Question[] = [
  {
    id: "employer",
    prompt: "Who do they currently work for?",
    placeholder: "company name",
  },
  {
    id: "city",
    prompt: "What city do they live in?",
    placeholder: "city",
  },
  {
    id: "dog",
    prompt: "What is their dog's name?",
    placeholder: "name",
  },
  {
    id: "street",
    prompt: "What street did they grow up on?",
    placeholder: "street name",
  },
  {
    id: "email",
    prompt: "Which personal email address do they commit code with?",
    placeholder: "name@example.com",
  },
];

const acceptedAnswers: Record<string, string[]> = {
  employer: ["helixgrid labs", "helixgrid", "helixgrid labs inc"],
  city: ["brayton"],
  dog: ["biscuit"],
  street: ["ashgrove", "ashgrove street", "ashgrove st", "ashgrove road", "ashgrove rd"],
  email: ["dw.offgrid@quillmail.com"],
};

/**
 * Case and separator insensitive. Addresses skip the separator rewriting so a
 * dot or hyphen inside one survives.
 */
export function normalizeAnswer(value: string): string {
  const trimmed = value.trim().toLowerCase();

  if (trimmed.includes("@")) return trimmed.replace(/\s+/g, "");

  return trimmed
    .replace(/[-_]+/g, " ")
    .replace(/[.,!?]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface AnswerVerdict {
  results: Record<string, boolean>;
  correct: number;
  all: boolean;
}

export function checkAnswers(submitted: Record<string, unknown>): AnswerVerdict {
  const results: Record<string, boolean> = {};

  for (const question of questions) {
    const raw = submitted[question.id];
    const answer = typeof raw === "string" ? normalizeAnswer(raw) : "";
    results[question.id] =
      answer.length > 0 &&
      acceptedAnswers[question.id].map(normalizeAnswer).includes(answer);
  }

  const correct = Object.values(results).filter(Boolean).length;
  return { results, correct, all: correct === questions.length };
}
