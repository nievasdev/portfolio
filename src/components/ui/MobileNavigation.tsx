'use client';

interface MobileNavigationProps {
  onSectionChange: (section: 'about' | 'works' | 'projects') => void;
  activeSection: string;
}

export default function MobileNavigation({ onSectionChange, activeSection }: MobileNavigationProps) {
  return (
    <div className="mobile-navigation mobile-tablet-only">
      <div className="nav-container">
        <button
          onClick={() => onSectionChange('about')}
          className={`nav-button ${activeSection === 'about' ? 'active' : ''}`}
        >
          About
        </button>
        <button
          onClick={() => onSectionChange('works')}
          className={`nav-button ${activeSection === 'works' ? 'active' : ''}`}
        >
          Works
        </button>
        <button
          onClick={() => onSectionChange('projects')}
          className={`nav-button ${activeSection === 'projects' ? 'active' : ''}`}
        >
          Projects
        </button>
      </div>
    </div>
  );
}