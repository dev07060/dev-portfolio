'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { projects } from '@/data/projects';
import {
  ProfileHeader,
  ProjectGrid,
  ProjectModal,
  PresentationOverlay,
  Footer,
  OpenSourceBanner,
} from './widgets';

const Portfolio = () => {
  // State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  // Handlers
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsAnimating(true);
    setCurrentScreenIndex(0);
    setIsPresentationMode(false);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSelectedProject(null);
      setIsPresentationMode(false);
    }, 300);
  };

  const enterPresentationMode = (e: React.MouseEvent) => {
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

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1b16] font-sans">
      {/* Header / Profile Section */}
      <ProfileHeader />

      {/* Open Source Packages Banner */}
      <OpenSourceBanner />

      {/* Project Grid Section */}
      <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />

      {/* Footer */}
      <Footer />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isAnimating={isAnimating}
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
    </div>
  );
};

export default Portfolio;
