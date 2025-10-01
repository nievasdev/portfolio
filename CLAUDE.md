# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run build` - Build static site for production
- `npm run dev` - Start development server
- `npm run start` - Preview production build
- `npm run lint` - Run Astro check

### Node.js Version
- Requires Node.js 20+ 
- Use `nvm use 20.0.0` to set correct version

## Architecture Overview

### Project Structure
This is an **Astro 5 portfolio** featuring a **fully static** 3-column grid layout:

- **Left Column**: Work experience (`WorksColumn`)
- **Center Column**: Personal info (`MeSectionCompact`) with GitHub contributions
- **Right Column**: Personal projects (`ProjectsColumn`)

### Key Architectural Patterns

**Data Management**: Astro Content Collections for static data
- Work experience data in `src/content/works/` (en.json, es.json)
- Project data in `src/content/projects/` (en.json, es.json)
- All data is loaded at build time and pre-rendered for optimal performance

**Component Architecture**:
- Astro components for optimal performance and zero JavaScript by default
- Static site generation with NO client-side interactivity
- Responsive design with CSS Grid and Tailwind CSS

**Static GitHub Integration**:
- No API calls - all GitHub activity is simulated with realistic patterns
- Static contribution chart with proper visualization
- No runtime dependencies on external services

### Configuration Details

**Build Configuration**:
- Full static output (`output: 'static'` in `astro.config.mjs`)
- Optimized for deployment on static hosting platforms
- Inlined stylesheets for maximum performance

**Styling System**:
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Dark theme by default with custom CSS variables
- Responsive typography and layouts
- Custom scrollbar styling

**Content Collections**:
- TypeScript schema validation for content integrity
- Multilingual support (English/Spanish)
- JSON-based data structure for easy maintenance

### Static Generation Benefits
- **Zero JavaScript runtime** - Pure HTML/CSS delivery
- **Lightning fast** load times
- **SEO optimized** - All content pre-rendered
- **Hosting flexibility** - Deploy to any static host
- **Maximum security** - No server-side vulnerabilities

### Data Types
Core TypeScript interfaces defined in content schema:
- `Work` - Work experience with projects and technologies
- `Project` - Personal projects with GitHub links
- All interfaces validated at build time

### Theme Implementation
- Dark theme with CSS custom properties
- Consistent color palette throughout the application
- Responsive design patterns
- Optimized for both desktop and mobile viewing

## Development Notes

### Static-First Approach
All functionality is implemented as static generation. No client-side JavaScript is used, ensuring maximum performance and compatibility.

### Content Updates
To update work experience or projects, modify the JSON files in `src/content/`. Changes are reflected immediately in development and included in the next build.

### Responsive Behavior
- Desktop: 3-column grid layout
- Tablet/Mobile: Single column stacked layout
- All layouts are CSS-based with no JavaScript dependencies

### Performance Optimization
- Static site generation for instant loading
- Optimized images and assets
- Minimal CSS with Tailwind's utility classes
- No external runtime dependencies

### Migration Notes
This project was migrated from Next.js to Astro, converting all React components to Astro components and eliminating all client-side JavaScript while maintaining the same visual design and functionality.