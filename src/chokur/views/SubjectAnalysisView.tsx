import React, { useMemo, useState } from "react";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { useGrading } from "../context/GradingContext";
import { exportTableToCSV, getGradeFromScore } from "../utils/grading";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge, StatusBadge } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell } from "@/chokur/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/chokur/components/ui";

export const SubjectAnalysisView: React.FC = () => {
  const { subjectDepartmentalStats, classAverage, activeStream, activeExam, setActiveView } =
    useGrading();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [comparePrevious, setComparePrevious] = useState(true);

  // Departmental filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    subjectDepartmentalStats.forEach((s) => {
      if (s.subject.department) set.add(s.subject.department);
    });
    return Array.from(set);
  }, [subjectDepartmentalStats]);

  const filteredStats = useMemo(() => {
    if (selectedDepartment === "ALL") return subjectDepartmentalStats;
    return subjectDepartmentalStats.filter((s) => s.subject.department === selectedDepartment);
  }, [subjectDepartmentalStats, selectedDepartment]);

  // Identify drag subjects
  const dragSubjects = useMemo(() => {
    return subjectDepartmentalStats.filter((s) => s.average < classAverage - 4.0);
  }, [subjectDepartmentalStats, classAverage]);

  const handleExportCSV = () => {
    const headers = [
      "Subject Code",
      "Subject Name",
      "Department",
      "Subject Teacher",
      "Entries",
      "Average Score (%)",
      "Mean Grade",
      "Highest Mark",
      "Lowest Mark",
      "Pass Rate (%)",
      "Vs Previous Exam",
    ];

    const rows = filteredStats.map((s) => {
      const grade = getGradeFromScore(s.average);
      return [
        s.subject.code,
        s.subject.name,
        s.subject.department,
        s.subject.teacher || "—",
        s.entered,
        s.average.toFixed(1),
        grade.grade,
        s.highest,
        s.lowest,
        `${s.passRate}%`,
        `${s.diffFromLastExam >= 0 ? "+" : ""}${s.diffFromLastExam.toFixed(1)}`,
      ];
    });

    exportTableToCSV(
      `Subject_Analysis_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`,
      headers,
      rows,
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 font-body-md text-[var(--color-on-surface)]">
      {/* Header & Controls */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-[var(--color-hairline-border)]">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Subject Analysis
          </h1>
          <p className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)] mt-1">
            {activeStream} · {activeExam} · performance diagnostics & curriculum benchmark
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap no-print">
          {/* Department Filter */}
          <div className="flex flex-wrap items-center border border-[var(--color-hairline-border)] rounded-lg bg-[var(--color-surface-container-low)] text-xs font-medium overflow-hidden max-w-full" role="group" aria-label="Department filter">
            <Button
              variant={selectedDepartment === "ALL" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedDepartment("ALL")}
              className="min-h-[40px]"
            >
              All Depts
            </Button>
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSelectedDepartment(dept)}
                className="min-h-[40px] px-2.5 sm:px-3 truncate max-w-[90px] sm:max-w-none"
              >
                {dept}
              </Button>
            ))}
          </div>

          {/* Export CSV */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">download</span>}
            className="min-h-[40px]"
          >
            Export CSV
          </Button>

          {/* Print */}
          <Button
            size="sm"
            onClick={handlePrint}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">print</span>}
            className="min-h-[40px]"
          >
            Print
          </Button>
        </div>
      </section>

      {/* Critical Drag Warning Callouts */}
      {dragSubjects.length > 0 && (
        <Card variant="outlined" className="my-4 sm:my-6 border-l-4 border-[var(--color-primary)]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[var(--color-primary)] text-[20px] mt-0.5">
                priority_high
              </span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
                  Curriculum Drag Diagnostic
                </h3>
                <p className="font-body-sm text-xs sm:text-body-sm text-[var(--color-on-surface-muted)] mt-0.5">
                  The following subject{dragSubjects.length > 1 ? "s are" : " is"} performing
                  significantly below the class average of {classAverage.toFixed(1)}%:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dragSubjects.map((d) => (
                    <Badge key={d.subject.code} variant="outline" className="gap-1.5">
                      <strong>
                        {d.subject.code} ({d.subject.name}):
                      </strong>{" "}
                      {d.average.toFixed(1)}% mean
                      <span className="text-[var(--color-primary)] font-semibold">
                        ({(d.average - classAverage).toFixed(1)}% vs class avg)
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* HORIZONTAL BENCHMARK BAR CHART */}
      <Card variant="outlined" className="my-4 sm:my-6">
        <CardHeader className="pb-3 border-b border-[var(--color-hairline-border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider text-[11px]">
              SUBJECT MEAN SCORE BENCHMARK CHART
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-caption text-[var(--color-on-surface-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[var(--color-on-surface)] inline-block"></span>
                <span>Above C+ (55%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[var(--color-primary)] inline-block"></span>
                <span>Below C+ (55%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-t-2 border-dashed border-[var(--color-on-surface)] inline-block"></span>
                <span>55% Cutoff line</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-6">
          {/* Bar Chart Container */}
          <div className="relative space-y-3">
            {/* Vertical 55% C+ Benchmark Line */}
            <div
              className="absolute top-0 bottom-6 border-r-2 border-dashed border-[var(--color-on-surface)] z-10 pointer-events-none"
              style={{ left: "55%" }}
            >
              <span className="absolute -top-3 -translate-x-1/2 bg-[var(--color-on-surface)] text-[var(--color-on-surface)] text-[10px] font-bold px-1.5 py-0.2 rounded-[2px]">
                55% C+
              </span>
            </div>

            {filteredStats.map((stat) => {
              const grade = getGradeFromScore(stat.average);
              const isPassing = stat.average >= 55;

              return (
                <div key={stat.subject.code} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-14 sm:w-24 text-right shrink-0">
                    <span className="font-semibold text-xs text-[var(--color-on-surface)] block">
                      {stat.subject.code}
                    </span>
                    <span className="text-[10px] text-[var(--color-on-surface-muted)] truncate hidden sm:block">
                      {stat.subject.department}
                    </span>
                  </div>

                  <div className="flex-1 bg-[var(--color-surface-container)] h-6 rounded-none relative overflow-hidden flex items-center">
                    <div
                      className={`h-full transition-all duration-300 flex items-center justify-end pr-2 text-xs font-bold text-[var(--color-on-primary)] ${
                        isPassing ? "bg-[var(--color-on-surface)]" : "bg-[var(--color-primary)]"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(10, stat.average))}%` }}
                    >
                      <span className="font-tabular-sm text-[11px]">{stat.average.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="w-16 sm:w-20 shrink-0 flex items-center justify-end gap-1.5">
                    <GradeChip grade={grade.grade} size="sm" />
                    {comparePrevious && (
                      <span
                        className={`text-[10px] sm:text-[11px] font-tabular-sm font-semibold hidden sm:inline ${
                          stat.diffFromLastExam >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                        }`}
                      >
                        {stat.diffFromLastExam >= 0
                          ? `+${stat.diffFromLastExam.toFixed(1)}`
                          : stat.diffFromLastExam.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for mobile/desktop views */}
      <Tabs defaultValue="table" className="w-full" variant="underline">
        <TabsList className="hidden md:flex" aria-label="View mode">
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" forceMount>
          {/* =========================================================================
              VIEW B: DESKTOP & PRINT TABLE (≥ 768px)
              ========================================================================= */}
          <Card variant="elevated" className="hidden md:block overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <DataTable hoverable compact>
                  <TableHeader>
                    <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                      <TableHead scope="col" className="w-20 px-4">CODE</TableHead>
                      <TableHead scope="col" className="px-4">SUBJECT NAME</TableHead>
                      <TableHead scope="col" className="px-4">DEPARTMENT</TableHead>
                      <TableHead scope="col" className="px-4">TEACHER</TableHead>
                      <TableHead scope="col" className="w-24 px-3 text-right">ENTRIES</TableHead>
                      <TableHead scope="col" className="w-28 px-3 text-right">AVERAGE</TableHead>
                      <TableHead scope="col" className="w-20 px-2 text-center">GRADE</TableHead>
                      <TableHead scope="col" className="w-24 px-3 text-right">HIGH / LOW</TableHead>
                      <TableHead scope="col" className="w-28 px-3 text-right">PASS RATE</TableHead>
                      <TableHead scope="col" className="w-28 px-4 text-right">DEVIATION</TableHead>
                    </tr>
                  </TableHeader>
                  <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm text-[var(--color-on-surface)]">
                    {filteredStats.map((stat) => {
                      const grade = getGradeFromScore(stat.average);

                      return (
                        <TableRow key={stat.subject.code} className="h-11 hover:bg-[var(--color-surface-container)] transition-colors">
                          <TableCell className="px-4 font-tabular-sm font-bold text-[var(--color-on-surface)]">
                            {stat.subject.code}
                          </TableCell>
                          <TableCell className="px-4 font-medium text-[var(--color-on-surface)]">{stat.subject.name}</TableCell>
                          <TableCell className="px-4 text-[var(--color-on-surface-muted)]">{stat.subject.department}</TableCell>
                          <TableCell className="px-4 text-[var(--color-on-surface)]">{stat.subject.teacher || "—"}</TableCell>
                          <TableCell className="px-3 text-right font-tabular-sm text-[var(--color-on-surface-muted)]">
                            {stat.entered}
                          </TableCell>
                          <TableCell className="px-3 text-right font-tabular-md font-semibold text-[var(--color-on-surface)]">
                            {stat.average.toFixed(1)}%
                          </TableCell>
                          <TableCell className="px-2 text-center">
                            <GradeChip grade={grade.grade} size="sm" />
                          </TableCell>
                          <TableCell className="px-3 text-right font-tabular-sm text-[var(--color-on-surface-muted)]">
                            {stat.highest} / {stat.lowest}
                          </TableCell>
                          <TableCell className="px-3 text-right font-tabular-sm font-medium">
                            <span
                              className={
                                stat.passRate >= 70
                                  ? "text-[var(--color-success)]"
                                  : stat.passRate < 50
                                  ? "text-[var(--color-error)]"
                                  : "text-[var(--color-on-surface)]"
                              }
                            >
                              {stat.passRate}%
                            </span>
                          </TableCell>
                          <TableCell className="px-4 text-right font-tabular-sm font-semibold">
                            <span
                              className={stat.diffFromLastExam >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}
                            >
                              {stat.diffFromLastExam >= 0
                                ? `↑ +${stat.diffFromLastExam.toFixed(1)}`
                                : `↓ ${stat.diffFromLastExam.toFixed(1)}`}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </tbody>
                </DataTable>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" forceMount>
          {/* =========================================================================
              VIEW A: MOBILE TOUCH SUBJECT CARDS (< 768px)
              ========================================================================= */}
          <div className="md:hidden space-y-3 mb-6 no-print">
            {filteredStats.map((stat) => {
              const grade = getGradeFromScore(stat.average);
              return (
                <Card key={stat.subject.code} variant="elevated">
                  <CardContent className="p-3.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[var(--color-on-surface)]">{stat.subject.code}</span>
                          <span className="text-xs text-[var(--color-on-surface-muted)] font-medium">{stat.subject.name}</span>
                        </div>
                        <div className="text-[10px] text-[var(--color-on-surface-disabled)] mt-0.5">
                          {stat.subject.department} · Teacher: {stat.subject.teacher || "Unassigned"}
                        </div>
                      </div>
                      <GradeChip grade={grade.grade} size="md" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-[var(--color-hairline-border)]/60 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[var(--color-on-surface-muted)] uppercase block font-label-caps">
                          Average
                        </span>
                        <span className="font-tabular-md font-bold text-[var(--color-on-surface)]">
                          {stat.average.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-on-surface-muted)] uppercase block font-label-caps">
                          Pass Rate
                        </span>
                        <span
                          className={`font-tabular-md font-bold ${
                            stat.passRate >= 70
                              ? "text-[var(--color-success)]"
                              : stat.passRate < 50
                              ? "text-[var(--color-error)]"
                              : "text-[var(--color-on-surface)]"
                          }`}
                        >
                          {stat.passRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-on-surface-muted)] uppercase block font-label-caps">
                          High / Low
                        </span>
                        <span className="font-tabular-md font-medium text-[var(--color-on-surface)]">
                          {stat.highest} / {stat.lowest}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <span className="text-[var(--color-on-surface-muted)] text-[11px] font-tabular-sm">
                        {stat.entered} Candidates Entered
                      </span>
                      <span
                        className={`font-tabular-sm text-xs font-semibold ${
                          stat.diffFromLastExam >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                        }`}
                      >
                        Trend:{" "}
                        {stat.diffFromLastExam >= 0
                          ? `+${stat.diffFromLastExam.toFixed(1)}`
                          : stat.diffFromLastExam.toFixed(1)}
                        %
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Next Steps Banner */}
      <Card variant="outlined" className="mt-6">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">route</span>
                <span>Subject Analysis: Next Steps</span>
              </h4>
              <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">
                Compare distributions across grades, view overall student rankings, or adjust marks.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveView("overview")} className="px-3 py-2 text-xs">
                ← Overview
              </Button>
              <Button variant="primary" size="sm" onClick={() => setActiveView("grade-distribution")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">bar_chart</span>} className="px-3.5 py-2 text-xs">
                Grade Distribution →
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveView("rankings")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">format_list_numbered</span>} className="px-3.5 py-2 text-xs">
                Class Rankings →
              </Button>
              <Button size="sm" onClick={() => setActiveView("marks-entry")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">edit_note</span>} className="px-3.5 py-2 text-xs">
                Edit Marks →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};