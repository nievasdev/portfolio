# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint (note: builds ignore ESLint and TypeScript errors)

### Node.js Version
- Requires Node.js 20+ (as specified in README)
- Use `nvm use 20.0.0` to set correct version

## Architecture Overview

### Project Structure
This is a **Next.js 15 portfolio** migrated from Astro, featuring a **3-column grid layout**:

- **Left Column**: Work experience (`WorksColumn`)
- **Center Column**: Personal info (`MeSectionCompact`) 
- **Right Column**: Personal projects (`ProjectsColumn`)

### Key Architectural Patterns

**Data Management**: Static data approach using TypeScript objects in `src/lib/data.ts`
- Work experience data is private (only accessible via `getWorks()`)
- Project data is private (only accessible via `getProjects()`) 
- All data is loaded at build time in page components

**Component Architecture**:
- Custom UI library in `src/components/ui/` (replaces NextUI)
- Theme system using `next-themes` with default dark theme
- Responsive design with CSS Grid and Tailwind

**GitHub Integration**:
- Real-time GitHub API integration for contributions
- Fallback system: authenticated API → public API → realistic simulation
- GitHub token managed through environment variables (`GITHUB_TOKEN`)

### Configuration Details

**Build Configuration**:
- TypeScript and ESLint errors are ignored during builds (`next.config.ts`)
- Custom ESLint config using FlatCompat for Next.js rules

**Styling System**:
- Tailwind CSS with custom "spacial" theme
- CSS organized in `/src/styles/` with modular approach:
  - `components/` - Component-specific styles
  - `layout/` - Grid and responsive styles  
  - `utilities/` - Colors, spacing, typography

**Path Aliases**:
- `@/*` maps to `./src/*` for clean imports

### Environment Variables
- `GITHUB_TOKEN` - GitHub Personal Access Token for API access
- Token validation checks for `ghp_` or `github_pat_` prefixes
- See `.env.example` for setup

### GitHub API Implementation
- **API Route**: `/api/github/contributions` handles GitHub GraphQL queries
- **Service Layer**: `src/services/github-auth.js` manages authentication
- **Public API Fallback**: Uses public GitHub API when token unavailable
- **Contribution Simulation**: Generates realistic contribution patterns based on user profile

### Data Types
Core TypeScript interfaces in `src/types/index.ts`:
- `Work` - Work experience with projects and technologies
- `Project` - Personal projects with GitHub links
- `Blog` - Blog posts (future implementation)

### Theme Implementation
- Dark theme by default with system preference detection
- Theme switching handled by `ThemeProvider` 
- Prevents hydration flash with inline script in layout

## Development Notes

### GitHub Integration Testing
When working with GitHub features, you can test without a token - the system gracefully falls back to simulated data.

### Data Updates
To update work experience or projects, modify the data objects in `src/lib/data.ts`. The system uses static generation, so changes appear immediately in development.

### Responsive Behavior
- Desktop: 3-column grid layout
- Tablet: Layout adapts responsively
- Mobile: Single column with hamburger menu

### Migration Context
This codebase was migrated from Astro to Next.js 15, preserving all original functionality while modernizing the architecture. Some legacy references to Astro collections may remain in comments.