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

- The migrated Chokur app lives verbatim in src/chokur and renders client-only from src/routes/index.tsx; it is offline-first (IndexedDB/localStorage), so keep it out of SSR.

## UI Design System

- **Spec Document**: `doc/ui-design-spec.md` — Single source of truth for design tokens, component registry, layout architecture, and implementation guidelines
- **Component Solution**: shadcn/ui v4 (Radix UI + Tailwind CSS v4) — 44 components in `src/components/ui/`
- **Custom Components**: 7 Chokur-specific components in `src/chokur/components/`
- **Showcase Routes**:
  - `/ui-showcase` — Interactive dashboard demo (Overview, Marks Entry, Rankings, Report Cards, Grade Distribution, Students, Subject Analysis, Settings)
  - `/ui-components` — Complete component library with all variants and states
- **Design Tokens**: Defined in `src/styles.css` (CSS variables) with light/dark mode support
- **Typography**: Inter (UI) + JetBrains Mono (data) + Material Symbols Outlined (icons)
- **Color Palette**: Warm cream/beige (light) / deep warm gray (dark) with burnt orange/terracotta primary
