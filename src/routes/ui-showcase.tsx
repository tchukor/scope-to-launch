import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { ChokurLogo } from "@/chokur/components/brand/ChokurLogo";

// Lazy load heavy views for performance
const OverviewDemo = lazy(() =>
  import("@/chokur/views/OverviewView").then((m) => ({ default: m.OverviewView })),
);
const MarksEntryDemo = lazy(() =>
  import("@/chokur/views/MarksEntryView").then((m) => ({ default: m.MarksEntryView })),
);
const RankingsDemo = lazy(() =>
  import("@/chokur/views/RankingsView").then((m) => ({ default: m.RankingsView })),
);
const ReportCardsDemo = lazy(() =>
  import("@/chokur/views/ReportCardsView").then((m) => ({ default: m.ReportCardsView })),
);
const GradeDistributionDemo = lazy(() =>
  import("@/chokur/views/GradeDistributionView").then((m) => ({
    default: m.GradeDistributionView,
  })),
);
const StudentsClassesDemo = lazy(() =>
  import("@/chokur/views/StudentsClassesView").then((m) => ({ default: m.StudentsClassesView })),
);
const SubjectAnalysisDemo = lazy(() =>
  import("@/chokur/views/SubjectAnalysisView").then((m) => ({ default: m.SubjectAnalysisView })),
);
const SettingsDemo = lazy(() =>
  import("@/chokur/views/SettingsView").then((m) => ({ default: m.SettingsView })),
);

const TITLE = "UI Showcase — Chokur Design System";
const DESC = "Interactive demo of Chokur's dashboard screens built with the design system";

export const Route = createFileRoute("/ui-showcase")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: UIShowcaseRoot,
});

function UIShowcaseRoot() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body-md">
      <ShowcaseShell />
    </div>
  );
}

function ShowcaseShell() {
  const [activeDemo, setActiveDemo] = React.useState<DemoKey>("overview");

  return (
    <>
      {/* Showcase Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav
          className="mx-auto max-w-[1400px] flex h-14 items-center justify-between px-4"
          aria-label="Showcase navigation"
        >
          <Link to="/" className="flex items-center gap-2 shrink-0" title="Back to Chokur App">
            <ChokurLogo variant="symbol" size={28} className="text-primary" />
            <span className="hidden sm:inline font-headline-sm text-foreground">Chokur</span>
          </Link>

          <div
            className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-4 pb-1 scrollbar-hide"
            role="tablist"
            aria-label="Demo views"
          >
            {DEMOS.map((demo) => (
              <button
                key={demo.key}
                role="tab"
                aria-selected={activeDemo === demo.key}
                onClick={() => setActiveDemo(demo.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeDemo === demo.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{demo.icon}</span>
                <span className="hidden xs:inline">{demo.label}</span>
              </button>
            ))}
          </div>

          <Link
            to="/ui-components"
            className="shrink-0 flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          >
            <span className="material-symbols-outlined text-[18px]">widgets</span>
            <span className="hidden sm:inline">Components</span>
          </Link>
        </nav>
      </header>

      {/* Demo Content Area */}
      <main className="mx-auto max-w-[1400px] flex-1 p-4 md:p-6">
        <Suspense fallback={<DemoSkeleton />}>
          {DEMOS.find((d) => d.key === activeDemo)?.component}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 text-sm text-muted-foreground">
          <p>Chokur Design System v1.0 — Built with shadcn/ui + TanStack Start</p>
          <div className="flex items-center gap-4">
            <Link to="/ui-components" className="hover:text-foreground transition-colors">
              Component Library
            </Link>
            <Link
              to="https://github.com/tchukor/scope-to-launch"
              target="_blank"
              rel="noopener"
              className="hover:text-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] align-middle">code</span>
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function DemoSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-1/4 bg-muted rounded" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  );
}

// Demo configurations
type DemoKey =
  | "overview"
  | "marks-entry"
  | "rankings"
  | "report-cards"
  | "grade-distribution"
  | "students"
  | "subject-analysis"
  | "settings";

interface DemoConfig {
  key: DemoKey;
  label: string;
  icon: string;
  component: React.ReactElement;
}

const DEMOS: DemoConfig[] = [
  {
    key: "overview",
    label: "Overview",
    icon: "dashboard",
    component: (
      <DemoWrapper
        title="Overview Dashboard"
        description="System-wide stats, recent activity, and quick actions"
      >
        {" "}
        <OverviewDemo />{" "}
      </DemoWrapper>
    ),
  },
  {
    key: "marks-entry",
    label: "Marks Entry",
    icon: "edit_note",
    component: (
      <DemoWrapper
        title="Marks Entry"
        description="Spreadsheet-style marks entry with inline validation"
      >
        {" "}
        <MarksEntryDemo />{" "}
      </DemoWrapper>
    ),
  },
  {
    key: "rankings",
    label: "Rankings",
    icon: "format_list_numbered",
    component: (
      <DemoWrapper
        title="Class Rankings"
        description="Student rankings with percentile, stream filters, and export"
      >
        {" "}
        <RankingsDemo />{" "}
      </DemoWrapper>
    ),
  },
  {
    key: "report-cards",
    label: "Report Cards",
    icon: "badge",
    component: (
      <DemoWrapper title="Report Cards" description="Official KCSE-format printable report cards">
        {" "}
        <ReportCardsDemo />{" "}
      </DemoWrapper>
    ),
  },
  {
    key: "grade-distribution",
    label: "Grade Distribution",
    icon: "bar_chart",
    component: (
      <DemoWrapper
        title="Grade Distribution"
        description="Subject and class grade analytics with charts"
      >
        {" "}
        <GradeDistributionDemo />{" "}
      </DemoWrapper>
    ),
  },
  {
    key: "students",
    label: "Students & Classes",
    icon: "group",
    component: (
      <DemoWrapper
        title="Students & Classes"
        description="Student roster, class management, and enrollment"
      >
        {" "}
        <StudentsClassesDemo />{" "}
      </DemoWrapper>
    ),
  },
  {
    key: "subject-analysis",
    label: "Subject Analysis",
    icon: "analytics",
    component: (
      <DemoWrapper title="Subject Analysis" description="Deep-dive subject performance analytics">
        {" "}
        <SubjectAnalysisDemo />{" "}
      </DemoWrapper>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: "settings",
    component: (
      <DemoWrapper
        title="Settings & Backups"
        description="App configuration, data management, and offline sync"
      >
        {" "}
        <SettingsDemo />{" "}
      </DemoWrapper>
    ),
  },
];

function DemoWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-foreground tracking-tight">{title}</h1>
          <p className="mt-1 text-muted-foreground text-body-md">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            Live Component
          </span>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">{children}</div>
    </div>
  );
}

// React import for hooks
import * as React from "react";
