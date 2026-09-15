import { Meeting } from "@/ctf/types";

const handsOnPractice: Meeting = {
  slug: "hands-on-practice",
  title: "Hands On Practice",
  active: true,
  challenges: [
    {
      slug: "admin-authentication",
      title: "Admin Authentication",
      category: "web",
      brief:
        "On the linked site, only administrators with proper authorization are allowed to view sensitive content.",
      assets: [
        {
          label: "Open the portal",
          href: "/ctf/hands-on-practice/admin",
          kind: "link",
        },
      ],
    },
    {
      slug: "members-only",
      title: "Members Only",
      category: "appsec",
      brief:
        "The club never got around to replacing its old member portal. The admin password is not guessable — but the login box is a little too trusting about what it is handed.",
      assets: [
        {
          label: "Open the member portal",
          href: "/ctf/hands-on-practice/login",
          kind: "link",
        },
      ],
    },
    {
      slug: "disk-image-triage",
      title: "Disk Image Triage",
      category: "forensics",
      brief:
        "A workstation was imaged after an out-of-hours alert. One document was copied, renamed, and sent off the machine. Work the timestamps, then name the host it was exported to.",
      assets: [
        {
          label: "Mount the disk image",
          href: "/ctf/hands-on-practice/image",
          kind: "link",
        },
      ],
    },
    {
      slug: "leaked-login",
      title: "Leaked Login",
      category: "network",
      brief:
        "Some network traffic was captured which we believe may contain some login credentials.",
      assets: [
        {
          label: "nusec-login.pcapng",
          href: "/ctf/hands-on-practice/nusec-login.pcapng",
          kind: "download",
        },
        {
          label: "Open the packet analyzer (no Wireshark needed)",
          href: "/tools/pcap",
          kind: "link",
        },
      ],
    },
    {
      slug: "paper-trail",
      title: "Paper Trail",
      category: "osint",
      brief:
        "Five accounts belonging to one person, across five different sites. Nothing private was ever posted — but the answers to their account recovery questions are all still sitting there in public. Find all five.",
      assets: [
        {
          label: "Open the profile explorer",
          href: "/ctf/hands-on-practice/social",
          kind: "link",
        },
      ],
    },
    {
      slug: "ticket-triage",
      title: "Ticket Triage",
      category: "ai",
      brief:
        "The helpdesk bot summarises every ticket that comes in, and it has been told to keep the internal escalation key to itself. It also cannot tell the difference between the instructions it was given and the text it was asked to read.",
      assets: [
        {
          label: "Open the triage queue",
          href: "/ctf/hands-on-practice/triage",
          kind: "link",
        },
      ],
    },
    {
      slug: "open-bucket",
      title: "Open Bucket",
      category: "cloud",
      brief:
        "The club's static assets live in a public object store, which is fine — that is what it is for. The migration also dropped some things in there that were never meant to be public.",
      assets: [
        {
          label: "Open the bucket listing",
          href: "/ctf/hands-on-practice/bucket",
          kind: "link",
        },
      ],
    },
    {
      slug: "smart-lock",
      title: "Smart Lock",
      category: "embedded",
      brief:
        "A networked deadbolt was installed last week and never commissioned. You have no user code — but the manufacturer publishes a datasheet, and so does everyone else.",
      assets: [
        {
          label: "Open the lock keypad",
          href: "/ctf/hands-on-practice/lock",
          kind: "link",
        },
      ],
    },
    {
      slug: "obscure-encryption",
      title: "Obscure Encryption",
      category: "cryptography",
      brief: "While trying to intercept a flag, we got this useless gibberish.",
      content:
        "NEUgNTUgNTMgNDUgNDMgN0IgNkMgNjEgNzkgMzMgNzIgNUYgNjIgNzkgNUYgNkMgNDAgNzkgNjUgNzIgN0Q=",
    },
  ],
};

export default handsOnPractice;
