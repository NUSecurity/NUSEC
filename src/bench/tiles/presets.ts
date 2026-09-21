import { Preset } from "@/bench/types";

/**
 * Six worked benches.
 *
 * Presets exist to be taken apart, not copied. Loading one fills all three
 * slots and the student immediately sees the individual tiles that produced the
 * sentence — a faster way to learn the grammar than reading about it.
 *
 * Ordered the way the room's interests actually run: web and offensive first,
 * defensive and cloud next, hardware last for the people who want it.
 */
const presets: Preset[] = [
  {
    slug: "web-by-hand",
    title: "Find a web bug by hand",
    who: "You've done a few guided rooms and want to stop relying on hints.",
    bench: {
      pattern: "PAT-BREAK",
      target: "TGT-VULNWEB",
      artifact: "ART-WRITEUP",
      skill: "SKL-OFFSEC-WEB",
      from: "recognize",
      to: "use",
      prove: "PRV-CTFWRITEUP",
    },
  },
  {
    slug: "catch-an-attack",
    title: "Catch an attack in the logs",
    who: "You'd rather be the one who spots it than the one who does it.",
    bench: {
      pattern: "PAT-DETECT",
      target: "TGT-LOGSET",
      artifact: "ART-REPO",
      skill: "SKL-DFIR-TIMELINE",
      from: "recognize",
      to: "use",
      prove: "PRV-PR",
    },
  },
  {
    slug: "audit-your-cloud",
    title: "Audit a cloud account",
    who: "You want cloud on your résumé and you learn by finding things.",
    bench: {
      pattern: "PAT-AUDIT",
      target: "TGT-CLOUDACCT",
      artifact: "ART-WRITEUP",
      skill: "SKL-CLOUD-IAM",
      from: "recognize",
      to: "use",
      prove: "PRV-REVIEWEDPOST",
    },
  },
  {
    slug: "harden-and-publish",
    title: "Harden something, publish the recipe",
    who: "You already run something of your own and want defensive work that counts.",
    bench: {
      pattern: "PAT-HARDEN",
      target: "TGT-SELFHOST",
      artifact: "ART-REFBUILD",
      skill: "SKL-LINUX-SYSTEMD",
      from: "use",
      to: "build",
      prove: "PRV-REVIEWEDPOST",
    },
  },
  {
    slug: "write-what-was-missing",
    title: "Write the page you wish had existed",
    who: "You're new, you can read, and you want a first win that isn't fake.",
    bench: {
      pattern: "PAT-DOCUMENT",
      target: "TGT-OSSREPO",
      artifact: "ART-TEACHING",
      skill: "SKL-LINUX-BUILD",
      from: "recognize",
      to: "use",
      prove: "PRV-TRANSLATE",
    },
  },
  {
    slug: "first-hardware-project",
    title: "Open up a cheap device",
    who: "You want to get inside physical things and need a cheap place to start.",
    bench: {
      pattern: "PAT-TEARDOWN",
      target: "TGT-IPCAM",
      artifact: "ART-WRITEUP",
      skill: "SKL-HW-UART",
      from: "recognize",
      to: "use",
      prove: "PRV-REVIEWEDPOST",
    },
  },
];

export default presets;
