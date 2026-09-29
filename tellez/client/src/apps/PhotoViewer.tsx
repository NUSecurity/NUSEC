import type { AppProps, DesktopApp } from "./types";

export const photos: DesktopApp = {
  id: "photos",
  title: "Photos",
  icon: "Image",
  opens: ["image"],

  render({ content, node }: AppProps) {
    if (content?.kind !== "image") return null;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-black/30 p-4">
        <img
          src={content.assetUrl}
          alt={content.caption ?? node?.name ?? "Image"}
          className="max-h-full max-w-full rounded border border-husky-edge object-contain"
        />
        {content.caption && (
          <p className="selectable text-center text-[11.5px] text-husky-dim">{content.caption}</p>
        )}
      </div>
    );
  },
};
