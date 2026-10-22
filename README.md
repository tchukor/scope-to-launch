# Chokur System — Kenyan Secondary School Academic Ledger

**Marks to insight in one pass. Offline.**

Chokur is a purpose-built marks-to-insight tool for Kenyan secondary school teachers. Enter marks once on a phone or laptop; the system instantly computes KCSE 12-point grades, ranks classes, analyses subjects, tracks university qualifications, and prints official report cards — with zero reliance on internet connectivity.

**Live app**: https://chokursystem.vercel.app

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://chokursystem.vercel.app)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4D4D?logo=tanstack)](https://tanstack.com/start)
[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vitest — 22 passing](https://img.shields.io/badge/Vitest-22%20passing-brightgreen)](https://vitest.dev)
[![PWA Offline-First](https://img.shields.io/badge/PWA-Offline--First-5A0FC8)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## What it does

| Feature                          | Description                                                                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **KCSE 12-Point Grading**        | Automated conversion from raw percentage scores to official KNEC letter grades (A through E) and points (12 to 1). Evaluates the best-7 subjects aggregate per MOE cluster requirements. |
| **Dual-Mode Marks Entry**        | Rapid desktop spreadsheet matrix with arrow-key navigation AND focused mobile student-by-student cards with tactile numeric keypads.                                                     |
| **Class & Stream Rankings**      | Instant stream rank, overall form rank, aggregate score, mean points. Tracks deviation from previous term.                                                                               |
| **Subject Performance Analysis** | Departmental metrics per subject: mean points, standard deviation, pass rate (≥C+), top performers, grade breakdowns.                                                                    |
| **Printable Report Cards**       | Official MOE layout with school crest, motto, student biodata, subject evaluation remarks, stream rank, and teacher/principal signatures.                                                |
| **Offline-First**                | IndexedDB storage (W3C Level 2) with memory fallback. 100% offline capable — functions identically with or without network.                                                              |
| **Attendance + Bulk SMS**        | Roll-call register with instant absentee alerting; queued SMS to parent contacts.                                                                                                        |
| **Fees Ledger**                  | Term fee collections, payment records, receipt generation, balance tracking.                                                                                                             |
| **Parent Portal**                | Secure parent access to child grades, attendance, and fees (privacy-gated — parents only see own student data).                                                                          |
| **Legal & Compliance**           | Privacy Policy (DPA 2019), Terms of Service, MoE/KNEC compliance modals — accessible from footer and in-app settings.                                                                    |

## Tech stack

- **Framework**: TanStack Start + React 19 + TanStack Router (SSR + file-based routing)
- **Styling**: Tailwind CSS 4 + Radix UI primitives (shadcn/ui v4)
- **Storage**: IndexedDB + localStorage dual-write — offline-first, no remote DB required
- **Build**: Vite 8 + Nitro (Vercel nodejs24.x preset)
- **PDF**: html2canvas + jsPDF for client-side report card generation
- **Tests**: Vitest 4 (22 passing tests)
- **Service Worker**: Cache-first strategy with versioned cache busting (v3)

## Directory structure

```
src/
├── chokur/
│   ├── views/              # 15 view components (Admin, Teacher, Parent roles)
│   ├── components/
│   │   ├── brand/          # ChokurLogo
│   │   ├── layout/         # Sidebar, TopNavBar, Breadcrumbs, KeyboardHelp
│   │   ├── data-display/   # GradeChip, StatTile, DataTable, Card, Badge
│   │   ├── forms/          # Button, Input, Textarea, Select, Sheet, Tabs
│   │   ├── modals/         # LegalModals, TestPresetsModal, OnboardingFlow, ProtectedView
│   │   ├── states/         # States (loading, empty, error)
│   │   └── ui/             # Base UI primitives (index.ts barrel)
│   ├── context/            # Split contexts (7 providers + unified GradingProvider)
│   ├── lib/                # db.ts, presets.ts, schoolOps.ts
│   ├── utils/              # grading.ts, navigation.ts, roles.ts (+ __tests__/)
│   ├── types/              # index.ts (TypeScript types)
│   ├── data/               # initialData.ts
│   ├── hooks/              # Custom hooks extracted from views
│   └── App.tsx             # App shell with layout
├── routes/                 # TanStack Router file-based routes
├── styles.css              # Global styles with design tokens
└── client.tsx              # Entry point
```

## Code navigation

See [CODE_NAVIGATION.md](./CODE_NAVIGATION.md) for a developer quick-reference guide on adding views, computed selectors, grading scales, and RBAC rules.

## Local development

Requires Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone https://github.com/tchukor/scope-to-launch.git
cd scope-to-launch
npm install
npm run dev
```

```sh
npm run build     # production build (Vercel output in .vercel/output)
npm run lint      # ESLint check
npm run test      # run test suite (22 tests)
npm run format    # format with Prettier
```

## Architecture decision records (ADRs)

- **ADR-001**: TanStack Start + Nitro for Vercel SSR — SSR for landing page, client-side for app shell
- **ADR-002**: IndexedDB + localStorage dual-write for offline-first persistence — no remote DB required
- **ADR-003**: Hash-based routing with browser history synchronization — works with and without server config
- **ADR-004**: Three-role RBAC (Admin / Teacher / Parent) — view-level access control
- **ADR-005**: WCAG 2.2 AA "Archival Academic Warmth" design tokens — CSS custom properties in styles.css

## Contributing

1. Create a feature branch from `main`.
2. Make your changes.
3. Run `npm run build && npm run test && npm run lint` — all must pass.
4. Commit with a descriptive message.
5. Push to your branch and open a pull request.

## License

See the repository's license file.
