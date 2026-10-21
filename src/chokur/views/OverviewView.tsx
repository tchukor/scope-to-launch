import React from "react";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { useGrading } from "../context/GradingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/chokur/components/ui";
import { StatTile, StatTileGrid } from "@/chokur/components/ui";
import { Button } from "@/chokur/components/ui";
import { Badge } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell, TableFooter } from "@/chokur/components/ui";

export const OverviewView: React.FC = () => {
  const {
    classAverage,
    passRate,
    meanGrade,
    studentsRanked,
    strongestSubject,
    weakestSubject,
    nearTheLineStudents,
    rankings,
    setActiveView,
    setSelectedStudentId,
    activeStream,
    activeExam,
    students,
    role,
    schoolConfig,
    teacherProfile,
    resetToDemoData,
  } = useGrading();

  const top5 = rankings.slice(0, 5);

  // Distribution tiers for mini-ledger
  const honorsCount = rankings.filter(
    (r) => r.meanGrade === "A" || r.meanGrade === "A-" || r.meanGrade === "B+",
  ).length;
  const honorsPct = studentsRanked > 0 ? Math.round((honorsCount / studentsRanked) * 1000) / 10 : 0;

  const passTierCount = rankings.filter(
    (r) => r.meanGrade === "B" || r.meanGrade === "B-" || r.meanGrade === "C+",
  ).length;
  const passTierPct =
    studentsRanked > 0 ? Math.round((passTierCount / studentsRanked) * 1000) / 10 : 0;

  const handleViewCard = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveView("report-cards");
  };

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 font-body-md text-[var(--color-on-surface)]">
      {/* Page Header Area */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between pb-4 sm:pb-6 border-b border-[var(--color-hairline-border)] gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Overview
          </h1>
          <p className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)] mt-1">
            {activeStream} · {activeExam} · academic performance ledger
          </p>
        </div>

        {/* Quick action buttons: Enter marks, View rankings, Print report cards */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <Button
            onClick={() => setActiveView("marks-entry")}
            size="md"
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[17px]">edit_note</span>}
            className="flex-1 sm:flex-none min-h-[44px]"
          >
            Enter marks
          </Button>

          <Button
            onClick={() => setActiveView("rankings")}
            variant="outline"
            size="md"
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[17px]">format_list_numbered</span>}
            className="flex-1 sm:flex-none min-h-[44px]"
          >
            View rankings
          </Button>

          <Button
            onClick={() => setActiveView("report-cards")}
            variant="outline"
            size="md"
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[17px]">badge</span>}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Print report cards
          </Button>
        </div>
      </section>

      {/* Role & Secondary Operations Shortcut Ribbon */}
      <section className="py-3 px-3.5 my-3 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-on-surface)]">
            <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">
              {role === "Admin" ? "shield_person" : "school"}
            </span>
            <span>
              {role === "Admin"
                ? "Administrator Workspace"
                : `Teacher Workspace (${teacherProfile.name})`}
            </span>
          </span>
          <span className="text-[var(--color-on-surface-disabled)]">•</span>
          <span className="text-[var(--color-on-surface-variant)]">
            {schoolConfig.schoolName} ({schoolConfig.academicYear} · {schoolConfig.term})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-label-caps uppercase text-[var(--color-on-surface-disabled)] hidden md:inline">
            Jump to:
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveView("attendance")}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[14px]">fact_check</span>}
            className="min-h-[36px]"
          >
            Attendance
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveView("messaging")}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[14px]">sms</span>}
            className="min-h-[36px]"
          >
            Bulk SMS
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveView("subject-analysis")}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[14px]">analytics</span>}
            className="min-h-[36px]"
          >
            Subjects
          </Button>
          {role === "Admin" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("fees")}
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[14px]">payments</span>}
              className="min-h-[36px]"
            >
              Fees
            </Button>
          )}
        </div>
      </section>

      {/* First-Time User / Empty Database Onboarding Banner */}
      {students.length === 0 && (
        <section className="mb-6 p-5 sm:p-6 bg-[var(--color-warning-light)] border border-[var(--color-warning-container)] rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-[var(--color-on-warning-container)]">school</span>
                <h3 className="font-headline-md font-bold text-[var(--color-on-warning-container)]">
                  Welcome to Chokur System
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-on-warning-container)] mt-1 max-w-2xl leading-relaxed">
                No enrolled candidates found in the database. You can start by enrolling candidates,
                configuring your school profile, or loading the official sample KCSE cohort to
                explore all features immediately.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("settings")}
                  className="font-semibold"
                >
                  1. Setup School Profile →
                </Button>
                <span className="text-[var(--color-on-surface-disabled)]">•</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("students")}
                  className="font-semibold"
                >
                  2. Enroll Students →
                </Button>
                <span className="text-[var(--color-on-surface-disabled)]">•</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("marks-entry")}
                  className="font-semibold"
                >
                  3. Enter Marks →
                </Button>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => resetToDemoData()}
              size="sm"
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">sync</span>}
              className="shrink-0 min-h-[40px]"
            >
              Load Sample Cohort (42 Students)
            </Button>
          </div>
        </section>
      )}

      {/* Metric Strip (Row of 4 ledger metrics separated by thin hairlines) */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b border-[var(--color-hairline-border)] py-6">
        {/* Metric 1 */}
        <div className="pr-6 pb-4 md:pb-0">
          <span className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] mb-1">
            CLASS AVERAGE
          </span>
          <div className="font-display-stat text-display-stat text-[var(--color-on-surface)] leading-none">
            {classAverage.toFixed(1)}%
          </div>
        </div>

        {/* Metric 2 */}
        <div className="px-0 md:px-6 pb-4 md:pb-0 border-l-0 md:border-l border-[var(--color-hairline-border)]">
          <span className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] mb-1">
            UNIVERSITY PASS RATE
          </span>
          <div className="font-display-stat text-display-stat text-[var(--color-on-surface)] leading-none">
            {passRate}%
          </div>
        </div>

        {/* Metric 3 */}
        <div className="pr-6 md:px-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[var(--color-hairline-border)]">
          <span className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] mb-1">
            MEAN GRADE
          </span>
          <div className="font-display-stat text-display-stat text-[var(--color-on-surface)] leading-none">
            {meanGrade}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="px-0 md:px-6 pt-4 md:pt-0 border-t md:border-t-0 border-l-0 md:border-l border-[var(--color-hairline-border)]">
          <span className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] mb-1">
            STUDENTS RANKED
          </span>
          <div className="font-display-stat text-display-stat text-[var(--color-on-surface)] leading-none">
            {studentsRanked}
          </div>
        </div>
      </section>

      {/* Two-Column Ledger Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 pt-8 gap-10">
        {/* LEFT COLUMN (Span 7) */}
        <div className="lg:col-span-7 space-y-8 lg:pr-8 lg:border-r lg:border-[var(--color-hairline-border)]">
          {/* Subjects at a glance */}
          <section>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline-border)]">
              <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
                Subjects at a glance
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("subject-analysis")}
                iconPosition="right"
                icon={<span className="material-symbols-outlined text-[13px]">arrow_forward</span>}
                className="bg-transparent border-none p-0"
              >
                Full Subject Analysis
              </Button>
            </div>
            <div className="py-3.5 space-y-2 border-b border-[var(--color-hairline-border)]">
              <div className="flex items-baseline justify-between font-body-md text-body-md">
                <span className="text-[var(--color-on-surface-muted)]">Strongest Subject:</span>
                <span className="text-[var(--color-on-surface)] font-medium">
                  {strongestSubject?.name || "Kiswahili"}, average{" "}
                  <span className="font-tabular-md text-tabular-md font-semibold">
                    {strongestSubject?.average?.toFixed(1) || "0.0"}%
                  </span>
                </span>
              </div>
              <div className="flex items-baseline justify-between font-body-md text-body-md">
                <span className="text-[var(--color-on-surface-muted)]">Weakest Subject:</span>
                <span className="text-[var(--color-on-surface)] font-medium">
                  {weakestSubject?.name || "Chemistry"}, average{" "}
                  <span className="font-tabular-md text-tabular-md font-semibold text-[var(--color-primary)]">
                    {weakestSubject?.average?.toFixed(1) || "0.0"}%
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* Near the line */}
          <section>
            <div className="pb-3 border-b border-[var(--color-hairline-border)]">
              <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">Near the line</h2>
              <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-0.5">
                Students within 1–2 points of the C+ university threshold (targeted academic
                intervention)
              </p>
            </div>

            {/* Ledger Table using DataTable component */}
            <div className="w-full overflow-x-auto">
              <DataTable caption="Students near university cutoff line" compact striped hoverable>
                <TableHeader>
                  <TableHead scope="col">STUDENT</TableHead>
                  <TableHead align="right" scope="col">MEAN POINTS</TableHead>
                  <TableHead align="right" scope="col">AGGREGATE</TableHead>
                  <TableHead align="left" className="pl-6" scope="col">WEAKEST SUBJECT</TableHead>
                  <TableHead align="right" scope="col">ACTION</TableHead>
                </TableHeader>
                <tbody className="divide-y divide-[var(--color-hairline-border)]">
                  {nearTheLineStudents.slice(0, 6).map((record) => (
                    <TableRow key={record.student.id} onClick={() => handleViewCard(record.student.id)} hoverable>
                      <TableCell fontWeight="medium">
                        {record.student.name}
                      </TableCell>
                      <TableCell align="right" fontVariant="tabular" fontWeight="medium">
                        {record.meanPoints.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" fontVariant="tabular">
                        {record.aggregate}/84
                      </TableCell>
                      <TableCell align="left" className="pl-6" fontVariant="tabular" fontSize="sm" color="muted">
                        {record.weakestSubject ? (
                          <span className="font-mono text-xs text-[var(--color-on-surface)]">
                            {record.weakestSubject.code} <span className="text-[var(--color-on-surface-disabled)]">·</span>{" "}
                            <span className="font-bold text-[var(--color-primary)]">
                              {record.weakestSubject.score}%
                            </span>
                          </span>
                        ) : (
                          <span className="text-[var(--color-on-surface-disabled)]">—</span>
                        )}
                      </TableCell>
                      <TableCell align="right" color="primary" fontWeight="semibold">
                        View card
                      </TableCell>
                    </TableRow>
                  ))}
                  {nearTheLineStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" color="muted" className="py-4">
                        No students currently within 1 point of the C+ cutoff line.
                      </TableCell>
                    </TableRow>
                  )}
                </tbody>
              </DataTable>
            </div>

            {/* Benchmark rule note */}
            <div className="mt-4 pt-2 border-t border-[var(--color-hairline-border)] flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[var(--color-on-surface-muted)] font-caption text-caption">
              <span>C+ university threshold benchmark: 6.50+ Mean Points</span>
              <span className="font-tabular-sm text-tabular-sm font-medium">
                {nearTheLineStudents.length} candidates in threshold window
              </span>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (Span 5) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Top 5 Section */}
          <section>
            <div className="pb-3 border-b border-[var(--color-hairline-border)] flex items-baseline justify-between">
              <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
                Top 5 Cohort Leaderboard
              </h2>
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)]">TERM STANDING</span>
            </div>

            {/* Rankings Ledger using DataTable */}
            <DataTable caption="Top 5 students by merit rank" compact hoverable>
              <TableHeader>
                <TableHead scope="col">RANK</TableHead>
                <TableHead scope="col">STUDENT</TableHead>
                <TableHead align="right" scope="col">AGGREGATE</TableHead>
                <TableHead align="center" scope="col">GRADE</TableHead>
              </TableHeader>
              <tbody className="divide-y divide-[var(--color-hairline-border)]">
                {top5.map((student) => (
                  <TableRow
                    key={student.student.id}
                    onClick={() => handleViewCard(student.student.id)}
                    hoverable
                  >
                    <TableCell fontVariant="tabular" fontWeight="bold" color="muted" className="w-4 text-center">
                      {student.rank}
                    </TableCell>
                    <TableCell fontWeight="medium" color="on-surface" className="hover:text-[var(--color-primary)]">
                      {student.student.name}
                    </TableCell>
                    <TableCell align="right" fontVariant="tabular" color="muted">
                      {student.aggregate}/84 pts
                    </TableCell>
                    <TableCell align="center">
                      <GradeChip grade={student.meanGrade} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </DataTable>

            {/* View full roster link */}
            <div className="mt-4 pt-2 border-t border-[var(--color-hairline-border)] flex justify-between items-center">
              <span className="font-caption text-caption text-[var(--color-on-surface-muted)]">
                Showing {Math.min(5, studentsRanked)} of {studentsRanked} ranked
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("rankings")}
                iconPosition="right"
                icon={<span className="material-symbols-outlined text-[14px]">arrow_forward</span>}
                className="bg-transparent border-none p-0"
              >
                View full rankings
              </Button>
            </div>
          </section>

          {/* Aggregate Spread Mini-Ledger */}
          <section className="border-t border-[var(--color-hairline-border)] pt-6">
            <span className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] mb-3">
              AGGREGATE PERFORMANCE TIERS
            </span>
            <div className="space-y-3">
              <div>
                <div className="flex items-center text-caption justify-between mb-1.5">
                  <span className="text-[var(--color-on-surface-muted)] font-tabular-sm">Honors Tier (B+ to A)</span>
                  <span className="font-tabular-md text-[var(--color-on-surface)] font-semibold">
                    {honorsCount} students ({honorsPct}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--color-surface-container)] h-1.5 rounded-none overflow-hidden">
                  <div
                    className="bg-[var(--color-on-surface)] h-full"
                    style={{ width: `${Math.min(100, honorsPct)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center text-caption justify-between mb-1.5 pt-1">
                  <span className="text-[var(--color-on-surface-muted)] font-tabular-sm">
                    Competent Pass Tier (C+ to B)
                  </span>
                  <span className="font-tabular-md text-[var(--color-on-surface)] font-semibold">
                    {passTierCount} students ({passTierPct}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--color-surface-container)] h-1.5 rounded-none overflow-hidden">
                  <div
                    className="bg-[var(--color-on-surface-muted)] h-full"
                    style={{ width: `${Math.min(100, passTierPct)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Workflow Next Steps Banner */}
      <section className="mt-6 p-4 sm:p-5 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-sm text-[var(--color-on-surface)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">route</span>
            <span>Marks Entry Workflow: Next Actions</span>
          </h4>
          <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">
            Your marks are saved locally in real time. Once scores are entered, continue to
            performance analysis or certificate generation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveView("overview")}
            className="px-3 py-2 text-xs"
          >
            ← Overview
          </Button>
          <Button
            type="button"
            onClick={() => setActiveView("rankings")}
            size="sm"
            iconPosition="right"
            icon={<span className="material-symbols-outlined text-[16px]">format_list_numbered</span>}
            className="px-3.5 py-2 text-xs"
          >
            Class Rankings →
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveView("subject-analysis")}
            iconPosition="right"
            icon={<span className="material-symbols-outlined text-[16px]">analytics</span>}
            className="px-3.5 py-2 text-xs"
          >
            Subject Analysis →
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setActiveView("report-cards")}
            iconPosition="right"
            icon={<span className="material-symbols-outlined text-[16px]">badge</span>}
            className="px-3.5 py-2 text-xs"
          >
            Report Cards →
          </Button>
        </div>
      </section>
    </div>
  );
};