import SectionHead from "./SectionHead";

const CARDS = [
  {
    label: "True",
    color: "var(--true)",
    line: "The evidence backs it.",
    body: "Sources agree with the claim as it was actually stated — not with a friendlier version of it.",
    note: "Wording matters. A rounded-up number is checked as the number that was said.",
  },
  {
    label: "False",
    color: "var(--false)",
    line: "The evidence contradicts it.",
    body: "Something checkable is wrong: a figure, a date, an attribution, an event that went the other way.",
    note: "The explanation says what the record shows instead, so you can take it further.",
  },
  {
    label: "Unverified",
    color: "var(--unverified)",
    line: "The evidence won't settle it.",
    body: "Sources are thin, mixed, or absent. Ledger says so rather than dressing up a guess as a finding.",
    note: "This is a real verdict, not a failure. Most honest fact-checks land here more often than people expect.",
  },
];

export default function Verdicts() {
  return (
    <section id="verdicts" className="scroll-mt-20 border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <SectionHead
          eyebrow="Three verdicts"
          title="Only three stamps — and one of them admits doubt."
          lead="A fact-checker that always has an answer isn't a fact-checker. Ledger keeps a third stamp for the claims the record genuinely doesn't settle."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className="lift rounded-2xl border border-line bg-card p-8"
              style={{ borderTop: `3px solid ${c.color}` }}
            >
              <span className="stamp" style={{ color: c.color }}>
                {c.label}
              </span>
              <p className="font-display italic text-xl mt-6 mb-3" style={{ color: c.color }}>
                {c.line}
              </p>
              <p className="text-sm text-dim leading-relaxed">{c.body}</p>
              <p className="mt-5 pt-5 border-t border-line-soft text-sm text-dim leading-relaxed">
                {c.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
