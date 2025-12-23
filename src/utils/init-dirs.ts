import fs from "node:fs/promises";
import {
  ALIASES_DIR,
  MULTISHELLS_DIR,
  NODE_VERSIONS_DIR,
} from "../constants.ts";

export async function initDirs() {
  await fs.mkdir(NODE_VERSIONS_DIR, { recursive: true });
  await fs.mkdir(ALIASES_DIR, { recursive: true });
  await fs.mkdir(MULTISHELLS_DIR, { recursive: true });
}
