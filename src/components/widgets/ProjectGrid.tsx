'use client';

import {
  ArrowUpRight,
  Monitor,
  Package as PackageIcon,
  Smartphone,
  Tablet,
  type LucideIcon,
} from 'lucide-react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { LocaleText, useLocale, ui } from '@/i18n';
import { Audience, audienceContent } from '@/data/conversion';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  heading?: LocaleText;
  description?: LocaleText;
  audience?: Audience;
}

const audienceDisplayOptions = [
  {
    mode: 'client',
    label: { en: 'Client list', ko: 'Client list' },
  },
  {
    mode: 'developer',
    label: { en: 'Developer cards', ko: 'Developer cards' },
  },
] as const satisfies readonly { mode: Audience; label: LocaleText }[];

const projectTypeMeta = {
  web: {
    label: { en: 'Web', ko: 'Web' },
    Icon: Monitor,
  },
  mobile: {
    label: { en: 'App', ko: 'App' },
    Icon: Smartphone,
  },
  tablet: {
    label: { en: 'Tablet', ko: 'Tablet' },
    Icon: Tablet,
  },
  package: {
    label: { en: 'Package', ko: 'Package' },
    Icon: PackageIcon,
  },
} satisfies Record<Project['type'], { label: LocaleText; Icon: LucideIcon }>;

const getProjectSummary = (project: Project): LocaleText =>
  project.audienceOverrides?.client?.highlight ??
  project.implementationPoints?.[0] ??
  project.subtitle;

const ProjectGrid = ({
  projects,
  onProjectClick,
  heading,
  description,
  audience = 'client',
}: ProjectGridProps) => {
  const { t } = useLocale();
  const sectionHeading = heading ? t(heading) : t(ui.selectedWork);

  return (
    <section id="all-work" className="max-w-7xl mx-auto px-5 sm:px-6 pb-16 sm:pb-20 relative z-20 scroll-mt-8">
      <div className="mb-5 sm:mb-7 pb-5 sm:pb-6 border-b border-[#e8dfd0] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#1f1b16] tracking-tight">
            {sectionHeading}
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#4a4339] leading-relaxed break-keep">
              {t(description)}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <AudienceDisplaySwitcher audience={audience} />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#8a7f70] shrink-0">
            {String(projects.length).padStart(2, '0')} {t(ui.projectsSuffix)}
          </span>
        </div>
      </div>

      {audience === 'client' ? (
        <ClientProjectList projects={projects} onProjectClick={onProjectClick} />
      ) : (
        <DeveloperProjectGrid
          projects={projects}
          audience={audience}
          onProjectClick={onProjectClick}
        />
      )}
    </section>
  );
};

const AudienceDisplaySwitcher = ({ audience }: { audience: Audience }) => {
  const { t } = useLocale();

  return (
    <nav
      aria-label="All Work display"
      className="inline-flex rounded-md border border-[#d9e4e1] bg-white/80 p-1 shadow-[0_10px_26px_-24px_rgba(31,27,22,0.35)]"
    >
      {audienceDisplayOptions.map(({ mode, label }) => (
        <a
          key={mode}
          href={audienceContent[mode].href}
          aria-current={audience === mode ? 'page' : undefined}
          className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            audience === mode
              ? 'bg-[#1f1b16] text-[#faf7f2]'
              : 'text-[#4a4339] hover:text-[#0f766e]'
          }`}
        >
          {t(label)}
        </a>
      ))}
    </nav>
  );
};

const ClientProjectList = ({
  projects,
  onProjectClick,
}: {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}) => {
  const { t } = useLocale();

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {projects.map((project) => {
        const type = projectTypeMeta[project.type];
        const Icon = type.Icon;
        const title = t(project.title).replace(/\s+/g, ' ');
        const summary = t(getProjectSummary(project));

        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onProjectClick(project)}
            aria-label={`Open ${title} project details`}
            className="group grid min-h-[72px] w-full grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[#e8dfd0] bg-white/80 px-3 py-2.5 text-left shadow-[0_10px_24px_-22px_rgba(31,27,22,0.35)] transition-colors hover:border-[#d8c9b6] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2] sm:min-h-[84px] sm:grid-cols-[112px_minmax(150px,0.9fr)_minmax(220px,1.3fr)_minmax(160px,0.7fr)_auto] sm:gap-4 sm:px-4 sm:py-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#d9e4e1] bg-white text-[#0f766e] sm:h-auto sm:w-auto sm:justify-start sm:gap-2 sm:border-0 sm:bg-transparent sm:text-[#4a4339]">
              <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
              <span className="hidden font-mono text-xs uppercase tracking-[0.14em] sm:inline">
                {t(type.label)}
              </span>
            </span>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="truncate text-sm font-semibold leading-snug text-[#1f1b16] group-hover:text-[#0f766e] sm:text-base">
                  {title}
                </h3>
                <span className="shrink-0 rounded border border-[#d9e4e1] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#8a7f70] sm:hidden">
                  {t(type.label)}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs leading-snug text-[#4a4339] sm:hidden">
                {summary}
              </p>
              <div className="mt-1 flex min-w-0 flex-wrap gap-1 sm:hidden">
                {project.techStack.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-[#e8dfd0] bg-[#f2ede4] px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#4a4339]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <p className="hidden min-w-0 text-sm leading-snug text-[#4a4339] sm:line-clamp-1 sm:block">
              {summary}
            </p>

            <div className="hidden min-w-0 flex-wrap gap-1.5 sm:flex">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-[#e8dfd0] bg-[#f2ede4] px-2 py-1 text-xs font-medium leading-none text-[#4a4339]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 rounded border border-[#d9e4e1] bg-white px-2 py-1.5 text-xs font-semibold text-[#1f1b16] transition-colors group-hover:border-[#0f766e] group-hover:text-[#0f766e]">
              <span className="hidden sm:inline">Details</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
          </button>
        );
      })}
    </div>
  );
};

const DeveloperProjectGrid = ({
  projects,
  audience,
  onProjectClick,
}: {
  projects: Project[];
  audience: Audience;
  onProjectClick: (project: Project) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {projects.map((project, idx) => (
      <ProjectCard
        key={project.id}
        project={project}
        audience={audience}
        index={idx}
        onClick={onProjectClick}
      />
    ))}
  </div>
);

export default ProjectGrid;
