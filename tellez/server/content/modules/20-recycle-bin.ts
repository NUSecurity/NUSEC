/**
 * The recycle bin.
 *
 * Fifteen deleted items, of which one matters. Every one carries a real
 * `deletedFrom(...)` original path, so the bin doubles as a map of folders that
 * no longer exist in the tree — deleted is not gone, and the deletion record is
 * itself evidence.
 *
 * The noise is not filler. A bin containing one interesting file and nothing
 * else teaches nobody anything; the skill being practised is reading fifteen
 * boring things carefully.
 */

import {
  attrs, binary, deletedFrom, dir, image, sheet, text, ts, type ContentModule,
} from "../kit.ts";

const BIN = "C:/$Recycle.Bin";
const HOME = "C:/Users/atellez";

export const recycleBin: ContentModule = {
  id: "recycle-bin",
  title: "The recycle bin",
  summary:
    "Dig through fifteen deleted files. One of them is a note to self holding " +
    "the vendor portal's address and its username, base64-encoded.",

  nodes: [
    dir(BIN),

    /* ------------------------------------------------------- the one that matters */

    text(
      `${BIN}/notes-to-self.txt`,
      [
        "don't leave this lying around",
        "",
        "ledger.brightlinepay.test   <- vendor console, not the club one",
        "",
        "not writing the user out in plaintext, it's:",
        "",
        "    YXRlbGxlei5hZG1pbg==",
        "",
        "pw is in the usual place, with the songs.",
        "",
        "(delete this)",
      ].join("\n"),
      {
        meta: {
          ...deletedFrom(`${HOME}/Documents/notes-to-self.txt`, ts("2026-06-02T01:47:00")),
          modifiedAt: ts("2026-03-14T23:19:00"),
        },
        reveals: ["portal-link-found"],
      },
    ),

    /* ------------------------------------------------------------- the red herring */

    text(
      `${BIN}/passwords.txt.bak`,
      [
        "OLD - from the 2019 laptop, none of these work anymore",
        "",
        "wifi (old router)    husky2019",
        "projector            0000",
        "spare locker         14-22-8",
        "club gmail           [changed, ask treasurer]",
        "",
        "stop keeping these in a text file. -- past me",
      ].join("\n"),
      {
        meta: {
          ...deletedFrom(`${HOME}/Documents/passwords.txt.bak`, ts("2025-11-20T18:30:00")),
          modifiedAt: ts("2019-10-01T12:00:00"),
        },
        reveals: ["decoy-opened"],
      },
    ),

    /* -------------------------------------------------------------------- the noise */

    text(
      `${BIN}/agenda-2025-10-14.txt`,
      [
        "MEETING AGENDA - Oct 14",
        "",
        "1. intro / who we are (5 min)",
        "2. CTF walkthrough - last week's web challenge",
        "3. CPTC team signups, deadline is Friday",
        "4. snacks",
        "",
        "someone bring the HDMI adapter this time",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/NUSEC/agenda-2025-10-14.txt`, ts("2025-12-01T09:14:00")) },
    ),

    text(
      `${BIN}/sponsor-email-draft.txt`,
      [
        "Hi ——,",
        "",
        "I'm reaching out on behalf of the Northeastern Cybersecurity Club. We",
        "run weekly hands-on meetings and compete in CPTC and regional CTFs,",
        "and we're looking for sponsors for the coming year.",
        "",
        "[numbers go here]",
        "[don't send until the budget is signed off]",
        "",
        "Best,",
        "Alec",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/sponsor-email-draft.txt`, ts("2026-01-08T20:02:00")) },
    ),

    text(
      `${BIN}/resignation-draft.txt`,
      [
        "draft 3",
        "",
        "After three years I'm stepping down as president at the end of the",
        "semester. It's been the best part of my time here and I'm leaving the",
        "club in better shape than I found it.",
        "",
        "[don't mention the audit]",
        "[don't mention the vendor thing]",
        "",
        "Thanks for everything,",
        "Alec",
      ].join("\n"),
      {
        meta: {
          ...deletedFrom(`${HOME}/Documents/resignation-draft.txt`, ts("2026-06-02T01:44:00")),
          modifiedAt: ts("2026-05-30T02:11:00"),
        },
      },
    ),

    sheet(
      `${BIN}/equipment-quotes.xlsx`,
      ["Vendor", "Item", "Quote", "Chosen"],
      [
        ["Campus IT Store", "Managed switch", 410, "no"],
        ["Brightline Supply", "Managed switch", 680, "YES"],
        ["Newbury Networks", "Managed switch", 395, "no"],
        ["Campus IT Store", "Rack + PDU", 520, "no"],
        ["Brightline Supply", "Rack + PDU", 940, "YES"],
        ["Newbury Networks", "Rack + PDU", 505, "no"],
      ],
      "Three quotes per line, as required. The most expensive one won both times.",
      { meta: deletedFrom(`${HOME}/Documents/NUSEC/equipment-quotes.xlsx`, ts("2026-05-20T22:10:00")) },
    ),

    text(
      `${BIN}/elections-2026-notes.txt`,
      [
        "elections",
        "",
        "- nominations close the 3rd",
        "- need a returning officer who isn't running",
        "- treasurer said she'd do it",
        "- quorum is 20, we had 34 last time so should be fine",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/NUSEC/elections-2026-notes.txt`, ts("2026-04-19T13:05:00")) },
    ),

    text(
      `${BIN}/old-resume.txt`,
      [
        "ALEC TELLEZ",
        "",
        "EXPERIENCE",
        "  President, Northeastern Cybersecurity Club      2023 - 2026",
        "  IT Help Desk, Snell Library                     2022 - 2023",
        "",
        "SKILLS",
        "  Python, Bash, Burp, Wireshark, Ghidra",
        "  Guitar (not relevant, leaving it in anyway)",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/old-resume.txt`, ts("2026-02-27T17:44:00")) },
    ),

    text(
      `${BIN}/merch-sizes.txt`,
      [
        "hoodie sizes, final count",
        "",
        "S   4",
        "M   19",
        "L   23",
        "XL  11",
        "2XL 3",
        "",
        "total 60, order is for 60, we're good",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/NUSEC/merch-sizes.txt`, ts("2026-03-02T15:20:00")) },
    ),

    text(
      `${BIN}/ctf-ideas.txt`,
      [
        "challenge ideas for the spring meeting",
        "",
        "- a fake SSO portal with a logic flaw",
        "- pcap with creds in cleartext (too easy?)",
        "- something with a virtual desktop? seized laptop, they dig around",
        "- steganography, but people always hate steganography",
        "",
        "the laptop one is good. do that one.",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/NUSEC/ctf-ideas.txt`, ts("2026-01-30T02:55:00")) },
    ),

    text(
      `${BIN}/venmo-note.txt`,
      [
        "reimbursements owed",
        "",
        "priya   $42.18   snacks, 3 meetings",
        "sam     $19.99   HDMI adapter (finally)",
        "jordan  $86.40   travel, regionals",
        "",
        "do these before the semester ends",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/venmo-note.txt`, ts("2026-05-28T21:33:00")) },
    ),

    image(
      `${BIN}/IMG_2291.svg`,
      "whiteboard.svg",
      "Whiteboard from the October planning meeting.",
      { meta: deletedFrom(`${HOME}/Pictures/IMG_2291.svg`, ts("2026-01-11T16:00:00")) },
    ),

    image(
      `${BIN}/sticker-concepts.svg`,
      "stickers.svg",
      "Sticker concepts, rejected.",
      { meta: deletedFrom(`${HOME}/Pictures/sticker-concepts.svg`, ts("2025-11-05T11:47:00")) },
    ),

    binary(
      `${BIN}/desktop.ini`,
      [
        "00000000  5b 2e 53 68 65 6c 6c 43  6c 61 73 73 49 6e 66 6f  |[.ShellClassInfo|",
        "00000010  5d 0d 0a 4c 6f 63 61 6c  69 7a 65 64 52 65 73 6f  |]..LocalizedReso|",
        "00000020  75 72 63 65 4e 61 6d 65  3d 40 25 53 79 73 74 65  |urceName=@%Syste|",
        "00000030  6d 52 6f 6f 74 25 5c 73  79 73 74 65 6d 33 32 5c  |mRoot%\\system32\\|",
      ].join("\n"),
      {
        meta: {
          ...deletedFrom(`${HOME}/Documents/desktop.ini`, ts("2026-05-01T08:00:00")),
          ...attrs("hidden", "system"),
        },
      },
    ),

    text(
      `${BIN}/wifi-guest-password.txt`,
      [
        "guest wifi for the speaker event",
        "",
        "  NUSEC-GUEST / welcome2026",
        "",
        "expires after the event, IT resets it",
      ].join("\n"),
      { meta: deletedFrom(`${HOME}/Documents/wifi-guest-password.txt`, ts("2026-04-02T10:15:00")) },
    ),
  ],

  objectives: [
    {
      id: "recycle-bin-opened",
      title: "Opened the recycle bin",
      note: "Expected within the first couple of minutes. If nobody has, point at the desktop icon.",
      trigger: { on: "open", path: BIN },
    },
    {
      id: "portal-link-found",
      title: "Found the portal note",
      note: "They have the portal address and the base64 username. The password hunt is next.",
      trigger: { on: "open", path: `${BIN}/notes-to-self.txt` },
    },
    {
      id: "decoy-opened",
      title: "Opened passwords.txt.bak",
      note: "Pure decoy — it is all dead 2019 credentials. Tells you who reads everything.",
      hidden: true,
      trigger: { on: "open", path: `${BIN}/passwords.txt.bak` },
    },
  ],

  requiresApps: ["notepad", "sheets", "photos", "hex", "recycle-bin"],
};
