# Documentación Completa del Portfolio - Next.js 15

## Tabla de Contenidos

### Parte I: Arquitectura y Configuración
1. [Introducción al Proyecto](#1-introducción-al-proyecto)
2. [Arquitectura General](#2-arquitectura-general)
3. [Configuración del Proyecto](#3-configuración-del-proyecto)
4. [Sistema de Tipos](#4-sistema-de-tipos)

### Parte II: Estructura de Datos y Servicios
5. [Gestión de Datos](#5-gestión-de-datos)
6. [Servicios de Integración](#6-servicios-de-integración)
7. [Rutas API](#7-rutas-api)

### Parte III: Componentes y UI
8. [Sistema de Componentes UI](#8-sistema-de-componentes-ui)
9. [Componentes de Layout](#9-componentes-de-layout)
10. [Componentes de Contenido](#10-componentes-de-contenido)

### Parte IV: Estilos y Temas
11. [Sistema de Diseño](#11-sistema-de-diseño)
12. [Estilos CSS](#12-estilos-css)

### Parte V: Hooks y Proveedores
13. [Hooks Personalizados](#13-hooks-personalizados)
14. [Proveedores de Contexto](#14-proveedores-de-contexto)

### Parte VI: Análisis Línea por Línea
15. [Análisis Detallado del Código](#15-análisis-detallado-del-código)

---

## 1. Introducción al Proyecto

Este proyecto es un **portfolio personal desarrollado en Next.js 15**, migrado desde Astro, que presenta una arquitectura de **3 columnas** con diseño responsivo. El portfolio está diseñado para mostrar experiencia laboral, información personal y proyectos de manera elegante y profesional.

### Características Principales

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript con tipado estricto
- **Estilo**: Sistema de diseño personalizado inspirado en Nord/Polybar
- **Tema**: Oscuro por defecto con soporte para cambio de tema
- **Integración**: API de GitHub en tiempo real con sistema de fallback
- **Arquitectura**: Componentes modulares con biblioteca UI personalizada

### Estructura de 3 Columnas

- **Columna Izquierda**: Experiencia laboral (`WorksColumn`)
- **Columna Central**: Información personal (`MeSectionCompact`)
- **Columna Derecha**: Proyectos personales (`ProjectsColumn`)

---

## 2. Arquitectura General

### Patrón de Arquitectura

El proyecto sigue una **arquitectura de capas** con separación clara de responsabilidades:

```
├── Capa de Presentación (Components/UI)
├── Capa de Lógica de Negocio (Hooks/Services)
├── Capa de Datos (Lib/API Routes)
└── Capa de Configuración (Config/Types)
```

### Flujo de Datos

1. **Datos Estáticos**: Gestionados en `src/lib/data.ts` con funciones de acceso
2. **Datos Dinámicos**: Obtenidos vía API routes de GitHub
3. **Estado Local**: Manejado con hooks personalizados
4. **Tema**: Gestionado con `next-themes`

### Patrones de Diseño Implementados

- **Singleton**: Para servicios de autenticación de GitHub
- **Factory**: Para generación de datos de simulación
- **Observer**: Para manejo de temas
- **Proxy**: Para componentes polimórficos

---

## 3. Configuración del Proyecto

### package.json

```json
{
  "name": "newnextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@next/env": "^15.4.5",
    "@octokit/core": "^7.0.3",
    "clsx": "^2.1.1",
    "dotenv": "^17.2.1",
    "next": "15.4.4",
    "next-themes": "^0.4.6",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19", 
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.4.4",
    "typescript": "^5"
  }
}
```

**Análisis línea por línea:**
- **Líneas 1-4**: Metadatos básicos del proyecto
- **Líneas 5-10**: Scripts de desarrollo, construcción e inicio
- **Líneas 11-20**: Dependencias principales incluyendo Next.js 15 y React 19
- **Líneas 21-29**: Dependencias de desarrollo para TypeScript y ESLint

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
```

**Análisis línea por línea:**
- **Línea 1**: Importa tipo de configuración de Next.js
- **Líneas 3-10**: Configuración que ignora errores de ESLint y TypeScript durante construcción
- **Línea 12**: Exporta configuración como default

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Análisis de configuración TypeScript:**
- **target**: ES2017 para compatibilidad moderna
- **lib**: Incluye DOM y ESNext APIs
- **strict**: Activado para máxima seguridad de tipos
- **paths**: Alias `@/*` apunta a `./src/*`

---

## 4. Sistema de Tipos

### src/types/index.ts

```typescript
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

export interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  summary: string;
}

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
```

**Análisis por secciones:**

#### Tipos de Datos (líneas 3-41)
- **Technology**: Define estructura para tecnologías (nombre y logo)
- **Work**: Estructura completa para experiencia laboral con proyectos anidados
- **WorkProject**: Proyectos específicos dentro de trabajos
- **Project**: Proyectos personales con enlace a GitHub
- **Blog**: Estructura para posts de blog (implementación futura)

#### Props de Componentes UI (líneas 43-106)
- **ButtonProps**: Interfaz completa para componente Button con variantes
- **CardProps**: Props básicas para componentes Card
- **ImageProps**: Props extensas para componente Image optimizado
- **TooltipProps**: Props para tooltips con posicionamiento
- **ModalProps**: Props para sistema de modales
- **UseModalReturn**: Tipo de retorno para hook de modal

---

## 5. Gestión de Datos

### src/lib/data.ts

```typescript
import { Work, Project, Blog } from '@/types';

// Since we can't use fs on the client side, we'll import the data directly
// This is a temporary solution - in production you'd want to use API routes or static generation

// Private works data - not exported, only accessible through getWorks()
const worksData: Work[] = [
  {
    name: "Antel",
    time: "2022 - Current",
    logo: "/logo_ancel.png",
    text: "Built Node.js microservices handling 3.5M daily transactions. Reduced deployment times by 40% and errors by 99.9%. Established CI/CD workflow with 85% test coverage.",
    largeText: [
      "Antel, the National Administration of Telecommunications, is a Uruguayan state-owned company responsible for providing telecommunications services in Uruguay. It is the main provider of fixed and mobile telephone services, internet, and cable television in the country. Founded in 1974, Antel plays a key role in the communications infrastructure in Uruguay, offering services both at a national and international level.",
      "My growth as a developer has been aided by two engineers with many years of experience at Antel. They have provided corrections to my code and recommended courses to enhance my skills."
    ],
    workMethod: "The working method involves a weekly meeting to coordinate projects and priorities.",
    projects: [
      {
        title: "Page in NextJs",
        text: "A project in Next.js from scratch with an SQLite database, login, validations, and an SMS messaging service."
      },
      {
        title: "Node",
        text: "Node project with authentication and generation of security codes."
      },
      {
        title: "Java to Node",
        text: "Migration of an IP management project from Java to Node."
      },
      {
        title: "Jest",
        text: "Creating Unit Tests in Jest"
      }
    ],
    technologies: [
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "React", logo: "/logo_react.png" },
      { name: "NextJs", logo: "/logo_next.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Upshow",
    time: "2021 - 2022",
    logo: "/logo_upshow.png",
    text: "Built React dashboards with Node/Express APIs. Integrated GitHub/Jira for real-time team reports. Full lifecycle Agile/Scrum workflow.",
    largeText: [
      "Upshow is a company specialized in technology and interactive platforms designed to enhance engagement and interaction at live events and public venues. It provides solutions that allow establishments and organizers to display user-generated content on screens and monitors, creating a more engaging experience for the audience and encouraging real-time participation.",
      "My growth within the company was thanks to a team that provided me with feedback, English classes, and paid Udemy courses sponsored by the company."
    ],
    workMethod: "Scrum methodology is used based on requests from a manager.",
    projects: [
      {
        title: "React feature",
        text: "Creation of small features for React projects."
      },
      {
        title: "Node, GitHub and Jira",
        text: "Data integration project between GitHub and Jira."
      },
      {
        title: "Elasticsearch",
        text: "Automation project for data analysis in Elasticsearch."
      },
      {
        title: "Show services status",
        text: "Project that displays the status of our services day by day and hour by hour."
      }
    ],
    technologies: [
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "React", logo: "/logo_react.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Hacknoid",
    time: "2018 - 2021",
    logo: "/logo_hacknoid.png",
    text: "Migrated frontend from Zend PHP to React.js (60% faster load time). Established Git branching strategies for releases/hotfixes. Optimized SQL queries (40% response time improvement). Developed maintainability tools.",
    largeText: [
      "Hacknoid is a cybersecurity-oriented company that has an automated pentesting application."
    ],
    workMethod: "Occasional meetings with the boss.",
    projects: [
      {
        title: "Django, Python",
        text: "Creation of backend with Django Python."
      },
      {
        title: "Zend to React",
        text: "Migration of frontend from Zend Framework to React."
      },
      {
        title: "Automated pentesting",
        text: "Creation of modules for pentesting in Python."
      }
    ],
    technologies: [
      { name: "python", logo: "/logo_python.png" },
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "React", logo: "/logo_react.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Gestion total",
    time: "2017 - 2018",
    logo: "/logo_gestionTotal.png",
    text: "Developed custom JavaScript modules for ERP system across diverse industries. Implemented responsive UI layouts with HTML5/CSS3.",
    largeText: [
      "Gestion total sells features on an ERPNext which is focused on the administrative management of companies.",
      "My growth came from solving the small challenges that arose at work"
    ],
    workMethod: "Commissioned by clients.",
    projects: [],
    technologies: [
      { name: "python", logo: "/logo_python.png" },
      { name: "JavaScript", logo: "/logo_javascript.png" }
    ]
  }
];

// Private projects data - not exported, only accessible through getProjects()
const projectsData: Project[] = [
  {
    name: "Meteor",
    time: "2022",
    logo: "/logo_meteor.png",
    text: "This website is intended for stock management in a store, which allows control of the database of product brands, types, quantities, and sales history, all in a MongoDB database.",
    largeText: [
      "Meteor is an open-source web and mobile development platform that uses JavaScript on both the client and server sides, with a real-time data system and a wide range of open-source packages and libraries to facilitate integration with other web technologies and services."
    ],
    github: "https://github.com/Mauro-js/Meteor_practices",
    technologies: [
      { name: "JavaScript", logo: "/logo_javascript.png" },
      { name: "Node", logo: "/logo_node.png" }
    ]
  },
  {
    name: "Flask",
    time: "2023",
    logo: "/logo_flask.png", 
    text: "A Flask-based website with a PostgreSQL database for the presidential elections of a physics professors' commission.",
    largeText: [
      "Flask is a Python web framework that allows developers to quickly and easily create web applications. Flask is considered a micro-framework, which means that it is designed to be lightweight and flexible, and does not include unnecessary additional components.",
      "Flask provides the basic tools for creating web applications, such as URL routing, cookie management, support for Jinja2 templates, and more. Although Flask is considered a beginner-level framework, it is highly scalable and extensible, and is used by developers of all levels of experience to create web applications from simple to complex."
    ],
    github: "https://github.com/Mauro-js/test_python_flask",
    technologies: [
      { name: "python", logo: "/logo_python.png" }
    ]
  }
];

// Get all works data
export async function getWorks(): Promise<Work[]> {
  return worksData;
}

// Get all projects data  
export async function getProjects(): Promise<Project[]> {
  return projectsData;
}

// Get all blog data (for future use)
export async function getBlogs(): Promise<Blog[]> {
  return [];
}

// Get site configuration
export const siteConfig = {
  name: "Mauro Nievas - Portfolio",
  description: "Full Stack Developer Portfolio",
  navItems: [
    { label: "Home", href: "/", id: "home" },
    { label: "Works", href: "#works", id: "works" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "About", href: "#about", id: "about" },
    { label: "Blog", href: "/blog", id: "blogRef" }
  ],
  navMenuItems: [
    { label: "Home", href: "/", id: "home" },
    { label: "Works", href: "#works", id: "works" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "About", href: "#about", id: "about" },
    { label: "Blog", href: "/blog", id: "blogRef" }
  ],
  links: {
    github: "https://github.com/maurocardena",
    linkeding: "https://www.linkedin.com/in/mauro-nievas/"
  }
};
```

**Análisis línea por línea:**

#### Importaciones y Comentarios (líneas 1-5)
- **Línea 1**: Importa interfaces de tipos desde el archivo de tipos
- **Líneas 3-4**: Comentario explicando el enfoque de datos estáticos

#### Datos de Trabajos (líneas 7-123)
- **Línea 7**: Array privado de datos de trabajos, no exportado
- **Líneas 8-42**: Datos de Antel con descripción detallada, metodología y proyectos
- **Líneas 43-77**: Datos de Upshow con contexto empresarial y proyectos realizados
- **Líneas 78-106**: Datos de Hacknoid con enfoque en ciberseguridad
- **Líneas 107-123**: Datos de Gestión Total con desarrollo ERP

#### Datos de Proyectos (líneas 125-155)
- **Línea 125**: Array privado de proyectos personales
- **Líneas 127-140**: Proyecto Meteor con descripción técnica
- **Líneas 141-155**: Proyecto Flask con contexto electoral

#### Funciones de Acceso (líneas 157-170)
- **Líneas 158-160**: Función async para obtener datos de trabajos
- **Líneas 163-165**: Función async para obtener proyectos
- **Líneas 168-170**: Función para blogs (implementación futura)

#### Configuración del Sitio (líneas 172-194)
- **Líneas 173-194**: Configuración de navegación y enlaces sociales

---

## 6. Servicios de Integración

### src/services/github-auth.js

```javascript
const { Octokit } = require('@octokit/core');

class GitHubAuthService {
  constructor() {
    this.octokit = null;
    this.initialized = false;
    this.publicOctokit = null;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Try with token first
      const token = process.env.GITHUB_TOKEN;
      if (token && (token.startsWith('ghp_') || token.startsWith('github_pat_'))) {
        console.log('Initializing GitHub service with token');
        this.octokit = new Octokit({
          auth: token,
        });
        
        // Test the token
        try {
          await this.octokit.request('GET /user');
          console.log('GitHub token validated successfully');
        } catch (error) {
          console.log('Token validation failed, falling back to public API');
          this.octokit = null;
        }
      }

      // Initialize public client (no auth required)
      this.publicOctokit = new Octokit();
      
    } catch (error) {
      console.error('Error initializing GitHub service:', error);
    }

    this.initialized = true;
  }

  async makeGraphQLRequest(query, variables = {}) {
    await this.initialize();
    
    if (!this.octokit) {
      throw new Error('No authenticated GitHub client available');
    }

    try {
      const response = await this.octokit.graphql(query, variables);
      return response;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  async makePublicRequest(endpoint, options = {}) {
    await this.initialize();
    
    try {
      const response = await this.publicOctokit.request(endpoint, options);
      return response;
    } catch (error) {
      console.error('Public API request failed:', error);
      throw error;
    }
  }

  getAuthenticatedClient() {
    return this.octokit;
  }

  getPublicClient() {
    return this.publicOctokit;
  }
}

// Export singleton instance
module.exports = new GitHubAuthService();
```

**Análisis línea por línea:**

#### Clase GitHubAuthService (líneas 3-8)
- **Línea 3**: Definición de clase para servicio de autenticación
- **Líneas 4-7**: Constructor con propiedades para instancias de Octokit

#### Método initialize (líneas 10-34)
- **Línea 11**: Guard clause para evitar re-inicialización
- **Líneas 14-16**: Verificación y validación de token de GitHub
- **Líneas 17-25**: Creación de cliente autenticado con prueba de token
- **Línea 30**: Inicialización de cliente público sin autenticación

#### Método makeGraphQLRequest (líneas 36-50)
- **Líneas 37-41**: Inicialización y validación de cliente autenticado
- **Líneas 43-49**: Ejecución de consulta GraphQL con manejo de errores

#### Método makePublicRequest (líneas 52-62)
- **Líneas 54-60**: Request a API pública con manejo de errores

#### Métodos Getter (líneas 64-70)
- **Líneas 64-66**: Retorna cliente autenticado
- **Líneas 68-70**: Retorna cliente público

#### Singleton Export (línea 73)
- **Línea 73**: Export de instancia única del servicio

---

## 7. Rutas API

### src/app/api/github/contributions/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import githubAuthService from '@/services/github-auth.js';

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

// Fallback realistic contribution data generation
function generateRealisticContributions(username: string) {
  const contributions = [];
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  
  // Generate realistic patterns based on typical developer activity
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Lower activity on weekends
    const baseActivity = isWeekend ? 0.3 : 0.7;
    
    // Add some randomness
    const randomFactor = Math.random();
    const contributionCount = randomFactor < baseActivity ? Math.floor(Math.random() * 8) + 1 : 0;
    
    // Color based on contribution count (GitHub's color scheme)
    let color = '#161b22'; // No contribution
    if (contributionCount > 0) color = '#0e4429';      // Light
    if (contributionCount > 2) color = '#006d32';      // Medium light
    if (contributionCount > 4) color = '#26a641';      // Medium
    if (contributionCount > 6) color = '#39d353';      // High
    
    contributions.push({
      date: d.toISOString().split('T')[0],
      contributionCount,
      color
    });
  }
  
  // Group by weeks
  const weeks = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push({
      contributionDays: contributions.slice(i, i + 7)
    });
  }
  
  return { weeks };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'maurocardena';
  
  try {
    // Calculate date range (last year)
    const to = new Date();
    const from = new Date(to.getFullYear() - 1, to.getMonth(), to.getDate());
    
    // Try authenticated GraphQL request first
    try {
      const data = await githubAuthService.makeGraphQLRequest(CONTRIBUTIONS_QUERY, {
        username,
        from: from.toISOString(),
        to: to.toISOString()
      });
      
      return NextResponse.json({
        success: true,
        data: data.user.contributionsCollection.contributionCalendar,
        source: 'authenticated'
      });
    } catch (authError) {
      console.log('Authenticated request failed, trying public API fallback');
      
      // Try to get user info from public API to ensure user exists
      try {
        await githubAuthService.makePublicRequest('GET /users/{username}', {
          username
        });
        
        // If user exists, generate realistic contribution data
        const contributionCalendar = generateRealisticContributions(username);
        
        return NextResponse.json({
          success: true,
          data: contributionCalendar,
          source: 'simulated',
          message: 'Generated realistic contribution pattern based on user profile'
        });
      } catch (publicError) {
        console.error('Public API also failed:', publicError);
        
        // Final fallback - return empty but valid structure
        return NextResponse.json({
          success: true,
          data: { weeks: [] },
          source: 'empty',
          message: 'No data available'
        });
      }
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch contributions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

**Análisis línea por línea:**

#### Importaciones y Query (líneas 1-21)
- **Líneas 1-2**: Importaciones de Next.js para API routes
- **Líneas 4-21**: Query GraphQL para obtener contribuciones de GitHub

#### Función de Generación Realística (líneas 24-60)
- **Líneas 25-27**: Configuración de rango de fechas para último año
- **Líneas 30-32**: Lógica para reducir actividad en fines de semana
- **Líneas 34-37**: Generación aleatoria basada en patrones realistas
- **Líneas 39-44**: Asignación de colores según esquema de GitHub
- **Líneas 53-58**: Agrupación de contribuciones por semanas

#### Handler GET (líneas 62-118)
- **Líneas 63-64**: Extracción de parámetros de URL
- **Líneas 67-69**: Cálculo de rango de fechas
- **Líneas 72-83**: Intento de request GraphQL autenticado
- **Líneas 84-102**: Fallback a API pública con simulación
- **Líneas 103-110**: Fallback final con estructura vacía
- **Líneas 111-118**: Manejo de errores con response JSON

---

## 8. Sistema de Componentes UI

### src/components/ui/Button.tsx

```typescript
import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'solid',
  color = 'primary',
  size = 'md',
  as,
  href,
  disabled = false,
  isIconOnly = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'button-base';
  const variantClasses = `button-${variant}`;
  const colorClasses = `button-${color}`;
  const sizeClasses = `button-${size}`;
  const iconOnlyClasses = isIconOnly ? 'button-icon-only' : '';
  const disabledClasses = disabled ? 'button-disabled' : '';

  const classes = clsx(
    baseClasses,
    variantClasses,
    colorClasses,
    sizeClasses,
    iconOnlyClasses,
    disabledClasses,
    className
  );

  // If href is provided, render as link
  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:');
    
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  // Determine element type
  const Component = as || 'button';

  return (
    <Component
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
```

**Análisis línea por línea:**

#### Importaciones y Props (líneas 1-18)
- **Líneas 1-4**: Importaciones necesarias para el componente
- **Líneas 6-18**: Destructuring de props con valores por defecto

#### Clases CSS (líneas 19-32)
- **Líneas 19-24**: Definición de clases base para diferentes variantes
- **Líneas 26-34**: Combinación de clases usando clsx

#### Renderizado Condicional para Enlaces (líneas 35-51)
- **Líneas 36-37**: Detección de enlaces externos
- **Líneas 39-48**: Renderizado como enlace externo con target="_blank"
- **Líneas 50-53**: Renderizado como Link de Next.js para rutas internas

#### Renderizado como Botón (líneas 55-66)
- **Línea 56**: Determinación del componente usando prop 'as'
- **Líneas 58-66**: Renderizado del componente con todas las props

### src/components/ui/Modal.tsx

```typescript
'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { ModalProps } from '@/types';

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  size = 'md',
  classNames = {}
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={clsx('modal-backdrop', classNames.base)} onClick={onClose}>
      <div 
        className={clsx('modal-content', `modal-${size}`, classNames.base)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const ModalContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('modal-container', className)}>
    {children}
  </div>
);

export const ModalHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('modal-header', className)}>
    {children}
  </div>
);

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('modal-body', className)}>
    {children}
  </div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('modal-footer', className)}>
    {children}
  </div>
);

export default Modal;
```

**Análisis línea por línea:**

#### Hook useEffect para Gestión de Modal (líneas 14-31)
- **Líneas 15-20**: Handler para tecla Escape
- **Líneas 22-28**: Event listeners y prevención de scroll del body
- **Líneas 30-31**: Cleanup function para remover listeners

#### Renderizado Principal (líneas 33-43)
- **Línea 33**: Guard clause para modal cerrado
- **Líneas 35-42**: Estructura de modal con backdrop y contenido

#### Componentes Auxiliares (líneas 45-75)
- **Líneas 45-51**: ModalContent como contenedor principal
- **Líneas 53-59**: ModalHeader para encabezados
- **Líneas 61-67**: ModalBody para contenido principal
- **Líneas 69-75**: ModalFooter para acciones del modal

---

## 9. Componentes de Layout

### src/app/layout.tsx

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mauro Nievas - Portfolio",
  description: "Full Stack Developer Portfolio showcasing modern web applications and projects",
  keywords: ["Full Stack Developer", "React", "Next.js", "Node.js", "Python", "Portfolio"],
  authors: [{ name: "Mauro Nievas" }],
  creator: "Mauro Nievas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Mauro Nievas Portfolio",
    title: "Mauro Nievas - Full Stack Developer",
    description: "Portfolio showcasing modern web applications and projects",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mauro Nievas Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mauro Nievas - Full Stack Developer",
    description: "Portfolio showcasing modern web applications and projects",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Análisis línea por línea:**

#### Metadatos SEO (líneas 8-50)
- **Líneas 9-13**: Título y descripción básica con palabras clave
- **Líneas 15-29**: Configuración Open Graph para redes sociales
- **Líneas 30-34**: Metadatos específicos de Twitter
- **Líneas 35-45**: Configuración para robots de búsqueda
- **Líneas 47-49**: Verificación de Google (pendiente)

#### Script de Tema (líneas 65-75)
- **Línea 66**: dangerouslySetInnerHTML para script inline
- **Líneas 68-72**: Lógica para detectar preferencia de tema
- **Línea 73**: Try-catch para manejar errores de localStorage

#### Proveedores (líneas 79-85)
- **Líneas 80-84**: Configuración de ThemeProvider con tema oscuro por defecto

### src/app/page.tsx

```typescript
import MeSectionCompact from '@/components/MeSectionCompact';
import WorksColumn from '@/components/WorksColumn';
import ProjectsColumn from '@/components/ProjectsColumn';
import { getWorks, getProjects } from '@/lib/data';
import timeCalculator from "@/components/timeCalculator";



export default async function Home() {
  // Get data at build time
  const works = await getWorks();
  const projects = await getProjects();
  const timeDifference = timeCalculator()

  return (
    <>

      {/* 3 Column Grid Layout */}
      <div className="home-grid">
        {/* Left Column - Works */}
        <div className="column column-fixed" id="works">
          <div className="column-header">
            <h2 className="text-4xl font-bold text-white mb-6">Works</h2>
          </div>
          <div className="column-content">
            <WorksColumn worksData={works} />
          </div>
        </div>

        {/* Center Column - ME */}
        <div className="column center-column" id="about">
          <div className="column-content">
            {/* ME Section */}
            <div className=" rounded-lg p-1">
              <div className="mb-4 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Mauro Nievas</h1>
                {/* Title */}
                <p className="text-lg md:text-xl lg:text-2xl text-center text-spacial-4-90 font-medium">
                    {timeDifference !== null && `Full Stack Developer +${timeDifference.years} years`}
                </p>
              </div>
              <MeSectionCompact />
            </div>
          </div>
        </div>

        {/* Right Column - Projects */}
        <div className="column column-fixed" id="projects">
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
```

**Análisis línea por línea:**

#### Importaciones (líneas 1-6)
- **Líneas 1-3**: Importación de componentes principales
- **Línea 4**: Importación de funciones de datos
- **Línea 5**: Importación de utilidad de tiempo

#### Función Async Home (líneas 9-60)
- **Líneas 11-13**: Obtención de datos en tiempo de construcción
- **Líneas 19-28**: Columna izquierda con experiencias laborales
- **Líneas 31-44**: Columna central con información personal
- **Líneas 47-56**: Columna derecha con proyectos personales

---

## 10. Componentes de Contenido

### src/components/MeSectionCompact.tsx

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { HomeIcon, GitHubIcon, LinkedInIcon } from '@/components/icons';
import { siteConfig } from '@/lib/data';
import GitHubContributions from './GitHubContributions';
import { Octokit } from '@octokit/core';

interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
}

export default function MeSectionCompact() {
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      try {
        const octokit = new Octokit();
        const response = await octokit.request('GET /users/{username}', {
          username: 'maurocardena'
        });
        
        setGithubProfile({
          public_repos: response.data.public_repos,
          followers: response.data.followers,
          following: response.data.following
        });
      } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        // Fallback data
        setGithubProfile({
          public_repos: 15,
          followers: 10,
          following: 25
        });
      }
    };

    fetchGitHubProfile();
  }, []);

  return (
    <div className="me-section-compact">
      {/* Profile Image */}
      <div className="profile-image-container">
        <Image
          src="/logo_ancel.png"
          alt="Mauro Nievas"
          className="profile-image"
          width={120}
          height={120}
          radius="full"
        />
      </div>

      {/* GitHub Stats */}
      {githubProfile && (
        <Card className="github-stats-card">
          <CardBody>
            <div className="github-stats">
              <div className="stat-item">
                <span className="stat-number">{githubProfile.public_repos}</span>
                <span className="stat-label">Repositories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{githubProfile.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{githubProfile.following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Technologies */}
      <Card className="technologies-card">
        <CardBody>
          <h3 className="section-title">Technologies</h3>
          <div className="technologies-grid">
            {[
              { name: 'React', logo: '/logo_react.png' },
              { name: 'Next.js', logo: '/logo_next.png' },
              { name: 'Node.js', logo: '/logo_node.png' },
              { name: 'Python', logo: '/logo_python.png' },
              { name: 'JavaScript', logo: '/logo_javascript.png' }
            ].map((tech) => (
              <Tooltip key={tech.name} content={tech.name}>
                <div className="technology-item">
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={40}
                    height={40}
                    className="technology-logo"
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* GitHub Contributions */}
      <Card className="contributions-card">
        <CardBody>
          <h3 className="section-title">GitHub Activity</h3>
          <GitHubContributions username="maurocardena" />
        </CardBody>
      </Card>

      {/* Social Links */}
      <div className="social-links">
        <Button
          as="a"
          href="/"
          variant="ghost"
          size="lg"
          isIconOnly
          className="social-button"
        >
          <HomeIcon />
        </Button>
        
        <Button
          as="a"
          href={siteConfig.links.github}
          variant="ghost"
          size="lg"
          isIconOnly
          className="social-button"
        >
          <GitHubIcon />
        </Button>
        
        <Button
          as="a"
          href={siteConfig.links.linkeding}
          variant="ghost"
          size="lg"
          isIconOnly
          className="social-button"
        >
          <LinkedInIcon />
        </Button>
      </div>
    </div>
  );
}
```

**Análisis línea por línea:**

#### Hook useEffect para GitHub Profile (líneas 21-44)
- **Líneas 23-27**: Creación de instancia Octokit y request a API
- **Líneas 29-33**: Extracción de datos del perfil
- **Líneas 35-41**: Datos de fallback en caso de error

#### Renderizado de Imagen de Perfil (líneas 48-57)
- **Líneas 49-56**: Contenedor e imagen optimizada con Next.js

#### GitHub Stats Card (líneas 60-78)
- **Líneas 61-77**: Renderizado condicional de estadísticas de GitHub

#### Technologies Grid (líneas 81-103)
- **Líneas 85-90**: Array de tecnologías con logos
- **Líneas 91-102**: Map de tecnologías con tooltips

#### Social Links (líneas 113-141)
- **Líneas 114-120**: Botón de inicio
- **Líneas 122-129**: Enlace a GitHub
- **Líneas 131-138**: Enlace a LinkedIn

### src/components/GitHubContributions.tsx

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Tooltip } from '@/components/ui/Tooltip';

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsData {
  weeks: ContributionWeek[];
}

interface GitHubContributionsProps {
  username: string;
}

export default function GitHubContributions({ username }: GitHubContributionsProps) {
  const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedWeeks, setLoadedWeeks] = useState(0);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`/api/github/contributions?username=${username}`);
        const result = await response.json();
        
        if (result.success) {
          setContributionsData(result.data);
          // Start progressive loading animation
          animateLoading(result.data.weeks.length);
        } else {
          console.error('Failed to fetch contributions:', result.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
        setLoading(false);
      }
    };

    const animateLoading = (totalWeeks: number) => {
      let currentWeek = 0;
      const interval = setInterval(() => {
        if (currentWeek < totalWeeks) {
          setLoadedWeeks(currentWeek + 1);
          currentWeek++;
        } else {
          setLoading(false);
          clearInterval(interval);
        }
      }, 35); // Load 4 weeks every ~140ms for smooth animation
    };

    fetchContributions();
  }, [username]);

  const formatTooltipContent = (day: ContributionDay) => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const contributionText = day.contributionCount === 1 
      ? '1 contribution' 
      : `${day.contributionCount} contributions`;
    
    return `${contributionText} on ${formattedDate}`;
  };

  if (loading && !contributionsData) {
    return <div className="contributions-loading">Loading GitHub activity...</div>;
  }

  if (!contributionsData) {
    return <div className="contributions-error">Unable to load GitHub activity</div>;
  }

  return (
    <div className="github-contributions">
      <div className="contributions-grid">
        {contributionsData.weeks.slice(0, loadedWeeks).map((week, weekIndex) => (
          <div key={weekIndex} className="contribution-week">
            {week.contributionDays.map((day, dayIndex) => (
              <Tooltip
                key={`${weekIndex}-${dayIndex}`}
                content={formatTooltipContent(day)}
                placement="top"
              >
                <a
                  href={`https://github.com/${username}?tab=overview&from=${day.date}&to=${day.date}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contribution-day"
                  style={{ backgroundColor: day.color }}
                  data-count={day.contributionCount}
                  data-date={day.date}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="loading-indicator">
          Loading {loadedWeeks}/{contributionsData.weeks.length} weeks...
        </div>
      )}
    </div>
  );
}
```

**Análisis línea por línea:**

#### Interfaces TypeScript (líneas 5-22)
- **Líneas 5-9**: Interfaz para día de contribución individual
- **Líneas 11-13**: Interfaz para semana de contribuciones
- **Líneas 15-17**: Interfaz para datos completos de contribuciones
- **Líneas 19-21**: Props del componente

#### Hook useEffect Principal (líneas 28-55)
- **Líneas 29-42**: Función para fetch de datos de contribuciones
- **Líneas 44-53**: Función de animación progresiva de carga

#### Función de Formato de Tooltip (líneas 57-70)
- **Líneas 58-62**: Formateo de fecha legible
- **Líneas 64-66**: Texto de contribuciones (singular/plural)
- **Línea 68**: Retorno de string formateado

#### Estados de Carga y Error (líneas 72-79)
- **Líneas 72-74**: Estado de carga inicial
- **Líneas 76-78**: Estado de error

#### Renderizado Principal (líneas 81-107)
- **Líneas 83-105**: Grid de contribuciones con tooltips y enlaces
- **Líneas 107-111**: Indicador de progreso de carga

---

## 11. Sistema de Diseño

### src/styles/variables.css

```css
:root {
  /* Spacial Color Palette - Inspired by Nord/Polybar */
  --spacial-1: #2e3440;       /* Dark background */
  --spacial-2: #3b4252;       /* Medium dark */
  --spacial-3: #434c5e;       /* Medium */
  --spacial-4: #4c566a;       /* Light medium */
  --spacial-5: #d8dee9;       /* Light */
  --spacial-6: #e5e9f0;       /* Very light */
  --spacial-7: #eceff4;       /* Almost white */
  
  /* Spacial Color Variations with Opacity */
  --spacial-1-90: rgba(46, 52, 64, 0.9);
  --spacial-2-90: rgba(59, 66, 82, 0.9);
  --spacial-3-90: rgba(67, 76, 94, 0.9);
  --spacial-4-90: rgba(76, 86, 106, 0.9);
  --spacial-5-90: rgba(216, 222, 233, 0.9);
  
  /* Spacial Accent Colors */
  --spacial-accent-1: #8fbcbb;  /* Frost cyan */
  --spacial-accent-2: #88c0d0;  /* Frost blue */
  --spacial-accent-3: #81a1c1;  /* Frost dark blue */
  --spacial-accent-4: #5e81ac;  /* Frost darker blue */
  
  /* Status Colors */
  --spacial-success: #a3be8c;   /* Aurora green */
  --spacial-warning: #ebcb8b;   /* Aurora yellow */
  --spacial-error: #bf616a;     /* Aurora red */
  --spacial-info: #b48ead;      /* Aurora purple */
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */
  
  /* Typography Scale */
  --text-xs: 0.75rem;       /* 12px */
  --text-sm: 0.875rem;      /* 14px */
  --text-base: 1rem;        /* 16px */
  --text-lg: 1.125rem;      /* 18px */
  --text-xl: 1.25rem;       /* 20px */
  --text-2xl: 1.5rem;       /* 24px */
  --text-3xl: 1.875rem;     /* 30px */
  --text-4xl: 2.25rem;      /* 36px */
  --text-5xl: 3rem;         /* 48px */
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;     /* 2px */
  --radius-md: 0.375rem;     /* 6px */
  --radius-lg: 0.5rem;       /* 8px */
  --radius-xl: 0.75rem;      /* 12px */
  --radius-2xl: 1rem;        /* 16px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
  
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
  
  /* Layout Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Dark Theme Variables (Default) */
:root {
  --background: var(--spacial-1);
  --foreground: var(--spacial-7);
  --muted: var(--spacial-2);
  --muted-foreground: var(--spacial-5);
  --border: var(--spacial-3);
  --input: var(--spacial-2);
  --primary: var(--spacial-accent-2);
  --primary-foreground: var(--spacial-1);
  --secondary: var(--spacial-3);
  --secondary-foreground: var(--spacial-6);
  --accent: var(--spacial-accent-1);
  --accent-foreground: var(--spacial-1);
  --destructive: var(--spacial-error);
  --destructive-foreground: var(--spacial-7);
}

/* Light Theme Variables */
.light {
  --background: var(--spacial-7);
  --foreground: var(--spacial-1);
  --muted: var(--spacial-6);
  --muted-foreground: var(--spacial-4);
  --border: var(--spacial-5);
  --input: var(--spacial-6);
  --primary: var(--spacial-accent-4);
  --primary-foreground: var(--spacial-7);
  --secondary: var(--spacial-5);
  --secondary-foreground: var(--spacial-2);
  --accent: var(--spacial-accent-3);
  --accent-foreground: var(--spacial-7);
  --destructive: var(--spacial-error);
  --destructive-foreground: var(--spacial-7);
}
```

**Análisis del Sistema de Colores:**

#### Paleta Spacial Base (líneas 2-9)
- **Espacial 1-4**: Escalas de grises oscuros para fondos y superficies
- **Espacial 5-7**: Escalas de grises claros para texto y elementos

#### Colores con Opacidad (líneas 11-16)
- **Variaciones 90%**: Versiones semi-transparentes para overlays

#### Colores de Acento (líneas 18-22)
- **Frost Colors**: Inspirados en la paleta Nord para acentos

#### Sistema de Espaciado (líneas 27-33)
- **Escala XS a 3XL**: Sistema consistente basado en múltiplos de 4px

#### Sistema Tipográfico (líneas 35-44)
- **Escala de Tamaños**: Sistema modular de tamaños de texto

---

## 12. Estilos CSS

### src/styles/components/github-contributions.css

```css
.github-contributions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.contributions-grid {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  background: var(--spacial-2);
  scrollbar-width: thin;
  scrollbar-color: var(--spacial-4) var(--spacial-2);
}

.contributions-grid::-webkit-scrollbar {
  height: 4px;
}

.contributions-grid::-webkit-scrollbar-track {
  background: var(--spacial-2);
  border-radius: var(--radius-sm);
}

.contributions-grid::-webkit-scrollbar-thumb {
  background: var(--spacial-4);
  border-radius: var(--radius-sm);
}

.contributions-grid::-webkit-scrollbar-thumb:hover {
  background: var(--spacial-accent-2);
}

.contribution-week {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.contribution-day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: block;
  cursor: pointer;
  transition: var(--transition-fast);
  border: 1px solid var(--spacial-3);
  opacity: 0;
  animation: contribution-appear 0.3s ease-out forwards;
}

.contribution-day:hover {
  transform: scale(1.2);
  border-color: var(--spacial-accent-2);
  box-shadow: 0 2px 8px rgba(136, 192, 208, 0.3);
}

.contribution-day[data-count="0"] {
  background-color: var(--spacial-2) !important;
}

/* Progressive loading animation */
@keyframes contribution-appear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Stagger animation for weeks */
.contribution-week:nth-child(1) .contribution-day { animation-delay: 0ms; }
.contribution-week:nth-child(2) .contribution-day { animation-delay: 35ms; }
.contribution-week:nth-child(3) .contribution-day { animation-delay: 70ms; }
.contribution-week:nth-child(4) .contribution-day { animation-delay: 105ms; }
/* ... continues for all 52 weeks */

.contributions-loading,
.contributions-error {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--spacial-5);
  font-size: var(--text-sm);
}

.contributions-error {
  color: var(--spacial-error);
}

.loading-indicator {
  text-align: center;
  font-size: var(--text-xs);
  color: var(--spacial-4);
  margin-top: var(--spacing-sm);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .contributions-grid {
    gap: 1px;
  }
  
  .contribution-week {
    gap: 1px;
  }
  
  .contribution-day {
    width: 10px;
    height: 10px;
  }
}
```

**Análisis de Estilos:**

#### Grid de Contribuciones (líneas 7-15)
- **Display flex**: Layout horizontal con scroll
- **Gap y padding**: Espaciado consistente
- **Scrollbar personalizado**: Estilo acorde al tema

#### Animación Progresiva (líneas 44-52)
- **Keyframes**: Animación de aparición suave
- **Transform y opacity**: Efecto de escalado

#### Estados Hover (líneas 54-57)
- **Transform scale**: Aumento de tamaño en hover
- **Box-shadow**: Efecto de iluminación

### src/styles/layout/grid.css

```css
/* Main Grid Layout */
.home-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-xl);
  min-height: 100vh;
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

/* Column Styles */
.column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.column-fixed {
  /* Fixed width columns for works and projects */
  max-width: 400px;
}

.center-column {
  /* Center column takes more space */
  min-width: 600px;
  max-width: 800px;
  justify-self: center;
}

.column-header {
  position: sticky;
  top: var(--spacing-lg);
  z-index: var(--z-sticky);
  background: var(--background);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--spacial-accent-2);
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Responsive Breakpoints */
@media (max-width: 1200px) {
  .home-grid {
    grid-template-columns: 1fr 1.5fr 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }
  
  .center-column {
    min-width: 400px;
    max-width: 600px;
  }
  
  .column-fixed {
    max-width: 350px;
  }
}

@media (max-width: 968px) {
  .home-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
  }
  
  .column-fixed,
  .center-column {
    max-width: none;
    min-width: auto;
  }
  
  .column-header {
    position: static;
    border-bottom: 1px solid var(--spacial-3);
  }
}

@media (max-width: 640px) {
  .home-grid {
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }
}
```

**Análisis del Grid Layout:**

#### Grid Principal (líneas 2-10)
- **Grid-template-columns**: Layout 3 columnas (1:2:1)
- **Gap**: Espaciado entre columnas
- **Max-width**: Contenedor centrado

#### Responsive Breakpoints (líneas 39-75)
- **1200px**: Reducción de espacios
- **968px**: Cambio a columna única
- **640px**: Espaciado mínimo para móviles

---

## 13. Hooks Personalizados

### src/hooks/useModal.ts

```typescript
import { useState, useCallback } from 'react';
import { UseModalReturn } from '@/types';

export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const onToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
    onToggle
  };
}
```

**Análisis línea por línea:**

#### Hook useModal (líneas 4-26)
- **Línea 5**: Estado local para modal abierto/cerrado
- **Líneas 7-9**: Función memoizada para abrir modal
- **Líneas 11-13**: Función memoizada para cerrar modal
- **Líneas 15-17**: Función para cambiar estado con parámetro
- **Líneas 19-21**: Función toggle memoizada
- **Líneas 23-29**: Retorno de interfaz completa

### src/hooks/useThemeSwitch.ts

```typescript
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted
  };
}
```

**Análisis línea por línea:**

#### Hook useThemeSwitch (líneas 6-23)
- **Línea 7**: Destructuring de hook next-themes
- **Líneas 10-12**: Estado mounted para prevenir hidration mismatch
- **Líneas 14-16**: Función toggle entre dark y light
- **Líneas 18-23**: Retorno de controles de tema

---

## 14. Proveedores de Contexto

### src/providers/ThemeProvider.tsx

```typescript
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Análisis línea por línea:**

#### ThemeProvider (líneas 6-8)
- **Línea 6**: Función wrapper que recibe props de next-themes
- **Línea 7**: Renderizado directo del ThemeProvider de next-themes

---

## 15. Análisis Detallado del Código

### Configuración de Entorno

#### src/config/env.js

```javascript
const dotenv = require('dotenv');

class EnvironmentConfig {
  constructor() {
    // Load environment variables
    dotenv.config();
    this.githubToken = this.validateGitHubToken();
    this.nodeEnv = process.env.NODE_ENV || 'development';
  }

  validateGitHubToken() {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      console.log('No GitHub token found. GitHub features will use public API with rate limits.');
      return null;
    }

    // Validate token format
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
      console.warn('GitHub token format may be incorrect. Expected to start with "ghp_" or "github_pat_"');
    }

    // Don't log the actual token for security
    console.log('GitHub token loaded successfully');
    return token;
  }

  getGitHubToken() {
    return this.githubToken;
  }

  isDevelopment() {
    return this.nodeEnv === 'development';
  }

  isProduction() {
    return this.nodeEnv === 'production';
  }

  // Debug info (without exposing sensitive data)
  getDebugInfo() {
    return {
      nodeEnv: this.nodeEnv,
      hasGitHubToken: !!this.githubToken,
      tokenFormat: this.githubToken ? this.githubToken.substring(0, 4) + '...' : null
    };
  }
}

// Export singleton instance
module.exports = new EnvironmentConfig();
```

**Análisis línea por línea:**

#### Constructor y Carga de Variables (líneas 4-8)
- **Línea 5**: Carga de variables de entorno con dotenv
- **Línea 6**: Validación del token de GitHub
- **Línea 7**: Configuración del entorno Node.js

#### Validación de Token (líneas 10-23)
- **Líneas 12-15**: Verificación de existencia del token
- **Líneas 17-20**: Validación del formato del token
- **Línea 22**: Log seguro sin exponer el token

#### Métodos Utilitarios (líneas 25-39)
- **Líneas 25-27**: Getter para token de GitHub
- **Líneas 29-35**: Verificadores de entorno
- **Líneas 37-43**: Información de debug sin datos sensibles

### Utilidades de GitHub

#### src/lib/github-contributions.ts

```typescript
interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsData {
  weeks: ContributionWeek[];
}

export async function fetchGitHubContributions(username: string): Promise<ContributionsData | null> {
  try {
    const response = await fetch(`/api/github/contributions?username=${username}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch contributions:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return null;
  }
}

// Fallback contribution data generator (client-side)
export function generateFallbackContributions(): ContributionsData {
  const contributions: ContributionDay[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const contributionCount = isWeekend ? 
      Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0 :
      Math.random() < 0.7 ? Math.floor(Math.random() * 8) + 1 : 0;
    
    let color = '#161b22';
    if (contributionCount > 0) color = '#0e4429';
    if (contributionCount > 2) color = '#006d32';
    if (contributionCount > 4) color = '#26a641';
    if (contributionCount > 6) color = '#39d353';
    
    contributions.push({
      date: d.toISOString().split('T')[0],
      contributionCount,
      color
    });
  }
  
  const weeks: ContributionWeek[] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push({
      contributionDays: contributions.slice(i, i + 7)
    });
  }
  
  return { weeks };
}
```

**Análisis de Funciones Utilitarias:**

#### fetchGitHubContributions (líneas 15-28)
- **Líneas 16-17**: Request a API route local
- **Líneas 19-25**: Procesamiento de respuesta exitosa/error

#### generateFallbackContributions (líneas 31-59)
- **Líneas 33-35**: Configuración de rango de fechas
- **Líneas 37-42**: Lógica de simulación realística de contribuciones
- **Líneas 44-48**: Asignación de colores según GitHub
- **Líneas 54-58**: Agrupación en formato de semanas

#### src/lib/github.ts

```typescript
import { Octokit } from '@octokit/core';

interface GitHubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const octokit = new Octokit();
    const response = await octokit.request('GET /users/{username}', {
      username
    });
    
    return {
      login: response.data.login,
      public_repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      avatar_url: response.data.avatar_url,
      bio: response.data.bio,
      location: response.data.location,
      company: response.data.company
    };
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

export async function fetchGitHubRepos(username: string, limit: number = 10) {
  try {
    const octokit = new Octokit();
    const response = await octokit.request('GET /users/{username}/repos', {
      username,
      sort: 'updated',
      per_page: limit
    });
    
    return response.data.map(repo => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at
    }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}
```

**Análisis de Funciones GitHub:**

#### fetchGitHubUser (líneas 13-32)
- **Líneas 14-17**: Request a API pública de GitHub
- **Líneas 19-28**: Mapeo de datos del usuario
- **Líneas 29-32**: Manejo de errores con retorno null

#### fetchGitHubRepos (líneas 34-52)
- **Líneas 35-40**: Request de repositorios ordenados por actualización
- **Líneas 42-49**: Mapeo de datos relevantes de repositorios
- **Líneas 50-52**: Manejo de errores con array vacío

### Componentes de Animación

#### src/components/changingContentAnimation.tsx

```typescript
'use client';

import React, { useState, useEffect, useMemo } from 'react';

const ChangingContentAnimation: React.FC = () => {
  const targetText = "Mauro Nievas";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  
  const [displayText, setDisplayText] = useState(targetText);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateText = useMemo(() => {
    return () => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      const textArray = targetText.split('');
      let iterations = 0;
      
      const interval = setInterval(() => {
        setDisplayText(prev => {
          return prev.split('').map((char, index) => {
            if (index < iterations) {
              return targetText[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          }).join('');
        });
        
        if (iterations >= targetText.length) {
          clearInterval(interval);
          setIsAnimating(false);
          setDisplayText(targetText);
        }
        
        iterations += 1 / 3;
      }, 30);
    };
  }, [targetText, characters, isAnimating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      animateText();
    }, 1000);

    return () => clearTimeout(timer);
  }, [animateText]);

  return (
    <h1 
      className={`text-4xl font-bold cursor-pointer transition-all duration-300 ${
        isAnimating ? 'text-spacial-accent-2' : 'text-white'
      }`}
      onClick={animateText}
    >
      {displayText}
    </h1>
  );
};

export default ChangingContentAnimation;
```

**Análisis del Componente de Animación:**

#### Estado y Configuración (líneas 6-10)
- **Línea 6**: Texto objetivo a mostrar
- **Línea 7**: Caracteres para el efecto de glitch
- **Líneas 9-10**: Estados para texto mostrado y animación activa

#### Función de Animación (líneas 12-36)
- **Líneas 14-16**: Guards para prevenir múltiples animaciones
- **Líneas 21-26**: Lógica de animación carácter por carácter
- **Líneas 28-32**: Condición de finalización
- **Línea 34**: Incremento fraccionario para efecto suave

#### Efecto de Inicio (líneas 38-44)
- **Líneas 39-43**: Timer para inicio automático de animación

#### Renderizado (líneas 46-55)
- **Líneas 47-51**: Clases dinámicas según estado de animación
- **Línea 52**: Click handler para trigger manual

### Calculador de Tiempo

#### src/components/timeCalculator.tsx

```typescript
const timeCalculator = () => {
  const startDate = new Date('2017-04-04T00:00:00.000Z');
  const currentDate = new Date();
  
  const timeDifference = currentDate.getTime() - startDate.getTime();
  
  if (timeDifference < 0) {
    return null;
  }
  
  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
  
  return {
    years,
    months,
    days,
    totalDays: Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  };
};

export default timeCalculator;
```

**Análisis del Calculador:**

#### Cálculo de Diferencia (líneas 2-5)
- **Línea 2**: Fecha de inicio fija (04/04/2017)
- **Líneas 4-5**: Cálculo de diferencia en milisegundos

#### Validación y Cálculos (líneas 7-16)
- **Líneas 7-9**: Validación de fecha válida
- **Líneas 11-13**: Cálculos precisos usando constantes astronómicas
- **Líneas 15-18**: Retorno de objeto con diferentes unidades

---

## Conclusión

Este portfolio representa un ejemplo completo de **arquitectura moderna de Next.js 15** con las siguientes características destacadas:

### Fortalezas Arquitectónicas

1. **Separación de Responsabilidades**: Clara división entre datos, lógica y presentación
2. **Sistema de Tipos Robusto**: TypeScript utilizado consistentemente en todo el proyecto
3. **Componentes Reutilizables**: Biblioteca UI personalizada con componentes modulares
4. **Integración API Inteligente**: Sistema de fallback robusto para GitHub API
5. **Optimización de Performance**: Carga progresiva y animaciones optimizadas
6. **Diseño Responsivo**: Sistema de grid adaptable con breakpoints bem definidos

### Patrones de Diseño Implementados

- **Singleton**: Para servicios de autenticación
- **Factory**: Para generación de datos simulados
- **Observer**: Para manejo de temas
- **Module**: Para encapsulación de datos
- **Proxy**: Para componentes polimórficos

### Consideraciones de Seguridad

- Tokens de GitHub manejados de forma segura
- Validación de formato de tokens
- No exposición de datos sensibles en logs
- Manejo seguro de variables de entorno

### Escalabilidad

- Estructura modular que permite fácil extensión
- Sistema de tipos que facilita mantenimiento
- Componentes reutilizables que reducen duplicación
- Configuración centralizada para cambios globales

Este proyecto demuestra una implementación profesional de un portfolio moderno con mejores prácticas de desarrollo, arquitectura escalable y experiencia de usuario optimizada.