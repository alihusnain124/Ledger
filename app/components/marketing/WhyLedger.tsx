import SectionHead from "./SectionHead";

const FEATURES = [
  {
    title: "A link is enough",
    body: "Paste a URL and you're done. No downloading, no converting, no uploading a file you had to make first.",
  },
  {
    title: "The whole transcript, in order",
    body: "You get every word that was said, not a summary someone else chose for you. Verdicts sit on top of it, never in place of it.",
  },
  {
    title: "Evidence you can open",
    body: "Where search grounding is available, each verdict carries links. You can check the checker in one click.",
  },
  {
    title: "Doubt is preserved",
    body: "Thin or conflicting evidence gets stamped unverified. Confidence is reported as a number, not implied by a confident tone.",
  },
  {
    title: "Opinion is left alone",
    body: "Predictions, values, and taste aren't fact-checked. Only statements that could in principle be shown right or wrong get a stamp.",
  },
  {
    title: "Nothing is kept",
    body: "The audio is deleted the moment the check finishes. There's no account, no history, no library of what you looked at.",
  },
];

export default function WhyLedger() {
  return (
    <section id="why-ledger" className="scroll-mt-20 border-t border-line bg-paper-2">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <SectionHead
          eyebrow="Why Ledger"
          title={
            <>
              Built to show its work,{" "}
              <span className="gradient-text">not just its opinion.</span>
            </>
          }
          lead="Plenty of tools will tell you a video is misleading. Ledger is built so you never have to take that on faith either."
        />

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="relative pl-14">
              <span
                className="absolute left-0 top-0 w-10 h-10 rounded-xl border border-line bg-card grid place-items-center font-mono text-xs text-accent"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-bold text-lg mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm text-dim leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
