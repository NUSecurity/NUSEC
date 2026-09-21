/**
 * Verification stamps for resource links.
 *
 * `last_verified` means: on this date, a human (or an agent acting for one)
 * opened this URL and confirmed it still resolves and is still the thing the
 * note claims it is. It does not mean "the date I added the link". Resources
 * past twelve months render greyed with a "verify this" link, so an honest
 * stamp is the whole mechanism — a date nobody checked makes the decay
 * invisible, which is worse than no date at all.
 *
 * Adding a link? Stamp the date you actually opened it, or leave it `null` and
 * let it render as unverified until someone does.
 *
 * A merged verification PR is itself a Tier-1 Prove item (PRV-PR), so the tool
 * feeds its own maintenance.
 */

/** Links opened and confirmed during the September 2026 pass. */
export const V_2026_09 = "2026-09-21";
