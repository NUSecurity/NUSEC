import { Pattern } from "@/bench/types";
import { V_2026_09 } from "./verified";

/**
 * The 17 verbs, ordered by how many students will actually want them.
 *
 * `accepts` and `yields` are hints, not gates. The composer marks common
 * pairings and then lets you pick anything: hardening a badge, writing a repo
 * about an IP camera teardown, and documenting a process are all real
 * projects, and a taxonomy that forbids them is wrong rather than strict.
 *
 * Break and Audit look similar and aren't, and students conflate them every
 * time, so both briefs say the difference out loud.
 */
const patterns: Pattern[] = [
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
    accepts: ["binary", "web-app", "network-service", "protocol", "cloud-env", "embedded", "firmware-image"],
    yields: ["ART-DISCLOSURE", "ART-WRITEUP", "ART-TOOL", "ART-REPO", "ART-VIDEO"],
    demands: ["SKL-OFFSEC-WEB", "SKL-OFFSEC-PRIVESC", "SKL-RE-DISASM"],
    effort: 2,
    resources: [
      {
        title: "PortSwigger Web Security Academy",
        url: "https://portswigger.net/web-security",
        type: "hands-on",
        note: "Free, browser-based, and the single best place to learn to find a bug by hand.",
        last_verified: V_2026_09,
      },
      {
        title: "OWASP Web Security Testing Guide",
        url: "https://owasp.org/www-project-web-security-testing-guide/",
        type: "reference",
        note: "The closest thing to an agreed method. Work down it rather than poking at whatever catches your eye.",
        last_verified: V_2026_09,
      },
      {
        title: "PayloadsAllTheThings",
        url: "https://github.com/swisskyrepo/PayloadsAllTheThings",
        type: "reference",
        note: "Payloads and bypasses per bug class. Use it once you understand the bug, not instead of understanding it.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["cloud-env", "network-service", "process", "web-app", "binary", "protocol"],
    yields: ["ART-WRITEUP", "ART-THREATMODEL", "ART-REPO", "ART-DATASET", "ART-TOOL"],
    demands: [
      "SKL-CLOUD-BASELINE",
      "SKL-CLOUD-IAM",
      "SKL-APPSEC-THREATMODEL",
      "SKL-OFFSEC-FINDING",
    ],
    effort: 2,
    resources: [
      {
        title: "CIS Benchmarks",
        url: "https://www.cisecurity.org/cis-benchmarks",
        type: "corpus",
        note: "The baselines an audit gets measured against. Pick one and audit against it rather than against your opinion.",
        last_verified: V_2026_09,
      },
      {
        title: "Prowler",
        url: "https://github.com/prowler-cloud/prowler",
        type: "hands-on",
        note: "Runs hundreds of cloud checks. Read what it checked afterwards — that list is the curriculum.",
        last_verified: V_2026_09,
      },
      {
        title: "OWASP ASVS",
        url: "https://owasp.org/ASVS/",
        type: "reference",
        note: "A three-level checklist of what secure actually requires. A ready-made audit scope for anything web-facing.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["network-service", "cloud-env", "process", "web-app", "physical-device", "embedded", "protocol"],
    yields: ["ART-REFBUILD", "ART-WRITEUP", "ART-REPO", "ART-TEACHING", "ART-TOOL"],
    demands: ["SKL-LINUX-SYSTEMD", "SKL-NET-SEGMENT", "SKL-CLOUD-BASELINE"],
    effort: 2,
    resources: [
      {
        title: "Lynis",
        url: "https://github.com/CISOfy/lynis",
        type: "hands-on",
        note: "Scan a Linux host, read every finding, fix them one at a time. The fastest way to see what hardening means in practice.",
        last_verified: V_2026_09,
      },
      {
        title: "CIS Benchmarks",
        url: "https://www.cisecurity.org/cis-benchmarks",
        type: "reference",
        note: "Per-platform hardening guidance with the reasoning attached. Your before-and-after measures against this.",
        last_verified: V_2026_09,
      },
      {
        title: "systemd.exec(5) — sandboxing options",
        url: "https://man7.org/linux/man-pages/man5/systemd.exec.5.html",
        type: "reference",
        note: "ProtectSystem, PrivateTmp, NoNewPrivileges. One page that is most of Linux service hardening.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["process", "network-service", "cloud-env", "web-app", "dataset"],
    yields: ["ART-TOOL", "ART-REPO", "ART-WRITEUP", "ART-TEACHING"],
    demands: ["SKL-LINUX-SHELL", "SKL-LINUX-SYSTEMD", "SKL-CLOUD-BASELINE"],
    effort: 2,
    resources: [
      {
        title: "Ansible documentation",
        url: "https://docs.ansible.com/",
        type: "reference",
        note: "The standard way to describe 'make this machine look like this'. Start at the playbook intro.",
        last_verified: V_2026_09,
      },
      {
        title: "GitHub Actions documentation",
        url: "https://docs.github.com/actions",
        type: "hands-on",
        note: "Free CI on any repo you own. The easiest place to make something run on a schedule without a server.",
        last_verified: V_2026_09,
      },
      {
        title: "ShellCheck",
        url: "https://www.shellcheck.net/",
        type: "reference",
        note: "Paste your script in and it finds the quoting bug. Run everything you write through it.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["network-service", "process", "binary", "cloud-env", "web-app", "dataset"],
    yields: ["ART-TOOL", "ART-REPO", "ART-WRITEUP", "ART-DATASET", "ART-TEACHING"],
    demands: ["SKL-NET-CAPTURE", "SKL-DFIR-TIMELINE", "SKL-LINUX-TRACE"],
    effort: 2,
    resources: [
      {
        title: "MITRE ATT&CK",
        url: "https://attack.mitre.org/",
        type: "foundation",
        note: "The shared catalogue of what attackers actually do. Pick one technique and build a detection for exactly that.",
        last_verified: V_2026_09,
      },
      {
        title: "Atomic Red Team",
        url: "https://github.com/redcanaryco/atomic-red-team",
        type: "hands-on",
        note: "Small, safe scripts that perform one ATT&CK technique so you can confirm your detection fires.",
        last_verified: V_2026_09,
      },
      {
        title: "Sigma",
        url: "https://github.com/SigmaHQ/sigma",
        type: "reference",
        note: "Detection rules in a portable format, with thousands of worked examples to read.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["network-service", "cloud-env", "process", "embedded", "web-app", "binary"],
    yields: ["ART-TOOL", "ART-DATASET", "ART-REPO", "ART-WRITEUP"],
    demands: ["SKL-LINUX-TRACE", "SKL-NET-CAPTURE", "SKL-HW-LOGIC"],
    effort: 2,
    resources: [
      {
        title: "OpenTelemetry documentation",
        url: "https://opentelemetry.io/docs/",
        type: "foundation",
        note: "The standard way to add traces and metrics to something. Vendor-neutral, and what industry actually uses.",
        last_verified: V_2026_09,
      },
      {
        title: "Brendan Gregg — Linux Performance",
        url: "https://www.brendangregg.com/linuxperf.html",
        type: "reference",
        note: "The map of every Linux observability tool and what layer it can see. Bookmark the diagram.",
        last_verified: V_2026_09,
      },
      {
        title: "bpftrace",
        url: "https://github.com/bpftrace/bpftrace",
        type: "hands-on",
        note: "Ask the kernel questions in one line. The one-liner collection in its docs is the place to start.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["dataset", "network-service", "process", "protocol", "cloud-env", "web-app"],
    yields: ["ART-DATASET", "ART-WRITEUP", "ART-TOOL", "ART-REPO"],
    demands: ["SKL-NET-CAPTURE", "SKL-LINUX-SHELL", "SKL-CLOUD-BASELINE"],
    effort: 2,
    resources: [
      {
        title: "ZMap",
        url: "https://github.com/zmap/zmap",
        type: "hands-on",
        note: "Fast scanning built for research, with published methodology. Read how they handle ethics and opt-outs before scanning anything.",
        last_verified: V_2026_09,
      },
      {
        title: "Netresec public pcap index",
        url: "https://www.netresec.com/?page=PcapFiles",
        type: "corpus",
        note: "Someone else already collected a lot of this. Measuring an existing dataset is a real project.",
        last_verified: V_2026_09,
      },
      {
        title: "Digital Corpora",
        url: "https://digitalcorpora.org/",
        type: "corpus",
        note: "Disk images, captures and scenarios published for research, with the collection method documented.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["web-app", "network-service", "cloud-env", "process", "protocol", "binary", "physical-device", "embedded", "firmware-image", "dataset"],
    yields: ["ART-WRITEUP", "ART-TEACHING", "ART-REPO", "ART-THREATMODEL", "ART-VIDEO"],
    demands: ["SKL-APPSEC-THREATMODEL", "SKL-RE-FORMAT", "SKL-HW-DATASHEET"],
    effort: 1,
    resources: [
      {
        title: "Diátaxis",
        url: "https://diataxis.fr/",
        type: "foundation",
        note: "Four kinds of documentation and why mixing them makes all four worse. Twenty minutes, and it will change how you write.",
        last_verified: V_2026_09,
      },
      {
        title: "Write the Docs",
        url: "https://www.writethedocs.org/",
        type: "community",
        note: "A whole community for people who document things, with a friendly beginners' track.",
        last_verified: V_2026_09,
      },
      {
        title: "Mermaid",
        url: "https://mermaid.js.org/",
        type: "reference",
        note: "Diagrams from plain text that render on GitHub. The lowest-friction way to put a picture in a writeup.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["dataset", "network-service", "process", "protocol", "cloud-env", "web-app"],
    yields: ["ART-TOOL", "ART-REPO", "ART-WRITEUP", "ART-DATASET", "ART-VIDEO"],
    demands: ["SKL-NET-CAPTURE", "SKL-LINUX-SHELL", "SKL-DFIR-TIMELINE"],
    effort: 2,
    resources: [
      {
        title: "The Data Visualisation Catalogue",
        url: "https://datavizcatalogue.com/",
        type: "foundation",
        note: "Which chart answers which kind of question. Read this before you pick a chart type.",
        last_verified: V_2026_09,
      },
      {
        title: "Gephi",
        url: "https://gephi.org/",
        type: "hands-on",
        note: "Free graph visualization. The right tool the moment your data is 'who talked to whom'.",
        last_verified: V_2026_09,
      },
      {
        title: "Mermaid",
        url: "https://mermaid.js.org/",
        type: "reference",
        note: "Timelines, flows and sequence diagrams from text. Enough for most security writeups.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["firmware-image", "binary", "web-app", "protocol", "dataset", "cloud-env", "process", "network-service"],
    yields: ["ART-WRITEUP", "ART-DATASET", "ART-REPO", "ART-TOOL"],
    demands: ["SKL-RE-FORMAT", "SKL-RE-GHIDRA", "SKL-CLOUD-BASELINE"],
    effort: 2,
    resources: [
      {
        title: "diffoscope",
        url: "https://diffoscope.org/",
        type: "hands-on",
        note: "Diffs almost anything — archives, images, binaries, filesystems — recursively. Start here for any comparison.",
        last_verified: V_2026_09,
      },
      {
        title: "BinDiff",
        url: "https://www.zynamics.com/bindiff.html",
        type: "reference",
        note: "Free binary diffing. How you find what a patch changed when only the compiled version is public.",
        last_verified: V_2026_09,
      },
      {
        title: "Debian Code Search",
        url: "https://codesearch.debian.net/",
        type: "corpus",
        note: "Search the source of every packaged program. Useful for comparing how different projects solve the same problem.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["binary", "dataset", "physical-device", "firmware-image", "cloud-env", "process"],
    yields: ["ART-WRITEUP", "ART-TOOL", "ART-REPO", "ART-TEACHING"],
    demands: ["SKL-DFIR-ACQUIRE", "SKL-RE-FORMAT", "SKL-DFIR-MEMORY"],
    effort: 2,
    resources: [
      {
        title: "TestDisk and PhotoRec",
        url: "https://www.cgsecurity.org/wiki/TestDisk",
        type: "hands-on",
        note: "Free partition and file recovery. Practise on a USB stick you deliberately wiped before you need it for real.",
        last_verified: V_2026_09,
      },
      {
        title: "The Sleuth Kit",
        url: "https://www.sleuthkit.org/",
        type: "reference",
        note: "The command-line forensics toolkit underneath most of this work. Pairs with Autopsy's interface.",
        last_verified: V_2026_09,
      },
      {
        title: "Autopsy",
        url: "https://www.autopsy.com/",
        type: "hands-on",
        note: "A graphical front end for disk analysis and recovery. The gentlest way in.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["network-service", "protocol", "embedded", "cloud-env", "process"],
    yields: ["ART-REPO", "ART-VIDEO", "ART-TOOL", "ART-TEACHING", "ART-WRITEUP"],
    demands: ["SKL-NET-CAPTURE", "SKL-RE-FORMAT", "SKL-LINUX-BUILD"],
    effort: 2,
    resources: [
      {
        title: "Containerlab",
        url: "https://containerlab.dev/",
        type: "hands-on",
        note: "A whole network topology from one YAML file. The fastest way to model something you can then attack or segment.",
        last_verified: V_2026_09,
      },
      {
        title: "Mininet",
        url: "https://mininet.org/",
        type: "hands-on",
        note: "Simulates a network of hosts and switches on one laptop. Long-standing, well documented, free.",
        last_verified: V_2026_09,
      },
      {
        title: "QEMU documentation",
        url: "https://www.qemu.org/docs/master/",
        type: "reference",
        note: "Emulate a machine — including architectures you don't own — so you can run and poke at its software.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["protocol", "network-service", "web-app", "embedded", "cloud-env"],
    yields: ["ART-TOOL", "ART-REPO", "ART-WRITEUP", "ART-TEACHING"],
    demands: ["SKL-NET-CAPTURE", "SKL-RE-FORMAT", "SKL-HW-UART"],
    effort: 2,
    resources: [
      {
        title: "Scapy",
        url: "https://scapy.net/",
        type: "hands-on",
        note: "Build and send arbitrary packets from Python. The tool for making two things talk that weren't meant to.",
        last_verified: V_2026_09,
      },
      {
        title: "mitmproxy documentation",
        url: "https://docs.mitmproxy.org/stable/",
        type: "reference",
        note: "Sit between a client and a server, read what they say, and rewrite it. Scriptable, which is the useful part.",
        last_verified: V_2026_09,
      },
      {
        title: "Wireshark documentation",
        url: "https://www.wireshark.org/docs/",
        type: "reference",
        note: "You need to see both sides of the conversation before you can bridge them.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["protocol", "binary", "firmware-image", "web-app", "dataset"],
    yields: ["ART-REPO", "ART-TEACHING", "ART-TOOL", "ART-WRITEUP"],
    demands: ["SKL-RE-FORMAT", "SKL-RE-DISASM", "SKL-LINUX-BUILD"],
    effort: 3,
    resources: [
      {
        title: "RFC Editor",
        url: "https://www.rfc-editor.org/",
        type: "corpus",
        note: "The protocols themselves. Reading one properly beats five blog posts about it.",
        last_verified: V_2026_09,
      },
      {
        title: "Kaitai Struct",
        url: "https://kaitai.io/",
        type: "hands-on",
        note: "Describe a binary format declaratively and get a parser in the language you want. Ideal for this pattern.",
        last_verified: V_2026_09,
      },
      {
        title: "MQTT specification",
        url: "https://mqtt.org/mqtt-specification/",
        type: "corpus",
        note: "Short enough to read fully in an afternoon, real enough to be worth implementing.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["binary", "firmware-image", "protocol", "process", "web-app"],
    yields: ["ART-REPO", "ART-TOOL", "ART-WRITEUP", "ART-TEACHING"],
    demands: ["SKL-LINUX-BUILD", "SKL-RE-DISASM", "SKL-RE-FORMAT"],
    effort: 2,
    resources: [
      {
        title: "GNU Make manual",
        url: "https://www.gnu.org/software/make/manual/",
        type: "reference",
        note: "Most porting pain is build pain. The first three chapters make build files stop being magic.",
        last_verified: V_2026_09,
      },
      {
        title: "CMake documentation",
        url: "https://cmake.org/documentation/",
        type: "reference",
        note: "What most modern C and C++ projects use. You need enough to read one, not to write one.",
        last_verified: V_2026_09,
      },
      {
        title: "QEMU documentation",
        url: "https://www.qemu.org/docs/master/",
        type: "hands-on",
        note: "Run and test a build for an architecture you don't physically have.",
        last_verified: V_2026_09,
      },
    ],
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
    accepts: ["firmware-image", "embedded", "binary", "physical-device"],
    yields: ["ART-WRITEUP", "ART-REPO", "ART-DISCLOSURE", "ART-TOOL", "ART-TEACHING"],
    demands: ["SKL-RE-GHIDRA", "SKL-RE-FORMAT", "SKL-LINUX-BUILD"],
    effort: 2,
    resources: [
      {
        title: "binwalk",
        url: "https://github.com/ReFirmLabs/binwalk",
        type: "hands-on",
        note: "The first command you run on any firmware image. Finds embedded filesystems and compressed blobs.",
        last_verified: V_2026_09,
      },
      {
        title: "OWASP IoTGoat",
        url: "https://github.com/OWASP/IoTGoat",
        type: "hands-on",
        note: "Deliberately vulnerable firmware you can analyse emulated — no hardware needed at all.",
        last_verified: V_2026_09,
      },
      {
        title: "FACT — Firmware Analysis and Comparison Tool",
        url: "https://github.com/fkie-cad/FACT_core",
        type: "reference",
        note: "Where an image goes after binwalk. Heavier setup, a lot more analysis.",
        last_verified: V_2026_09,
      },
    ],
  },
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
    yields: ["ART-WRITEUP", "ART-VIDEO", "ART-REPO", "ART-TEACHING", "ART-DATASET"],
    demands: ["SKL-HW-DATASHEET", "SKL-HW-UART", "SKL-HW-LOGIC"],
    effort: 2,
    resources: [
      {
        title: "FCC ID search",
        url: "https://www.fcc.gov/oet/ea/fccid",
        type: "corpus",
        note: "Internal photographs and test reports for almost any radio device sold in the US. See the board before you buy it.",
        last_verified: V_2026_09,
      },
      {
        title: "iFixit repair guides",
        url: "https://www.ifixit.com/Guide",
        type: "reference",
        note: "How to open things without destroying them, and which tool you actually need.",
        last_verified: V_2026_09,
      },
      {
        title: "sigrok / PulseView",
        url: "https://sigrok.org/wiki/PulseView",
        type: "reference",
        note: "Free logic analyzer software with decoders for most buses you'll meet inside a device.",
        last_verified: V_2026_09,
      },
    ],
  },
];

export default patterns;
