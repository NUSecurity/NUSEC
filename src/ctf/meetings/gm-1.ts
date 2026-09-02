import { Meeting } from "@/ctf/types";

/**
 * GM-1 mini-CTF. Artifacts live in `public/ctf/gm-1/`.
 * Flags are checked server-side in `api/ctfValidator.ts` — never put them here.
 */
const gm1: Meeting = {
  slug: "gm-1",
  title: "General Meeting 1",
  subtitle: "Warm-up CTF",
  date: "2025-09-02",
  active: true,
  intro: [
    "Three challenges, three flags. Each one is a different corner of security work: poking at a web app, digging through a file, and reading traffic off the wire.",
    "Work in any order. Submit flags on the challenge page — you'll know right away if you're right.",
  ],
  challenges: [
    {
      slug: "admin-portal",
      title: "Admin Portal",
      category: "web",
      difficulty: "easy",
      points: 100,
      tagline: "The portal says you're not an administrator. The portal is wrong.",
      brief: [
        "We found an internal NUSEC portal that gates its admin view behind a check in the browser. Access is denied by default.",
        "Nothing about your session is verified anywhere — the page decides what you're allowed to see using information you control. Find where that decision is made and change the answer.",
      ],
      assets: [
        {
          label: "Open the portal",
          href: "/ctf/gm-1/admin.html",
          kind: "link",
          note: "opens in a new tab",
        },
      ],
      hints: [
        "Look at the URL after the page loads. It changed on its own — why would it do that?",
        "View the page source. The whole access check is right there in the <script> block.",
        "The page reads a query parameter to decide who you are. Try setting it yourself.",
      ],
      flagFormat: "NUSEC{...}",
    },
    {
      slug: "in-the-details",
      title: "In The Details",
      category: "forensics",
      difficulty: "easy",
      points: 100,
      tagline: "A perfectly ordinary image. Almost.",
      brief: [
        "Someone passed this image around and swore there was nothing to it. An image file is more than the pixels you see — it carries text fields, comments, and chunks that never get rendered.",
        "Download it and look at what the file says about itself, not at what it draws.",
      ],
      assets: [
        {
          label: "in_the_details.png",
          href: "/ctf/gm-1/in_the_details.png",
          kind: "download",
          note: "67 KB",
        },
      ],
      hints: [
        "Staring at the picture won't help. Look at the file as bytes.",
        "`strings in_the_details.png` or `exiftool in_the_details.png` will do it in one command.",
        "On Windows without those tools, open the file in any hex editor and search for 'NUSEC'.",
      ],
      flagFormat: "NUSEC{...}",
    },
    {
      slug: "wire-tap",
      title: "Wire Tap",
      category: "network",
      difficulty: "easy",
      points: 100,
      tagline: "Someone logged in over plain HTTP. We were listening.",
      brief: [
        "We captured traffic from a machine while a user signed in to an internal login page. The site was served over HTTP, not HTTPS, which means everything sent to it crossed the network in the clear.",
        "Open the capture in Wireshark and find the credentials. The password is the flag.",
      ],
      assets: [
        {
          label: "nusec-login.pcapng",
          href: "/ctf/gm-1/nusec-login.pcapng",
          kind: "download",
          note: "7 KB — open with Wireshark",
        },
      ],
      hints: [
        "Login forms submit with POST. Filter for HTTP requests and see which ones carry a body.",
        "Try the display filter `http.request.method == \"POST\"`.",
        "Right-click the POST packet and choose Follow > HTTP Stream to read the form data as text.",
      ],
      flagFormat: "NUSEC{...}",
    },
  ],
};

export default gm1;
