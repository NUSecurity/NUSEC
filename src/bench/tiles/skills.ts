import { Skill } from "@/bench/types";
import { V_2026_09 } from "./verified";

/**
 * The 29 skills, four per deep domain and three or four per stub.
 *
 * Every rung test is phrased as something you did or didn't do. Never a
 * self-rating: students overrate themselves on sliders and underrate themselves
 * on checkboxes, and the checkbox version is the one that produces an honest
 * plan. The UI asks "have you done this?" and never "what level are you?".
 *
 * Skills in the three deep domains carry two or three resources unique to them.
 * Everything general is pooled at the domain — see domains.ts for why.
 */
const skills: Skill[] = [
  /* ---------------------------------------------------------------- *
   * DOM-OFFSEC — deep
   * ---------------------------------------------------------------- */
  {
    id: "SKL-OFFSEC-ENUM",
    domain: "DOM-OFFSEC",
    name: "Enumerate a network methodically",
    brief:
      "Working out what's on a network and what it's running, the same way every time, so you don't miss the one service that mattered. Method beats cleverness here by a wide margin.",
    rungs: {
      recognize:
        "You've read an nmap output and said which services are worth a closer look.",
      use: "You've scanned a target and enumerated every open port's service, following a checklist.",
      build:
        "You've written down your own enumeration methodology and used it on three boxes without skipping steps.",
      teach:
        "You've watched someone else enumerate a box and corrected their method, and they finished it.",
    },
    exercised_by: ["PAT-BREAK", "PAT-AUDIT", "PAT-MEASURE"],
    first_move:
      "Run `nmap -sC -sV` against a box you own and read every line of the output, including the ones you don't understand.",
    failure_mode:
      "Scanning the top 1000 ports, finding nothing, and moving on. The service you needed was on 8443.",
    resources: [
      {
        title: "Nmap Network Scanning (free online)",
        url: "https://nmap.org/book/",
        type: "reference",
        note: "The whole book, free, by nmap's author. Chapter 15 is the one you'll reread.",
        last_verified: V_2026_09,
      },
      {
        title: "AutoRecon",
        url: "https://github.com/AutoRecon/AutoRecon",
        type: "reference",
        note: "Read its source as a written-down methodology, even if you never run it. That's what it's good for.",
        last_verified: V_2026_09,
      },
      {
        title: "0xdf's writeups",
        url: "https://0xdf.gitlab.io/",
        type: "corpus",
        note: "Hundreds of box writeups from someone who enumerates the same way every time. Read three and the pattern appears.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-OFFSEC-WEB",
    domain: "DOM-OFFSEC",
    name: "Exploit the common web vulnerability classes by hand",
    brief:
      "Injection, access control, SSRF, deserialization and the rest — found and exploited manually, without a scanner telling you where to look. By hand is the requirement; a scanner finding it teaches you nothing.",
    rungs: {
      recognize:
        "You've looked at a request and said which vulnerability class to test for, and been right.",
      use: "You've completed PortSwigger Academy labs in at least three different vulnerability classes.",
      build:
        "You've found and exploited a bug in an application nobody told you was vulnerable.",
      teach:
        "You've walked someone through finding their first injection, and they found the next one alone.",
    },
    exercised_by: ["PAT-BREAK", "PAT-AUDIT"],
    first_move:
      "Do one PortSwigger Academy lab tonight in a class you've never tried.",
    failure_mode:
      "Running a scanner and reporting its output. Scanner findings aren't yours and don't survive a follow-up question.",
    resources: [
      {
        title: "OWASP Top Ten",
        url: "https://owasp.org/www-project-top-ten/",
        type: "reference",
        note: "The shared vocabulary. Not a checklist for finding bugs — a vocabulary for naming them once found.",
        last_verified: V_2026_09,
      },
      {
        title: "Burp Suite Community Edition",
        url: "https://portswigger.net/burp/communitydownload",
        type: "reference",
        note: "Free, and the proxy everything else assumes. Learn Repeater before anything else in it.",
        last_verified: V_2026_09,
      },
      {
        title: "SecLists",
        url: "https://github.com/danielmiessler/SecLists",
        type: "corpus",
        note: "The wordlists everyone uses. Knowing which list to pick is most of the skill.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-OFFSEC-PRIVESC",
    domain: "DOM-OFFSEC",
    name: "Escalate privileges on Linux and on Windows",
    brief:
      "Turning a foothold into administrative control. Both operating systems, because the jobs want both and students almost always skip Windows.",
    rungs: {
      recognize:
        "You've spotted a misconfigured sudo rule or service permission in an enumeration output.",
      use: "You've escalated to root or SYSTEM on a practice box with a walkthrough available.",
      build:
        "You've escalated on a box you'd never seen, with no hints, on both Linux and Windows.",
      teach:
        "You've taught someone the enumerate-then-escalate loop and watched them do it unaided.",
    },
    exercised_by: ["PAT-BREAK", "PAT-HARDEN"],
    first_move:
      "On any Linux box you own, run `sudo -l` and `find / -perm -4000 2>/dev/null` and work out what each result would let you do.",
    failure_mode:
      "Running an enumeration script and scrolling past the answer. The script found it; you have to read it.",
    resources: [
      {
        title: "LOLBAS",
        url: "https://lolbas-project.github.io/",
        type: "reference",
        note: "The Windows counterpart to GTFOBins: signed Microsoft binaries that do things they shouldn't.",
        last_verified: V_2026_09,
      },
      {
        title: "PEASS-ng (linPEAS / winPEAS)",
        url: "https://github.com/peass-ng/PEASS-ng",
        type: "reference",
        note: "The standard enumeration scripts. Run them, then read what they checked — that list is the curriculum.",
        last_verified: V_2026_09,
      },
      {
        title: "linux-exploit-suggester",
        url: "https://github.com/The-Z-Labs/linux-exploit-suggester",
        type: "reference",
        note: "Maps a kernel version to known local exploits. Useful, and a reminder to check the kernel early.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-OFFSEC-FINDING",
    domain: "DOM-OFFSEC",
    name: "Write a finding a client would actually act on",
    brief:
      "The part that turns access into value. A finding names the issue, proves it reproducibly, explains the real business impact, and says what to do — written for someone who wasn't there.",
    rungs: {
      recognize:
        "You've read two pentest reports and said which finding was written better, and why.",
      use: "You've written a finding with reproduction steps someone else followed successfully.",
      build:
        "You've written a full report for a box or engagement, with severity ratings you can defend.",
      teach:
        "You've reviewed someone else's finding, sent it back with specific changes, and they improved it.",
    },
    exercised_by: ["PAT-BREAK", "PAT-AUDIT", "PAT-HARDEN"],
    first_move:
      "Take a box you already solved and write one finding from it. One page, with reproduction steps.",
    failure_mode:
      "Writing impact as 'an attacker could gain access'. Say what they'd reach and why that costs the client something.",
    resources: [
      {
        title: "Public pentest report collection",
        url: "https://github.com/juliocesarfort/public-pentesting-reports",
        type: "corpus",
        note: "Hundreds of real reports from real firms. Read three from different firms and the house style becomes obvious.",
        last_verified: V_2026_09,
      },
      {
        title: "CVSS v4.0 calculator",
        url: "https://www.first.org/cvss/calculator/4-0",
        type: "reference",
        note: "How severity gets scored. Score a finding both ways and you'll understand why the metrics are argued about.",
        last_verified: V_2026_09,
      },
    ],
  },

  /* ---------------------------------------------------------------- *
   * DOM-LINUX — deep
   * ---------------------------------------------------------------- */
  {
    id: "SKL-LINUX-SHELL",
    domain: "DOM-LINUX",
    name: "Live in a shell with no GUI available",
    brief:
      "Doing real work over SSH on a machine with no desktop — editing, searching, moving data, managing long-running jobs. Every remote system you'll ever touch is this.",
    rungs: {
      recognize:
        "You know what pipes, redirection and exit codes do when you see them in a command.",
      use: "You've spent a full working session over SSH without reaching for a GUI.",
      build:
        "You've written a script that chains several tools to do something you actually needed done.",
      teach:
        "You've sat with someone during their first serious terminal session and they finished the task.",
    },
    exercised_by: ["PAT-AUTOMATE", "PAT-MEASURE", "PAT-INSTRUMENT"],
    first_move:
      "Do tonight's one GUI task in the terminal instead. Not a tutorial — a real task.",
    failure_mode:
      "Copying commands without reading them. Run them through explainshell until you don't need to.",
    resources: [
      {
        title: "Greg's Wiki — BashGuide",
        url: "https://mywiki.wooledge.org/BashGuide",
        type: "reference",
        note: "The corrective to every bad bash tutorial. Read the pitfalls page especially.",
        last_verified: V_2026_09,
      },
      {
        title: "ShellCheck",
        url: "https://www.shellcheck.net/",
        type: "reference",
        note: "Paste any script and it finds the quoting bug you didn't see. Run it on everything you write.",
        last_verified: V_2026_09,
      },
      {
        title: "tmux wiki",
        url: "https://github.com/tmux/tmux/wiki",
        type: "reference",
        note: "How to keep a session alive across a dropped connection. The first thing to learn for real remote work.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-LINUX-SYSTEMD",
    domain: "DOM-LINUX",
    name: "Read and write systemd units",
    brief:
      "Understanding how services start, what they run as, what happens when they fail, and how to write a unit yourself. Every modern Linux service is a unit file, including the ones you'll be asked to secure.",
    rungs: {
      recognize:
        "You've read a unit file and said what it runs, as whom, and when it starts.",
      use: "You've used systemctl and journalctl to diagnose why a service wouldn't start.",
      build:
        "You've written a unit from scratch for something you wrote, including hardening directives.",
      teach:
        "You've explained the unit lifecycle to someone and they wrote a working unit afterwards.",
    },
    exercised_by: ["PAT-HARDEN", "PAT-AUTOMATE", "PAT-INSTRUMENT"],
    first_move:
      "Run `systemctl cat ssh` (or `sshd`) and read the unit that's been running on your machine all along.",
    failure_mode:
      "Treating systemd as a black box with two commands. The unit options are where the security controls live.",
    resources: [
      {
        title: "systemd.service(5) manual",
        url: "https://man7.org/linux/man-pages/man5/systemd.service.5.html",
        type: "reference",
        note: "The unit file options in full. Skim it once so you know what exists.",
        last_verified: V_2026_09,
      },
      {
        title: "systemd.exec(5) — sandboxing options",
        url: "https://man7.org/linux/man-pages/man5/systemd.exec.5.html",
        type: "reference",
        note: "ProtectSystem, PrivateTmp, NoNewPrivileges and the rest. This page is most of service hardening.",
        last_verified: V_2026_09,
      },
      {
        title: "Arch Wiki — systemd",
        url: "https://wiki.archlinux.org/title/Systemd",
        type: "reference",
        note: "The readable version of the manual, with the examples the official docs omit.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-LINUX-TRACE",
    domain: "DOM-LINUX",
    name: "Trace a process's syscalls and file access",
    brief:
      "Watching what a program actually does rather than what it says it does. The fastest way to answer 'why is this failing' and 'what is this binary touching'.",
    rungs: {
      recognize:
        "You know what strace output is showing you when you see a screenful of it.",
      use: "You've used strace or ltrace to find which file a failing program couldn't open.",
      build:
        "You've traced a non-obvious problem to its cause using syscall output nobody pointed you at.",
      teach:
        "You've shown someone how to trace a failing program and they diagnosed the next one alone.",
    },
    exercised_by: ["PAT-INSTRUMENT", "PAT-BREAK", "PAT-MEASURE"],
    first_move:
      "Run `strace -f -e trace=openat ls` and read what a program as simple as `ls` actually opens.",
    failure_mode:
      "Drowning in output. Filter to the syscall family you care about before you read anything.",
    resources: [
      {
        title: "Julia Evans — wizard zines",
        url: "https://wizardzines.com/",
        type: "foundation",
        note: "The clearest explanations of strace, debugging and Linux internals anywhere. Several are free.",
        last_verified: V_2026_09,
      },
      {
        title: "Brendan Gregg — Linux Performance",
        url: "https://www.brendangregg.com/linuxperf.html",
        type: "reference",
        note: "The map of every Linux observability tool and what layer it sees. Bookmark the diagram.",
        last_verified: V_2026_09,
      },
      {
        title: "bpftrace",
        url: "https://github.com/bpftrace/bpftrace",
        type: "reference",
        note: "Where tracing goes once strace isn't enough. The one-liner collection in its docs is the place to start.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-LINUX-BUILD",
    domain: "DOM-LINUX",
    name: "Build from source and debug the build",
    brief:
      "Compiling software yourself and fixing it when it fails — missing headers, wrong toolchain, broken configure. The gate in front of an enormous amount of security work, and where most people give up.",
    rungs: {
      recognize:
        "You can tell from an error whether it's a missing dependency, a compiler problem, or a linker problem.",
      use: "You've built a non-trivial project from source by following its instructions.",
      build:
        "You've fixed a build that failed, where the fix wasn't in the project's documentation.",
      teach:
        "You've helped someone through a build failure by teaching them to read the error, not by fixing it for them.",
    },
    exercised_by: ["PAT-REIMPLEMENT", "PAT-FIRMWARE", "PAT-SIMULATE", "PAT-AUTOMATE"],
    first_move:
      "Clone a tool you use, build it from source, and run your build rather than the packaged one.",
    failure_mode:
      "Pasting the error into a search engine before reading it. The first error is the real one; the rest are its consequences.",
    resources: [
      {
        title: "GNU Make manual",
        url: "https://www.gnu.org/software/make/manual/",
        type: "reference",
        note: "Why the build does what it does. Read the first three chapters and makefiles stop being magic.",
        last_verified: V_2026_09,
      },
      {
        title: "CMake documentation",
        url: "https://cmake.org/documentation/",
        type: "reference",
        note: "What most modern C and C++ projects actually use. You need enough to read one, not to write one.",
        last_verified: V_2026_09,
      },
      {
        title: "Arch Wiki — PKGBUILD",
        url: "https://wiki.archlinux.org/title/PKGBUILD",
        type: "reference",
        note: "Packaging as a compact description of a build. Reading a few teaches the shape of build-from-source work.",
        last_verified: V_2026_09,
      },
    ],
  },

  /* ---------------------------------------------------------------- *
   * DOM-HW — deep
   * ---------------------------------------------------------------- */
  {
    id: "SKL-HW-UART",
    domain: "DOM-HW",
    name: "Find and talk to a UART on an unknown board",
    brief:
      "Locating the serial console a vendor left on the board and getting a terminal on it. The single highest-value hardware skill — it's how most device projects actually begin.",
    rungs: {
      recognize:
        "You've looked at a board and pointed at the pads most likely to be a UART header.",
      use: "You've connected an adapter to a labeled header and got readable boot output.",
      build:
        "You've found a UART on an unlabeled board yourself, worked out the baud rate, and got a shell.",
      teach:
        "You've sat with someone while they found their first UART and they got output.",
    },
    exercised_by: ["PAT-TEARDOWN", "PAT-BRIDGE", "PAT-FIRMWARE"],
    first_move:
      "Find the four-pad row on any old router board and measure which pad sits at 3.3V constant — that's usually VCC, and TX is usually next to it.",
    failure_mode:
      "Connecting the adapter's VCC. You want ground, TX and RX — leave the power pin alone and let the board power itself.",
    resources: [
      {
        title: "OpenWrt — serial port documentation",
        url: "https://openwrt.org/docs/techref/hardware/port.serial",
        type: "reference",
        note: "Voltage levels, pinout conventions and wiring, written for exactly the devices you'll be opening.",
        last_verified: null,
      },
      {
        title: "Adafruit — FTDI Friend guide",
        url: "https://learn.adafruit.com/ftdi-friend",
        type: "reference",
        note: "The clearest wiring walkthrough for a USB-UART adapter, including the 3.3V versus 5V trap.",
        last_verified: V_2026_09,
      },
      {
        title: "sigrok — UART protocol decoder",
        url: "https://sigrok.org/wiki/Protocol_decoder:Uart",
        type: "reference",
        note: "When you can't guess the baud rate, capture the line and let the decoder tell you.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-HW-FLASH",
    domain: "DOM-HW",
    name: "Dump flash in-circuit",
    brief:
      "Reading a device's flash chip while it's still soldered to the board, using a clip and a programmer. How you get firmware from a device whose vendor never published an update file.",
    rungs: {
      recognize:
        "You can find the flash chip on a board and read its part number and package.",
      use: "You've clipped onto a chip and pulled a dump that binwalk recognized.",
      build:
        "You've dumped a chip on a board that fought you — held the CPU in reset or desoldered it — and verified the dump.",
      teach:
        "You've guided someone through their first in-circuit dump and it worked.",
    },
    exercised_by: ["PAT-TEARDOWN", "PAT-FIRMWARE"],
    first_move:
      "Identify the flash chip on a board you already own and look up its datasheet. Reading the pinout is free.",
    failure_mode:
      "Trusting a single dump. Read the chip twice and compare hashes — in-circuit reads fail partially and silently.",
    resources: [
      {
        title: "flashrom — supported hardware",
        url: "https://www.flashrom.org/supported_hw/index.html",
        type: "reference",
        note: "Check your programmer and your chip are both on this list before you buy either.",
        last_verified: V_2026_09,
      },
      {
        title: "FACT — Firmware Analysis and Comparison Tool",
        url: "https://github.com/fkie-cad/FACT_core",
        type: "reference",
        note: "Where a dump goes after binwalk. Heavier setup, considerably more analysis.",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "SKL-HW-DATASHEET",
    domain: "DOM-HW",
    name: "Read a datasheet and predict behavior",
    brief:
      "Getting enough from a chip's documentation to know what it will do before you power anything. Saves hardware, and it's the difference between experimenting and guessing.",
    rungs: {
      recognize:
        "You can find the pinout and the absolute maximum ratings in a datasheet you've never seen.",
      use: "You've used a datasheet to wire a part correctly on the first attempt.",
      build:
        "You've predicted a behavior from a datasheet, tested it, and been right — or found out precisely why not.",
      teach:
        "You've walked someone through a datasheet for a part they needed and they wired it correctly.",
    },
    exercised_by: ["PAT-TEARDOWN", "PAT-SIMULATE", "PAT-BRIDGE"],
    first_move:
      "Take the part number off any chip in front of you, find its datasheet, and locate the pinout diagram.",
    failure_mode:
      "Reading it front to back. Datasheets are reference documents — go to the pinout, the electrical characteristics, and the one section you need.",
    resources: [
      {
        title: "SparkFun tutorials",
        url: "https://learn.sparkfun.com/tutorials",
        type: "foundation",
        note: "Clear introductions to reading datasheets and to the electronics assumed by every hardware writeup.",
        last_verified: V_2026_09,
      },
      {
        title: "Digi-Key parametric search",
        url: "https://www.digikey.com/",
        type: "reference",
        note: "Search by the characteristics you need and get the datasheet. Also the fastest way to identify an unfamiliar package.",
        last_verified: null,
      },
    ],
  },
  {
    id: "SKL-HW-LOGIC",
    domain: "DOM-HW",
    name: "Decode an unknown bus with a logic analyzer",
    brief:
      "Capturing the digital traffic between two chips and working out what protocol it is and what it's saying. Turns an opaque board into a conversation you can read.",
    rungs: {
      recognize:
        "You can look at a captured waveform and say whether it's more likely I2C, SPI or UART.",
      use: "You've captured a bus and decoded it with the right protocol decoder selected.",
      build:
        "You've decoded a bus nobody labeled, worked out the message format, and documented it.",
      teach:
        "You've taught someone to hook up an analyzer and capture a clean trace, and they read it.",
    },
    exercised_by: ["PAT-TEARDOWN", "PAT-INSTRUMENT", "PAT-BRIDGE"],
    first_move:
      "Hook an analyzer to any two-wire bus on a dev board you control and capture one transaction you already know the content of.",
    failure_mode:
      "Sampling too slowly and decoding noise. Sample at least four times the bus clock, and always capture ground.",
    resources: [
      {
        title: "sigrok — protocol decoders",
        url: "https://sigrok.org/wiki/Protocol_decoders",
        type: "reference",
        note: "Over a hundred decoders. If your bus is on this list, you don't have to decode it by hand.",
        last_verified: V_2026_09,
      },
      {
        title: "Understanding the I2C Bus (TI SLVA704)",
        url: "https://www.ti.com/lit/an/slva704/slva704.pdf",
        type: "corpus",
        note: "A vendor's own walkthrough of the most common two-wire bus, signal by signal. Short enough to read properly, once.",
        last_verified: V_2026_09,
      },
    ],
  },

  /* ---------------------------------------------------------------- *
   * DOM-RE — stub
   * ---------------------------------------------------------------- */
  {
    id: "SKL-RE-DISASM",
    domain: "DOM-RE",
    name: "Read x86-64 disassembly without a decompiler",
    brief:
      "Following assembly directly — calling conventions, stack frames, control flow. The decompiler is a hypothesis; this is how you check it.",
    rungs: {
      recognize:
        "You can find a function's prologue and its return in a disassembly listing.",
      use: "You've followed a small function's logic in assembly and said what it computes.",
      build:
        "You've understood a function whose decompilation was wrong or unreadable, by reading the assembly.",
      teach:
        "You've taught someone to read a stack frame and they traced the next function themselves.",
    },
    exercised_by: ["PAT-BREAK", "PAT-REIMPLEMENT"],
    first_move:
      "Compile a five-line C function, run `objdump -d` on it, and match every line of assembly to your source.",
    failure_mode:
      "Reading only the decompiler's output. It is confidently wrong often enough that you must be able to check it.",
    resources: [],
  },
  {
    id: "SKL-RE-GHIDRA",
    domain: "DOM-RE",
    name: "Navigate a stripped binary in Ghidra",
    brief:
      "Finding your way around a binary with no symbols — locating interesting functions, naming things as you learn them, and building up a map that holds.",
    rungs: {
      recognize:
        "You can open a binary in Ghidra and find the entry point and the string table.",
      use: "You've followed a string reference to the function that uses it and understood that function.",
      build:
        "You've reverse engineered a meaningful chunk of a stripped binary, naming functions as you went.",
      teach:
        "You've shown someone the strings-to-xrefs workflow and they used it to find their own starting point.",
    },
    exercised_by: ["PAT-FIRMWARE", "PAT-BREAK", "PAT-REIMPLEMENT"],
    first_move:
      "Install Ghidra, open any binary from /usr/bin, and find one string in the listing.",
    failure_mode:
      "Not renaming anything. Every function you understand and leave as FUN_00401a30 is one you'll work out again next session.",
    resources: [],
  },
  {
    id: "SKL-RE-ANTIANALYSIS",
    domain: "DOM-RE",
    name: "Defeat basic anti-analysis and obfuscation",
    brief:
      "Getting past the things a binary does to resist you — debugger detection, packing, string encryption, control flow flattening.",
    rungs: {
      recognize:
        "You can tell from a binary's entropy and imports that it's packed.",
      use: "You've unpacked a binary using a known technique for its packer.",
      build:
        "You've defeated an anti-debugging check you hadn't seen before and documented how.",
      teach:
        "You've taught someone to spot a packed binary and they unpacked one themselves.",
    },
    exercised_by: ["PAT-BREAK", "PAT-FIRMWARE"],
    first_move:
      "Pack a hello-world binary with UPX and unpack it by hand rather than with `upx -d`.",
    failure_mode:
      "Fighting the obfuscation instead of going around it. Often you can let it run and take the result.",
    resources: [],
  },
  {
    id: "SKL-RE-FORMAT",
    domain: "DOM-RE",
    name: "Reverse an undocumented file or wire format",
    brief:
      "Working out the structure of data nobody published a spec for — headers, lengths, offsets, checksums — usually by changing one thing and watching which bytes move.",
    rungs: {
      recognize:
        "You can open a file in a hex editor and identify a magic number and a plausible length field.",
      use: "You've diffed two files that differ by one known change and located the bytes that moved.",
      build:
        "You've documented an undocumented format well enough to write a working parser.",
      teach:
        "You've taught someone the change-one-thing-and-diff method and they mapped a field with it.",
    },
    exercised_by: ["PAT-REIMPLEMENT", "PAT-BRIDGE", "PAT-SIMULATE", "PAT-FIRMWARE"],
    first_move:
      "Save a game twice with one thing different and diff the two files in a hex editor.",
    failure_mode:
      "Guessing at structure instead of generating controlled differences. One change at a time, always.",
    resources: [],
  },

  /* ---------------------------------------------------------------- *
   * DOM-DFIR — stub
   * ---------------------------------------------------------------- */
  {
    id: "SKL-DFIR-ACQUIRE",
    domain: "DOM-DFIR",
    name: "Acquire evidence without contaminating it",
    brief:
      "Getting data off a system in a way that holds up later — imaging, hashing, write blocking, and recording what you did and when.",
    rungs: {
      recognize: "You can say why you hash an image before and after you copy it.",
      use: "You've imaged a drive or volume and verified the hash matched.",
      build:
        "You've acquired from a running system in the right order of volatility and documented the process.",
      teach:
        "You've taught someone the acquisition procedure and they followed it without prompting.",
    },
    exercised_by: ["PAT-INSTRUMENT", "PAT-MEASURE"],
    first_move:
      "Image a USB stick you own, hash it, and verify the hash. Fifteen minutes, whole procedure.",
    failure_mode:
      "Working on the original. Image it, hash it, work on the copy — every time, including when it doesn't matter.",
    resources: [],
  },
  {
    id: "SKL-DFIR-TIMELINE",
    domain: "DOM-DFIR",
    name: "Build a timeline across heterogeneous log sources",
    brief:
      "Merging filesystem timestamps, application logs and system events into one ordered account of what happened. Timezones and clock drift are most of the difficulty.",
    rungs: {
      recognize:
        "You know why a timeline needs a stated timezone and a source column.",
      use: "You've built a timeline from two different log sources and normalized their timestamps.",
      build:
        "You've reconstructed an incident across several sources and defended the ordering.",
      teach:
        "You've taught someone to normalize timestamps before merging, and their timeline held up.",
    },
    exercised_by: ["PAT-MEASURE", "PAT-INSTRUMENT", "PAT-AUDIT"],
    first_move:
      "Take your own shell history and your auth log and merge an hour of them into one ordered list.",
    failure_mode:
      "Mixing timezones silently. Convert everything to UTC at ingest and record what each source claimed.",
    resources: [],
  },
  {
    id: "SKL-DFIR-MEMORY",
    domain: "DOM-DFIR",
    name: "Analyze a memory image",
    brief:
      "Pulling processes, network connections, injected code and keys out of a RAM capture. The things that were never written to disk live here.",
    rungs: {
      recognize: "You can say what's in a memory image that isn't on disk.",
      use: "You've listed processes and connections from a published memory image.",
      build:
        "You've found evidence of injection or a hidden process in an image nobody annotated for you.",
      teach:
        "You've walked someone through their first memory analysis and they found the process.",
    },
    exercised_by: ["PAT-INSTRUMENT", "PAT-BREAK"],
    first_move:
      "Download a published sample memory image and run a process listing against it.",
    failure_mode:
      "Wrong profile or wrong symbols, then concluding the image is broken. Confirm the OS build first.",
    resources: [],
  },
  {
    id: "SKL-DFIR-TRIAGE",
    domain: "DOM-DFIR",
    name: "Triage a suspicious binary safely",
    brief:
      "Deciding quickly whether a file is dangerous and roughly what it does, without running it anywhere it can hurt you.",
    rungs: {
      recognize:
        "You know why you never double-click an unknown binary on your own machine.",
      use: "You've statically triaged a sample — hashes, strings, imports — in an isolated VM.",
      build:
        "You've detonated a sample safely and documented its behavior and indicators.",
      teach:
        "You've taught someone to set up isolation properly and verified their VM was actually isolated.",
    },
    exercised_by: ["PAT-BREAK", "PAT-INSTRUMENT"],
    first_move:
      "Build the isolated VM and verify from inside it that it cannot reach the internet. Do that before you obtain any sample.",
    failure_mode:
      "Isolation you assumed rather than tested, or forgetting to revert the snapshot between samples.",
    resources: [],
  },

  /* ---------------------------------------------------------------- *
   * DOM-CLOUD — stub
   * ---------------------------------------------------------------- */
  {
    id: "SKL-CLOUD-IAM",
    domain: "DOM-CLOUD",
    name: "Read IAM policy and find the over-permission",
    brief:
      "Reading permission documents and working out what they actually allow — which is regularly much more than whoever wrote them intended.",
    rungs: {
      recognize: "You can read a policy document and say which actions it grants.",
      use: "You've found an over-permissive policy in an account using the provider's own tooling.",
      build:
        "You've mapped a privilege escalation path through chained permissions in an account you built.",
      teach:
        "You've taught someone to read a policy and they found an over-permission themselves.",
    },
    exercised_by: ["PAT-AUDIT", "PAT-HARDEN", "PAT-BREAK"],
    first_move:
      "Open your own cloud account's IAM console and read the policy attached to your own user.",
    failure_mode:
      "Reading the policy without the resource and condition blocks. Those are where the actual scope is decided.",
    resources: [],
  },
  {
    id: "SKL-CLOUD-BASELINE",
    domain: "DOM-CLOUD",
    name: "Audit an account against a baseline",
    brief:
      "Checking a cloud account completely against a published standard and reporting what complies and what doesn't. Completeness is the deliverable.",
    rungs: {
      recognize: "You can name a published baseline and say what it's for.",
      use: "You've run an automated baseline check and read every finding it produced.",
      build:
        "You've audited an account against a baseline and written up findings with remediation.",
      teach:
        "You've taught someone to run and interpret a baseline audit and they did the next one.",
    },
    exercised_by: ["PAT-AUDIT", "PAT-HARDEN", "PAT-AUTOMATE", "PAT-MEASURE"],
    first_move:
      "Pick a published baseline for your provider and check your own account against its first five controls by hand.",
    failure_mode:
      "Reporting the tool's output verbatim. An audit needs you to have judged which findings actually matter here.",
    resources: [],
  },
  {
    id: "SKL-CLOUD-METADATA",
    domain: "DOM-CLOUD",
    name: "Understand and abuse instance metadata services",
    brief:
      "The endpoint every cloud instance can reach that hands out credentials. Understanding it is how an SSRF becomes an account compromise.",
    rungs: {
      recognize: "You can say what the metadata endpoint is and why it matters.",
      use: "You've queried the metadata service from your own instance and seen what it returns.",
      build:
        "You've demonstrated the SSRF-to-credentials path end to end in your own account.",
      teach:
        "You've explained the path to someone and they reproduced it in their own account.",
    },
    exercised_by: ["PAT-BREAK", "PAT-AUDIT", "PAT-HARDEN"],
    first_move:
      "Start an instance in your own account and curl the metadata endpoint from inside it.",
    failure_mode:
      "Testing this anywhere but your own account. On someone else's infrastructure this is straightforwardly unauthorized access.",
    resources: [],
  },

  /* ---------------------------------------------------------------- *
   * DOM-NETWORK — stub
   * ---------------------------------------------------------------- */
  {
    id: "SKL-NET-CAPTURE",
    domain: "DOM-NETWORK",
    name: "Read a capture and narrate the conversation",
    brief:
      "Opening a packet capture and telling the story in it — who talked to whom, what they asked for, what came back, and where it went wrong.",
    rungs: {
      recognize: "You can find a DNS query and its response in a capture.",
      use: "You've followed a TCP stream and described the exchange in plain language.",
      build:
        "You've diagnosed a real problem from a capture that nobody had annotated.",
      teach:
        "You've taught someone display filters and they found what they were looking for.",
    },
    exercised_by: ["PAT-MEASURE", "PAT-INSTRUMENT", "PAT-BRIDGE", "PAT-SIMULATE"],
    first_move:
      "Capture thirty seconds of your own traffic and find the DNS query for a site you just opened.",
    failure_mode:
      "Capturing everything and filtering nothing. Decide the question, then write the display filter.",
    resources: [],
  },
  {
    id: "SKL-NET-TLS",
    domain: "DOM-NETWORK",
    name: "Understand TLS well enough to intercept it deliberately",
    brief:
      "How the handshake works, what certificates actually prove, and how to put yourself in the middle of your own traffic on purpose — which is how all web testing works.",
    rungs: {
      recognize: "You can identify a TLS handshake in a capture and name its stages.",
      use: "You've configured a proxy with its CA installed and read your own HTTPS traffic.",
      build:
        "You've intercepted traffic from an application that resisted it — pinning, or a non-browser client.",
      teach:
        "You've walked someone through proxy setup and CA trust and their traffic decrypted.",
    },
    exercised_by: ["PAT-BREAK", "PAT-INSTRUMENT", "PAT-HARDEN", "PAT-MEASURE"],
    first_move:
      "Install a proxy's CA in a browser profile you use for testing and watch one HTTPS request decrypt.",
    failure_mode:
      "Installing a testing CA into your everyday system trust store and leaving it there. Use a separate profile.",
    resources: [],
  },
  {
    id: "SKL-NET-SEGMENT",
    domain: "DOM-NETWORK",
    name: "Segment a network and prove the segmentation holds",
    brief:
      "Splitting a network so that a compromise in one part can't reach another — and then testing from inside each segment to prove it rather than assuming it.",
    rungs: {
      recognize: "You can say what a VLAN is and what it does and doesn't isolate.",
      use: "You've configured a separate network segment and put a device on it.",
      build:
        "You've segmented a real network and demonstrated by testing that the isolation holds.",
      teach:
        "You've taught someone to design and then verify a segment, and theirs held.",
    },
    exercised_by: ["PAT-HARDEN", "PAT-AUDIT", "PAT-MEASURE"],
    first_move:
      "Put one untrusted device on a guest network at home and try to reach your laptop from it.",
    failure_mode:
      "Configuring the segmentation and never testing it from inside. Untested isolation usually has a hole.",
    resources: [],
  },

  /* ---------------------------------------------------------------- *
   * DOM-APPSEC — stub
   * ---------------------------------------------------------------- */
  {
    id: "SKL-APPSEC-THREATMODEL",
    domain: "DOM-APPSEC",
    name: "Threat model a system on a whiteboard in 20 minutes",
    brief:
      "Drawing a system, finding where trust boundaries are crossed, and naming what could go wrong — fast enough that people will actually do it during design.",
    rungs: {
      recognize: "You can point at a trust boundary on an architecture diagram.",
      use: "You've produced a data flow diagram and listed threats against it.",
      build:
        "You've run a threat modeling session for a real system and it changed a decision.",
      teach:
        "You've facilitated a session where someone else did the modeling and it produced usable threats.",
    },
    exercised_by: ["PAT-AUDIT", "PAT-HARDEN"],
    first_move:
      "Draw something you built on one page and mark every place data crosses a trust boundary.",
    failure_mode:
      "A complete list of threats with no ranking and no decisions. A threat model that changes nothing was a writing exercise.",
    resources: [],
  },
  {
    id: "SKL-APPSEC-CODEREVIEW",
    domain: "DOM-APPSEC",
    name: "Review code for one specific vulnerability class",
    brief:
      "Sweeping a codebase for one kind of bug at a time — every place user input reaches a query, every deserialization call — rather than reading hopefully.",
    rungs: {
      recognize: "You can spot an unsanitized input reaching a dangerous sink.",
      use: "You've swept a small codebase for one vulnerability class and found the instances.",
      build:
        "You've found a real bug by code review in software you didn't write.",
      teach:
        "You've taught someone the sources-and-sinks method and they swept a codebase with it.",
    },
    exercised_by: ["PAT-AUDIT", "PAT-BREAK"],
    first_move:
      "Grep a project you use for its database query calls and check each one's inputs.",
    failure_mode:
      "Reading a codebase top to bottom hoping to notice something. Pick the sink, find every call, check each.",
    resources: [],
  },
  {
    id: "SKL-APPSEC-FUZZ",
    domain: "DOM-APPSEC",
    name: "Run a fuzzer and interpret what it found",
    brief:
      "Throwing generated input at a program until it misbehaves, then working out whether a crash is a bug worth reporting and why it happens.",
    rungs: {
      recognize: "You can say what a fuzzer does and what a corpus is for.",
      use: "You've run a fuzzer against a target and got it to produce a crash.",
      build:
        "You've written a harness for a library and triaged the crashes it produced.",
      teach:
        "You've taught someone to write a harness and theirs found something.",
    },
    exercised_by: ["PAT-BREAK", "PAT-INSTRUMENT", "PAT-MEASURE"],
    first_move:
      "Fuzz a small parsing library with a default harness for an hour and look at what comes out.",
    failure_mode:
      "Reporting every crash. Most are the same bug; triage and deduplicate before you tell anyone.",
    resources: [],
  },
];

export default skills;
