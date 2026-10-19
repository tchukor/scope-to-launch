# Chokur School Management: Complete-Product Build & Verification Plan

An end-to-end audit, workflow completion, and verification blueprint for the Chokur Kenyan secondary school management and KCSE 12-point grading ledger application.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX decisions were confirmed during the interactive interview:

- **Scope & Prioritization**: Both Academic (Marks Entry, Rankings, Subject Analysis, Grade Distribution, Report Cards) and School Operations (Fees, Attendance, Bulk SMS, Parent Portal, Settings) will be completed and systematically verified end-to-end.
- **Compliance & Public Pages**: Dedicated modal dialogs and view linkages for Kenyan School Data Compliance, Privacy Policy (aligned with Kenyan Data Protection Act 2019), and Terms of Service accessible from landing footers and settings.
- **Testing Presets & Quick Reset**: A dedicated Developer / QA Test Preset switcher enabling instant switching between Form 1-4 cohorts, sample terms (Term 1, Term 2, Term 3), and one-click database reset to initial demo seeds.

---

## 1. Overview & Core Concept

- **What It Does**: Chokur is a specialized, offline-first Kenyan secondary school academic information system and operations suite. It provides rapid keyboard-driven spreadsheet marks entry, official KCSE 12-point grading (A down to E with points 12 to 1), automated stream and class rank computation, subject-level mean scores, official printable Ministry-standard report cards, fee ledger balances, biometric/roll-call attendance tracking with automatic SMS queuing, and a parent access portal.
- **Target Audience**: Kenyan secondary school principals, deputy principals, director of studies (DoS), class teachers, bursars/accounts clerks, and guardians.
- **Key Value**: Replaces cumbersome manual record-keeping and slow spreadsheets with an instantaneous, offline-capable progressive web application that calculates accurate mean grades, ranks, fee balances, and prints official report cards without requiring persistent internet or remote server roundtrips.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Authentication & Role Selection**:
   - Landing page with role selection (Administrator, Director of Studies, Class Teacher, Subject Teacher, Parent/Guardian).
   - Instant authentication and role persistence with immediate redirection to role-authorized dashboards.
2. **Academic Ledger & Rapid Marks Entry**:
   - Filter by Form (Form 1 to Form 4), Stream (East, West, North, Central), and Exam Term.
   - High-density tabular spreadsheet with real-time validation (0–100 marks), instant KCSE grade chips (A, A-, B+, etc.), points recalculation, and automatic rank updates.
   - Quick navigation bar at table bottom directing the teacher directly to "Review Class Rankings" or "Subject Analysis".
3. **Official Report Cards & Parent Portal**:
   - Complete report card generator with school crest, student biodata, KCSE breakdown, class teacher remarks, principal signature, and printable A4 styling.
   - Strict guardian privacy guard: Parents can only query and view report cards for their linked student admission numbers.
4. **Operations Suite (Attendance $\to$ Bulk SMS $\to$ Fees)**:
   - Roll-call attendance with instant absence flagging.
   - "Queue SMS" action immediately transfers flagged absences into the Bulk SMS dispatch queue with dynamic parent contact phone numbers and customized Swahili/English text templates.
   - Fee tracking with term fee requirements, payment logging, receipt generation, and balance ledger.
5. **Testing & QA Suite**:
   - Top-level Test Preset Drawer allowing one-click loading of edge cases (e.g., all 100s, boundary grades, mixed attendance, high fee arrears) and full database reset.

### Visual Identity & Theme

- **Aesthetic Direction**: High-density, utilitarian Kenyan academic ledger with modern typography and minimal visual clutter.
- **Typography**: Display headlines set in `Plus Jakarta Sans`, body text in `Plus Jakarta Sans` or `DM Sans`, and all tabular numerical figures, percentages, KCSE points, and fee balances strictly formatted with `font-variant-numeric: tabular-nums` or `font-mono`.
- **Color Palette & Discipline (60-30-10)**:
  - 60% Canvas: Neutral off-white (`#F8FAFC`) / deep slate (`#0F172A`) for high readability during prolonged marks entry sessions.
  - 30% Structural: Hairline borders (`1px solid #E2E8F0`), subtle header divides, and clean table borders.
  - 10% Accents & Semantics: Academic Emerald (`#059669`) for high passes (A, A-), Amber (`#D97706`) for average/warning marks, Crimson (`#DC2626`) for arrears/absences, and Navy (`#1E3A8A`) for institutional branding.
