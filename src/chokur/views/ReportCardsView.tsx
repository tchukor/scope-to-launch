// @ts-nocheck -- original source kept verbatim; project tsconfig is stricter than the source
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ChokurLogo } from "@/chokur/components/brand/ChokurLogo";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { useGrading } from "../context/GradingContext";
import { getGradeFromScore } from "../utils/grading";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge, StatusBadge } from "@/chokur/components/ui";
import { Input } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell } from "@/chokur/components/ui";

const DEFAULT_SUBJECT_REMARKS: Record<string, string> = {
  MAT: "Excellent analytical problem solving and numerical skills.",
  ENG: "Very good comprehension, composition and grammar mastery.",
  KIS: "Lugha sanifu na uelewa thabiti wa fasihi.",
  BIO: "Strong understanding of physiological principles and experiments.",
  CHE: "Consistent performance, maintain focus on stoichiometry.",
  PHY: "Commendable application of mathematical models to mechanics.",
  HIS: "Clear grasp of international relations and constitutional history.",
  GEO: "Commendable topographical map reading and field survey analysis.",
  CRE: "Exemplary moral and scriptural grounding throughout.",
  BST: "Solid comprehension of commercial law and accounting ledgers.",
};

export const ReportCardsView: React.FC = () => {
  const {
    filteredStudents: students,
    subjects,
    marks,
    rankings,
    selectedStudentId,
    setSelectedStudentId,
    schoolConfig,
    activeStream,
    activeExam,
    classAverage,
    role,
    setActiveView,
  } = useGrading();

  const [searchRoster, setSearchRoster] = useState("");
  const [printAllMode, setPrintAllMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  // On mobile screens, toggle between roster list and card view
  const [mobileView, setMobileView] = useState<"roster" | "card">("roster");
  const reportCardRef = useRef<HTMLDivElement>(null);

  // Selected student calculation
  const selectedCalculation = useMemo(() => {
    return rankings.find((r) => r.student.id === selectedStudentId) || rankings[0];
  }, [rankings, selectedStudentId]);

  // Filtered roster for left pane
  const filteredRoster = useMemo(() => {
    if (role === "Parent") {
      const parentChild = rankings.find((r) => r.student.id === selectedStudentId) || rankings[0];
      return parentChild ? [parentChild] : [];
    }
    if (!searchRoster.trim()) return rankings;
    const q = searchRoster.toLowerCase();
    return rankings.filter(
      (r) => r.student.name.toLowerCase().includes(q) || r.student.admNo.toLowerCase().includes(q),
    );
  }, [rankings, searchRoster, role, selectedStudentId]);

  // Current student index in filtered roster
  const currentIndex = useMemo(() => {
    if (!selectedCalculation) return -1;
    return filteredRoster.findIndex((r) => r.student.id === selectedCalculation.student.id);
  }, [filteredRoster, selectedCalculation]);

  const handlePrevStudent = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedStudentId(filteredRoster[currentIndex - 1].student.id);
    }
  }, [currentIndex, filteredRoster, setSelectedStudentId]);

  const handleNextStudent = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < filteredRoster.length - 1) {
      setSelectedStudentId(filteredRoster[currentIndex + 1].student.id);
    }
  }, [currentIndex, filteredRoster, setSelectedStudentId]);

  // Keyboard navigation: [ and ] or arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === "[" || (e.altKey && e.key === "ArrowUp")) {
        e.preventDefault();
        handlePrevStudent();
      } else if (e.key === "]" || (e.altKey && e.key === "ArrowDown")) {
        e.preventDefault();
        handleNextStudent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filteredRoster, handlePrevStudent, handleNextStudent]);

  const handlePrintSingle = () => {
    setPrintAllMode(false);
    window.print();
  };

  const handlePrintAll = () => {
    setPrintAllMode(true);
    setTimeout(() => {
      window.print();
      setPrintAllMode(false);
    }, 200);
  };

  // Direct client-side PDF download using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    if (!reportCardRef.current || !selectedCalculation) return;

    try {
      setIsGeneratingPDF(true);
      const cardElement = reportCardRef.current;
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(pdfHeight, 297));
      pdf.save(
        `ReportCard_${selectedCalculation.student.admNo}_${selectedCalculation.student.name.replace(/\s+/g, "_")}.pdf`,
      );
    } catch (err) {
      console.error("Error generating PDF report card:", err);
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleNativeShare = async () => {
    if (!selectedCalculation) return;
    const shareText = `KCSE Academic Progress Report for ${selectedCalculation.student.name} (ADM: ${selectedCalculation.student.admNo}) - ${schoolConfig.schoolName}: Grade ${selectedCalculation.meanGrade} (${selectedCalculation.meanPoints.toFixed(1)} pts), Best 7 Aggregate: ${selectedCalculation.aggregate}/84 pts, Rank #${selectedCalculation.rank} in ${activeStream}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Report Card - ${selectedCalculation.student.name}`,
          text: shareText,
        });
      } catch {
        // User cancelled or dismissed
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Report summary copied to clipboard for WhatsApp sharing.");
    }
  };

  if (!selectedCalculation) {
    return (
      <div className="p-8 text-center text-[var(--color-on-surface-muted)]">
        No active student records found in {activeStream}.
      </div>
    );
  }

  // Render a single official A4 Report Card
  const renderReportCard = (calc: typeof selectedCalculation, isMultiPage: boolean = false) => {
    const studentMarks = marks[calc.student.id] || {};

    return (
      <article
        key={calc.student.id}
        ref={isMultiPage ? undefined : reportCardRef}
        className={`w-full max-w-[820px] bg-[var(--color-surface)] border border-[var(--color-hairline-border)] p-5 sm:p-8 md:p-10 shadow-sm text-[var(--color-on-surface)] print-sheet ${
          isMultiPage ? "mb-12 page-break-always" : "mb-8"
        }`}
      >
        {/* School Archival Header with Official Chokur Seal */}
        <div className="text-center pb-4 sm:pb-5 border-b-2 border-[var(--color-on-surface)]">
          <div className="flex justify-center mb-2.5">
            <ChokurLogo variant="monochrome-dark" size={32} showSubtitle={false} />
          </div>
          <h1 className="text-lg sm:text-[22px] font-bold tracking-tight uppercase font-headline-lg text-[var(--color-on-surface)]">
            {schoolConfig.schoolName}
          </h1>
          <p className="font-caption text-caption text-[var(--color-on-surface-muted)] tracking-wider mt-0.5 uppercase text-[10px] sm:text-xs">
            {schoolConfig.postalAddress} · {schoolConfig.contactPhoneEmail}
          </p>
          <p className="italic text-xs text-[var(--color-on-surface-muted)] mt-0.5">
            "{schoolConfig.motto}"
          </p>
          <div className="mt-2.5 inline-block border-y border-[var(--color-hairline-border)] py-1 px-4 sm:px-6 bg-[var(--color-surface-container-low)]">
            <h2 className="font-headline-sm text-headline-sm uppercase tracking-wider font-semibold text-[var(--color-on-surface)] text-xs sm:text-sm">
              Student Academic Report Card
            </h2>
          </div>
          <p className="font-caption text-caption text-[var(--color-on-surface-muted)] uppercase tracking-widest mt-1 text-[10px] sm:text-xs">
            {schoolConfig.term}, {schoolConfig.academicYear} · {activeExam}
          </p>
        </div>

        {/* Student Metadata Grid */}
        <div className="my-3 sm:my-4 py-2 sm:py-3 border-b border-[var(--color-hairline-border)] grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-1.5 sm:gap-y-2 font-body-sm text-body-sm text-xs sm:text-[13px]">
          <div className="flex justify-between border-b border-[var(--color-hairline-border)]/50 pb-1">
            <span className="text-[var(--color-on-surface-muted)] font-caption text-caption uppercase text-[10px] sm:text-[11px]">
              STUDENT NAME:
            </span>
            <span className="font-semibold text-[var(--color-on-surface)]">
              {calc.student.name}
            </span>
          </div>
          <div className="flex justify-between border-b border-[var(--color-hairline-border)]/50 pb-1">
            <span className="text-[var(--color-on-surface-muted)] font-caption text-caption uppercase text-[10px] sm:text-[11px]">
              ADMISSION NO:
            </span>
            <span className="font-tabular-sm text-tabular-sm font-semibold text-[var(--color-on-surface)]">
              {calc.student.admNo}
            </span>
          </div>
          <div className="flex justify-between border-b border-[var(--color-hairline-border)]/50 pb-1">
            <span className="text-[var(--color-on-surface-muted)] font-caption text-caption uppercase text-[10px] sm:text-[11px]">
              CLASS & STREAM:
            </span>
            <span className="font-semibold text-[var(--color-on-surface)]">
              {calc.student.stream}
            </span>
          </div>
          <div className="flex justify-between border-b border-[var(--color-hairline-border)]/50 pb-1">
            <span className="text-[var(--color-on-surface-muted)] font-caption text-caption uppercase text-[10px] sm:text-[11px]">
              CLASS TEACHER:
            </span>
            <span className="text-[var(--color-on-surface)]">{schoolConfig.classTeacher}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[var(--color-on-surface-muted)] font-caption text-caption uppercase text-[10px] sm:text-[11px]">
              KCPE MARKS:
            </span>
            <span className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface)] font-semibold">
              {calc.student.kcpeMarks} / 500
            </span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[var(--color-on-surface-muted)] font-caption text-caption uppercase text-[10px] sm:text-[11px]">
              STREAM POPULATION:
            </span>
            <span className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface)]">
              {students.length} Candidates
            </span>
          </div>
        </div>

        {/* Subject Marks Table */}
        <div className="my-3 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container-low)] text-[10px] sm:text-[11px] font-label-caps text-[var(--color-on-surface)] uppercase tracking-wider">
                <th className="py-1.5 px-2">SUBJECT</th>
                <th className="py-1.5 px-2 text-center w-14">SCORE</th>
                <th className="py-1.5 px-2 text-center w-14">GRADE</th>
                <th className="py-1.5 px-2 text-center w-12">POINTS</th>
                <th className="py-1.5 px-2 hidden sm:table-cell">TEACHER'S EVALUATION REMARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-[12px] sm:text-body-sm">
              {subjects.map((subj) => {
                const val = studentMarks[subj.code];
                const isAbs = val === "ABS";
                const gradeInfo = getGradeFromScore(val);
                const remark =
                  DEFAULT_SUBJECT_REMARKS[subj.code] || "Satisfactory academic effort.";

                return (
                  <tr key={subj.code} className="hover:bg-[var(--color-surface-container)]">
                    <td className="py-2 px-2 font-medium">
                      <span className="font-semibold">{subj.code}</span> · {subj.name}
                    </td>
                    <td className="py-2 px-2 text-center font-tabular-sm">
                      {isAbs ? (
                        <span className="text-[var(--color-on-surface-disabled)] font-bold">
                          ABS
                        </span>
                      ) : val !== null && val !== undefined ? (
                        val
                      ) : (
                        <span className="text-[var(--color-hairline-border)]">—</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {isAbs ? (
                        <span className="text-[var(--color-on-surface-disabled)] font-medium text-xs">
                          X
                        </span>
                      ) : val !== null && val !== undefined ? (
                        <GradeChip grade={gradeInfo.grade} size="sm" />
                      ) : (
                        <span className="text-[var(--color-hairline-border)]">—</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center font-tabular-sm font-semibold">
                      {isAbs || val === null || val === undefined ? "0" : gradeInfo.points}
                    </td>
                    <td className="py-2 px-2 text-[11px] text-[var(--color-on-surface-muted)] italic hidden sm:table-cell">
                      {remark}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* KCSE KNEC Aggregate Summary Matrix */}
        <div className="my-4 border-2 border-[var(--color-on-surface)] p-3 sm:p-4 bg-[var(--color-surface-container-low)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="border-r border-[var(--color-hairline-border)] pr-2">
            <span className="text-[10px] font-label-caps uppercase text-[var(--color-on-surface-muted)] block">
              STREAM RANK
            </span>
            <span className="font-display-stat text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] block mt-0.5">
              #{calc.rank}{" "}
              <span className="text-xs text-[var(--color-on-surface-muted)] font-normal">
                of {students.length}
              </span>
            </span>
          </div>
          <div className="sm:border-r border-[var(--color-hairline-border)] sm:pr-2">
            <span className="text-[10px] font-label-caps uppercase text-[var(--color-on-surface-muted)] block">
              BEST 7 AGGREGATE
            </span>
            <span className="font-display-stat text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] block mt-0.5">
              {calc.aggregate}{" "}
              <span className="text-xs text-[var(--color-on-surface-muted)] font-normal">
                / 84 pts
              </span>
            </span>
          </div>
          <div className="border-r border-[var(--color-hairline-border)] pr-2 pt-2 sm:pt-0 border-t sm:border-t-0">
            <span className="text-[10px] font-label-caps uppercase text-[var(--color-on-surface-muted)] block">
              MEAN SCORE
            </span>
            <span className="font-display-stat text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] block mt-0.5">
              {calc.average.toFixed(1)}%
            </span>
          </div>
          <div className="pt-2 sm:pt-0 border-t sm:border-t-0">
            <span className="text-[10px] font-label-caps uppercase text-[var(--color-on-surface-muted)] block">
              KCSE MEAN GRADE
            </span>
            <div className="mt-1 flex justify-center">
              <GradeChip grade={calc.meanGrade} size="md" />
            </div>
          </div>
        </div>

        {/* Teacher & Principal Signatures */}
        <div className="mt-5 pt-4 border-t border-[var(--color-hairline-border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded">
            <span className="font-semibold text-[var(--color-on-surface)] block mb-1">
              Class Teacher's Remarks:
            </span>
            <p className="italic text-[var(--color-on-surface-muted)] text-[11px] leading-relaxed">
              {calc.qualifies
                ? "Commendable performance throughout this evaluation period. Qualifies for university degree admission. Maintain consistency in revision."
                : "Steady effort observed. Needs intensive revision in weak subject areas to attain the university qualification cutoff threshold."}
            </p>
            <div className="mt-3 pt-2 border-t border-dashed border-[var(--color-hairline-border)] flex justify-between text-[10px] text-[var(--color-on-surface-muted)]">
              <span>Sign: {schoolConfig.classTeacher}</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-3 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded">
            <span className="font-semibold text-[var(--color-on-surface)] block mb-1">
              Principal's Seal & Remarks:
            </span>
            <p className="italic text-[var(--color-on-surface-muted)] text-[11px] leading-relaxed">
              Approved and certified by school administration. Official KNEC candidate academic
              standing.
            </p>
            <div className="mt-3 pt-2 border-t border-dashed border-[var(--color-hairline-border)] flex justify-between text-[10px] text-[var(--color-on-surface-muted)]">
              <span>Principal: {schoolConfig.principalName || "Mrs. J. K. Cheruiyot"}</span>
              <span>Official Stamp</span>
            </div>
          </div>
        </div>

        {/* Archival Footnote */}
        <div className="mt-4 pt-2 border-t border-[var(--color-hairline-border)] flex flex-wrap justify-between items-center text-[10px] text-[var(--color-on-surface-disabled)] font-caption">
          <span>Official KCSE Grading Ledger · Chokur Academic System v2.4</span>
          <span>Next Term Opens: {schoolConfig.termOpeningDate || "TBA"}</span>
        </div>
      </article>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--color-surface-container-low)] font-body-md text-[var(--color-on-surface)] max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
      {/* Top Header Bar with Actions */}
      <section className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-hairline-border)] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--color-surface-container-low)] no-print">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-lg sm:text-headline-lg text-[var(--color-on-surface)]">
              Report Cards
            </h2>
            <p className="font-body-sm text-xs sm:text-body-sm text-[var(--color-on-surface-muted)]">
              {activeStream} · {activeExam} · printable A4 certificates
            </p>
          </div>

          {/* Mobile Back to Roster button when viewing card */}
          {mobileView === "card" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileView("roster")}
              className="md:hidden min-h-[40px]"
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">arrow_back</span>}
            >
              Roster
            </Button>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Contextual Back Button */}
          {role === "Parent" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView("parent-portal")}
              className="min-h-[40px]"
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">arrow_back</span>}
              title="Return to Parent Portal"
            >
              Parent Portal
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView("rankings")}
              className="min-h-[40px]"
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">arrow_back</span>}
              title="Return to Class Rankings ledger"
            >
              Rankings
            </Button>
          )}

          {/* Stepper Navigation Controls (Staff only) */}
          {role !== "Parent" && (
            <div className="flex items-center border border-[var(--color-hairline-border)] rounded bg-[var(--color-surface-container-low)] min-h-[40px]">
              <IconButton
                variant="ghost"
                size="sm"
                onClick={handlePrevStudent}
                disabled={currentIndex <= 0}
                className="min-h-[40px] min-w-[36px]"
                title="Previous Student (Press [)"
                aria-label="Previous student"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </IconButton>
              <span className="text-xs font-tabular-sm px-2 text-[var(--color-on-surface-muted)]">
                {currentIndex + 1} / {filteredRoster.length}
              </span>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={handleNextStudent}
                disabled={currentIndex >= filteredRoster.length - 1}
                className="min-h-[40px] min-w-[36px]"
                title="Next Student (Press ])"
                aria-label="Next student"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </IconButton>
            </div>
          )}

          {/* Share via WhatsApp / Native Share */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="min-h-[40px]"
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">share</span>}
            title="Share report summary"
          >
            <span className="hidden sm:inline">Share</span>
          </Button>

          {/* Print Single Card */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintSingle}
            className="min-h-[40px]"
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">print</span>}
          >
            Print
          </Button>

          {/* Download PDF via jsPDF */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="min-h-[40px]"
            iconPosition="left"
            icon={
              <span className="material-symbols-outlined text-[16px]">
                {isGeneratingPDF ? "hourglass_empty" : "download"}
              </span>
            }
          >
            {isGeneratingPDF ? "PDF..." : "PDF"}
          </Button>

          {/* Print All Cards (Staff only) */}
          {role !== "Parent" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrintAll}
              className="min-h-[40px]"
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">print</span>}
            >
              <span className="hidden sm:inline">Print All ({students.length})</span>
              <span className="sm:hidden">All</span>
            </Button>
          )}
        </div>
      </section>

      {/* Main Responsive Two-Panel Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Searchable Class Roster Index (Hidden for parents or on mobile when card is open) */}
        <aside
          className={`w-full md:w-80 shrink-0 border-r border-[var(--color-hairline-border)] flex flex-col bg-[var(--color-surface-container-low)] overflow-hidden no-print ${
            role === "Parent" || mobileView === "card" ? "hidden" : "flex"
          }`}
        >
          <div className="p-3 border-b border-[var(--color-hairline-border)] space-y-2 bg-[var(--color-surface-container-low)]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[17px] text-[var(--color-on-surface-disabled)]">
                search
              </span>
              <Input
                type="text"
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                placeholder="Search candidate name or adm..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center justify-between text-xs px-1 text-[var(--color-on-surface-muted)]">
              <span className="font-caption text-caption text-[var(--color-on-surface-muted)]">
                Class Candidates
              </span>
              <span className="text-[var(--color-on-surface)] font-semibold font-tabular-sm">
                {filteredRoster.length} Candidates
              </span>
            </div>
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-hairline-border)] max-h-[calc(100vh-210px)]">
            {filteredRoster.map((item) => {
              const isSelected = item.student.id === selectedCalculation?.student.id;

              return (
                <div
                  key={item.student.id}
                  onClick={() => {
                    setSelectedStudentId(item.student.id);
                    setMobileView("card");
                  }}
                  className={`p-3 cursor-pointer transition-colors min-h-[56px] flex items-center justify-between ${
                    isSelected
                      ? "bg-[var(--color-surface-container)] border-l-3 border-[var(--color-primary)]"
                      : "hover:bg-[var(--color-surface-container)]"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="font-tabular-sm text-[11px] text-[var(--color-on-surface-disabled)] block">
                      ADM {item.student.admNo}
                    </span>
                    <h4
                      className={`leading-snug truncate ${
                        isSelected
                          ? "font-semibold text-xs text-[var(--color-on-surface)]"
                          : "font-medium text-xs text-[var(--color-on-surface)]"
                      }`}
                    >
                      {item.student.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--color-on-surface-muted)] font-tabular-sm">
                      <span className="text-[var(--color-on-surface)] font-semibold">
                        Rank #{item.rank}
                      </span>
                      <span>•</span>
                      <span>{item.aggregate}/84 pts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <GradeChip grade={item.meanGrade} size="sm" />
                    <span className="material-symbols-outlined text-[16px] text-[var(--color-on-surface-disabled)] md:hidden">
                      chevron_right
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Panel: Official Printable A4 Sheet Preview (Shown on desktop or when mobileView === 'card') */}
        <section
          className={`flex-1 bg-[var(--color-surface-container-low)] overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col items-center justify-start ${
            mobileView === "roster" ? "hidden md:flex" : "flex"
          }`}
        >
          {printAllMode ? (
            <div className="w-full flex flex-col items-center">
              {rankings.map((calc) => renderReportCard(calc, true))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center overflow-x-auto hide-scrollbar">
              {renderReportCard(selectedCalculation, false)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
