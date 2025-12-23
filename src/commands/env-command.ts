import path from "node:path";
import process from "node:process";
import semver from "semver";
import { ALIASES_DIR, NODE_VERSIONS_DIR } from "../constants.ts";
import { detectNodeVersion } from "../utils/detect-node-version.ts";
import { getInstalledNodeVersions } from "../utils/get-installed-node-versions.ts";

interface EnvCommandOptions {
  shell?: "bash" | "zsh";
}

function print(content: string) {
  process.stdout.write(content);
}

export async function envCommand(_options?: EnvCommandOptions) {
  const nodeVersion = await detectNodeVersion(process.cwd());
  // 1. If cannot detect node version, use default alias.
  if (!nodeVersion) {
    print(`export PATH="${path.join(ALIASES_DIR, "default", "bin")}":$PATH`);
    return;
  }

  // 2. If one of installed node versions satisfies the detected node version, use it.
  for (const installedNodeVersion of await getInstalledNodeVersions()) {
    if (semver.satisfies(installedNodeVersion, nodeVersion)) {
      print(
        `export PATH="${path.join(NODE_VERSIONS_DIR, `v${nodeVersion}`, "bin")}":$PATH`,
      );
      return;
    }
  }

  // 3. If none of installed node versions satisfies the detected node version, ask user to install it.
  // TODO: Wait for finish it.
  print("");
}
