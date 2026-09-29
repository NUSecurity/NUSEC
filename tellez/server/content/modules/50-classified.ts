/**
 * Classified — a locked section of the vendor console.
 *
 * Players who have already breached the portal find a Classified tab. Behind
 * it is a three-factor sign-in: the portal password again, a push to the
 * Authenticator app on the desktop, and three security questions about Alec.
 *
 * The questions reward having *read* the machine rather than having solved it.
 * Two come straight from the notes folder. The third — the 2025 treasurer's
 * full name — is never written out whole: the treasurer thread has his first
 * name in Alec's reply and his surname in his own address, and the player has
 * to put the two together.
 *
 * Behind the gate is where the money actually went: A.T. Consulting LLC — the
 * payout ledger's last hop — forwarded every dollar to Jessica James Okafor.
 * The documents are Alec's own record of how, and the message log is the two
 * of them running it. The log ends with her leaving and saying where is "on my
 * Instagram", which is deliberately the one thread that leaves the machine:
 * the account is real, and searching her name finds it.
 *
 * Everything here agrees with files players have already seen — the payout
 * dates, the equipment quotes, the treasurer thread, the resignation draft and
 * things-to-cancel.txt — so a thorough player gets the satisfaction of seeing
 * the pieces line up.
 */

import type { ContentModule } from "../kit.js";

const HOST = "ledger.brightlinepay.hack";

/** The next hop after the payout ledger: two days after each payout, all of it. */
const TRANSFERS = {
  columns: ["Date", "From", "To", "Amount", "Reference"],
  rows: [
    ["2024-11-05", "A.T. Consulting LLC ••••4471", "Jessica James Okafor ••••9920", 180000, "BLS-2211"],
    ["2025-02-19", "A.T. Consulting LLC ••••4471", "Jessica James Okafor ••••9920", 340000, "BLS-2212"],
    ["2025-09-24", "A.T. Consulting LLC ••••4471", "Jessica James Okafor ••••9920", 780000, "BLS-2240"],
    ["2026-03-13", "A.T. Consulting LLC ••••4471", "Jessica James Okafor ••••9920", 1100000, "BLS-2255"],
  ],
  total: 2400000,
  footnote:
    "Standing instruction on A.T. Consulting LLC: forward all incoming funds to " +
    "beneficiary J. J. OKAFOR within 48 hours. Every dollar the club paid Brightline " +
    "reached her within two days.",
};

const DOCUMENTS = [
  {
    title: "Standing instruction — A.T. Consulting LLC",
    meta: "PDF · filed 2024-10-16",
    body: [
      "Account holder     A.T. Consulting LLC",
      "Account            ••••4471",
      "Signatory          A. Tellez",
      "",
      "Instruction        Forward all incoming funds, in full, to the",
      "                   beneficiary below within 48 hours of receipt.",
      "",
      "Beneficiary        Jessica James Okafor",
      "Account            ••••9920",
      "",
      "This instruction remains in force until revoked in writing by the signatory.",
    ].join("\n"),
  },
  {
    title: "how it works (keep this short)",
    meta: "Note · edited 2024-10-15",
    body: [
      "1. the alumni gift sits in the club account. nobody has a plan for it.",
      "   club \"needs\" equipment. i get three quotes like the budget rules say.",
      "2. two real vendors + brightline. brightline is always the priciest.",
      "3. i pick brightline anyway. president's call, nobody reads the equipment line.",
      "4. club pays brightline. brightline pays the LLC the same day.",
      "5. LLC forwards to J within 48h. standing instruction, i don't touch it.",
      "",
      "rules:",
      "- invoice amount = transfer amount, to the cent. it has to reconcile.",
      "- one line at a time. never two in the same month.",
      "- invoices only live in the portal. nothing in club email.",
    ].join("\n"),
  },
  {
    title: "What the invoices were actually for",
    meta: "Spreadsheet export · 2026-03-14",
    body: [
      "BLS-2211   Managed switch          $180,000   nothing bought. old switch still in the rack.",
      "BLS-2212   Rack + PDU              $340,000   nothing bought. the rack was donated in 2022.",
      "BLS-2240   Equipment (bundled)     $780,000   nothing bought. \"bundled\" means nobody asks.",
      "BLS-2255   Merch - 60 hoodies    $1,100,000   the hoodies were real. they cost $1,499.99.",
      "",
      "total out: $2,400,000. total equipment received: $0.",
    ].join("\n"),
  },
  {
    title: "exit",
    meta: "Note · edited 2026-05-31",
    body: [
      "- resignation: end of semester. don't mention the audit. don't mention the vendor.",
      "- cancel the cloud account and the domain autorenew (club card is on both)",
      "- leave the vendor console up until J confirms the last transfer cleared",
      "- J leaves first. i follow once the handover is done and nobody's asking.",
      "- wipe the laptop before handing it back",
    ].join("\n"),
  },
];

