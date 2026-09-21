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

              const body = (
                <span className="min-w-0">
                  <span
                    className={cn(
                      "font-medium",
                      age === "unverified" ? "" : "group-hover:text-primary",
                    )}
                  >
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
              );

              // An entry we could not open is named but not linked. Sending
              // someone to a URL we haven't confirmed is worse than telling
              // them what to search for, and a "never verified" badge just
              // advertises our own housekeeping at the reader's expense.
              if (age === "unverified") {
                return (
                  <li
                    key={resource.url}
                    className="flex items-start gap-1.5 text-xs text-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                    />
                    {body}
                  </li>
                );
              }

              return (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "group flex items-start gap-1.5 text-xs",
                      age === "verified" ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-60" />
                    {body}
                  </a>

                  {age === "stale" && (
                    <span className="ml-4.5 mt-0.5 inline-block text-[0.65rem] text-muted-foreground">
                      Not checked in over a year
                    </span>
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
