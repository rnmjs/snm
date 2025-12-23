import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function download(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    await response.body?.cancel();
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }

  const contentLength = Number(response.headers.get("content-length"));
  let received = 0;
  const progressTransform = new Transform({
    transform: (chunk, _encoding, callback) => {
      received += chunk.length;
      if (contentLength) {
        process.stdout.write(
          `\rDownloading ${url}: ${Math.floor((received / contentLength) * 100)}%`,
        );
        if (received === contentLength) {
          process.stdout.write("\n");
        }
      }
      callback(null, chunk);
    },
  });

  const fileName = path.basename(new URL(url).pathname);
  const outputPath = path.join(os.tmpdir(), fileName);
  await pipeline(
    response.body,
    progressTransform,
    fs.createWriteStream(outputPath),
  );
  return outputPath;
}
