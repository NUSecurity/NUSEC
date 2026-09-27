/** Mirrors the server-side authoring types that reach the shell as data. */

export interface DesktopItem {
  label: string;
  icon: string;
  /** A filesystem path, `app:<id>`, or `url:<host/path>`. */
  target: string;
}

export interface StartMenuItem {
  label: string;
  icon: string;
  appId: string;
}

export interface MachineInfo {
  osName: string;
  osVersion: string;
  hostname: string;
  user: string;
  fullName: string;
  role: string;
  imagedAt: number;
}

export interface DesktopPayload {
  machine: MachineInfo;
  desktopItems: DesktopItem[];
  startMenuItems: StartMenuItem[];
  catalogue: { id: string; title: string }[];
}
