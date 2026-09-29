import type { AppProps, DesktopApp } from "./types";

/**
 * Video lives outside the gate's byte path — it exceeds Vercel's 4.5 MB
 * response cap — so the bytes sit in Blob storage and it is the URL that is
 * gated. A session that has not earned the node never receives this src.
 */
export const media: DesktopApp = {
  id: "media",
  title: "Media Player",
  icon: "Play",
  opens: ["video"],

  render({ content }: AppProps) {
    if (content?.kind !== "video") return null;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-black/50 p-4">
        <video
          src={content.assetUrl}
          poster={content.poster}
          controls
          className="max-h-full max-w-full rounded border border-husky-edge"
        />
        {content.caption && (
          <p className="selectable text-center text-[11.5px] text-husky-dim">{content.caption}</p>
        )}
      </div>
    );
  },
};
