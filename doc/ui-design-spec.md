# Chokur — UI Design Specification

> **Project**: Chokur School Management System  
> **Type**: Web App / SaaS / Dashboard (Kenya KCSE-focused)  
> **Component Solution**: shadcn/ui v4 (Radix UI primitives + Tailwind CSS v4)  
> **Framework**: TanStack Start + React 19 + TypeScript  
> **Last Updated**: 2026-10-20  
> **Spec Version**: 1.0.0

---

## 1. Design Token System

### 1.1 Color Palette (Light Mode)

| Token                               | Value     | Usage                                       |
| ----------------------------------- | --------- | ------------------------------------------- |
| `--color-surface`                   | `#fef9ef` | Primary page background                     |
| `--color-surface-dim`               | `#ded6ca` | Disabled/dimmed surfaces                    |
| `--color-surface-bright`            | `#fef9ef` | Hover/active surface brightening            |
| `--color-surface-container-lowest`  | `#ffffff` | Card backgrounds, modals                    |
| `--color-surface-container-low`     | `#f8f3e9` | Subtle container backgrounds                |
| `--color-surface-container`         | `#f2ede3` | Default container/card background           |
| `--color-surface-container-high`    | `#ede8de` | Elevated containers                         |
| `--color-surface-container-highest` | `#e7e2d8` | Highest elevation containers                |
| `--color-surface-panel`             | `#fbf8f1` | Sidebar, header, panel backgrounds          |
| `--color-hairline-border`           | `#ddd6c7` | Subtle borders, dividers                    |
| `--color-on-surface`                | `#1d1c16` | Primary text on surfaces                    |
| `--color-on-surface-dark`           | `#111111` | High-emphasis text, headings                |
| `--color-secondary`                 | `#5f5e5e` | Secondary text, icons                       |
| `--color-secondary-dark`            | `#5c5850` | Secondary text (darker)                     |
| `--color-text-muted`                | `#9a958a` | Muted/placeholder text                      |
| `--color-primary`                   | `#9b2f00` | Primary brand color (base)                  |
| `--color-primary-container`         | `#c2410c` | Primary actions, active states, focus rings |
| `--color-on-primary`                | `#ffffff` | Text on primary backgrounds                 |

### 1.2 Color Palette (Dark Mode) — _Added in v1.0.0_

| Token                               | Value     | Usage                                       |
| ----------------------------------- | --------- | ------------------------------------------- |
| `--color-surface`                   | `#1a1814` | Primary page background                     |
| `--color-surface-dim`               | `#12110e` | Disabled/dimmed surfaces                    |
| `--color-surface-bright`            | `#23201a` | Hover/active surface brightening            |
| `--color-surface-container-lowest`  | `#141310` | Card backgrounds, modals                    |
| `--color-surface-container-low`     | `#1e1c17` | Subtle container backgrounds                |
| `--color-surface-container`         | `#28251f` | Default container/card background           |
| `--color-surface-container-high`    | `#322e27` | Elevated containers                         |
| `--color-surface-container-highest` | `#3c372f` | Highest elevation containers                |
| `--color-surface-panel`             | `#1f1d18` | Sidebar, header, panel backgrounds          |
| `--color-hairline-border`           | `#3a352d` | Subtle borders, dividers                    |
| `--color-on-surface`                | `#f5f0e6` | Primary text on surfaces                    |
| `--color-on-surface-dark`           | `#ffffff` | High-emphasis text, headings                |
| `--color-secondary`                 | `#b8b3a8` | Secondary text, icons                       |
| `--color-secondary-dark`            | `#c4bfb4` | Secondary text (lighter)                    |
| `--color-text-muted`                | `#8a857a` | Muted/placeholder text                      |
| `--color-primary`                   | `#e07a3a` | Primary brand color (lightened for dark bg) |
| `--color-primary-container`         | `#d96d2e` | Primary actions, active states, focus rings |
| `--color-on-primary`                | `#1a1814` | Text on primary backgrounds                 |

