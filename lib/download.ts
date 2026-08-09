import { spawn } from "node:child_process";
import { mkdtemp, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

// Stay comfortably under typical hosted Whisper upload limits (~25MB).
const MAX_BYTES = 24 * 1024 * 1024;

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    // spawn() with an args array (no shell) avoids command-injection risk
    // from a user-supplied URL — never build this as a shell string.
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => {
      reject(
        new Error(
          `Couldn't run "${cmd}". Is it installed and on your PATH? (${err.message})`
        )
      );
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(
            stderr.trim().split("\n").slice(-5).join("\n") ||
              `${cmd} exited with code ${code}`
          )
        );
    });
  });
}

export async function downloadAudio(
  videoUrl: string
): Promise<{ dir: string; filePath: string }> {
  const dir = await mkdtemp(path.join(tmpdir(), "ledger-"));
  const output = path.join(dir, "audio.%(ext)s");
  const finalPath = path.join(dir, "audio.mp3");

  try {
    await run("yt-dlp", [
      "--no-playlist",
      "-f",
      "bestaudio/best",
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "6",
      "--max-filesize",
      "150M",
      "-o",
      output,
      videoUrl,
    ]);
  } catch (err) {
    await cleanup(dir);
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Couldn't download that link: ${message}`);
  }

  const info = await stat(finalPath).catch(() => null);
  if (!info) {
    await cleanup(dir);
    throw new Error(
      "The download finished but no audio came out of it. Try a different link."
    );
  }
  if (info.size > MAX_BYTES) {
    await cleanup(dir);
    throw new Error(
      "That clip's audio is too large to transcribe on the free tier — try something under ~20 minutes."
    );
  }

  return { dir, filePath: finalPath };
}

export async function cleanup(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true }).catch(() => {});
}
