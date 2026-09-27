import type { SiteRenderers } from "./types";
import { brightlinePay } from "./brightlinepay";

/**
 * The simulated internet's renderers.
 *
 * Adding a website is this file plus a folder beside it — see ARCHITECTURE.md
 * §7.5. The site's *data* lives in a content module on the server; only the
 * presentation is here, which is why a locked route's contents never reach the
 * bundle.
 */
const sites: SiteRenderers[] = [brightlinePay];

const byHost = new Map(sites.map((site) => [site.host.toLowerCase(), site]));

export function rendererFor(host: string, routePattern: string) {
  return byHost.get(host.toLowerCase())?.routes[routePattern];
}
