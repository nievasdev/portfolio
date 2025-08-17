// Type definitions for portfolio data

export interface Technology {
  name: string;
  logo: string;
}

export interface Work {
  name: string;
  time: string;
  logo: string;
  text: string;
  largeText: string[];    // Detailed company descriptions
  workMethod: string;     // Work coordination method
  projects: WorkProject[]; // Array of specific projects
  technologies: Technology[];
}

export interface WorkProject {
  title: string;
  text: string;
}

export interface Project {
  name: string;
  time: string;
  logo: string;
  text: string;
  largeText?: string[];
  github: string;
  technologies: Technology[];
}

// Blog interface removed - functionality not implemented

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'flat' | 'ghost' | 'bordered';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  size?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  href?: string;
  disabled?: boolean;
  isIconOnly?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  [key: string]: any;
}

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showArrow?: boolean;
  classNames?: {
    base?: string;
    content?: string;
  };
}

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  classNames?: {
    base?: string;
    header?: string;
    body?: string;
    footer?: string;
  };
}

export interface UseModalReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onToggle: () => void;
}