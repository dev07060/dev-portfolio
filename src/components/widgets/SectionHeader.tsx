interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  count?: number;
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  count,
}: SectionHeaderProps) => (
  <header className="mb-6 flex flex-col gap-3 border-b border-[#e8dfd0] pb-5 sm:mb-8 sm:pb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
    <div className="min-w-0">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#0f766e] sm:text-[11px]">
        {eyebrow}
      </p>
      <h2 className="font-serif text-2xl font-light tracking-tight text-[#1f1b16] sm:text-3xl md:text-4xl">
        {title}
      </h2>
    </div>
    {(description || typeof count === 'number') && (
      <div className="flex max-w-2xl items-end justify-between gap-5 lg:justify-end">
        {description && (
          <p className="text-sm leading-relaxed text-[#4a4339] break-keep sm:text-base">
            {description}
          </p>
        )}
        {typeof count === 'number' && (
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.25em] text-[#756b60]">
            {String(count).padStart(2, '0')}
          </span>
        )}
      </div>
    )}
  </header>
);

export default SectionHeader;