- **Top Bar Contract**: Clean 3-zone header with school identity wordmark on left, active view breadcrumbs in center, and role switcher/reset actions on right (`whitespace-nowrap shrink-0`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Offline-First IndexedDB Storage with In-Memory Fallback**
  - *Chosen Approach*: Persist all students, marks, streams, attendance, and fee transactions in browser IndexedDB via Dexie/local DB with automatic fallback to localStorage.
  - *Why*: Kenyan secondary schools often experience intermittent power and rural connectivity issues. Offline persistence ensures teachers never lose entered marks during network blackouts.
  - *Alternatives Considered*: Cloud SQL / Supabase was considered but ruled out for the primary client database per project guidelines (`AGENTS.md`).
- **Decision 2: Strict Role-Based View Filtering & Guardian Privacy Guard**
  - *Chosen Approach*: Enforce view-level permission checks both in sidebar and in `MainContent` view router. Prevent parents from browsing other student records in `ReportCardsView`.
  - *Why*: Student performance and fee status are confidential under Kenyan pupil privacy standards.
- **Decision 3: Dedicated Legal & Policy Modals**
  - *Chosen Approach*: Interactive dialog modals detailing the School Privacy Notice, Data Protection Act 2019 compliance, and School Software Terms.
  - *Why*: Allows instant inspection from both the landing page footer and in-app settings without navigating away or breaking offline application state.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Chokur Client Application                       │
├────────────────────────────────────────────────────────────────────────┤
│ TopNavBar (Breadcrumbs · Role Switcher · Test Presets · Reset DB)      │
├───────────────────┬────────────────────────────────────────────────────┤
│ Sidebar Nav       │ Active Viewport                                    │
│ - Academic Views  │ ├─ OverviewView (School KPIs & Mean Distribution)  │
│ - Operations      │ ├─ MarksEntryView (12-Pt KCSE Spreadsheet Grid)    │
│ - Student Mgmt    │ ├─ RankingsView (Stream & Overall Position)        │
│ - Guardian Portal │ ├─ SubjectAnalysisView (Dept Averages & Deviation) │
│ - Settings/Legal  │ ├─ ReportCardsView (Printable A4 Report Cards)     │
│                   │ ├─ AttendanceView (Roll-call & SMS trigger)        │
│                   │ ├─ BulkSmsView (Parent Dispatch & Template Queue)  │
│                   │ ├─ FeesView (Balance Ledger & Payment Receipting)  │
│                   │ ├─ ParentPortalView (Private Student Result Lookup)│
│                   │ └─ LegalModals (Privacy, Terms & Compliance)       │
├───────────────────┴────────────────────────────────────────────────────┤
│ State & Persistence Layer: GradingContext + IndexedDB (Dexie / Local) │
│ (Students, Subjects, Marks, Fees, Attendance, SMS Messages, Role)     │
└────────────────────────────────────────────────────────────────────────┘
```

### Verification & Testing Suite

1. **Unit & Calculation Tests**:
   - KCSE 12-point conversion verification (12 = A, 11 = A-, ..., 1 = E).
   - Aggregate points and mean grade computation.
   - Ranking tie-breaking and stream sorting.
2. **Workflow End-to-End Tests**:
   - Complete journey: Marks entry $\to$ instant ranking recalculation $\to$ subject analysis deviation $\to$ printable report card.
   - Operations journey: Roll call marking $\to$ SMS absence queue populating $\to$ template dispatch.
   - Fee journey: Payment logging $\to$ receipt view $\to$ balance update.
   - Security check: Parent role isolation and access control.
3. **Automated Verification**: Run linting (`npm run lint`), build (`npm run build`), and test runner (`npm test`) to guarantee zero regressions.
