import { useEffect } from "react";

/**
 * Adds `<meta name="robots" content="noindex, nofollow">` for as long as the
 * calling component is mounted, then removes it.
 *
 * The challenge pages are unlisted — nothing on the site links to them — and
 * this keeps them out of search results if a link ever leaks. We deliberately
 * do not list the path in robots.txt, since that file is public and would
 * advertise exactly what we're trying to keep quiet.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}
