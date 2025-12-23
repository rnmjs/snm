import semver from "semver";
import { NODE_DIST_MIRROR } from "../constants.ts";

export async function getRemoteNodeVersions(): Promise<string[]> {
  const json = await fetch(`${NODE_DIST_MIRROR}/index.json`).then(
    async (res) => await res.json(),
  );
  if (!Array.isArray(json)) {
    return [];
  }
  return json
    .map((item: { version: `v${string}` }) => item.version.slice(1))
    .filter((version) => semver.parse(version)?.prerelease.length === 0)
    .sort((x, y) => semver.compare(y, x));
}
