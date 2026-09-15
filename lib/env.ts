/**
 * Secrets come from the environment, never from the repository.
 *
 * NUSecurity/NUSEC is public, so anything checked in is readable by anyone —
 * including the members who are about to sit the challenges. Flags and the
 * meeting word are therefore configured in Vercel's project settings, and
 * locally in a gitignored `.env`. See `.env.example` for the full list.
 */

/** A configured secret, or undefined when the variable is unset or blank. */
export function secret(name: string): string | undefined {
  const value = process.env[name];
  return value !== undefined && value.trim().length > 0 ? value.trim() : undefined;
}

/**
 * Names whose absence should be obvious rather than silent. Returns the list
 * of variables that are missing, for a handler to surface.
 */
export function missing(names: string[]): string[] {
  return names.filter((name) => secret(name) === undefined);
}
