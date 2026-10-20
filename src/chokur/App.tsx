/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNavBar } from "./components/TopNavBar";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { KeyboardHelp } from "./components/KeyboardHelp";
import { GradingProvider, useGrading } from "./context/GradingContext";
import { canSee, homeFor } from "./utils/roles";
import { ProtectedView } from "./components/ProtectedView";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { AttendanceView } from "./views/AttendanceView";
import { BulkSmsView } from "./views/BulkSmsView";
import { FeesView } from "./views/FeesView";
import { ParentPortalView } from "./views/ParentPortalView";
import { GradeDistributionView } from "./views/GradeDistributionView";
import { MarksEntryView } from "./views/MarksEntryView";
import { OverviewView } from "./views/OverviewView";
import { ProfileInboxView } from "./views/ProfileInboxView";
import { RankingsView } from "./views/RankingsView";
import { ReportCardsView } from "./views/ReportCardsView";
import { SettingsView } from "./views/SettingsView";
import { StudentsClassesView } from "./views/StudentsClassesView";
import { SubjectAnalysisView } from "./views/SubjectAnalysisView";

const MainContent: React.FC = () => {
  const { activeView, role, setActiveView, students } = useGrading();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem("chokur.onboarding_complete");
    const hasUsedApp = localStorage.getItem("chokur.has_used_app");
    if (!hasCompleted && !hasUsedApp && students.length === 0) setShowOnboarding(true);
  }, [students.length]);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => { localStorage.setItem("chokur.has_used_app", "true"); setShowOnboarding(false); }} />;
  }

  // Role Access Guard: Prevent unauthorized view access
  if (!canSee(role, activeView)) {
    return (
      <div className="min-h-screen bg-[#FEF9EF] text-[#111111] flex flex-col font-body-md text-body-md select-text">
        <Sidebar />
        <TopNavBar />
        <main className="pb-20 md:pb-6 md:ml-[72px] lg:ml-[200px] xl:ml-[220px] pt-14 min-h-screen flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <h2 className="font-headline-md text-lg font-bold text-[#111111]">Access Restricted</h2>
            <p className="text-sm text-[#5F5E5E] mt-2 leading-relaxed">
              The requested view (
              <span className="font-mono text-xs font-semibold">{activeView}</span>) is restricted
              for the <strong>{role}</strong> role.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView(homeFor(role))}
                className="px-4 py-2 bg-[#C2410C] text-white rounded font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Return to {role === "Parent" ? "Parent Portal" : "Overview"}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedView>
      <div className="min-h-screen bg-[#FEF9EF] text-[#111111] flex flex-col font-body-md text-body-md select-text">
        {/* Responsive Navigation Shell (Sidebar on Tablet/Desktop, Bottom Bar on Phone) */}
        <Sidebar />

        {/* Responsive Fixed Top Context Bar */}
        <TopNavBar />

        {/* Main Workspace Canvas with responsive offsets and ultrawide centering */}
        <main className="pb-20 md:pb-6 md:ml-[72px] lg:ml-[200px] xl:ml-[220px] pt-14 min-h-screen flex-1 flex flex-col bg-[#FEF9EF] min-w-0 transition-all duration-200">
          <Breadcrumbs />
          <KeyboardHelp />
          {activeView === "overview" && <OverviewView />}
          {activeView === "marks-entry" && <MarksEntryView />}
          {activeView === "rankings" && <RankingsView />}
          {activeView === "subject-analysis" && <SubjectAnalysisView />}
          {activeView === "grade-distribution" && <GradeDistributionView />}
          {activeView === "report-cards" && <ReportCardsView />}
          {activeView === "students" && <StudentsClassesView />}
          {activeView === "attendance" && <AttendanceView />}
          {activeView === "messaging" && <BulkSmsView />}
          {activeView === "fees" && <FeesView />}
          {activeView === "parent-portal" && <ParentPortalView />}
          {activeView === "profile" && <ProfileInboxView />}
          {activeView === "settings" && <SettingsView />}
        </main>
      </div>
    </ProtectedView>
  );
};

export default function App() {
  return (
    <GradingProvider>
      <MainContent />
    </GradingProvider>
  );
}
