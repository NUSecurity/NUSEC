/**
 * The synthetic disk image behind the "Disk Image Triage" challenge.
 *
 * The whole tree ships to the browser — it is a puzzle, not a secret. Only the
 * flag is withheld until the export destination is named, which is why the
 * answer check lives here on the server rather than in the page.
 *
 * Solve path: the roster in Documents is the only file read at 02:17:44; seven
 * seconds later an identically sized file with the same MD5 appears in
 * SyncWave's staging folder under a different name; syncwave.log shows that
 * file going out under profile `personal-2`; profiles.conf resolves that
 * profile to the destination host. The KINGSTON volume is a decoy — mount.log
 * has it ejected at 01:41:22, well before the roster was touched.
 */

export interface ImageEntry {
  name: string;
  type: "dir" | "file";
  /** Size in bytes. Directories leave this unset. */
  size?: number;
  modified: string;
  accessed: string;
  created: string;
  /** Contents of readable files, shown in the preview pane. */
  text?: string;
  /** Present for files; the roster and its copy deliberately match. */
  md5?: string;
  children?: ImageEntry[];
}

export const imageLabel = "NUSEC-WKSTN-04.E01";

const zshHistory = `cd ~/Documents
ls -la
open club-photo.jpg
cp club-photo.jpg /Volumes/KINGSTON/
diskutil eject /Volumes/KINGSTON
open -a SyncWave
history -c
`;

const authLog = `2026-09-05 18:04:11  sshd[812]: Accepted publickey for j.reyes from 10.0.14.22 port 51344
2026-09-05 18:41:02  sshd[812]: pam_unix(sshd:session): session closed for user j.reyes
2026-09-06 01:29:57  loginwindow: console session opened for user j.reyes
2026-09-06 02:11:03  sudo: j.reyes : TTY=ttys002 ; PWD=/Users/j.reyes ; COMMAND=/usr/sbin/diskutil list
2026-09-06 02:31:40  loginwindow: console session closed for user j.reyes
`;

const mountLog = `2026-09-06 01:32:10  mount: /dev/disk4s1 on /Volumes/KINGSTON (msdos, local, nodev, nosuid, noowners)
2026-09-06 01:41:22  umount: /Volumes/KINGSTON unmounted cleanly
2026-09-06 02:19:55  diskarbitrationd: no removable volumes attached
`;

const syncwaveLog = `2026-09-06 01:50:00  INFO   run start: profile=nightly-backup
2026-09-06 01:52:11  INFO   queued  budget-request.pdf (204388 bytes)
2026-09-06 01:52:19  INFO   sent    budget-request.pdf  profile=nightly-backup  status=ok
2026-09-06 02:15:38  WARN   profile added: personal-2 (source: user j.reyes)
2026-09-06 02:17:51  INFO   queued  q3-figures.xlsx (18944 bytes)
2026-09-06 02:17:58  INFO   sent    q3-figures.xlsx  profile=personal-2  status=ok
2026-09-06 02:18:04  INFO   queued  club-photo.jpg (1284992 bytes)
2026-09-06 02:18:22  INFO   sent    club-photo.jpg  profile=nightly-backup  status=ok
2026-09-06 02:19:10  INFO   run end: 3 transfers, 0 errors
`;

const profilesConf = `[nightly-backup]
host     = backup.nusec-club.org
path     = /vault/wkstn-04
schedule = daily 01:50

[personal-2]
host     = sftp.dropzone-41.net
path     = /incoming
schedule = manual
added    = 2026-09-06 02:15:38
`;

const downloadNotes = `SyncWave trial key: NW-4417-2290
remember to pull the personal profile before Dave runs the audit
`;

const writeupDraft = `# Meeting notes (draft)

Room booked for Thursday, projector cable is in the cabinet.
Ask Dave about the roster sign-off before the audit.

TODO: finish the slides
`;

