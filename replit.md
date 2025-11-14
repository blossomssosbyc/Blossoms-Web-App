# Blossoms 2024 Event Platform

## Overview

Blossoms 2024 is an event management and analytics platform for Christ University Yeshwanthpur's School of Sciences annual event. The platform provides event browsing, department performance tracking, timeline visualization, photo galleries, and custom report generation capabilities. Built as a modern web application, it combines academic credibility with vibrant event energy through a clean, data-driven interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing instead of React Router
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Design system follows "Science meets celebration" principle - balancing professional academic credibility with event energy

**Typography & Design**
- Primary fonts: Inter for headings/body, JetBrains Mono for data/metrics
- Custom spacing system using Tailwind units (4, 6, 8, 12, 16, 24)
- Color palette based on HSL custom properties for theming
- Glassmorphism effects for navigation (backdrop-blur with semi-transparent backgrounds)

**State Management Strategy**
- React Query for async/server state with infinite stale time by default
- Local React state (useState) for UI-only state
- No global state management library (Redux/Zustand) - kept intentionally simple

**Key UI Patterns**
- Card-based layouts with hover elevation effects
- Responsive grid systems (2-column tablet, 3-4 column desktop)
- Masonry-style gallery with lightbox
- Alternating timeline layout
- Dashboard with stat cards and data visualizations using Recharts

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- HTTP server created via Node's built-in `http.createServer()`
- Custom middleware for JSON parsing, logging, and request timing
- Development mode integrates Vite middleware for HMR

**API Design**
- RESTful API endpoints prefixed with `/api`
- Routes registered through `registerRoutes()` function
- Response logging truncated at 80 characters for readability
- All routes currently placeholder - no implemented endpoints yet

**Data Layer**
- Currently using in-memory storage (`MemStorage` class) as placeholder
- Storage interface (`IStorage`) defines CRUD operations for users
- Designed to be swapped with database implementation (Drizzle ORM configured)

**Session Management**
- Prepared for PostgreSQL session store via `connect-pg-simple`
- Session middleware not yet implemented but dependencies installed

### Database Architecture

**ORM & Schema**
- Drizzle ORM configured for PostgreSQL dialect
- Schema defined in `shared/schema.ts` for code sharing between client/server
- Zod integration via `drizzle-zod` for runtime validation
- Migration system configured (output to `./migrations` folder)

**Database Provider**
- Neon serverless PostgreSQL (`@neondatabase/serverless`)
- Connection via `DATABASE_URL` environment variable
- Database not yet provisioned but configuration complete

**Current Schema**
- Users table with UUID primary keys, username, and password fields
- Schema uses `gen_random_uuid()` for default ID generation
- Unique constraint on username field

**Migration Strategy**
- `drizzle-kit push` command for schema synchronization
- Migrations stored separately from application code
- Schema changes tracked through migration files

### Project Structure

**Monorepo Organization**
- `/client` - Frontend React application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Route-level page components
  - `/src/lib` - Utilities (query client, cn helper)
  - `/src/hooks` - Custom React hooks
- `/server` - Backend Express application
  - `routes.ts` - API route definitions
  - `storage.ts` - Data access layer
  - `vite.ts` - Vite integration for development
- `/shared` - Code shared between client/server (schema, types)
- `/attached_assets` - Static assets and images

**Path Aliases**
- `@/` maps to `client/src/`
- `@shared/` maps to `shared/`
- `@assets/` maps to `attached_assets/`

### Build & Deployment

**Development Workflow**
- `npm run dev` - Runs Express server with Vite middleware in development mode
- Vite handles HMR and serves React application
- TypeScript compilation check via `npm run check` (no emit)

**Production Build**
- `npm run build` - Two-step process:
  1. Vite builds client to `dist/public`
  2. esbuild bundles server to `dist/index.js`
- Server bundled as ESM with external packages
- `npm start` runs production build with `NODE_ENV=production`

**Deployment Considerations**
- Designed for Replit deployment (Replit-specific plugins in Vite config)
- Static assets served from `dist/public` in production
- Development banner and cartographer plugins conditionally loaded

## External Dependencies

### UI Component Libraries
- **Radix UI** - Headless accessible component primitives (accordion, dialog, dropdown, tooltip, etc.)
- **shadcn/ui** - Pre-built component implementations using Radix UI
- **Lucide React** - Icon library for consistent iconography
- **GSAP** - Animation library for FlowingMenu component interactions

### Data Visualization
- **Recharts** - Chart library for bar charts, line graphs, pie charts in dashboard and analytics pages
- Built on D3.js for robust data visualization

### Form Management
- **React Hook Form** - Form state management and validation
- **@hookform/resolvers** - Validation resolver integration
- **Zod** - Schema validation for forms and API data

### Styling & CSS
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing with autoprefixer
- **class-variance-authority** - Type-safe component variants
- **clsx** + **tailwind-merge** - Class name composition utility

### Database & ORM
- **Drizzle ORM** - TypeScript ORM for PostgreSQL
- **@neondatabase/serverless** - Neon PostgreSQL driver
- **drizzle-kit** - CLI for migrations and schema management
- **drizzle-zod** - Zod schema generation from Drizzle schemas

### Development Tools
- **TypeScript** - Type safety across entire stack
- **Vite** - Build tool and dev server
- **esbuild** - Fast JavaScript bundler for production server build
- **tsx** - TypeScript execution for development server

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal** - Error overlay for development
- **@replit/vite-plugin-cartographer** - Development tool (conditional)
- **@replit/vite-plugin-dev-banner** - Development banner (conditional)

### Utilities
- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel/slider functionality

### Session Management (Configured but Not Active)
- **connect-pg-simple** - PostgreSQL session store for Express
- Prepared for future authentication implementation