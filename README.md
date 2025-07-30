# Portfolio Next.js

Portfolio personal migrado de Astro a Next.js 15 con todas las funcionalidades originales.

## 🚀 Características

- **Next.js 15** con App Router
- **TypeScript** completo
- **Tailwind CSS** con tema personalizado "spacial"
- **Custom UI Library** (reemplaza NextUI)
- **Responsive Design** completo
- **Animaciones suaves** con CSS y Framer Motion
- **GitHub API** integración en tiempo real
- **Dark theme** por defecto
- **Layout de 3 columnas** idéntico al original

## 🛠️ Tecnologías

- Next.js 15.4.4
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- next-themes
- @octokit/core

## 📦 Instalación

```bash
# Usar Node.js 20+
nvm use 20.0.0

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🌐 Desarrollo

El servidor de desarrollo corre en: http://localhost:3000

## 📁 Estructura

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── ui/             # Biblioteca UI personalizada
│   ├── icons.tsx       # Iconos SVG
│   └── ...
├── hooks/              # Custom hooks
├── lib/                # Utilidades y datos
├── providers/          # Providers de contexto
├── types/              # Definiciones TypeScript
└── styles/             # Estilos globales
```

## 🎨 Componentes Principales

- **Navbar** - Navegación con menú móvil
- **ChangingContentAnimation** - Animación del nombre
- **MeSectionCompact** - Información personal
- **WorksColumn** - Experiencia laboral
- **ProjectsColumn** - Proyectos personales
- **UI Library** - Componentes reutilizables

## 🚀 Deployment

El proyecto está optimizado para deployment en Vercel, Netlify o cualquier plataforma que soporte Next.js.

## 📱 Responsive

- **Desktop**: Grid de 3 columnas
- **Tablet**: Layout adaptativo  
- **Mobile**: Columna única con menú hamburguesa

## 🎯 Migración Completada

✅ Todas las funcionalidades del portfolio original en Astro han sido migradas exitosamente a Next.js
✅ Diseño idéntico y responsive
✅ Componentes UI personalizados funcionando
✅ Animaciones y transiciones preservadas
✅ GitHub API integrado
✅ Build y desarrollo funcionando correctamente
