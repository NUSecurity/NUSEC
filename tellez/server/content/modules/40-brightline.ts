/**
 * The vendor portal.
 *
 * A site is declarative data plus a renderer registered on the client; a portal
 * is just a site that happens to carry an auth wall. The engine has no notion
 * of "the" portal — build as many as the investigation needs.
 *
 * The protected routes' `data` is never serialised to a session that has not
 * passed the wall, so "view source" on the login page shows a login page.
 *
 * Host uses the reserved `.test` TLD, which is mandatory for every fake site
 * here: an invented domain that turns out to be real would point a room full of
 * security students at a stranger's website.
 */

import { requiresObjective, type ContentModule } from "../kit.js";

const HOST = "ledger.brightlinepay.hack";

export const brightline: ContentModule = {
  id: "brightline",
  title: "Brightline Pay",
  summary:
    "Open the vendor console in the browser and log in with the decoded " +
    "username and the password from the notes. The payout ledger is the payoff.",

  secrets: [
    {
      id: "brightline-user",
      value: "atellez.admin",
      hints: ["The note has it base64-encoded.", "Decode YXRlbGxlei5hZG1pbg== anywhere."],
    },
    {
      id: "brightline-pw",
      value: "dadgad-capo2",
      hints: [
        "It is in the notes folder on the desktop, with the songs.",
        "An alternate guitar tuning, then how he capos the second song.",
      ],
    },
  ],

  sites: [
    {
      host: HOST,
      title: "Brightline Pay — Vendor Console",
      // Not discoverable: you find this by reading the recycle bin, not by
      // searching for it.
      discoverable: false,
      auth: {
        usernameSecret: "brightline-user",
        passwordSecret: "brightline-pw",
        reveals: ["portal-breached"],
        protects: ["/dashboard", "/payouts", "/invoices"],
      },
      routes: [
        {
          path: "/",
          title: "Brightline Pay — Sign in",
          data: {
            tagline: "Vendor settlement, simplified.",
            notice: "Sessions expire after 15 minutes of inactivity.",
          },
        },
        {
          path: "/dashboard",
          title: "Brightline Pay — Dashboard",
          data: {
            signedInAs: "atellez.admin",
            account: "Brightline Supply Co.",
            accountId: "BLS-40118",
            openingBalance: 0,
            settled: 2400000,
            pending: 0,
            since: "2024-09-01",
            contact: "a.tellez@brightlinepay.hack",
          },
        },
        {
          path: "/invoices",
          title: "Brightline Pay — Invoices",
          data: {
            signedInAs: "atellez.admin",
            columns: ["Invoice", "Issued to", "Line", "Amount", "Status"],
            rows: [
              ["BLS-2211", "NU Cybersecurity Club", "Managed switch", 180000, "Paid"],
              ["BLS-2212", "NU Cybersecurity Club", "Rack + PDU", 340000, "Paid"],
              ["BLS-2240", "NU Cybersecurity Club", "Equipment (bundled)", 780000, "Paid"],
              ["BLS-2255", "NU Cybersecurity Club", "Merch — 60 hoodies", 1100000, "Paid"],
            ],
            footnote:
              "Line descriptions are entered by the vendor and are not validated " +
              "against a purchase order.",
          },
        },
        {
          path: "/payouts",
          title: "Brightline Pay — Payouts",
          reveals: ["payout-ledger-seen"],
          data: {
            signedInAs: "atellez.admin",
            columns: ["Date", "Received from", "In", "Disbursed to", "Out"],
            rows: [
              ["2024-11-03", "NU Cybersecurity Club", 180000, "A.T. Consulting LLC ••••4471", 180000],
              ["2025-02-17", "NU Cybersecurity Club", 340000, "A.T. Consulting LLC ••••4471", 340000],
              ["2025-09-22", "NU Cybersecurity Club", 780000, "A.T. Consulting LLC ••••4471", 780000],
              ["2026-03-11", "NU Cybersecurity Club", 1100000, "A.T. Consulting LLC ••••4471", 1100000],
            ],
            totals: { in: 2400000, out: 2400000, retained: 0 },
            footnote:
              "Beneficial owner of A.T. Consulting LLC: A. TELLEZ. " +
              "Every dollar the club sent Brightline left the same day it arrived.",
          },
        },
      ],
    },
  ],

  objectives: [
    {
      id: "portal-visited",
      title: "Reached the portal login",
      note: "They typed the address into the browser. Credentials are the next wall.",
      trigger: { on: "visit", host: HOST, path: "/" },
    },
    {
      id: "portal-breached",
      title: "Logged into the portal",
      note: "Both halves of the credential found and used. This is the finish line for the foundation.",
      trigger: { on: "secret", id: "brightline-pw" },
    },
    {
      id: "payout-ledger-seen",
      title: "Read the payout ledger",
      note: "They have the actual answer: $2.4 million, straight through to his own LLC.",
      trigger: { on: "visit", host: HOST, path: "/payouts" },
    },
    {
      // Demonstrates the composite trigger. Nothing fires this directly; it
      // resolves the moment its dependencies are all satisfied.
      id: "case-assembled",
      title: "Assembled the whole case",
      note: "Unlocked the machine, found the note, found the password, and read the ledger.",
      trigger: {
        on: "all",
        objectives: [
          "desktop-unlocked",
          "portal-link-found",
          "password-note-opened",
          "payout-ledger-seen",
        ],
      },
    },
  ],

  nodes: [],

  requiresApps: ["browser"],
};

/** Exported so a future module can hang more content off the same lock. */
export const requiresPortal = requiresObjective("portal-breached");