/**
 * The two of them running the scheme, start to finish. The dates line up with
 * the payouts, the treasurer thread (2026-04-28) and the resignation draft
 * (2026-05-30), and the last line explains why this thread still exists.
 */
const MESSAGES = {
  title: "Message log — exported",
  participants: ["Alec Tellez", "Jessica James Okafor"],
  messages: [
    { from: "Alec", at: "2024-10-14 23:36", body: "the alumni gift cleared. two and a half million dollars sitting in a student club account" },
    { from: "Alec", at: "2024-10-14 23:37", body: "and nobody on the board knows what a purchase order is" },
    { from: "Jessica", at: "2024-10-14 23:40", body: "Account's open. Brightline Supply Co. Boring enough that nobody reads past the name." },
    { from: "Alec", at: "2024-10-14 23:44", body: "boring is the point. budget rules say anything over $500 needs three quotes" },
    { from: "Jessica", at: "2024-10-14 23:45", body: "So get three quotes." },
    { from: "Alec", at: "2024-10-14 23:47", body: "two real ones and ours. ours is always the expensive one and i pick it anyway" },
    { from: "Jessica", at: "2024-10-14 23:49", body: "Nobody questions the president picking the pricier switch?" },
    { from: "Alec", at: "2024-10-14 23:50", body: "nobody reads the equipment line. trust me" },

    { from: "Jessica", at: "2024-11-05 10:12", body: "180k in. Brightline to the LLC to me. Clean." },
    { from: "Alec", at: "2024-11-05 10:30", body: "told you. start small. we let it sit a few months" },

    { from: "Jessica", at: "2025-02-19 09:03", body: "340k. You're getting comfortable." },
    { from: "Alec", at: "2025-02-19 09:15", body: "rack and PDU. very real very necessary equipment" },

    { from: "Jessica", at: "2025-09-24 14:26", body: "780k?? Alec." },
    { from: "Alec", at: "2025-09-24 14:31", body: "\"equipment (bundled)\". it's in the budget. the treasurer signed off on the whole thing" },
    { from: "Jessica", at: "2025-09-24 14:33", body: "Your treasurer is going to actually read it one day." },

    { from: "Alec", at: "2026-03-13 22:08", body: "1.1 million is the last one. merch" },
    { from: "Jessica", at: "2026-03-13 22:09", body: "That's a lot of hoodies." },
    { from: "Alec", at: "2026-03-13 22:10", body: "sixty of them. the real order was fifteen hundred bucks. nobody reads past the line item" },
    { from: "Jessica", at: "2026-03-13 22:40", body: "Received. That's all of it. $2.4 million." },

    { from: "Alec", at: "2026-04-28 23:58", body: "treasurer wants the actual invoices behind the equipment line. for the audit" },
    { from: "Jessica", at: "2026-04-29 00:04", body: "So send the ones from the portal. They look real." },
    { from: "Alec", at: "2026-04-29 00:05", body: "they look real until someone asks why the vendor pays my LLC the same day" },
    { from: "Jessica", at: "2026-04-29 00:06", body: "Then don't let anyone into the portal." },

    { from: "Alec", at: "2026-05-30 02:15", body: "stepping down at the end of the semester. draft's written" },
    { from: "Jessica", at: "2026-05-30 08:41", body: "Don't mention the vendor." },
    { from: "Alec", at: "2026-05-30 08:44", body: "wasn't going to" },

    { from: "Jessica", at: "2026-06-01 21:17", body: "I'm done here. I'm going to travel for a while. Somewhere nobody asks about invoices." },
    { from: "Alec", at: "2026-06-01 21:18", body: "where??" },
    { from: "Jessica", at: "2026-06-01 21:22", body: "Not over this. It's on my Instagram." },
    { from: "Alec", at: "2026-06-01 21:22", body: "you POSTED it?" },
    { from: "Jessica", at: "2026-06-01 21:25", body: "Relax. Nobody's looking for me. They're looking for you." },
    { from: "Alec", at: "2026-06-01 21:31", body: "delete this thread" },
    { from: "Jessica", at: "2026-06-01 21:31", body: "You first." },
  ],
};

