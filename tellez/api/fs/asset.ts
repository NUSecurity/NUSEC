/**
 * Binary passthrough for a gated file's asset.
 *
 * Two things are checked, not one: that the session may open the node, and
 * that the node actually references this asset. Without the second check the
 * path parameter would be a way to read any file in the assets directory by
 * pairing it with any unlocked node.
 *
 * Vercel caps a function response at 4.5 MB, so anything larger — video —
 * lives in Blob storage with its URL gated instead. See ARCHITECTURE.md §9.3.
 */

import { existsSync, readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { assetDir } from "../../server/assets.ts";
import { world } from "../../server/engine.ts";
import { requireMachine } from "../../server/guard.ts";
import { fail, param, type ApiRequest, type ApiResponse } from "../../server/http.ts";
import { ImageFile } from "../../server/vfs.ts";

const TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const ctx = await requireMachine(req, res);
  if (!ctx) return;

  const path = param(req, "path");
  const name = param(req, "name");
  if (!path || !name) return fail(res, 400, "missing_parameter");

  const node = world().node(path);
  if (!node) return fail(res, 404, "not_found");
  if (!node.lock.isOpen(ctx.progress)) return fail(res, 403, "access_denied");

  if (!(node instanceof ImageFile) || node.asset !== name) {
    return fail(res, 404, "not_found");
  }

  // basename() so a crafted `name` cannot climb out of the assets directory,
  // belt-and-braces on top of the node-references-asset check above.
  const dir = assetDir();
  const file = resolve(dir, basename(name));
  if (!file.startsWith(dir) || !existsSync(file)) return fail(res, 404, "not_found");

  res.setHeader("Content-Type", TYPES[extname(file).toLowerCase()] ?? "application/octet-stream");
  res.setHeader("Cache-Control", "private, max-age=3600");
  res.status(200).send(readFileSync(file));
}
