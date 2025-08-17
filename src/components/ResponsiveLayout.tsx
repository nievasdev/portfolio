'use client';

import { useState } from 'react';
import MobileNavigation from '@/components/ui/MobileNavigation';
import MeSectionCompact from '@/components/MeSectionCompact';
import WorksColumn from '@/components/WorksColumn';
import ProjectsColumn from '@/components/ProjectsColumn';
import WorkPreview from '@/components/WorkPreview';
import timeCalculator from '@/components/timeCalculator';

import type { Work, Project } from '@/types';

interface ResponsiveLayoutProps {
  works: Work[];
  projects: Project[];
}

export default function ResponsiveLayout({ works, projects }: ResponsiveLayoutProps) {
  const [activeSection, setActiveSection] = useState<'about' | 'works' | 'projects'>('about');
  const [hoveredWork, setHoveredWork] = useState<Work | null>(null);
  const timeDifference = timeCalculator();

  const handleSectionChange = (section: 'about' | 'works' | 'projects') => {
    setActiveSection(section);
  };

  const handleWorkHover = (work: Work | null) => {
    setHoveredWork(work);
  };

  return (
    <>
      {/* Mobile/Tablet Navigation */}
      <MobileNavigation onSectionChange={handleSectionChange} activeSection={activeSection} />

      {/* 3 Column Grid Layout */}
      <div className="home-grid">
        {/* Left Column - Works */}
        <div className={`column column-fixed ${activeSection === 'works' ? 'active' : ''}`} id="works">
          <div className="column-header">
            <h2 className="text-4xl font-bold text-white mb-6">Works</h2>
          </div>
          <div className="column-content">
            <WorksColumn worksData={works} onWorkHover={handleWorkHover} />
          </div>
        </div>

        {/* Center Column - ME */}
        <div className={`column center-column ${activeSection === 'about' ? 'active' : ''}`} id="about">
          <div className="column-content">
            {/* ME Section */}
            <div className="rounded-lg p-1">
              <div className="mb-4 text-center">
                <h1 className="main-title font-bold text-white mb-2">Mauro Nievas</h1>
                {/* Title */}
                <p className="text-responsive text-center text-spacial-4-90 font-medium">
                    {timeDifference !== null && `Full Stack Developer +${timeDifference.years} years`}
                </p>
              </div>
              <MeSectionCompact />
            </div>
            
            {/* Work Preview Section - Only on desktop and when hovering */}
            <div>
              <WorkPreview work={hoveredWork} />
            </div>
          </div>
        </div>

        {/* Right Column - Projects */}
        <div className={`column column-fixed ${activeSection === 'projects' ? 'active' : ''}`} id="projects">
          <div className="column-header">
            <h2 className="text-4xl font-bold text-white mb-6">Projects</h2>
          </div>
          <div className="column-content">
            <ProjectsColumn projectsData={projects} />
          </div>
        </div>
      </div>
    </>
  );
}