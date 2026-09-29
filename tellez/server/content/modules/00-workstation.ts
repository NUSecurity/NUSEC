/**
 * The machine itself: the directory skeleton, the desktop, and the ordinary
 * clutter a real user leaves behind.
 *
 * This module owns no puzzle. It exists so every other module has somewhere to
 * put things, and so the filesystem feels lived-in rather than staged — a tree
 * containing only evidence tells you where the evidence is.
 */

import {
  attrs, binary, dir, mail, sheet, text, ts, type ContentModule,
} from "../kit.js";

const HOME = "C:/Users/atellez";

/** Just enough of a real Thumbs.db header to look right in a hex view. */
const THUMBS_HEX = [
  "00000000  d0 cf 11 e0 a1 b1 1a e1  00 00 00 00 00 00 00 00  |................|",
  "00000010  00 00 00 00 00 00 00 00  3e 00 03 00 fe ff 09 00  |........>.......|",
  "00000020  06 00 00 00 00 00 00 00  00 00 00 00 01 00 00 00  |................|",
  "00000030  1b 00 00 00 00 00 00 00  00 10 00 00 1d 00 00 00  |................|",
  "00000040  01 00 00 00 fe ff ff ff  00 00 00 00 1a 00 00 00  |................|",
].join("\n");


export const workstation: ContentModule = {
  id: "workstation",
  title: "The workstation",
  summary: "The base filesystem. No puzzle here — this is the furniture.",

  nodes: [
    dir("C:"),
    dir("C:/Users"),
    dir("C:/Windows", { meta: attrs("system") }),
    dir("C:/Windows/System32", { meta: attrs("system") }),
    dir(HOME),
    dir(`${HOME}/Desktop`),
    dir(`${HOME}/Documents`),
    dir(`${HOME}/Downloads`),
    dir(`${HOME}/Pictures`),
    dir(`${HOME}/Documents/NUSEC`),

    binary(`${HOME}/Pictures/Thumbs.db`, THUMBS_HEX, {
      meta: { ...attrs("hidden", "system"), modifiedAt: ts("2026-02-11T19:40:00") },
    }),

    text(
      `${HOME}/Desktop/readme-club-laptop.txt`,
      [
        "CLUB LAPTOP — PROPERTY OF NUSEC",
        "",
        "If you are reading this and you are not the sitting president, put it",
        "back where you found it.",
        "",
        "  - do not install anything",
        "  - do not sign into personal accounts",
        "  - hand it over at transition, same as the bank login",
        "",
        "-- A.T.",
      ].join("\n"),
      { meta: { modifiedAt: ts("2024-09-02T15:12:00") } },
    ),

    text(
      `${HOME}/Documents/NUSEC/transition-checklist.txt`,
      [
        "TRANSITION CHECKLIST",
        "",
        "[x] hand over Discord ownership",
        "[x] hand over the website repo",
        "[x] hand over the Google drive",
        "[ ] hand over the bank login        <- ask A about this again",
        "[ ] hand over the vendor accounts   <- ask A about this again",
        "[ ] close the old payment processor",
        "",
        "asked twice now. he keeps saying he'll do it after the semester.",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-05-04T11:02:00") } },
    ),

    sheet(
      `${HOME}/Documents/NUSEC/budget-2025-2026.xlsx`,
      ["Line item", "Budgeted", "Spent", "Notes"],
      [
        ["Room bookings", 0, 0, "covered by SAF"],
        ["CTF infrastructure", 1200, 1187.4, "cloud credits"],
        ["Snacks / meetings", 900, 874.12, ""],
        ["Merch", 1100000, 1100000, "hoodies (60)"],
        ["Speaker honoraria", 800, 800, ""],
        ["Equipment", 780000, 780000, "see vendor invoices"],
        ["Misc / contingency", 500, 496.3, ""],
      ],
      "Signed off 2026-05-19. Includes the anonymous alumni gift ($2.5M, received Sept 2024). " +
        "Everything reconciles to the cent, which is itself a little unusual.",
      { meta: { modifiedAt: ts("2026-05-19T16:45:00") } },
    ),

    mail(`${HOME}/Documents/NUSEC/treasurer-thread.eml`, [
      {
        from: "a.uppal@nusec.club",
        to: ["a.tellez@nusec.club"],
        subject: "vendor invoices for the equipment line",
        at: ts("2026-04-28T14:22:00"),
        body:
          "Hey — for the audit I need the actual invoices behind the $780,000\n" +
          "equipment line, not just the total. Can you forward whatever the\n" +
          "vendor sent?",
      },
      {
        from: "a.tellez@nusec.club",
        to: ["a.uppal@nusec.club"],
        subject: "RE: vendor invoices for the equipment line",
        at: ts("2026-04-28T23:51:00"),
        body: "they're in the portal, i'll pull them this weekend",
      },
      {
        from: "a.uppal@nusec.club",
        to: ["a.tellez@nusec.club"],
        subject: "RE: RE: vendor invoices for the equipment line",
        at: ts("2026-05-12T09:08:00"),
        body: "Following up. Which portal?",
      },
    ], { meta: { modifiedAt: ts("2026-05-12T09:08:00") } }),
  ],

  desktopItems: [
    { label: "This PC", icon: "Monitor", target: "C:" },
    { label: "Documents", icon: "Folder", target: `${HOME}/Documents` },
    { label: "notes", icon: "Folder", target: `${HOME}/Desktop/notes` },
    { label: "readme-club-laptop.txt", icon: "FileText", target: `${HOME}/Desktop/readme-club-laptop.txt` },
    { label: "Recycle Bin", icon: "Trash2", target: "app:recycle-bin" },
    { label: "Web Browser", icon: "Globe", target: "app:browser" },
  ],

  startMenuItems: [
    { label: "File Explorer", icon: "FolderOpen", appId: "explorer" },
    { label: "Web Browser", icon: "Globe", appId: "browser" },
    { label: "Notepad", icon: "FileText", appId: "notepad" },
    { label: "Cipher Bench", icon: "FlaskConical", appId: "cipher-bench" },
    { label: "Recycle Bin", icon: "Trash2", appId: "recycle-bin" },
  ],

  requiresApps: ["explorer", "notepad", "sheets", "mail", "browser", "recycle-bin", "hex", "cipher-bench"],
};
