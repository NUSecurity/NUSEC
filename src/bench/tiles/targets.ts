import { Target } from "@/bench/types";
import { V_2026_09 } from "./verified";

/**
 * The 29 objects, ordered by how many students will actually want them.
 *
 * Software targets come first because that is what the room is here for; the
 * hardware ones sit at the bottom for the people who want them. Nothing about
 * the grammar changes — only the order they are offered in.
 *
 * Every target carries an `authorization`. Three of the five values a student
 * satisfies alone; `team-authorized` and `scoped-program` need someone else's
 * word, and the composer will not resolve a bench using one until the student
 * ticks the attestation. That is one of only two hard blocks in the tool.
 *
 * University systems are not on this list and won't be. Not as a target, not as
 * an example in any brief. A student who wants to test a university service
 * goes through whatever disclosure channel the university actually has, which
 * is a different conversation and not one a tile should nudge anyone toward.
 */
const targets: Target[] = [
  {
    id: "TGT-VULNWEB",
    name: "Deliberately vulnerable web app",
    phrase: "a deliberately vulnerable web app",
    brief:
      "DVWA, OWASP Juice Shop or similar — a web application built to be broken, running on your own machine. Every bug class in one place, with the answer available when you're stuck.",
    classes: ["web-app"],
    cost: "Free",
    sourcing:
      "Docker images for all of these. Juice Shop is the most modern; DVWA is the most direct about which bug you're on.",
    gotchas:
      "Run it locally and do not expose it to the internet. These are genuinely vulnerable, and a public one gets found and used within hours.",
    requires_kits: ["KIT-HOMELAB"],
    authorization: "deliberately-vulnerable",
    links: [
      {
        title: "OWASP Juice Shop",
        url: "https://owasp.org/www-project-juice-shop/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "`docker run` Juice Shop and find the first flaw without looking anything up.",
    failure_mode:
      "Working through it with the solutions open. You are buying the feeling of progress with the thing you came for.",
    effort: 1,
  },
  {
    id: "TGT-WEBAPP",
    name: "A web app you built",
    phrase: "a web app I built",
    brief:
      "Something you wrote yourself — a class project, a side project, the club site. You know the code, you own the server, and you can break it as hard as you like. The best possible first target if you can already write software.",
    classes: ["web-app", "process"],
    cost: "Free",
    sourcing:
      "Anything you've already built. Half-finished is fine — the bugs are usually more interesting.",
    gotchas:
      "If real people use it, work on a local copy. Also: if it has other people's data in it, that data does not belong in your writeup.",
    requires_kits: [],
    authorization: "owned",
    first_move:
      "Find every place your app takes input from a user and write them down. That list is your attack surface.",
    failure_mode:
      "Going easy on it because you wrote it. Test it like you didn't, or hand it to someone who didn't.",
    effort: 2,
  },
  {
    id: "TGT-APISVC",
    name: "A public API",
    phrase: "a public API",
    brief:
      "An API that publishes docs and hands out free keys. Great for learning how web services authenticate, rate-limit and leak — and for building something that consumes one properly.",
    classes: ["web-app", "network-service", "protocol"],
    cost: "Free",
    sourcing:
      "Pick one with real documentation and a sandbox or free tier. Weather, transit and government data APIs are all well documented.",
    gotchas:
      "Read the terms of use and respect the rate limit. Studying how an API behaves is fine; hammering it until it falls over is not, and the difference is obvious to whoever runs it.",
    requires_kits: [],
    authorization: "public",
    first_move:
      "Get a key, make one request from the command line, and read the full response headers — not just the body.",
    failure_mode:
      "Testing an API's security without permission. Documenting behaviour is fine; probing for flaws needs a bug bounty scope or your own deployment.",
    effort: 2,
    links: [
      {
        title: "Public APIs — a big indexed list",
        url: "https://github.com/public-apis/public-apis",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "TGT-BOUNTY",
    name: "A bug bounty program",
    phrase: "a bug bounty program",
    brief:
      "A company that has published a scope and invited testing within it. Real systems with real permission — but the permission is exactly as wide as the scope page says and not one asset wider.",
    classes: ["web-app", "network-service"],
    cost: "Free to enter",
    sourcing:
      "HackerOne, Bugcrowd, Intigriti, or a company's own security page. Newer and smaller programs have far less picked-over surface.",
    gotchas:
      "Read the scope page, stay inside it, and understand that the program's rules beat anything this tool says. Out-of-scope testing is not a technicality — it is unauthorized access, and the program's safe harbour does not cover it.",
    requires_kits: [],
    authorization: "scoped-program",
    links: [
      {
        title: "HackerOne programs",
        url: "https://hackerone.com/opportunities/all",
        last_verified: V_2026_09,
      },
      {
        title: "Bugcrowd engagements",
        url: "https://bugcrowd.com/engagements",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Pick one program and read its entire scope and rules page before touching a single asset. Write down what's in and what's out.",
    failure_mode:
      "Scope drift. You find something interesting on a host that's adjacent to the program and keep going. That host is not in scope and neither are you.",
    effort: 3,
  },
  {
    id: "TGT-BOOT2ROOT",
    name: "Boot2root VM",
    phrase: "a boot2root VM",
    brief:
      "A whole machine built to be compromised, from network service to root shell. The closest legal analogue to a real engagement, with a designed path through it.",
    classes: ["network-service"],
    cost: "Free, or a subscription on the hosted platforms",
    sourcing:
      "VulnHub images run locally; HackTheBox and TryHackMe host them for you.",
    gotchas:
      "If you run a VulnHub image locally, host-only networking. These boxes are vulnerable by construction and some ship with real backdoors.",
    requires_kits: ["KIT-HOMELAB"],
    authorization: "deliberately-vulnerable",
    links: [
      {
        title: "VulnHub",
        url: "https://www.vulnhub.com/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Pick one box rated easy and give yourself two hours on enumeration alone before you try a single exploit.",
    failure_mode:
      "Following a walkthrough and calling it solved. If you read the path, you practised reading, not finding.",
    effort: 2,
  },
  {
    id: "TGT-ADLAB",
    name: "A Windows domain you built",
    phrase: "a Windows domain I built",
    brief:
      "A small Active Directory lab on your own machine. Almost every company runs AD, almost every offensive job touches it, and almost no student has ever seen one — which makes this unusually valuable for how little it costs.",
    classes: ["network-service", "process", "cloud-env"],
    cost: "Free — evaluation licences, on hardware you own",
    sourcing:
      "GOAD builds a deliberately vulnerable domain for you. Microsoft's evaluation ISOs are free and time-limited, which is long enough.",
    gotchas:
      "It wants memory — budget 16GB if you can. Keep it on a host-only network; a misconfigured domain controller is not something to expose.",
    requires_kits: ["KIT-HOMELAB"],
    authorization: "owned",
    first_move:
      "Stand up one domain controller and join one workstation to it. Getting that far is most of the learning.",
    failure_mode:
      "Following a lab build guide without understanding what each piece does, then being unable to explain any of it afterwards.",
    effort: 3,
    links: [
      {
        title: "GOAD — Game of Active Directory",
        url: "https://github.com/Orange-Cyberdefense/GOAD",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "TGT-HOMENET",
    name: "Your own home network",
    phrase: "my own home network",
    brief:
      "The network you pay for. Nobody's lab looks like production, but your home network is production — it has real devices with real traffic, and you are allowed to touch all of it.",
    classes: ["network-service"],
    cost: "Free",
    sourcing: "You are already on it.",
    gotchas:
      "If you share the flat, tell your housemates before you start capturing traffic or changing the router. Your authorization covers your network, not their privacy.",
    requires_kits: [],
    authorization: "owned",
    first_move:
      "Inventory it. Every device with an IP, what it is, and what it talks to. Most people find something they forgot about.",
    failure_mode:
      "Capturing housemates' traffic without asking. Legally yours, socially not. Ask first.",
    effort: 1,
  },
  {
    id: "TGT-SELFHOST",
    name: "A service you self-host",
    phrase: "a service I self-host",
    brief:
      "Something you run for yourself — a media server, a git forge, a wiki. You own it completely, which means you can attack it, harden it, instrument it and break it without asking anyone.",
    classes: ["network-service", "cloud-env"],
    cost: "Free on hardware you own, or a few dollars a month hosted",
    sourcing:
      "Anything you'd actually use. A service you want running is one you'll maintain past the project.",
    gotchas:
      "If it's exposed to the internet, it is a real target for real people. Do the hardening before the experiment, not after.",
    requires_kits: ["KIT-HOMELAB"],
    authorization: "owned",
    first_move:
      "Stand one up today with its default configuration and write down what that default was.",
    failure_mode:
      "Self-hosting as the project. Standing up nine services is a hobby. Pick one and do something to it.",
    effort: 2,
  },
  {
    id: "TGT-CLOUDACCT",
    name: "A cloud account you own",
    phrase: "a cloud account I own",
    brief:
      "Your own AWS, Azure or GCP account. The place to learn IAM, because you can grant yourself a bad permission on purpose and then go find it.",
    classes: ["cloud-env"],
    cost: "Free tier, plus whatever you spend past it",
    sourcing:
      "Sign up directly. Student credits exist for all three providers and are worth finding before you start.",
    gotchas:
      "The billing alarm goes on before the first deployment. Also: your account, your resources — a cloud account does not authorize you to touch the provider's infrastructure or another tenant.",
    requires_kits: ["KIT-CLOUDACCT"],
    authorization: "owned",
    first_move:
      "Create the account, set a $5 billing alarm, then deliberately create one over-permissive role so you have something to find.",
    failure_mode:
      "The bill. Alarm first, tear-down the day you finish, and check the console for orphaned resources at the end of the project.",
    effort: 2,
  },
  {
    id: "TGT-CONTAINER",
    name: "A container image",
    phrase: "a container image",
    brief:
      "A published Docker image — its layers, what's baked into it, what it runs as. An enormous amount of modern software ships this way, and most images contain more than their authors think.",
    classes: ["binary", "cloud-env", "process"],
    cost: "Free",
    sourcing:
      "Docker Hub. Popular images are well-studied; smaller project images are where the interesting findings are.",
    gotchas:
      "Don't run an unknown image with host networking or a mounted socket. Inspect the layers before you run anything.",
    requires_kits: ["KIT-HOMELAB"],
    authorization: "public",
    first_move:
      "Pull an image and run a layer history on it. Every layer is a command someone ran, and they're all readable.",
    failure_mode:
      "Reporting a scanner's CVE list as a finding. Anyone can run a scanner; the work is deciding which of those actually matter in this image.",
    effort: 2,
    links: [
      {
        title: "Docker Hub",
        url: "https://hub.docker.com/",
        last_verified: V_2026_09,
      },
      {
        title: "Trivy — image and config scanning",
        url: "https://github.com/aquasecurity/trivy",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "TGT-K8S",
    name: "A cluster you stood up",
    phrase: "a cluster I stood up",
    brief:
      "A Kubernetes cluster you built yourself, on your own machine or in your own account. Deep enough to be a real subject for hardening, auditing or instrumenting, and entirely yours.",
    classes: ["cloud-env"],
    cost: "Free locally with kind or k3s; hosted costs real money",
    sourcing:
      "Run it locally first. A hosted control plane bills by the hour whether you are learning or asleep.",
    gotchas:
      "Kubernetes is large enough to eat the whole term by itself. Scope to one question — one policy, one control, one audit.",
    requires_kits: ["KIT-HOMELAB", "KIT-CLOUDACCT"],
    authorization: "owned",
    first_move:
      "`kind create cluster` and deploy one pod. Local and free beats hosted and billed for everything you are about to do.",
    failure_mode:
      "Learning Kubernetes instead of doing a security project with Kubernetes in it. The cluster is the target, not the subject.",
    effort: 3,
  },
  {
    id: "TGT-CIPIPELINE",
    name: "A CI/CD pipeline you own",
    phrase: "a build pipeline I own",
    brief:
      "The automation that builds and ships one of your repos. Pipelines hold secrets, run untrusted code and have more permission than anyone remembers giving them — and almost nobody looks at them.",
    classes: ["process", "cloud-env"],
    cost: "Free on public repos",
    sourcing:
      "Any repo you own. If you don't have a pipeline yet, adding one and then hardening it is the whole project.",
    gotchas:
      "Don't put a real secret in a pipeline you're experimenting with, and remember that logs from public repo builds are public too.",
    requires_kits: [],
    authorization: "owned",
    first_move:
      "Open your workflow file and write down every permission it grants and every secret it can read.",
    failure_mode:
      "Testing on a pipeline that isn't yours. A fork's CI is still someone else's compute — use your own repo.",
    effort: 2,
    links: [
      {
        title: "Security hardening for GitHub Actions",
        url: "https://docs.github.com/en/actions/security-guides",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "TGT-MEMIMAGE",
    name: "A published memory image",
    phrase: "a published memory image",
    brief:
      "A RAM capture from a machine, published for teaching. Everything that was never written to disk lives here — running processes, network connections, injected code, sometimes keys. No setup and nothing to install beyond one tool.",
    classes: ["dataset", "binary"],
    cost: "Free",
    sourcing:
      "MemLabs is the friendliest starting set. Digital Corpora has larger, more realistic ones.",
    gotchas:
      "Some teaching images contain live malware in memory. Analyse them, don't extract and run anything out of them.",
    requires_kits: [],
    authorization: "public",
    first_move:
      "Download one and list its running processes. One command, and you've started.",
    failure_mode:
      "Wrong profile or wrong symbols, then concluding the image is broken. Confirm the OS build first.",
    effort: 2,
    links: [
      {
        title: "MemLabs — six graded challenges",
        url: "https://github.com/stuxnet999/MemLabs",
        last_verified: V_2026_09,
      },
      {
        title: "Digital Corpora",
        url: "https://digitalcorpora.org/",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "TGT-LOGSET",
    name: "A published log set",
    phrase: "a published log set",
    brief:
      "Logs from a real or simulated intrusion, published so people can practise on them. The raw material for timelines, detections and the kind of investigation defensive teams do all day.",
    classes: ["dataset", "process"],
    cost: "Free",
    sourcing:
      "The Security Datasets project replays real attack telemetry. Pick one mapped to an ATT&CK technique so you know what you're looking for.",
    gotchas:
      "Timezones. Every log source states time differently, and a timeline that mixes them silently is wrong in a way nobody notices.",
    requires_kits: [],
    authorization: "public",
    first_move:
      "Load one dataset and find the first event that looks out of place. Don't automate anything yet.",
    failure_mode:
      "Grepping for the answer you already know is there. Work forward from the data, not backward from the writeup.",
    effort: 2,
    links: [
      {
        title: "Security Datasets — replayable attack telemetry",
        url: "https://github.com/OTRF/Security-Datasets",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "TGT-MALSAMPLE",
    name: "A sample from a public corpus",
    phrase: "a malware sample",
    brief:
      "A real piece of malware from a public research corpus. The most realistic possible analysis target, and the one with the strictest handling rules — which is itself the lesson.",
    classes: ["binary"],
    cost: "Free",
    sourcing:
      "MalwareBazaar publishes samples with tags and hashes. Pick something old and well-documented for a first look.",
    gotchas:
      "This is live malware. Isolated VM, no network path to anything you care about, snapshot before every run, revert after. Verify the isolation from inside the VM before you download anything — not after.",
    requires_kits: ["KIT-MALVM"],
    authorization: "public",
    first_move:
      "Build and verify the isolated VM first. Do that before you obtain a single sample.",
    failure_mode:
      "Isolation you assumed rather than tested. Also: forgetting to revert between samples, so you can't tell which one did what.",
    effort: 2,
    links: [
      {
        title: "MalwareBazaar",
        url: "https://bazaar.abuse.ch/",
        last_verified: V_2026_09,
      },
    ],
  },
  {
    id: "TGT-PUBDATA",
    name: "Public dataset or capture",
    phrase: "a public dataset",
    brief:
      "Published packet captures, malware corpora, breach statistics, scan data. Real material at real scale that someone else already collected and cleared for use.",
    classes: ["dataset"],
    cost: "Free",
    sourcing:
      "Research capture repositories, published scan data, and the corpus entries in the Network and DFIR pools.",
    gotchas:
      "Check the licence and the terms of use — 'public' and 'redistributable' are different things, and some research datasets require you to register and cite them.",
    requires_kits: [],
    authorization: "public",
    links: [
      {
        title: "Netresec public pcap index",
        url: "https://www.netresec.com/?page=PcapFiles",
        last_verified: V_2026_09,
      },
      {
        title: "Digital Corpora",
        url: "https://digitalcorpora.org/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Download one capture and answer a single question about it before you decide what the project is.",
    failure_mode:
      "Downloading a hundred gigabytes and not having a question. One question first, then the data to answer it.",
    effort: 2,
  },
  {
    id: "TGT-OSSREPO",
    name: "An open-source codebase",
    phrase: "an open-source codebase",
    brief:
      "A real project with real users and a public issue tracker. The only target on this list where doing the work well produces a Tier-1 proof almost automatically, because contributions get reviewed by someone who can say no.",
    classes: ["binary", "process"],
    cost: "Free",
    sourcing:
      "Something you already use. Familiarity with the software is worth more than the project's prestige.",
    gotchas:
      "Read CONTRIBUTING.md and the security policy before you open anything. If you find a vulnerability, it goes through their security process, not the public issue tracker.",
    requires_kits: [],
    authorization: "public",
    first_move:
      "Clone a project you use and build it from source. If the build instructions are wrong, that's your first contribution.",
    failure_mode:
      "Aiming at Linux or Chromium first. Pick something with twenty contributors, where a maintainer will actually read your patch.",
    effort: 2,
  },
  {
    id: "TGT-CRACKME",
    name: "Reversing challenge",
    phrase: "a reversing challenge",
    brief:
      "A binary built to be reversed. Someone designed a lesson into it, which makes it a far better teacher than a random real binary where you cannot tell difficulty from noise.",
    classes: ["binary"],
    cost: "Free",
    sourcing:
      "crackmes.one, past CTF archives, or the reversing sections of the practice platforms in the RE domain's pool.",
    gotchas:
      "These are deliberately built for this, so the usual caution doesn't apply — but run unknown binaries in a VM anyway. It costs you nothing and builds the habit.",
    requires_kits: ["KIT-HOMELAB"],
    authorization: "deliberately-vulnerable",
    links: [
      {
        title: "crackmes.one",
        url: "https://crackmes.one/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Download one rated a difficulty below where you think you are and solve it end to end today.",
    failure_mode:
      "Starting too hard, stalling, and concluding you can't do reversing. Start below your level and climb.",
    effort: 1,
  },
  {
    id: "TGT-SAVEFILE",
    name: "Game save format",
    phrase: "a game's save format",
    brief:
      "The save file of a game you own. An undocumented binary format with a built-in oracle — you can change something in the game and watch which bytes move, which is the friendliest possible way to learn format reversing.",
    classes: ["binary", "protocol"],
    cost: "Free, for a game you own",
    sourcing:
      "Single-player games you already have. Older and smaller is better; modern saves are often compressed or encrypted.",
    gotchas:
      "Stay single-player and stay off anything with anti-cheat. Modifying a multiplayer game's files is a ban at best and a different conversation at worst.",
    requires_kits: [],
    authorization: "owned",
    first_move:
      "Save the game twice, changing exactly one thing in between, and diff the two files.",
    failure_mode:
      "Picking a game whose saves are encrypted and spending three weeks on the encryption instead of the format. Check for compression and encryption first.",
    effort: 1,
  },
  {
    id: "TGT-PROTOSPEC",
    name: "A protocol specification",
    phrase: "a protocol specification",
    brief:
      "MQTT, Modbus, BLE, or any published spec. Reimplementing a protocol from its specification is the most reliable way to actually understand it, and it needs nothing but a text editor.",
    classes: ["protocol"],
    cost: "Free for open specs; some industrial standards are paywalled",
    sourcing:
      "MQTT and Modbus specs are free and short enough to read fully. BLE's is enormous — take one layer of it.",
    gotchas:
      "Some specs cost hundreds of dollars. Check before you commit to one; there is always an open protocol that teaches the same lesson.",
    requires_kits: [],
    authorization: "public",
    links: [
      {
        title: "MQTT specification",
        url: "https://mqtt.org/mqtt-specification/",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Read the packet-structure section of the spec and hand-decode one real message byte by byte on paper.",
    failure_mode:
      "Picking a protocol so large you're still reading in week four. MQTT's core spec is readable in an afternoon; start there.",
    effort: 2,
  },
  {
    id: "TGT-CLUBPROC",
    name: "A process your team runs",
    phrase: "a process my team runs",
    brief:
      "How NUSEC onboards members, how a project team handles credentials, how a club runs its infrastructure. Unglamorous, genuinely useful, and the only target here where the beneficiary is in the room with you.",
    classes: ["process"],
    cost: "Free",
    sourcing:
      "Ask what's annoying. The thing everyone complains about and nobody has written down is the project.",
    gotchas:
      "Get the team's agreement first. Auditing a process means writing down what people do badly, and that lands very differently when they asked for it.",
    requires_kits: [],
    authorization: "team-authorized",
    first_move:
      "Ask a team lead which process wastes the most of their time, and get their agreement to write it up.",
    failure_mode:
      "Auditing a team that didn't ask. Also: producing a document nobody adopts. Agree up front who decides whether it gets used.",
    effort: 1,
  },
  {
    id: "TGT-IPCAM",
    name: "IP camera",
    phrase: "a $20 IP camera",
    brief:
      "A cheap network camera off a marketplace. These are the classic teaching target: a real embedded Linux system, a real network service, and a vendor who spent nothing on security.",
    classes: ["physical-device", "embedded", "network-service"],
    cost: "$15–30",
    sourcing:
      "AliExpress, Amazon, or a thrift store. Buy the ugliest no-name one — obscure vendors cut the most corners and nobody has written it up yet.",
    gotchas:
      "Put it on an isolated VLAN or a spare router before you power it on. Many of these phone home to servers you did not choose, immediately and permanently.",
    requires_kits: ["KIT-HWBENCH"],
    authorization: "owned",
    first_move:
      "Order one, and while it ships, set up a separate network segment for it to live on.",
    failure_mode:
      "Plugging it into your home network to 'see what it does'. Decide where it lives before it arrives.",
    effort: 2,
  },
  {
    id: "TGT-ROUTER",
    name: "Consumer router",
    phrase: "a consumer router",
    brief:
      "A home router, ideally an old one out of a closet. A full embedded Linux system with a web interface, a firmware update mechanism and usually a serial header the vendor forgot to remove.",
    classes: ["physical-device", "embedded", "network-service"],
    cost: "Free to $25",
    sourcing:
      "Your own old one, a family member's closet, or a thrift store. End-of-life models are best — no more patches means real findings stay real.",
    gotchas:
      "Have a way to recover it. Most of these have a TFTP recovery mode; find out what yours is before you flash anything.",
    requires_kits: ["KIT-HWBENCH"],
    authorization: "owned",
    first_move:
      "Find the model number and search for its FCC ID filing. The internal photos in that filing often show you the board before you open it.",
    failure_mode:
      "Bricking the only router in the house. Use a spare, not the one your housemates are currently using.",
    effort: 2,
  },
  {
    id: "TGT-SMARTPLUG",
    name: "Smart plug",
    phrase: "a smart plug",
    brief:
      "A wifi outlet with a small microcontroller inside. Simpler than a camera and often more rewarding — the firmware is small enough to read all of, and the cloud protocol is usually homemade.",
    classes: ["physical-device", "embedded"],
    cost: "$8–20",
    sourcing:
      "Any hardware store or marketplace. ESP8266/ESP32-based models are the most documented, which helps for a first project.",
    gotchas:
      "It is mains voltage. Never open one while it is plugged in, and do not probe a live board. Work on it unplugged, powered over its debug header if you need it running.",
    requires_kits: ["KIT-HWBENCH"],
    authorization: "owned",
    first_move:
      "Buy one and open it — unplugged — to identify the main chip. That chip decides everything about the rest of the project.",
    failure_mode:
      "Probing a mains-connected board. There is no project worth this. Unplug it.",
    effort: 1,
  },
  {
    id: "TGT-DEVBOARD",
    name: "Development board",
    phrase: "a dev board",
    brief:
      "An STM32, ESP32 or RP2040 board. Not a victim — a laboratory. You write the firmware, so you can build the exact bug or behavior you want to study, and you cannot break anything that matters.",
    classes: ["embedded"],
    cost: "$4–15",
    sourcing:
      "A Pi Pico is about $4 and is the cheapest serious way into embedded work. ESP32 boards are similar money with wifi attached.",
    gotchas:
      "Not a gotcha so much as a caution: because nothing is at stake, it is easy to drift into tutorials forever. Set the finding you're after up front.",
    requires_kits: ["KIT-HWBENCH"],
    authorization: "owned",
    first_move:
      "Buy one and blink an LED on it today. The toolchain working is the real first milestone, not the LED.",
    failure_mode:
      "Endless tutorials. The board is for building the thing you want to study, not for completing someone's course.",
    effort: 1,
  },
  {
    id: "TGT-BADGE",
    name: "RFID / NFC badge",
    phrase: "an RFID badge you own",
    brief:
      "A contactless card or fob that belongs to you — a hotel key you kept, a blank you bought, a transit card. Good for learning how these protocols authenticate, and how often they don't.",
    classes: ["physical-device", "protocol"],
    cost: "$5–35 for blanks; a reader is more",
    sourcing:
      "Buy blank cards in the common formats. Do not use a badge that opens a door you do not personally control.",
    gotchas:
      "Cloning a credential that grants access to somewhere is a serious matter even when the card is 'yours'. Work on blanks and on your own cards, and never on an access badge issued to you by an organization.",
    requires_kits: [],
    authorization: "owned",
    first_move:
      "Buy a pack of blank cards in two different formats and read both. The difference between them is the lesson.",
    failure_mode:
      "Cloning a badge that opens a door. Even as a demo, even to yourself, this is the project that ends badly.",
    effort: 2,
  },
  {
    id: "TGT-KEYFOB",
    name: "Car key fob",
    phrase: "a car key fob you own",
    brief:
      "A rolling-code remote for a car you own. A good target for learning radio — the signal is short, repeatable, and you can trigger it whenever you like.",
    classes: ["physical-device", "embedded", "protocol"],
    cost: "You already have one, or $10–20 for a generic spare",
    sourcing:
      "Your own car's fob, or a cheap universal remote if you would rather not experiment with the one that opens your car.",
    gotchas:
      "Receive only. Replaying or jamming in the open is a different legal category from listening, and desyncing a rolling code can leave you locked out of your own car.",
    requires_kits: ["KIT-SDR"],
    authorization: "owned",
    first_move:
      "Capture one button press with your SDR and look at the waveform. Identify the modulation before you try to decode anything.",
    failure_mode:
      "Transmitting. Capture, analyze and write up — all of which is a complete project — without ever keying the radio.",
    effort: 2,
  },
  {
    id: "TGT-OBD",
    name: "Your own car's OBD-II port",
    phrase: "my own car's OBD-II port",
    brief:
      "The diagnostic connector every car built since the late 90s has, usually under the dashboard. A real automotive protocol carrying real traffic, on a vehicle you already own — you can listen to a car talking to itself for the price of a cheap adapter.",
    classes: ["embedded", "protocol"],
    cost: "$10–30 for a USB or Bluetooth adapter",
    sourcing:
      "Any ELM327-based adapter works for reading. Wired USB ones are more reliable than the cheap Bluetooth clones.",
    gotchas:
      "Read only. Listening to diagnostic traffic on your own car is fine; writing to the bus is how people disable their own brakes or immobilizer, and a car is not a device you can reflash back to factory. Never do this while driving — park it.",
    requires_kits: [],
    authorization: "owned",
    links: [
      {
        title: "OBD-II PIDs — the standard request codes",
        url: "https://en.wikipedia.org/wiki/OBD-II_PIDs",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Plug an adapter in with the car parked and ignition on, and read one live value — engine RPM is the friendliest. Seeing a real number come back proves the whole chain works.",
    failure_mode:
      "Sending commands to see what happens. Read first, understand the message format, and leave writing alone unless you genuinely know what that message does.",
    effort: 2,
  },
  {
    id: "TGT-FWIMAGE",
    name: "Public firmware image",
    phrase: "a public firmware image",
    brief:
      "A firmware update file the vendor published on their own support page. Everything you need for a real analysis project, with no hardware to buy and no device to brick.",
    classes: ["firmware-image"],
    cost: "Free",
    sourcing:
      "Vendor support and download pages. Pick a device family with many versions published — diffing two versions is where the findings hide.",
    gotchas:
      "Publicly posted for download is the line. Do not go looking for images the vendor did not publish, and check the download page's terms before you redistribute anything from inside the image.",
    requires_kits: [],
    authorization: "public",
    links: [
      {
        title: "FCC ID search — find the device first",
        url: "https://www.fcc.gov/oet/ea/fccid",
        last_verified: V_2026_09,
      },
    ],
    first_move:
      "Download two consecutive versions of the same firmware and run `binwalk` on both. What changed between them is your lead.",
    failure_mode:
      "Downloading fifty images and analyzing none. One device family, two versions, one question.",
    effort: 2,
  },
];

export default targets;