### 1.3 Semantic Color Aliases (shadcn/ui compatibility)

```css
/* Light mode (default) */
:root {
  --background: var(--color-surface);
  --foreground: var(--color-on-surface);
  --card: var(--color-surface-container-lowest);
  --card-foreground: var(--color-on-surface);
  --popover: var(--color-surface-container-lowest);
  --popover-foreground: var(--color-on-surface);
  --primary: var(--color-primary-container);
  --primary-foreground: var(--color-on-primary);
  --secondary: var(--color-surface-container);
  --secondary-foreground: var(--color-on-surface);
  --muted: var(--color-surface-container);
  --muted-foreground: var(--color-text-muted);
  --accent: var(--color-surface-container-high);
  --accent-foreground: var(--color-on-surface);
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --border: var(--color-hairline-border);
  --input: var(--color-hairline-border);
  --ring: var(--color-primary-container);
  --radius: 0.5rem; /* 8px base */
}

/* Dark mode */
.dark {
  --background: var(--color-surface);
  --foreground: var(--color-on-surface);
  --card: var(--color-surface-container-lowest);
  --card-foreground: var(--color-on-surface);
  --popover: var(--color-surface-container-lowest);
  --popover-foreground: var(--color-on-surface);
  --primary: var(--color-primary-container);
  --primary-foreground: var(--color-on-primary);
  --secondary: var(--color-surface-container);
  --secondary-foreground: var(--color-on-surface);
  --muted: var(--color-surface-container);
  --muted-foreground: var(--color-text-muted);
  --accent: var(--color-surface-container-high);
  --accent-foreground: var(--color-on-surface);
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: var(--color-hairline-border);
  --input: var(--color-hairline-border);
  --ring: var(--color-primary-container);
}
```

### 1.4 Typography

| Level           | Font Family    | Size (Mobile) | Size (Desktop) | Line Height | Weight  | Letter Spacing | CSS Class            |
| --------------- | -------------- | ------------- | -------------- | ----------- | ------- | -------------- | -------------------- |
| Display Stat    | JetBrains Mono | 32px          | 36px           | 38px / 44px | 600     | -0.02em        | `.font-display-stat` |
| Headline Large  | Inter          | 28px          | 28px           | 36px        | 600     | -0.02em        | `.font-headline-lg`  |
| Headline Medium | Inter          | 18px          | 18px           | 24px        | 600     | -0.01em        | `.font-headline-md`  |
| Headline Small  | Inter          | 15px          | 15px           | 20px        | 600     | —              | `.font-headline-sm`  |
| Body Medium     | Inter          | 14px          | 14px           | 20px        | 400     | —              | `.font-body-md`      |
| Body Small      | Inter          | 13px          | 13px           | 18px        | 400     | —              | `.font-body-sm`      |
| Caption         | Inter          | 12px          | 12px           | 16px        | 400     | —              | `.font-caption`      |
| Label Caps      | Inter          | 11px          | 11px           | 16px        | 600     | 0.08em         | `.font-label-caps`   |
| Tabular Numbers | JetBrains Mono | —             | —              | —           | 400/600 | —              | `.font-tabular-*`    |

