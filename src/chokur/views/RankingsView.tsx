// @ts-nocheck -- original source kept verbatim; project tsconfig is stricter than the source
import React, { useEffect, useMemo, useState } from "react";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { useGrading } from "../context/GradingContext";
import { exportTableToCSV, getGradeFromScore } from "../utils/grading";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge, StatusBadge } from "@/chokur/components/ui";
import { Input, Select } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell, TableFooter } from "@/chokur/components/ui";
import { Sheet, SheetTrigger } from "@/chokur/components/ui";

type SortField =
  | "rank"
  | "admNo"
  | "name"
  | "gender"
  | "kcpe"
  | "average"
  | "aggregate"
  | "meanPoints"
  | "subjectsPassed"
  | string; // Subject code

export const RankingsView: React.FC = () => {
  const {
    rankings,
    subjects,
    marks,
    classAverage,
    meanGrade,
    schoolConfig,
    activeStream,
    activeExam,
    setSelectedStudentId,
    setActiveView,
  } = useGrading();

  const [savedSearch, setSavedSearch] = useState(() => {
    try {
      return sessionStorage.getItem("chokur.rankings_search") || "";
    } catch {
      return "";
    }
  });
  const [savedGender, setSavedGender] = useState<"all" | "Female" | "Male">(() => {
    try {
      return (sessionStorage.getItem("chokur.rankings_gender") as any) || "all";
    } catch {
      return "all";
    }
  });
  const [savedStatus, setSavedStatus] = useState<"all" | "qualified" | "unqualified">(() => {
    try {
      return (sessionStorage.getItem("chokur.rankings_status") as any) || "all";
    } catch {
      return "all";
    }
  });

  const [searchQuery, setSearchQuery] = useState(savedSearch);
  const [genderFilter, setGenderFilter] = useState(savedGender);
  const [statusFilter, setStatusFilter] = useState(savedStatus);
  const [showSubjectCols, setShowSubjectCols] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(
        field === "name" || field === "admNo" || field === "gender" ? "asc" : "desc",
      );
    }
  };

  // Filter and sort rankings
  const processedRankings = useMemo(() => {
    let result = [...rankings];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.student.name.toLowerCase().includes(q) || r.student.admNo.toLowerCase().includes(q),
      );
    }

    // Filter by gender
    if (genderFilter !== "all") {
      result = result.filter((r) => r.student.gender === genderFilter);
    }

    // Filter by university qualification status
    if (statusFilter === "qualified") {
      result = result.filter((r) => r.qualifies);
    } else if (statusFilter === "unqualified") {
      result = result.filter((r) => !r.qualifies);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "rank") {
        comparison = a.rank - b.rank;
      } else if (sortField === "admNo") {
        comparison = a.student.admNo.localeCompare(b.student.admNo, undefined, { numeric: true });
      } else if (sortField === "name") {
        comparison = a.student.name.localeCompare(b.student.name);
      } else if (sortField === "gender") {
        comparison = a.student.gender.localeCompare(b.student.gender);
      } else if (sortField === "kcpe") {
        comparison = a.student.kcpeMarks - b.student.kcpeMarks;
      } else if (sortField === "average") {
        comparison = a.average - b.average;
      } else if (sortField === "aggregate") {
        comparison = a.aggregate - b.aggregate;
      } else if (sortField === "meanPoints") {
        comparison = a.meanPoints - b.meanPoints;
      } else if (sortField === "subjectsPassed") {
        comparison = a.subjectsPassed - b.subjectsPassed;
      } else {
        // Individual subject code sort
        const markA = marks[a.student.id]?.[sortField];
        const markB = marks[b.student.id]?.[sortField];
        const valA = typeof markA === "number" ? markA : -1;
        const valB = typeof markB === "number" ? markB : -1;
        comparison = valA - valB;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [rankings, searchQuery, genderFilter, statusFilter, sortField, sortDirection, marks]);

  useEffect(() => {
    try {
      sessionStorage.setItem("chokur.rankings_search", searchQuery);
    } catch {}
  }, [searchQuery]);
  useEffect(() => {
    try {
      sessionStorage.setItem("chokur.rankings_gender", genderFilter);
    } catch {}
  }, [genderFilter]);
  useEffect(() => {
    try {
      sessionStorage.setItem("chokur.rankings_status", statusFilter);
    } catch {}
  }, [statusFilter]);

  // Identify where the C+ cutoff line falls
  const firstBelowCPlusIdx = useMemo(() => {
    if (sortField !== "rank" && sortField !== "meanPoints" && sortField !== "aggregate") {
      return -1;
    }
    return processedRankings.findIndex((r) => !r.qualifies);
  }, [processedRankings, sortField]);

  // Summary counts
  const totalEnrollment = rankings.length;
  const qualifiedCount = rankings.filter((r) => r.qualifies).length;
  const highestAggregate = rankings.length > 0 ? Math.max(...rankings.map((r) => r.aggregate)) : 0;

  const handleExportCSV = () => {
    const baseHeaders = [
      "Rank",
      "Admission No",
      "Student Name",
      "Gender",
      "KCPE Marks",
      ...subjects.map((s) => s.code),
      "Average",
      "Aggregate Best 7",
      "Mean Points",
      "Mean Grade",
      "Subjects Passed",
      "University Qualify",
    ];

    const rows = processedRankings.map((r) => {
      const subjectScores = subjects.map((subj) => {
        const val = marks[r.student.id]?.[subj.code];
        if (val === "ABS") return "ABS";
        if (val !== null && val !== undefined) return String(val);
        return "";
      });

      return [
        String(r.rank),
        r.student.admNo,
        r.student.name,
        r.student.gender,
        String(r.student.kcpeMarks),
        ...subjectScores,
        r.average.toFixed(1),
        String(r.aggregate),
        r.meanPoints.toFixed(2),
        r.meanGrade,
        `${r.subjectsPassed}/${subjects.length}`,
        r.qualifies ? "YES" : "NO",
      ];
    });

    exportTableToCSV(
      `KCSE_Merit_Rankings_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`,
      baseHeaders,
      rows,
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const navigateToReportCard = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveView("report-cards");
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <span className="material-symbols-outlined text-[13px] opacity-30">unfold_more</span>;
    }
    return (
      <span className="material-symbols-outlined text-[13px] text-[var(--color-primary)]">
        {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
      </span>
    );
  };

  return (
    <div className="w-full min-w-0 max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 font-body-md text-[var(--color-on-surface)]">
      {/* Print Official Header */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-[var(--color-on-surface)] pb-4">
        <h1 className="text-xl font-bold uppercase tracking-tight">{schoolConfig.schoolName}</h1>
        <p className="text-xs uppercase">
          {schoolConfig.postalAddress} · {schoolConfig.motto}
        </p>
        <h2 className="text-base font-semibold mt-2 uppercase tracking-wide">
          Official Academic Merit Ranking List — {activeStream}
        </h2>
        <p className="text-xs">
          {activeExam} · Term {schoolConfig.term}, {schoolConfig.academicYear}
        </p>
      </div>

      {/* Screen Header */}
      <section className="mb-4 sm:mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-4 no-print">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Rankings
          </h1>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)] mt-1">
            {activeStream} · {activeExam} · official merit standing sorted by aggregate points
          </p>
        </div>
      </section>

      {/* Editorial Summary Metrics Bar */}
      <Card variant="outlined" className="mb-6">
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 border-y border-[var(--color-hairline-border)] py-3">
            <div className="pr-3 sm:pr-4 border-r border-[var(--color-hairline-border)]">
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] block uppercase text-[10px]">
                CLASS ENROLLMENT
              </span>
              <span className="font-display-stat text-xl sm:text-[26px] leading-8 text-[var(--color-on-surface)] block mt-0.5">
                {totalEnrollment}{" "}
                <span className="font-caption text-caption text-[var(--color-on-surface-muted)] font-normal text-xs">
                  Students
                </span>
              </span>
            </div>

            <div className="px-3 sm:px-4 md:border-r border-[var(--color-hairline-border)]">
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] block uppercase text-[10px]">
                QUALIFIED (C+ & ABOVE)
              </span>
              <span className="font-display-stat text-xl sm:text-[26px] leading-8 text-[var(--color-on-surface)] block mt-0.5">
                {qualifiedCount}{" "}
                <span className="font-caption text-caption text-[var(--color-on-surface-muted)] font-normal text-xs">
                  of {totalEnrollment}
                </span>
              </span>
            </div>

            <div className="pr-3 sm:px-4 border-r border-[var(--color-hairline-border)] pt-2 md:pt-0 border-t md:border-t-0">
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] block uppercase text-[10px]">
                CLASS MEAN SCORE
              </span>
              <span className="font-display-stat text-xl sm:text-[26px] leading-8 text-[var(--color-on-surface)] block mt-0.5">
                {classAverage.toFixed(1)}{" "}
                <span className="font-caption text-caption text-[var(--color-on-surface-muted)] font-normal text-xs">
                  ({meanGrade})
                </span>
              </span>
            </div>

            <div className="px-3 sm:pl-4 pt-2 md:pt-0 border-t md:border-t-0">
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] block uppercase text-[10px]">
                HIGHEST AGGREGATE
              </span>
              <span className="font-display-stat text-xl sm:text-[26px] leading-8 text-[var(--color-on-surface)] block mt-0.5">
                {highestAggregate}{" "}
                <span className="font-caption text-caption text-[var(--color-on-surface-muted)] font-normal text-xs">
                  / 84 pts
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Toolbar & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6 no-print">
        {/* Search Input & Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-disabled)] text-[18px]">
              search
            </span>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or adm..."
              className="pl-9 min-h-[44px]"
            />
          </div>

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterSheetOpen(true)}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">tune</span>}
            className="md:hidden min-h-[44px]"
          >
            Filters ({genderFilter !== "all" || statusFilter !== "all" ? "Active" : "All"})
          </Button>

          {/* Desktop Gender Filter */}
          <div className="hidden md:flex items-center border border-[var(--color-hairline-border)] rounded bg-[var(--color-surface-container-low)] text-xs font-medium overflow-hidden">
            {["all", "Female", "Male"].map((g) => (
              <Button
                key={g}
                variant={genderFilter === g ? "primary" : "ghost"}
                size="sm"
                onClick={() => setGenderFilter(g as "all" | "Female" | "Male")}
                className="min-h-[36px] px-2.5 py-1.5"
              >
                {g === "all" ? "All Gender" : g}
              </Button>
            ))}
          </div>

          {/* Desktop University Qualification Filter */}
          <div className="hidden md:flex items-center border border-[var(--color-hairline-border)] rounded bg-[var(--color-surface-container-low)] text-xs font-medium overflow-hidden">
            <Button
              variant={statusFilter === "all" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="min-h-[36px] px-2.5 py-1.5"
            >
              All Tiers
            </Button>
            <Button
              variant={statusFilter === "qualified" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("qualified")}
              className="min-h-[36px] px-2.5 py-1.5"
            >
              C+ & Above
            </Button>
            <Button
              variant={statusFilter === "unqualified" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("unqualified")}
              className="min-h-[36px] px-2.5 py-1.5"
            >
              Below C+
            </Button>
          </div>

          {/* Broadsheet toggle */}
          <Button
            variant={showSubjectCols ? "outline" : "ghost"}
            size="sm"
            onClick={() => setShowSubjectCols(!showSubjectCols)}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[15px]">table_chart</span>}
            className="hidden md:flex min-h-[36px]"
          >
            {showSubjectCols ? "Hide Subjects" : "Broadsheet Columns"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">file_download</span>}
            className="flex-1 sm:flex-none min-h-[44px]"
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">print</span>}
            className="flex-1 sm:flex-none min-h-[44px]"
          >
            Print ranking sheet
          </Button>
        </div>
      </div>

      {/* =========================================================================
          VIEW A: MOBILE TOUCH CANDIDATE CARDS (< 768px)
          ========================================================================= */}
      <div className="md:hidden space-y-3 mb-6 no-print">
        {processedRankings.map((record, idx) => {
          const showCutoffLineBeforeThis = firstBelowCPlusIdx !== -1 && idx === firstBelowCPlusIdx;
          const isExpanded = expandedStudentId === record.student.id;

          return (
            <React.Fragment key={record.student.id}>
              {/* KUCCPS Cutoff Line on Mobile */}
              {showCutoffLineBeforeThis && (
                <div className="py-2.5 my-2 border-y-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container)] px-3 flex items-center justify-between">
                  <span className="font-label-caps text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface)]">
                    KUCCPS DEGREE ENTRY CUTOFF (C+ / 6.5 PTS)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-on-surface)]"></span>
                </div>
              )}

              {/* Touch Candidate Card */}
              <Card variant={record.qualifies ? "outlined" : "outlined"} className={`transition-colors ${
                record.qualifies ? "border-[var(--color-hairline-border)]" : "border-[var(--color-hairline-border)]/60 opacity-95"
              }`}>
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-[var(--color-on-surface)] text-[var(--color-on-surface)] flex items-center justify-center font-tabular-sm font-bold text-xs shrink-0">
                        #{record.rank}
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigateToReportCard(record.student.id)}
                          className="font-semibold text-xs text-[var(--color-on-surface)] hover:text-[var(--color-primary)] text-left p-0 min-h-0"
                        >
                          {record.student.name}
                        </Button>
                        <div className="text-[11px] text-[var(--color-on-surface-muted)] font-tabular-sm">
                          ADM {record.student.admNo} ·{" "}
                          {record.student.gender === "Female" ? "F" : "M"} · KCPE{" "}
                          {record.student.kcpeMarks}
                        </div>
                      </div>
                    </div>

                    <GradeChip grade={record.meanGrade} size="md" />
                  </div>

                  {/* Score Summary Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-[var(--color-hairline-border)]/60 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[var(--color-on-surface-muted)] uppercase block font-label-caps">
                        Aggregate
                      </span>
                      <span className="font-tabular-md font-bold text-[var(--color-on-surface)]">
                        {record.aggregate}/84
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-on-surface-muted)] uppercase block font-label-caps">
                        Mean Pts
                      </span>
                      <span className="font-tabular-md font-bold text-[var(--color-on-surface)]">
                        {record.meanPoints.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-on-surface-muted)] uppercase block font-label-caps">
                        Average
                      </span>
                      <span className="font-tabular-md font-bold text-[var(--color-on-surface)]">
                        {record.average.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <StatusBadge status={record.qualifies ? "active" : "inactive"} size="sm">
                      {record.qualifies ? "KUCCPS QUALIFIED" : "BELOW CUTOFF"}
                    </StatusBadge>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedStudentId(isExpanded ? null : record.student.id)}
                        iconPosition="right"
                        icon={<span className="material-symbols-outlined text-[14px]">{isExpanded ? "expand_less" : "expand_more"}</span>}
                        className="min-h-[36px]"
                      >
                        {isExpanded ? "Hide" : "Subjects"}
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => navigateToReportCard(record.student.id)}
                        iconPosition="right"
                        icon={<span className="material-symbols-outlined text-[14px]">badge</span>}
                        className="min-h-[36px]"
                      >
                        Report
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Subject Breakdown */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-hairline-border)] grid grid-cols-3 sm:grid-cols-4 gap-2 bg-[var(--color-surface-container-low)] p-2.5 rounded">
                      {subjects.map((subj) => {
                        const val = marks[record.student.id]?.[subj.code];
                        const grade = getGradeFromScore(val);
                        return (
                          <div key={subj.code} className="text-center p-1 bg-[var(--color-surface)] border border-[var(--color-hairline-border)] rounded">
                            <span className="text-[10px] font-semibold block text-[var(--color-on-surface-muted)]">
                              {subj.code}
                            </span>
                            <span className="text-xs font-tabular-sm font-bold text-[var(--color-on-surface)]">
                              {val !== null && val !== undefined ? val : "—"}
                            </span>
                            {val !== null && val !== undefined && (
                              <span className="text-[10px] text-[var(--color-on-surface-muted)] block">{grade.grade}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </React.Fragment>
          );
        })}

        {processedRankings.length === 0 && (
          <Card variant="outlined" className="p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-3xl text-[var(--color-on-surface-disabled)]">
                person_search
              </span>
              <h3 className="font-semibold text-sm text-[var(--color-on-surface)]">No students found</h3>
              <p className="text-xs text-[var(--color-on-surface-muted)]">
                No candidates match your current search or filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setGenderFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-3 min-h-[44px]"
              >
                Reset Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* =========================================================================
          VIEW B: DESKTOP & PRINT BROADSHEET TABLE (≥ 768px)
          ========================================================================= */}
      <Card variant="elevated" className="hidden md:block overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <DataTable hoverable compact>
              <TableHeader>
                <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider select-none">
                  <TableHead scope="col" className="w-16 px-3" onClick={() => handleSort("rank")}>
                    <div className="flex items-center gap-1">
                      <span>RANK</span>
                      {renderSortIndicator("rank")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="w-24 px-3" onClick={() => handleSort("admNo")}>
                    <div className="flex items-center gap-1">
                      <span>ADM</span>
                      {renderSortIndicator("admNo")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="px-3 min-w-[160px]" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      <span>STUDENT NAME</span>
                      {renderSortIndicator("name")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="w-16 px-2 text-center" onClick={() => handleSort("gender")}>
                    <div className="flex items-center justify-center gap-1">
                      <span>GEN</span>
                      {renderSortIndicator("gender")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="w-20 px-2 text-right" onClick={() => handleSort("kcpe")}>
                    <div className="flex items-center justify-end gap-1">
                      <span>KCPE</span>
                      {renderSortIndicator("kcpe")}
                    </div>
                  </TableHead>

                  {/* Optional Broadsheet Subject Columns */}
                  {showSubjectCols &&
                    subjects.map((subj) => (
                      <TableHead
                        key={subj.code}
                        scope="col"
                        className="w-16 px-1.5 text-center border-l border-[var(--color-hairline-border)]/60"
                        onClick={() => handleSort(subj.code)}
                        title={subj.name}
                      >
                        <div className="flex items-center justify-center gap-0.5">
                          <span>{subj.code}</span>
                          {renderSortIndicator(subj.code)}
                        </div>
                      </TableHead>
                    ))}

                  <TableHead scope="col" className="w-24 px-3 text-right" onClick={() => handleSort("average")}>
                    <div className="flex items-center justify-end gap-1">
                      <span>AVG</span>
                      {renderSortIndicator("average")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="w-24 px-2 text-center" onClick={() => handleSort("meanPoints")}>
                    <div className="flex items-center justify-center gap-1">
                      <span>GRADE</span>
                      {renderSortIndicator("meanPoints")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="w-24 px-3 text-right" onClick={() => handleSort("aggregate")}>
                    <div className="flex items-center justify-end gap-1">
                      <span>AGG (/84)</span>
                      {renderSortIndicator("aggregate")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="w-28 px-3 text-right" onClick={() => handleSort("subjectsPassed")}>
                    <div className="flex items-center justify-end gap-1">
                      <span>PASSED</span>
                      {renderSortIndicator("subjectsPassed")}
                    </div>
                  </TableHead>
                  <TableHead scope="col" className="w-28 px-3 text-left">
                    <span>STATUS</span>
                  </TableHead>
                </tr>
              </TableHeader>

              <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm text-[var(--color-on-surface)]">
                {processedRankings.map((record, idx) => {
                  const showCutoffLineBeforeThis =
                    firstBelowCPlusIdx !== -1 && idx === firstBelowCPlusIdx;

                  return (
                    <React.Fragment key={record.student.id}>
                      {/* The C+ Qualification Cutoff Marker */}
                      {showCutoffLineBeforeThis && (
                        <tr className="bg-[var(--color-surface-container-low)]">
                          <TableCell colSpan={showSubjectCols ? subjects.length + 10 : 10} className="p-0">
                            <div className="relative py-2 flex items-center">
                              <div className="w-full border-t-2 border-[var(--color-on-surface)]"></div>
                              <div className="absolute right-6 bg-[var(--color-surface-container-low)] px-3 py-0.5 border border-[var(--color-on-surface)] text-[var(--color-on-surface)] font-label-caps text-[10px] uppercase tracking-wider font-bold shadow-xs">
                                KUCCPS Minimum University Cutoff (C+ / 6.5 Mean Points)
                              </div>
                            </div>
                          </TableCell>
                        </tr>
                      )}

                      <TableRow
                        className={`h-11 transition-colors ${
                          record.qualifies
                            ? "hover:bg-[var(--color-surface-container)]"
                            : "hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-muted)]"
                        }`}
                      >
                        <TableCell className="px-3 font-tabular-md text-tabular-md font-semibold text-[var(--color-on-surface)]">
                          {record.rank}
                        </TableCell>
                        <TableCell className="px-3 font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)]">
                          {record.student.admNo}
                        </TableCell>
                        <TableCell className="px-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateToReportCard(record.student.id)}
                            className="font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] hover:underline p-0 min-h-0 text-left truncate max-w-[200px]"
                          >
                            {record.student.name}
                          </Button>
                        </TableCell>
                        <TableCell className="px-2 text-center font-caption text-caption text-[var(--color-on-surface-muted)]">
                          {record.student.gender === "Female" ? "F" : "M"}
                        </TableCell>
                        <TableCell className="px-2 text-right font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)]">
                          {record.student.kcpeMarks}
                        </TableCell>

                        {/* Optional Broadsheet Subject Scores */}
                        {showSubjectCols &&
                          subjects.map((subj) => {
                            const val = marks[record.student.id]?.[subj.code];
                            const isAbs = val === "ABS";
                            const grade = getGradeFromScore(val);
                            return (
                              <TableCell
                                key={subj.code}
                                className="px-1.5 text-center font-tabular-sm text-[12px] border-l border-[var(--color-hairline-border)]/50"
                              >
                                {isAbs ? (
                                  <span className="text-[var(--color-on-surface-disabled)] font-semibold text-[10px]">
                                    ABS
                                  </span>
                                ) : val !== null && val !== undefined ? (
                                  <span>
                                    {val}{" "}
                                    <span className="text-[10px] text-[var(--color-on-surface-muted)]">{grade.grade}</span>
                                  </span>
                                ) : (
                                  <span className="text-[var(--color-hairline-border)]">—</span>
                                )}
                              </TableCell>
                            );
                          })}

                        <TableCell className="px-3 font-tabular-md text-tabular-md text-right font-medium">
                          {record.average.toFixed(1)}%
                        </TableCell>
                        <TableCell className="px-2 text-center">
                          <GradeChip grade={record.meanGrade} />
                        </TableCell>
                        <TableCell className="px-3 font-tabular-md text-tabular-md text-right font-semibold text-[var(--color-on-surface)]">
                          {record.aggregate}/84
                        </TableCell>
                        <TableCell className="px-3 font-tabular-sm text-tabular-sm text-right text-[var(--color-on-surface-muted)]">
                          {record.subjectsPassed}/{subjects.length}
                        </TableCell>
                        <TableCell className="px-3">
                          <StatusBadge status={record.qualifies ? "active" : "inactive"} size="sm">
                            {record.qualifies ? "QUALIFIED" : "UNQUALIFIED"}
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}

                {processedRankings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={showSubjectCols ? subjects.length + 10 : 10} className="py-12 text-center text-[var(--color-on-surface-muted)]">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-3xl text-[var(--color-on-surface-disabled)]">
                          person_search
                        </span>
                        <span className="font-semibold text-sm text-[var(--color-on-surface)]">
                          No candidate matches found
                        </span>
                        <span className="text-xs text-[var(--color-on-surface-muted)]">
                          {searchQuery
                            ? `No results for "${searchQuery}".`
                            : "No candidates match the active filters."}{" "}
                          Try clearing search or resetting filters.
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("");
                            setGenderFilter("all");
                            setStatusFilter("all");
                          }}
                          className="mt-2"
                        >
                          Clear search & filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </DataTable>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Next Steps Banner */}
      <Card variant="outlined" className="mt-6">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">route</span>
                <span>Rankings Ledger: Next Actions</span>
              </h4>
              <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">
                Review individual student report cards, inspect subject performance deviations, or
                update marks.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveView("overview")} className="px-3 py-2 text-xs">
                ← Overview
              </Button>
              <Button size="sm" onClick={() => setActiveView("report-cards")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">badge</span>} className="px-3.5 py-2 text-xs">
                Report Cards →
              </Button>
              <Button variant="primary" size="sm" onClick={() => setActiveView("subject-analysis")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">analytics</span>} className="px-3.5 py-2 text-xs">
                Subject Analysis →
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveView("marks-entry")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">edit_note</span>} className="px-3.5 py-2 text-xs">
                Edit Marks →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Filter Bottom Sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen} side="bottom">
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline-border)] mb-3">
            <span className="font-headline-md font-semibold text-sm">
              Sort & Filter Rankings
            </span>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterSheetOpen(false)}
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </IconButton>
          </div>

          {/* Gender Filter */}
          <div className="mb-4">
            <span className="font-label-caps text-[11px] text-[var(--color-on-surface-muted)] uppercase block mb-2">
              Gender
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["all", "Female", "Male"] as const).map((g) => (
                <Button
                  key={g}
                  variant={genderFilter === g ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setGenderFilter(g)}
                  className="min-h-[44px]"
                >
                  {g === "all" ? "All Gender" : g}
                </Button>
              ))}
            </div>
          </div>

          {/* KUCCPS Status Filter */}
          <div className="mb-4">
            <span className="font-label-caps text-[11px] text-[var(--color-on-surface-muted)] uppercase block mb-2">
              University Qualification
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "all", label: "All Tiers" },
                { id: "qualified", label: "C+ & Above" },
                { id: "unqualified", label: "Below C+" },
              ].map((s) => (
                <Button
                  key={s.id}
                  variant={statusFilter === s.id ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s.id as any)}
                  className="min-h-[44px]"
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <span className="font-label-caps text-[11px] text-[var(--color-on-surface-muted)] uppercase block mb-2">
              Sort By
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "rank", label: "Merit Rank" },
                { id: "aggregate", label: "Aggregate Points" },
                { id: "average", label: "Class Average" },
                { id: "name", label: "Student Name" },
                { id: "admNo", label: "Admission No" },
                { id: "kcpe", label: "KCPE Marks" },
              ].map((opt) => (
                <Button
                  key={opt.id}
                  variant={sortField === opt.id ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleSort(opt.id as any)}
                  className="min-h-[44px] text-left justify-between"
                >
                  <span>{opt.label}</span>
                  {sortField === opt.id && (
                    <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">
                      {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsFilterSheetOpen(false)}
            className="w-full min-h-[44px]"
          >
            Apply & View Results ({processedRankings.length})
          </Button>
        </div>
      </Sheet>
    </div>
  );
};