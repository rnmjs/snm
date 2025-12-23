import fs from "node:fs/promises";
import semver from "semver";
import { NODE_VERSIONS_DIR } from "../constants.ts";

export async function getInstalledNodeVersions(): Promise<string[]> {
  return (await fs.readdir(NODE_VERSIONS_DIR).catch(() => []))
    .filter((file) => file.startsWith("v"))
    .map((file) => file.slice(1))
    .filter((version) => semver.valid(version))
    .sort((x, y) => semver.compare(y, x));
}
