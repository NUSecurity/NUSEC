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
    first_move:
      "Find three places that publish the kind of thing you did and read their submission page. Pitch in two sentences — don't wait until the draft is perfect.",
    failure_mode:
      "Taking the edit round personally. Being sent back for changes is exactly what makes this count for more than your own blog.",
  },
  {
    id: "PRV-TEACH",
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
    first_move:
      "Find one person who wants the skill and book a specific hour with them. One learner is enough.",
    failure_mode:
      "Lecturing and calling it teaching. If the learner didn't do the thing with their own hands while you were there, you presented.",
  },
  {
    id: "PRV-WIKI",
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
    first_move:
      "Find the page for the device or protocol you just worked on. If it doesn't exist, that's your contribution.",
    failure_mode:
      "Adding an opinion to a reference. Wikis want verifiable facts with sources; editorializing gets reverted.",
  },
  {
    id: "PRV-TRANSLATE",
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
    first_move:
      "Find this year's submission deadline and write the abstract. The abstract is most of the work.",
    failure_mode:
      "A poster that's a paper in small type. Posters are read standing up from three feet away — one figure, one finding.",
  },
  {
    id: "PRV-COHORT",
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
    first_move:
      "Find three programs and write their deadlines down. Most close far earlier than people expect.",
    failure_mode:
      "Finding the program two weeks after applications closed. This is entirely a calendar problem — solve it with a calendar.",
  },
  {
    id: "PRV-VILLAGE",
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
    first_move:
      "Read one recent paper from a group you're interested in and email the author one specific question about it.",
    failure_mode:
      "A mass email saying you're interested in research. Specificity about their actual work is the entire difference between a reply and silence.",
  },
  {
    id: "PRV-COOP",
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
    first_move:
      "Write the two-sentence version of your current project. You'll say it in every conversation from here on.",
    failure_mode:
      "Applying with nothing to point at. The projects on this bench are the interview; do one before the cycle rather than during it.",
  },
  {
    id: "PRV-PAPER",
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
    first_move:
      "Find a workshop or student track with a deadline four or more months out and write the abstract this week.",
    failure_mode:
      "Aiming at a top-tier conference for a first paper. Workshops and student tracks exist for exactly this and review just as genuinely.",
  },
  {
    id: "PRV-GCIH",
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
