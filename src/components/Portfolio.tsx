'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { projects } from '@/data/projects';
import {
  ConversionHero,
  FeaturedWork,
  ProjectGrid,
  ProjectModal,
  PresentationOverlay,
  Footer,
  OpenSourceBanner,
} from './widgets';
import {
  additionalProjectIds,
  featuredProjectIds,
  portfolioCopy,
} from '@/data/portfolio';

const Portfolio = () => {
  // State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const featuredProjects = featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project));
  const additionalProjects = additionalProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project));

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
    }, 300);
  };

  const enterPresentationMode = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsPresentationMode(true);
  };

  const exitPresentationMode = () => {
    setIsPresentationMode(false);
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

  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        inert={selectedProject ? true : undefined}
        aria-hidden={selectedProject ? true : undefined}
        className="min-h-screen bg-[#faf7f2] text-[#1f1b16] font-sans outline-none"
      >
        <ConversionHero />

        {/* Featured Work */}
        <FeaturedWork
          projects={featuredProjects}
          onProjectClick={handleProjectClick}
        />

        <OpenSourceBanner />

        <ProjectGrid
          projects={additionalProjects}
          onProjectClick={handleProjectClick}
          heading={portfolioCopy.additionalHeading}
          description={portfolioCopy.additionalDescription}
        />

        {/* Footer */}
        <Footer />
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isAnimating={isAnimating}
          isPresentationMode={isPresentationMode}
          currentScreenIndex={currentScreenIndex}
          onClose={closeModal}
          onEnterPresentation={enterPresentationMode}
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
