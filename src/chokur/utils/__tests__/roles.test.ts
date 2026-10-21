import { describe, it, expect } from "vitest";
import { canSee, homeFor } from "@/chokur/utils/roles";

describe("roles", () => {
  it("admin sees fees and settings", () => {
    expect(canSee("Admin", "fees")).toBe(true);
    expect(canSee("Admin", "settings")).toBe(true);
  });
  it("teacher records marks and attendance but not fees", () => {
    expect(canSee("Teacher", "marks-entry")).toBe(true);
    expect(canSee("Teacher", "attendance")).toBe(true);
    expect(canSee("Teacher", "fees")).toBe(false);
  });
  it("parent only sees parent portal and report cards", () => {
    expect(canSee("Parent", "parent-portal")).toBe(true);
    expect(canSee("Parent", "marks-entry")).toBe(false);
    expect(homeFor("Parent")).toBe("parent-portal");
  });
});