**Base Font Stack**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`  
**Font Feature Settings**: `"cv02", "cv03", "cv04", "cv11"` (Inter discretionary ligatures)

### 1.5 Spacing Scale

Base unit: **4px**

| Token     | Value | Usage                         |
| --------- | ----- | ----------------------------- |
| `space-1` | 4px   | Tight gaps, icon padding      |
| `space-2` | 8px   | Default gap, padding          |
| `space-3` | 12px  | Medium gaps                   |
| `space-4` | 16px  | Section padding, card padding |
| `space-5` | 20px  | Large gaps                    |
| `space-6` | 24px  | Section margins               |
| `space-8` | 32px  | Page margins                  |

### 1.6 Border Radius

| Token                    | Value  | Usage                              |
| ------------------------ | ------ | ---------------------------------- |
| `rounded-sm`             | 2px    | Badges, pills                      |
| `rounded` / `rounded-md` | 6px    | Buttons, inputs, default           |
| `rounded-lg`             | 8px    | Cards, modals, dropdowns           |
| `rounded-xl`             | 12px   | Large cards, sheets, bottom sheets |
| `rounded-full`           | 9999px | Pills, avatar, progress            |

### 1.7 Shadows / Elevation

| Level              | Value                                                                 | Usage                  |
| ------------------ | --------------------------------------------------------------------- | ---------------------- |
| `shadow-sm`        | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                       | Subtle elevation       |
| `shadow` (default) | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`       | Cards, dropdowns       |
| `shadow-md`        | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`    | Modals, sheets         |
| `shadow-lg`        | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`  | Bottom sheets, drawers |
| `shadow-xl`        | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Mobile bottom sheets   |

### 1.8 Touch Targets & Accessibility

- **Minimum touch target**: 44×44px (mobile), 48×48px (bottom nav)
- **Focus ring**: `2px solid var(--color-primary-container)` with `2px offset`
- **Focus-visible only**: Keyboard navigation shows focus, mouse does not
- **Reduced motion**: Respects `prefers-reduced-motion`

### 1.9 Motion & Animation

| Animation         | Duration    | Easing     | Usage                            |
| ----------------- | ----------- | ---------- | -------------------------------- |
| `duration-150`    | 150ms       | `ease-out` | Hover transitions, color changes |
| `duration-200`    | 200ms       | `ease-out` | Sidebar collapse, modal enter    |
| `duration-300`    | 300ms       | `ease-out` | Page transitions, sheet slide    |
| `animate-fadeIn`  | 200ms       | `ease-out` | Backdrop fade                    |
| `animate-slideUp` | 300ms       | `ease-out` | Bottom sheet enter               |
| `animate-blink`   | 1s infinite | `steps(1)` | Active cell cursor               |

**Staggered Reveal** (page load): 50ms delay per element, max 300ms total

---

## 2. Component Registry

### 2.1 shadcn/ui Components (44) — `src/components/ui/`

