import type { Verdict } from "@/lib/types";

const VERDICTS: Record<Verdict["verdict"], { label: string; color: string }> = {
  true: { label: "True", color: "var(--color-true)" },
  false: { label: "False", color: "var(--color-false)" },
  unverified: { label: "Unverified", color: "var(--color-unverified)" },
};

export default function ClaimCard({
  text,
  verdict,
  confidence,
  explanation,
  sources,
}: Verdict) {
  const v = VERDICTS[verdict] || VERDICTS.unverified;

  return (
    <article className="group rounded-2xl bg-card text-text-paper p-6 md:p-7 border border-paper-line transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="font-display italic text-lg md:text-xl leading-snug">
          &ldquo;{text}&rdquo;
        </p>
        <span className="stamp shrink-0" style={{ color: v.color }}>
          {v.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-mono uppercase tracking-wider text-text-paper-dim mb-3">
        {typeof confidence === "number" && (
          <span className="inline-flex items-center gap-2">
            confidence {confidence}%
            <span
              className="inline-block h-1 w-12 rounded-full bg-paper-line overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-full"
                style={{ width: `${confidence}%`, background: v.color }}
              />
            </span>
          </span>
        )}
        {sources?.length ? (
          <span>
            · {sources.length} source{sources.length > 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      {explanation && (
        <p className="text-sm leading-relaxed text-text-paper-dim">
          {explanation}
        </p>
      )}

      {sources?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {sources.map((s, i) => (
            <a
              key={s.url || i}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full border border-paper-line text-text-paper-dim hover:border-ribbon-2 hover:text-ribbon-2 transition-colors"
            >
              {s.title || safeHostname(s.url)}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
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
