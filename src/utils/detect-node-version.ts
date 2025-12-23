import fs from "node:fs/promises";
import path from "node:path";

async function exists(filePath: string): Promise<boolean> {
  return await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
}

async function checkNodeVersionFile(
  dirPath: string,
): Promise<string | undefined> {
  const nodeVersionPath = path.join(dirPath, ".node-version");
  if (!(await exists(nodeVersionPath))) return undefined;

  const content = await fs.readFile(nodeVersionPath, "utf8");
  return content.trim();
}

async function checkPackageJsonFile(
  dirPath: string,
): Promise<string | undefined> {
  const packageJsonPath = path.join(dirPath, "package.json");
  if (!(await exists(packageJsonPath))) return undefined;

  const content = await fs.readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(content);
  const { name, version }: { name?: string; version?: string } =
    packageJson.devEngines?.runtime ?? {};
  return name === "node" && typeof version === "string" ? version : undefined;
}

export async function detectNodeVersion(
  currentDir: string,
): Promise<string | undefined> {
  const result =
    (await checkNodeVersionFile(currentDir)) ??
    (await checkPackageJsonFile(currentDir));
  if (result) {
    return result;
  }

  const parentDir = path.dirname(currentDir);
  if (parentDir === currentDir) {
    return undefined;
  }
  return await detectNodeVersion(parentDir);
}
