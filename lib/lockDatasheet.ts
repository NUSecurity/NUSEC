/**
 * The six-page datasheet for the "Smart Lock" challenge.
 *
 * The factory installer code sits in the provisioning listing on page 4 —
 * buried in a plausible amount of specification nobody wants to read, which is
 * the entire lesson. The lock itself checks the code server side, so the
 * datasheet is the only place the code appears.
 */

export const installerCode = "552941";

export const product = {
  name: "AXIOM SL-4400",
  subtitle: "Networked Smart Deadbolt",
  revision: "Rev C — 2026-04",
};

export interface DatasheetPage {
  heading: string;
  blocks: Block[];
}

export type Block =
  | { kind: "text"; value: string }
  | { kind: "note"; value: string }
  | { kind: "code"; value: string }
  | { kind: "table"; columns: string[]; rows: string[][] };

export const pages: DatasheetPage[] = [
  {
    heading: "1. Overview",
    blocks: [
      {
        kind: "text",
        value:
          "The AXIOM SL-4400 is a battery-powered networked deadbolt for light commercial and multi-family installations. It combines a 12-key capacitive keypad, an encrypted 2.4 GHz radio and an on-device credential store holding up to 240 user codes.",
      },
      {
        kind: "text",
        value:
          "Credentials are evaluated on-device. Loss of network connectivity does not prevent keypad entry. All administrative operations are performed either over the radio from a paired hub or locally through the service header described in section 3.",
      },
      {
        kind: "table",
        columns: ["Part number", "Finish", "Radio", "Keypad"],
        rows: [
          ["SL-4400-SN", "Satin nickel", "2.4 GHz", "Capacitive"],
          ["SL-4400-MB", "Matte black", "2.4 GHz", "Capacitive"],
          ["SL-4400-AB", "Antique brass", "2.4 GHz", "Capacitive"],
          ["SL-4400-SN-NR", "Satin nickel", "None", "Capacitive"],
        ],
      },
    ],
  },
  {
    heading: "2. Mechanical and environmental",
    blocks: [
      {
        kind: "table",
        columns: ["Parameter", "Value"],
        rows: [
          ["Exterior escutcheon", "148 × 62 × 21 mm"],
          ["Interior escutcheon", "152 × 68 × 34 mm"],
          ["Backset", "60 mm / 70 mm adjustable"],
          ["Door thickness", "35 – 55 mm"],
          ["Bolt throw", "25.4 mm"],
          ["Housing material", "Zinc alloy, powder coated"],
          ["Operating temperature", "−25 °C to +60 °C"],
          ["Ingress protection", "IP54 (exterior face)"],
          ["Cycle rating", "250,000 cycles minimum"],
        ],
      },
      {
        kind: "text",
        value:
          "The exterior escutcheon is sealed against driving rain but is not rated for submersion. Installations exposed to standing water require the SL-4400-WK weather kit.",
      },
    ],
  },
  {
    heading: "3. Electrical characteristics and service header",
    blocks: [
      {
        kind: "table",
        columns: ["Parameter", "Min", "Typ", "Max", "Unit"],
        rows: [
          ["Supply voltage (4 × AA)", "4.0", "6.0", "6.6", "V"],
          ["Quiescent current", "—", "42", "60", "µA"],
          ["Keypad wake current", "—", "9", "14", "mA"],
          ["Motor stall current", "—", "—", "1.8", "A"],
          ["Radio TX current", "—", "17", "23", "mA"],
          ["Battery life (typ. 12 cycles/day)", "10", "14", "—", "months"],
        ],
      },
      {
        kind: "text",
        value:
          "A four-pin service header (J2) is located on the interior board beneath the battery tray. It exposes a 3.3 V UART used for provisioning and diagnostics. The header is not populated on -NR variants.",
      },
      {
        kind: "table",
        columns: ["Pin", "Signal", "Direction", "Notes"],
        rows: [
          ["1", "GND", "—", "Tie to programmer ground"],
          ["2", "UART_RX", "Input", "3.3 V logic, 115200 8N1"],
          ["3", "UART_TX", "Output", "3.3 V logic, 115200 8N1"],
          ["4", "VCC_SENSE", "Output", "Do not source current"],
        ],
      },
    ],
  },
  {
    heading: "4. Commissioning and first-time provisioning",
    blocks: [
      {
        kind: "text",
        value:
          "New units ship in factory state with a single installer credential enrolled. The installer credential grants access to the enrollment menu, radio pairing and the field reset procedure. It is not intended to remain active after commissioning.",
      },
      {
        kind: "text",
        value:
          "Connect a 3.3 V USB-UART adapter to J2 as described in section 3 and open a session with the provisioning utility:",
      },
      {
        kind: "code",
        value: `$ axiom-prov --port /dev/ttyUSB0 --baud 115200

  AXIOM SL-4400  bootloader 1.4.2
  unit 4400-SN  serial 0x7A19C4  state: FACTORY

> AUTH INSTALLER
< ENTER INSTALLER CODE:
> 552941
< OK: INSTALLER SESSION OPEN  (factory default credential)

> ENROLL USER 001 --code 4417
< OK: USER 001 ENROLLED

> RADIO PAIR --hub AX-HUB-2
< OK: PAIRED

> FRP --confirm
< OK: FACTORY INSTALLER CREDENTIAL CLEARED`,
      },
      {
        kind: "note",
        value:
          "The factory installer code 552941 is identical on every SL-4400 unit and remains active until FRP is run. Field audits consistently find units commissioned without this final step. Run FRP before handing the installation over.",
      },
      {
        kind: "text",
        value:
          "The same installer credential may be entered directly on the keypad followed by the ✱ key, which opens the enrollment menu without a UART session.",
      },
    ],
  },
  {
    heading: "5. Serial command reference",
    blocks: [
      {
        kind: "table",
        columns: ["Command", "Arguments", "Description"],
        rows: [
          ["AUTH", "INSTALLER | USER <id>", "Open an authenticated session"],
          ["ENROLL", "USER <id> --code <n>", "Add a user credential"],
          ["REVOKE", "USER <id>", "Remove a user credential"],
          ["LIST", "USERS", "Print enrolled credential slots"],
          ["RADIO", "PAIR --hub <id>", "Pair with a hub"],
          ["RADIO", "UNPAIR", "Clear hub association"],
          ["LOG", "DUMP [--last <n>]", "Print the access log"],
          ["FRP", "--confirm", "Clear the factory installer credential"],
          ["REBOOT", "—", "Restart the controller"],
        ],
      },
      {
        kind: "text",
        value:
          "Sessions close automatically after 120 s of inactivity. LOG DUMP is available to installer sessions only.",
      },
    ],
  },
  {
    heading: "6. Troubleshooting, compliance and ordering",
    blocks: [
      {
        kind: "table",
        columns: ["Symptom", "Likely cause", "Action"],
        rows: [
          ["Three long beeps on entry", "Credential not enrolled", "Re-enroll via section 4"],
          ["Motor runs, bolt does not throw", "Backset misadjusted", "Reset backset to door spec"],
          ["Keypad unresponsive in cold", "Battery chemistry", "Fit lithium AA cells"],
          ["Unit will not pair", "Hub on incompatible firmware", "Update hub to 3.1 or later"],
          ["Rapid battery drain", "Radio retry storm", "Check hub RSSI, re-pair"],
        ],
      },
      {
        kind: "text",
        value:
          "Compliance: FCC Part 15 Subpart B, IC RSS-247, CE RED 2014/53/EU. ANSI/BHMA A156.36 Grade 2.",
      },
      {
        kind: "table",
        columns: ["Revision", "Date", "Change"],
        rows: [
          ["A", "2025-02", "Initial release"],
          ["B", "2025-11", "Added -NR variant, corrected stall current"],
          ["C", "2026-04", "Expanded section 4, added FRP guidance"],
        ],
      },
    ],
  },
];
