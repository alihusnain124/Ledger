import { readFile } from "node:fs/promises";

// Groq's model catalog changes over time — override via env if this drifts.
const GROQ_MODEL = process.env.GROQ_WHISPER_MODEL || "whisper-large-v3-turbo";

export async function transcribeAudio(filePath: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to .env.local (free key at console.groq.com)."
    );
  }

  const fileBuffer = await readFile(filePath);
  const form = new FormData();
  form.append("file", new Blob([fileBuffer], { type: "audio/mpeg" }), "audio.mp3");
  form.append("model", GROQ_MODEL);
  form.append("response_format", "json");

  // Transcription is the long pole, but it still needs a ceiling — otherwise a
  // stalled upload leaves the browser spinning with nothing to show.
  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(180_000),
    body: form,
  }).catch(() => {
    throw new Error("Transcription timed out before the service answered.");
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Transcription failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  if (!data.text || !data.text.trim()) {
    throw new Error("Got an empty transcript back — the clip may have no speech in it.");
  }
  return data.text.trim();
}
