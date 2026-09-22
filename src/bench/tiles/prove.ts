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
];

export default proveTiles;
