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
        setCurrentScreenIndex(
          (prev) => (prev + 1) % selectedProject.screens.length
        );
      }
    },
    [selectedProject]
  );

  const prevSlide = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedProject) {
        setCurrentScreenIndex(
          (prev) =>
            (prev - 1 + selectedProject.screens.length) %
            selectedProject.screens.length
        );
      }
    },
    [selectedProject]
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans">
      {/* Header / Profile Section */}
      <ProfileHeader />

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
