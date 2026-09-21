import { Pattern } from "@/bench/types";

/**
 * The 17 verbs. Each declares the target classes it accepts, so the composer
 * can only offer combinations that mean something — "tear down a vulnerable web
 * app" is unreachable rather than merely discouraged.
 *
 * Break and Audit look similar and aren't, and students conflate them every
 * time, so both briefs say the difference out loud.
 */
const patterns: Pattern[] = [
  {
    id: "PAT-TEARDOWN",
    name: "Tear down",
    verb: "tearing down",
    brief:
      "Open a physical thing and document what is inside it. Identify the chips, find the test points, work out how the parts talk to each other. The output is a map of a device that nobody published a map of.",
    first_move:
      "Buy the device and take the first photo before you open it. You will want the before picture.",
    failure_mode:
      "Taking it apart in one session with no photos, then being unable to reassemble it or write about it. Photograph every screw and every layer as you go.",
    accepts: ["physical-device", "embedded"],
    yields: ["ART-WRITEUP", "ART-VIDEO", "ART-REPO"],
    demands: ["SKL-HW-DATASHEET", "SKL-HW-UART", "SKL-HW-LOGIC"],
    effort: 2,
  },
  {
    id: "PAT-FIRMWARE",
    name: "Analyze firmware",
    verb: "analyzing the firmware of",
    brief:
      "Get the code that runs on a device and read it. Unpack the image, find the filesystem, look at what the vendor shipped — hardcoded keys, forgotten debug shells, update logic that trusts too much.",
    first_move:
      "Download the vendor's public firmware update file and run `binwalk` on it. You will know within a minute whether it is packed or plain.",
    failure_mode:
      "Stopping at 'binwalk extracted some files'. Extraction is the setup, not the finding. Pick one binary from that filesystem and actually read it.",
    accepts: ["firmware-image", "embedded"],
    yields: ["ART-WRITEUP", "ART-REPO", "ART-DISCLOSURE"],
    demands: ["SKL-RE-GHIDRA", "SKL-RE-FORMAT", "SKL-LINUX-BUILD"],
    effort: 2,
  },
  {
    id: "PAT-BREAK",
    name: "Break",
    verb: "breaking",
    brief:
      "Find one flaw and drive it all the way to a working demonstration. Depth is the whole point — one bug you understand completely beats ten you noticed. This is the opposite of Audit, which goes wide and shallow against a checklist.",
    first_move:
      "Pick a single input on a single page or function and spend an hour on only that input.",
    failure_mode:
      "Scanning instead of understanding. A tool's output is a lead, not a finding. If you cannot explain why the bug exists, you have not broken anything.",
    accepts: ["binary", "web-app", "network-service", "protocol"],
    yields: ["ART-DISCLOSURE", "ART-WRITEUP", "ART-TOOL"],
    demands: ["SKL-OFFSEC-WEB", "SKL-OFFSEC-PRIVESC", "SKL-RE-DISASM"],
    effort: 2,
  },
  {
    id: "PAT-HARDEN",
    name: "Harden",
    verb: "hardening",
    brief:
      "Take something that works and make it survive contact with an attacker. Change the configuration, prove the change did what you claimed, and write down the before and after so someone else can copy it.",
    first_move:
      "Stand the thing up in its default configuration and record that default. You cannot show an improvement without a baseline.",
    failure_mode:
      "Applying a hardening guide top to bottom without testing anything. If you did not verify a single control actually blocks what it claims to block, you followed a recipe rather than hardened a system.",
    accepts: ["network-service", "cloud-env", "process"],
    yields: ["ART-REFBUILD", "ART-WRITEUP"],
    demands: ["SKL-LINUX-SYSTEMD", "SKL-NET-SEGMENT", "SKL-CLOUD-BASELINE"],
    effort: 2,
  },
  {
    id: "PAT-INSTRUMENT",
    name: "Instrument",
    verb: "instrumenting",
    brief:
      "Make a system tell you what it is doing. Add logging, tracing, or a probe where there wasn't one, then collect what comes out. You end up seeing something that was always happening and was never visible.",
    first_move:
      "Pick the one question you want the system to answer and write it on paper before you add a single log line.",
    failure_mode:
      "Collecting everything and analyzing nothing. Volume feels like progress and isn't. Instrument for a specific question.",
    accepts: ["embedded", "network-service", "cloud-env", "process"],
    yields: ["ART-TOOL", "ART-DATASET", "ART-REPO"],
    demands: ["SKL-LINUX-TRACE", "SKL-NET-CAPTURE", "SKL-HW-LOGIC"],
    effort: 2,
  },
  {
    id: "PAT-REIMPLEMENT",
    name: "Reimplement",
    verb: "reimplementing",
    brief:
      "Write your own version of something that already exists, from the specification or from the original's behavior. You learn a format or protocol properly by building something that speaks it, not by reading about it.",
    first_move:
      "Write the smallest possible parser for the first four bytes of the format. Get those four bytes right before anything else.",
    failure_mode:
      "Reimplementing the easy 80% and calling it done. The last 20% — the edge cases, the weird flag, the version nobody documents — is where the actual understanding lives.",
    accepts: ["protocol", "binary", "firmware-image"],
    yields: ["ART-REPO", "ART-TEACHING"],
    demands: ["SKL-RE-FORMAT", "SKL-RE-DISASM", "SKL-LINUX-BUILD"],
    effort: 3,
  },
  {
    id: "PAT-AUTOMATE",
    name: "Automate",
    verb: "automating",
    brief:
      "Take something done by hand and make it run by itself. The value is in the part everyone does badly because it is tedious — the check nobody runs, the setup everybody skips.",
    first_move:
      "Do the manual task once, slowly, writing down every command you type. That transcript is your first draft.",
    failure_mode:
      "Automating something nobody actually does, including you. If the manual version was never worth doing, the automated version is worth less.",
    accepts: ["process", "network-service", "cloud-env"],
    yields: ["ART-TOOL", "ART-REPO"],
    demands: ["SKL-LINUX-SHELL", "SKL-LINUX-SYSTEMD", "SKL-CLOUD-BASELINE"],
    effort: 2,
  },
  {
    id: "PAT-SIMULATE",
    name: "Simulate",
    verb: "simulating",
    brief:
      "Build a model of a system you can't or shouldn't touch directly, then experiment on the model. Useful when the real thing is expensive, fragile, or off limits — and it makes the experiment repeatable for everyone after you.",
    first_move:
      "Write down the one behavior your model has to get right. Everything else can be wrong in v1.",
    failure_mode:
      "Building a simulator so faithful that it becomes the project and no experiment ever gets run on it. The model is scaffolding for a finding.",
    accepts: ["embedded", "protocol", "network-service"],
    yields: ["ART-REPO", "ART-VIDEO"],
    demands: ["SKL-NET-CAPTURE", "SKL-RE-FORMAT", "SKL-LINUX-BUILD"],
    effort: 2,
  },
  {
    id: "PAT-BRIDGE",
    name: "Bridge",
    verb: "bridging",
    brief:
      "Make two things talk that were never built to. Put a protocol behind an interface something else can use, or get a closed device to speak to open software. Bridges are small, finishable, and unusually useful to other people.",
    first_move:
      "Capture one real message from each side. You are looking for the smallest exchange that proves you understand both ends.",
    failure_mode:
      "Designing the general-purpose bridge before making one specific message cross. Get one message through end to end, then generalize.",
    accepts: ["protocol", "embedded", "network-service"],
    yields: ["ART-TOOL", "ART-REPO"],
    demands: ["SKL-NET-CAPTURE", "SKL-RE-FORMAT", "SKL-HW-UART"],
    effort: 2,
  },
  {
    id: "PAT-MEASURE",
    name: "Measure",
    verb: "measuring",
    brief:
      "Count something nobody has counted. Collect real data, be honest about your method and its limits, and publish both the numbers and how you got them. The method is as much the artifact as the result.",
    first_move:
      "Collect ten samples by hand and look at them. Ten real data points will change your plan before you automate collecting ten thousand.",
    failure_mode:
      "A methodology that can't survive a sceptical question. Write down what would make your numbers wrong, in the writeup, before someone else does.",
    accepts: ["dataset", "network-service", "process", "protocol"],
    yields: ["ART-DATASET", "ART-WRITEUP"],
    demands: ["SKL-NET-CAPTURE", "SKL-LINUX-SHELL", "SKL-CLOUD-BASELINE"],
    effort: 2,
  },
  {
    id: "PAT-AUDIT",
    name: "Audit",
    verb: "auditing",
    brief:
      "Check a system against a defined baseline, all the way across, and report what does and does not comply. Completeness is the value here — this is the opposite of Break, which goes deep on one flaw and ignores everything else.",
    first_move:
      "Name the baseline you are auditing against and get a copy of it. An audit with no stated standard is just an opinion.",
    failure_mode:
      "Drifting into Break halfway through. The moment one finding gets interesting, the audit stops being complete. Finish the sweep, then go deep as a second project.",
    accepts: ["cloud-env", "network-service", "process"],
    yields: ["ART-WRITEUP", "ART-THREATMODEL"],
    demands: [
      "SKL-CLOUD-BASELINE",
      "SKL-CLOUD-IAM",
      "SKL-APPSEC-THREATMODEL",
      "SKL-OFFSEC-FINDING",
    ],
    effort: 2,
  },
  {
    id: "PAT-DOCUMENT",
    name: "Document",
    verb: "documenting",
    brief:
      "Write down how something works when nobody has written it down properly. No exploit, no break — just a clear account of a thing, good enough that the next person doesn't have to work it out from scratch. This is the friendliest way into security work and it's genuinely valuable.",
    first_move:
      "Pick one thing you had to figure out the hard way this month and write the page you wish had existed.",
    failure_mode:
      "Assuming it's too obvious to be worth writing. If it took you an afternoon, it will take the next person an afternoon, and nobody has written it down.",
    accepts: [
      "physical-device",
      "embedded",
      "firmware-image",
      "protocol",
      "web-app",
      "network-service",
      "cloud-env",
      "process",
    ],
    yields: ["ART-WRITEUP", "ART-TEACHING", "ART-REPO"],
    demands: ["SKL-APPSEC-THREATMODEL", "SKL-RE-FORMAT", "SKL-HW-DATASHEET"],
    effort: 1,
  },
  {
    id: "PAT-DETECT",
    name: "Build a detection",
    verb: "building a detection for",
    brief:
      "Write something that notices when a specific bad thing happens — a rule, a script, a query. You need to understand the attack well enough to describe what it leaves behind, which is a different and often deeper skill than performing it.",
    first_move:
      "Do the thing you want to detect, once, on a machine you own, and write down every trace it left.",
    failure_mode:
      "A detection you never tested against the real thing. Run the attack, confirm it fires, then run normal activity and confirm it doesn't.",
    accepts: ["network-service", "process", "binary", "cloud-env"],
    yields: ["ART-TOOL", "ART-REPO", "ART-WRITEUP"],
    demands: ["SKL-NET-CAPTURE", "SKL-DFIR-TIMELINE", "SKL-LINUX-TRACE"],
    effort: 2,
  },
  {
    id: "PAT-COMPARE",
    name: "Compare",
    verb: "comparing",
    brief:
      "Put two things side by side and report what differs — two firmware versions, two cloud accounts, two implementations of the same protocol. Differences are where the interesting things hide, and comparing is much easier than analyzing one thing in isolation.",
    first_move:
      "Get both versions and diff them with whatever tool fits. The first surprising difference is your project.",
    failure_mode:
      "Comparing things that are too different to line up. Two versions of the same thing teaches; two unrelated things just produces noise.",
    accepts: ["firmware-image", "binary", "web-app", "protocol", "dataset", "cloud-env"],
    yields: ["ART-WRITEUP", "ART-DATASET"],
    demands: ["SKL-RE-FORMAT", "SKL-RE-GHIDRA", "SKL-CLOUD-BASELINE"],
    effort: 2,
  },
  {
    id: "PAT-RECOVER",
    name: "Recover",
    verb: "recovering data from",
    brief:
      "Get back something that was deleted, corrupted, or hidden. Deleted files, a damaged archive, data in a format nothing still reads. Satisfying in a way few projects are, because you either got it back or you didn't.",
    first_move:
      "Make a copy first and work only on the copy. Then look at the raw bytes before reaching for a recovery tool.",
    failure_mode:
      "Working on the original and making it worse. Image it, hash it, work on the copy — every time.",
    accepts: ["binary", "dataset", "physical-device", "firmware-image"],
    yields: ["ART-WRITEUP", "ART-TOOL", "ART-REPO"],
    demands: ["SKL-DFIR-ACQUIRE", "SKL-RE-FORMAT", "SKL-DFIR-MEMORY"],
    effort: 2,
  },
  {
    id: "PAT-VISUALIZE",
    name: "Visualize",
    verb: "visualizing",
    brief:
      "Turn data nobody can read into a picture that makes something obvious. A graph of who talks to whom, a timeline of an incident, a map of permissions. Often the fastest way to find something everyone else missed in the same data.",
    first_move:
      "Plot ten rows by hand — on paper is fine. If the picture tells you nothing at ten rows, it won't at ten thousand.",
    failure_mode:
      "Making it pretty before making it true. Decide the one question the picture answers, then draw only that.",
    accepts: ["dataset", "network-service", "process", "protocol"],
    yields: ["ART-TOOL", "ART-REPO", "ART-WRITEUP"],
    demands: ["SKL-NET-CAPTURE", "SKL-LINUX-SHELL", "SKL-DFIR-TIMELINE"],
    effort: 2,
  },
  {
    id: "PAT-PORT",
    name: "Port",
    verb: "porting",
    brief:
      "Make something run where it didn't — a tool onto a new platform, an old exploit against a current version, a library onto an architecture it never targeted. You inherit a working design and spend your time on the part that actually teaches.",
    first_move:
      "Build the original on its own platform first. You need a working reference before you can tell a port bug from a you bug.",
    failure_mode:
      "Porting something you don't understand. Get the original working and read it properly, or every failure will be a mystery.",
    accepts: ["binary", "firmware-image", "protocol", "process"],
    yields: ["ART-REPO", "ART-TOOL"],
    demands: ["SKL-LINUX-BUILD", "SKL-RE-DISASM", "SKL-RE-FORMAT"],
    effort: 2,
  },
];

export default patterns;
