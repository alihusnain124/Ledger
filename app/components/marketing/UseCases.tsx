import SectionHead from "./SectionHead";

const CASES = [
  {
    who: "Reporters on deadline",
    body: "Turn an hour of on-record video into a list of checkable statements with sources attached, before the first draft.",
  },
  {
    who: "Students and researchers",
    body: "Get the transcript and the claim list from a lecture or conference talk in one pass, then follow the citations yourself.",
  },
  {
    who: "Debate and policy prep",
    body: "Know which numbers in the other side's clip hold up, which don't, and which the record genuinely can't settle.",
  },
  {
    who: "Anyone sent a clip",
    body: "That one confident three-minute video in the group chat. Paste it, read what was actually said, decide for yourself.",
  },
  {
    who: "Podcast listeners",
    body: "Long-form conversation is where unchecked claims live. Pull the checkable ones out without re-listening at 2×.",
  },
  {
    who: "Community moderators",
    body: "Assess a source before it spreads, with a transcript you can quote and links you can point people to.",
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="scroll-mt-20 border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <SectionHead
          eyebrow="Who it's for"
          title="For anyone who'd rather read the record than the rumour."
          lead="Ledger doesn't care whether a clip is friendly or hostile to your side. It reads what was said and checks what can be checked."
        />

        <div className="mt-16 grid gap-px bg-line border border-line rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <div
              key={c.who}
              className="bg-card p-8 transition-colors hover:bg-paper-2"
            >
              <h3 className="font-display italic text-xl mb-3">{c.who}</h3>
              <p className="text-sm text-dim leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
