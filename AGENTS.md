<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

# Chokur System — AI Agent Instructions

## Project overview

Chokur is a Kenyan secondary school KCSE academic ledger. Teachers enter marks once; the system computes KCSE 12-point grades, ranks classes, analyses subjects, and prints official report cards — offline-first with IndexedDB + localStorage.

- **Live**: https://chokursystem.vercel.app
- **Repo**: https://github.com/tchukor/scope-to-launch
- **15 views** across three roles: Admin (15), Teacher (10), Parent (3)
- **TanStack Start** + React 19 + TanStack Router, Nitro/Vercel preset
- **Offline-first**: IndexedDB + localStorage dual-write, Service Worker v3 (cache-first)
- **Tests**: Vitest 4, 22 passing
- **Design**: WCAG 2.2 AA "Archival Academic Warmth" tokens in `src/styles.css`

## Key files

| File                                        | Purpose                                                 |
| ------------------------------------------- | ------------------------------------------------------- |
| `src/routes/index.tsx`                      | TanStack Router route definitions                       |
| `src/chokur/App.tsx`                        | App shell, layout, view routing, ProtectedView wrapping |
| `src/chokur/context/GradingContext.tsx`     | Unified provider composing all 7 sub-contexts           |
| `src/chokur/context/NavigationContext.tsx`  | activeView, activeStream, activeExam, hash routing      |
| `src/chokur/context/RoleContext.tsx`        | role, canSee, homeFor, loadRole, saveRole               |
| `src/chokur/context/DataContext.tsx`        | students, subjects, streams, exams, terms, marks CRUD   |
| `src/chokur/context/MarksContext.tsx`       | updateMark, batchUpdateMarks, CSV import/export         |
| `src/chokur/context/SchoolContext.tsx`      | schoolConfig, teacherProfile, whatsAppMessages          |
| `src/chokur/context/ComputedContext.tsx`    | rankings, filteredStudents, averages, gradeDistribution |
| `src/chokur/context/PersistenceContext.tsx` | saveStatus, forceSave, IndexedDB sync                   |
| `src/chokur/utils/grading.ts`               | KCSE grade calculation (12-point, best-7 /84)           |
| `src/chokur/utils/roles.ts`                 | RBAC — canSee, homeFor, role definitions                |
| `src/chokur/types/index.ts`                 | Shared TypeScript types                                 |
| `src/styles.css`                            | Design tokens (CSS custom properties)                   |
| `src/chokur/views/*.tsx`                    | 15 view components                                      |

## Coding conventions

- **Components**: `React.forwardRef` for UI primitives, `React.FC` for views, `displayName` set
- **Hooks**: Always call hooks unconditionally at the top of components (fix conditional `useId` by generating then overriding)
- **Type imports**: Use `import type { ... }` for type-only imports
- **No `@ts-nocheck`** in new files; existing ones are grandfathered
- **CRLF line endings** — do not normalize
- **useEffect deps**: Include all referenced values; wrap callbacks in `useCallback` when used in deps
- **Empty catch blocks**: Add a comment, never `catch {}`

## Folder conventions

- UI primitives → `src/chokur/components/ui/` (barrel: `index.ts`)
- Data display → `src/chokur/components/data-display/`
- Forms → `src/chokur/components/forms/`
- Layout → `src/chokur/components/layout/`
- Modals → `src/chokur/components/modals/`
- States → `src/chokur/components/states/`
- Brand → `src/chokur/components/brand/`
- Tests → `src/chokur/utils/__tests__/`

## Common tasks

**Add a new view**:

1. Create component in `src/chokur/views/`
2. Add route in `src/routes/index.tsx`
3. Add nav item in `src/chokur/components/layout/Sidebar.tsx`
4. Register in `canSee()` in `src/chokur/utils/roles.ts`
5. Wrap with `ProtectedView` if role-gated

**Change grading scale**: Edit `src/chokur/utils/grading.ts`, update `src/chokur/types/index.ts` if needed, run `npm run test`

**Modify RBAC**: Edit `src/chokur/utils/roles.ts` (`canSee`) and `NavigationContext.tsx` (`homeFor`)

**Add a context provider**: Create in `src/chokur/context/`, compose in `GradingContext.tsx`, prefer `useGrading()` over direct context hooks

## Verification

Before any PR or push, run:

```sh
npm run build    # must exit 0
npm run test     # 22 tests must pass
npm run lint     # 0 errors (warnings acceptable)
```

Do not push if any of these fail. The Vercel deployment auto-deploys from `main`.
