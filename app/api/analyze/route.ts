import { NextRequest, NextResponse } from "next/server";
import { downloadAudio, cleanup } from "@/lib/download";
import { transcribeAudio } from "@/lib/transcribe";
import { extractClaims } from "@/lib/claims";
import { verifyClaims } from "@/lib/verify";

export const runtime = "nodejs";
// Give the pipeline room to breathe on platforms that respect this (e.g. Vercel Pro).
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  let dir: string | undefined;
  try {
    const body = await req.json().catch(() => null);
    const videoUrl = body?.videoUrl?.trim();

    if (!videoUrl) {
      return NextResponse.json({ error: "Paste a video link first." }, { status: 400 });
    }
    try {
      new URL(videoUrl);
    } catch {
      return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
    }

    const downloaded = await downloadAudio(videoUrl);
    dir = downloaded.dir;

    const transcript = await transcribeAudio(downloaded.filePath);
    const claims = await extractClaims(transcript);
    const verdicts = await verifyClaims(claims);

    return NextResponse.json({ transcript, claims: verdicts });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Something went wrong analyzing that link.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (dir) await cleanup(dir);
  }
}
