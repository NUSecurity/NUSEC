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
    brief:
      "Slides, a lab, or an exercise set built so someone else can learn the thing. The test is external: did a person who didn't know it come out able to do it?",
    first_move:
      "Write the single exercise the learner does at the end. Build everything backwards from that.",
    failure_mode:
      "Making slides about the topic rather than material that produces a capability. If there's nothing for the learner to *do*, it's a talk, not a lab.",
  },
];

export default artifacts;
