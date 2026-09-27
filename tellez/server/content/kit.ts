/**
 * The authoring surface.
 *
 * One import for everything a content module needs:
 *
 *   import { dir, text, ts, requiresObjective, type ContentModule } from "../kit.js";
 *
 * If you are adding a challenge, you should not need to import from anywhere
 * else under `server/`. If you do, that is worth saying out loud in review —
 * it usually means the engine is missing an extension point.
 */

export {
  alwaysOpen, allOf, anyOf, requiresObjective, requiresSecret,
  type LockRule, type Progress,
} from "../locks.js";

export {
  archive, attrs, binary, chat, deletedFrom, dir, encrypted, image, link,
  mail, sheet, text, ts, video,
  ArchiveFile, BinaryFile, ChatLog, Directory, EncryptedFile, FileNode,
  ImageFile, MailArchive, SheetFile, ShortcutFile, TextFile, VfsNode, VideoFile,
  type NodeOptions, type Visibility,
} from "../vfs.js";

export type {
  ContentModule, DesktopItem, Objective, ObjectiveTrigger, Secret,
  SimRoute, SimSite, SiteAuth, StartMenuItem,
} from "../types.js";

export type {
  Cell, ChatMessage, MailMessage, NodeMeta, ObjectiveId, SecretId,
} from "../../shared/protocol.js";

export { MACHINE } from "./machine.js";
