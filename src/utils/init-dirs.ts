import fs from "node:fs/promises";
import { ALIASES_DIR, INSTALL_DIR, NODE_VERSIONS_DIR } from "../constants.ts";

export async function initDirs() {
  await fs.mkdir(INSTALL_DIR, { recursive: true });
  await fs.mkdir(NODE_VERSIONS_DIR, { recursive: true });
  await fs.mkdir(ALIASES_DIR, { recursive: true });
}
