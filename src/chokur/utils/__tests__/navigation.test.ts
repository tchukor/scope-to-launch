import { describe, expect, it } from "vitest";
import { getBreadcrumbs, VIEW_METADATA } from "@/chokur/utils/navigation";

describe("Navigation and Breadcrumbs", () => {
  it("provides valid metadata for all views", () => {
    expect(VIEW_METADATA.overview.title).toBe("Overview");
    expect(VIEW_METADATA["marks-entry"].category).toBe("Academic");
    expect(VIEW_METADATA["parent-portal"].category).toBe("Portal");
    expect(VIEW_METADATA.settings.category).toBe("Administration");
  });

  it("generates correct breadcrumbs for Admin on nested views", () => {
    const crumbs = getBreadcrumbs("report-cards", "Admin", "John Kamau");
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0].label).toBe("Overview");
    expect(crumbs[1].label).toBe("Class Rankings");
    expect(crumbs[2].label).toBe("Report Card: John Kamau");
  });

  it("generates role-appropriate breadcrumbs for Parent", () => {
    const portalCrumbs = getBreadcrumbs("parent-portal", "Parent");
    expect(portalCrumbs).toHaveLength(1);
    expect(portalCrumbs[0].label).toBe("Parent Portal");

    const reportCardCrumbs = getBreadcrumbs("report-cards", "Parent", "Faith Wanjiku");
    expect(reportCardCrumbs).toHaveLength(2);
    expect(reportCardCrumbs[0].label).toBe("Parent Portal");
    expect(reportCardCrumbs[1].label).toBe("Report Card: Faith Wanjiku");
  });

  it("handles top-level views cleanly", () => {
    const crumbs = getBreadcrumbs("overview", "Admin");
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].label).toBe("Overview");
  });
});
