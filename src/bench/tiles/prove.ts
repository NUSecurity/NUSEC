import { ProveTile } from "@/bench/types";
import { V_2026_09 } from "./verified";

/**
 * The gates.
 *
 * Project and Skill run on the student's clock. Prove runs on someone else's,
 * which is why these tiles carry window, lead time and cost, and why this is
 * the field that cannot be a printed handout — a PDF of CFP deadlines is wrong
 * within a semester.
 *
 * Tier 0 is not on this list by design. Your own blog and your own repo are
 * what the Project field already produces; Prove takes that artifact through a
 * gate that could have rejected it.
 *
 * Every gate here is one that exists today and that a student can go and find.
 * The spec had NUSEC running its own blog review and selecting lightning talk
 * slots; both are good ideas and neither exists yet, and a tool that lists a
 * gate the club does not actually operate is lying to the room. If the club
 * starts running them, they belong back in here.
 *
 * Costs are the right order of magnitude as of the last review, not quotes.
 * Vendors reprice; check before budgeting. Refreshing these before each
 * semester's registration season is part of the maintainer role.
 */
const proveTiles: ProveTile[] = [
  {
    id: "PRV-PR",
    phrase: "a merged pull request to a project I don't own",
    name: "Merged PR to a project you don't own",
    tier: 1,
    brief:
      "A change you wrote, in someone else's project, that a maintainer chose to merge. The most accessible real gate there is — and 'you don't own it' is the whole point.",
    gatekeeper:
      "A maintainer who closes PRs they don't want and has no obligation to yours",
    consumes_artifacts: ["ART-TOOL", "ART-REPO", "ART-WRITEUP"],
    window: { type: "rolling", note: "Open whenever you are." },
    lead_time: "Days to a couple of months, depending on how alive the project is",
    lead_time_months: 1,
    cost: "Free",
    detail: {
      overview: [
        "Someone who maintains a project you don't own looked at your change and chose to merge it. That's the gate: they could have closed it, and for most of what they receive, they do.",
        "It is the most accessible real proof there is, and the one that scales — you can do this repeatedly, in public, with a permanent record. A GitHub profile with five merged PRs to projects other people use says more to a hiring manager than most certifications.",
        "The route in is almost always: use a thing, hit a real problem with it, fix that problem. Contributions that come from actually using the software get merged; contributions hunting for something to contribute mostly don't.",
      ],
      contexts: [
        {
          label: "Documentation and build fixes",
          body: "The highest-acceptance category by far and the one maintainers are most short of. Following install docs on a clean machine and fixing what's wrong is a genuine contribution.",
        },
        {
          label: "A bug you hit yourself",
          body: "You already have the reproduction and you already care. Open an issue first describing it, and say you're willing to fix it.",
        },
        {
          label: "A good-first-issue",
          body: "Many projects tag these deliberately for newcomers. Lower risk of duplicating work, and maintainers expect to spend review time on you.",
        },
      ],
      examples: [
        "Build a tool you use from source, find the install docs wrong, and fix them.",
        "Fix a crash you hit, with a test that would have caught it.",
        "Add a missing feature flag to a project after opening an issue to check they'd want it.",
      ],
    },
    links: [
      {
        title: "First Contributions — a guided first PR",
        url: "https://firstcontributions.github.io/",
        last_verified: V_2026_09,
      },
      {
        title: "Good First Issue",
        url: "https://goodfirstissue.dev/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Find a project you actually use, build it from source, and fix the smallest real thing you hit.",
    failure_mode:
      "Opening a typo PR to farm a merge. Maintainers know, it teaches you nothing, and it doesn't read as proof to anyone who looks.",
  },
  {
    id: "PRV-BUGREPORT",
    phrase: "a bug report a maintainer accepts and fixes",
    name: "Bug report a maintainer accepted and fixed",
    tier: 1,
    brief:
      "You reported something, they agreed it was real, and it got fixed. You don't have to be able to write the patch — finding and characterizing the bug well is its own skill and its own proof.",
    gatekeeper:
      "A maintainer who closes most reports as invalid, duplicate, or not-a-bug",
    consumes_artifacts: ["ART-DISCLOSURE", "ART-WRITEUP"],
    window: { type: "rolling", note: "Open whenever you are." },
    lead_time: "Weeks to months from report to fix",
    lead_time_months: 2,
    cost: "Free",
    detail: {
      overview: [
        "You reported something, the maintainer agreed it was real, and it got fixed. You don't have to be able to write the patch — finding and characterising a bug well is its own skill and its own proof.",
        "Most reports get closed as invalid, duplicate, or not-a-bug, which is exactly what makes an accepted one count. The difference is almost never how impressive the bug is; it is whether the maintainer could reproduce it from what you wrote.",
      ],
      contexts: [
        {
          label: "An ordinary bug",
          body: "Public issue tracker, reproduction steps, version, environment. Write the reproduction before the prose.",
        },
        {
          label: "A security bug",
          body: "Different route entirely. Check for a security policy or security.txt and use that channel, not the public tracker. Publishing before contacting is how a good finding becomes a bad reputation.",
        },
      ],
      examples: [
        "Report a reproducible crash in a tool you use, with the exact input that triggers it.",
        "Report a logic bug with a minimal test case the maintainer can paste in.",
      ],
    },
    links: [
      {
        title: "How to Report Bugs Effectively",
        url: "https://www.chiark.greenend.org.uk/~sgtatham/bugs.html",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Write the reproduction steps before the prose. If you can't reproduce it on demand, you don't have a report yet.",
    failure_mode:
      "A report with no reproduction, no version, and no environment. Those get closed unread, and reasonably so.",
  },
  {
    id: "PRV-HALLOFFAME",
    phrase: "a place in a vendor's security acknowledgements",
    name: "Named in a vendor's security acknowledgements",
    tier: 1,
    brief:
      "A company published your name for reporting a security issue to them. Most organisations of any size maintain a page like this, and they validate a report before adding anyone to it.",
    detail: {
      overview: [
        "A hall of fame entry, a security acknowledgements page, a thanks line in a release note. The company confirmed your report was real and chose to credit you publicly — which is a gate, because they decline far more reports than they credit.",
        "This is one of the most reachable proofs on the whole list and almost nobody goes looking for it. Plenty of organisations have a security.txt file or a published contact and no bounty programme at all, which means far less competition than a paid bounty platform.",
        "It is also the safest way to practise disclosure. You are working with people who asked to be contacted, on a channel they published, with no money involved to complicate the conversation.",
      ],
      examples: [
        "Find a security.txt on a site you already use and read what it asks for.",
        "Report something real through a published contact, follow up politely, and ask whether they credit reporters.",
        "Turn the report and the correspondence into a writeup once the fix ships.",
      ],
    },
    gatekeeper:
      "The vendor's security team, who validate a report before crediting anyone",
    consumes_artifacts: ["ART-DISCLOSURE", "ART-WRITEUP"],
    window: { type: "rolling", note: "Open whenever you have something to report." },
    lead_time: "Weeks to a few months from report to listing",
    lead_time_months: 2,
    cost: "Free",
    links: [
      {
        title: "security.txt — how to find a company's security contact",
        url: "https://securitytxt.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Check for a security.txt or a published security contact on a service you already use, and read what they ask reporters to do.",
    failure_mode:
      "Reporting something that isn't a vulnerability. Missing headers and a scanner's informational findings get declined, politely, forever.",
  },
  {
    id: "PRV-CTFWRITEUP",
    phrase: "a writeup published on a CTF team's blog",
    name: "Writeup published on a team's blog",
    tier: 1,
    brief:
      "A challenge writeup a CTF team put on their site under their name. Someone with a reputation decided yours was good enough to carry it.",
    gatekeeper: "The team's writeup reviewer, who edits and sometimes declines",
    consumes_artifacts: ["ART-WRITEUP"],
    window: {
      type: "rolling",
      note: "Best within a week of the competition, while anyone still cares.",
    },
    lead_time: "1–2 weeks after the CTF",
    lead_time_months: 1,
    cost: "Free",
    detail: {
      overview: [
        "A CTF team put your writeup on their site, under their name. Someone with a reputation decided yours was good enough to carry it.",
        "The interesting part of a writeup is never the solution — twelve other people posted that. It's the wrong turn you took and how you noticed. That's what makes yours worth reading and what makes a reviewer pick it.",
        "Take notes during the competition, not after. Reconstructing a solve from memory on Tuesday is how writeups die.",
      ],
      examples: [
        "Write up the challenge you nearly didn't solve, including the hour you spent on the wrong theory.",
        "Write up a challenge nobody on your team solved, explaining how far you got and where it broke.",
      ],
    },
    links: [
      {
        title: "CTFtime — upcoming events and team writeups",
        url: "https://ctftime.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Take notes during the CTF, not after. Reconstructing a solve from memory on Tuesday is how writeups die.",
    failure_mode:
      "Writing only the solution. The interesting part is the wrong turn you took and how you noticed — that's what distinguishes your writeup from the other eleven.",
  },
  {
    id: "PRV-REVIEWEDPOST",
    phrase: "a post published somewhere with an editor",
    name: "Post published somewhere with an editor",
    tier: 1,
    brief:
      "A writeup that someone else chose to publish under their name — a security publication, a company engineering blog, a university outlet, an established community site. The editing round is what separates this from posting it yourself.",
    gatekeeper:
      "An editor who rejects submissions and sends the rest back for changes",
    consumes_artifacts: [
      "ART-WRITEUP",
      "ART-REPO",
      "ART-DATASET",
      "ART-THREATMODEL",
      "ART-REFBUILD",
    ],
    window: { type: "rolling", note: "Open whenever you have something finished." },
    lead_time: "2–6 weeks including a round of edits",
    lead_time_months: 1,
    cost: "Free",
    detail: {
      overview: [
        "A writeup that someone else chose to publish under their name — a security publication, a company engineering blog, a university outlet, an established community site. The editing round is what separates this from posting it yourself.",
        "Being sent back for changes is not a setback; it is the thing that makes this count for more than your own blog. An outlet that publishes whatever it receives is Tier 0 wearing a nicer domain.",
        "Pitch before the draft is finished. Two sentences on what you did and why it's interesting is enough, and editors would much rather shape a piece early than reject a finished one.",
      ],
      contexts: [
        {
          label: "A security publication",
          body: "Several take submissions from newcomers and will edit properly. Read what they've published recently before pitching.",
        },
        {
          label: "A company engineering blog",
          body: "If you interned somewhere or contributed to their project, this is more reachable than it sounds.",
        },
        {
          label: "A university outlet",
          body: "Student publications and department blogs have editors and are actively looking for content.",
        },
      ],
      examples: [
        "Pitch a writeup of a project you finished to three outlets that publish that kind of thing.",
        "Turn a CTF or research finding into an article, and take the edit round seriously.",
      ],
    },
    first_move:
      "Find three places that publish the kind of thing you did and read their submission page. Pitch in two sentences — don't wait until the draft is perfect.",
    failure_mode:
      "Taking the edit round personally. Being sent back for changes is exactly what makes this count for more than your own blog.",
  },
  {
    id: "PRV-TEACH",
    phrase: "getting another student to a level they weren't at",
    name: "Get another student to a rung they weren't at",
    tier: 1,
    brief:
      "You ran a session and someone came out able to do a thing they couldn't do before. The gate is whether they can actually do it — which is a harder gate than it sounds, and an honest one.",
    gatekeeper:
      "The learner, who either can do the thing afterwards or cannot",
    consumes_artifacts: ["ART-TEACHING", "ART-REPO", "ART-TOOL", "ART-REFBUILD"],
    window: { type: "club-run", note: "Whenever you can get a room and a person." },
    lead_time: "2–3 weeks to prepare and run",
    lead_time_months: 1,
    cost: "Free",
    detail: {
      overview: [
        "You ran a session and someone came out able to do something they couldn't do before. The gate is whether they can actually do it — which is a harder and more honest test than it sounds.",
        "Teach is the cheapest rung to reach once you can build something, it compounds for everyone around you, and it converts directly into a proof. One learner is enough.",
        "If the learner didn't do the thing with their own hands while you were there, you presented. Presenting is fine; it isn't this.",
      ],
      examples: [
        "Sit with one person while they find their first SQL injection, and stop touching the keyboard.",
        "Run a one-hour session that ends with everyone having a working lab VM.",
        "Teach someone the enumerate-then-escalate loop and watch them do the next box alone.",
      ],
    },
    first_move:
      "Find one person who wants the skill and book a specific hour with them. One learner is enough.",
    failure_mode:
      "Lecturing and calling it teaching. If the learner didn't do the thing with their own hands while you were there, you presented.",
  },
  {
    id: "PRV-WIKI",
    phrase: "a contribution to a maintained community wiki",
    name: "Substantive contribution to a maintained community wiki",
    tier: 1,
    brief:
      "A real addition to a reference other people rely on — a device page, a protocol writeup, a hardware entry. Maintained wikis have editors who revert, which is what makes this a gate.",
    gatekeeper: "Wiki editors, who revert contributions that don't meet the bar",
    consumes_artifacts: ["ART-WRITEUP", "ART-DATASET", "ART-REPO"],
    window: { type: "rolling", note: "Open whenever you are." },
    lead_time: "Days to weeks",
    lead_time_months: 1,
    cost: "Free",
    detail: {
      overview: [
        "A real addition to a reference other people rely on — a device page, a protocol writeup, a hardware entry. Maintained wikis have editors who revert, which is what makes this a gate rather than a text box.",
        "Wikis want verifiable facts with sources. Adding an opinion to a reference gets reverted, correctly.",
      ],
      examples: [
        "Add the device page for something you tore down that had no entry.",
        "Correct an entry you found wrong while working from it, with a source.",
      ],
    },
    first_move:
      "Find the page for the device or protocol you just worked on. If it doesn't exist, that's your contribution.",
    failure_mode:
      "Adding an opinion to a reference. Wikis want verifiable facts with sources; editorializing gets reverted.",
  },
  {
    id: "PRV-TRANSLATE",
    phrase: "a docs or tooling contribution to a project I don't own",
    name: "Documentation or tooling contribution to an OSS project",
    tier: 1,
    brief:
      "Docs, build fixes, CI, packaging, or translation for a project you didn't write. Maintainers are chronically short of this and it reviews just as seriously as a code change.",
    gatekeeper: "The same maintainer who reviews the code PRs",
    consumes_artifacts: ["ART-TEACHING", "ART-REPO", "ART-WRITEUP"],
    window: { type: "rolling", note: "Open whenever you are." },
    lead_time: "Days to weeks",
    lead_time_months: 1,
    cost: "Free",
    detail: {
      overview: [
        "Docs, build fixes, CI, packaging or translation for a project you didn't write. Maintainers are chronically short of all of these, and they review just as seriously as a code change.",
        "This is the highest-acceptance route to a merged contribution and it is genuinely valued — a project with unusable install docs loses more users than one with a minor bug.",
        "Open an issue describing the gap before rewriting anything. Unrequested rewrites get closed even when they're better.",
      ],
      examples: [
        "Follow a project's setup guide on a clean machine and fix everything that's wrong.",
        "Add the CI check the project keeps saying it wants in its issue tracker.",
        "Package something for a distribution that doesn't have it yet.",
      ],
    },
    links: [
      {
        title: "Good First Issue",
        url: "https://goodfirstissue.dev/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Follow a project's install docs exactly as written on a clean machine. Every place they're wrong is a contribution.",
    failure_mode:
      "Rewriting docs to your taste without asking. Open an issue describing the gap first — unrequested rewrites get closed.",
  },
  {
    id: "PRV-CTFPLACE",
    phrase: "a placement in a ranked CTF",
    name: "A team placement in a ranked CTF",
    tier: 2,
    brief:
      "A finish in a competition that ranks teams publicly. Hundreds of these run every year, most are free, and the scoreboard is about as objective as evidence gets.",
    detail: {
      overview: [
        "CTFs run most weekends and the results are permanent and public. A placement is a number you didn't award yourself, measured against everyone else who entered, which makes it unusually easy to point at.",
        "Team events are the accessible route. You don't have to carry the team — solving two challenges in a competition where your team placed well is a real contribution and a real story about working with other people under time pressure.",
        "The categories also map onto the rest of this tool, so a CTF is a fast way to find out which domain you actually enjoy before committing a term to it.",
      ],
      examples: [
        "Find a beginner-friendly event on CTFtime and enter with two other people.",
        "Enter alone, solve what you can, and write up one challenge properly afterwards.",
        "Track which category you solved most in and let that pick your next skill.",
      ],
    },
    gatekeeper: "The scoreboard, and every other team on it",
    consumes_artifacts: ["ART-WRITEUP", "ART-TOOL"],
    window: {
      type: "recurring-cfp",
      note: "Events run most weekends and are listed weeks ahead. Registration is usually open until the start.",
    },
    lead_time: "A weekend, plus whatever practice you do first",
    lead_time_months: 1,
    cost: "Almost always free",
    links: [
      {
        title: "CTFtime — upcoming events",
        url: "https://ctftime.org/event/list/upcoming",
        last_verified: V_2026_09,
      },
      {
        title: "picoCTF — beginner-friendly, runs in a browser",
        url: "https://picoctf.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Pick a beginner-friendly event on CTFtime that's more than two weeks out and register a team.",
    failure_mode:
      "Entering alone with no preparation, solving nothing, and concluding you're not good enough. Go with people, and pick an event rated for beginners.",
  },
  {
    id: "PRV-NCL",
    phrase: "a placement in the National Cyber League",
    name: "National Cyber League placement",
    tier: 2,
    brief:
      "A placement in NCL's individual or team game. Everyone gets a scored, ranked result against thousands of other students — the scouting report is a genuinely portable piece of evidence.",
    gatekeeper: "The scoreboard, and every other competitor on it",
    consumes_artifacts: ["ART-WRITEUP"],
    window: {
      type: "seasonal",
      note: "Runs each spring and fall. Registration closes before the preseason — miss it and you wait a semester.",
    },
    lead_time: "1–3 months including the season",
    lead_time_months: 2,
    cost: "A registration fee, sometimes covered by the club or department",
    detail: {
      overview: [
        "A placement in the National Cyber League's individual or team game. Everyone who competes gets a scored, ranked result against thousands of other students, plus a scouting report you can hand to an employer.",
        "That scouting report is the underrated part — it breaks your performance down by category, so it's evidence about specific skills rather than a single number.",
        "The binding constraint is registration, not ability. The season runs for months; the window to sign up is short and early, and people miss it every year.",
      ],
      examples: [
        "Find this season's registration deadline and put it in your calendar today.",
        "Compete in the individual game, then use the scouting report to pick your next skill tile.",
      ],
    },
    links: [
      {
        title: "National Cyber League",
        url: "https://nationalcyberleague.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Find this season's registration deadline and put it in your calendar today. That date is the binding constraint.",
    failure_mode:
      "Missing registration. The competition is months long; the window to sign up is short and early.",
  },
  {
    id: "PRV-MEETUP",
    phrase: "a talk accepted at a local security meetup",
    name: "Talk accepted at a local security meetup",
    tier: 2,
    brief:
      "A slot at a local meetup — an OWASP chapter, a DEF CON group, a regional security group. Organizers turn people down, rooms are small and friendly, and it's the most reachable speaking gate there is.",
    gatekeeper:
      "Meetup organizers, who have more people wanting slots than they have evenings",
    consumes_artifacts: [
      "ART-WRITEUP",
      "ART-TOOL",
      "ART-REPO",
      "ART-DATASET",
      "ART-VIDEO",
      "ART-TEACHING",
    ],
    window: {
      type: "recurring-cfp",
      note: "Most run monthly and fill their schedule a month or two ahead. Just email the organizer.",
    },
    lead_time: "1–2 months from asking to speaking",
    lead_time_months: 2,
    cost: "Free",
    detail: {
      overview: [
        "A slot at a local meetup — an OWASP chapter, a DEF CON group, a regional security group. Organizers turn people down, the rooms are small and friendly, and it is the most reachable speaking gate there is.",
        "Most organizers are short of speakers, not swamped with them. Going to one as an attendee and asking what they need afterwards works far more often than a cold submission.",
        "Meetups want fifteen minutes about something you actually did. Not a keynote, not a survey of the field.",
      ],
      examples: [
        "Go to the nearest OWASP chapter meeting and ask the organizer what topics they're short of.",
        "Offer a fifteen-minute talk on the project you just finished.",
      ],
    },
    first_move:
      "Find the nearest OWASP chapter or security meetup and go to one as an attendee first. Ask the organizer afterwards what they're short of.",
    failure_mode:
      "Waiting until you have something impressive. Meetups want a fifteen-minute talk about a thing you actually did, not a keynote.",
    links: [
      {
        title: "OWASP chapters",
        url: "https://owasp.org/chapters/",
        last_verified: V_2026_09,
      },
      {
        title: "Cybersecurity groups on Meetup",
        url: "https://www.meetup.com/topics/cybersecurity/",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "PRV-HACKATHON",
    phrase: "a placement at a hackathon",
    name: "A placement at a hackathon",
    tier: 2,
    brief:
      "Judges ranked what you built against everyone else who built something that weekend. Security tracks and prizes are common, and the events are free and frequent.",
    detail: {
      overview: [
        "Hackathons are judged, which makes a placement a selection rather than a participation record. Many have a dedicated security or privacy track, and those tracks are usually far less crowded than the general one.",
        "They also force something this tool otherwise can't: shipping a demo in a fixed window in front of people. That's a genuinely different skill from a term-long project and it shows up in interviews.",
        "Build something small that works completely. A finished small thing beats an ambitious broken one in every judging room there has ever been.",
      ],
      examples: [
        "Find a hackathon with a security or privacy track and go with two other people.",
        "Build a small security tool and make sure the demo works before you polish anything.",
        "Enter with the thing you already half-built, if the rules allow it.",
      ],
    },
    gatekeeper: "Judges, ranking against everyone else who built that weekend",
    consumes_artifacts: ["ART-TOOL", "ART-REPO", "ART-VIDEO"],
    window: {
      type: "seasonal",
      note: "Cluster in autumn and spring. Registration usually opens a month or two ahead and fills.",
    },
    lead_time: "A weekend, plus registration a month or two before",
    lead_time_months: 2,
    cost: "Usually free, sometimes with travel covered",
    links: [
      {
        title: "Major League Hacking — event calendar",
        url: "https://mlh.io/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Find one within travelling distance in the next three months and register before it fills.",
    failure_mode:
      "Starting something too ambitious on Friday night and demoing something broken on Sunday. Scope it to what you can finish by Saturday evening.",
  },
  {
    id: "PRV-CPTC",
    phrase: "a place on the CPTC roster",
    name: "Selected for the CPTC roster",
    tier: 2,
    brief:
      "A place on the Collegiate Penetration Testing Competition team. CPTC is the offensive competition that judges the report as much as the access — closer to consulting work than anything else at this level.",
    gatekeeper: "Team leadership, choosing a roster from more people than fit",
    consumes_artifacts: ["ART-WRITEUP", "ART-TOOL"],
    window: {
      type: "annual",
      note: "Regional qualifiers run in the fall; roster selection happens before them.",
    },
    lead_time: "3–6 months from tryout to competition",
    lead_time_months: 4,
    cost: "Free to compete; travel for regionals and beyond",
    detail: {
      overview: [
        "A place on the Collegiate Penetration Testing Competition team. CPTC is the offensive competition judged on the report as much as the access — closer to consulting work than anything else available at this level.",
        "Because it scores the report and the client briefing heavily, it rewards people who can write and present, not only people who can get shells. That is unusual and it is why it maps well onto actual jobs.",
        "Roster selection happens before the fall qualifiers, so the time to find out who runs it is early.",
      ],
      examples: [
        "Find out who's organizing this year's team and when tryouts are.",
        "Practise writing findings, not just exploiting boxes — that's what's scored.",
      ],
    },
    links: [
      {
        title: "Collegiate Penetration Testing Competition",
        url: "https://cptc.io/",
        last_verified: null,
      },
    ],
    first_move:
      "Find out who runs the team this year and when tryouts are. Ask at a meeting.",
    failure_mode:
      "Preparing only technique. CPTC scores the report and the client briefing heavily — practise writing findings, not just getting shells.",
  },
  {
    id: "PRV-CCDC",
    phrase: "a place on the NUCCDC roster",
    name: "Selected for the NUCCDC roster",
    tier: 2,
    brief:
      "A place on Northeastern's Collegiate Cyber Defense Competition team. Defense under live attack with business tasks piling up — the only competition that teaches what it's like to be the person who has to keep the service running.",
    gatekeeper: "Team captains and coaches, cutting to a fixed roster size",
    consumes_artifacts: ["ART-REFBUILD", "ART-WRITEUP"],
    window: {
      type: "annual",
      note: "Regional qualifiers run in the spring; roster selection and practice start in the fall.",
    },
    lead_time: "4–6 months of practice before qualifiers",
    lead_time_months: 5,
    cost: "Free to compete; travel if you advance",
    detail: {
      overview: [
        "A place on Northeastern's Collegiate Cyber Defense Competition team. Defense under live attack, with business tasks piling up while you're being compromised.",
        "It is the only competition that teaches what it's like to be the person who has to keep the service running while someone else is actively breaking it — which is most of what a real operations job is.",
        "Rosters come out of who has been attending practice through the fall, not who applied in spring.",
      ],
      examples: [
        "Show up to a practice in the fall, before selection.",
        "Get good at one service nobody else wants to own.",
      ],
    },
    links: [
      {
        title: "National CCDC",
        url: "https://www.nationalccdc.org/",
        last_verified: null,
      },
    ],
    first_move:
      "Show up to a practice in the fall. Rosters come out of who has been practising, not who applied.",
    failure_mode:
      "Turning up in spring expecting to try out. Selection follows months of attendance.",
  },
  {
    id: "PRV-BSIDES",
    phrase: "a talk accepted at a regional BSides",
    name: "Talk accepted at a regional BSides",
    tier: 2,
    brief:
      "A community security conference accepted your talk. BSides chapters are genuinely approachable for a student and they reject real submissions every cycle, which is exactly what makes an acceptance mean something.",
    gatekeeper:
      "A program committee that rejects real submissions every cycle",
    consumes_artifacts: [
      "ART-WRITEUP",
      "ART-TOOL",
      "ART-DISCLOSURE",
      "ART-DATASET",
    ],
    window: {
      type: "recurring-cfp",
      note: "CFPs typically open three to five months ahead. Chapters run independently — check each one separately.",
    },
    lead_time: "2–4 months from submission to stage",
    lead_time_months: 3,
    cost: "Free to low",
    detail: {
      overview: [
        "A community security conference accepted your talk. BSides chapters are genuinely approachable for a student and they reject real submissions every cycle, which is exactly what makes an acceptance mean something.",
        "The common mistake is waiting until you have something \"worth\" talking about. Submit the thing you already did. Chapters actively want first-time speakers and several run mentorship for them.",
        "Read a chapter's past talk list before writing the submission. It tells you what they accept far better than the CFP text does.",
      ],
      examples: [
        "Find three chapters with open CFPs and read their past schedules.",
        "Submit the project you finished last term, framed as one finding.",
      ],
    },
    links: [
      {
        title: "BSides global chapter list",
        url: "https://bsides.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Find three chapters with open CFPs. Read their past talk lists before you write a word of the submission.",
    failure_mode:
      "Waiting until you have something 'worth' talking about. Submit the thing you already did.",
  },
  {
    id: "PRV-BOUNTYPAID",
    phrase: "a paid bug bounty",
    name: "A paid bug bounty",
    tier: 2,
    brief:
      "A company paid you for a vulnerability report. A triage team validated it, rated it, and decided it was worth money — after closing most of what they receive as duplicate or informative.",
    detail: {
      overview: [
        "Payment is the gate. Triage teams reject the overwhelming majority of submissions, so a paid report means professionals looked at your work and agreed it was both real and new.",
        "The amount does not matter. A small bounty on a small programme is the same proof as a large one and considerably easier to get — newer programmes have far less picked-over surface than the famous ones.",
        "Everything about scope from the bug bounty target applies here and applies harder, because money makes people careless about boundaries.",
      ],
      examples: [
        "Pick one newly launched programme and read its entire scope page before touching anything.",
        "Spend a week on a single asset rather than a day on twenty.",
        "Write the report as though the triager has never seen the application, because they probably haven't.",
      ],
    },
    gatekeeper:
      "A triage team that closes most submissions as duplicate, informative, or out of scope",
    consumes_artifacts: ["ART-DISCLOSURE", "ART-WRITEUP"],
    window: { type: "rolling", note: "Programmes run continuously; scopes change without notice." },
    lead_time: "Weeks to months, and highly uncertain",
    lead_time_months: 3,
    cost: "Free to enter",
    links: [
      {
        title: "HackerOne programmes",
        url: "https://hackerone.com/opportunities/all",
        last_verified: V_2026_09,
      },
      {
        title: "Bugcrowd engagements",
        url: "https://bugcrowd.com/engagements",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Read one programme's full scope and rules page and write down what's in and what's out before testing anything.",
    failure_mode:
      "Treating this as a reliable plan. Bounties are genuinely uncertain — make it the proof on a bench whose project stands on its own.",
  },
  {
    id: "PRV-CVE",
    phrase: "a CVE assigned for something I found",
    name: "A CVE assigned for something you found",
    tier: 2,
    brief:
      "An identifier issued for a vulnerability you reported. A numbering authority reviewed it and agreed it qualifies — they decline requests that don't.",
    detail: {
      overview: [
        "A CVE is a permanent, citable record with your finding attached to it. It is the clearest possible evidence that you found something real, and it travels further than almost anything else on this list.",
        "The route is ordinary: find something in software people use, report it responsibly to the vendor or to a numbering authority, and work through the process. Most first CVEs come from small or unmaintained open-source projects rather than from anything famous.",
        "Not every valid bug qualifies, and that's fine. Requesting one for something that doesn't meet the bar wastes a reviewer's time and teaches you nothing.",
      ],
      examples: [
        "Find a vulnerability in a small open-source project you already use.",
        "Report it through the project's security policy and ask about CVE assignment.",
        "Write the advisory yourself — clear impact, affected versions, and the fix.",
      ],
    },
    gatekeeper:
      "A CVE Numbering Authority, who reject requests that don't meet the bar",
    consumes_artifacts: ["ART-DISCLOSURE", "ART-WRITEUP"],
    window: {
      type: "rolling",
      note: "Open whenever you have a qualifying finding, though assignment can take a while.",
    },
    lead_time: "1–6 months from report to publication",
    lead_time_months: 4,
    cost: "Free",
    links: [
      {
        title: "CVE Program — requesting an identifier",
        url: "https://www.cve.org/ResourcesSupport/ReportRequest",
        last_verified: null,
      },
    ],
    first_move:
      "Read a published advisory for a project like the one you're looking at, so you know what the finished thing looks like.",
    failure_mode:
      "Requesting one for a finding the vendor hasn't confirmed, or for something that isn't a vulnerability. Get the vendor's agreement first.",
  },
  {
    id: "PRV-MAINTAINER",
    phrase: "commit or triage rights on a project I don't own",
    name: "Commit or triage rights on a project you don't own",
    tier: 2,
    brief:
      "A project gave you the ability to merge, label or close things. Someone decided to trust you with their repository, which is a far higher bar than a single merged change.",
    detail: {
      overview: [
        "This is what repeated contribution turns into. Maintainers hand out triage and commit rights to people who keep showing up, review well, and don't break things — and it is a genuinely selective decision because the cost of getting it wrong is theirs.",
        "It is also one of the strongest signals available to a student, because it says other engineers chose to work with you over time rather than that you completed something once.",
        "The path is unglamorous: contribute repeatedly to one project rather than once to five, and help other people's contributions land as well as your own.",
      ],
      examples: [
        "Pick one project you use and contribute to it three times over a term.",
        "Start reviewing other people's pull requests and issues, helpfully.",
        "Ask the maintainers what would be most useful, then do that.",
      ],
    },
    gatekeeper:
      "Existing maintainers, deciding whether to trust you with their repository",
    consumes_artifacts: ["ART-TOOL", "ART-REPO", "ART-TEACHING"],
    window: { type: "rolling", note: "Earned over months of contribution, not applied for." },
    lead_time: "3–12 months of consistent contribution",
    lead_time_months: 6,
    cost: "Free",
    links: [
      {
        title: "Good First Issue",
        url: "https://goodfirstissue.dev/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Pick one project — not five — and make your second contribution to it.",
    failure_mode:
      "Asking for the rights. They get offered to people who were already doing the work.",
  },
  {
    id: "PRV-POSTER",
    phrase: "an accepted poster session",
    name: "Accepted poster session",
    tier: 2,
    brief:
      "A poster accepted at a research expo or conference poster track. Lower bar than a paper, real review, and you spend the session explaining your work to people who ask hard questions.",
    gatekeeper: "A review committee that declines submissions",
    consumes_artifacts: ["ART-DATASET", "ART-WRITEUP", "ART-REPO"],
    window: {
      type: "annual",
      note: "University research expos run annually with a fixed submission deadline; conference poster tracks follow their own CFP.",
    },
    lead_time: "2–4 months",
    lead_time_months: 3,
    cost: "Free to low; printing a poster costs something",
    detail: {
      overview: [
        "A poster accepted at a research expo or a conference poster track. Lower bar than a paper, real review, and you spend the session explaining your work to people who ask hard questions.",
        "The abstract is most of the work. Posters are read standing up from three feet away, so one figure and one finding beats a paper in small type.",
      ],
      examples: [
        "Find your university's research expo deadline and write the abstract.",
        "Turn a dataset you collected into one figure and one claim.",
      ],
    },
    first_move:
      "Find this year's submission deadline and write the abstract. The abstract is most of the work.",
    failure_mode:
      "A poster that's a paper in small type. Posters are read standing up from three feet away — one figure, one finding.",
  },
  {
    id: "PRV-COHORT",
    phrase: "a place in a selective program or cohort",
    name: "Selected for a named program or cohort",
    tier: 2,
    brief:
      "Accepted into a selective program — a scholarship, a fellowship, a summer school, a mentorship cohort. Somebody chose you from a pool, and that selection travels.",
    gatekeeper: "A selection committee taking a fraction of applicants",
    consumes_artifacts: ["ART-REPO", "ART-WRITEUP", "ART-TOOL", "ART-DATASET"],
    window: {
      type: "annual",
      note: "Application windows are usually a single fixed period per year, often closing months before the program starts.",
    },
    lead_time: "3–8 months from application to start",
    lead_time_months: 5,
    cost: "Usually free to apply; many are funded",
    detail: {
      overview: [
        "Accepted into a selective program — a scholarship, a fellowship, a summer school, a mentorship cohort. Somebody chose you from a pool, and that selection travels with you.",
        "This is almost entirely a calendar problem. Application windows are usually a single fixed period per year and close months before the program runs, so people find the right program two weeks too late.",
      ],
      examples: [
        "Find three programs you'd want and write their deadlines down now.",
        "Ask someone who got into one what their application actually said.",
      ],
    },
    first_move:
      "Find three programs and write their deadlines down. Most close far earlier than people expect.",
    failure_mode:
      "Finding the program two weeks after applications closed. This is entirely a calendar problem — solve it with a calendar.",
  },
  {
    id: "PRV-VILLAGE",
    phrase: "a workshop or village slot at a conference",
    name: "Conference village staff or workshop slot",
    tier: 2,
    brief:
      "Selected to run a workshop or staff a village at a conference. Lower profile than a main-stage talk and often more useful — you spend the weekend teaching people directly.",
    gatekeeper: "Village organizers, who take far fewer people than apply",
    consumes_artifacts: ["ART-TEACHING", "ART-TOOL", "ART-REPO"],
    window: {
      type: "recurring-cfp",
      note: "Villages run their own calls, usually a few months before the conference and separately from the main CFP.",
    },
    lead_time: "2–5 months",
    lead_time_months: 4,
    cost: "Travel, sometimes offset for staff",
    detail: {
      overview: [
        "Selected to run a workshop or staff a village at a conference. Lower profile than a main-stage talk and often more useful — you spend the weekend teaching people directly and meeting everyone who works in that niche.",
        "Villages run their own calls, separately from the main conference CFP and usually a few months ahead. Smaller regional villages take newcomers and teach you more than the biggest one will.",
      ],
      examples: [
        "Find the village that matches what you already do and email whoever runs it.",
        "Offer to help staff before you offer to run a workshop.",
      ],
    },
    links: [
      {
        title: "DEF CON — villages and calls",
        url: "https://defcon.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Pick the village matching what you already do and find who runs it. Most publish a call or an email address.",
    failure_mode:
      "Applying to the biggest village at the biggest conference first. Smaller regional villages take newcomers and teach you more.",
  },
  {
    id: "PRV-ECTF",
    phrase: "a place on the MITRE eCTF team",
    name: "Selected for the MITRE eCTF team",
    tier: 2,
    brief:
      "A place on the MITRE Embedded CTF team. Months of designing a secure embedded system and then attacking everyone else's — the closest thing to real product security work available to a student.",
    gatekeeper: "Team leadership, selecting a roster",
    consumes_artifacts: ["ART-REPO", "ART-WRITEUP", "ART-TOOL"],
    window: {
      type: "annual",
      note: "Runs roughly January to April. Teams form in the fall, before the competition opens.",
    },
    lead_time: "4–6 months including the competition",
    lead_time_months: 5,
    cost: "Free; hardware usually supplied",
    detail: {
      overview: [
        "A place on the MITRE Embedded CTF team. Months of designing a secure embedded system and then attacking everyone else's — the closest thing to real product security work available to a student.",
        "It is a genuine term-long commitment and it assumes embedded experience. If that's not you yet, a dev board project first is the honest path.",
        "Teams form in the fall. By January it has already started.",
      ],
      examples: [
        "Ask in the fall who's organizing this year's team.",
        "Do an embedded project first so you arrive useful.",
      ],
    },
    links: [
      {
        title: "MITRE Embedded CTF",
        url: "https://ectf.mitre.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Ask who is organizing this year's team in the fall — by January it has already started.",
    failure_mode:
      "Joining with no embedded experience and no time. This one is a real term-long commitment; do a dev board project first.",
  },
  {
    id: "PRV-GOOGLECYBER",
    phrase: "the Google Cybersecurity Certificate",
    name: "Google Cybersecurity Certificate",
    tier: 3,
    brief:
      "A structured beginner course covering the fundamentals. Worth being clear about what it is: a training course, not a proctored exam certification.",
    detail: {
      overview: [
        "Good at what it's for — giving someone with no background an ordered path through the basics, with hands-on exercises, at low cost. If you're starting from nothing it will save you a lot of wandering.",
        "It is not equivalent to Security+ or anything else with a proctored exam, and nobody in hiring treats it as though it were. It sits at the bottom of this tier because it's a completion rather than a test you can fail — take it as scaffolding, then sit a real exam.",
        "Often free through a subscription trial or a university arrangement. Check before paying.",
      ],
      examples: [
        "Use it as a structured syllabus, then book Security+ or ISC2 CC.",
        "Check whether your university or a trial gives you free access.",
        "Do the hands-on portions properly rather than skipping to the quizzes.",
      ],
    },
    gatekeeper:
      "Course completion requirements — lighter than a proctored exam, and honest about it",
    consumes_artifacts: [],
    window: { type: "rolling", note: "Self-paced, start whenever." },
    lead_time: "2–6 months part-time",
    lead_time_months: 3,
    cost: "Low monthly subscription; often free through a trial or a university",
    links: [
      {
        title: "Google Cybersecurity Professional Certificate",
        url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Check whether you can access it free before paying for a subscription.",
    failure_mode:
      "Treating it as a substitute for a real certification. It's a course — finish it and then go and sit an exam.",
  },
  {
    id: "PRV-ISC2CC",
    phrase: "the ISC2 Certified in Cybersecurity",
    name: "ISC2 Certified in Cybersecurity (CC)",
    tier: 3,
    brief:
      "An entry-level certification from ISC2, aimed at people starting out. Historically the most affordable route to a recognised credential, and frequently free for students through their programme.",
    detail: {
      overview: [
        "The most reachable formal credential on this list. It covers the fundamentals broadly and exists specifically for people who don't have experience yet, which is a rare and useful thing in a field where most certifications assume years of it.",
        "Check their free-for-students or candidate programme before paying anything — the cost has often been zero for the exam and the training material, which changes the calculation entirely.",
        "It won't teach you to do the job. It gets a recognisable name onto a résumé that doesn't have one yet, which for a first internship is a real problem it solves.",
      ],
      examples: [
        "Check whether their free candidate or student programme is currently open.",
        "Take a practice exam cold to find out how much study you actually need.",
        "Book the date before buying study material.",
      ],
    },
    gatekeeper: "A proctored exam you can fail",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Book whenever you're ready. Check the current free-for-newcomers programme before paying.",
    },
    lead_time: "3–8 weeks of study",
    lead_time_months: 2,
    cost: "Low, and often free for students through their programme",
    links: [
      {
        title: "ISC2 Certified in Cybersecurity",
        url: "https://www.isc2.org/certifications/cc",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Check whether the free programme is open before you spend anything at all.",
    failure_mode:
      "Paying full price without checking for the student or candidate programme first.",
  },
  {
    id: "PRV-SECPLUS",
    phrase: "Security+",
    name: "Security+",
    tier: 3,
    brief:
      "CompTIA's entry-level certification. Broad and shallow by design, and the one that most reliably clears an HR filter for a first security role — including for government-adjacent work where it's often a hard requirement.",
    gatekeeper: "A proctored exam you can fail",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Book whenever you're ready. Check which exam version is current — CompTIA retires versions on a schedule.",
    },
    lead_time: "1–3 months of study",
    lead_time_months: 2,
    cost: "Voucher in the mid hundreds; student discounts and bundles exist",
    detail: {
      overview: [
        "CompTIA's entry-level certification. Broad and shallow by design, and the one that most reliably clears an HR filter for a first security role — including government-adjacent work where it is often a hard requirement.",
        "It will not teach you to do the job. It will get your résumé past the filter that sits in front of the job, which is a different and also real problem.",
        "Book the exam first. The date is what makes the studying happen; studying indefinitely without a date is the standard way this doesn't get done.",
      ],
      examples: [
        "Take a free practice exam cold today and let the score tell you whether this is six weeks or three months.",
        "Book the date before you buy any study material.",
      ],
    },
    links: [
      {
        title: "CompTIA Security+",
        url: "https://www.comptia.org/certifications/security",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Take a free practice exam cold, today. Your score tells you whether this is six weeks or three months.",
    failure_mode:
      "Studying indefinitely without booking. Book the exam first — the date is what makes the studying happen.",
  },
  {
    id: "PRV-NETPLUS",
    phrase: "Network+",
    name: "Network+",
    tier: 3,
    brief:
      "CompTIA's networking certification. Entry level and similar in difficulty to Security+, covering the fundamentals that most security work quietly assumes you already have.",
    detail: {
      overview: [
        "Networking is the thing people skip and then keep hitting. A large share of confusion in offensive and defensive work traces back to not really understanding routing, segmentation or what a protocol is doing on the wire.",
        "As a certification it's most useful either as a stepping stone before Security+ if you're coming in with no IT background, or alongside it if you want infrastructure-leaning roles.",
        "If you already read captures comfortably, skip it and spend the money on something practical.",
      ],
      examples: [
        "Take a practice exam cold — if you score well, skip it and do something else.",
        "Pair the studying with real captures so the layers mean something.",
        "Build a small segmented network while you study it.",
      ],
    },
    gatekeeper: "A proctored exam you can fail",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Book whenever. Check which exam version is current.",
    },
    lead_time: "1–3 months of study",
    lead_time_months: 2,
    cost: "Voucher in the mid hundreds; student discounts exist",
    links: [
      {
        title: "CompTIA Network+",
        url: "https://www.comptia.org/certifications/network",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Take a free practice exam cold. If you already know this material, that's a few hundred dollars saved.",
    failure_mode:
      "Collecting it as a box to tick when you already understand networking. It's for filling a real gap, not for the list.",
  },
  {
    id: "PRV-AWSCLF",
    phrase: "the AWS Cloud Practitioner certification",
    name: "AWS Cloud Practitioner",
    tier: 3,
    brief:
      "AWS's entry-level certification. Cloud literacy rather than cloud security — how AWS works, what the services are, how billing and the shared responsibility model fit together.",
    detail: {
      overview: [
        "Not a security certification, and worth being honest about that. It's the foundation underneath one: you cannot secure an environment whose services you can't name.",
        "It's cheap, quick, and it makes the AWS Security Specialty materially easier afterwards. For someone with no cloud background it's a sensible first step rather than a detour.",
        "Everything on it can be practised free-tier in your own account, which makes the studying productive rather than abstract.",
      ],
      examples: [
        "Build one of each major service in your own account while you study.",
        "Learn the shared responsibility model properly — it's the whole basis of cloud security.",
        "Go straight on to the Security Specialty material afterwards.",
      ],
    },
    gatekeeper: "A proctored exam you can fail",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Book whenever. AWS revises exam content regularly — use the current guide.",
    },
    lead_time: "3–8 weeks of study",
    lead_time_months: 2,
    cost: "Around a hundred dollars; promotions and free retakes come around",
    links: [
      {
        title: "AWS Certified Cloud Practitioner",
        url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Create a free-tier account with a billing alarm, then learn each service by building one.",
    failure_mode:
      "Presenting it as a security credential. It's literacy — say so, and pair it with something that isn't.",
  },
  {
    id: "PRV-EJPT",
    phrase: "the eJPT",
    name: "eJPT",
    tier: 3,
    brief:
      "INE's entry-level practical pentesting certification. Fully hands-on — you compromise a real network in a lab rather than answering questions about it — and it's the gentlest real practical exam in the field.",
    gatekeeper: "A practical exam with a pass mark you can miss",
    consumes_artifacts: [],
    window: { type: "rolling", note: "Book whenever you're ready." },
    lead_time: "1–3 months of study",
    lead_time_months: 2,
    cost: "Low to mid hundreds, usually bundled with course access",
    detail: {
      overview: [
        "INE's entry-level practical certification. Fully hands-on — you compromise a real network in a lab rather than answering questions about it — and it's the gentlest real practical exam in the field.",
        "Good value as a first practical certification, and a sensible waypoint if OSCP is the eventual goal but is too much money and too much difficulty right now.",
        "It punishes incomplete enumeration much harder than it punishes not knowing an exploit.",
      ],
      examples: [
        "Do a handful of easy boot2root boxes first; if those are comfortable you're close.",
        "Practise enumerating fully before you practise exploiting.",
      ],
    },
    links: [
      {
        title: "INE — eJPT certification",
        url: "https://security.ine.com/certifications/ejpt-certification/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Do a handful of easy boot2root boxes first. If those are comfortable, you're close.",
    failure_mode:
      "Skipping enumeration practice. The exam punishes an incomplete sweep harder than it punishes not knowing an exploit.",
  },
  {
    id: "PRV-CYSA",
    phrase: "CySA+",
    name: "CySA+",
    tier: 3,
    brief:
      "CompTIA's defensive analyst certification. The natural step after Security+ if detection, monitoring and response are the direction you want.",
    detail: {
      overview: [
        "Where Security+ is broad and general, CySA+ is specifically about analyst work — reading telemetry, triaging alerts, responding to incidents. It maps directly onto SOC and detection roles, which is where a lot of first security jobs actually are.",
        "It also pairs unusually well with the defensive side of this tool. Building detections, working published log sets and running investigations is exactly the material the exam covers, so the project work and the studying reinforce each other.",
        "Do the hands-on work alongside it. The exam asks scenario questions that punish people who only read.",
      ],
      examples: [
        "Work a published log set into a timeline while you study the response material.",
        "Write detections for a handful of ATT&CK techniques as revision.",
        "Take a practice exam cold first to size the study.",
      ],
    },
    gatekeeper: "A proctored exam you can fail",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Book whenever. Check which exam version is current — CompTIA retires versions on a schedule.",
    },
    lead_time: "2–4 months of study",
    lead_time_months: 3,
    cost: "Voucher in the mid hundreds; student discounts exist",
    links: [
      {
        title: "CompTIA CySA+",
        url: "https://www.comptia.org/certifications/cybersecurity-analyst",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Take a free practice exam cold and let the score tell you how long this is.",
    failure_mode:
      "Studying it as theory. The scenario questions assume you've actually looked at logs.",
  },
  {
    id: "PRV-PENTESTPLUS",
    phrase: "PenTest+",
    name: "PenTest+",
    tier: 3,
    brief:
      "CompTIA's offensive certification, sitting alongside Security+ in the same family. Covers the planning, scoping and reporting side as well as the technique.",
    detail: {
      overview: [
        "Vendor-neutral and exam-based rather than hands-on, which makes it easier than the practical offensive certifications and more recognisable to HR systems that already know CompTIA.",
        "It carries real weight in one specific place: it's named as qualifying applied learning for the VICEROY DECREE programme, alongside Security+. If you're on that pathway, this is the box it ticks.",
        "If you want to prove you can actually do the work rather than pass an exam about it, eJPT or PNPT demonstrate more. This one is about recognition and pathway requirements.",
      ],
      examples: [
        "Take a practice exam cold to size the study.",
        "Pair it with actual boxes so the scenario questions aren't abstract.",
        "Check whether a scholarship pathway you're on names it specifically.",
      ],
    },
    gatekeeper: "A proctored exam you can fail",
    consumes_artifacts: ["ART-WRITEUP"],
    window: {
      type: "rolling",
      note: "Book whenever. Check which exam version is current — CompTIA retires versions on a schedule.",
    },
    lead_time: "2–4 months of study",
    lead_time_months: 3,
    cost: "Voucher in the mid hundreds; student discounts exist",
    links: [
      {
        title: "CompTIA PenTest+",
        url: "https://www.comptia.org/certifications/pentest",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Do a handful of easy boxes first — the exam's scenarios make far more sense if you've done the thing.",
    failure_mode:
      "Taking it instead of doing any practical work. An exam-only offensive certification with no boxes behind it is thin in an interview.",
  },
  {
    id: "PRV-BLUETEAM",
    phrase: "a practical defensive certification",
    name: "A practical defensive certification",
    tier: 3,
    brief:
      "A hands-on blue-team credential — you investigate a real scenario in a lab rather than answering questions about one. Blue Team Level 1 is the best-known example and it's priced within reach.",
    detail: {
      overview: [
        "Practical defensive certifications are the counterpart to the eJPT and OSCP on the offensive side, and there are far fewer of them. That scarcity works in your favour: very few applicants for defensive roles can show a hands-on credential.",
        "The exam format is an investigation — you're given an incident and you have to work it and report what happened. That's the actual job, which makes the preparation directly useful rather than exam-shaped.",
        "Providers and product names in this space change; check the current offering and price before committing, and confirm what the exam actually involves.",
      ],
      examples: [
        "Work published memory images and log sets first to see whether this is the direction you want.",
        "Check the current syllabus and price before buying anything.",
        "Practise writing the investigation up, not just reaching the answer.",
      ],
    },
    gatekeeper: "A practical exam with an investigation you can fail",
    consumes_artifacts: ["ART-WRITEUP"],
    window: {
      type: "rolling",
      note: "Book whenever. Course access is usually time-boxed once purchased.",
    },
    lead_time: "2–4 months of study",
    lead_time_months: 3,
    cost: "Low to mid hundreds, usually bundled with training",
    links: [
      {
        title: "Security Blue Team (now trading as Centri) — defensive certifications",
        url: "https://www.securityblue.team/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Do a couple of free CyberDefenders cases first and see whether the work appeals before spending money.",
    failure_mode:
      "Buying a defensive certification before you've ever worked a case. The free practice will tell you whether you want this.",
  },
  {
    id: "PRV-CLOUDSEC",
    phrase: "a cloud provider's security certification",
    name: "A cloud provider's security certification",
    tier: 3,
    brief:
      "AWS Security Specialty, Azure AZ-500, or the Google equivalent. Vendor certifications with real weight, priced like a normal exam rather than a SANS course.",
    gatekeeper: "A proctored vendor exam",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Book whenever. Vendors revise exam content regularly — check the current blueprint, not last year's.",
    },
    lead_time: "2–4 months",
    lead_time_months: 3,
    cost: "Low hundreds; student and free-retake promotions come around",
    detail: {
      overview: [
        "AWS Security Specialty, Azure AZ-500, or the Google equivalent. Vendor certifications with real weight, priced like a normal exam rather than a SANS course.",
        "Cloud security demand substantially exceeds supply, and these are the credentials hiring managers recognise. They also map onto work you can actually do in a free-tier account, which makes the studying productive rather than abstract.",
        "These exams ask scenario questions that punish people who never touched the console. Build things in your own account while you study.",
      ],
      examples: [
        "Pick the provider you already have an account with and download its current exam guide.",
        "Build and break each service the guide lists, in your own account, as you study it.",
      ],
    },
    links: [
      {
        title: "AWS Certified Security — Specialty",
        url: "https://aws.amazon.com/certification/certified-security-specialty/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Pick the provider you already have an account with and download its current exam guide.",
    failure_mode:
      "Studying the exam guide without touching the console. These exams ask scenario questions that punish people who never built anything.",
  },
  {
    id: "PRV-CCNA",
    phrase: "the CCNA",
    name: "CCNA",
    tier: 3,
    brief:
      "Cisco's networking certification. Deeper and more practical than Network+, with real configuration rather than multiple choice about concepts.",
    detail: {
      overview: [
        "Harder than Network+ and more respected for it, particularly anywhere with real network infrastructure. You come out able to configure equipment rather than describe it, which is a meaningful difference.",
        "For security specifically it's most valuable if you're heading toward network security, infrastructure or anything touching segmentation and access control at the network layer.",
        "The lab work is the point. Free emulators mean you can practise the configuration without buying any hardware.",
      ],
      examples: [
        "Build the topologies in an emulator rather than reading about them.",
        "Configure segmentation, then test whether it actually holds.",
        "Pair it with packet captures so you see what your configuration produces.",
      ],
    },
    gatekeeper: "A proctored exam you can fail",
    consumes_artifacts: ["ART-REFBUILD"],
    window: {
      type: "rolling",
      note: "Book whenever. Cisco revises the exam blueprint periodically — check the current one.",
    },
    lead_time: "3–6 months of study",
    lead_time_months: 4,
    cost: "Low hundreds for the exam, plus study material",
    links: [
      {
        title: "Cisco CCNA",
        url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Install a network emulator and build a two-router topology before you buy any study material.",
    failure_mode:
      "Reading about configuration instead of doing it. This exam rewards hands-on lab time more than reading.",
  },
  {
    id: "PRV-PNPT",
    phrase: "the PNPT",
    name: "PNPT",
    tier: 3,
    brief:
      "TCM Security's practical pentesting certification — a full engagement against a domain, plus a professional report and a debrief. Considerably cheaper than the OSCP and it includes the reporting.",
    detail: {
      overview: [
        "A five-day practical exam against an Active Directory environment, ending in a report and a live debrief. The debrief is the unusual part and the valuable one: you explain your findings to someone who asks questions, which is the thing interviews actually test.",
        "It sits between the eJPT and the OSCP in difficulty and well below the OSCP in price, which makes it a sensible target for a student who wants a serious practical credential without spending four figures.",
        "It assumes Active Directory, so the Windows domain lab target pairs with it directly.",
      ],
      examples: [
        "Build a small AD lab and practise the attack paths before booking.",
        "Practise writing the report and delivering the debrief out loud.",
        "Do the eJPT first if practical exams are new to you.",
      ],
    },
    gatekeeper:
      "A five-day practical exam, a report, and a live debrief you can fail",
    consumes_artifacts: ["ART-WRITEUP"],
    window: {
      type: "rolling",
      note: "Book whenever. Voucher validity is time-boxed once purchased.",
    },
    lead_time: "3–6 months of preparation",
    lead_time_months: 4,
    cost: "Low four figures or less, usually bundled with the courses",
    links: [
      {
        title: "TCM Security — PNPT",
        url: "https://certifications.tcm-sec.com/pnpt/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Stand up a small Active Directory lab and get comfortable in it before you buy anything.",
    failure_mode:
      "Neglecting the report and the debrief. Both are scored, and both are where people are surprised.",
  },
  {
    id: "PRV-OSCP",
    phrase: "the OSCP",
    name: "OSCP",
    tier: 3,
    brief:
      "OffSec's practical pentesting certification: a 24-hour hands-on exam plus a professional report. Expensive and genuinely hard, and it's the one that still moves hiring conversations.",
    gatekeeper: "A 24-hour practical exam with a high failure rate",
    consumes_artifacts: ["ART-WRITEUP"],
    window: {
      type: "rolling",
      note: "Course access is time-boxed once you buy it; schedule the exam before the access window closes.",
    },
    lead_time: "4–8 months of serious preparation",
    lead_time_months: 6,
    cost: "Four figures for the course-and-exam bundle",
    detail: {
      overview: [
        "OffSec's practical certification: a 24-hour hands-on exam plus a professional report. Expensive and genuinely hard, and it still moves hiring conversations in a way few certifications do.",
        "The two standard mistakes are buying it too early and neglecting the report. People fail on the writeup after passing the machines, because the report is scored and they treated it as paperwork.",
        "Before spending anything, do ten easy boxes with no walkthroughs. If that's a grind, build the foundation first — this is a lot of money to spend early.",
      ],
      examples: [
        "Do ten easy boxes unaided and see how it feels before you spend a penny.",
        "Write a full report for one of them, to the standard the exam expects.",
      ],
    },
    links: [
      {
        title: "OffSec PEN-200 / OSCP",
        url: "https://www.offsec.com/courses/pen-200/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Before spending anything, do ten easy boxes with no walkthroughs. If that's a grind, build the foundation first — this is a lot of money to spend early.",
    failure_mode:
      "Buying it too early. Also: neglecting the report. People fail on the writeup after passing the machines.",
  },
  {
    id: "PRV-GCIH",
    phrase: "the GCIH",
    name: "GCIH",
    tier: 3,
    brief:
      "GIAC's incident handling certification. Well regarded in defensive and response work — and expensive enough that it's usually an employer-funded certification rather than a student one.",
    gatekeeper: "A proctored GIAC exam",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Attempts are tied to a time window once purchased.",
    },
    lead_time: "3–6 months",
    lead_time_months: 4,
    cost: "Very high — four figures standalone, far more with the SANS course",
    detail: {
      overview: [
        "GIAC's incident handling certification. Well regarded in defensive and response work, and expensive enough that it is normally employer-funded rather than student-funded.",
        "Self-funding this as an undergraduate is almost always the wrong allocation of your money. Look for work-study, employer sponsorship or a SANS scholarship programme before anything else.",
      ],
      examples: [
        "Look for funding routes before you look at the syllabus.",
        "Do the free DFIR practice first and confirm you want this specialisation.",
      ],
    },
    links: [
      {
        title: "GIAC GCIH",
        url: "https://www.giac.org/certifications/certified-incident-handler-gcih/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Look for funding before anything else: work study, employer sponsorship, or a SANS scholarship programme. Paying retail as a student rarely makes sense.",
    failure_mode:
      "Self-funding this as an undergraduate. Almost always the wrong allocation of your money at this stage.",
  },
  {
    id: "PRV-GCFA",
    phrase: "the GCFA",
    name: "GCFA",
    tier: 3,
    brief:
      "GIAC's forensic analyst certification. The recognized credential for deep DFIR work, with the same funding problem as GCIH.",
    gatekeeper: "A proctored GIAC exam",
    consumes_artifacts: [],
    window: {
      type: "rolling",
      note: "Attempts are tied to a time window once purchased.",
    },
    lead_time: "3–6 months",
    lead_time_months: 4,
    cost: "Very high — four figures standalone, far more with the SANS course",
    detail: {
      overview: [
        "GIAC's forensic analyst certification. The recognised credential for deep DFIR work, with the same funding problem as GCIH.",
        "A GCFA with no case experience reads as a purchase rather than an achievement. Do the work first — published images, practice cases, a writeup — and the certification then confirms something real.",
      ],
      examples: [
        "Work through published memory and disk images first.",
        "Find out whether an employer or the department would fund it.",
      ],
    },
    links: [
      {
        title: "GIAC GCFA",
        url: "https://www.giac.org/certifications/certified-forensic-analyst-gcfa/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Do the free and cheap DFIR practice first and confirm you want this specialization before anyone spends this much.",
    failure_mode:
      "Certifying before you've done the work. A GCFA with no case experience reads as a purchase rather than an achievement.",
  },
  {
    id: "PRV-SFS",
    phrase: "a CyberCorps Scholarship for Service place",
    name: "CyberCorps Scholarship for Service (SFS)",
    tier: 3,
    brief:
      "A federal scholarship that pays for your cybersecurity education in exchange for working in government afterwards. Full tuition, a substantial annual stipend, professional development funds, and advising.",
    detail: {
      overview: [
        "The most valuable single thing on this list for anyone open to government work. Full tuition, a stipend, professional development funding, and a route into agencies that are otherwise hard to enter as a new graduate.",
        "The commitment is symmetrical: you serve with an approved SFS employer for the same amount of time the scholarship supported you. Approved employers span federal executive branch agencies, state, local and tribal agencies, national laboratories, academic institutions and FFRDCs — a much wider list than people assume.",
        "Northeastern participates, and William Robertson is the primary PI here, which means there is someone on campus to actually ask.",
      ],
      examples: [
        "Read the eligibility requirements and check them against your own situation honestly.",
        "Email the campus PI with a specific question rather than a general expression of interest.",
        "Ask a current or former scholar what their application actually said.",
      ],
    },
    gatekeeper:
      "A selection committee and the programme's eligibility requirements, which turn most applicants down",
    consumes_artifacts: ["ART-REPO", "ART-WRITEUP", "ART-TOOL"],
    window: {
      type: "annual",
      note: "One application cycle a year, run through the participating university. Deadlines are fixed and early.",
    },
    lead_time: "6–12 months from deciding to starting",
    lead_time_months: 9,
    cost: "Free to apply — it pays you",
    links: [
      {
        title: "CyberCorps: Scholarship for Service",
        url: "https://www.sfs.opm.gov/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Read the eligibility criteria on the official site and check whether you qualify before doing anything else.",
    failure_mode:
      "Not applying because the service commitment sounds daunting. For a lot of people it's a funded degree plus a guaranteed first job in a field that's hard to break into.",
  },
  {
    id: "PRV-VICEROY",
    phrase: "a place as a VICEROY DECREE scholar",
    name: "VICEROY DECREE scholar",
    tier: 3,
    brief:
      "A Northeastern-led, Department of Defense supported programme combining academic work, hands-on cybersecurity experience and career development. Runs here, which makes it unusually reachable.",
    detail: {
      overview: [
        "Scholars follow an approved academic pathway, keep their grades up, stay eligible for a security clearance, participate in a cybersecurity club and cyber competitions, and complete applied learning such as Security+ or PenTest+. Much of that overlaps with what a bench here would have you doing anyway.",
        "The areas covered go wider than most programmes — cybersecurity, cryptography, data science, and the security of wireless communications.",
        "An optional designation adds mentorship, a defense-related internship and the annual VICEROY symposium. Benefits include access to specialised courses across partner universities, mentors, internship and co-op opportunities, a completion stipend subject to funding, and formal recognition.",
      ],
      examples: [
        "Check the academic pathway requirements against the courses you were going to take anyway.",
        "Join a cyber competition team — it's a programme requirement and a bench item in its own right.",
        "Work toward Security+ or PenTest+, which the programme counts as applied learning.",
      ],
    },
    gatekeeper:
      "Programme selection, plus academic and clearance-eligibility requirements",
    consumes_artifacts: ["ART-REPO", "ART-WRITEUP", "ART-TOOL"],
    window: {
      type: "annual",
      note: "Runs on an annual cycle through Northeastern. Ask early — the pathway requirements affect course choices.",
    },
    lead_time: "6–12 months, and the academic pathway runs alongside your degree",
    lead_time_months: 9,
    cost: "Free to apply; a completion stipend is part of it",
    links: [
      {
        title: "VICEROY DECREE",
        url: "https://viceroydecree.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Read the academic pathway requirements and work out how much of it you're already doing.",
    failure_mode:
      "Finding out about the pathway requirements too late to fit them into your remaining semesters.",
  },
  {
    id: "PRV-SMART",
    phrase: "a DoD SMART scholarship",
    name: "DoD SMART Scholarship",
    tier: 3,
    brief:
      "Science, Mathematics and Research for Transformation — a scholarship-for-service programme that funds your STEM degree and prepares you for a civilian defense career.",
    detail: {
      overview: [
        "Full tuition and approved education-related fees, an annual stipend that scales with degree level, book and supply allowances, and health insurance. Also mentorship and practical experience, and employment after successfully completing the requirements.",
        "Scholars continue their approved degree and complete summer internships at a sponsoring facility. After graduation you work as a civilian employee for one year per year of funding — two funded academic years means two years of paid civilian employment. The summer internships are separate from that commitment.",
        "Key requirements include an eligible STEM degree and security clearance eligibility. Worth checking both before investing time in the application.",
      ],
      examples: [
        "Check your degree is on the eligible list and that you'd be clearance-eligible.",
        "Work out the real commitment: years funded equals years employed afterwards.",
        "Look at which sponsoring facilities take interns in what you want to do.",
      ],
    },
    gatekeeper:
      "A competitive selection process plus degree and clearance eligibility requirements",
    consumes_artifacts: ["ART-REPO", "ART-WRITEUP"],
    window: {
      type: "annual",
      note: "One application cycle per year, typically opening in late summer and closing in the autumn.",
    },
    lead_time: "6–12 months from applying to starting",
    lead_time_months: 9,
    cost: "Free to apply — it pays you",
    links: [
      {
        title: "SMART Scholarship",
        url: "https://www.smartscholarship.org/smart",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Check the eligible degree list and the clearance requirement before writing anything.",
    failure_mode:
      "Treating the post-graduation commitment as fine print. It's a real multi-year obligation — good value if you want that career, expensive if you don't.",
  },
  {
    id: "PRV-RA",
    phrase: "a research assistant position",
    name: "Research assistant position",
    tier: 3,
    brief:
      "A position in a research group, paid or for credit. A faculty member chose to spend their budget or their supervision time on you, which is a serious gate.",
    gatekeeper:
      "A faculty member deciding whether to spend funding and time on you",
    consumes_artifacts: ["ART-REPO", "ART-WRITEUP", "ART-DATASET", "ART-TOOL"],
    window: {
      type: "seasonal",
      note: "Informal and continuous, but hiring clusters before each semester and before summer.",
    },
    lead_time: "1–4 months from first email to starting",
    lead_time_months: 3,
    cost: "Free; often paid",
    detail: {
      overview: [
        "A position in a research group, paid or for credit. A faculty member chose to spend their budget or their supervision time on you, which is a serious gate and an unusually good one to pass early.",
        "It is also the most underused route on this list. Most students never email a professor, and the ones who do mostly send something generic.",
        "Specificity about their actual work is the entire difference between a reply and silence. Read one recent paper and ask one real question about it.",
      ],
      examples: [
        "Read a recent paper from a group you're interested in and email the author one specific question.",
        "Ask a professor whose class you did well in what their group is working on.",
      ],
    },
    first_move:
      "Read one recent paper from a group you're interested in and email the author one specific question about it.",
    failure_mode:
      "A mass email saying you're interested in research. Specificity about their actual work is the entire difference between a reply and silence.",
  },
  {
    id: "PRV-COOP",
    phrase: "a co-op or internship offer in security",
    name: "Co-op or internship offer in security",
    tier: 3,
    brief:
      "An offer to be paid to do this work. The gate everything else on this list is partly in service of — and the one where the bench you built is the thing you talk about in the interview.",
    gatekeeper: "A hiring manager with a limited number of seats",
    consumes_artifacts: [
      "ART-REPO",
      "ART-WRITEUP",
      "ART-TOOL",
      "ART-DISCLOSURE",
      "ART-DATASET",
    ],
    window: {
      type: "seasonal",
      note: "Cycles run well ahead of the work term — searching starts a semester or more before you'd start.",
    },
    lead_time: "3–6 months from applying to an offer",
    lead_time_months: 4,
    cost: "Free",
    detail: {
      overview: [
        "An offer to be paid to do this work. The gate much of the rest of this list is in service of — and the one where the bench you built is the thing you talk about in the interview.",
        "Cycles run well ahead of the work term, so searching starts a semester or more before you'd start. The projects on your bench are the interview; do one before the cycle rather than during it.",
        "Applying with nothing to point at is the common failure, and it is entirely avoidable — one finished project changes every conversation.",
      ],
      examples: [
        "Write the two-sentence version of your current project. You'll say it in every conversation from here.",
        "Finish one artifact before the cycle opens, not during it.",
      ],
    },
    first_move:
      "Write the two-sentence version of your current project. You'll say it in every conversation from here on.",
    failure_mode:
      "Applying with nothing to point at. The projects on this bench are the interview; do one before the cycle rather than during it.",
  },
  {
    id: "PRV-PAPER",
    phrase: "a paper submitted to a reviewed venue",
    name: "Paper submitted to a venue with review",
    tier: 3,
    brief:
      "A paper submitted somewhere with real peer review — a workshop, a student track, a conference. Submission is the bench item; acceptance is a bonus you don't control.",
    gatekeeper: "Peer reviewers who reject most of what they read",
    consumes_artifacts: ["ART-DATASET", "ART-WRITEUP", "ART-TOOL"],
    window: {
      type: "recurring-cfp",
      note: "Hard deadlines, published a long way ahead, and they do not move.",
    },
    lead_time: "3–9 months to write and submit",
    lead_time_months: 6,
    cost: "Free to submit; some venues charge on acceptance",
    detail: {
      overview: [
        "A paper submitted somewhere with real peer review — a workshop, a student track, a conference. Submission is the bench item; acceptance is a bonus you don't control.",
        "Aiming at a top-tier conference for a first paper is the standard mistake. Workshops and student tracks exist for exactly this, review just as genuinely, and give you feedback from people who know the area.",
        "Deadlines are hard, published a long way ahead, and do not move.",
      ],
      examples: [
        "Find a workshop with a deadline four or more months out and write the abstract this week.",
        "Ask a professor to read a draft before you submit.",
      ],
    },
    first_move:
      "Find a workshop or student track with a deadline four or more months out and write the abstract this week.",
    failure_mode:
      "Aiming at a top-tier conference for a first paper. Workshops and student tracks exist for exactly this and review just as genuinely.",
  },
  {
    id: "PRV-GRADSCHOOL",
    phrase: "a place on a graduate programme",
    name: "Accepted to a graduate programme",
    tier: 3,
    brief:
      "A department admitted you to a master's or doctoral programme. A committee read your application against everyone else's and chose you.",
    detail: {
      overview: [
        "A genuine selection, and the right one to have on your bench if research is the direction you want. Security research is one of the few areas where a graduate degree changes what work is available to you rather than just how you're paid.",
        "Research experience is what moves these applications — far more than grades alone. A research assistant position, a submitted paper, or a substantial public project all do more work in an application than another A.",
        "Deadlines cluster in autumn for the following year, which means the preparation happens a full year before you'd start.",
      ],
      examples: [
        "Email a professor whose work interests you and ask one specific question about a recent paper.",
        "Get research experience first — it matters more than anything else in the application.",
        "Write the deadlines down a year ahead.",
      ],
    },
    gatekeeper:
      "An admissions committee choosing a cohort from far more applicants than places",
    consumes_artifacts: ["ART-WRITEUP", "ART-REPO", "ART-DATASET"],
    window: {
      type: "annual",
      note: "Deadlines cluster in autumn for the following academic year, and they do not move.",
    },
    lead_time: "6–12 months from deciding to applying",
    lead_time_months: 9,
    cost: "Application fees, often waivable",
    first_move:
      "Read one recent paper from a group you'd want to join and email the author a specific question about it.",
    failure_mode:
      "Applying with grades and no research. The committee is choosing people to do research with.",
  },
];

export default proveTiles;
