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
    detail: {
      overview: [
        "An application built to be broken, running on your own machine. Every bug class in one place, with the answer available when you're genuinely stuck.",
        "Juice Shop is modern and realistic — a single-page app with an API behind it, which is what you'll meet in the real world. DVWA is older and blunter, which makes it better when you want to isolate one bug class and understand it without noise.",
        "The temptation is to work through with the solutions open. That buys the feeling of progress with the exact thing you came for. Give yourself a real attempt before looking.",
      ],
      examples: [
        "Run Juice Shop with one docker command and find the first flaw with no hints.",
        "Use DVWA at each security level in turn and work out what changed between them.",
        "Do the same bug class in both and write up why one was harder.",
      ],
    },
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
    detail: {
      overview: [
        "Something you wrote yourself — a class project, a side project, a tool you made. You know the code, you own the server, and you can break it as hard as you like without asking anyone.",
        "This is the best possible first target if you can already write software, because you can see both sides. You know what the code intended, so when it does something else you understand exactly why, which is the understanding that transfers.",
        "Half-finished is fine. The bugs in unfinished projects are usually more interesting than the ones in polished ones.",
      ],
      contexts: [
        {
          label: "Attacking it",
          body: "Map every place user input enters. Then for each, follow it to where it's used. Most real findings are one input reaching one sink the author didn't think about.",
        },
        {
          label: "Auditing it",
          body: "Sweep it against OWASP ASVS. Your own code is the least intimidating place to learn what the standard actually asks for.",
        },
        {
          label: "Hardening it",
          body: "Add the controls you found missing, then demonstrate the attack failing. Before-and-after on your own code is a very good writeup.",
        },
      ],
      examples: [
        "Take a class project and find an access-control flaw in it, then fix it and show both.",
        "Threat model something you built on one page and mark every trust boundary.",
      ],
    },
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
    detail: {
      overview: [
        "An API that publishes documentation and hands out free keys. Good for learning how web services authenticate, rate-limit, version and leak — and for building something that consumes one properly.",
        "The important distinction: studying documented behaviour is fine, and probing for flaws is not, unless the API is in a bug bounty scope or you deployed it yourself. Building something with an API, and documenting how it actually behaves versus how it's documented, is a full project that stays comfortably on the right side of that line.",
      ],
      contexts: [
        {
          label: "Building with it",
          body: "Write a client that handles the failure cases properly — rate limits, pagination, expired tokens. Most published clients don't, which makes yours worth sharing.",
        },
        {
          label: "Documenting it",
          body: "Compare documented behaviour against observed behaviour. The gaps are real findings and they're publishable without touching anything you shouldn't.",
        },
        {
          label: "Measuring it",
          body: "Response characteristics, versioning behaviour, what the headers reveal. All observable from ordinary use.",
        },
      ],
      examples: [
        "Write a well-behaved client for a public API, handling every documented error.",
        "Document where an API's real behaviour diverges from its docs, and open an issue about it.",
      ],
    },
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
    detail: {
      overview: [
        "A company that has published a scope and invited testing within it. Real systems, real permission — but the permission is exactly as wide as the scope page says and not one asset wider.",
        "Newer and smaller programs have far less picked-over surface than the famous ones. A first-timer on a well-known program is competing with full-time hunters; on a small program that launched last month, they aren't.",
        "Scope drift is the failure that matters. You find something interesting on a host adjacent to the program and keep going. That host is not in scope and neither are you — and the program's safe harbour does not cover it.",
      ],
      contexts: [
        {
          label: "Before you touch anything",
          body: "Read the entire scope and rules page and write down what's in and what's out. If you can't tell whether something is in scope, it isn't.",
        },
        {
          label: "Rate and method limits",
          body: "Most programs forbid automated scanning, social engineering and anything that degrades service. Those rules are not suggestions and breaking them ends the engagement.",
        },
        {
          label: "Reporting",
          body: "A report that can't be reproduced gets closed. Write the reproduction first, then the impact, then everything else.",
        },
      ],
      examples: [
        "Pick one small program, read its full scope, and spend a week on a single asset.",
        "Write a report for a finding on a deliberately vulnerable app first, to practise the format.",
      ],
    },
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
    detail: {
      overview: [
        "A whole machine built to be compromised, from network service to root shell. The closest legal analogue to a real engagement, with a designed path through it.",
        "Give yourself two hours on enumeration alone before trying a single exploit. Almost every stuck moment on these boxes is a service or a directory nobody looked at properly, not a technique nobody knows.",
        "Following a walkthrough and calling it solved is the standard trap. If you read the path, you practised reading.",
      ],
      contexts: [
        {
          label: "Hosted platforms",
          body: "HackTheBox and TryHackMe run them for you. TryHackMe is guided and right while you're still learning what to try; HackTheBox is unguided and right once rooms stop teaching you anything.",
        },
        {
          label: "Local VMs",
          body: "VulnHub images run on your own hardware, free and offline. Host-only networking — these are vulnerable by construction and some ship with real backdoors.",
        },
      ],
      examples: [
        "Do one easy box with no walkthrough, timing how long you spend on enumeration.",
        "Solve a box, then redo it a week later from memory to find out what you actually learned.",
      ],
    },
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
    detail: {
      overview: [
        "A small Active Directory lab on your own machine. Almost every company runs AD, almost every offensive and defensive job touches it, and almost no student has ever seen one — which makes this unusually valuable for how little it costs.",
        "GOAD will build a deliberately vulnerable domain for you, which is the fastest route in. Building one by hand from Microsoft's evaluation ISOs teaches more but takes considerably longer; either is a legitimate project.",
        "It wants memory. Budget 16GB if you can, and keep it on host-only networking.",
      ],
      contexts: [
        {
          label: "Offensive",
          body: "Kerberoasting, delegation abuse, ACL paths. These are the techniques that come up in every internal pentest and they're almost impossible to learn without a domain to try them on.",
        },
        {
          label: "Defensive",
          body: "Build the detections for those same techniques. Domain controller logs are where most enterprise detection engineering happens.",
        },
        {
          label: "Hardening",
          body: "Take a deliberately vulnerable domain and fix it, measuring against a published baseline. Rarely done by students and very visible on a résumé.",
        },
      ],
      examples: [
        "Stand up one domain controller and one workstation, and join them. That alone is most of the learning.",
        "Deploy GOAD and work one attack path end to end, then write the detection for it.",
      ],
    },
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
    detail: {
      overview: [
        "The network you pay for. Nobody's lab looks like production, but your home network is production — real devices, real traffic, and you're allowed to touch all of it.",
        "Almost everyone who inventories their own network finds something they'd forgotten about. That's the project right there.",
        "If you share the flat, tell your housemates before capturing traffic or changing the router. Your authorization covers your network, not their privacy.",
      ],
      contexts: [
        {
          label: "Inventory",
          body: "Every device with an IP, what it is, what it talks to. Unglamorous and consistently produces a surprise.",
        },
        {
          label: "Segmentation",
          body: "Put the untrusted devices somewhere they can't reach your laptop, then verify from inside that segment that they genuinely can't.",
        },
        {
          label: "Measurement",
          body: "Capture a day of traffic and count something — how many devices phone home, how often, to where.",
        },
      ],
      examples: [
        "Inventory the network and write up the device you'd forgotten was on it.",
        "Move one IoT device to a guest network and prove the isolation holds by testing from it.",
      ],
    },
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
    detail: {
      overview: [
        "Something you run for yourself — a media server, a git forge, a wiki, a password manager. You own it completely, which means you can attack it, harden it, instrument it and break it without asking anyone.",
        "Pick something you'd actually use. A service you want running is one you'll maintain past the end of the project, which is what turns it into ongoing experience rather than a one-off.",
        "Self-hosting as the project is the trap. Standing up nine services is a hobby; pick one and do something to it.",
      ],
      contexts: [
        {
          label: "Hardening",
          body: "Record the defaults, change them, prove the change blocks something. The cleanest possible hardening project.",
        },
        {
          label: "Instrumenting",
          body: "Add logging at the authorization boundary and analyse a week of it.",
        },
        {
          label: "Breaking",
          body: "Attack your own deployment. You know the configuration, so you can tell a real finding from a misconfiguration you caused.",
        },
      ],
      examples: [
        "Stand up a service with defaults, record them, then harden it and demonstrate one attack failing.",
        "Write a reference build for it that someone else can copy, with the reasoning for each choice.",
      ],
    },
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
    detail: {
      overview: [
        "Your own AWS, Azure or GCP account. The place to learn identity and permissions, because you can grant yourself a bad permission on purpose and then go and find it.",
        "The billing alarm goes on before the first deployment, at a threshold low enough to be annoying. The classic student cloud story ends with a four-figure bill from a resource nobody remembered.",
        "Your account authorizes you to touch your own resources. It does not authorize you to touch the provider's infrastructure or another tenant.",
      ],
      contexts: [
        {
          label: "Identity",
          body: "Deliberately create an over-permissive role, then find it with tooling. Understanding the path from bad policy to compromise is the whole of cloud security.",
        },
        {
          label: "Auditing",
          body: "Run a baseline tool against it and go through every finding. Free, and directly mirrors a real job.",
        },
        {
          label: "Metadata",
          body: "Start an instance and query the metadata endpoint from inside it. Seeing credentials handed out on request is the moment SSRF stops being abstract.",
        },
      ],
      examples: [
        "Set a $5 billing alarm, then create one deliberately bad role and find it with Prowler.",
        "Demonstrate the SSRF-to-credentials path end to end in your own account.",
      ],
    },
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
    detail: {
      overview: [
        "A published container image — its layers, what's baked into it, what it runs as. An enormous amount of modern software ships this way and most images contain more than their authors think.",
        "Every layer is a command someone ran, and they're all readable. Secrets get added in one layer and deleted in the next, which does not remove them from the image.",
        "Reporting a scanner's CVE list is not a finding. Anyone can run a scanner; the work is deciding which of those actually matter in this image, as configured.",
      ],
      contexts: [
        {
          label: "Auditing",
          body: "What user does it run as, what's installed that isn't needed, what's in the layer history that shouldn't be?",
        },
        {
          label: "Comparing",
          body: "Diff a default image against a hardened one, layer by layer, and quantify the difference.",
        },
        {
          label: "Hardening",
          body: "Rebuild it minimal — non-root, no shell, nothing unnecessary — and show the same application still works.",
        },
      ],
      examples: [
        "Pull a popular image, read its full layer history, and write up what's in there that surprised you.",
        "Harden an image to non-root and minimal, and measure the attack surface before and after.",
      ],
    },
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
    detail: {
      overview: [
        "A Kubernetes cluster you built yourself, locally or in your own account. Deep enough to be a real subject for hardening, auditing or instrumenting, and entirely yours.",
        "Run it locally first with kind or k3s. A hosted control plane bills by the hour whether you're learning or asleep.",
        "Kubernetes is large enough to eat a whole term by itself. Scope to one question — one policy, one control, one audit — or the cluster becomes the project and nothing gets found.",
      ],
      contexts: [
        {
          label: "Hardening",
          body: "Network policies, pod security, RBAC. Each is a self-contained project and all three are in demand.",
        },
        {
          label: "Auditing",
          body: "Run a benchmark against your cluster and work through the findings.",
        },
        {
          label: "Breaking",
          body: "Deploy something deliberately over-permissioned and escape from it. Your cluster, so nothing is at risk.",
        },
      ],
      examples: [
        "Create a cluster with kind, deploy one pod, and write the network policy that isolates it — then prove it.",
        "Audit your own cluster against a published benchmark and report the gaps.",
      ],
    },
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
    detail: {
      overview: [
        "The automation that builds and ships one of your repos. Pipelines hold secrets, run untrusted code, and have more permission than anyone remembers granting — and almost nobody looks at them.",
        "Supply chain security is a live, well-funded area and this is its most accessible surface. A student who can explain why a workflow trigger is dangerous is ahead of a lot of working engineers.",
        "Use your own repo. A fork's CI is still someone else's compute.",
      ],
      contexts: [
        {
          label: "Auditing",
          body: "Every permission the workflow grants, every secret it can read, every action it pulls in and whether that action is pinned.",
        },
        {
          label: "Hardening",
          body: "Cut permissions to the minimum, pin third-party actions to a commit, and show what breaks.",
        },
        {
          label: "Automating",
          body: "Add a security check that fails the build, and explain why that specific check.",
        },
      ],
      examples: [
        "Audit a workflow you own and write down every permission and secret it can reach.",
        "Pin every third-party action to a commit hash and document why that matters.",
      ],
    },
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
    detail: {
      overview: [
        "A RAM capture from a machine, published for teaching. Everything that never touched disk lives here — running processes, network connections, injected code, sometimes keys and passphrases.",
        "There is no setup. Download an image, install one tool, and you're doing forensics. That makes it the cheapest possible entry into DFIR, and the results are immediate enough to stay motivating.",
        "Wrong profile or wrong symbols, then concluding the image is broken, is the standard first-hour failure. Confirm the OS build first.",
      ],
      contexts: [
        {
          label: "Triage",
          body: "Process list, network connections, loaded modules. Ten minutes gets you a picture of what the machine was doing.",
        },
        {
          label: "Finding injection",
          body: "Compare what's in memory against what should be on disk. Discrepancies are where the interesting things are.",
        },
        {
          label: "Recovery",
          body: "Pull artifacts out that exist nowhere else — clipboard contents, unsaved documents, keys.",
        },
      ],
      examples: [
        "Work through the MemLabs challenges in order and write up the method, not just the flags.",
        "Take one published image and produce a full triage report from it.",
      ],
    },
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
    detail: {
      overview: [
        "Logs from a real or simulated intrusion, published so people can practise on them. The raw material for timelines, detections and the kind of investigation defensive teams do all day.",
        "Datasets mapped to ATT&CK techniques are the most useful, because you know what you're looking for and can check whether you found it.",
        "Timezones are the recurring trap. Every source states time differently, and a timeline that mixes them silently is wrong in a way nobody notices until someone checks.",
      ],
      contexts: [
        {
          label: "Building a timeline",
          body: "Merge sources, normalise to UTC at ingest, record what each source claimed. The normalisation is the skill.",
        },
        {
          label: "Writing detections",
          body: "Build the rule against the attack portion, then test it against the benign portion and measure false positives.",
        },
        {
          label: "Measuring",
          body: "How noisy is a given signal in normal operation? Almost nobody checks, which is why so many detections are unusable.",
        },
      ],
      examples: [
        "Take one dataset, build a full timeline, and defend the ordering.",
        "Write a detection for the technique it demonstrates, then measure its false positive rate.",
      ],
    },
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
    detail: {
      overview: [
        "A real piece of malware from a public research corpus. The most realistic analysis target available, and the one with the strictest handling rules — which is itself a large part of the lesson.",
        "Build and verify the isolated VM before you obtain a single sample. Not after. Check from inside the VM that it genuinely cannot reach anything, because an isolation you assumed rather than tested is the one that fails.",
        "Pick something old and well-documented for a first look. You can check your analysis against published ones, which is how you find out whether you were right.",
      ],
      contexts: [
        {
          label: "Static triage",
          body: "Hashes, strings, imports, packing. You can learn a lot before running anything, and you should.",
        },
        {
          label: "Dynamic analysis",
          body: "Detonate in the isolated VM, record what it touched, revert. Revert every single time — otherwise you cannot tell which sample did what.",
        },
        {
          label: "Writing it up",
          body: "Indicators, behaviour, and what a defender should look for. That last part is what makes it useful to anyone else.",
        },
      ],
      examples: [
        "Statically triage an old, well-documented sample and compare your findings to a published analysis.",
        "Detonate one safely and produce a behavioural report with indicators.",
      ],
    },
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
    detail: {
      overview: [
        "Published packet captures, scan data, breach statistics, research corpora. Real material at real scale that someone else already collected and cleared for use.",
        "One question first, then the data to answer it. Downloading a hundred gigabytes without a question is how these projects stall.",
        "Check the licence. \"Public\" and \"redistributable\" are different things, and some research datasets require registration and citation.",
      ],
      examples: [
        "Download one capture and answer a single question about it before deciding what the project is.",
        "Find a claim someone made about a public dataset and check it yourself.",
      ],
    },
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
    detail: {
      overview: [
        "A real project with real users and a public issue tracker. The only target here where doing the work well produces a Tier-1 proof almost automatically, because contributions get reviewed by someone who can say no.",
        "Pick something you already use. Familiarity with the software is worth far more than the project's prestige, and aiming at Linux or Chromium first is how people bounce off.",
        "Read CONTRIBUTING and the security policy before opening anything. If you find a vulnerability it goes through their security process, not the public tracker.",
      ],
      contexts: [
        {
          label: "Contributing",
          body: "Build from source first. If the build instructions are wrong, that's your first contribution and it's a real one.",
        },
        {
          label: "Auditing",
          body: "Sweep for one vulnerability class across the codebase. Systematic, and it produces something reportable.",
        },
        {
          label: "Documenting",
          body: "The highest-acceptance contribution category and the one maintainers most need.",
        },
      ],
      examples: [
        "Clone something you use, build it, and fix whatever was wrong with the instructions.",
        "Review one project for a single vulnerability class and report what you find through the right channel.",
      ],
    },
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
    detail: {
      overview: [
        "A binary built to be reversed. Someone designed a lesson into it, which makes it a far better teacher than a random real binary where you can't distinguish difficulty from noise.",
        "Start one level below where you think you are. Starting too hard, stalling, and concluding you can't do reversing is the single most common way people give up on this domain.",
        "Run unknown binaries in a VM even though these are built for the purpose. It costs nothing and builds the habit.",
      ],
      examples: [
        "Solve one rated below your level today, end to end, and write up how the check worked.",
        "Solve the same one twice — once with the decompiler, once reading disassembly only.",
      ],
    },
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
    detail: {
      overview: [
        "The save file of a game you own. An undocumented binary format with a built-in oracle: change something in the game, watch which bytes move. That feedback loop is the friendliest possible introduction to format reversing.",
        "Older and smaller games are better. Modern saves are often compressed or encrypted, and you'll spend three weeks on the encryption instead of the format.",
        "Stay single-player and stay off anything with anti-cheat. Modifying a multiplayer game's files is a ban at best.",
      ],
      examples: [
        "Save twice with one thing changed and diff the files to find the field.",
        "Map enough of the format to write a parser, then a writer the game accepts.",
      ],
    },
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
    detail: {
      overview: [
        "MQTT, Modbus, BLE or any published specification. Reading a spec properly and implementing against it is the most reliable way to actually understand a protocol, and it needs nothing but a text editor.",
        "Pick something small and finished. MQTT's core spec is readable in an afternoon; BLE's is enormous, so take one layer of it if that's your interest.",
        "Some industrial standards cost hundreds of dollars. Check before committing — there is always an open protocol that teaches the same lesson.",
      ],
      examples: [
        "Hand-decode one real message byte by byte on paper before writing any code.",
        "Implement a minimal client and test it against a real broker or server.",
      ],
    },
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
    detail: {
      overview: [
        "How a team you're on handles credentials, onboarding, infrastructure or handover. Unglamorous, genuinely useful, and the only target here where the beneficiary is in the room with you.",
        "Ask what's annoying. The thing everyone complains about and nobody has written down is the project.",
        "Get the team's agreement first. Auditing a process means writing down what people do badly, and that lands very differently when they asked for it than when they didn't.",
      ],
      examples: [
        "Ask a team lead which process wastes the most of their time and get agreement to write it up.",
        "Document a handover process that currently only exists in one person's head.",
      ],
    },
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
    detail: {
      overview: [
        "A cheap network camera off a marketplace. The classic teaching target: a real embedded Linux system, a real network service, and a vendor who spent nothing on security.",
        "Buy the ugliest no-name one. Obscure vendors cut the most corners and nobody has written it up yet, which means your findings are actually new.",
        "Decide where it lives on your network before it arrives. Many of these phone home to servers you did not choose, immediately and permanently.",
      ],
      contexts: [
        {
          label: "As a network target",
          body: "You don't have to open it. Scan it, look at its web interface, watch what it talks to. That's a full project with no tools beyond what you have.",
        },
        {
          label: "As a hardware target",
          body: "Open it, find the UART, get a shell. This is where the hardware bench becomes necessary.",
        },
        {
          label: "As a firmware target",
          body: "Often the vendor publishes an update file, in which case you can analyse the firmware without touching the device at all.",
        },
      ],
      examples: [
        "Put one on an isolated segment and document every outbound connection it makes.",
        "Find the serial console and get a root shell, then write up the board.",
      ],
    },
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
    detail: {
      overview: [
        "A home router, ideally an old one out of a closet. A full embedded Linux system with a web interface, a firmware update mechanism, and usually a serial header the vendor forgot to remove.",
        "End-of-life models are best: no more patches means real findings stay real, and the device is free.",
        "Have a recovery path before you flash anything. Most have a TFTP recovery mode — find out what yours is first.",
      ],
      contexts: [
        {
          label: "Before opening it",
          body: "Search the FCC ID. The filing usually includes internal photographs, so you can see the board before you pick up a screwdriver.",
        },
        {
          label: "As a web target",
          body: "The admin interface is a web app written under time pressure by people who assumed nobody would look.",
        },
        {
          label: "As a firmware target",
          body: "Check the OpenWrt hardware table — it often lists the chipset, flash size and serial pinout before you open anything.",
        },
      ],
      examples: [
        "Find the serial header on an old router and document the boot process.",
        "Download two firmware versions for it and diff them.",
      ],
    },
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
    detail: {
      overview: [
        "A wifi outlet with a small microcontroller inside. Simpler than a camera and often more rewarding — the firmware is small enough to read all of, and the cloud protocol is usually homemade.",
        "ESP8266 and ESP32-based models are the most documented, which helps a lot for a first project.",
        "It is mains voltage. Never open one while plugged in and never probe a live board — work on it unplugged, powered over its debug header if it needs to run.",
      ],
      examples: [
        "Open one unplugged and identify the main chip. That chip decides everything else about the project.",
        "Capture its cloud traffic and document the protocol it speaks.",
      ],
    },
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
    detail: {
      overview: [
        "An STM32, ESP32 or RP2040 board. Not a victim — a laboratory. You write the firmware, so you can build the exact bug or behaviour you want to study, and you can't break anything that matters.",
        "A Pi Pico is about four dollars and is the cheapest serious way into embedded work. ESP32 boards are similar money with wifi attached.",
        "Because nothing is at stake it's easy to drift into tutorials forever. Decide the finding you're after up front.",
      ],
      examples: [
        "Blink an LED to prove the toolchain works, then build the specific vulnerable behaviour you want to study.",
        "Implement a protocol on it and attack your own implementation.",
      ],
    },
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
    detail: {
      overview: [
        "A contactless card or fob that belongs to you — a blank you bought, a hotel key you kept, a transit card. Good for learning how these protocols authenticate, and how often they don't.",
        "Work on blanks and on your own cards. Never on an access badge issued to you by an organization — cloning a credential that opens a door is a serious matter even when the card is technically yours.",
        "You can still harden and model this without touching the card: what the reader accepts, whether cloning is detectable, whether a second factor exists. That's real work and it stays well inside the line.",
      ],
      examples: [
        "Buy blanks in two different formats, read both, and document the difference.",
        "Threat model a badge access system and write up what would make cloning detectable.",
      ],
    },
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
    detail: {
      overview: [
        "A rolling-code remote for a car you own. A good target for learning radio — the signal is short, repeatable, and you can trigger it whenever you like.",
        "Receive only. Capturing, analysing and writing up is a complete project and never requires keying the radio. Replaying or jamming in the open is a different legal category, and desyncing a rolling code can lock you out of your own car.",
        "A cheap generic remote is a safer subject than the fob that actually opens your car.",
      ],
      examples: [
        "Capture one button press and identify the modulation before trying to decode anything.",
        "Document the signal structure and write up how rolling codes defeat naive replay.",
      ],
    },
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
    detail: {
      overview: [
        "The diagnostic connector every car built since the late 90s has, usually under the dashboard. A real automotive protocol carrying real traffic, on a vehicle you already own.",
        "Read only. Listening to diagnostic traffic on your own parked car is fine; writing to the bus is how people disable their own immobiliser, and a car is not a device you can reflash back to factory.",
        "Never do this while driving. Park it, ignition on, engine off or idling.",
      ],
      examples: [
        "Plug in an adapter and read engine RPM live. Seeing a real number proves the whole chain works.",
        "Log a diagnostic session and document the message format you observe.",
      ],
    },
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
    detail: {
      overview: [
        "A firmware update file the vendor published on their own support page. Everything you need for a real analysis project, with no hardware to buy and no device to brick.",
        "Pick a device family with many versions published — diffing two versions is where the findings hide, and the vendor has done the hard part of collecting them for you.",
        "Publicly posted for download is the line. Don't go looking for images the vendor didn't publish, and check the terms before redistributing anything from inside one.",
      ],
      examples: [
        "Download two consecutive versions and binwalk both. What changed is your lead.",
        "Extract a filesystem and audit its startup scripts for anything running as root without checking input.",
      ],
    },
  },
];

export default targets;
