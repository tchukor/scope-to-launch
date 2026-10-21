import React, { useMemo, useState } from "react";
import { GradeChip } from "../components/GradeChip";
import { useGrading } from "../context/GradingContext";
import { exportTableToCSV, getGradeFromScore, KCSE_GRADING_TABLE } from "../utils/grading";
import { GradeDistributionTier, KCSEGrade } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button, IconButton } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DataTable, TableHeader, TableHead, TableRow, TableCell, TableFooter } from "../components/ui/DataTable";
import { Select } from "../components/ui/Input";

export const GradeDistributionView: React.FC = () => {
  const {
    rankings,
    subjects,
    marks,
    filteredStudents: students,
    classAverage,
    meanGrade,
    passRate,
    activeStream,
    activeExam,
    setActiveView,
  } = useGrading();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("ALL");

  // Compute 12-tier distribution based on selected filter (ALL or specific subject)
  const activeDistributionTiers = useMemo<GradeDistributionTier[]>(() => {
    let gradeList: KCSEGrade[] = [];

    if (selectedSubjectFilter === "ALL") {
      gradeList = rankings.map((r) => r.meanGrade);
    } else {
      students.forEach((s) => {
        const val = marks[s.id]?.[selectedSubjectFilter];
        if (typeof val === "number") {
          gradeList.push(getGradeFromScore(val).grade);
        }
      });
    }

    const totalCount = gradeList.length || 1;
    let cumulative = 0;

    return KCSE_GRADING_TABLE.map((row) => {
      const count = gradeList.filter((g) => g === row.grade).length;
      const share = Math.round((count / totalCount) * 1000) / 10;
      cumulative += share;

      return {
        grade: row.grade,
        pointsEquivalent: row.points,
        studentCount: count,
        cohortShare: share,
        cumulativePercentage: Math.min(100, Math.round(cumulative * 10) / 10),
      };
    });
  }, [rankings, selectedSubjectFilter, students, marks]);

  // Compute 5 letter grade categories (A, B, C, D, E) for the column chart
  const letterCategoryStats = useMemo(() => {
    let gradesList: string[] = [];

    if (selectedSubjectFilter === "ALL") {
      gradesList = rankings.map((r) => r.meanGrade);
    } else {
      students.forEach((s) => {
        const val = marks[s.id]?.[selectedSubjectFilter];
        if (typeof val === "number") {
          gradesList.push(getGradeFromScore(val).grade);
        }
      });
    }

    const total = gradesList.length || 1;

    const countA = gradesList.filter((g) => g.startsWith("A")).length;
    const countB = gradesList.filter((g) => g.startsWith("B")).length;
    const countC = gradesList.filter((g) => g.startsWith("C")).length;
    const countD = gradesList.filter((g) => g.startsWith("D")).length;
    const countE = gradesList.filter((g) => g.startsWith("E")).length;

    const pctA = Math.round((countA / total) * 100);
    const pctB = Math.round((countB / total) * 100);
    const pctC = Math.round((countC / total) * 100);
    const pctD = Math.round((countD / total) * 100);
    const pctE = Math.round((countE / total) * 100);

    return [
      { letter: "A", count: countA, pct: pctA },
      { letter: "B", count: countB, pct: pctB },
      { letter: "C", count: countC, pct: pctC },
      { letter: "D", count: countD, pct: pctD },
      { letter: "E", count: countE, pct: pctE },
    ];
  }, [rankings, selectedSubjectFilter, students, marks]);

  const maxBarCount = Math.max(...letterCategoryStats.map((c) => c.count), 1);

  const evaluatedCount =
    selectedSubjectFilter === "ALL"
      ? rankings.length
      : students.filter((s) => typeof marks[s.id]?.[selectedSubjectFilter] === "number").length;

  const selectedSubjectName =
    selectedSubjectFilter === "ALL"
      ? "Class Aggregate Standing"
      : subjects.find((s) => s.code === selectedSubjectFilter)?.name || selectedSubjectFilter;

  // University pass metrics
  const qualifiedCount = useMemo(() => {
    return activeDistributionTiers
      .filter((t) => t.pointsEquivalent >= 7)
      .reduce((sum, curr) => sum + curr.studentCount, 0);
  }, [activeDistributionTiers]);

  const belowCutoffCount = evaluatedCount - qualifiedCount;

  const handleExportDistribution = () => {
    const headers = [
      "KCSE Grade",
      "Points Equivalent",
      "Candidate Count",
      "Cohort Share (%)",
      "Cumulative (%)",
      "University Eligible",
    ];

    const rows = activeDistributionTiers.map((t) => [
      t.grade,
      String(t.pointsEquivalent),
      String(t.studentCount),
      `${t.cohortShare.toFixed(1)}%`,
      `${t.cumulativePercentage.toFixed(1)}%`,
      t.pointsEquivalent >= 7 ? "YES" : "NO",
    ]);

    exportTableToCSV(
      `KCSE_Grade_Distribution_${selectedSubjectFilter}_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`,
      headers,
      rows,
    );
  };

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-body-md text-[var(--color-on-surface)]">
      {/* Header Section */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between pb-4 sm:pb-6 border-b border-[var(--color-hairline-border)] gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Grade Distribution
          </h1>
          <p className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)] mt-1">
            {activeStream} · {activeExam} · 12-tier KNEC cohort frequency distribution
          </p>
        </div>

        {/* Filter Controls Ribbon */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 no-print">
          {/* Subject / Aggregate Switcher */}
          <Select
            value={selectedSubjectFilter}
            onValueChange={setSelectedSubjectFilter}
            className="min-w-[200px] sm:min-w-[240px]"
            icon={<span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">filter_list</span>}
          >
            <option value="ALL">Cohort KCSE Mean Grade</option>
            {subjects.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} — {s.name}
              </option>
            ))}
          </Select>

          {/* Export Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDistribution}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">file_download</span>}
            className="min-h-[40px]"
          >
            Export CSV
          </Button>
        </div>
      </section>

      {/* Monochrome Column Chart Section */}
      <Card variant="elevated" className="my-4 sm:my-6">
        <CardHeader className="pb-3 border-b border-[var(--color-hairline-border)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-1">
            <div className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] tracking-wider uppercase text-[11px]">
              {selectedSubjectFilter === "ALL"
                ? "COHORT MEAN GRADE FREQUENCY"
                : `${selectedSubjectFilter} GRADE FREQUENCY`}
            </div>
            <div className="font-tabular-sm text-xs sm:text-tabular-sm text-[var(--color-on-surface-muted)]">
              Evaluated cohort: {evaluatedCount} candidates
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-6">
          {/* The Chart Area */}
          <div className="relative w-full h-[240px] sm:h-[280px] flex flex-col justify-end pt-6 pb-6 sm:pb-8 px-2 sm:px-4">
            <div className="absolute inset-x-0 bottom-6 sm:bottom-8 border-b-2 border-[var(--color-on-surface)]"></div>

            {/* 5 Columns Grid */}
            <div className="relative z-10 grid grid-cols-5 gap-2 sm:gap-8 lg:gap-12 h-full items-end pb-0.5">
              {letterCategoryStats.map((cat) => {
                const isTallest = cat.count === maxBarCount && cat.count > 0;
                const barHeightPct = maxBarCount > 0 ? (cat.count / maxBarCount) * 85 : 0;

                return (
                  <div
                    key={cat.letter}
                    className="flex flex-col items-center h-full justify-end group"
                  >
                    <div className="font-tabular-sm text-xs sm:text-tabular-sm text-[var(--color-on-surface)] mb-1.5 text-center whitespace-nowrap">
                      <span className={isTallest ? "font-bold" : "font-medium"}>{cat.count}</span>{" "}
                      <span className="text-[var(--color-on-surface-muted)] hidden sm:inline">· {cat.pct}%</span>
                    </div>

                    <div
                      className={`w-full max-w-[48px] sm:max-w-[68px] transition-all duration-300 ${
                        isTallest ? "bg-[var(--color-on-surface)]" : "bg-[var(--color-on-surface-muted)]"
                      }`}
                      style={{ height: `${Math.max(4, barHeightPct)}%` }}
                    ></div>

                    <div
                      className={`mt-2 sm:mt-3 font-tabular-md text-sm sm:text-tabular-md ${
                        isTallest ? "font-bold text-[var(--color-on-surface)]" : "font-semibold text-[var(--color-on-surface)]"
                      }`}
                    >
                      {cat.letter}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Under-chart Text Note */}
          <div className="mt-3 pt-2.5 border-t border-[var(--color-hairline-border)] flex flex-wrap items-center justify-between text-xs gap-1">
            <div className="text-[var(--color-primary)] font-body-sm font-medium flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span>KNEC: A, A-, B+, B, B-, C+, C, C-, D+, D, D-, E</span>
            </div>
            <span className="font-caption text-caption text-[var(--color-on-surface-muted)] text-[10px] sm:text-xs">
              C+ Pass vs C Marginal
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics Ledger */}
      <Card variant="elevated" className="mb-6">
        <CardContent className="p-0">
          <div className="border-y border-[var(--color-hairline-border)] divide-y divide-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)]">
            <div className="flex items-center justify-between py-3 px-3 sm:px-4">
              <span className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)]">
                Class Mean Grade
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-tabular-lg text-lg sm:text-tabular-lg font-bold text-[var(--color-on-surface)]">
                  {meanGrade}
                </span>
                <span className="font-tabular-sm text-xs sm:text-tabular-sm text-[var(--color-on-surface-muted)]">
                  ({classAverage.toFixed(1)}% mean score)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 px-3 sm:px-4">
              <span className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)]">
                University Qualified (C+ & Above)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-tabular-lg text-lg sm:text-tabular-lg font-bold text-[var(--color-on-surface)]">
                  {evaluatedCount > 0 ? Math.round((qualifiedCount / evaluatedCount) * 100) : 0}%
                </span>
                <span className="font-tabular-sm text-xs sm:text-tabular-sm text-[var(--color-on-surface-muted)]">
                  ({qualifiedCount} of {evaluatedCount})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 px-3 sm:px-4">
              <span className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)]">
                Candidates Below C+ Threshold
              </span>
              <div className="font-tabular-lg text-lg sm:text-tabular-lg font-bold text-[var(--color-on-surface)]">
                {belowCutoffCount}{" "}
                <span className="font-body-sm text-xs sm:text-body-sm font-normal text-[var(--color-on-surface-muted)]">
                  candidates
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          VIEW A: MOBILE TOUCH 12-TIER LEDGER (< 768px)
          ========================================================================= */}
      <div className="md:hidden space-y-2 mb-6">
        <h2 className="font-headline-sm text-sm text-[var(--color-on-surface)] font-semibold mb-2">
          KCSE 12-Grade Breakdown — {selectedSubjectName}
        </h2>
        {activeDistributionTiers.map((tier) => {
          const isCPlus = tier.grade === "C+";
          return (
            <React.Fragment key={tier.grade}>
              <Card variant="elevated" className="p-0">
                <CardContent className="p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GradeChip grade={tier.grade} size="sm" />
                      <span className="text-xs text-[var(--color-on-surface-muted)] font-tabular-sm">
                        {tier.pointsEquivalent} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-tabular-sm">
                      <span className="font-bold text-[var(--color-on-surface)]">{tier.studentCount} students</span>
                      <span className="text-[var(--color-on-surface-muted)]">({tier.cohortShare.toFixed(1)}%)</span>
                      <span className="text-[10px] text-[var(--color-on-surface-disabled)]">
                        Cum: {tier.cumulativePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isCPlus && (
                <Card variant="outlined" className="py-2 my-1 border-y-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container-low)] px-3">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-label-caps font-bold uppercase text-[var(--color-on-surface)]">
                        C+ CUTOFF (DIRECT DEGREE ENTRY PASS LINE)
                      </span>
                      <span className="w-1.5 h-1.5 bg-[var(--color-on-surface)] rounded-full"></span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* =========================================================================
          VIEW B: DESKTOP DETAILED 12-GRADE BREAKDOWN TABLE (≥ 768px)
          ========================================================================= */}
      <section className="hidden md:block">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
            KCSE Full 12-Grade Ledger Breakdown — {selectedSubjectName}
          </h2>
          <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
            Normative Distribution
          </span>
        </div>

        <Card variant="elevated" className="overflow-hidden">
          <CardContent className="p-0">
            <DataTable hoverable compact>
              <TableHeader>
                <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                  <TableHead scope="col" className="w-28 px-4">KCSE Grade</TableHead>
                  <TableHead scope="col" className="w-36 px-4">Points Equivalent</TableHead>
                  <TableHead scope="col" className="px-4 text-right">Candidate Count</TableHead>
                  <TableHead scope="col" className="px-4 text-right">Cohort Share</TableHead>
                  <TableHead scope="col" className="px-4 text-right">Cumulative %</TableHead>
                </tr>
              </TableHeader>
              <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                {activeDistributionTiers.map((tier) => {
                  const isCPlus = tier.grade === "C+";

                  return (
                    <React.Fragment key={tier.grade}>
                      <TableRow className="h-11 hover:bg-[var(--color-surface-container)] transition-colors">
                        <TableCell className="px-4">
                          <GradeChip grade={tier.grade} />
                        </TableCell>
                        <TableCell className="px-4 font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)]">
                          {tier.pointsEquivalent} Points
                        </TableCell>
                        <TableCell className="px-4 text-right font-tabular-md font-semibold text-[var(--color-on-surface)]">
                          {tier.studentCount}
                        </TableCell>
                        <TableCell className="px-4 text-right font-tabular-sm text-[var(--color-on-surface-muted)]">
                          {tier.cohortShare.toFixed(1)}%
                        </TableCell>
                        <TableCell className="px-4 text-right font-tabular-sm text-[var(--color-on-surface)]">
                          {tier.cumulativePercentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>

                      {/* The Cutoff Boundary Line after C+ */}
                      {isCPlus && (
                        <TableRow className="bg-[var(--color-surface-container-low)]">
                          <TableCell colSpan={5} className="py-1 px-4 border-y-2 border-[var(--color-on-surface)]">
                            <div className="flex items-center justify-between">
                              <span className="font-label-caps text-label-caps text-[var(--color-on-surface)] uppercase tracking-widest font-bold flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 bg-[var(--color-on-surface)] inline-block"></span>
                                C+ Cutoff Boundary — Minimum Direct University Entry Requirement
                              </span>
                              <span className="font-tabular-sm text-[var(--color-on-surface)] font-semibold text-xs">
                                KUCCPS Pass Line
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <TableFooter>
                <tr className="border-t-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container-low)] font-semibold">
                  <TableCell className="py-3 px-4 font-body-sm text-body-sm text-[var(--color-on-surface)]">
                    Total Cohort Evaluated
                  </TableCell>
                  <TableCell className="py-3 px-4 font-tabular-sm text-[var(--color-on-surface-muted)]">—</TableCell>
                  <TableCell className="py-3 px-4 text-right font-tabular-md text-[var(--color-on-surface)]">
                    {evaluatedCount} Candidates
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right font-tabular-sm text-[var(--color-on-surface)]">
                    100.0%
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right font-tabular-sm text-[var(--color-on-surface)]">
                    100.0%
                  </TableCell>
                </tr>
              </TableFooter>
            </DataTable>
          </CardContent>
        </Card>
      </section>

      {/* Workflow Next Steps Banner */}
      <Card variant="outlined" className="mt-6">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">route</span>
                <span>Grade Distribution: Next Steps</span>
              </h4>
              <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">
                Verify cohort standing, review individual student positions, or produce official report
                cards.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveView("overview")} className="px-3 py-2 text-xs">
                ← Overview
              </Button>
              <Button size="sm" onClick={() => setActiveView("rankings")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">format_list_numbered</span>} className="px-3.5 py-2 text-xs">
                Class Rankings →
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setActiveView("report-cards")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">badge</span>} className="px-3.5 py-2 text-xs">
                Report Cards →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};