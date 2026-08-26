export default function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className="font-display font-semibold text-[2.1rem] md:text-[2.75rem] leading-[1.1] tracking-tight">
        {title}
      </h2>
      {lead && (
        <p className="mt-5 text-dim leading-relaxed text-[1.05rem]">{lead}</p>
      )}
    </div>
  );
}
