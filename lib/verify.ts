import { callOpenRouter, extractJson } from "./claims";
import type { Verdict } from "./types";

type Evidence = { title: string; url: string; snippet: string };

async function searchTavily(query: string): Promise<Evidence[] | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Evidence is optional — a slow search shouldn't hold up the verdict.
      signal: AbortSignal.timeout(12_000),
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: 4,
        search_depth: "basic",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.results || []).map((r: { title: string; url: string; content?: string }) => ({
      title: r.title,
      url: r.url,
      snippet: (r.content || "").slice(0, 500),
    }));
  } catch {
    return null;
  }
}

export async function verifyClaims(claims: string[]): Promise<Verdict[]> {
  if (claims.length === 0) return [];

  const hasSearch = Boolean(process.env.TAVILY_API_KEY);
  const searchByClaim: Record<string, Evidence[]> = {};

  if (hasSearch) {
    const results = await Promise.all(claims.map((c) => searchTavily(c)));
    claims.forEach((c, i) => {
      searchByClaim[c] = results[i] || [];
    });
  }

  const claimsBlock = claims
    .map((c, i) => {
      const evidence = searchByClaim[c];
      const evidenceText =
        evidence && evidence.length
          ? evidence
              .map((e, j) => `  [${j}] ${e.title} — ${e.snippet} (${e.url})`)
              .join("\n")
          : "  (no search evidence available)";
      return `${i + 1}. Claim: ${c}\n${evidenceText}`;
    })
    .join("\n\n");

  const systemPrompt = hasSearch
    ? 'You are a careful fact-checker. For each numbered claim, use the search evidence given under it to decide a verdict. Respond ONLY with JSON: {"verdicts": [{"index": 1, "verdict": "true"|"false"|"unverified", "confidence": 0-100, "explanation": "one or two plain sentences", "sourceIndexes": [0,1]}]}. Use "unverified" when the evidence is thin, mixed, or doesn\'t clearly settle it — never guess. sourceIndexes refers to the bracketed evidence numbers you actually relied on for that claim.'
    : 'You are a careful fact-checker working from general knowledge only, with no search access. For each numbered claim, respond ONLY with JSON: {"verdicts": [{"index": 1, "verdict": "true"|"false"|"unverified", "confidence": 0-100, "explanation": "one or two plain sentences"}]}. Mark a claim "unverified" whenever you are not confident, it depends on recent events, or it\'s the kind of specific figure you could easily misremember — do not guess just to sound authoritative.';

  const content = await callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: claimsBlock },
  ]);

  type RawVerdict = {
    index?: number;
    verdict?: string;
    confidence?: number;
    explanation?: string;
    sourceIndexes?: number[];
  };

  const parsed = extractJson(content) as { verdicts?: RawVerdict[] };
  const verdicts = Array.isArray(parsed?.verdicts) ? parsed.verdicts : [];

  return claims.map((text, i): Verdict => {
    const v = verdicts.find((x) => x.index === i + 1) || {};
    const evidence = searchByClaim[text] || [];
    const sourceIndexes = Array.isArray(v.sourceIndexes) ? v.sourceIndexes : [];
    const sources = sourceIndexes
      .map((idx) => evidence[idx])
      .filter((e): e is Evidence => Boolean(e))
      .map((e) => ({ title: e.title, url: e.url }));

    return {
      text,
      verdict: (["true", "false", "unverified"] as const).includes(
        v.verdict as "true" | "false" | "unverified"
      )
        ? (v.verdict as "true" | "false" | "unverified")
        : "unverified",
      confidence: typeof v.confidence === "number" ? Math.round(v.confidence) : null,
      explanation: v.explanation || "The model didn't return an explanation for this one.",
      sources,
    };
  });
}
