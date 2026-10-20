import { ViewType } from "../types";
import { Role } from "./roles";

export interface ViewMeta {
  id: ViewType;
  title: string;
  category: "Academic" | "Operations" | "Administration" | "Portal" | "Staff";
  icon: string;
  description: string;
  parentView?: ViewType;
}

export const VIEW_METADATA: Record<ViewType, ViewMeta> = {
  legal: {
    id: "legal",
    title: "Legal &amp; Compliance Center",
    category: "Portal",
    icon: "gavel",
    description:
      "Simplified privacy, terms, and MoE/KNEC compliance summaries for non-technical viewers.",
  },
  overview: {
    id: "overview",
    title: "Overview",
    category: "Academic",
    icon: "dashboard",
    description: "Academic performance ledger, KCSE averages, and quick actions.",
  },
  "marks-entry": {
    id: "marks-entry",
    title: "Marks Entry",
    category: "Academic",
    icon: "edit_note",
    description: "Rapid spreadsheet ledger for subject marks and grading.",
    parentView: "overview",
  },
  rankings: {
    id: "rankings",
    title: "Class Rankings",
    category: "Academic",
    icon: "format_list_numbered",
    description: "Official KCSE 12-point ranking sheet with KUCCPS qualification.",
    parentView: "overview",
  },
  "subject-analysis": {
    id: "subject-analysis",
    title: "Subject Analysis",
    category: "Academic",
    icon: "analytics",
    description: "Departmental performance, subject means, pass rates, and deviations.",
    parentView: "overview",
  },
  "grade-distribution": {
    id: "grade-distribution",
    title: "Grade Distribution",
    category: "Academic",
    icon: "bar_chart",
    description: "12-tier KCSE bell curve and cohort performance shares.",
    parentView: "overview",
  },
  "report-cards": {
    id: "report-cards",
    title: "Report Cards",
    category: "Academic",
    icon: "badge",
    description: "Official printable A4 report cards with KNEC standards.",
    parentView: "rankings",
  },
  students: {
    id: "students",
    title: "Students & Classes",
    category: "Administration",
    icon: "group",
    description: "Student roster, class streams, subjects, and exam periods.",
    parentView: "overview",
  },
  attendance: {
    id: "attendance",
    title: "Attendance Register",
    category: "Operations",
    icon: "fact_check",
    description: "Daily roll-call ledger and instant absentee alerting.",
    parentView: "overview",
  },
  messaging: {
    id: "messaging",
    title: "Bulk SMS",
    category: "Operations",
    icon: "sms",
    description: "Personalized SMS broadcast to parents and fee defaulters.",
    parentView: "overview",
  },
  fees: {
    id: "fees",
    title: "Fees Ledger",
    category: "Operations",
    icon: "payments",
    description: "Term fee collections, payment records, and defaulters.",
    parentView: "overview",
  },
  "parent-portal": {
    id: "parent-portal",
    title: "Parent Portal",
    category: "Portal",
    icon: "family_restroom",
    description: "Secure parent access to child grades, attendance, and fees.",
  },
  profile: {
    id: "profile",
    title: "Profile & WhatsApp",
    category: "Staff",
    icon: "forum",
    description: "Staff credentials and two-way parent communication threads.",
    parentView: "overview",
  },
  settings: {
    id: "settings",
    title: "Settings & Backups",
    category: "Administration",
    icon: "settings",
    description: "School configuration, data backups, and CSV imports.",
    parentView: "overview",
  },
  landing: {
    id: "landing",
    title: "About Chokur & Specs",
    category: "Portal",
    icon: "info",
    description: "Curriculum specifications and technical documentation.",
  },
};

export const getBreadcrumbs = (view: ViewType, role: Role, studentName?: string) => {
  if (view === "landing") {
    return [{ label: "Chokur System", view: "landing" as ViewType }];
  }

  if (role === "Parent") {
    if (view === "report-cards") {
      return [
        { label: "Parent Portal", view: "parent-portal" as ViewType },
        {
          label: studentName ? `Report Card: ${studentName}` : "Report Card",
          view: "report-cards" as ViewType,
        },
      ];
    }
    return [{ label: "Parent Portal", view: "parent-portal" as ViewType }];
  }

  const meta = VIEW_METADATA[view];
  if (!meta) return [{ label: "Overview", view: "overview" as ViewType }];

  if (view === "overview") {
    return [{ label: "Overview", view: "overview" as ViewType }];
  }

  const crumbs = [{ label: "Overview", view: "overview" as ViewType }];

  if (meta.parentView && meta.parentView !== "overview") {
    const parentMeta = VIEW_METADATA[meta.parentView];
    crumbs.push({ label: parentMeta.title, view: meta.parentView });
  }

  if (view === "report-cards" && studentName) {
    crumbs.push({ label: `Report Card: ${studentName}`, view: "report-cards" as ViewType });
  } else {
    crumbs.push({ label: meta.title, view });
  }

  return crumbs;
};
