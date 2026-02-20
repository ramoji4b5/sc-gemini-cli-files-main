# TechStack Conference 2026 - Instructional Context

This project is a modern web application for the **TechStack Conference 2026**, a fictitious AI event. It is built with React 19, TypeScript, and Vite, emphasizing performance, accessibility, and a modern developer experience.

## Project Overview

*   **Purpose:** A comprehensive informational and registration platform for a technical conference.
*   **Core Stack:**
    *   **Framework:** React 19
    *   **Build Tool:** Vite 7
    *   **Language:** TypeScript 5.9
    *   **Styling:** Tailwind CSS 4 (with PostCSS & Autoprefixer)
    *   **Routing:** React Router 7
    *   **Animations:** Framer Motion
    *   **Icons:** Lucide React
    *   **Testing:** Vitest & React Testing Library

## Building and Running

*   **Development:** `npm run dev`
    Starts the Vite development server with HMR.
*   **Production Build:** `npm run build`
    Performs type-checking with `tsc` and bundles the application for production.
*   **Testing:** `npm run test`
    Executes unit and component tests using Vitest.
*   **Linting:** `npm run lint`
    Checks the codebase for style and quality issues using ESLint.
*   **Preflight:** `npm run preflight`
    A convenience script that runs linting, tests, and a production build in sequence. Highly recommended before pushing changes.

## Development Conventions

### 1. Architecture & Routing
*   **Centralized Lazy Loading:** All routed components are lazy-loaded through `src/lazyLoad.ts` to optimize initial bundle size. Use the `prefetch` pattern in `Layout.tsx` and `Home.tsx` to load modules on hover.
*   **Directory Structure:**
    *   `src/components/`: Shared UI elements (e.g., `Layout`, `Loading`, `ParticleBackground`).
    *   `src/pages/`: Main view components associated with routes.
    *   `src/data/`: Static data stores (e.g., `sessions.ts`, `features.ts`) used to populate the UI.
    *   `src/lazyLoad.ts`: Central registry for dynamic imports.

### 2. Styling & Theme
*   **Tailwind CSS 4:** Uses the latest Tailwind features. Utility classes are the primary way to style components.
*   **Dark Mode:** Implemented using the `class` strategy. The `Layout` component manages theme state and applies the `dark` class to `document.documentElement`.

### 3. Testing Standards
*   **Colocation:** Test files should be placed alongside the components they test, using the `.test.tsx` suffix.
*   **Environment:** Configured with `jsdom` via Vitest.
*   **Verification:** Ensure all new features or bug fixes include corresponding tests in `vitest`.

### 4. Code Quality
*   **Strict Typing:** Maintain strict TypeScript definitions, especially for data models in `src/data/`.
*   **Linting:** Follow the ESLint configuration defined in `eslint.config.js`.

## Key Files
*   `src/App.tsx`: Main routing configuration.
*   `src/components/Layout.tsx`: The primary UI wrapper containing navigation and theme logic.
*   `src/data/sessions.ts`: The schema and data for conference sessions (currently holds placeholders).
*   `vite.config.ts`: Vite build and plugin configuration.
