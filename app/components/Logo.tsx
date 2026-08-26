/**
 * Ledger mark: a ruled ledger page with a verification seal pressed onto the
 * corner. Page fill uses the body color and the rules use the page color, so
 * the mark stays legible in both light and dark.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="3" width="23" height="26" rx="5.5" fill="var(--body)" />
      <path
        d="M9.5 10.5h9M9.5 15.5h11M9.5 20.5h6"
        stroke="var(--paper)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle
        cx="23"
        cy="22.5"
        r="7"
        fill="var(--accent)"
        stroke="var(--paper)"
        strokeWidth="2.4"
      />
      <path
        d="M20.2 22.6l2 2 3.7-4.4"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Logo className="w-7 h-7 shrink-0" />
      <span className="font-display italic text-xl tracking-tight leading-none">
        Ledger
      </span>
    </span>
  );
}
