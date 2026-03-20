# GeoLab DataView

[![Build](https://github.com/nstseek/geolab-dataview/actions/workflows/build.yml/badge.svg)](https://github.com/nstseek/geolab-dataview/actions/workflows/build.yml)
[![Test](https://github.com/nstseek/geolab-dataview/actions/workflows/test.yml/badge.svg)](https://github.com/nstseek/geolab-dataview/actions/workflows/test.yml)
[![Vercel](https://img.shields.io/badge/Vercel-Live-brightgreen?logo=vercel&logoColor=white)](https://geolab-dataview-cbgo.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern geotechnical data management and news aggregation platform built with React 19, TypeScript, and Material UI. Upload, edit, validate, and export soil sample data — and stay up to date with regional geo-science news — all in one responsive, accessible interface.

**Live demo:** [geolab-dataview-cbgo.vercel.app](https://geolab-dataview-cbgo.vercel.app/)

---

## Requirements Delivered

Every requirement from the original specification is implemented:

- **Multi-page SPA** with Home, Samples, and News pages, all in React 19 + TypeScript
- **Global side menu** with links to every page, always visible on desktop
- **Dynamic page header** reflecting the active context — file name, row/filter counts, selected region, article title — exactly as specified
- **Samples page** — CSV upload, editable table with all five columns, default values for Correction Factor (5%) and Porosity (30%), two derived read-only columns with the correct formulas, filter by Sample ID, Auto Recalculate toggle with manual Recalculate button, and a live summary bar (avgMoisture, avgDensity, totalSamples)
- **News page** — newsdata.io integration filtered by Environment/Science/Technology, search input, country selector, top 10 articles with title/date/language/publisher, and a detail modal
- **Unit tests** covering the core business logic (formulas, CSV parsing, state management, layout)
- **MUI** as the UI framework (listed as a plus in the spec)
- **Responsive design** (listed as a plus)
- **Accessibility** (listed as a plus)
- **Minimal dependencies** — every library justified, built-in solutions used where sufficient
- **README** with setup instructions and architectural design choices

---

## Beyond the Requirements

The following features and decisions were not asked for in the specification but were implemented to deliver a polished, production-grade product rather than a bare-minimum prototype.

### Security

- **API key protection via serverless proxy.** The NewsData API key never reaches the browser. A Vercel serverless function (`api/news.ts`) holds the key server-side and proxies requests from the frontend. A custom Vite plugin mirrors this behavior locally during development. The result: the key is invisible in the network tab, regardless of environment.

### Developer Experience

- **CI/CD pipeline.** GitHub Actions workflows for build and test run on every push and pull request, with live status badges in this README.
- **React Fast Refresh–aware file structure.** Files are deliberately split to preserve instant component hot-reloading during development — separating React components from non-component exports (context definitions, constants, column configs) so Fast Refresh never falls back to a full page reload.
- **Path aliases.** TypeScript path aliases (`@api/`, `@hooks/`, `@queries/`, etc.) eliminate fragile relative imports and make refactoring painless.

### User Experience

- **CSV export.** Users can export their current dataset back to CSV — a natural complement to import that closes the data workflow loop.
- **Sample CSV download.** A downloadable sample file is available directly from the toolbar, removing friction for anyone wanting to try the Samples page without preparing their own data.
- **DataGrid column filters.** Beyond the required Sample ID filter, users can filter, sort, and organize data through the DataGrid's built-in column menu — with accurate header counts reflecting all active filters simultaneously.
- **Skeleton loading states.** The News article list renders animated skeletons while data is loading, providing visual feedback instead of a blank screen.
- **Toast notifications.** Every user action (import, export, errors) produces non-blocking toast feedback via Sonner.

### Accessibility

The spec listed accessibility as a "plus" with no specifics. The implementation goes deep:

- **Skip-to-content link** — keyboard users can bypass the sidebar and jump directly to the main content
- **ARIA landmarks** — the sidebar renders as a `<nav aria-label="Main navigation">` landmark, the summary bar as a `<section aria-label="Data summary">`
- **`aria-current="page"`** on active navigation items
- **`aria-labelledby`** on the article detail modal, with `role="dialog"` and `aria-modal`
- **`aria-expanded`** and `aria-controls` on the mobile hamburger button
- **`document.title`** updates on every navigation, keeping browser tabs and screen readers in sync
- **Decorative elements** (`/` separator, section labels) marked `aria-hidden` to reduce noise

### Responsive Design

The spec listed responsive design as a "plus." The implementation covers the full layout:

- **Collapsible sidebar** — switches from a permanent drawer to a temporary overlay below the `md` breakpoint, with a hamburger toggle in the header
- **Responsive content padding** — tighter on mobile, wider on desktop
- **Full-width toolbar inputs** on small screens with natural wrapping
- **Header breadcrumb** hides on extra-small screens to save space

### Architecture

- **Production-grade query layer** — TanStack React Query with centralized cache keys, configurable stale time, placeholder data for seamless transitions, and automatic retries. Intentionally chosen over React 19's new `use()` hook because it provides a strictly superior feature set for this use case.
- **Zod validation at the boundary** — every imported CSV row is validated against a typed schema before entering the application state, catching bad data early with clear error messages.
- **Feature-scoped folder structure** — page-specific code lives inside its page folder; only genuinely shared code lives in top-level directories. This scales without polluting shared namespaces.

---

## Getting Started

### Prerequisites

- Node.js 22+ (you can run `nvm use` since this project has a .nvmrc)
- npm

### Installation

```bash
git clone <repo-url>
cd geolab-dataview
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
NEWSDATA_API_KEY=your_newsdata_api_key_here
```

You can obtain a free API key at [newsdata.io](https://newsdata.io/).

> This variable is only required for running the News feature locally. The Samples page works without it.

### Running Locally

```bash
npm run dev
```

The dev server starts at `http://localhost:5173`. Vite's custom middleware proxies `/api/news` requests locally, injecting the API key from `.env` on the server side — so the key never reaches the browser, even during development.

### Building for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Running Tests

```bash
npm test
```

Tests run via Vitest with jsdom, using React Testing Library for component tests. Test files live alongside their source files (`*.test.ts`, `*.test.tsx`).

---

## Architecture

### Project Structure

```
src/
├── api/                          # Axios client instance and API methods
│   ├── client.ts                 # Configured Axios instance (base URL, timeout, interceptors)
│   └── news.ts                   # News endpoint methods
├── components/
│   └── layout/                   # App shell: Header, Sidebar, Layout wrapper
├── context/
│   └── HeaderContext/            # Dynamic page title context
│       ├── context.ts            # Context definition
│       ├── hook.ts               # useHeader context hook
│       ├── provider.tsx          # HeaderProvider component
│       └── index.ts              # Public barrel export
├── hooks/
│   └── useDebouncedState.ts      # Generic debounced state hook (shared across pages)
├── pages/
│   ├── Home.tsx                  # Homepage rendering cards that lead to feature pages
│   ├── News/                     # News feature
│   │   ├── NewsArticleList.tsx   # Article list with skeletons and metadata
│   │   ├── NewsArticleDetail.tsx # Article detail modal
│   │   └── NewsToolbar/          # Search and country filter controls
│   │       ├── index.tsx         # Toolbar component
│   │       └── countries.ts      # Country list constant
│   └── Samples/                  # Samples feature
│       ├── components/           # Page-scoped UI (toolbar, summary bar)
│       ├── hooks/                # Page-scoped state logic (useSamplesRows)
│       └── utils/                # Page-scoped utilities
│           ├── calc.ts           # Geotechnical formulas
│           ├── csv.ts            # CSV import/export with PapaParse
│           ├── validationSchema.ts # Zod schema + row defaults
│           └── columns/          # DataGrid column definitions
│               ├── index.tsx     # Column config array
│               ├── ComputedHeader.tsx  # Read-only column header
│               ├── EditCellWithTooltip.tsx # Edit cell with validation tooltip
│               └── constants.ts  # Shared constants (cell class names)
├── queries/                      # React Query layer
│   ├── queryKeys.ts              # Centralized query key factory
│   └── news/                     # News query hook and response types
├── test/
│   └── setup.ts                  # Vitest + Testing Library setup
├── App.tsx                       # Route definitions
├── theme.ts                      # MUI theme (palette, typography, component overrides)
└── main.tsx                      # Entry point

api/                              # Vercel serverless functions (project root)
└── news.ts                       # Proxies NewsData API, injects API key server-side
```

### Design Decisions

**Feature-scoped organization.** Each route/page has its own folder. Components, hooks, and utilities that are specific to a page live inside that page's directory (e.g., `pages/Samples/hooks/`, `pages/Samples/utils/`). Shared code that is reusable across the entire application — like `useDebouncedState` or the layout components — lives in top-level folders (`hooks/`, `components/`). This prevents shared folders from becoming dumping grounds and makes it immediately obvious which code belongs to which feature.

**API and query separation.** The `api/` folder holds a configured Axios instance and plain async functions — one per endpoint — that know nothing about caching or React. The `queries/` folder wraps those functions with TanStack React Query hooks, adding features like stale time configuration, placeholder data for seamless transitions, automatic retries, and cache invalidation. A centralized `queryKeys.ts` factory ensures consistent and collision-free cache keys as the number of queries grows. This two-layer split means adding a new API endpoint is just adding a function in `api/` and a hook in `queries/` — the pattern scales cleanly.

**React Context over heavy state managers.** The app uses React's built-in Context API for cross-cutting concerns like the dynamic header. Contexts are lightweight, come ready to use with zero extra dependencies, and fully meet the needs of this application without the overhead of external state libraries. Server state is handled by React Query; component state stays local in hooks.

**Custom hooks for separation of concerns.** Complex logic is extracted into focused hooks. `useSamplesRows` encapsulates all row state management (CRUD, filtering, summary computation, row processing) and exposes a clean interface to the page component. `useDebouncedState` provides a reusable debounce pattern shared between the News search and the Samples filter. This keeps page components thin and focused on rendering.

**React Fast Refresh–friendly file structure.** Vite's React Fast Refresh enables near-instant feedback during development — when you edit a component, only that component re-renders without losing page state. For Fast Refresh to work reliably, each file should export only React components or only non-component values, not a mix of both. This is why `HeaderContext` is split into separate files for the context definition, the provider component, and the hook, and why `utils/columns` has its own folder separating `ComputedHeader` and `EditCellWithTooltip` components from the column configuration array and constants. This discipline keeps the development loop fast and eliminates a class of "why didn't my change show up?" issues during development.

**CSV import/export as a first-class feature.** Users can upload their own CSV, but can also download a sample CSV directly from the toolbar — removing friction for first-time users who want to explore the Samples page immediately. PapaParse handles both parsing and generation, with Zod validation on every imported row to catch bad data at the boundary.

### On Dependencies

The original specification asked for minimal dependencies. This project embraces that principle without taking it to an extreme that creates more problems than it solves. Every dependency listed in the technology stack exists because the alternative — writing it from scratch — would mean maintaining thousands of lines of code reimplementing CSV parsing, data grid rendering, schema validation, date formatting, toast notifications, or HTTP retry logic. That is not simplicity; it is a maintenance nightmare.

Each library was chosen because it is battle-tested, relied upon by millions of users and downloaded millions of times weekly, and actively maintained by dedicated open-source teams. PapaParse handles CSV edge cases that would take weeks to discover on our own. Zod provides composable validation with first-class TypeScript inference. MUI DataGrid ships inline editing, column filtering, sorting, and pagination that would be an entire project to build from scratch. Using these libraries means fewer bugs, less surface area to maintain, and more time spent on the actual product.

Where a simpler built-in solution was sufficient, we used it — React Context instead of Redux, local component state instead of a global store, native `URLSearchParams` instead of a query-string library. The result is a dependency list where every entry pulls its weight and nothing is redundant.

### On React 19

This project runs on React 19 and takes advantage of the improvements that directly benefit the codebase:

- **React Compiler** — automatic memoization at build time, eliminating the need for manual `useMemo`, `useCallback`, and `React.memo` wrappers throughout the component tree. This produces cleaner, more readable code with the same (or better) render performance.
- **`ref` as a regular prop** — no more `forwardRef` boilerplate for components that need to expose a DOM reference.
- **`<Context value={...}>`** — the simplified Context provider syntax, removing the `.Provider` suffix across the codebase.
- **Native `<title>` and `<meta>` support** — metadata can be rendered from any component without third-party helmet libraries.

React 19 also introduces `use()` for reading Promises and Context inline, along with `useActionState`, `useFormStatus`, and `useOptimistic` for form-based mutation patterns. We intentionally chose not to adopt these for data fetching in this project. Our TanStack React Query setup provides caching, stale time management, background refetching, automatic retries, placeholder data, and centralized cache key management — a production-grade architecture used by thousands of companies in applications serving millions of users daily. Replacing it with raw `use(Promise)` and Suspense would mean giving up all of those features or rebuilding them by hand, which contradicts the dependency philosophy above. The new hooks are powerful primitives, but React Query builds a strictly superior developer experience on top of them for this use case.

### Infrastructure

**Vercel** hosts both the static SPA frontend and the serverless function that proxies the NewsData API. This architecture solves two problems at once:

1. **API key security.** The `NEWSDATA_API_KEY` environment variable is configured in Vercel's dashboard and only accessed by the serverless function (`api/news.ts`). It never ships to the browser or appears in network requests — the frontend calls `/api/news`, and the serverless function appends the key server-side before forwarding to NewsData.

2. **SPA routing.** Since this is a single-page application with client-side routes, direct navigation to `/samples` or `/news` would 404 without server-side configuration. The `vercel.json` rewrites rule catches all non-API paths and serves `index.html`, letting React Router handle routing.

**Local development** mirrors this setup through a custom Vite plugin (`newsProxyPlugin`) that intercepts `/api/news` requests and injects the API key from `.env` — same security model, no separate backend process required.

### Technology Stack

| Layer        | Technology                             | Purpose                                                    |
| ------------ | -------------------------------------- | ---------------------------------------------------------- |
| Framework    | **React 19** + **TypeScript**          | UI components with full type safety                        |
| Build        | **Vite**                               | Dev server, HMR, production bundling, test runner host     |
| Routing      | **React Router 7**                     | Client-side SPA routing with nested layouts                |
| UI Library   | **Material UI 7**                      | Component library, theming, responsive breakpoints         |
| Data Grid    | **MUI X DataGrid**                     | Inline editing, column filtering, sorting, pagination      |
| Server State | **TanStack React Query**               | Caching, stale time management, automatic refetching       |
| HTTP Client  | **Axios**                              | Typed API calls, interceptors, timeout handling            |
| CSV          | **PapaParse**                          | Parse uploaded CSVs and generate exports                   |
| Validation   | **Zod**                                | Row-level schema validation on CSV import and inline edits |
| Dates        | **Day.js**                             | Lightweight date formatting for article timestamps         |
| Toasts       | **Sonner**                             | Non-blocking user feedback on actions and errors           |
| Debouncing   | **Lodash**                             | `debounce` for search input to avoid excessive API calls   |
| IDs          | **uuid**                               | Generate UUIDs for sample rows imported without an ID      |
| Testing      | **Vitest** + **React Testing Library** | Unit and component tests with jsdom                        |
| Hosting      | **Vercel**                             | Static hosting + serverless functions                      |
| API          | **NewsData.io**                        | Real-time news aggregation by country, category, keyword   |

---

## Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR              |
| `npm run build`   | Type-check with `tsc` and bundle for production |
| `npm run preview` | Serve the production build locally              |
| `npm run lint`    | Run ESLint across the project                   |
| `npm test`        | Run Vitest in watch mode                        |
