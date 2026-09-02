import { Meeting } from "@/ctf/types";

/**
 * The mini-CTF. Artifacts live in `public/ctf/mini-ctf/`.
 * Flags are checked server-side in `api/ctfValidator.ts` — never put them here.
 */
const miniCtf: Meeting = {
  slug: "mini-ctf",
  title: "Mini CTF",
  active: true,
  challenges: [
    {
      slug: "admin-authentication",
      title: "Admin Authentication",
      category: "web",
      brief: [
        "On the linked site, only administrators with proper authorization are allowed to view sensitive content.",
      ],
      assets: [
        {
          label: "Open the portal",
          href: "/ctf/mini-ctf/admin.html",
          kind: "link",
        },
      ],
    },
    {
      slug: "cool-logo",
      title: "Cool Logo",
      category: "forensics",
      brief: [
        "For no reason in particular, a PNG of our logo can be found below.",
      ],
      assets: [
        {
          label: "logo.png",
          href: "/ctf/mini-ctf/logo.png",
          kind: "download",
        },
      ],
    },
    {
      slug: "leaked-login",
      title: "Leaked Login",
      category: "network",
      brief: [
        "Some network traffic was captured which we believe may contain some login credentials.",
      ],
      assets: [
        {
          label: "nusec-login.pcapng",
          href: "/ctf/mini-ctf/nusec-login.pcapng",
          kind: "download",
        },
      ],
    },
  ],
};

export default miniCtf;
