import os from "node:os";
import path from "node:path";

export const NODE_DIST_MIRROR = "https://nodejs.org/dist";

const INSTALL_DIR = path.join(os.homedir(), ".local", "share", "snm");
export const NODE_VERSIONS_DIR = path.join(INSTALL_DIR, "node-versions");
export const ALIASES_DIR = path.join(INSTALL_DIR, "aliases");
export const MULTISHELLS_DIR = path.join(
  os.homedir(),
  ".local",
  "state",
  "snm_multishells",
);
