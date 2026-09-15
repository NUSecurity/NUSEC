/**
 * The misconfigured object store behind the "Open Bucket" challenge.
 *
 * The listing is deliberately truncated the way a real one is: page one looks
 * boring and complete unless you notice `IsTruncated` and follow the
 * continuation token. The interesting backup is on page two — which is exactly
 * how real enumeration misses real data.
 */

import { flagFor } from "./flags.js";

export interface BucketObject {
  key: string;
  size: number;
  modified: string;
  storageClass: string;
  /** Text served when the object is fetched. Binary keys leave this unset. */
  body?: string;
}

export const bucketName = "nusec-club-assets";
export const bucketRegion = "us-east-1";

/** The token page one hands out. Page two is only reachable with it. */
export const continuationToken = "1s9KpQdm4YtR7vXbN2eLwZ";

const stagingEnv = `# staging only - safe to commit, rotated weekly
NODE_ENV=staging
API_BASE=https://staging-api.nusec-club.example
DB_HOST=staging-db.internal
DB_USER=staging_ro
DB_PASS=stg-7f2a-readonly
SESSION_SECRET=not-a-real-secret-staging
`;

// Built from the flag table rather than restating it, so there is exactly one
// place the answer lives.
const prodEnv = `# PROD - do not commit. copied here 2026-08-30 during the migration
NODE_ENV=production
API_BASE=https://api.nusec-club.example
DB_HOST=prod-db.internal
DB_USER=app_rw
DB_PASS=Hq4!vT9wLm2xZr6d
SESSION_SECRET=${flagFor("hands-on-practice/open-bucket")}
SMTP_URL=smtps://mailer:8Kd2vn4Qp@smtp.internal:465
`;

const accessLog = `10.0.14.22 - - [01/Sep/2026:08:14:02 +0000] "GET /index.html HTTP/1.1" 200 4812
10.0.14.22 - - [01/Sep/2026:08:14:03 +0000] "GET /assets/logo.svg HTTP/1.1" 200 2104
203.0.113.9 - - [01/Sep/2026:11:02:44 +0000] "GET /?list-type=2 HTTP/1.1" 200 1937
203.0.113.9 - - [01/Sep/2026:11:02:51 +0000] "GET /?list-type=2&continuation-token=... HTTP/1.1" 200 812
`;

const readme = `nusec-club-assets
=================

Static assets for the club site. Public on purpose so the CDN can reach them.

TODO(dana): the migration dumped some backups in here by mistake.
Clean them out before anyone notices.
`;

/** Page one: everything unremarkable. */
export const firstPage: BucketObject[] = [
  {
    key: "README.txt",
    size: 214,
    modified: "2026-06-02T09:14:00.000Z",
    storageClass: "STANDARD",
    body: readme,
  },
  {
    key: "assets/logo.svg",
    size: 2104,
    modified: "2026-06-02T09:15:11.000Z",
    storageClass: "STANDARD",
  },
  {
    key: "assets/poster-fall-2026.png",
    size: 481022,
    modified: "2026-08-18T16:40:03.000Z",
    storageClass: "STANDARD",
  },
  {
    key: "backups/staging.env.bak",
    size: 218,
    modified: "2026-08-30T02:11:47.000Z",
    storageClass: "STANDARD",
    body: stagingEnv,
  },
  {
    key: "index.html",
    size: 4812,
    modified: "2026-06-02T09:14:00.000Z",
    storageClass: "STANDARD",
    body: "<!doctype html>\n<title>NUSEC</title>\n<h1>Northeastern University Security Club</h1>\n",
  },
];

/** Page two: the part nobody meant to leave public. */
export const secondPage: BucketObject[] = [
  {
    key: "logs/access-2026-09-01.log",
    size: 412,
    modified: "2026-09-02T00:05:00.000Z",
    storageClass: "STANDARD",
    body: accessLog,
  },
  {
    key: "backups/prod.env.bak",
    size: 297,
    modified: "2026-08-30T02:12:09.000Z",
    storageClass: "STANDARD",
    body: prodEnv,
  },
];

export function objectFor(key: string): BucketObject | undefined {
  return [...firstPage, ...secondPage].find((entry) => entry.key === key);
}
