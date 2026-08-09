export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        transform="rotate(-7 12 12)"
        stroke="var(--color-ribbon-2)"
        strokeWidth="2.1"
      />
      <path
        d="M7.3 12.3l3.1 3.1L16.8 8.8"
        stroke="var(--color-ribbon-2)"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
