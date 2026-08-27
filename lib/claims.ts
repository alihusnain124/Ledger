import type { ChatMessage } from "./types";

// OpenRouter's free roster shifts, and any single free model can be rate-limited
// upstream at any moment (the free pool is shared across everyone). So we keep a
// list and walk down it instead of failing on the first busy model. Check
// https://openrouter.ai/models?max_price=0 when these drift.
const DEFAULT_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "minimax/minimax-m3:free",
  "z-ai/glm-5.2:free",
];

// One model call should never outlast a user's patience — and without this a
// stalled provider hangs the whole request forever.
const REQUEST_TIMEOUT_MS = 60_000;
const MAX_TOKENS = 2_000;

// Statuses that mean "this model, right now" — worth trying the next one.
const SKIP_STATUSES = new Set([402, 403, 404, 408, 429, 502, 503, 504]);

// The model that answered last sticks around, so one busy model isn't re-tried
// on every call within the same request.
let preferredModel: string | null = null;

function modelCandidates(): string[] {
  const configured = (process.env.OPENROUTER_MODELS || process.env.OPENROUTER_MODEL || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  return [...new Set([...(preferredModel ? [preferredModel] : []), ...configured, ...DEFAULT_MODELS])];
}

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

  const candidates = modelCandidates();
  let lastStatus = 0;
  let lastBody = "";

  for (const model of candidates) {
    // Some free models reject response_format outright — retry that one plainly.
    for (const useJsonMode of json ? [true, false] : [false]) {
      let res: Response;

      try {
        res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.2,
            max_tokens: MAX_TOKENS,
            // Several of the free models are reasoning models: left on, they
            // spend a minute narrating before the JSON. Off, they answer in
            // seconds with the same answer.
            reasoning: { enabled: false },
            ...(useJsonMode ? { response_format: { type: "json_object" } } : {}),
          }),
        });
      } catch {
        lastStatus = 408;
        lastBody = `${model} timed out`;
        break; // next model
      }

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          if (preferredModel !== model) console.info(`[ledger] model: ${model}`);
          preferredModel = model;
          return content;
        }
        lastStatus = 200;
        lastBody = "empty response";
        break; // empty answer — a different model may do better
      }

      lastStatus = res.status;
      lastBody = (await res.text().catch(() => "")).slice(0, 200);

      // A bad key or malformed request won't improve on another model.
      if (res.status === 401 || res.status === 400) {
        if (res.status === 400 && useJsonMode) continue; // drop json mode, retry
        throw new Error(`Model request failed (${res.status}): ${lastBody}`);
      }

      if (SKIP_STATUSES.has(res.status)) break; // next model
    }
  }

  throw new Error(
    `Model request failed (${lastStatus || 429}): every free model Ledger tried was unavailable. ${lastBody}`,
  );
}

export function extractJson(text: string): unknown {
  // Reasoning models like to narrate before answering, so strip the thinking
  // block and any fenced wrapper before looking for the object itself.
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:json)?/gi, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Walk from each opening brace and take the first balanced span that parses.
    for (const open of ["{", "["] as const) {
      const close = open === "{" ? "}" : "]";
      let start = cleaned.indexOf(open);

      while (start !== -1) {
        let depth = 0;

        for (let i = start; i < cleaned.length; i++) {
          if (cleaned[i] === open) depth++;
          else if (cleaned[i] === close) depth--;

          if (depth === 0) {
            try {
              return JSON.parse(cleaned.slice(start, i + 1));
            } catch {
              break; // this span isn't valid JSON — try the next opening brace
            }
          }
        }

        start = cleaned.indexOf(open, start + 1);
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
