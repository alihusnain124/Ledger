export default function CtaBand() {
  return (
    <section className="border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-card px-8 py-16 md:px-16 md:py-20 text-center">
          <div className="absolute inset-0 hairline-grid opacity-60" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow mb-6 justify-center">Open a file</p>
            <h2 className="font-display font-bold text-[2.2rem] md:text-5xl leading-[1.08] tracking-tight max-w-2xl mx-auto">
              Somebody said something{" "}
              <span className="gradient-text">confident</span> today.
            </h2>
            <p className="mt-6 text-dim leading-relaxed max-w-md mx-auto">
              Find out whether the record agrees. One link, no account, nothing
              kept afterward.
            </p>
            <a
              href="#check"
              className="btn inline-flex items-center gap-2 mt-10 bg-btn text-btn-fg font-mono text-xs uppercase tracking-[0.16em] font-semibold px-8 py-4 rounded-full"
            >
              Check a link
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
