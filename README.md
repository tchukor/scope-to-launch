# Chokur System — Kenyan Secondary School ACADE Mic Information System

**Marks to insight in one pass. Offline.**

Chokur is a purpose-built marks-to-insight tool for Kenyan secondary school teachers. Enter marks once on a phone or laptop; the system instantly computes KCSE 12-point grades, ranks classes, analyses subjects, tracks university qualifications, and prints official report cards — with zero reliance on internet connectivity.

**Live app**: https://scope-to-launch.lovable.app

## What it does

| Feature | Description |
|---|---|
| **KCSE 12-Point Grading** | Automated conversion from raw percentage scores to official KNEC letter grades (A through E) and points (12 to 1). Evaluates the best-7 subjects aggregate per MOE cluster requirements. |
| **Dual-Mode Marks Entry** | Rapid desktop spreadsheet matrix with arrow-key navigation AND focused mobile student-by-student cards with tactile numeric keypads. |
| **Class & Stream Rankings** | Instant stream rank, overall form rank, aggregate score, mean points. Tracks deviation from previous term. |
| **Subject Performance Analysis** | Departmental metrics per subject: mean points, standard deviation, pass rate (≥C+), top performers, grade breakdowns. |
| **Printable Report Cards** | Official MOE layout with school crest, motto, student biodata, subject evaluation remarks, stream rank, and teacher/principal signatures. |
| **Offline-First** | IndexedDB storage (W3C Level 2) with memory fallback. 100% offline capable — functions identically with or without network. |
| **Attendance + Bulk SMS** | Roll-call register with instant absentee alerting; queued SMS to parent contacts. |
| **Fees Ledger** | Term fee collections, payment records, receipt generation, balance tracking. |
| **Parent Portal** | Secure parent access to child grades, attendance, and fees (privacy-gated — parents only see own student data). |
| **Legal & Compliance** | Privacy Policy (DPA 2019), Terms of Service, MoE/KNEC compliance modals — accessible from footer and in-app settings. |

## Tech stack

- **Framework**: TanStack Start + React 19 + TanStack Router
- **Styling**: TailwindCSS 4 + Radix UI components
- **Auth**: Supabase (`@supabase/supabase-js`) with client+server middleware
- **Storage**: IndexedDB (Dexie/local) — offline-first, no remote DB required
- **Build**: Vite 8 + Nitro (Workers-compatible output)
- **Tests**: Vitest 4 (22 passing tests)

## Local development

Requires Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone https://github.com/tchukor/scope-to-launch.git
cd scope-to-launch
npm install
npm run dev
```

```sh
npm run build     # production build
npm run lint      # lint check
npm run test      # run test suite (22 tests)
npm run format    # format with prettier
```

## Contributing

1. Create a feature branch from `main`.
2. Make your changes.
3. Run `npm run build && npm run test && npm run lint` — all must pass.
4. Commit with a descriptive message.
5. Push to your branch and open a pull request.

## License

See the repository's license file.
