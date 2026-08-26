import SectionHead from "./SectionHead";

const CALLOUTS = [
  {
    k: "The claim, verbatim",
    v: "Lifted from the transcript word for word, so you can find it in the recording yourself.",
  },
  {
    k: "The stamp",
    v: "True, False, or Unverified. Nothing softer, nothing in between.",
  },
  {
    k: "The confidence",
    v: "How firmly the evidence supports the stamp, stated as a number instead of a tone of voice.",
  },
  {
    k: "The reasoning",
    v: "What the evidence actually said, in plain language — including where it disagreed with itself.",
  },
  {
    k: "The sources",
    v: "Every result the verdict leaned on, linked. If a verdict has no sources, you can see that too.",
  },
];

export default function Anatomy() {
  return (
    <section className="scroll-mt-20 border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <SectionHead
          eyebrow="Anatomy of a verdict"
          title="Every claim comes back with its receipts attached."
          lead="This is the shape of what you get back — one card per checkable statement, built so you can disagree with it on the evidence."
        />

        <div className="mt-16 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Illustrative card — not a live result */}
          <div className="relative">
            <span className="absolute -top-3 left-6 z-10 font-mono text-[10px] uppercase tracking-[0.18em] bg-accent text-paper px-2.5 py-1 rounded-full">
              Illustration
            </span>
            <article
              className="rounded-2xl bg-card p-7 md:p-8 border border-line"
              style={{ borderLeft: "3px solid var(--true)" }}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-dim">
                    CLAIM 03
                  </span>
                  <p className="font-display italic text-xl leading-snug mt-2">
                    &ldquo;The programme cut emissions twelve percent in its first
                    year.&rdquo;
                  </p>
                </div>
                <span className="stamp shrink-0" style={{ color: "var(--true)" }}>
                  True
                </span>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-dim mb-1.5">
                  <span>Confidence</span>
                  <span style={{ color: "var(--true)" }}>84%</span>
                </div>
                <span className="block h-1 w-full rounded-full bg-paper-3 overflow-hidden">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: "84%", background: "var(--true)" }}
                  />
                </span>
              </div>

              <p className="text-sm leading-relaxed text-dim">
                Two independent reports put the first-year reduction between eleven
                and thirteen percent, so the figure as stated sits inside the
                published range. A third source measured over a different baseline
                and is noted but not weighed.
              </p>

              <div className="mt-6 pt-5 border-t border-line-soft">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim mb-2.5">
                  3 sources
                </p>
                <div className="flex flex-wrap gap-2">
                  {["annual-report.example", "statistics-office.example", "review.example"].map(
                    (s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-full border border-line text-dim"
                      >
                        {s}
                        <span aria-hidden="true">↗</span>
                      </span>
                    ),
                  )}
                </div>
              </div>
            </article>
            <p className="mt-4 text-xs text-dim leading-relaxed">
              Example card with placeholder text — it shows the layout, not a real
              fact-check.
            </p>
          </div>

          <dl className="flex flex-col divide-y divide-line border-y border-line">
            {CALLOUTS.map((c) => (
              <div key={c.k} className="py-5 grid sm:grid-cols-[10.5rem_1fr] gap-2 sm:gap-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent pt-1">
                  {c.k}
                </dt>
                <dd className="text-sm text-dim leading-relaxed">{c.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
