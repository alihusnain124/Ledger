import SectionHead from "./SectionHead";

const STEPS = [
  {
    n: "01",
    title: "You paste a link",
    body: "A talk, a clip, an interview, a podcast episode — anything with a spoken track and a public URL.",
    detail: "No sign-up, no upload, no file wrangling.",
  },
  {
    n: "02",
    title: "The audio comes down",
    body: "Ledger pulls just the audio track and compresses it to a size a transcription model will accept.",
    detail: "Video is never stored — only the audio, and only until the check ends.",
  },
  {
    n: "03",
    title: "It gets transcribed",
    body: "The audio is transcribed word for word by Whisper. You see the real transcript, not a summary of one.",
    detail: "Read it yourself before you read any verdict.",
  },
  {
    n: "04",
    title: "Claims are pulled and checked",
    body: "Checkable statements are separated from opinion, then each one is weighed against live search evidence.",
    detail: "Every verdict comes back with its reasoning and its sources.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line bg-paper-2">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <SectionHead
          eyebrow="How it works"
          title={
            <>
              Four steps between a link and{" "}
              <span className="gradient-text">a straight answer.</span>
            </>
          }
          lead="Nothing here is a black box. Each stage hands you something you can inspect — the audio it found, the words it heard, the claims it isolated, the evidence it weighed."
        />

        <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="lift relative rounded-2xl border border-line bg-card p-7 flex flex-col"
            >
              <span
                className="font-display text-5xl leading-none text-accent/25 select-none"
                aria-hidden="true"
              >
                {s.n}
              </span>
              <h3 className="font-bold text-lg mt-5 mb-2.5">{s.title}</h3>
              <p className="text-sm text-dim leading-relaxed mb-5">{s.body}</p>
              <p className="mt-auto pt-5 text-xs font-mono text-dim leading-relaxed border-t border-line-soft">
                {s.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
