import type { ViewType } from "../types";

export type Role = "Admin" | "Teacher" | "Parent";
export const ROLES: Role[] = ["Admin", "Teacher", "Parent"];

const TEACHER: ViewType[] = [
  "overview",
  "marks-entry",
  "rankings",
  "subject-analysis",
  "grade-distribution",
  "report-cards",
  "students",
  "attendance",
  "messaging",
  "profile",
];

export const ROLE_VIEWS: Record<Role, ViewType[] | "all"> = {
  Admin: "all",
  Teacher: TEACHER,
  Parent: ["parent-portal", "report-cards", "legal"],
};

export const canSee = (role: Role, view: ViewType): boolean => {
  if (view === "landing") return true;
  const v = ROLE_VIEWS[role];
  return v === "all" || v.includes(view);
};

export const homeFor = (role: Role): ViewType => (role === "Parent" ? "parent-portal" : "overview");

const KEY = "chokur.role";
export const loadRole = (): Role => {
  try {
    const r = localStorage.getItem(KEY) as Role | null;
    return r && ROLES.includes(r) ? r : "Admin";
  } catch {
    return "Admin";
  }
};
export const saveRole = (r: Role) => {
  try {
    localStorage.setItem(KEY, r);
  } catch {
    /* ignore */
  }
};
