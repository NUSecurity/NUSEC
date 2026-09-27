import * as Lucide from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

/**
 * Icons by name, so content modules can pick one as data:
 * `{ label: "notes", icon: "Folder" }`.
 *
 * This imports the whole Lucide set, which costs bundle size we could shave
 * with a curated map. The trade is deliberate: a contributor should be able to
 * name any icon and have it work, without editing a registry and without
 * knowing this file exists. Original icons only — never Microsoft assets.
 */
type Renderable = ComponentType<LucideProps>;

/**
 * Lucide icons are `forwardRef` objects, not functions, so a `typeof ===
 * "function"` test rejects every single one of them and silently renders the
 * fallback everywhere. Accept both shapes.
 */
function isRenderable(value: unknown): value is Renderable {
  if (typeof value === "function") return true;
  return typeof value === "object" && value !== null && "$$typeof" in value;
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const candidate = (Lucide as Record<string, unknown>)[name];
  const Component = isRenderable(candidate) ? candidate : (Lucide.File as Renderable);

  return <Component {...props} />;
}
