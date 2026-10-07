'use client';

import { useState, useEffect, useCallback, useRef, type ComponentType } from 'react';
import type { Project } from '@/types/project';
import type { PortfolioConfig } from '@/types/portfolio';
import { projects } from '@/data/projects';
import { resolveProjectIds } from '@/data/resolveProjectIds';
import { heroSearchDocuments } from '@/data/searchDocuments';
import {
  buildCaseOrder,
  caseAnchorId,
  findOtherProjectIds,
  resolveSearchDocuments,
} from '@/lib/caseOrder';
import { useSmoothScroll } from '@/lib/useSmoothScroll';
import { ProjectModal, PresentationOverlay } from './widgets';
import FloatingHeader from './portfolio/FloatingHeader';
import HeroSection from './portfolio/HeroSection';
import CareerSection from './portfolio/CareerSection';
import CaseEngineSection from './portfolio/CaseEngineSection';
import CaseContractViewerSection from './portfolio/CaseContractViewerSection';
import CaseLawSection from './portfolio/CaseLawSection';
import ContactSection from './portfolio/ContactSection';
import type { CaseSectionProps } from './portfolio/caseSectionTypes';

const caseSections: Record<string, ComponentType<CaseSectionProps>> = {
  'local-mobile-rag-gemma': CaseEngineSection,
  'easy-contract-viewer': CaseContractViewerSection,
  'law-info-engine': CaseLawSection,
};

interface PortfolioProps {
  config: PortfolioConfig;
}

const Portfolio = ({ config }: PortfolioProps) => {
  const {
    profile,
    copy,
    capabilities,
    featuredProjectIds,
    additionalProjectIds,
    cases,
    experienceItems,
  } = config;

  // State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const presentationTriggerRef = useRef<HTMLElement | null>(null);
  const featuredProjects = resolveProjectIds(
    featuredProjectIds,
    projects,
    `${copy.navBrandLabel} featured projects`
  );
  const additionalProjects = resolveProjectIds(
    additionalProjectIds,
    projects,
    `${copy.navBrandLabel} additional projects`
  );

  // Handlers
  const handleProjectClick = (project: Project) => {
    const preferredScreenIndex = project.cardPresentation?.thumbnailScreenIndex ?? 0;

    setSelectedProject(project);
    setIsAnimating(true);
    setCurrentScreenIndex(preferredScreenIndex);
    setIsPresentationMode(false);
  };
  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSelectedProject(null);
      setIsPresentationMode(false);
      presentationTriggerRef.current = null;
    }, 300);
  };

  const enterPresentationMode = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    presentationTriggerRef.current = e.currentTarget as HTMLElement;
    setIsPresentationMode(true);
  };

  const exitPresentationMode = () => {
    setIsPresentationMode(false);
    window.requestAnimationFrame(() => {
      const trigger = presentationTriggerRef.current;
      if (trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    });
  };

  const nextSlide = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedProject) {
        setCurrentScreenIndex((prev) =>
          Math.min(prev + 1, selectedProject.screens.length - 1)
        );
      }
    },
    [selectedProject]
  );

  const prevSlide = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentScreenIndex((prev) => Math.max(prev - 1, 0));
    },
    []
  );

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPresentationMode) exitPresentationMode();
        else closeModal();
      }
      if (isPresentationMode) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, nextSlide, prevSlide]);

  // Preload all screen images as soon as a project modal opens
  // so subsequent slide navigation hits browser cache (no fetch delay).
  useEffect(() => {
    if (!selectedProject) return;
    selectedProject.screens.forEach((screen) => {
      if (!screen.imagePath) return;
      const img = new window.Image();
      img.decoding = 'async';
      img.src = screen.imagePath;
    });
  }, [selectedProject]);

  // Lock background scroll while a modal/overlay is open
  useEffect(() => {
    if (!selectedProject) return;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const previousOverlayState = document.body.dataset.portfolioOverlay;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.dataset.portfolioOverlay = 'true';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (previousOverlayState) {
        document.body.dataset.portfolioOverlay = previousOverlayState;
      } else {
        delete document.body.dataset.portfolioOverlay;
      }
    };
  }, [selectedProject]);

  // Lenis smooth scroll (off under reduced motion); paused while the modal/overlay is open.
  useSmoothScroll(selectedProject !== null);

  const openProjectById = (projectId: string) => {
    const project = projects.find((candidate) => candidate.id === projectId);
    if (project) handleProjectClick(project);
  };

  const caseOrder = buildCaseOrder(
    featuredProjects.map((project) => project.id),
    additionalProjects.map((project) => project.id)
  );
  const otherProjectIds = findOtherProjectIds(caseOrder, featuredProjects.length, [
    ...experienceItems.flatMap((item) => item.relatedProjectIds),
    ...cases.flatMap((item) => item.relatedProjectIds ?? []),
  ]);
  const heroDocuments = resolveSearchDocuments(heroSearchDocuments, featuredProjectIds);
  const firstCaseHref = `#${caseAnchorId(1)}`;

  return (
    <>
      <div
        inert={selectedProject ? true : undefined}
        aria-hidden={selectedProject ? true : undefined}
        className="min-h-screen bg-ground font-sans text-ink outline-none"
      >
        <FloatingHeader
          brandLabel={copy.navBrandLabel}
          firstCaseHref={firstCaseHref}
          hasExperience={experienceItems.length > 0}
          resumeUrl={profile.resumeUrl}
          heroHeaderId="hero-header"
        />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <HeroSection
            profile={profile}
            copy={copy}
            capabilities={capabilities}
            searchDocuments={heroDocuments}
            firstCaseHref={firstCaseHref}
            hasExperience={experienceItems.length > 0}
            onOpenProject={openProjectById}
          />

          <CareerSection
            items={experienceItems}
            copy={copy}
            resumeUrl={profile.resumeUrl}
            caseOrder={caseOrder}
            featuredCount={featuredProjects.length}
            projects={projects}
            otherProjectIds={otherProjectIds}
            onOpenProject={openProjectById}
          />

          {featuredProjects.map((project, index) => {
            const Section = caseSections[project.id];
            const recruitmentCase = cases.find((item) => item.projectId === project.id);
            if (!Section || !recruitmentCase) {
              throw new Error(`Missing case section or case data for "${project.id}"`);
            }
            return (
              <Section
                key={project.id}
                anchorId={caseAnchorId(index + 1)}
                caseNumber={index + 1}
                project={project}
                recruitmentCase={recruitmentCase}
                caseOrder={caseOrder}
                featuredCount={featuredProjects.length}
                projects={projects}
                onOpenProject={openProjectById}
              />
            );
          })}

          <ContactSection profile={profile} copy={copy} />
        </main>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          recruitmentCase={cases.find(
            (item) => item.projectId === selectedProject.id
          )}
          isAnimating={isAnimating}
          isPresentationMode={isPresentationMode}
          currentScreenIndex={currentScreenIndex}
          onClose={closeModal}
          onEnterPresentation={enterPresentationMode}
          onSelectScreen={setCurrentScreenIndex}
        />
      )}

      {/* Presentation Mode Overlay */}
      {selectedProject && isPresentationMode && (
        <PresentationOverlay
          project={selectedProject}
          currentScreenIndex={currentScreenIndex}
          onExit={exitPresentationMode}
          onPrevSlide={prevSlide}
          onNextSlide={nextSlide}
        />
      )}
    </>
  );
};

export default Portfolio;
