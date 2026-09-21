import { Preset } from "@/bench/types";

/**
 * Six worked benches.
 *
 * Presets exist to be taken apart, not copied. Loading one fills all three
 * slots and the student immediately sees the individual tiles that produced the
 * sentence — which is a faster way to learn the grammar than reading about it.
 *
 * Every one of these resolves cleanly: the proof consumes the artifact the
 * project yields, and the skill is one the pattern demands. That's deliberate.
 * A student who then swaps one tile and sees the closing sentence change has
 * learned the whole lesson.
 */
const presets: Preset[] = [
  {
    slug: "first-hardware-project",
    title: "First hardware project",
    who: "You've never opened a device and want a cheap, real place to start.",
    bench: {
      pattern: "PAT-TEARDOWN",
      target: "TGT-IPCAM",
      artifact: "ART-WRITEUP",
      skill: "SKL-HW-UART",
      from: "recognize",
      to: "use",
      prove: "PRV-CLUBBLOG",
    },
  },
  {
    slug: "web-by-hand",
    title: "Web app, by hand",
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
    slug: "firmware-no-hardware",
    title: "Firmware, no hardware needed",
    who: "You want to do embedded work but haven't bought anything yet.",
    bench: {
      pattern: "PAT-FIRMWARE",
      target: "TGT-FWIMAGE",
      artifact: "ART-WRITEUP",
      skill: "SKL-RE-GHIDRA",
      from: "recognize",
      to: "use",
      prove: "PRV-BSIDES",
    },
  },
  {
    slug: "count-something",
    title: "Count something nobody counted",
    who: "You'd rather produce evidence than exploits, and you like data.",
    bench: {
      pattern: "PAT-MEASURE",
      target: "TGT-PUBDATA",
      artifact: "ART-DATASET",
      skill: "SKL-NET-CAPTURE",
      from: "recognize",
      to: "use",
      prove: "PRV-POSTER",
    },
  },
  {
    slug: "harden-and-publish",
    title: "Harden it, then publish the recipe",
    who: "You already self-host something and want defensive work that counts.",
    bench: {
      pattern: "PAT-HARDEN",
      target: "TGT-SELFHOST",
      artifact: "ART-REFBUILD",
      skill: "SKL-LINUX-SYSTEMD",
      from: "use",
      to: "build",
      prove: "PRV-CLUBBLOG",
    },
  },
  {
    slug: "tool-people-install",
    title: "Build a tool people install",
    who: "You can code and want the contribution loop that ends in a merged PR.",
    bench: {
      pattern: "PAT-AUTOMATE",
      target: "TGT-CLOUDACCT",
      artifact: "ART-TOOL",
      skill: "SKL-CLOUD-BASELINE",
      from: "recognize",
      to: "use",
      prove: "PRV-PR",
    },
  },
];

export default presets;
