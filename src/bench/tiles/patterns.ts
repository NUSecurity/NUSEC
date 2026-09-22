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
    detail: {
      overview: [
        "Breaking means finding one flaw and driving it all the way to something you can demonstrate. Not \"the scanner flagged this\" — an actual sequence of steps that makes the system do something it was built not to do, which you can perform twice and explain to someone who wasn't watching.",
        "Depth is the whole point, and it is what separates this from Audit. An audit sweeps wide against a checklist and its value is completeness; a break goes narrow and deep and its value is that you genuinely understand one thing. Both are real work. Students conflate them constantly, usually drifting from audit into break the moment something looks interesting, and ending up with neither.",
        "The hardest part is almost never the exploit. It is deciding what to look at, staying on it past the point where it stops being fun, and being honest when a promising lead turns out to be nothing.",
      ],
      contexts: [
        {
          label: "Web application",
          body: "Pick one input and one sink. Follow the data: where does it go, what touches it, what would have to be true for it to be interpreted rather than stored? Most real findings come from understanding one request deeply rather than from firing a list of payloads at fifty.",
        },
        {
          label: "Network service",
          body: "The service itself is usually not where you get in. Enumerate methodically, find the version, find what that version trusts, and look at the auth boundary rather than the protocol. Break here usually means an access-control failure, not memory corruption.",
        },
        {
          label: "Binary",
          body: "Start with the input parsing. A crash is not a finding — you need to explain why it crashed, whether you control the state at the crash, and what an attacker could do with that control. Most CTF-style crashes are not exploitable, and saying so is a legitimate result.",
        },
        {
          label: "Protocol",
          body: "Look at what the protocol assumes rather than what it specifies. Replay, ordering, missing authentication on one message type — the flaws are in the gap between what the spec says and what implementations actually enforce.",
        },
      ],
      examples: [
        "Find an IDOR in a deliberately vulnerable app, then write it up as though for the vendor: request, response, what an attacker reaches, and the one-line fix.",
        "Take a boot2root VM, get root without a walkthrough, and write down every wrong turn — the wrong turns are what makes the writeup worth reading.",
        "Pick a crackme a level below your comfort, solve it, then write the explanation of why the check could be bypassed rather than just the key.",
      ],
    },
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
    detail: {
      overview: [
        "An audit checks a system against a defined baseline, all the way across, and reports what complies and what does not. The deliverable is the sweep: you looked at everything in scope and can say so. A finding you skipped because it was boring is an audit that failed.",
        "This is the opposite of Break, and the difference matters more than it sounds. Break goes deep on one flaw and ignores the rest; Audit goes wide and shallow and its whole value is that nothing was missed. Two different jobs, two different deliverables, two different kinds of satisfaction. The classic failure is starting an audit, finding something interesting on control four of sixty, and spending three weeks on it — you now have a mediocre break and no audit.",
        "Auditing is also the most employable thing on this list that requires the least offensive skill. Compliance, cloud posture and configuration review are entire job families, and the work rewards being systematic rather than being clever.",
      ],
      contexts: [
        {
          label: "Cloud account",
          body: "The richest place to start, because the baselines are published and the tooling is free. Run Prowler or ScoutSuite against your own account, then — this is the actual work — go through the findings and decide which ones matter here. A tool's output is not an audit; your judgement about it is.",
        },
        {
          label: "Network",
          body: "Audit against a segmentation policy: what is supposed to reach what? Then test from inside each segment. The gap between the intended policy and the observed reachability is the report.",
        },
        {
          label: "Process",
          body: "How does your team handle credentials, onboarding, backups? Write the process down as it is actually performed, not as documented, then measure it against something like the CIS controls. Unglamorous and genuinely useful.",
        },
        {
          label: "Firmware",
          body: "A firmware audit is a sweep for known-bad patterns across the whole image: hardcoded credentials, debug interfaces left enabled, outdated libraries, world-writable files, missing signature verification. Completeness across the filesystem, not depth on one binary.",
        },
        {
          label: "Web application",
          body: "OWASP ASVS is a ready-made audit scope with three levels. Work down it and record pass, fail or not-applicable for every requirement — the not-applicables are part of the deliverable.",
        },
      ],
      examples: [
        "Audit your own cloud account against the CIS benchmark for that provider and write up every control with a verdict and a screenshot.",
        "Audit a container image: every layer, what it installs, what it runs as, what secrets ended up baked in.",
        "Audit your club's or project team's credential handling and produce a one-page report with ranked recommendations.",
      ],
    },
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
    detail: {
      overview: [
        "Hardening takes something that works and makes it survive contact with an attacker. The work is three steps and people skip the first and third: record the default configuration, change it, then prove the change actually blocks what you claimed.",
        "That third step is what separates hardening from following a guide. Applying a CIS benchmark top to bottom and declaring victory is a recipe, not a project. Testing one control — showing the attack works before and fails after — is a real finding, and it is often the moment you discover the control didn't do what the guide implied.",
        "Hardening is also the most transferable defensive skill here. Every operations and platform job is partly this, and almost nobody arrives able to demonstrate it.",
      ],
      contexts: [
        {
          label: "A service you self-host",
          body: "The easiest start. Stand it up with defaults, record them, then work through transport security, authentication, the service account's privileges, and what it can reach on the network. Test each one.",
        },
        {
          label: "Linux host",
          body: "systemd's sandboxing directives are most of this and almost nobody uses them. ProtectSystem, PrivateTmp, NoNewPrivileges, restricted capabilities — pick a service, apply them one at a time, and confirm it still works after each.",
        },
        {
          label: "Cloud environment",
          body: "Identity first. Over-permissive roles are the finding in almost every real cloud incident, so hardening here means cutting permissions until something breaks and then adding back only what was needed.",
        },
        {
          label: "A physical device",
          body: "Yes, this works. Segment it, block its outbound calls, put it behind something that logs, disable the services it doesn't need. A camera you can't fully patch can still be contained, and documenting how is a genuine contribution.",
        },
        {
          label: "A badge or credential system",
          body: "You cannot harden the card, but you can harden the system around it — what the reader accepts, whether cloning is detectable, whether there's a second factor. Modelling and documenting that is real work even without changing hardware.",
        },
      ],
      examples: [
        "Take a self-hosted service, apply systemd sandboxing, and demonstrate a specific escape that worked before and fails after.",
        "Build a reference configuration for something your friends run, with the reasoning for each choice written down.",
        "Harden a cloud IAM setup by cutting a role to least privilege, and record everything that broke on the way.",
      ],
    },
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
    detail: {
      overview: [
        "Automating means taking something done by hand and making it run by itself. The value sits in the tedious thing everyone does badly: the check nobody runs weekly, the setup everyone skips, the report someone assembles manually every month.",
        "The discipline is doing it manually first and writing down every command. That transcript is your specification, and it is also how you find out the task is less well-defined than you thought. People who skip this build automation for a process that does not exist.",
        "The bar for a good automation project is that someone else runs it. A script that only works on your machine, with your paths, is a note to yourself.",
      ],
      contexts: [
        {
          label: "A process",
          body: "Onboarding, backups, credential rotation, evidence collection. Start by writing the manual runbook; half the time the runbook alone is the contribution.",
        },
        {
          label: "Cloud environment",
          body: "Scheduled posture checks, tearing down forgotten resources, alerting on a billing threshold. All small, all genuinely useful, all things people mean to do and don't.",
        },
        {
          label: "Network service",
          body: "Automated health and security checks — certificate expiry, exposed ports, configuration drift. A cron job and a script is a perfectly respectable artifact.",
        },
        {
          label: "Web application",
          body: "Wire a scanner or a set of security tests into CI so a regression fails the build. Understanding why each check is there is the part that makes it yours.",
        },
      ],
      examples: [
        "Write a tool that audits a cloud account against five controls you care about and outputs a readable report.",
        "Automate your own lab rebuild so you can destroy and restore it with one command.",
        "Add a CI job to a project you own that fails the build on a specific class of vulnerability, and explain the choice.",
      ],
    },
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
    detail: {
      overview: [
        "Building a detection means writing something that notices when a specific bad thing happens — a rule, a query, a script. It requires understanding the attack well enough to describe the trace it leaves, which is a different and frequently deeper skill than performing the attack.",
        "The method is: perform the technique on a machine you own, collect everything it touched, decide which of those signals is both reliable and rare, then write the rule and test it both ways. A detection that fires on the attack is half done; one that also stays quiet during normal activity is finished.",
        "This is the most direct route into defensive work, and the supply of students who can do it is much smaller than the demand.",
      ],
      contexts: [
        {
          label: "Log data",
          body: "Start here if you have no lab. Published attack telemetry lets you write and test a detection with nothing but a text editor. Pick one ATT&CK technique and build the rule for exactly that.",
        },
        {
          label: "Network service",
          body: "Detection on the wire — unusual protocols, beaconing intervals, DNS that doesn't look like DNS. Capture your own normal traffic first so you know what you're distinguishing from.",
        },
        {
          label: "Process behaviour",
          body: "Host-level: process ancestry, unusual parent-child pairs, a service spawning a shell. Atomic Red Team will perform the technique safely so you can watch what it produces.",
        },
        {
          label: "Cloud environment",
          body: "Detections on control-plane logs — a new access key, a policy change, a resource created in an unused region. Cheap to build, and closely matches what cloud security teams actually do.",
        },
      ],
      examples: [
        "Pick one ATT&CK technique, run its Atomic Red Team test, and write a Sigma rule that catches it.",
        "Build a detection for cloud credential exfiltration through the metadata service, in your own account.",
        "Write a rule for a published log set, then measure its false positive rate against the benign portion.",
      ],
    },
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
    detail: {
      overview: [
        "Instrumenting makes a system tell you what it is doing. You add logging, tracing or a probe where there wasn't one, and collect what comes out. The reward is seeing something that was always happening and was never visible.",
        "The discipline is deciding the question first. Instrument for \"which syscalls does this binary make when it starts\" and you get an answer; instrument for \"everything\" and you get a pile of data nobody will look at, including you. Volume feels like progress and is not.",
        "Observability is also a career path in its own right, and the overlap with security work is nearly total — detection, forensics and performance all depend on someone having instrumented the thing first.",
      ],
      contexts: [
        {
          label: "A process on Linux",
          body: "strace for the quick answer, eBPF and bpftrace when you need it to run continuously without a performance cost. Start with strace on a program you already understand.",
        },
        {
          label: "Network service",
          body: "Add structured logging at the boundaries — what came in, what went out, what was rejected and why. Most services log errors and nothing about normal decisions, which is exactly backwards for investigation.",
        },
        {
          label: "Cloud environment",
          body: "Turn on the audit logging that's off by default, then work out what it actually captures. Almost every cloud incident review starts with discovering something wasn't logged.",
        },
        {
          label: "Embedded device",
          body: "A logic analyzer on a bus is instrumentation — you're making an invisible conversation legible. Same discipline, different layer.",
        },
      ],
      examples: [
        "Trace a program's file access and write up everything it touches that you didn't expect.",
        "Add OpenTelemetry tracing to something you built and find the slowest path through it.",
        "Instrument a service to log every authorization decision, then analyse a week of them.",
      ],
    },
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
    detail: {
      overview: [
        "Measuring means counting something nobody has counted, and publishing both the numbers and the method that produced them. The method is as much the artifact as the result — without it, nobody can trust your data or extend it.",
        "The work is mostly in definitions. What exactly is one row? What counts as a hit? What did you exclude and why? Writing that down before you collect anything is the difference between a dataset and a pile of output.",
        "Be honest about limits in the writeup, before someone else is. Stating what would make your numbers wrong is what makes a student measurement credible rather than dismissible.",
      ],
      contexts: [
        {
          label: "An existing dataset",
          body: "You do not need to collect anything to measure. Published captures and scan data are full of questions nobody has asked, and analysing someone else's well-documented data is a completely legitimate project.",
        },
        {
          label: "Network service",
          body: "Response behaviour, certificate hygiene, version distribution. Scanning at any scale has ethics attached — read how the research scanners handle opt-outs and rate limits before you point anything at the internet.",
        },
        {
          label: "A process",
          body: "How long does something take, how often does it fail, how many steps does it really have? Measuring a human process is undervalued and frequently the most actionable finding a team gets.",
        },
        {
          label: "Protocol",
          body: "How do real implementations differ from the spec? Measuring divergence across implementations is a classic source of genuine findings.",
        },
      ],
      examples: [
        "Measure TLS configuration across a published scan dataset and report the distribution.",
        "Count how long your team's onboarding actually takes, end to end, with the data to back it.",
        "Analyse a public capture corpus for one specific protocol behaviour and publish both the numbers and the script.",
      ],
    },
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
    detail: {
      overview: [
        "Documenting means writing down how something works when nobody has written it down properly. No exploit, no break — a clear account of a thing, good enough that the next person doesn't have to work it out from scratch.",
        "This is the friendliest entry point in the whole tool and it is not a consolation prize. Documentation is the single most common gap in open source, and a good page is more useful to more people than most vulnerabilities. It also happens to be the fastest route to a merged contribution, which makes it a real proof as well as a real project.",
        "The bar is that someone who has never seen the thing can follow you. The test is handing it to exactly that person and watching where they stall.",
      ],
      contexts: [
        {
          label: "An open-source project",
          body: "Follow the install docs exactly as written on a clean machine. Every place they're wrong is a contribution, and maintainers are chronically short of people willing to do this.",
        },
        {
          label: "A protocol",
          body: "Take one layer of a spec and write the explanation you wish you'd had, with a worked byte-by-byte example. Specs are precise and almost never readable.",
        },
        {
          label: "A process",
          body: "Write down how your team actually does something. The gap between the documented process and the performed one is usually the interesting part.",
        },
        {
          label: "A device or firmware",
          body: "A teardown writeup, a pinout, a note on which chip does what. Hardware documentation is scattered and often wrong, and a careful page gets found by everyone who buys that device afterwards.",
        },
        {
          label: "A cloud setup",
          body: "Document the reasoning behind a configuration, not just the configuration. Copied config nobody understands breaks in a month and teaches nothing.",
        },
      ],
      examples: [
        "Fix a project's install instructions after following them on a clean machine, and open the PR.",
        "Write the explainer for a protocol layer you had to learn the hard way, with a decoded example.",
        "Document a device's serial pinout and boot process, with photographs, for a device with no existing writeup.",
      ],
    },
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
    detail: {
      overview: [
        "Visualizing turns data nobody can read into a picture that makes something obvious. A graph of who talked to whom, a timeline of an incident, a map of who can reach what.",
        "It is frequently the fastest way to find something everyone else missed in the same data, because the eye catches structure that a query has to be told to look for. It is also how findings get communicated to people who will never read your table.",
        "The discipline is deciding the one question the picture answers before drawing anything. Plot ten rows by hand first — if the shape tells you nothing at ten rows, it will tell you nothing at ten thousand, and you'll have spent a week on rendering.",
      ],
      contexts: [
        {
          label: "Network data",
          body: "Connection graphs are the classic. Who talks to whom, how often, in what direction — beaconing and lateral movement both have shapes you can see before you can describe them.",
        },
        {
          label: "An incident timeline",
          body: "Merging log sources into one ordered visual account. The hard part is timezone normalization, not drawing.",
        },
        {
          label: "Cloud permissions",
          body: "Permission graphs show escalation paths that are invisible in policy documents, because the path runs through three roles nobody looks at together.",
        },
        {
          label: "A process",
          body: "Flow diagrams of how work actually moves. Often the first time anyone has seen the whole thing on one page, which is itself the finding.",
        },
      ],
      examples: [
        "Build a connection graph from a public capture and identify the beaconing host visually.",
        "Visualize an IAM role graph for your own account and find the longest privilege path.",
        "Turn a published incident's logs into a single annotated timeline anyone could follow.",
      ],
    },
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
    detail: {
      overview: [
        "Comparing puts two things side by side and reports what differs. Two firmware versions, two cloud accounts, two implementations of one protocol, the same app before and after a patch.",
        "Differences are where the interesting things hide, and comparing is far easier than analysing one thing in isolation, because the diff does the narrowing for you. This is how patch analysis works, and it's one of the most productive techniques in the field relative to how simple it is.",
        "The requirement is that the two things be genuinely comparable. Two versions of the same thing teaches; two unrelated things produces noise you'll mistake for signal.",
      ],
      contexts: [
        {
          label: "Firmware versions",
          body: "Download two consecutive releases and diff them. What the vendor quietly fixed is visible in the delta, and often was never mentioned in a changelog.",
        },
        {
          label: "Binaries",
          body: "Patch diffing: compare the vulnerable and patched build to locate the fix, then reason backwards to the bug. This is a professional technique and it is learnable at student scale.",
        },
        {
          label: "Cloud accounts",
          body: "Compare a hardened account against a default one, control by control. It turns an abstract baseline into a concrete list of what actually changes.",
        },
        {
          label: "Protocol implementations",
          body: "Two clients speaking the same protocol rarely agree at the edges. The disagreements are where parsing bugs and request smuggling live.",
        },
        {
          label: "Datasets",
          body: "Compare the same measurement across time or across sources and report what moved. Good projects come out of noticing a change nobody announced.",
        },
      ],
      examples: [
        "Diff two firmware releases of a consumer router and identify what the vendor silently changed.",
        "Patch-diff a public CVE fix in an open-source project and write up how the bug worked.",
        "Compare a default and a hardened container image layer by layer and quantify the difference.",
      ],
    },
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
    detail: {
      overview: [
        "Recovering means getting back something deleted, corrupted, or hidden — deleted files, a damaged archive, data in a format nothing still reads. It is unusually satisfying because the result is binary: you got it back or you didn't.",
        "The absolute rule is that you work on a copy. Image it, hash it, work on the image. This is not bureaucratic — recovery attempts routinely make the original worse, and the discipline is the same one professional forensics runs on.",
        "It is also a friendly path into forensics, because the goal is concrete and the feedback is immediate.",
      ],
      contexts: [
        {
          label: "A disk or volume",
          body: "Deleted file recovery, carving from unallocated space, rebuilding a broken partition table. PhotoRec and TestDisk are free and will teach you the concepts on a USB stick you deliberately wiped.",
        },
        {
          label: "A memory image",
          body: "Recovering what never touched disk — process memory, keys, network state, injected code. Nothing to install beyond one tool, and published images to practise on.",
        },
        {
          label: "A file format",
          body: "A corrupted archive or document where the header is damaged but the data is intact. Repairing it means understanding the format, which is the actual lesson.",
        },
        {
          label: "Firmware",
          body: "Recovering a bricked device, or extracting a filesystem from a partial dump. Verification matters — read twice and compare before trusting either read.",
        },
      ],
      examples: [
        "Wipe a USB stick deliberately, then recover the files and document exactly which ones survived and why.",
        "Pull credentials or process state out of a published memory image and write up the method.",
        "Repair a deliberately corrupted archive by hand in a hex editor and explain the format as you go.",
      ],
    },
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
    detail: {
      overview: [
        "Simulating builds a model of a system you can't or shouldn't touch directly, then experiments on the model. Useful when the real thing is expensive, fragile, in use, or off limits — and it makes the experiment repeatable for everyone who comes after you.",
        "Decide the one behaviour your model must get right. Everything else can be wrong in the first version. Models that try to be faithful everywhere become the project, and no experiment ever gets run on them.",
        "A good simulation is also a teaching artifact: it lets other people reproduce your result without the hardware or the access you had.",
      ],
      contexts: [
        {
          label: "A network",
          body: "Containerlab or Mininet will give you a multi-node topology on a laptop. The right way to test segmentation, routing attacks or detection coverage without touching anything real.",
        },
        {
          label: "A protocol",
          body: "Implement enough of both ends to exchange one real message, then start breaking it. You control both sides, so you can test the failure you're interested in.",
        },
        {
          label: "An embedded system",
          body: "Emulate the firmware rather than buying the device. QEMU will run a lot of router and IoT images, and emulation makes the debugger attachable in a way hardware often doesn't.",
        },
        {
          label: "A cloud environment",
          body: "Model the account structure locally or in a throwaway account so you can deploy the bad configuration on purpose and then go find it.",
        },
      ],
      examples: [
        "Build a three-segment network in Containerlab and demonstrate that your firewall rules hold.",
        "Emulate a router firmware image in QEMU and get a shell on it without owning the router.",
        "Write a minimal server for a protocol and use it to test how clients handle malformed responses.",
      ],
    },
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
    detail: {
      overview: [
        "Bridging makes two things talk that were never built to. Putting a protocol behind an interface something else can use, getting a closed device to speak to open software, translating between two formats.",
        "Bridges are small, finishable and unusually useful to other people, which makes them one of the best shapes for a first real tool. They also force genuine understanding of both ends, because a bridge that half-understands the protocol fails in ways you can see.",
        "Get one specific message across end to end before you design anything general. The general-purpose bridge designed up front is the one that never ships.",
      ],
      contexts: [
        {
          label: "Protocol to modern interface",
          body: "Wrap something old or proprietary in a clean API. This is most of what integration work is, and it's immediately useful to anyone else with that device.",
        },
        {
          label: "Closed device to open software",
          body: "Get a vendor-locked device reporting into something you control. Home automation is full of these and they get real users fast.",
        },
        {
          label: "Network service",
          body: "Sit between a client and a server, translate or rewrite, and you can both understand and modify the conversation. mitmproxy is built exactly for this.",
        },
        {
          label: "Embedded",
          body: "Serial to network, one bus to another. Physically small projects that teach the protocol properly.",
        },
      ],
      examples: [
        "Write a bridge that exposes a closed device's data over a standard interface.",
        "Build a mitmproxy addon that rewrites one specific field and observe how the client reacts.",
        "Translate between two capture formats so tooling from one ecosystem works on the other's data.",
      ],
    },
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
    detail: {
      overview: [
        "Reimplementing means writing your own version of something that already exists, from the specification or from the original's behaviour. You learn a format or protocol properly by building something that speaks it — reading about it does not produce the same understanding, and everyone who has done both knows it.",
        "Start with the smallest possible parser for the first few bytes. Get those right before anything else. The instinct to design the whole thing first is the one that kills these projects.",
        "The last twenty percent — the edge cases, the weird flag, the version nobody documents — is where the real understanding lives. Reimplementing the easy eighty percent and stopping is the standard failure.",
      ],
      contexts: [
        {
          label: "A protocol",
          body: "MQTT's core spec is readable in an afternoon and implementing a client is a genuinely achievable term project. Pick something small and finished rather than something huge and current.",
        },
        {
          label: "A file format",
          body: "Write a parser for a format you reversed. Kaitai Struct lets you describe the format declaratively and generate parsers, which keeps the focus on understanding rather than on plumbing.",
        },
        {
          label: "A binary's logic",
          body: "Reimplement one function you reverse engineered, in a language you know, and check it produces identical output. That check is the proof you understood it.",
        },
        {
          label: "A tool",
          body: "Write your own minimal version of a tool you use daily. Small scope, and you will never again be confused about what it does.",
        },
      ],
      examples: [
        "Write an MQTT client from the spec that can publish and subscribe against a real broker.",
        "Build a parser for a game save format you reversed, and a writer that the game accepts.",
        "Reimplement a checksum or obfuscation routine from a binary and verify it byte for byte.",
      ],
    },
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
    detail: {
      overview: [
        "Porting makes something run where it didn't — a tool on a new platform, an old exploit against a current version, a library on an architecture it never targeted. You inherit a working design and spend your time on the part that actually teaches.",
        "Build the original on its own platform first. Without a working reference you cannot tell a port bug from a you bug, and you will burn days on the difference.",
        "Most porting pain is build pain, which is why this pattern doubles as the best possible way to get good at build systems — a skill that gates an enormous amount of security work and that almost nobody learns deliberately.",
      ],
      contexts: [
        {
          label: "An old exploit to a current target",
          body: "Take a public proof of concept for an old CVE and make it work against a version it wasn't written for. You learn exactly what the fix changed and what the exploit actually depended on.",
        },
        {
          label: "A tool to a new platform",
          body: "Make something Linux-only build and run elsewhere, or vice versa. Unglamorous, immediately useful, and very likely to be merged.",
        },
        {
          label: "Across architectures",
          body: "Build for a different CPU architecture and find every place the original assumed word size or endianness. QEMU lets you test without the hardware.",
        },
        {
          label: "A process to a new team",
          body: "Porting is not only code. Taking a workflow that works for one team and making it fit another is the same skill applied to people.",
        },
      ],
      examples: [
        "Port a public exploit for an old CVE to a newer version of the same software and document what changed.",
        "Make a tool you use build cleanly on a platform its maintainers don't test, and upstream the fix.",
        "Cross-compile a utility for a router's architecture and get it running on the device.",
      ],
    },
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
    detail: {
      overview: [
        "Analyzing firmware means getting the code that runs on a device and reading it. Unpack the image, find the filesystem, look at what the vendor shipped — hardcoded keys, forgotten debug shells, update logic that trusts too much, libraries five years out of date.",
        "You do not need the device. Vendors publish update files on their own support pages, and an enormous amount of real work happens with nothing but a download and a laptop. This is the cheapest possible entry into embedded security.",
        "Extraction is the setup, not the finding. \"binwalk extracted some files\" is where the project starts. Pick one binary out of that filesystem and actually read it.",
      ],
      contexts: [
        {
          label: "A published update file",
          body: "The standard path. Download, binwalk, find the root filesystem, then look at the startup scripts and the web interface binaries — that's where vendor shortcuts live.",
        },
        {
          label: "Two versions",
          body: "Diff consecutive releases. Silent security fixes show up in the delta and are frequently undocumented, which makes them worth writing about.",
        },
        {
          label: "An emulated image",
          body: "QEMU can run a lot of extracted firmware, which gets you a debugger and a shell without any hardware at all.",
        },
        {
          label: "A dumped image",
          body: "When the vendor publishes nothing, the image comes off the chip. That needs a clip and a programmer, and it is the only part of this pattern that costs money.",
        },
      ],
      examples: [
        "Download a router firmware image, extract it, and audit the startup scripts for anything that runs as root without checking input.",
        "Diff two firmware versions and write up a fix the vendor never announced.",
        "Emulate an extracted image and find a flaw in its web interface without owning the device.",
      ],
    },
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
    detail: {
      overview: [
        "Tearing down means opening a physical thing and documenting what is inside. Identify the chips, find the test points, work out how the parts talk to each other. The output is a map of a device that nobody published a map of.",
        "This is the most hands-on pattern here and the one with the highest setup cost, so it's honest to say: it is not for everyone, and nothing else in this tool depends on it. If physical devices are what draw you in, it's the best possible start. If they aren't, the rest of the list has plenty.",
        "Photograph every layer as you go. The standard failure is taking something apart in one evening with no pictures and then being unable to reassemble it or write about it.",
      ],
      contexts: [
        {
          label: "A cheap network device",
          body: "Cameras, plugs and routers are the classic teaching targets: real embedded Linux, a real network stack, and a vendor who spent nothing on security.",
        },
        {
          label: "An old router from a closet",
          body: "Free, end-of-life, and usually has a serial header the vendor forgot to remove. The best first teardown there is.",
        },
        {
          label: "A dev board",
          body: "Not a victim, a laboratory. You write the firmware, so you can build the exact behaviour you want to study and can't break anything that matters.",
        },
        {
          label: "Before you open it",
          body: "Search the FCC ID first. The filing often contains internal photographs, so you can see the board and plan the teardown before you buy the device.",
        },
      ],
      examples: [
        "Buy a cheap IP camera, photograph every layer of the teardown, identify the main SoC and flash chip, and publish the board map.",
        "Find the serial console on an old router and document the boot process and pinout.",
        "Write the teardown page that doesn't exist yet for a device you already own.",
      ],
    },
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
