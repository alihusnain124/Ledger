import type { ChatMessage } from "./types";

// OpenRouter's free model roster shifts over time — check
// https://openrouter.ai/models?max_price=0 and override via env if needed.
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free";

export async function callOpenRouter(
  messages: ChatMessage[],
  { json = true }: { json?: boolean } = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it to .env.local (free key at openrouter.ai)."
    );
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.2,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Model request failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("The model returned an empty response.");
  return content;
}

export function extractJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // fall through to the throw below
      }
    }
    throw new Error("Couldn't parse the model's response as JSON.");
  }
}

export async function extractClaims(transcript: string): Promise<string[]> {
  const content = await callOpenRouter([
    {
      role: "system",
      content:
        'You read transcripts of spoken video and pull out distinct, checkable factual claims — statements about facts, numbers, events, or history that could in principle be verified true or false. Skip opinions, predictions, and vague statements. Return at most 8 claims, the clearest and most checkable ones. Respond ONLY with JSON: {"claims": ["claim text", ...]}. Keep each claim short and self-contained, in the speaker\'s own words where possible.',
    },
    { role: "user", content: transcript.slice(0, 12000) },
  ]);

  const parsed = extractJson(content) as { claims?: unknown };
  const claims = Array.isArray(parsed?.claims) ? parsed.claims : [];
  return claims
    .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    .slice(0, 8);
}
