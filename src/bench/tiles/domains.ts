import { Domain } from "@/bench/types";
import { V_2026_09 } from "./verified";

/**
 * The 8 domains, which own the pooled resources.
 *
 * Pooling is the sustainability design. A per-skill link list means 1,000+
 * entries, which is not a curation problem but a decay problem — it would make
 * this tool worse than nothing inside two years, because stale club
 * recommendations teach students the club isn't paying attention. One pool per
 * domain serves all of its skills; skills carry only what is unique to them.
 *
 * Every pool is slot-capped by resource type (see resourceTypeCaps). Fifteen
 * slotted beats twenty flat — the cap is a feature, because it forces the
 * curator to pick, and the picking is the service.
 *
 * All eight domains ship a curated pool. The launch plan was three deep and
 * five honestly-labelled stubs, but a student who picks a stubbed skill and
 * finds nothing has hit a dead end, and a dead end reads as neglect however
 * politely it is worded. The `depth: "stub"` state and its contribute copy stay
 * in the schema for any domain added later.
 */
const domains: Domain[] = [
  /* ---------------------------------------------------------------- *
   * Deep
   * ---------------------------------------------------------------- */
  {
    id: "DOM-OFFSEC",
    name: "Offensive",
    depth: "deep",
    detail: {
      overview: [
        "Finding and exploiting flaws in systems, then explaining them to the people who have to fix them. The highest-demand domain among students and the one with the richest free practice ecosystem — you can go a long way here without spending anything.",
        "The people who get good at this enumerate the same way every time and can say why. Collecting tools instead of building method is the standard trap, and it's visible instantly in an interview.",
        "It is also the domain where the writing matters most and gets practised least. Access without a report anyone can act on is worth very little commercially.",
      ],
      examples: [
        "PortSwigger Academy for web, TryHackMe then HackTheBox for boxes, pwn.college if you want depth.",
        "Practise writing one finding for every box you solve.",
      ],
    },
    brief:
      "Finding and exploiting flaws in systems, then explaining them to the people who have to fix them. The highest-demand domain among students and the one with the richest free practice ecosystem.",
    first_move:
      "Do one PortSwigger Academy lab end to end tonight. It's free, it runs in a browser, and it takes twenty minutes.",
    failure_mode:
      "Collecting tools instead of building method. The people who get good enumerate the same way every time and can say why.",
    resources: [
      {
        title: "Penetration Testing — Georgia Weidman",
        url: "https://nostarch.com/pentesting",
        type: "foundation",
        note: "The book that assumes you know nothing and builds a working method. Still the best single starting text.",
        last_verified: V_2026_09,
        paid: true,
      },
      {
        title: "OWASP Web Security Testing Guide",
        url: "https://owasp.org/www-project-web-security-testing-guide/",
        type: "foundation",
        note: "Free, and the closest thing the field has to an agreed methodology. Read it for structure, not for technique.",
        last_verified: V_2026_09,
      },
      {
        title: "PortSwigger Web Security Academy",
        url: "https://portswigger.net/web-security",
        type: "hands-on",
        note: "Free, browser-based, and written by the people who make Burp. The single highest-value free resource in this domain.",
        last_verified: V_2026_09,
      },
      {
        title: "TryHackMe",
        url: "https://tryhackme.com/",
        type: "hands-on",
        note: "Guided rooms with hints. The right platform when you're still learning what to try.",
        last_verified: V_2026_09,
      },
      {
        title: "Hack The Box",
        url: "https://www.hackthebox.com/",
        type: "hands-on",
        note: "Unguided boxes. Move here once TryHackMe rooms stop teaching you anything.",
        last_verified: V_2026_09,
      },
      {
        title: "pwn.college",
        url: "https://pwn.college/",
        type: "hands-on",
        note: "A free university course in offensive security, with real lectures and graded practice. Far deeper than the platforms.",
        last_verified: V_2026_09,
      },
      {
        title: "HackTricks",
        url: "https://book.hacktricks.wiki/",
        type: "reference",
        note: "The thing everyone actually keeps open. Checklists per service and per privilege-escalation path.",
        last_verified: null,
      },
      {
        title: "GTFOBins",
        url: "https://gtfobins.github.io/",
        type: "reference",
        note: "Which ordinary Unix binaries can be abused, and exactly how. Open it every time you see an unusual sudo rule.",
        last_verified: V_2026_09,
      },
      {
        title: "PayloadsAllTheThings",
        url: "https://github.com/swisskyrepo/PayloadsAllTheThings",
        type: "reference",
        note: "Payloads and bypasses by vulnerability class. Use it after you understand the bug, not instead.",
        last_verified: V_2026_09,
      },
      {
        title: "VulnHub",
        url: "https://www.vulnhub.com/",
        type: "corpus",
        note: "Downloadable vulnerable VMs you run locally. Free, offline, and yours to break.",
        last_verified: V_2026_09,
      },
      {
        title: "OWASP Juice Shop",
        url: "https://owasp.org/www-project-juice-shop/",
        type: "corpus",
        note: "A modern vulnerable web app with every bug class in it. One docker command to run.",
        last_verified: V_2026_09,
      },
      {
        title: "DVWA",
        url: "https://github.com/digininja/DVWA",
        type: "corpus",
        note: "Older and blunter than Juice Shop, which makes it better for isolating one bug class at a time.",
        last_verified: V_2026_09,
      },
      {
        title: "Exploit-DB archive (GitLab)",
        url: "https://gitlab.com/exploit-database/exploitdb",
        type: "corpus",
        note: "Real exploit code to read. Read the exploits for bugs you already understand — that's where it teaches.",
        last_verified: V_2026_09,
      },
      {
        title: "r/netsec",
        url: "https://www.reddit.com/r/netsec/",
        type: "community",
        note: "Where the research gets posted. Read it to find out what's happening, not to ask beginner questions.",
        last_verified: V_2026_09,
      },
      {
        title: "Information Security Stack Exchange",
        url: "https://security.stackexchange.com/",
        type: "community",
        note: "Where to ask a specific, well-formed question and get a serious answer.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "DOM-LINUX",
    name: "Systems",
    depth: "deep",
    detail: {
      overview: [
        "Being genuinely comfortable on a Linux system — the shell, services, processes, building from source. Everyone needs it, nobody teaches it deliberately, and it quietly gates most of the other domains.",
        "The people who are good at this learned the model, not a list of commands. They know where things live and why, so they can derive the command they don't remember.",
        "If you're unsure where to start in security generally, start here. Nothing else you learn will be wasted.",
      ],
      examples: [
        "OverTheWire Bandit until the levels stop being puzzles.",
        "Run one real internet-facing server for a month and fix everything that breaks.",
      ],
    },
    brief:
      "Being genuinely comfortable on a Linux system — the shell, services, processes, and building things from source. Everyone needs it, and nobody teaches it deliberately.",
    first_move:
      "Open a terminal and do one thing you'd normally do in a GUI. Today, not as a project.",
    failure_mode:
      "Memorizing commands instead of learning the model. People who are good at this know where things live and why, so they can work out the command.",
    resources: [
      {
        title: "The Linux Command Line — William Shotts",
        url: "https://linuxcommand.org/tlcl.php",
        type: "foundation",
        note: "Free PDF, and the best structured introduction to the shell there is. Start here if you start anywhere.",
        last_verified: V_2026_09,
      },
      {
        title: "How Linux Works — Brian Ward",
        url: "https://nostarch.com/howlinuxworks3",
        type: "foundation",
        note: "The layer under the commands: boot, processes, devices, networking. Read after you're comfortable in the shell.",
        last_verified: V_2026_09,
        paid: true,
      },
      {
        title: "OverTheWire: Bandit",
        url: "https://overthewire.org/wargames/bandit/",
        type: "hands-on",
        note: "Thirty-odd levels of shell puzzles over SSH. The fastest way to go from tentative to fluent.",
        last_verified: V_2026_09,
      },
      {
        title: "Linux Journey",
        url: "https://linuxjourney.com/",
        type: "hands-on",
        note: "Short free lessons with checks. Good for filling specific gaps rather than reading front to back.",
        last_verified: V_2026_09,
      },
      {
        title: "Linux Upskill Challenge",
        url: "https://linuxupskillchallenge.org/",
        type: "hands-on",
        note: "Twenty days of running an actual internet-facing server. Teaches administration rather than commands.",
        last_verified: V_2026_09,
      },
      {
        title: "Linux From Scratch",
        url: "https://www.linuxfromscratch.org/",
        type: "hands-on",
        note: "Build a distribution by hand. Enormous and worth it once — you stop guessing about what's underneath.",
        last_verified: V_2026_09,
      },
      {
        title: "Linux man pages (man7.org)",
        url: "https://man7.org/linux/man-pages/",
        type: "reference",
        note: "The authoritative pages, readable in a browser. Michael Kerrisk's versions are better than most distros'.",
        last_verified: V_2026_09,
      },
      {
        title: "Arch Wiki",
        url: "https://wiki.archlinux.org/",
        type: "reference",
        note: "The best Linux documentation on the internet, and mostly distro-agnostic despite the name.",
        last_verified: V_2026_09,
      },
      {
        title: "explainshell",
        url: "https://explainshell.com/",
        type: "reference",
        note: "Paste a command line and it breaks down every flag. Use it on commands you copied before you run them.",
        last_verified: V_2026_09,
      },
      {
        title: "systemd(1) manual",
        url: "https://man7.org/linux/man-pages/man1/systemd.1.html",
        type: "corpus",
        note: "The primary source for units, timers and targets. Dense, but everything else about systemd is a summary of this.",
        last_verified: V_2026_09,
      },
      {
        title: "Debian Code Search",
        url: "https://codesearch.debian.net/",
        type: "corpus",
        note: "Search the source of every packaged program without cloning anything. Invaluable when you need to know what a binary actually does.",
        last_verified: V_2026_09,
      },
      {
        title: "Filesystem Hierarchy Standard",
        url: "https://refspecs.linuxfoundation.org/fhs.shtml",
        type: "corpus",
        note: "Why files live where they live. Short, and it turns the filesystem from arbitrary into designed.",
        last_verified: V_2026_09,
      },
      {
        title: "Unix & Linux Stack Exchange",
        url: "https://unix.stackexchange.com/",
        type: "community",
        note: "Deep, careful answers to specific questions. Search before asking; it's usually already there.",
        last_verified: V_2026_09,
      },
      {
        title: "r/linuxquestions",
        url: "https://www.reddit.com/r/linuxquestions/",
        type: "community",
        note: "Lower stakes than Stack Exchange for questions you can't phrase precisely yet.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "DOM-HW",
    name: "Hardware",
    depth: "deep",
    detail: {
      overview: [
        "Getting inside physical devices — finding debug interfaces, reading chips, decoding buses. The only domain here with a real hardware cost, and the one fewest students pursue.",
        "That scarcity is the argument for it if it appeals to you: almost nobody applying for a job can do this, and the entry cost is about twelve dollars for a UART adapter. It is genuinely not for everyone, and nothing else in this tool depends on it.",
        "Adapter first, one device, one finding. Buying a full bench before doing a small project is how the money gets wasted.",
      ],
      examples: [
        "Microcorruption in a browser, free, before buying anything at all.",
        "An old router from a closet, a $12 adapter, and one serial console.",
      ],
    },
    brief:
      "Getting inside physical devices — finding debug interfaces, reading chips, decoding buses. This is the club's differentiator: no other student career tool has a hardware path.",
    first_move:
      "Order a USB-UART adapter. It's about $12 and nothing else in this domain starts without it.",
    failure_mode:
      "Buying a full bench before doing a single project. Adapter first, one device, one finding — then decide what else you need.",
    resources: [
      {
        title: "The Hardware Hacking Handbook",
        url: "https://nostarch.com/hardwarehacking",
        type: "foundation",
        note: "The serious text on embedded attacks, including fault injection and side channels. Dense and worth it.",
        last_verified: V_2026_09,
        paid: true,
      },
      {
        title: "Practical IoT Hacking",
        url: "https://nostarch.com/practical-iot-hacking",
        type: "foundation",
        note: "More approachable than the Handbook and closer to what a first device project actually involves.",
        last_verified: V_2026_09,
        paid: true,
      },
      {
        title: "Microcorruption",
        url: "https://microcorruption.com/",
        type: "hands-on",
        note: "An embedded CTF in the browser — a real MSP430 debugger against a lock. Free, and the best on-ramp to embedded reversing anywhere.",
        last_verified: null,
      },
      {
        title: "OWASP IoTGoat",
        url: "https://github.com/OWASP/IoTGoat",
        type: "hands-on",
        note: "A deliberately vulnerable firmware image you can run emulated. Practise firmware analysis with no hardware at all.",
        last_verified: V_2026_09,
      },
      {
        title: "Damn Vulnerable Router Firmware",
        url: "https://github.com/praetorian-inc/DVRF",
        type: "hands-on",
        note: "Router firmware built to be exploited, with the MIPS toolchain work included. The bridge from x86 to embedded.",
        last_verified: V_2026_09,
      },
      {
        title: "sigrok / PulseView",
        url: "https://sigrok.org/wiki/PulseView",
        type: "reference",
        note: "Free logic analyzer software with protocol decoders for most buses you'll meet. Works with $10 analyzers.",
        last_verified: V_2026_09,
      },
      {
        title: "flashrom",
        url: "https://www.flashrom.org/",
        type: "reference",
        note: "Reads and writes flash chips, with a supported-hardware list worth checking before you buy a programmer.",
        last_verified: V_2026_09,
      },
      {
        title: "binwalk",
        url: "https://github.com/ReFirmLabs/binwalk",
        type: "reference",
        note: "First command you run on any firmware image. Finds embedded filesystems and compressed blobs.",
        last_verified: V_2026_09,
      },
      {
        title: "FCC ID search",
        url: "https://www.fcc.gov/oet/ea/fccid",
        type: "corpus",
        note: "Internal photographs and test reports for almost any radio device sold in the US. You can see the board before you buy it.",
        last_verified: V_2026_09,
      },
      {
        title: "OpenWrt Table of Hardware",
        url: "https://openwrt.org/toh/start",
        type: "corpus",
        note: "Chipset, flash size and serial pinout for thousands of routers. Check here before picking a target device.",
        last_verified: null,
      },
      {
        title: "Octopart",
        url: "https://octopart.com/",
        type: "corpus",
        note: "Search a part number from a chip you found and get the datasheet. The fastest path from marking to document.",
        last_verified: V_2026_09,
      },
      {
        title: "EEVblog Forum",
        url: "https://www.eevblog.com/forum/",
        type: "community",
        note: "Electronics people who will tell you what that component is from a bad photo. Search first, they've seen it.",
        last_verified: V_2026_09,
      },
      {
        title: "r/AskElectronics",
        url: "https://www.reddit.com/r/AskElectronics/",
        type: "community",
        note: "Good for 'what is this part' and 'why did this not work' questions with a photo attached.",
        last_verified: V_2026_09,
      },
    ],
  },

  /* ---------------------------------------------------------------- *
   * Stubs — honestly labeled
   * ---------------------------------------------------------------- */
  {
    id: "DOM-RE",
    name: "Reverse Engineering",
    depth: "deep",
    detail: {
      overview: [
        "Working out what a program does without its source — reading disassembly, navigating stripped binaries, recovering undocumented formats.",
        "The decompiler is a hypothesis, not a transcript. It is confidently wrong often enough that being unable to check it against the assembly is a real limitation.",
        "Slower to become useful in than the other domains, and unusually satisfying once it clicks. Start below your level and climb.",
      ],
      examples: [
        "Compile small C functions and read their assembly until the patterns are familiar.",
        "crackmes.one one level below where you think you are.",
      ],
    },
    brief:
      "Working out what a program does without its source — reading disassembly, navigating stripped binaries, and recovering undocumented formats.",
    first_move:
      "Open any small binary in Ghidra and find `main`. Do that once and the domain stops being abstract.",
    failure_mode:
      "Leaning entirely on the decompiler. It's a hypothesis, not a transcript, and it's confidently wrong often enough to matter.",
    resources: [
      {
        title: "Reverse Engineering for Beginners",
        url: "https://beginners.re/",
        type: "foundation",
        note: "A free 1,000-page book that starts from 'what is a register'. Read the first hundred pages and assembly stops being frightening.",
        last_verified: V_2026_09,
      },
      {
        title: "Practical Malware Analysis",
        url: "https://nostarch.com/malware",
        type: "foundation",
        note: "The standard text. Older, but nothing has replaced it for learning the workflow rather than the tools.",
        last_verified: V_2026_09,
        paid: true,
      },
      {
        title: "crackmes.one",
        url: "https://crackmes.one/",
        type: "hands-on",
        note: "Thousands of binaries built to be reversed, rated by difficulty. Start one below where you think you are.",
        last_verified: V_2026_09,
      },
      {
        title: "ROP Emporium",
        url: "https://ropemporium.com/",
        type: "hands-on",
        note: "Return-oriented programming taught one concept at a time, with the binaries supplied. Unusually well designed.",
        last_verified: V_2026_09,
      },
      {
        title: "Nightmare",
        url: "https://guyinatuxedo.github.io/",
        type: "hands-on",
        note: "A free binary exploitation course built from real CTF challenges, worked through end to end.",
        last_verified: V_2026_09,
      },
      {
        title: "Flare-On challenges",
        url: "https://flare-on.com/",
        type: "hands-on",
        note: "Mandiant's annual reversing competition. Every past year stays up, with solutions — a free graded curriculum.",
        last_verified: V_2026_09,
      },
      {
        title: "Ghidra",
        url: "https://github.com/NationalSecurityAgency/ghidra",
        type: "reference",
        note: "The NSA's decompiler, free and genuinely good. The tool most of this domain assumes you have open.",
        last_verified: V_2026_09,
      },
      {
        title: "x86 and amd64 instruction reference",
        url: "https://www.felixcloutier.com/x86/",
        type: "reference",
        note: "What that instruction actually does, without opening the Intel manual. Keep it in a tab.",
        last_verified: V_2026_09,
      },
      {
        title: "Compiler Explorer",
        url: "https://godbolt.org/",
        type: "reference",
        note: "Type C on the left, watch the assembly on the right. The fastest way to build intuition for compiled code.",
        last_verified: V_2026_09,
      },
      {
        title: "Awesome Reversing",
        url: "https://github.com/tylerha97/awesome-reversing",
        type: "corpus",
        note: "A maintained index of tools, courses and challenge sites. Where to look when this pool doesn't have it.",
        last_verified: V_2026_09,
      },
      {
        title: "OpenSecurityTraining2",
        url: "https://ost2.fyi/",
        type: "corpus",
        note: "Free university-level courses on architecture, assembly and reversing. Long, and worth it.",
        last_verified: V_2026_09,
      },
      {
        title: "MalwareBazaar",
        url: "https://bazaar.abuse.ch/",
        type: "corpus",
        note: "Real samples, freely available. Only open these in an isolated VM — see the Malware analysis VM kit.",
        last_verified: V_2026_09,
      },
      {
        title: "r/ReverseEngineering",
        url: "https://www.reddit.com/r/ReverseEngineering/",
        type: "community",
        note: "Where the writeups and tooling get posted.",
        last_verified: V_2026_09,
      },
      {
        title: "Reverse Engineering Stack Exchange",
        url: "https://reverseengineering.stackexchange.com/",
        type: "community",
        note: "For specific questions with a concrete binary behind them.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "DOM-DFIR",
    name: "Forensics and Response",
    depth: "deep",
    detail: {
      overview: [
        "Finding out what happened after something went wrong — acquiring evidence intact, building timelines, analysing memory and suspicious files.",
        "The entry cost is near zero: published memory images and log sets mean you can do real work tonight with one tool and no lab. That makes it one of the most accessible domains here and one of the least crowded.",
        "Image it, hash it, work on the copy. The habit matters more than any tool, and it's what distinguishes someone who has been trained from someone who has been watching videos.",
      ],
      examples: [
        "MemLabs for memory, CyberDefenders for full cases, both free.",
        "Build one timeline across two log sources and get the timezones right.",
      ],
    },
    brief:
      "Finding out what happened after something went wrong — acquiring evidence intact, building timelines, and analyzing memory and suspicious files.",
    first_move:
      "Download a published memory image and list its running processes. One command, and you've started.",
    failure_mode:
      "Working on the original evidence. Image it, hash it, work on the copy — the habit matters more than any tool.",
    resources: [
      {
        title: "DFIR Diva — free training",
        url: "https://dfirdiva.com/",
        type: "foundation",
        note: "A curated index of genuinely free DFIR training, maintained by someone who checks it. The best starting map.",
        last_verified: V_2026_09,
      },
      {
        title: "SANS DFIR posters and cheat sheets",
        url: "https://www.sans.org/posters/",
        type: "foundation",
        note: "Free, and the reference professionals actually pin to the wall. Artifact locations, timeline fields, registry keys.",
        last_verified: V_2026_09,
      },
      {
        title: "CyberDefenders",
        url: "https://cyberdefenders.org/",
        type: "hands-on",
        note: "Blue-team labs built from real incident data. The closest thing to practice cases you can do at home.",
        last_verified: V_2026_09,
      },
      {
        title: "Blue Team Labs Online",
        url: "https://blueteamlabs.online/",
        type: "hands-on",
        note: "Investigation challenges with scoring. Good for building the habit of evidencing a conclusion.",
        last_verified: V_2026_09,
      },
      {
        title: "MemLabs",
        url: "https://github.com/stuxnet999/MemLabs",
        type: "hands-on",
        note: "Six memory forensics challenges of increasing difficulty. Free, and the on-ramp to Volatility.",
        last_verified: V_2026_09,
      },
      {
        title: "Malware Traffic Analysis",
        url: "https://www.malware-traffic-analysis.net/",
        type: "hands-on",
        note: "Packet captures from real infections with exercises attached. A decade-deep archive, all free.",
        last_verified: V_2026_09,
      },
      {
        title: "Volatility 3 documentation",
        url: "https://volatility3.readthedocs.io/",
        type: "reference",
        note: "The memory analysis framework's own docs. Read the plugin list once so you know what exists.",
        last_verified: V_2026_09,
      },
      {
        title: "Eric Zimmerman's tools",
        url: "https://ericzimmerman.github.io/",
        type: "reference",
        note: "Free Windows forensics tooling the industry standardized on. Registry, shellbags, jump lists, timelines.",
        last_verified: V_2026_09,
      },
      {
        title: "Autopsy",
        url: "https://www.autopsy.com/",
        type: "reference",
        note: "A free graphical disk forensics platform. The easiest way into disk analysis without a paid suite.",
        last_verified: V_2026_09,
      },
      {
        title: "Digital Corpora",
        url: "https://digitalcorpora.org/",
        type: "corpus",
        note: "Disk images, memory dumps and full scenarios published for research and teaching. Real data, freely usable.",
        last_verified: V_2026_09,
      },
      {
        title: "NIST CFReDS",
        url: "https://cfreds.nist.gov/",
        type: "corpus",
        note: "Reference data sets built specifically to test forensic tools and train analysts.",
        last_verified: V_2026_09,
      },
      {
        title: "MalwareBazaar",
        url: "https://bazaar.abuse.ch/",
        type: "corpus",
        note: "Live samples for triage practice. Isolated VM only.",
        last_verified: V_2026_09,
      },
      {
        title: "r/computerforensics",
        url: "https://www.reddit.com/r/computerforensics/",
        type: "community",
        note: "Practitioners, including people who do this for a living and will say when a method won't hold up.",
        last_verified: V_2026_09,
      },
      {
        title: "This Week in 4n6",
        url: "https://thisweekin4n6.com/",
        type: "community",
        note: "A weekly roundup of DFIR research and tool releases. The cheapest way to stay current.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "DOM-CLOUD",
    name: "Cloud",
    depth: "deep",
    detail: {
      overview: [
        "Security in someone else's datacenter — identity and permissions, baselines, and the metadata services that turn a small flaw into a large one.",
        "Demand substantially exceeds supply here, and the free tier means you can learn nearly all of it in your own account for almost nothing. Set a billing alarm first.",
        "Learn the permission model, not the product catalogue. Identity is where cloud security actually lives, and every real incident review comes back to it.",
      ],
      examples: [
        "flaws.cloud, free, in a browser, this evening.",
        "Deliberately create a bad IAM role in your own account and then go and find it.",
      ],
    },
    brief:
      "Security in someone else's datacenter — identity and permissions, baselines, and the metadata services that turn a small flaw into a large one.",
    first_move:
      "Open your cloud account's IAM console and read one policy attached to your own user.",
    failure_mode:
      "Learning a provider's product catalogue instead of its permission model. Identity is where the security actually lives.",
    resources: [
      {
        title: "AWS Well-Architected — Security Pillar",
        url: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html",
        type: "foundation",
        note: "Free, and the clearest statement of what 'secure' means on a cloud provider. The concepts transfer.",
        last_verified: V_2026_09,
      },
      {
        title: "Cloud Security Alliance guidance",
        url: "https://cloudsecurityalliance.org/research/guidance",
        type: "foundation",
        note: "Provider-neutral. Useful for the shared-responsibility model, which is the thing people get wrong first.",
        last_verified: V_2026_09,
      },
      {
        title: "flaws.cloud",
        url: "http://flaws.cloud/",
        type: "hands-on",
        note: "The classic free AWS security lab — a series of misconfigurations you find by exploring. Do this one first.",
        last_verified: V_2026_09,
      },
      {
        title: "flaws2.cloud",
        url: "http://flaws2.cloud/",
        type: "hands-on",
        note: "The sequel, with an attacker track and a defender track. Containers and IAM this time.",
        last_verified: V_2026_09,
      },
      {
        title: "CloudGoat",
        url: "https://github.com/RhinoSecurityLabs/cloudgoat",
        type: "hands-on",
        note: "Deliberately vulnerable AWS environments you deploy into your own account. Tear them down when you're done.",
        last_verified: V_2026_09,
      },
      {
        title: "IAM Vulnerable",
        url: "https://github.com/BishopFox/iam-vulnerable",
        type: "hands-on",
        note: "Deploys known IAM privilege escalation paths into your account so you can go and find them.",
        last_verified: V_2026_09,
      },
      {
        title: "AWS service authorization reference",
        url: "https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html",
        type: "reference",
        note: "Every action, resource and condition key. The page that answers 'what can this policy actually do'.",
        last_verified: V_2026_09,
      },
      {
        title: "Prowler",
        url: "https://github.com/prowler-cloud/prowler",
        type: "reference",
        note: "Open-source multi-cloud assessment. Read its checks as a written-down baseline, then run it.",
        last_verified: V_2026_09,
      },
      {
        title: "ScoutSuite",
        url: "https://github.com/nccgroup/ScoutSuite",
        type: "reference",
        note: "Multi-cloud auditing that produces a browsable report. Good for a first look at an unfamiliar account.",
        last_verified: V_2026_09,
      },
      {
        title: "Hacking the Cloud",
        url: "https://hackingthe.cloud/",
        type: "corpus",
        note: "An encyclopedia of offensive cloud techniques, each with its defensive counterpart.",
        last_verified: V_2026_09,
      },
      {
        title: "CIS Benchmarks",
        url: "https://www.cisecurity.org/cis-benchmarks",
        type: "corpus",
        note: "The baselines an audit gets measured against. Free after a short sign-up.",
        last_verified: V_2026_09,
      },
      {
        title: "Pacu",
        url: "https://github.com/RhinoSecurityLabs/pacu",
        type: "corpus",
        note: "An AWS exploitation framework. Read its modules to see what a cloud attack path looks like in practice.",
        last_verified: V_2026_09,
      },
      {
        title: "fwd:cloudsec",
        url: "https://fwdcloudsec.org/",
        type: "community",
        note: "A cloud security conference that publishes its talks free. The research here runs ahead of the courses.",
        last_verified: V_2026_09,
      },
      {
        title: "r/aws",
        url: "https://www.reddit.com/r/aws/",
        type: "community",
        note: "For the practical 'why is this not working' questions.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "DOM-NETWORK",
    name: "Networking",
    depth: "deep",
    detail: {
      overview: [
        "Understanding what's actually on the wire — reading captures, intercepting TLS deliberately, and proving segmentation does what it claims.",
        "This underpins detection, forensics and most debugging. Twenty minutes with a real capture teaches more than a chapter about the protocol.",
        "Free in every direction: published captures, free tools, and a network you already own to practise on.",
      ],
      examples: [
        "Capture your own traffic and narrate one TCP stream in plain language.",
        "Build a segmented topology and prove the isolation from inside it.",
      ],
    },
    brief:
      "Understanding what's actually on the wire — reading captures, intercepting TLS deliberately, and proving that segmentation does what it claims.",
    first_move:
      "Start Wireshark, load a browser tab, and find the DNS query for the site you visited.",
    failure_mode:
      "Reading about protocols instead of looking at them. Twenty minutes with a capture beats a chapter.",
    resources: [
      {
        title: "Practical Packet Analysis",
        url: "https://nostarch.com/packetanalysis3",
        type: "foundation",
        note: "The book that teaches you to read a capture rather than to operate Wireshark. Worth buying.",
        last_verified: V_2026_09,
        paid: true,
      },
      {
        title: "Beej's Guide to Network Programming",
        url: "https://beej.us/guide/bgnet/",
        type: "foundation",
        note: "Free, friendly, and the fastest way to understand sockets — which is what every protocol sits on.",
        last_verified: V_2026_09,
      },
      {
        title: "Wireshark sample captures",
        url: "https://wiki.wireshark.org/SampleCaptures",
        type: "hands-on",
        note: "Hundreds of captures covering almost every protocol. Open one, pick a protocol, narrate it.",
        last_verified: V_2026_09,
      },
      {
        title: "Malware Traffic Analysis — exercises",
        url: "https://www.malware-traffic-analysis.net/training-exercises.html",
        type: "hands-on",
        note: "Guided capture analysis with questions and answers. Free, and there are years of them.",
        last_verified: V_2026_09,
      },
      {
        title: "Containerlab",
        url: "https://containerlab.dev/",
        type: "hands-on",
        note: "Spin up a real multi-node network topology from one YAML file. The quickest way to build something you can then segment and test.",
        last_verified: V_2026_09,
      },
      {
        title: "Wireshark documentation",
        url: "https://www.wireshark.org/docs/",
        type: "reference",
        note: "Display filter syntax is the part worth learning properly. Everything else you can look up.",
        last_verified: V_2026_09,
      },
      {
        title: "Wireshark display filter reference",
        url: "https://www.wireshark.org/docs/dfref/",
        type: "reference",
        note: "Every field you can filter on, per protocol. This is the page that turns a capture from scrolling into searching.",
        last_verified: V_2026_09,
      },
      {
        title: "mitmproxy documentation",
        url: "https://docs.mitmproxy.org/stable/",
        type: "reference",
        note: "How to intercept your own TLS deliberately, including the cases that fight back.",
        last_verified: V_2026_09,
      },
      {
        title: "Netresec public pcap index",
        url: "https://www.netresec.com/?page=PcapFiles",
        type: "corpus",
        note: "A maintained index of publicly available capture files, including real attack traffic.",
        last_verified: V_2026_09,
      },
      {
        title: "RFC Editor",
        url: "https://www.rfc-editor.org/",
        type: "corpus",
        note: "The protocols themselves. Reading one RFC properly teaches more than five posts about it.",
        last_verified: V_2026_09,
      },
      {
        title: "Qualys SSL Labs",
        url: "https://www.ssllabs.com/ssltest/",
        type: "corpus",
        note: "Point it at a host you own and read the TLS report. A free education in what the handshake negotiates.",
        last_verified: V_2026_09,
      },
      {
        title: "Network Engineering Stack Exchange",
        url: "https://networkengineering.stackexchange.com/",
        type: "community",
        note: "Specific questions, answered by people who run networks for a living.",
        last_verified: V_2026_09,
      },
      {
        title: "r/networking",
        url: "https://www.reddit.com/r/networking/",
        type: "community",
        note: "Practitioner discussion, and good for sanity-checking a design.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "DOM-APPSEC",
    name: "Application Security",
    depth: "deep",
    detail: {
      overview: [
        "Finding problems in software before it ships — threat modelling, targeted code review, and fuzzing.",
        "The most useful domain if you can already write code, because you already have the hardest prerequisite. It's also the one where a student's own projects are legitimate practice material.",
        "Review for one vulnerability class at a time. Reading a codebase hoping to notice something does not work.",
      ],
      examples: [
        "Threat model something you built, on one page, in twenty minutes.",
        "Sweep one of your own projects for a single bug class.",
      ],
    },
    brief:
      "Finding problems in software before it ships — threat modeling, targeted code review, and fuzzing.",
    first_move:
      "Draw the data flow of something you built on one sheet of paper, and mark where data crosses a trust boundary.",
    failure_mode:
      "Reviewing code for everything at once. Pick one vulnerability class and sweep for only that.",
    resources: [
      {
        title: "OWASP Cheat Sheet Series",
        url: "https://cheatsheetseries.owasp.org/",
        type: "foundation",
        note: "Short, concrete guidance per topic. The most useful free appsec writing there is.",
        last_verified: V_2026_09,
      },
      {
        title: "Threat Modeling: Designing for Security",
        url: "https://shostack.org/books/threat-modeling-book",
        type: "foundation",
        note: "Shostack's book, still the clearest treatment of how to actually run a session.",
        last_verified: V_2026_09,
        paid: true,
      },
      {
        title: "OWASP WebGoat",
        url: "https://owasp.org/www-project-webgoat/",
        type: "hands-on",
        note: "A deliberately insecure app with lessons attached, aimed at developers rather than testers.",
        last_verified: V_2026_09,
      },
      {
        title: "Semgrep Playground",
        url: "https://semgrep.dev/playground",
        type: "hands-on",
        note: "Write a static analysis rule in the browser and watch it match. The fastest way into review automation.",
        last_verified: V_2026_09,
      },
      {
        title: "OSS-Fuzz",
        url: "https://google.github.io/oss-fuzz/",
        type: "hands-on",
        note: "Google's fuzzing infrastructure for open source, with docs on writing your first harness.",
        last_verified: V_2026_09,
      },
      {
        title: "Google Bug Hunter University",
        url: "https://bughunters.google.com/learn",
        type: "hands-on",
        note: "Free material on finding and reporting real bugs, written by the people who triage them all day.",
        last_verified: V_2026_09,
      },
      {
        title: "OWASP ASVS",
        url: "https://owasp.org/ASVS/",
        type: "reference",
        note: "A checklist of what secure actually requires, at three levels. Use it as a review scope.",
        last_verified: V_2026_09,
      },
      {
        title: "CWE list",
        url: "https://cwe.mitre.org/",
        type: "reference",
        note: "The taxonomy of weakness types. Name findings from here and everyone knows what you mean.",
        last_verified: V_2026_09,
      },
      {
        title: "Semgrep registry",
        url: "https://semgrep.dev/r",
        type: "reference",
        note: "Thousands of existing rules. Read the ones for your vulnerability class before writing your own.",
        last_verified: V_2026_09,
      },
      {
        title: "OWASP Threat Dragon",
        url: "https://owasp.org/www-project-threat-dragon/",
        type: "corpus",
        note: "A free threat modeling tool, with example models to pull apart.",
        last_verified: V_2026_09,
      },
      {
        title: "AFL++",
        url: "https://github.com/AFLplusplus/AFLplusplus",
        type: "corpus",
        note: "The fuzzer most research builds on. Its docs are a practical course in fuzzing.",
        last_verified: V_2026_09,
      },
      {
        title: "Awesome Threat Modelling",
        url: "https://github.com/hysnsec/awesome-threat-modelling",
        type: "corpus",
        note: "A maintained index of methods, tools and worked examples.",
        last_verified: V_2026_09,
      },
      {
        title: "OWASP Slack",
        url: "https://owasp.org/slack/invite",
        type: "community",
        note: "Channels per project and per topic, with the people who maintain them in there.",
        last_verified: V_2026_09,
      },
      {
        title: "r/AskNetsec",
        url: "https://www.reddit.com/r/AskNetsec/",
        type: "community",
        note: "Lower-stakes than the research subreddits for questions you're still forming.",
        last_verified: V_2026_09,
      },
    ],
  },
];

export default domains;
