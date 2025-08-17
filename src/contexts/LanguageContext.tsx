'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.works': 'Works',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    
    // Theme toggle
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    
    // Language toggle
    'lang.english': 'English',
    'lang.spanish': 'Español',
    
    // About me section
    'about.description': 'Full‑Stack developer delivering mission‑critical software across telecom, cybersecurity, and SaaS. Deep JavaScript/TypeScript expertise with a strong focus on Node.js (APIs, microservices, performance) and React/Next.js on the frontend. Experienced with REST APIs, Jest‑based testing, Git, and CI/CD. Proactive, hands‑on, and relentless about performance and code quality.',
    'about.repos': 'Public Repos',
    'about.technologies': 'Technologies',
    'about.download': 'Download Resume',
    
    // Works section
    'works.viewDetails': 'View Details',
    'works.keyProjects': 'Key Projects',
    'works.technologiesUsed': 'Technologies Used',
    'works.roleSummary': 'Role Summary',
    'works.workMethod': 'Work Method',
    'works.previous': 'Previous',
    'works.next': 'Next',
    'works.visible': 'visible',
    'works.of': 'of',
    
    // Projects section
    'projects.viewDetails': 'View Details',
    'projects.github': 'GitHub',
    'projects.technologiesUsed': 'Technologies Used:',
    
    // Site config
    'site.title': 'Mauro Nievas - Portfolio',
    'site.description': 'Full Stack Developer Portfolio'
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.works': 'Trabajos',
    'nav.projects': 'Proyectos',
    'nav.about': 'Acerca de',
    
    // Theme toggle
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    
    // Language toggle
    'lang.english': 'English',
    'lang.spanish': 'Español',
    
    // About me section
    'about.description': 'Desarrollador Full‑Stack especializado en software crítico para telecomunicaciones, ciberseguridad y SaaS. Experiencia profunda en JavaScript/TypeScript con enfoque en Node.js (APIs, microservicios, rendimiento) y React/Next.js en el frontend. Experiencia con APIs REST, testing con Jest, Git y CI/CD. Proactivo, práctico y comprometido con el rendimiento y la calidad del código.',
    'about.repos': 'Repositorios Públicos',
    'about.technologies': 'Tecnologías',
    'about.download': 'Descargar CV',
    
    // Works section
    'works.viewDetails': 'Ver Detalles',
    'works.keyProjects': 'Proyectos Clave',
    'works.technologiesUsed': 'Tecnologías Utilizadas',
    'works.roleSummary': 'Resumen del Rol',
    'works.workMethod': 'Método de Trabajo',
    'works.previous': 'Anterior',
    'works.next': 'Siguiente',
    'works.visible': 'visibles',
    'works.of': 'de',
    
    // Projects section
    'projects.viewDetails': 'Ver Detalles',
    'projects.github': 'GitHub',
    'projects.technologiesUsed': 'Tecnologías Utilizadas:',
    
    // Site config
    'site.title': 'Mauro Nievas - Portafolio',
    'site.description': 'Portafolio de Desarrollador Full Stack'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check for saved language preference first
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    } else {
      // Auto-detect browser language
      const detectBrowserLanguage = (): Language => {
        // Check navigator.language first
        const primaryLanguage = navigator.language.toLowerCase();
        
        // Check navigator.languages array for more comprehensive detection
        const languages = navigator.languages?.map(lang => lang.toLowerCase()) || [primaryLanguage];
        
        // Spanish variants to detect
        const spanishVariants = [
          'es', 'es-es', 'es-mx', 'es-ar', 'es-co', 'es-pe', 'es-ve', 
          'es-cl', 'es-ec', 'es-gt', 'es-cu', 'es-bo', 'es-do', 
          'es-hn', 'es-py', 'es-sv', 'es-ni', 'es-cr', 'es-pa', 
          'es-uy', 'es-419'
        ];
        
        // Check if any language matches Spanish variants
        for (const lang of languages) {
          if (spanishVariants.some(variant => lang.startsWith(variant))) {
            return 'es';
          }
        }
        
        // Default to English
        return 'en';
      };

      const detectedLanguage = detectBrowserLanguage();
      setLanguageState(detectedLanguage);
      localStorage.setItem('language', detectedLanguage);
      
      console.log(`🌍 Auto-detected language: ${detectedLanguage} (from ${navigator.language})`);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}