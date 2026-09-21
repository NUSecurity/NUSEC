import { Kit } from "@/bench/types";

/**
 * The 6 prerequisites.
 *
 * Kit exists because "home lab" broke the grammar. A home lab is not a project
 * — it's the floor a project stands on. Making it a project means half the room
 * writes "home lab" on their bench and nothing ever ships.
 *
 * Kits never block. Plenty of people buy the thing *because* they picked the
 * project. But "you need a $12 UART adapter before this starts" beats
 * discovering that three weeks in.
 */
const kits: Kit[] = [
  {
    id: "KIT-HOMELAB",
    name: "Home lab",
    brief:
      "A hypervisor and at least two VMs you can break and restore at will. The restore is the point — you will only experiment freely on a machine you are not afraid to destroy.",
    cost: "Free, on hardware you already own",
    first_move:
      "Install VirtualBox or use the hypervisor your OS already ships, build one Debian VM, and take a snapshot. Restore from that snapshot once so you know it works.",
    failure_mode:
      "Building the lab as the goal. Racking up six VMs, a domain controller and a network diagram, then never running an experiment. Two VMs is enough to start.",
  },
  {
    id: "KIT-HWBENCH",
    name: "Hardware bench",
    brief:
      "A multimeter, a soldering iron, a USB-UART adapter and a logic analyzer. This is the entry kit for every hardware project — with it you can find a serial console on an unknown board, and without it you cannot.",
    cost: "$60–120 for all four, and you do not need all four to start",
    first_move:
      "Buy a USB-UART adapter first — it's about $12 and it unlocks the most by far. Get that one working before you buy anything else.",
    failure_mode:
      "Buying a $400 bench before doing a $12 project. Get the adapter, find one UART, then decide what else you actually need.",
  },
  {
    id: "KIT-FLASHDUMP",
    name: "Flash dumping kit",
    brief:
      "A SOIC-8 clip and a CH341A-class programmer, for reading a flash chip's contents without desoldering it. This is how you get firmware off a device whose vendor never published an update file.",
    cost: "$15–25 for the pair",
    first_move:
      "Order the clip and programmer together, then practise on a device you don't care about before touching the one you do.",
    failure_mode:
      "Powering the board and the programmer at the same time and browning out the chip mid-read. Read the chip in-circuit with the board unpowered, and verify two dumps match before you trust either.",
  },
  {
    id: "KIT-SDR",
    name: "Software-defined radio",
    brief:
      "An RTL-SDR for receiving, or a HackRF if you need to transmit. Turns radio into a signal you can look at, which is the whole prerequisite for any key fob or wireless protocol work.",
    cost: "~$40 for an RTL-SDR, ~$150+ for a HackRF",
    first_move:
      "Get an RTL-SDR v3 and tune it to a local FM station. Hearing something you can verify proves the whole chain works before you go hunting for a fob.",
    failure_mode:
      "Transmitting. Receiving is broadly fine; transmitting is regulated, and on most bands you need a licence. Stay on receive unless you know exactly which rules apply to you.",
  },
  {
    id: "KIT-CLOUDACCT",
    name: "Cloud account with a billing alarm",
    brief:
      "Your own cloud account, with a hard billing alarm set before you deploy anything. The alarm is not optional — the classic student cloud story ends with a four-figure bill from a resource nobody remembered.",
    cost: "Free tier, plus whatever you spend past it",
    first_move:
      "Create the account and set a billing alarm at $5 in the same sitting. Do not deploy anything until the alarm exists.",
    failure_mode:
      "Leaving something running. Set the alarm, then tear resources down the day you finish with them rather than the day you remember.",
  },
  {
    id: "KIT-MALVM",
    name: "Malware analysis VM",
    brief:
      "An isolated VM with no network path to anything you care about, snapshotted before every run. For looking at samples that are actively hostile, which normal lab hygiene does not cover.",
    cost: "Free",
    first_move:
      "Build the VM, set its network adapter to host-only or disabled, and take the clean snapshot. Verify from inside the VM that it genuinely cannot reach the internet.",
    failure_mode:
      "Trusting the isolation you didn't test, or forgetting to revert between samples. Check the isolation from inside, and revert every single time.",
  },
];

export default kits;
