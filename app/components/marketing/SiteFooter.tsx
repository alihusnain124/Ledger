import Logo from "../Logo";

const LINKS = [
  {
    heading: "The tool",
    items: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Three verdicts", href: "#verdicts" },
      { label: "Why Ledger", href: "#why-ledger" },
      { label: "Check a link", href: "#check" },
    ],
  },
  {
    heading: "Straight answers",
    items: [
      { label: "Who it's for", href: "#use-cases" },
      { label: "Honest limits", href: "#limits" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-2">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <span className="flex items-center gap-2.5">
              <Logo className="w-7 h-7 shrink-0" />
              <span className="font-display italic text-xl tracking-tight">Ledger</span>
            </span>
            <p className="mt-5 text-sm text-dim leading-relaxed">
              Paste a video link. Read what was actually said. See which claims
              survive contact with the record — and which ones the record can&apos;t
              settle.
            </p>
          </div>

          {LINKS.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim mb-5">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.items.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="ulink text-sm hover:text-accent">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
            Built for people tired of taking someone&apos;s word for it.
          </p>
          <p className="text-xs text-dim/80 max-w-md sm:text-right leading-relaxed">
            Verdicts are automated and can be wrong. Read the transcript and open
            the sources before you repeat anything.
          </p>
        </div>
      </div>
    </footer>
  );
}
