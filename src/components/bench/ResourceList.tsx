import { ExternalLink } from "lucide-react";
import { resourceAge } from "@/bench";
import {
  Resource,
  ResourceType,
  resourceTypeLabels,
  resourceTypeMeanings,
} from "@/bench/types";
import { cn } from "@/lib/utils";

/** Slot order, shallowest commitment first. */
const slotOrder: ResourceType[] = [
  "foundation",
  "hands-on",
  "reference",
  "corpus",
  "community",
];

const REPO = "https://github.com/NUSecurity/NUSEC";

/**
 * A pre-filled issue, so verifying a link is a thirty-second job rather than a
 * thing you have to work out how to report. A merged verification PR is itself
 * a Tier-1 Prove item, which is the tool feeding its own maintenance.
 */
function verifyIssueUrl(resource: Resource) {
  const params = new URLSearchParams({
    title: `Verify resource: ${resource.title}`,
    body: [
      `**Resource:** ${resource.title}`,
      `**URL:** ${resource.url}`,
      `**Last verified:** ${resource.last_verified ?? "never"}`,
      "",
      "- [ ] The link still resolves",
      "- [ ] It is still the thing the note describes",
      "- [ ] The note is still accurate",
      "",
      "If all three hold, update `last_verified` in `src/bench/tiles/` to today's date.",
      "If not, replace or remove the entry and say why here.",
    ].join("\n"),
  });
  return `${REPO}/issues/new?${params.toString()}`;
}

const ResourceList = ({ resources }: { resources: Resource[] }) => {
  const grouped = slotOrder
    .map((type) => ({
      type,
      items: resources.filter((resource) => resource.type === type),
    }))
    .filter((group) => group.items.length > 0);

  if (grouped.length === 0) return null;

  return (
    <div className="space-y-3">
      {grouped.map(({ type, items }) => (
        <div key={type}>
          <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-foreground/70">
            {resourceTypeLabels[type]}
            <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground">
              {resourceTypeMeanings[type]}
            </span>
          </h4>

          <ul className="mt-1.5 space-y-1.5">
            {items.map((resource) => {
              const age = resourceAge(resource);

              return (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "group flex items-start gap-1.5 text-xs",
                      // Decay is visible: stale and unverified entries are
                      // dimmed rather than quietly presented as current.
                      age === "verified" ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-60" />
                    <span className="min-w-0">
                      <span className="font-medium group-hover:text-primary">
                        {resource.title}
                      </span>
                      {resource.paid && (
                        <span className="ml-1.5 rounded border border-border px-1 text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                          paid
                        </span>
                      )}
                      <span className="block leading-snug text-muted-foreground">
                        {resource.note}
                      </span>
                    </span>
                  </a>

                  {age !== "verified" && (
                    <a
                      href={verifyIssueUrl(resource)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-4.5 mt-0.5 inline-block text-[0.65rem] text-primary/70 underline underline-offset-2 hover:text-primary"
                    >
                      {age === "stale"
                        ? "Not checked in over a year — verify this"
                        : "Never verified — verify this"}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;
