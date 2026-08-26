import { NextRequest, NextResponse } from "next/server";
import { downloadAudio, cleanup } from "@/lib/download";
import { transcribeAudio } from "@/lib/transcribe";
import { extractClaims } from "@/lib/claims";
import { verifyClaims } from "@/lib/verify";
import { friendlyError } from "@/lib/errors";

export const runtime = "nodejs";
// Give the pipeline room to breathe on platforms that respect this (e.g. Vercel Pro).
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  let dir: string | undefined;
  try {
    const body = await req.json().catch(() => null);
    const videoUrl = body?.videoUrl?.trim();

    if (!videoUrl) {
      return NextResponse.json(
        {
          error: "Paste a video link first.",
          title: "No link yet",
          message: "Drop a video URL into the box and Ledger will take it from there.",
        },
        { status: 400 },
      );
    }
    try {
      new URL(videoUrl);
    } catch {
      return NextResponse.json(
        {
          error: "That doesn't look like a valid URL.",
          title: "That isn't a link Ledger can open",
          message:
            "It needs a full web address — something starting with http:// or https:// that points at a page with a video on it.",
        },
        { status: 400 },
      );
    }

    const downloaded = await downloadAudio(videoUrl);
    dir = downloaded.dir;

    const transcript = await transcribeAudio(downloaded.filePath);
    const claims = await extractClaims(transcript);
    const verdicts = await verifyClaims(claims);

    return NextResponse.json({ transcript, claims: verdicts });
  } catch (err) {
    // Full detail stays in the server log; the client gets the readable version.
    console.error(err);
    const friendly = friendlyError(err);
    return NextResponse.json({ error: friendly.message, ...friendly }, { status: 500 });
  } finally {
    if (dir) await cleanup(dir);
  }
}
