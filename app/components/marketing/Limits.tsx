const LIMITS = [
  {
    title: "It isn't a court ruling",
    body: "Treat a verdict as a strong starting point with its sources attached — the kind of lead a researcher would chase, not the end of the argument.",
  },
  {
    title: "It won't grade opinions",
    body: "\"This policy is a disaster\" isn't checkable. Predictions, values, and rhetoric are skipped rather than scored.",
  },
  {
    title: "Long videos hit a ceiling",
    body: "Audio is capped before transcription — roughly 20–30 minutes of speech. Longer clips need to be trimmed first.",
  },
  {
    title: "Context can still mislead",
    body: "A claim can be literally true and still be framed to deceive. Ledger checks the sentence; reading the room is still your job.",
  },
];

export default function Limits() {
  return (
    <section id="limits" className="scroll-mt-20 border-t border-line-soft bg-ink text-on-ink relative overflow-hidden">
      <div className="absolute inset-0 hairline-grid opacity-30" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20">
          <div>
            <p className="eyebrow mb-5 text-accent-2">Honest limits</p>
            <h2 className="font-display font-semibold text-[2.1rem] md:text-[2.75rem] leading-[1.1] tracking-tight">
              What Ledger will not do for you.
            </h2>
            <p className="mt-5 text-on-ink-dim leading-relaxed text-[1.05rem]">
              A tool that oversells itself is the same problem it claims to solve.
              So here is the honest edge of what this does.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-9">
            {LIMITS.map((l) => (
              <div key={l.title}>
                <span className="font-mono text-accent-2 text-sm" aria-hidden="true">
                  —
                </span>
                <h3 className="font-bold text-lg mt-2 mb-2">{l.title}</h3>
                <p className="text-sm text-on-ink-dim leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