export const diskImage: ImageEntry = {
  name: "/",
  type: "dir",
  modified: "2026-09-06 02:19:55",
  accessed: "2026-09-06 02:31:40",
  created: "2026-06-01 08:00:00",
  children: [
    {
      name: "Users",
      type: "dir",
      modified: "2026-09-06 02:17:51",
      accessed: "2026-09-06 02:31:40",
      created: "2026-06-01 08:00:00",
      children: [
        {
          name: "j.reyes",
          type: "dir",
          modified: "2026-09-06 02:17:51",
          accessed: "2026-09-06 02:31:40",
          created: "2026-06-01 08:14:22",
          children: [
            {
              name: "Documents",
              type: "dir",
              modified: "2026-09-04 16:22:40",
              accessed: "2026-09-06 02:18:04",
              created: "2026-06-01 08:14:22",
              children: [
                {
                  name: "member-roster-2026.xlsx",
                  type: "file",
                  size: 18944,
                  created: "2026-08-12 09:31:05",
                  modified: "2026-08-28 14:02:11",
                  accessed: "2026-09-06 02:17:44",
                  md5: "4f2a9c1d8e7b3a6054fd21c9b8e47a30",
                },
                {
                  name: "budget-request.pdf",
                  type: "file",
                  size: 204388,
                  created: "2026-07-19 11:02:44",
                  modified: "2026-08-30 10:15:03",
                  accessed: "2026-09-06 01:52:11",
                  md5: "c01e5b7748d9a2f3b6ce8014d7a9f265",
                },
                {
                  name: "club-photo.jpg",
                  type: "file",
                  size: 1284992,
                  created: "2026-08-02 19:44:12",
                  modified: "2026-08-02 19:44:12",
                  accessed: "2026-09-06 02:18:04",
                  md5: "9b3f0ca7e25d418806b7fe3390c2481d",
                },
                {
                  name: "meeting-notes.md",
                  type: "file",
                  size: 164,
                  created: "2026-09-01 13:10:08",
                  modified: "2026-09-04 16:22:40",
                  accessed: "2026-09-04 16:22:40",
                  md5: "6ad4e90f1cb7250382ae4f6d15b0c7e9",
                  text: writeupDraft,
                },
              ],
            },
            {
              name: "Downloads",
              type: "dir",
              modified: "2026-09-06 02:15:12",
              accessed: "2026-09-06 02:15:38",
              created: "2026-06-01 08:14:22",
              children: [
                {
                  name: "SyncWave-3.2.dmg",
                  type: "file",
                  size: 8734208,
                  created: "2026-09-06 02:13:40",
                  modified: "2026-09-06 02:13:40",
                  accessed: "2026-09-06 02:14:55",
                  md5: "e7f1cc0b6a934d25871f0be5a4c3d928",
                },
                {
                  name: "notes.txt",
                  type: "file",
                  size: 98,
                  created: "2026-09-06 02:15:12",
                  modified: "2026-09-06 02:15:12",
                  accessed: "2026-09-06 02:15:38",
                  md5: "21b8de4470f6c3915a0e7d2b48cf6019",
                  text: downloadNotes,
                },
              ],
            },
            {
              name: "Library",
              type: "dir",
              modified: "2026-09-06 02:19:10",
              accessed: "2026-09-06 02:19:10",
              created: "2026-06-01 08:14:22",
              children: [
                {
                  name: "SyncWave",
                  type: "dir",
                  modified: "2026-09-06 02:19:10",
                  accessed: "2026-09-06 02:19:10",
                  created: "2026-09-06 02:14:55",
                  children: [
                    {
                      name: "staging",
                      type: "dir",
                      modified: "2026-09-06 02:17:51",
                      accessed: "2026-09-06 02:17:58",
                      created: "2026-09-06 02:14:55",
                      children: [
                        {
                          name: "q3-figures.xlsx",
                          type: "file",
                          size: 18944,
                          created: "2026-09-06 02:17:51",
                          modified: "2026-09-06 02:17:51",
                          accessed: "2026-09-06 02:17:58",
                          md5: "4f2a9c1d8e7b3a6054fd21c9b8e47a30",
                        },
                      ],
                    },
                    {
                      name: "profiles.conf",
                      type: "file",
                      size: 216,
                      created: "2026-09-06 02:14:55",
                      modified: "2026-09-06 02:15:38",
                      accessed: "2026-09-06 02:17:58",
                      md5: "5c9a2e7013fb84d6ae15027c9b3d6f41",
                      text: profilesConf,
                    },
                    {
                      name: "syncwave.log",
                      type: "file",
                      size: 660,
                      created: "2026-09-06 01:50:00",
                      modified: "2026-09-06 02:19:10",
                      accessed: "2026-09-06 02:19:10",
                      md5: "8e0b1d45fa27c93610d8be7425a0f3c7",
                      text: syncwaveLog,
                    },
                  ],
                },
              ],
            },
            {
              name: ".zsh_history",
              type: "file",
              size: 140,
              created: "2026-06-01 08:14:22",
              modified: "2026-09-06 02:14:41",
              accessed: "2026-09-06 02:14:41",
              md5: "b47c1a90e6f32d8514ae09c7b2d0f685",
              text: zshHistory,
            },
          ],
        },
      ],
    },
    {
      name: "Volumes",
      type: "dir",
      modified: "2026-09-06 01:41:22",
      accessed: "2026-09-06 02:11:03",
      created: "2026-06-01 08:00:00",
      children: [
        {
          name: "KINGSTON",
          type: "dir",
          modified: "2026-09-06 01:39:04",
          accessed: "2026-09-06 01:41:22",
          created: "2026-05-14 12:00:00",
          children: [
            {
              name: "club-photo.jpg",
              type: "file",
              size: 1284992,
              created: "2026-09-06 01:39:04",
              modified: "2026-09-06 01:39:04",
              accessed: "2026-09-06 01:39:04",
              md5: "9b3f0ca7e25d418806b7fe3390c2481d",
            },
          ],
        },
      ],
    },
    {
      name: "var",
      type: "dir",
      modified: "2026-09-06 02:31:40",
      accessed: "2026-09-06 02:31:40",
      created: "2026-06-01 08:00:00",
      children: [
        {
          name: "log",
          type: "dir",
          modified: "2026-09-06 02:31:40",
          accessed: "2026-09-06 02:31:40",
          created: "2026-06-01 08:00:00",
          children: [
            {
              name: "auth.log",
              type: "file",
              size: 430,
              created: "2026-09-05 18:04:11",
              modified: "2026-09-06 02:31:40",
              accessed: "2026-09-06 02:31:40",
              md5: "3d71f0ba95c2e846170bdf93a5c1e072",
              text: authLog,
            },
            {
              name: "mount.log",
              type: "file",
              size: 236,
              created: "2026-09-06 01:32:10",
              modified: "2026-09-06 02:19:55",
              accessed: "2026-09-06 02:19:55",
              md5: "af52b6d7301ec9482f0b7a15de93c604",
              text: mountLog,
            },
          ],
        },
      ],
    },
  ],
};

