/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavBar } from './components/TopNavBar';
import { GradingProvider, useGrading } from './context/GradingContext';
import { GradeDistributionView } from './views/GradeDistributionView';
import { LandingPageView } from './views/LandingPageView';
import { MarksEntryView } from './views/MarksEntryView';
import { OverviewView } from './views/OverviewView';
import { ProfileInboxView } from './views/ProfileInboxView';
import { RankingsView } from './views/RankingsView';
import { ReportCardsView } from './views/ReportCardsView';
import { SettingsView } from './views/SettingsView';
import { StudentsClassesView } from './views/StudentsClassesView';
import { SubjectAnalysisView } from './views/SubjectAnalysisView';

const MainContent: React.FC = () => {
  const { activeView } = useGrading();

  // Full-bleed Marketing Landing Page & Technical Spec Sheet
  if (activeView === 'landing') {
    return <LandingPageView />;
  }

  return (
    <div className="min-h-screen bg-[#FEF9EF] text-[#111111] flex flex-col font-body-md text-body-md select-text">
      {/* Responsive Navigation Shell (Sidebar on Tablet/Desktop, Bottom Bar on Phone) */}
      <Sidebar />

      {/* Responsive Fixed Top Context Bar */}
      <TopNavBar />

      {/* Main Workspace Canvas with responsive offsets and ultrawide centering */}
      <main className="pb-20 md:pb-6 md:ml-[72px] lg:ml-[200px] xl:ml-[220px] pt-14 min-h-screen flex-1 flex flex-col bg-[#FEF9EF] min-w-0 transition-all duration-200">
        {activeView === 'overview' && <OverviewView />}
        {activeView === 'marks-entry' && <MarksEntryView />}
        {activeView === 'rankings' && <RankingsView />}
        {activeView === 'subject-analysis' && <SubjectAnalysisView />}
        {activeView === 'grade-distribution' && <GradeDistributionView />}
        {activeView === 'report-cards' && <ReportCardsView />}
        {activeView === 'students' && <StudentsClassesView />}
        {activeView === 'profile' && <ProfileInboxView />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <GradingProvider>
      <MainContent />
    </GradingProvider>
  );
}
