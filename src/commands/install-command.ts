import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import compressing from "compressing";
import semver from "semver";
import {
  ALIASES_DIR,
  NODE_DIST_MIRROR,
  NODE_VERSIONS_DIR,
} from "../constants.ts";
import { download } from "../utils/download.ts";
import { getInstalledNodeVersions } from "../utils/get-installed-node-versions.ts";
import { getRemoteNodeVersions } from "../utils/get-remote-node-versions.ts";

const PLATFORM = os.platform();
const ARCH = os.arch();

interface InstallCommandOptions {
  version: string;
}

export async function installCommand(options: InstallCommandOptions) {
  const remoteNodeVersions = await getRemoteNodeVersions();
  const installedNodeVersions = await getInstalledNodeVersions();

  const versionToDownload = remoteNodeVersions.find((remoteVersion) =>
    semver.satisfies(remoteVersion, options.version),
  );
  if (!versionToDownload) {
    throw new Error(
      `No matching version found from ${NODE_DIST_MIRROR} for ${options.version}.`,
    );
  }

  if (installedNodeVersions.includes(versionToDownload)) {
    return;
  }
  const url = [
    NODE_DIST_MIRROR,
    `v${versionToDownload}`,
    `node-v${versionToDownload}-${PLATFORM}-${ARCH}.${PLATFORM === "win32" ? "zip" : "tar.gz"}`,
  ].join("/");
  const downloadedPath = await download(url, {
    onProgress: (received, total) => {
      if (total) {
        process.stdout.write(
          `\rDownloading ${url}: ${Math.floor((received / total) * 100)}%`,
        );
      }
    },
  });
  process.stdout.write(`\rDownload ${url} completed\n`);

  await (PLATFORM === "win32"
    ? compressing.zip.uncompress(downloadedPath, NODE_VERSIONS_DIR)
    : compressing.tgz.uncompress(downloadedPath, NODE_VERSIONS_DIR));
  await fs.unlink(downloadedPath);
  await fs.rename(
    path.join(
      NODE_VERSIONS_DIR,
      `node-v${versionToDownload}-${PLATFORM}-${ARCH}`,
    ),
    path.join(NODE_VERSIONS_DIR, `v${versionToDownload}`),
  );

  await createDefaultLink();
}

/**
 * Create default link if this is the only installed version.
 */
async function createDefaultLink() {
  const installedVersions = await getInstalledNodeVersions();

  if (installedVersions.length === 1 && installedVersions[0]) {
    const latestVersion = installedVersions[0];
    const defaultLinkPath = path.join(ALIASES_DIR, "default");
    const targetPath = path.relative(
      ALIASES_DIR,
      path.join(NODE_VERSIONS_DIR, `v${latestVersion}`),
    );

    await fs.unlink(defaultLinkPath).catch(() => {
      /* do nothing */
    });
    await fs.symlink(targetPath, defaultLinkPath);
  }
}

// await installCommand({ version: "18" });
