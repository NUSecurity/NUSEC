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
 * Three domains are deep at launch. Five are stubs that say so. A half-built
 * tool that admits it is credible; one that pretends to cover eight domains and
 * delivers three links each is not.
 */
const domains: Domain[] = [
  /* ---------------------------------------------------------------- *
   * Deep
   * ---------------------------------------------------------------- */
  {
    id: "DOM-OFFSEC",
    name: "Offensive",
    depth: "deep",
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
        last_verified: null,
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
    depth: "stub",
    brief:
      "Working out what a program does without its source — reading disassembly, navigating stripped binaries, and recovering undocumented formats.",
    first_move:
      "Open any small binary in Ghidra and find `main`. Do that once and the domain stops being abstract.",
    failure_mode:
      "Leaning entirely on the decompiler. It's a hypothesis, not a transcript, and it's confidently wrong often enough to matter.",
    resources: [],
  },
  {
    id: "DOM-DFIR",
    name: "Forensics and Response",
    depth: "stub",
    brief:
      "Finding out what happened after something went wrong — acquiring evidence intact, building timelines, and analyzing memory and suspicious files.",
    first_move:
      "Download a published memory image and list its running processes. One command, and you've started.",
    failure_mode:
      "Working on the original evidence. Image it, hash it, work on the copy — the habit matters more than any tool.",
    resources: [],
  },
  {
    id: "DOM-CLOUD",
    name: "Cloud",
    depth: "stub",
    brief:
      "Security in someone else's datacenter — identity and permissions, baselines, and the metadata services that turn a small flaw into a large one.",
    first_move:
      "Open your cloud account's IAM console and read one policy attached to your own user.",
    failure_mode:
      "Learning a provider's product catalogue instead of its permission model. Identity is where the security actually lives.",
    resources: [],
  },
  {
    id: "DOM-NETWORK",
    name: "Networking",
    depth: "stub",
    brief:
      "Understanding what's actually on the wire — reading captures, intercepting TLS deliberately, and proving that segmentation does what it claims.",
    first_move:
      "Start Wireshark, load a browser tab, and find the DNS query for the site you visited.",
    failure_mode:
      "Reading about protocols instead of looking at them. Twenty minutes with a capture beats a chapter.",
    resources: [],
  },
  {
    id: "DOM-APPSEC",
    name: "Application Security",
    depth: "stub",
    brief:
      "Finding problems in software before it ships — threat modeling, targeted code review, and fuzzing.",
    first_move:
      "Draw the data flow of something you built on one sheet of paper, and mark where data crosses a trust boundary.",
    failure_mode:
      "Reviewing code for everything at once. Pick one vulnerability class and sweep for only that.",
    resources: [],
  },
];

export default domains;