/** Strips scheme, port, trailing path separators and case before comparing. */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .replace(/[:/]+$/, "");
}

/** Every phrasing of the destination host we accept. */
const acceptedDestinations = [
  "sftp.dropzone-41.net",
  "dropzone-41.net",
  "sftp.dropzone-41.net:/incoming",
  "sftp.dropzone-41.net/incoming",
  "dropzone-41.net/incoming",
].map(normalizeAnswer);

/**
 * Answers that mean the player is on the trail but stopped a hop short. Each
 * gets a pointed nudge instead of a flat "wrong", since this runs in a meeting
 * where getting unstuck matters more than scoring.
 */
const nudges: { answers: string[]; hint: string }[] = [
  {
    answers: ["kingston", "/volumes/kingston", "volumes/kingston", "usb"],
    hint: "That drive was ejected at 01:41:22 — check mount.log against the time the document was read.",
  },
  {
    answers: ["personal-2", "personal2", "profilepersonal-2"],
    hint: "That is the sync profile, not the destination. Something on disk maps that profile to a host.",
  },
  {
    answers: ["backup.nusec-club.org", "nusec-club.org", "nightly-backup"],
    hint: "That is the legitimate nightly backup. Which transfer matches the staged copy?",
  },
  {
    answers: ["q3-figures.xlsx", "member-roster-2026.xlsx", "staging"],
    hint: "That is the file, not the place it went. Follow it out of the staging folder.",
  },
];

export interface DestinationVerdict {
  correct: boolean;
  /** Set when the answer is a recognised near-miss. */
  hint?: string;
}

export function checkDestination(value: string): DestinationVerdict {
  const answer = normalizeAnswer(value);
  if (acceptedDestinations.includes(answer)) return { correct: true };

  const nudge = nudges.find((entry) =>
    entry.answers.map(normalizeAnswer).includes(answer),
  );
  return { correct: false, hint: nudge?.hint };
}
