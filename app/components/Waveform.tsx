export default function Waveform({ active }: { active: boolean }) {
  return (
    <div className={`waveform ${active ? "is-active" : ""}`} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