| Component       | Path                  | Variants                                              | States                                      | Notes                                          |
| --------------- | --------------------- | ----------------------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| Accordion       | `accordion.tsx`       | single, multiple                                      | open, closed, disabled                      |                                                |
| Alert           | `alert.tsx`           | default, destructive                                  | —                                           |                                                |
| Alert Dialog    | `alert-dialog.tsx`    | —                                                     | open, closed                                |                                                |
| Aspect Ratio    | `aspect-ratio.tsx`    | 16:9, 4:3, 1:1, 21:9                                  | —                                           |                                                |
| Avatar          | `avatar.tsx`          | image, fallback                                       | loading, error                              |                                                |
| Badge           | `badge.tsx`           | default, secondary, destructive, outline              | —                                           |                                                |
| Breadcrumb      | `breadcrumb.tsx`      | —                                                     | current, link                               |                                                |
| Button          | `button.tsx`          | default, destructive, outline, secondary, ghost, link | default, sm, lg, icon                       | **Uses custom primary colors**                 |
| Calendar        | `calendar.tsx`        | single, range, multiple                               | —                                           |                                                |
| Card            | `card.tsx`            | —                                                     | —                                           | `rounded-xl`, custom shadows                   |
| Carousel        | `carousel.tsx`        | —                                                     | —                                           | Embla Carousel                                 |
| Chart           | `chart.tsx`           | line, bar, pie, area                                  | —                                           | Recharts wrapper                               |
| Checkbox        | `checkbox.tsx`        | —                                                     | checked, unchecked, indeterminate, disabled |                                                |
| Collapsible     | `collapsible.tsx`     | —                                                     | open, closed                                |                                                |
| Command         | `command.tsx`         | —                                                     | empty, loading, filtered                    |                                                |
| Context Menu    | `context-menu.tsx`    | —                                                     | open, closed                                |                                                |
| Dialog          | `dialog.tsx`          | —                                                     | open, closed                                |                                                |
| Drawer          | `drawer.tsx`          | left, right, top, bottom                              | open, closed                                |                                                |
| Dropdown Menu   | `dropdown-menu.tsx`   | —                                                     | open, closed                                |                                                |
| Form            | `form.tsx`            | —                                                     | —                                           | React Hook Form + Zod                          |
| Hover Card      | `hover-card.tsx`      | —                                                     | open, closed                                |                                                |
| Input           | `input.tsx`           | —                                                     | default, error, disabled                    |                                                |
| Input OTP       | `input-otp.tsx`       | —                                                     | —                                           |                                                |
| Label           | `label.tsx`           | —                                                     | —                                           |                                                |
| Menubar         | `menubar.tsx`         | —                                                     | open, closed                                |                                                |
| Navigation Menu | `navigation-menu.tsx` | —                                                     | active, hover                               |                                                |
| Pagination      | `pagination.tsx`      | —                                                     | active, disabled                            |                                                |
| Popover         | `popover.tsx`         | —                                                     | open, closed                                |                                                |
| Progress        | `progress.tsx`        | default, indeterminate                                | —                                           |                                                |
| Radio Group     | `radio-group.tsx`     | —                                                     | selected, disabled                          |                                                |
| Resizable       | `resizable.tsx`       | horizontal, vertical                                  | dragging                                    |                                                |
| Scroll Area     | `scroll-area.tsx`     | —                                                     | —                                           | Custom scrollbar styling                       |
| Select          | `select.tsx`          | single, multiple                                      | open, closed, disabled                      |                                                |
| Separator       | `separator.tsx`       | horizontal, vertical                                  | —                                           |                                                |
| Sheet           | `sheet.tsx`           | left, right, top, bottom                              | open, closed                                | Mobile bottom sheets                           |
| Sidebar         | `sidebar.tsx`         | —                                                     | collapsed, expanded                         | **Custom Chokur version in chokur/components** |
| Skeleton        | `skeleton.tsx`        | —                                                     | loading                                     |                                                |
| Slider          | `slider.tsx`          | single, range                                         | dragging, disabled                          |                                                |
| Sonner          | `sonner.tsx`          | default, success, error, warning, info                | —                                           | Toast system                                   |
| Switch          | `switch.tsx`          | —                                                     | checked, unchecked, disabled                |                                                |
| Table           | `table.tsx`           | —                                                     | hover, striped                              |                                                |
| Tabs            | `tabs.tsx`            | default, underline                                    | active, disabled                            |                                                |
| Textarea        | `textarea.tsx`        | —                                                     | default, error, disabled                    |                                                |
| Toggle Group    | `toggle-group.tsx`    | single, multiple                                      | pressed, unpressed                          |                                                |
| Toggle          | `toggle.tsx`          | —                                                     | pressed, unpressed                          |                                                |
| Tooltip         | `tooltip.tsx`         | default, delay                                        | open, closed                                |                                                |

### 2.2 Custom Chokur Components — `src/chokur/components/`

