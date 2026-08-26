import type { Verdict } from "@/lib/types";

export const VERDICTS: Record<
  Verdict["verdict"],
  { label: string; color: string; blurb: string }
> = {
  true: {
    label: "True",
    color: "var(--true)",
    blurb: "The evidence lines up with the claim as stated.",
  },
  false: {
    label: "False",
    color: "var(--false)",
    blurb: "The evidence contradicts the claim as stated.",
  },
  unverified: {
    label: "Unverified",
    color: "var(--unverified)",
    blurb: "The evidence is thin, mixed, or missing — so no verdict is forced.",
  },
};

export default function ClaimCard({
  text,
  verdict,
  confidence,
  explanation,
  sources,
  index,
}: Verdict & { index?: number }) {
  const v = VERDICTS[verdict] || VERDICTS.unverified;

  return (
    <article
      className="lift group relative rounded-2xl bg-card text-body p-6 md:p-7 border border-line overflow-hidden"
      style={{ borderLeft: `3px solid ${v.color}` }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          {typeof index === "number" && (
            <span className="font-mono text-[11px] tracking-[0.18em] text-dim">
              CLAIM {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <p className="font-display italic text-lg md:text-xl leading-snug mt-2">
            &ldquo;{text}&rdquo;
          </p>
        </div>
        <span className="stamp shrink-0" style={{ color: v.color }}>
          {v.label}
        </span>
      </div>

      {typeof confidence === "number" && (
        <div className="mb-4">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-dim mb-1.5">
            <span>Confidence</span>
            <span style={{ color: v.color }}>{confidence}%</span>
          </div>
          <span className="block h-1 w-full rounded-full bg-paper-3 overflow-hidden">
            <span
              className="block h-full rounded-full"
              style={{ width: `${confidence}%`, background: v.color }}
            />
          </span>
        </div>
      )}

      {explanation && (
        <p className="text-sm leading-relaxed text-dim">{explanation}</p>
      )}

      {sources?.length ? (
        <div className="mt-5 pt-4 border-t border-line-soft">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim mb-2.5">
            {sources.length} source{sources.length > 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {sources.map((s, i) => (
              <a
                key={s.url || i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 max-w-full text-xs font-mono px-2.5 py-1.5 rounded-full border border-line text-dim hover:border-accent hover:text-accent transition-colors"
              >
                <span className="truncate">{s.title || safeHostname(s.url)}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
