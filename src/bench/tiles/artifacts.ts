import { Artifact } from "@/bench/types";

/**
 * The 9 things that can exist when you're done.
 *
 * Artifact is the join to Prove: it is the field students want to skip, and the
 * field that determines whether the project was real. Every one of these is a
 * Tier-0 object — a thing with a URL that someone can look at without you in
 * the room. Tier 0 is not proof; it is what proof gets applied to.
 */
const artifacts: Artifact[] = [
  {
    id: "ART-REPO",
    name: "Repo",
    phrase: "a public repo",
    detail: {
      overview: [
        "A public repository with a README that explains the project to a stranger. Not a dump of scripts — someone who has never met you should be able to tell what it does and why in thirty seconds.",
        "The README is the artifact; the code is the evidence for it. A repo whose README says \"my project for X\" is invisible to anyone who might have been impressed by it.",
        "Any project can end in a repo. A teardown, an audit, a set of detections — if it has files, it can have a repo with a README that frames them.",
      ],
      examples: [
        "Write the README's first paragraph before any code. If you can't, the project isn't defined yet.",
        "Add a screenshot or a sample output. People decide whether to read further from that.",
      ],
    },
    brief:
      "A public repository with a README that explains the project to a stranger. Not a dump of scripts — someone who has never met you should be able to tell what it does and why in thirty seconds.",
    first_move:
      "Create the repo and write the README's first paragraph before you write any code. If you can't, the project isn't defined yet.",
    failure_mode:
      "A README that says 'my project for X'. The README is the artifact; the code is the evidence for it.",
  },
  {
    id: "ART-WRITEUP",
    name: "Writeup",
    phrase: "a technical writeup",
    detail: {
      overview: [
        "A technical article explaining what you did, how, and what you found. The test is whether a reader could repeat your work, or at least tell exactly where they'd get stuck.",
        "Write the finding first and build backwards to it. A chronological log of everything you tried is the most common shape and the least readable one — readers want the finding and the path, not your afternoon in order.",
        "The wrong turns are worth keeping, but as a deliberate section, not as the structure.",
      ],
      examples: [
        "Write the last paragraph — the finding — first, then everything that gets the reader to it.",
        "Hand it to someone outside the project and watch where they stop understanding.",
      ],
    },
    brief:
      "A technical article explaining what you did, how, and what you found. The test is whether a reader could repeat your work, or at least tell exactly where they'd get stuck.",
    first_move:
      "Write the last paragraph first — the finding. Everything else exists to get the reader to it.",
    failure_mode:
      "A chronological log of everything you tried. Readers want the finding and the path to it, not your afternoon in order.",
  },
  {
    id: "ART-TOOL",
    name: "Tool",
    phrase: "a tool",
    detail: {
      overview: [
        "Something another person can install and run against their own problem. The bar isn't that the code exists — it's that a stranger on a different machine gets a useful result.",
        "Design backwards from the usage line: the exact command someone types. If you can't write that in one line, the tool's scope isn't clear yet.",
        "Hand it to one other person before calling it a tool. \"Works on my machine with my paths\" is the default state and the thing that separates a script from a tool.",
      ],
      examples: [
        "Write the README usage example first, then build to make it true.",
        "Watch someone else install it from scratch and fix everything they hit.",
      ],
    },
    brief:
      "Something another person can install and run against their own problem. The bar is not 'the code exists' — it is that a stranger on a different machine gets a useful result.",
    first_move:
      "Write the usage line — the exact command someone types — and design backwards from it.",
    failure_mode:
      "It only runs on your laptop, with your paths, in your virtualenv. Hand it to one other person before you call it a tool.",
  },
  {
    id: "ART-VIDEO",
    name: "Demo video",
    phrase: "a demo video",
    detail: {
      overview: [
        "A short recording showing the thing working. Best for results that are physical or visual, where a screenshot undersells it and a paragraph doesn't land at all.",
        "Nobody watches past ninety seconds. Cut to the part that works, narrate what's happening, and put the result early rather than saving it.",
        "Record a rough take today with whatever you have. Editing a bad take beats planning a good one indefinitely.",
      ],
      examples: [
        "Record two minutes showing the thing working, with narration.",
        "Use it as the top of a writeup rather than instead of one.",
      ],
    },
    brief:
      "A short recording showing the thing working. Best for results that are physical or visual, where a screenshot undersells it and a paragraph doesn't land at all.",
    first_move:
      "Record a rough two-minute take today with whatever you have. Editing a bad take beats planning a good one.",
    failure_mode:
      "Twenty unedited minutes with no narration. Nobody watches past ninety seconds. Cut to the part that works.",
  },
  {
    id: "ART-DISCLOSURE",
    name: "Disclosure",
    phrase: "a disclosure report",
    detail: {
      overview: [
        "A vulnerability report sent to whoever can fix it, written so they can reproduce it without talking to you. Possibly a CVE at the end, but the report is the artifact either way.",
        "Find the security contact before writing — security.txt, a security page, the maintainer's stated preference. Publishing before contacting turns a good finding into a bad reputation.",
        "Disclosure is a correspondence with a timeline, not a single email. Expect to follow up, and agree a date.",
      ],
      examples: [
        "Write the reproduction steps before the prose, and test them on a clean environment.",
        "Look up a coordinated disclosure policy and follow one, including the timeline.",
      ],
    },
    brief:
      "A vulnerability report sent to whoever can fix it, written so they can reproduce it without talking to you. Possibly a CVE at the end, but the report is the artifact either way.",
    first_move:
      "Find the vendor's security contact — security.txt, a security page, or the maintainer's stated preference — before you write the report.",
    failure_mode:
      "Publishing before contacting, or contacting once and giving up. Disclosure is a correspondence with a timeline, not a single email.",
  },
  {
    id: "ART-DATASET",
    name: "Dataset",
    phrase: "a dataset",
    detail: {
      overview: [
        "Data you collected that didn't exist in that form before, published with the method that produced it. The method matters as much as the numbers — without it nobody can trust or extend your data.",
        "Define one row before collecting anything. What exactly is a single record, and what makes one valid?",
        "Publishing data with no collection method, no date range and no note on what's missing is worse than publishing nothing, because people build on it.",
      ],
      examples: [
        "Write the schema and the collection method before you collect.",
        "Publish the script alongside the data so someone can regenerate it.",
      ],
    },
    brief:
      "Data you collected that did not exist in that form before, published with the method that produced it. The method matters as much as the numbers — without it nobody can trust or extend your data.",
    first_move:
      "Define one row. What exactly is a single record, and what makes one valid?",
    failure_mode:
      "Publishing data with no collection method, no date range, and no note on what's missing. Unmethodical data is worse than none — people build on it.",
  },
  {
    id: "ART-REFBUILD",
    name: "Reference build",
    phrase: "a reference build",
    detail: {
      overview: [
        "A configuration others can copy to get a known-good starting point — compose files, scripts, playbooks, and the reasoning for the choices. The reasoning is what makes it a reference rather than a dotfile.",
        "Tear your setup down and rebuild it from your own notes. Whatever you had to remember is what's missing from the notes.",
        "Copied configuration nobody understands breaks in a month and teaches nothing. Every non-obvious line should say why.",
      ],
      examples: [
        "Rebuild from your own notes on a clean machine and fix every gap you hit.",
        "Annotate each hardening choice with what it prevents.",
      ],
    },
    brief:
      "A configuration others can copy to get a known-good starting point — compose files, scripts, playbooks, and the reasoning for the choices. The reasoning is the part that makes it a reference rather than a dotfile.",
    first_move:
      "Tear your current setup down and rebuild it from your own notes. Whatever you had to remember is what's missing from the notes.",
    failure_mode:
      "Sharing configuration with no explanation of why. A copied config nobody understands breaks in a month and teaches nothing.",
  },
  {
    id: "ART-THREATMODEL",
    name: "Threat model",
    phrase: "a threat model",
    detail: {
      overview: [
        "A document naming what a system is, what could go wrong, and what is actually being done about it. Diagrams plus a ranked list of threats, ending in decisions rather than observations.",
        "Draw the data flow on one page. If it doesn't fit, model a smaller piece — a model of everything is a model of nothing.",
        "An exhaustive list of conceivable threats with no ranking and no decisions is a writing exercise. The output is decisions.",
      ],
      examples: [
        "Model something you built and mark every place data crosses a trust boundary.",
        "End the document with three ranked decisions, not thirty observations.",
      ],
    },
    brief:
      "A document naming what a system is, what could go wrong, and what is actually being done about it. Diagrams plus a ranked list of threats, ending in decisions rather than observations.",
    first_move:
      "Draw the data flow on one page. If it doesn't fit on one page, model a smaller piece.",
    failure_mode:
      "An exhaustive list of every conceivable threat with no ranking and no decisions. A threat model that doesn't change anything is a writing exercise.",
  },
  {
    id: "ART-TEACHING",
    name: "Teaching material",
    phrase: "teaching material",
    detail: {
      overview: [
        "Slides, a lab, or an exercise set built so someone else can learn the thing. The test is external: did a person who didn't know it come out able to do it?",
        "Write the single exercise the learner does at the end, then build everything backwards from that.",
        "If there's nothing for the learner to do, it's a talk, not a lab. Both are fine; only one is this.",
      ],
      examples: [
        "Write the final exercise first, then the material that makes it possible.",
        "Run it with one person and rewrite everything they got stuck on.",
      ],
    },
    brief:
      "Slides, a lab, or an exercise set built so someone else can learn the thing. The test is external: did a person who didn't know it come out able to do it?",
    first_move:
      "Write the single exercise the learner does at the end. Build everything backwards from that.",
    failure_mode:
      "Making slides about the topic rather than material that produces a capability. If there's nothing for the learner to *do*, it's a talk, not a lab.",
  },
];

export default artifacts;