| Component          | Path                     | Variants                          | States                       | Description                          |
| ------------------ | ------------------------ | --------------------------------- | ---------------------------- | ------------------------------------ |
| ChokurLogo         | `brand/ChokurLogo.tsx`   | symbol, horizontal, vertical      | sizes: 20-48px               | Brand mark with KCSE styling         |
| GradeChip          | `GradeChip.tsx`          | A-F, numeric                      | earned, predicted            | KCSE grade display with color coding |
| LegalModals        | `LegalModals.tsx`        | privacy, terms                    | open, closed                 | Kenya DPA 2019 compliant             |
| SchoolSuiteSection | `SchoolSuiteSection.tsx` | —                                 | —                            | Marketing section for landing        |
| Sidebar            | `Sidebar.tsx`            | rail (72px), expanded (200/220px) | mobile drawer, desktop rail  | **Primary navigation**               |
| TestPresetsModal   | `TestPresetsModal.tsx`   | —                                 | open, closed                 | Demo data management                 |
| TopNavBar          | `TopNavBar.tsx`          | —                                 | stream/exam/role modals open | **Primary header**                   |

### 2.3 Views (17) — `src/chokur/views/`

| View                  | Path                        | Purpose                        |
| --------------------- | --------------------------- | ------------------------------ |
| LandingPageView       | `LandingPageView.tsx`       | Marketing landing + spec sheet |
| OverviewView          | `OverviewView.tsx`          | Dashboard overview with stats  |
| MarksEntryView        | `MarksEntryView.tsx`        | Spreadsheet-style marks entry  |
| RankingsView          | `RankingsView.tsx`          | Student rankings with filters  |
| ReportCardsView       | `ReportCardsView.tsx`       | Printable report cards         |
| GradeDistributionView | `GradeDistributionView.tsx` | Grade analytics charts         |
| SubjectAnalysisView   | `SubjectAnalysisView.tsx`   | Subject-level analytics        |
| StudentsClassesView   | `StudentsClassesView.tsx`   | Student/class management       |
| AttendanceView        | `AttendanceView.tsx`        | Attendance tracking            |
| BulkSmsView           | `BulkSmsView.tsx`           | SMS messaging                  |
| FeesView              | `FeesView.tsx`              | Fee tracking                   |
| ParentPortalView      | `ParentPortalView.tsx`      | Parent access view             |
| ProfileInboxView      | `ProfileInboxView.tsx`      | Profile + WhatsApp integration |
| SettingsView          | `SettingsView.tsx`          | App settings & backups         |
| HelpSupportView       | `HelpSupportView.tsx`       | Help & support                 |
| PrivacyPolicyView     | `PrivacyPolicyView.tsx`     | Privacy policy                 |
| TermsOfServiceView    | `TermsOfServiceView.tsx`    | Terms of service               |

---

## 3. Layout Architecture

### 3.1 Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (200-220px)  │  TopNavBar (h-14)                    │
│  ┌─────────────────┐  │  ┌───────────────────────────────┐  │
│  │ Logo + Nav      │  │  │ Breadcrumbs | Stream | Exam   │  │
│  │ Role Switcher   │  │  │ Role | PWA | Presets | Policies│  │
│  │ About Link      │  │  │ Spec | Save Status             │  │
│  └─────────────────┘  │  └───────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                          Main View                            │
│  (flex-1, pt-14 md:pt-14 lg:pt-14, pb-16)                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Tablet (768px–1023px)

- Sidebar collapses to 72px icon rail
- TopNavBar shifts left margin to 72px
- Breadcrumbs hidden, context chips visible

### 3.3 Mobile (<768px)

- Sidebar hidden, replaced by bottom tab bar (4 tabs + More)
- TopNavBar full width, no left margin
- Bottom sheets for stream/exam/role selection
- More drawer for additional navigation

---

## 4. Design Principles & Aesthetic Direction

### 4.1 Aesthetic: "Archival Academic Warmth"

- **Memorable Element**: Warm cream/beige paper texture evoking physical mark sheets and ledgers
- **Tone**: Authoritative yet approachable — like a trusted school record book
- **Contrast**: Burnt orange/terracotta primary against warm neutrals (not harsh black/white)
- **Personality**: Distinctly Kenyan academic context (KCSE grading, Material Symbols for familiarity)

### 4.2 Anti-AI-Slop Checklist ✅

