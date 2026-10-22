# Code Navigation Guide — Chokur System

Quick reference for developers working on the Chokur codebase.

---

## I want to add a new view

1. Create the view component in `src/chokur/views/NewViewName.tsx`
2. Add a route entry in `src/routes/index.tsx` (TanStack Router file-based routing)
3. Add navigation item in `src/chokur/components/layout/Sidebar.tsx`
4. Register the view in RBAC (`src/chokur/utils/roles.ts` — `canSee(role, viewName)`)
5. Add the view to `homeFor(role)` in `NavigationContext.tsx` if it should be a role's home
6. Wrap with `ProtectedView` if role-based access is needed

---

## I need to add a new computed selector

1. Add the selector function to `src/chokur/context/ComputedContext.tsx`
2. Export it from the `ComputedProvider` value
3. Consume via `useGrading()` in any view (the unified hook composes all contexts)
4. Add tests in `src/chokur/utils/__tests__/`

---

## I want to change the grading scale

1. Edit KCSE grade boundaries in `src/chokur/utils/grading.ts` (e.g. `getGradeFromScore`)
2. Update type definitions in `src/chokur/types/index.ts` if grade types change
3. Re-run `npm run test` to verify grading tests still pass
4. The `best-7 aggregate /84` calculation is in the same utils file

---

## I need to modify RBAC roles

1. Edit `src/chokur/utils/roles.ts` — `canSee(role, viewName)` controls view access
2. Update `homeFor(role)` in `NavigationContext.tsx` for role-specific home views
3. Three roles exist: `Admin` (15 views), `Teacher` (10 views), `Parent` (3 views)
4. Views are wrapped with `<ProtectedView requiredRole={...}>` in `App.tsx`

---

## I want to add a new export format (CSV, PDF, etc.)

- **CSV**: Add import/export functions in `src/chokur/context/MarksContext.tsx`
- **PDF**: Report card generation is in `src/chokur/views/ReportCardsView.tsx` using html2canvas + jsPDF

---

## I want to add a new component

- **Base UI primitive**: `src/chokur/components/ui/` (shadcn/ui pattern — Button, Input, etc.)
- **Data display**: `src/chokur/components/data-display/` (DataTable, GradeChip, StatTile, etc.)
- **Form component**: `src/chokur/components/forms/`
- **Layout**: `src/chokur/components/layout/` (Sidebar, TopNavBar, Breadcrumbs)
- **Modal**: `src/chokur/components/modals/`
- **State/empty/error**: `src/chokur/components/states/`
- Export from the appropriate `index.ts` barrel file

---

## I need to modify persistence / offline behavior

- IndexedDB + localStorage dual-write lives in `src/chokur/context/PersistenceContext.tsx`
- Service Worker (cache-first, v3) is in `public/sw.js` — bump cache version on asset changes
- `saveStatus` state tracks save/saving/offline/unsaved states

---

## I want to add a new context provider

1. Create `src/chokur/context/NewContext.tsx` following the existing pattern
2. Add it to the composition in `src/chokur/context/GradingContext.tsx` (unified `GradingProvider`)
3. Export `useNewContext()` hook if direct access is needed (prefer `useGrading()`)
4. Add tests in `src/chokur/utils/__tests__/`

---

## Common commands

| Command          | Purpose                          |
| ---------------- | -------------------------------- |
| `npm run dev`    | Local dev server with HMR        |
| `npm run build`  | Production build (Vercel output) |
| `npm run lint`   | ESLint check                     |
| `npm run test`   | Vitest test suite (22 tests)     |
| `npm run format` | Prettier format all files        |

---

## Key files

| File                                    | Purpose                                       |
| --------------------------------------- | --------------------------------------------- |
| `src/routes/index.tsx`                  | TanStack Router route definitions             |
| `src/chokur/App.tsx`                    | App shell, layout, view routing               |
| `src/chokur/context/GradingContext.tsx` | Unified provider composing all 7 sub-contexts |
| `src/chokur/utils/grading.ts`           | KCSE grade calculation logic                  |
| `src/chokur/utils/roles.ts`             | RBAC — canSee, homeFor, role definitions      |
| `src/chokur/types/index.ts`             | Shared TypeScript types                       |
| `src/styles.css`                        | Design tokens (CSS custom properties)         |
| `nitro.config.ts`                       | Nitro/Vercel build configuration              |
| `vercel.json`                           | Vercel deployment configuration               |