export const classified: ContentModule = {
  id: "classified",
  title: "Classified",
  summary:
    "Open the Classified tab in the vendor console. Re-enter the portal password, " +
    "approve the push in the Authenticator app, then answer three security questions. " +
    "Behind it: the money going on to Jessica James Okafor, Alec's notes, and their chat.",

  secrets: [
    {
      id: "classified-legs",
      value: "thursday",
      // gym.txt writes it "thu", so the abbreviations are as right as the word.
      accepts: ["thu", "thur", "thurs"],
      hints: ["His weekly split is in the notes folder.", "gym.txt — thu is legs."],
    },
    {
      id: "classified-book",
      value: "the cuckoo's egg",
      accepts: ["cuckoo's egg"],
      normalise: ["trim", "lower", "alnum"],
      hints: ["He keeps a reading list in the notes folder.", "book-recs.txt — the one he rereads."],
    },
    {
      id: "classified-treasurer",
      value: "Arjun Uppal",
      normalise: ["trim", "lower", "alnum"],
      hints: [
        "The treasurer emailed Alec about invoices. Read the whole thread.",
        "Alec calls him Arjun; his address is a.uppal@nusec.club. Both names are needed.",
      ],
    },
  ],

  challenges: [
    {
      id: "classified",
      host: HOST,
      // Classified should feel classified: every visit costs all three factors.
      relock: true,
      // Three pages rather than one, so the board can tell "found the money"
      // from "read the chat" — the chat is what points off the machine.
      routes: [
        {
          path: "/classified",
          title: "Brightline Pay — Classified",
          data: { signedInAs: "atellez.admin", ...TRANSFERS },
        },
        {
          path: "/classified/documents",
          title: "Brightline Pay — Classified · Documents",
          data: { signedInAs: "atellez.admin", documents: DOCUMENTS },
        },
        {
          path: "/classified/messages",
          title: "Brightline Pay — Classified · Messages",
          data: { signedInAs: "atellez.admin", ...MESSAGES },
        },
      ],
      steps: [
        {
          kind: "secret",
          prompt: "This area is restricted. Re-enter your password to continue.",
          label: "Password",
          secret: "brightline-pw",
        },
        {
          kind: "approval",
          prompt: "We sent a sign-in request to your Authenticator app. Approve it to continue.",
          app: "authenticator",
          request: "Sign in to Classified",
        },
        {
          kind: "questions",
          prompt: "Answer your security questions.",
          questions: [
            { label: "What day do you hit legs?", secret: "classified-legs" },
            { label: "What is your favorite book?", secret: "classified-book" },
            { label: "Who was the treasurer of NUSEC in 2025?", secret: "classified-treasurer" },
          ],
        },
      ],
    },
  ],

  objectives: [
    {
      id: "classified-password",
      title: "Classified: re-entered the password",
      note: "Past factor one. The Authenticator app on the desktop is next — watch for people who never open it.",
      trigger: { on: "challenge", id: "classified", step: 1 },
    },
    {
      id: "classified-approved",
      title: "Classified: approved the push",
      note: "Past factor two. Now the security questions: gym.txt, book-recs.txt, and the 2025 treasurer.",
      trigger: { on: "challenge", id: "classified", step: 2 },
    },
    {
      id: "classified-unlocked",
      title: "Opened Classified",
      note: "All three factors passed. The treasurer question is the usual holdout.",
      trigger: { on: "challenge", id: "classified" },
    },
    {
      id: "jessica-transfers-seen",
      title: "Saw the money go to Jessica",
      note: "They have the last hop: A.T. Consulting LLC forwarded all $2.4 million to Jessica James Okafor.",
      trigger: { on: "visit", host: HOST, path: "/classified" },
    },
    {
      id: "scheme-documents-read",
      title: "Read the scheme documents",
      note: "Alec's own notes on how it worked and what the invoices were really for. Optional depth.",
      trigger: { on: "visit", host: HOST, path: "/classified/documents" },
    },
    {
      id: "message-log-read",
      title: "Read the message log",
      note: "The chat ends with Jessica saying where she went is on her Instagram. Next step is off the machine: search her name.",
      trigger: { on: "visit", host: HOST, path: "/classified/messages" },
    },
  ],

  desktopItems: [
    { label: "Authenticator", icon: "ShieldCheck", target: "app:authenticator" },
  ],

  startMenuItems: [
    { label: "Authenticator", icon: "ShieldCheck", appId: "authenticator" },
  ],

  requiresApps: ["authenticator", "browser"],
};