- [x] No generic Inter/Roboto-only typography (JetBrains Mono for data, Inter with features)
- [x] No purple-blue gradients (warm terracotta + cream palette)
- [x] No unmodified Tailwind gray scales (custom warm beige scale)
- [x] Distinctive type scale with 7 named levels
- [x] Atmospheric depth via layered surface containers
- [x] Purposeful motion (staggered reveals, sheet slides, blink cursor)
- [x] Cultural specificity (KCSE grading, Kenya DPA compliance, Material Symbols)

### 4.3 Motion Choreography

1. **Page Load**: Staggered reveal (header → sidebar → main content → cards)
2. **Navigation**: 150ms sidebar rail collapse, 200ms view transition
3. **Mobile Sheets**: 300ms slide-up with backdrop fade
4. **Interactive**: 150ms hover/tap on all actionable elements
5. **Data Entry**: Blinking cursor (1s) for active spreadsheet cells

---

## 5. Responsive Breakpoints

| Breakpoint | Width       | Sidebar              | TopNavBar   | Navigation                      |
| ---------- | ----------- | -------------------- | ----------- | ------------------------------- |
| Mobile     | < 768px     | Hidden (bottom tabs) | Full width  | Bottom tab bar + More drawer    |
| Tablet     | 768–1023px  | 72px icon rail       | Left: 72px  | Icon rail + context chips       |
| Desktop    | 1024–1279px | 200px expanded       | Left: 200px | Full labels + context chips     |
| XL         | ≥ 1280px    | 220px expanded       | Left: 220px | Full labels + Spec link visible |

---

## 6. Print Stylesheet (Report Cards)

Defined in `src/styles.css` `@media print`:

- A4 portrait, 12mm/15mm margins
- White background, black text
- Hides: sidebar, header, nav, buttons, inputs
- Main content full width
- `.print-only` elements shown
- `.print-sheet` pages with `page-break-after: always`

---

## 7. Implementation Guidelines

### 7.1 Adding New Components

1. Check Component Registry first — reuse existing
2. If new component needed:
   - Create in `src/components/ui/` (shadcn pattern) or `src/chokur/components/` (domain-specific)
   - Use design tokens (CSS variables) — **no hardcoded colors**
   - Follow shadcn/ui patterns: `cva` for variants, `cn` for class merging, `forwardRef`
   - Add to Component Registry in this spec
   - Run `iterate` to register

### 7.2 Color Usage Rules

- **Always** use semantic aliases (`bg-primary`, `text-muted-foreground`, `border-border`)
- **Never** hardcode hex values in components
- Custom utility classes in `styles.css` (`.bg-surface`, `.text-on-surface`, etc.) for non-shadcn elements

### 7.3 Radius Consistency

- Buttons/Inputs: `rounded-md` (6px)
- Cards/Modals/Sheets: `rounded-xl` (12px)
- Badges/Pills: `rounded-full`
- **Avoid** arbitrary radius values

### 7.4 Dark Mode Implementation

- Add `.dark` class to `<html>` or use `media: (prefers-color-scheme: dark)`
- All semantic aliases auto-switch via CSS variables
- Test all components in both modes

---

## 8. File References

| File                          | Purpose                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `src/styles.css`              | Design tokens (CSS variables), global styles, print stylesheet |
| `src/components/ui/*.tsx`     | 44 shadcn/ui components                                        |
| `src/chokur/components/*.tsx` | 7 custom Chokur components                                     |
| `src/chokur/views/*.tsx`      | 17 application views                                           |
| `src/lib/utils.ts`            | `cn()` utility for class merging                               |
| `tailwind.config.ts`          | _Not used_ — Tailwind v4 uses CSS-first config in `styles.css` |

---

## 9. Changelog

| Version | Date       | Changes                                                                                                     |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-10-20 | Initial spec: extracted tokens, component registry, added dark mode palette, documented layout architecture |

---

_This spec is the single source of truth for UI decisions. All implementation must reference this document._
