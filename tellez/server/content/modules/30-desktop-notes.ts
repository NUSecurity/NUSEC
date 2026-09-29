/**
 * The notes folder — where the portal password is.
 *
 * "pw is in the usual place, with the songs" is the only pointer, and it is
 * deliberately soft: fourteen scrappy personal text files, one of which has the
 * password in a parenthesis at the bottom. This rewards thoroughness rather
 * than cleverness, which is a deliberate change of pace between two inference
 * puzzles.
 *
 * The board counts how many of these each person has opened. That count is the
 * single best signal of who is grinding and who is stuck.
 */

import { dir, text, ts, type ContentModule } from "../kit.js";

const NOTES = "C:/Users/atellez/Desktop/notes";

export const desktopNotes: ContentModule = {
  id: "desktop-notes",
  title: "The notes folder",
  summary:
    "Read through fourteen personal notes on the desktop. One of them has the " +
    "vendor portal password written in it.",

  nodes: [
    // The folder is declared here rather than in the workstation module:
    // whoever owns the puzzle owns the folder. Modules merge, so it makes no
    // difference to the resulting tree, and it keeps this content portable.
    dir(NOTES),

    text(
      `${NOTES}/tuning-notes.txt`,
      [
        "open mic set is all in DADGAD, stop retuning between songs",
        "",
        "  - capo 2 for the second one",
        "  - new strings before the 14th, the B is going",
        "  - borrow the clip-on tuner back from sam",
        "",
        "(brightline pw is dadgad-capo2 until they make me rotate it again)",
      ].join("\n"),
      {
        meta: { modifiedAt: ts("2026-03-14T23:26:00") },
        reveals: ["password-note-opened"],
      },
    ),

    text(
      `${NOTES}/setlist-open-mic.txt`,
      [
        "OPEN MIC - 40 min",
        "",
        "1. the quiet one (capo 2)",
        "2. the one everybody knows",
        "3. new one, half finished",
        "4. cover",
        "5. the quiet one again if they're still there",
        "",
        "do NOT do the ten minute one",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-03-09T21:14:00") } },
    ),

    text(
      `${NOTES}/setlist-march.txt`,
      [
        "march set, shorter room",
        "",
        "1. cover",
        "2. new one",
        "3. the one everybody knows",
        "",
        "20 minutes, they were strict about it last time",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-02-22T18:40:00") } },
    ),

    text(
      `${NOTES}/chords-wip.txt`,
      [
        "half a song",
        "",
        "  Dsus4  -  A  -  Bm  -  G",
        "  same again",
        "  then G - A - Bm and stop",
        "",
        "chorus doesn't work yet. the G is wrong.",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-04-06T01:52:00") } },
    ),

    text(
      `${NOTES}/groceries.txt`,
      ["oats", "coffee", "the good bread", "eggs", "hot sauce", "", "NOT more hot sauce"].join("\n"),
      { meta: { modifiedAt: ts("2026-05-22T09:30:00") } },
    ),

    text(
      `${NOTES}/car.txt`,
      [
        "inspection due august",
        "rear left tire loses ~3psi a week, get it looked at",
        "oil change at 92k, currently 89.4k",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-04-30T14:20:00") } },
    ),

    text(
      `${NOTES}/book-recs.txt`,
      [
        "from people whose taste i trust",
        "",
        "- the one priya wouldn't stop talking about",
        "- sandworm",
        "- the cuckoo's egg (reread, still my favorite)",
        "- something not about computers, please",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-01-19T22:05:00") } },
    ),

    text(
      `${NOTES}/gym.txt`,
      ["mon  push", "tue  pull", "thu  legs", "sat  whatever", "", "stop skipping legs"].join("\n"),
      { meta: { modifiedAt: ts("2026-05-11T07:15:00") } },
    ),

    text(
      `${NOTES}/talk-outline.txt`,
      [
        "\"what i wish i knew\" - 20 min for the last meeting",
        "",
        "1. nobody knows what they're doing, including me",
        "2. the club is the network, not the resume line",
        "3. do the hard challenge badly instead of the easy one well",
        "4. hand things over properly",
        "",
        "(4 is rich coming from me)",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-05-29T23:41:00") } },
    ),

    text(
      `${NOTES}/apartment.txt`,
      [
        "lease is up in august",
        "",
        "- deposit was 2200, should get most of it back",
        "- fix the hole behind the door first",
        "- the landlord does not need a forwarding address",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-05-26T20:10:00") } },
    ),

    text(
      `${NOTES}/things-to-cancel.txt`,
      [
        "before i leave",
        "",
        "- the cloud account (club card is on it)",
        "- the domain autorenew",
        "- the vendor console       <- NOT this one yet",
        "- student software licences",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-06-01T12:34:00") } },
    ),

    text(
      `${NOTES}/gift-ideas.txt`,
      ["priya - the coffee thing", "sam - replace the tuner he lost", "jordan - nothing, he knows what he did"].join("\n"),
      { meta: { modifiedAt: ts("2025-12-04T16:22:00") } },
    ),

    text(
      `${NOTES}/speaker-event.txt`,
      [
        "speaker event",
        "",
        "room is booked, doors at 6",
        "pizza for 40, jordan is picking it up",
        "guest wifi - ask IT the week before",
        "receipts: keep ALL of them this time",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-03-28T19:00:00") } },
    ),

    text(
      `${NOTES}/misc.txt`,
      [
        "- library fine, $4, pay it",
        "- the printer on the second floor is the good one",
        "- ask about the summer research thing before march",
        "- 14 across was ANAGRAM",
      ].join("\n"),
      { meta: { modifiedAt: ts("2026-03-21T13:11:00") } },
    ),
  ],

  objectives: [
    {
      id: "notes-folder-opened",
      title: "Opened the notes folder",
      note: "They took the \"with the songs\" hint. Watch the per-person notes-read count from here.",
      trigger: { on: "open", path: NOTES },
    },
    {
      id: "password-note-opened",
      title: "Found the portal password",
      note: "tuning-notes.txt. They now have both halves of the portal credential.",
      trigger: { on: "open", path: `${NOTES}/tuning-notes.txt` },
    },
  ],

  requiresApps: ["notepad"],
};
