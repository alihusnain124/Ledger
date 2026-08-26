import SectionHead from "./SectionHead";

const FAQ = [
  {
    q: "What kind of links work?",
    a: "Anything with a spoken track and a public URL — conference talks, interviews, news clips, podcast episodes, lecture recordings. If the audio can be pulled from the page, Ledger can read it.",
  },
  {
    q: "How long does a check take?",
    a: "Usually a minute or two for a typical clip: downloading the audio, transcribing it, then checking each claim. The analysis runs as a single request, so the tab needs to stay open until it finishes.",
  },
  {
    q: "What happens to the audio afterward?",
    a: "It's deleted from the server the moment the check finishes. Nothing is stored, there's no account, and there's no history of what you checked.",
  },
  {
    q: "Why do some claims come back unverified?",
    a: "Because the evidence didn't settle them. When sources are thin, mixed, or missing, Ledger is deliberately biased toward saying so rather than manufacturing a confident answer. Unverified is a real result.",
  },
  {
    q: "Does it check opinions or predictions?",
    a: "No. Only statements that are checkable in principle — figures, dates, events, attributions, history. \"This will be a catastrophe\" and \"this is the best album of the decade\" are left alone.",
  },
  {
    q: "Where does the evidence come from?",
    a: "From a live web search run per claim, when a search key is configured. Each verdict then cites the sources it leaned on. Without search grounding, Ledger falls back to the model's own knowledge and is instructed to answer unverified when unsure.",
  },
  {
    q: "How accurate is it?",
    a: "Good enough to be a strong first pass, not good enough to be the last word. Transcription can mishear names and numbers, and search evidence can be incomplete. That's exactly why the transcript and the sources are shown — so you can check the checker.",
  },
  {
    q: "Can I check something in another language?",
    a: "Transcription handles many languages, and claims are extracted from whatever the transcript says. Evidence quality is strongest where good sources exist in English or the video's own language.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-paper-2">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <SectionHead
          eyebrow="FAQ"
          title="Questions worth answering up front."
          lead="The things people ask before they trust a fact-checking tool — answered plainly."
        />

        <div className="mt-14 flex flex-col divide-y divide-line border-y border-line">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none font-bold text-lg leading-snug">
                {item.q}
                <span
                  className="font-mono text-accent text-xl shrink-0 leading-none mt-0.5 transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-[0.95rem] text-dim leading-relaxed max-w-2xl">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
