// @ts-nocheck -- original source kept verbatim; project tsconfig is stricter than the source
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { useGrading } from "../context/GradingContext";
import { MarkValue } from "../types";
import { exportTableToCSV, getGradeFromScore, sanitizeMarkInput } from "../utils/grading";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge } from "@/chokur/components/ui";
import { Input, Textarea, Select } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell, TableFooter } from "@/chokur/components/ui";
import { Sheet, SheetTrigger } from "@/chokur/components/ui";

type EntryMode = "grid" | "student" | "subject";

export const MarksEntryView: React.FC = () => {
  const {
    filteredStudents: students,
    subjects,
    marks,
    updateMark,
    batchUpdateMarks,
    rankings,
    activeStream,
    activeExam,
    saveStatus,
    forceSave,
    setActiveView,
  } = useGrading();

  // Responsive default mode: on phone screen (<768px), default to 'student' card mode
  const [entryMode, setEntryMode] = useState<EntryMode>(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return "student";
    }
    return "grid";
  });

  // Active student in student-by-student mode
  const [activeStudentIdx, setActiveStudentIdx] = useState(0);

  // Active subject in subject-by-subject mode
  const [activeSubjectCode, setActiveSubjectCode] = useState<string>(subjects[0]?.code || "MAT");

  // Active cell in grid matrix mode
  const [focusedCell, setFocusedCell] = useState<{ studentId: string; subjectCode: string } | null>(
    () => {
      if (students.length > 0 && subjects.length > 0) {
        return { studentId: students[0].id, subjectCode: subjects[0].code };
      }
      return null;
    },
  );

  const [editingValue, setEditingValue] = useState<string>("");
  const [isPastingModalOpen, setIsPastingModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [saveToast, setSaveToast] = useState(false);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const gridInputRef = useRef<HTMLInputElement>(null);

  // Sync editing value when focused cell changes in grid mode
  useEffect(() => {
    if (focusedCell) {
      const current = marks[focusedCell.studentId]?.[focusedCell.subjectCode];
      setEditingValue(current === null || current === undefined ? "" : String(current));
      setValidationWarning(null);
      setTimeout(() => {
        gridInputRef.current?.focus();
        gridInputRef.current?.select();
      }, 10);
    }
  }, [focusedCell, marks]);

  // Handle cell navigation in grid mode
  const navigateCell = (deltaRow: number, deltaCol: number) => {
    if (!focusedCell || students.length === 0 || subjects.length === 0) return;
    const currentStudentIdx = students.findIndex((s) => s.id === focusedCell.studentId);
    const currentSubjectIdx = subjects.findIndex((s) => s.code === focusedCell.subjectCode);

    if (currentStudentIdx === -1 || currentSubjectIdx === -1) return;

    let nextStudentIdx = currentStudentIdx + deltaRow;
    let nextSubjectIdx = currentSubjectIdx + deltaCol;

    if (deltaCol !== 0 && nextSubjectIdx >= subjects.length) {
      nextSubjectIdx = 0;
      nextStudentIdx = Math.min(students.length - 1, nextStudentIdx + 1);
    } else if (deltaCol !== 0 && nextSubjectIdx < 0) {
      nextSubjectIdx = subjects.length - 1;
      nextStudentIdx = Math.max(0, nextStudentIdx - 1);
    }

    nextStudentIdx = Math.max(0, Math.min(students.length - 1, nextStudentIdx));
    nextSubjectIdx = Math.max(0, Math.min(subjects.length - 1, nextSubjectIdx));

    commitCellEdit();

    setFocusedCell({
      studentId: students[nextStudentIdx].id,
      subjectCode: subjects[nextSubjectIdx].code,
    });
  };

  const commitCellEdit = () => {
    if (!focusedCell) return;
    const { studentId, subjectCode } = focusedCell;
    const sanitized = sanitizeMarkInput(editingValue);
    const num = Number(editingValue.trim());

    if (editingValue.trim() && !isNaN(num) && (num < 0 || num > 100)) {
      setValidationWarning("Mark clamped within valid range (0–100)");
      setTimeout(() => setValidationWarning(null), 3000);
    } else if (
      editingValue.trim() &&
      sanitized === null &&
      editingValue.trim().toUpperCase() !== "ABS"
    ) {
      setValidationWarning("Invalid entry: enter a mark (0–100) or ABS");
      setTimeout(() => setValidationWarning(null), 3000);
    }

    updateMark(studentId, subjectCode, sanitized);
  };

  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        navigateCell(-1, 0);
        break;
      case "ArrowDown":
        e.preventDefault();
        navigateCell(1, 0);
        break;
      case "ArrowLeft":
        if (e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
          e.preventDefault();
          navigateCell(0, -1);
        }
        break;
      case "ArrowRight":
        if (
          e.currentTarget.selectionStart === editingValue.length &&
          e.currentTarget.selectionEnd === editingValue.length
        ) {
          e.preventDefault();
          navigateCell(0, 1);
        }
        break;
      case "Tab":
        e.preventDefault();
        if (e.shiftKey) {
          navigateCell(0, -1);
        } else {
          navigateCell(0, 1);
        }
        break;
      case "Enter":
        e.preventDefault();
        navigateCell(1, 0);
        break;
      case "Escape":
        e.preventDefault();
        if (focusedCell) {
          const original = marks[focusedCell.studentId]?.[focusedCell.subjectCode];
          setEditingValue(original === null || original === undefined ? "" : String(original));
        }
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditingValue(val);
    const sanitized = sanitizeMarkInput(val);
    const num = Number(val.trim());

    if (val.trim() && !isNaN(num) && (num < 0 || num > 100)) {
      setValidationWarning("Number will be clamped to 0–100");
    } else if (val.trim() && sanitized === null && val.trim().toUpperCase() !== "ABS") {
      setValidationWarning("Enter numbers (0–100) or ABS");
    } else {
      setValidationWarning(null);
    }
  };

  const handleCellBlur = () => {
    commitCellEdit();
  };

  const handleSaveAll = () => {
    commitCellEdit();
    forceSave();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Student mode navigation
  const currentStudent = students[activeStudentIdx] || students[0];
  const currentStudentCalc = rankings.find((r) => r.student.id === currentStudent?.id);

  const handlePrevStudent = () => {
    if (activeStudentIdx > 0) setActiveStudentIdx(activeStudentIdx - 1);
  };

  const handleNextStudent = () => {
    if (activeStudentIdx < students.length - 1) setActiveStudentIdx(activeStudentIdx + 1);
  };

  const handleSingleMarkChange = (studentId: string, subjectCode: string, rawVal: string) => {
    const sanitized = sanitizeMarkInput(rawVal);
    updateMark(studentId, subjectCode, sanitized);
  };

  // Matrix paste preview & execution
  const parsedPasteGrid = useMemo(() => {
    if (!pastedText.trim() || !focusedCell || students.length === 0 || subjects.length === 0) {
      return null;
    }

    const startStudentIdx = students.findIndex((s) => s.id === focusedCell.studentId);
    const startSubjectIdx = subjects.findIndex((s) => s.code === focusedCell.subjectCode);

    if (startStudentIdx === -1 || startSubjectIdx === -1) return null;

    const rawRows = pastedText
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const updates: Array<{
      studentId: string;
      studentName: string;
      subjectCode: string;
      raw: string;
      parsed: MarkValue;
      isValid: boolean;
      error?: string;
    }> = [];

    rawRows.forEach((rowStr, rIdx) => {
      const targetStudentIdx = startStudentIdx + rIdx;
      if (targetStudentIdx >= students.length) return;
      const targetStudent = students[targetStudentIdx];

      const cells = rowStr.split(/\t|,/);
      cells.forEach((cellVal, cIdx) => {
        const targetSubjIdx = startSubjectIdx + cIdx;
        if (targetSubjIdx >= subjects.length) return;
        const targetSubj = subjects[targetSubjIdx];

        const trimmed = cellVal.trim();
        if (trimmed === "") {
          updates.push({
            studentId: targetStudent.id,
            studentName: targetStudent.name,
            subjectCode: targetSubj.code,
            raw: trimmed,
            parsed: null,
            isValid: true,
          });
        } else {
          const upper = trimmed.toUpperCase();
          if (upper === "ABS" || upper === "A" || upper === "ABSENT") {
            updates.push({
              studentId: targetStudent.id,
              studentName: targetStudent.name,
              subjectCode: targetSubj.code,
              raw: trimmed,
              parsed: "ABS",
              isValid: true,
            });
          } else {
            const num = Number(trimmed);
            if (isNaN(num)) {
              updates.push({
                studentId: targetStudent.id,
                studentName: targetStudent.name,
                subjectCode: targetSubj.code,
                raw: trimmed,
                parsed: null,
                isValid: false,
                error: "Not a number",
              });
            } else if (num < 0 || num > 100) {
              updates.push({
                studentId: targetStudent.id,
                studentName: targetStudent.name,
                subjectCode: targetSubj.code,
                raw: trimmed,
                parsed: Math.max(0, Math.min(100, Math.round(num))),
                isValid: false,
                error: "Clamped to 0-100",
              });
            } else {
              updates.push({
                studentId: targetStudent.id,
                studentName: targetStudent.name,
                subjectCode: targetSubj.code,
                raw: trimmed,
                parsed: Math.round(num),
                isValid: true,
              });
            }
          }
        }
      });
    });

    const validUpdates = updates.filter((u) => u.isValid || u.error?.includes("Clamped"));
    const invalidCount = updates.length - validUpdates.length;

    return {
      totalCells: updates.length,
      validUpdates,
      invalidCount,
      sampleRows: updates.slice(0, 8),
    };
  }, [pastedText, focusedCell, students, subjects]);

  const handleApplyPaste = () => {
    if (!parsedPasteGrid || parsedPasteGrid.validUpdates.length === 0) {
      setIsPastingModalOpen(false);
      return;
    }

    const batch = parsedPasteGrid.validUpdates.map((u) => ({
      studentId: u.studentId,
      subjectCode: u.subjectCode,
      value: u.parsed,
    }));

    batchUpdateMarks(batch);
    setIsPastingModalOpen(false);
    setPastedText("");
    handleSaveAll();
  };

  const handleExportEnteredMarksCSV = () => {
    const headers = [
      "AdmNo",
      "StudentName",
      ...subjects.map((s) => s.code),
      "Average",
      "Aggregate",
      "Grade",
    ];
    const rows = students.map((s) => {
      const calc = rankingMap.get(s.id);
      const studentMarks = marks[s.id] || {};
      const subjectCols = subjects.map((subj) => {
        const val = studentMarks[subj.code];
        return val === null || val === undefined ? "" : String(val);
      });
      return [
        s.admNo,
        s.name,
        ...subjectCols,
        calc ? calc.average.toFixed(1) : "",
        calc ? String(calc.aggregate) : "",
        calc ? calc.meanGrade : "",
      ];
    });

    exportTableToCSV(
      `Marks_Entry_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`,
      headers,
      rows,
    );
  };

  // Map student calculation for summary columns
  const rankingMap = useMemo(() => {
    const map = new Map<string, (typeof rankings)[0]>();
    rankings.forEach((r) => map.set(r.student.id, r));
    return map;
  }, [rankings]);

  // Subject averages for footer row
  const subjectAverages = useMemo(() => {
    return subjects.map((subj) => {
      let sum = 0;
      let count = 0;
      students.forEach((s) => {
        const val = marks[s.id]?.[subj.code];
        if (typeof val === "number") {
          sum += val;
          count++;
        }
      });
      return count > 0 ? (sum / count).toFixed(1) : "—";
    });
  }, [subjects, students, marks]);

  return (
    <div className="w-full min-w-0 max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 font-body-md text-[var(--color-on-surface)] flex flex-col">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-hairline-border)]">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Marks Entry
          </h1>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)] mt-1">
            {activeStream} · {activeExam} · spreadsheet ledger with instant KNEC recalculation
          </p>
        </div>

        {/* Save and Validation Toast */}
        <div className="flex flex-wrap items-center gap-2">
          {validationWarning && (
            <Badge variant="warning" icon={<span className="material-symbols-outlined text-[14px]">warning</span>} className="animate-fade-in">
              {validationWarning}
            </Badge>
          )}
          {saveToast && (
            <Badge variant="success" icon={<span className="material-symbols-outlined text-[14px]">check_circle</span>} className="animate-fade-in">
              All records synchronized and saved
            </Badge>
          )}
        </div>
      </section>

      {/* Control Ribbon with Responsive Mode Switcher */}
      <Card variant="outlined" className="mb-6">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Mode Segmented Controls */}
            <div className="flex items-center p-0.5 bg-[var(--color-surface-container)] border border-[var(--color-hairline-border)] rounded-lg" role="group" aria-label="Entry mode">
              <Button
                variant={entryMode === "student" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setEntryMode("student")}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">person</span>}
                className="min-h-[40px] gap-1.5"
              >
                Student Mode
              </Button>
              <Button
                variant={entryMode === "subject" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setEntryMode("subject")}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">menu_book</span>}
                className="min-h-[40px] gap-1.5"
              >
                Subject Mode
              </Button>
              <Button
                variant={entryMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setEntryMode("grid")}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">grid_on</span>}
                className="min-h-[40px] gap-1.5"
              >
                Full Grid
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {entryMode === "grid" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPastingModalOpen(true)}
                  iconPosition="left"
                  icon={<span className="material-symbols-outlined text-[16px]">content_paste</span>}
                  className="min-h-[40px]"
                >
                  Paste from Excel
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportEnteredMarksCSV}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">download</span>}
                className="min-h-[40px]"
              >
                Export CSV
              </Button>

              <Button
                size="sm"
                onClick={handleSaveAll}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">save</span>}
                className="min-h-[40px]"
              >
                Save All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          MODE 1: STUDENT-BY-STUDENT TOUCH MODE (Optimized for Phones & Tablets)
          ========================================================================= */}
      {entryMode === "student" && currentStudent && (
        <Card variant="elevated" className="max-w-2xl mx-auto w-full mb-6">
          <CardHeader className="pb-3 border-b border-[var(--color-hairline-border)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider block">
                  Candidate {activeStudentIdx + 1} of {students.length}
                </span>
                <CardTitle className="font-headline-md text-headline-md mt-1">{currentStudent.name}</CardTitle>
                <div className="text-xs text-[var(--color-on-surface-muted)] font-tabular-sm mt-1">
                  ADM: <strong>{currentStudent.admNo}</strong> · KCPE: {currentStudent.kcpeMarks} ·{" "}
                  {currentStudent.gender}
                </div>
              </div>

              {/* Instant Performance Badge */}
              {currentStudentCalc && (
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs text-[var(--color-on-surface-muted)]">Rank: #{currentStudentCalc.rank}</span>
                    <GradeChip grade={currentStudentCalc.meanGrade} size="md" />
                  </div>
                  <div className="text-[11px] text-[var(--color-on-surface-muted)] font-tabular-sm mt-1">
                    Mean: {currentStudentCalc.meanPoints.toFixed(1)} pts · Best 7:{" "}
                    {currentStudentCalc.aggregate}/84
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          {/* Stepper Navigation Buttons */}
          <CardContent className="pt-3 pb-3 border-b border-[var(--color-hairline-border)]">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStudent}
                disabled={activeStudentIdx === 0}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[18px]">arrow_back</span>}
                className="flex-1 min-w-0 min-h-[48px]"
              >
                <span>Prev<span className="hidden sm:inline">vious Student</span></span>
              </Button>

              {/* Quick Jump Selector */}
              <Select
                value={String(activeStudentIdx)}
                onValueChange={(e) => setActiveStudentIdx(Number(e.target.value))}
                className="min-w-0 max-w-[45%]"
              >
                {students.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    #{idx + 1} {s.admNo} - {s.name}
                  </option>
                ))}
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStudent}
                disabled={activeStudentIdx === students.length - 1}
                iconPosition="right"
                icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                className="flex-1 min-w-0 min-h-[48px]"
              >
                <span>Next<span className="hidden sm:inline"> Student</span></span>
              </Button>
            </div>
          </CardContent>

          {/* Subjects Mark Entry Form */}
          <CardContent className="p-0">
            <div className="px-4 py-2.5 bg-[var(--color-surface-container-low)] border-b border-[var(--color-hairline-border)] flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] text-[11px] uppercase">
                Curriculum Subjects ({subjects.length})
              </span>
              <span className="text-[11px] text-[var(--color-on-surface-muted)]">Enter 0–100 or ABS</span>
            </div>

            <div className="divide-y divide-[var(--color-hairline-border)]/70">
              {subjects.map((subj) => {
                const currentVal = marks[currentStudent.id]?.[subj.code];
                const scoreNum = typeof currentVal === "number" ? currentVal : null;
                const grade = scoreNum !== null ? getGradeFromScore(scoreNum).grade : null;

                return (
                  <div
                    key={subj.code}
                    className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-[var(--color-surface-container-lowest)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-[var(--color-on-surface)]">
                          {subj.code}
                        </span>
                        <span className="text-xs text-[var(--color-on-surface-muted)] truncate">{subj.name}</span>
                      </div>
                      <span className="text-[10px] text-[var(--color-on-surface-disabled)] uppercase font-label-caps">
                        {subj.department}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Input
                        type="text"
                        inputMode="numeric"
                        enterKeyHint="next"
                        value={currentVal === null || currentVal === undefined ? "" : String(currentVal)}
                        onChange={(e) => handleSingleMarkChange(currentStudent.id, subj.code, e.target.value)}
                        placeholder="—"
                        className="w-20 sm:w-24 h-12 text-center text-base font-tabular-md font-semibold"
                      />

                      <div className="w-10 flex justify-center">
                        {grade ? (
                          <GradeChip grade={grade} size="sm" />
                        ) : (
                          <span className="text-[var(--color-on-surface-disabled)] text-xs">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          MODE 2: SUBJECT-BY-SUBJECT MODE (Rapid batch marking for a teacher)
          ========================================================================= */}
      {entryMode === "subject" && (
        <Card variant="elevated" className="max-w-3xl mx-auto w-full mb-6">
          <CardContent className="p-0">
            {/* Subject Horizontal Selector */}
            <div className="px-4 py-3 bg-[var(--color-surface-container-low)] border-b border-[var(--color-hairline-border)] overflow-x-auto hide-scrollbar" role="group" aria-label="Select subject">
              {subjects.map((subj) => (
                <Button
                  key={subj.code}
                  variant={activeSubjectCode === subj.code ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSubjectCode(subj.code)}
                  className="min-h-[44px] min-w-0 whitespace-nowrap px-3 py-2 gap-1.5"
                >
                  <span>{subj.code}</span>
                  <span className="text-[10px] font-normal opacity-80 block truncate max-w-[120px] hidden sm:inline">
                    {subj.name}
                  </span>
                </Button>
              ))}
            </div>

            {/* Student Roster for active subject */}
            <div className="divide-y divide-[var(--color-hairline-border)]/70">
              {students.map((student, idx) => {
                const currentVal = marks[student.id]?.[activeSubjectCode];
                const scoreNum = typeof currentVal === "number" ? currentVal : null;
                const grade = scoreNum !== null ? getGradeFromScore(scoreNum).grade : null;

                return (
                  <div
                    key={student.id}
                    className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-[var(--color-surface-container-lowest)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 text-xs font-tabular-sm text-[var(--color-on-surface-disabled)]">{idx + 1}.</span>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-[var(--color-on-surface)]">
                          {student.name}
                        </div>
                        <div className="text-[10px] text-[var(--color-on-surface-muted)] font-tabular-sm">
                          ADM {student.admNo} · KCPE {student.kcpeMarks}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Input
                        type="text"
                        inputMode="numeric"
                        enterKeyHint="next"
                        value={currentVal === null || currentVal === undefined ? "" : String(currentVal)}
                        onChange={(e) => handleSingleMarkChange(student.id, activeSubjectCode, e.target.value)}
                        placeholder="—"
                        className="w-20 sm:w-24 h-11 text-center text-base font-tabular-md font-semibold"
                      />
                      <div className="w-10 flex justify-center">
                        {grade ? (
                          <GradeChip grade={grade} size="sm" />
                        ) : (
                          <span className="text-[var(--color-on-surface-disabled)] text-xs">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          MODE 3: FULL SPREADSHEET MATRIX (Grid Mode with Arrow Navigation & Paste)
          ========================================================================= */}
      {entryMode === "grid" && (
        <Card variant="elevated" className="flex-1 overflow-hidden">
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto hide-scrollbar flex-1 relative max-h-[640px]">
              <DataTable compact hoverable>
                <TableHeader>
                  <TableHead scope="col" className="sticky left-0 z-30 bg-[var(--color-surface-container-low)] border-r border-[var(--color-hairline-border)] w-64 min-w-[240px]">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider text-[11px]">
                      <span>ADM / STUDENT NAME ({students.length})</span>
                      <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                    </div>
                  </TableHead>

                  {/* Subject Headers */}
                  {subjects.map((subj) => (
                    <TableHead
                      key={subj.code}
                      scope="col"
                      className="border-r border-[var(--color-hairline-border)] text-center w-20 min-w-[76px] font-label-caps text-label-caps text-[var(--color-on-surface-muted)]"
                      title={subj.name}
                    >
                      {subj.code}
                    </TableHead>
                  ))}

                  {/* Summary Headers */}
                  <TableHead scope="col" className="border-r border-[var(--color-hairline-border)] text-center w-16 font-label-caps text-label-caps text-[var(--color-on-surface-muted)]">
                    AVG
                  </TableHead>
                  <TableHead scope="col" className="border-r border-[var(--color-hairline-border)] text-center w-16 font-label-caps text-label-caps text-[var(--color-on-surface-muted)]">
                    AGG
                  </TableHead>
                  <TableHead scope="col" className="text-center w-16 font-label-caps text-label-caps text-[var(--color-on-surface-muted)]">
                    GRADE
                  </TableHead>
                </TableHeader>

                <tbody className="divide-y divide-[var(--color-hairline-border)]">
                  {students.map((student, rowIdx) => {
                    const studentMarks = marks[student.id] || {};
                    const calc = rankingMap.get(student.id);

                    return (
                      <TableRow key={student.id} className="h-10 hover:bg-[var(--color-surface-container-lowest)] group">
                        {/* Sticky Student Identifier Column */}
                        <TableCell className="sticky left-0 z-20 bg-[var(--color-surface-container-low)] group-hover:bg-[var(--color-surface-container-lowest)] border-r border-[var(--color-hairline-border)] px-3 py-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-tabular-sm text-xs font-semibold text-[var(--color-on-surface)] shrink-0">
                                {student.admNo}
                              </span>
                              <span className="text-body-sm text-xs truncate text-[var(--color-on-surface)]" title={student.name}>
                                {student.name}
                              </span>
                            </div>
                            <span className="font-tabular-sm text-[10px] text-[var(--color-on-surface-muted)] ml-1 shrink-0">
                              {student.kcpeMarks}
                            </span>
                          </div>
                        </TableCell>

                        {/* Marks Cells */}
                        {subjects.map((subj) => {
                          const isFocused =
                            focusedCell?.studentId === student.id &&
                            focusedCell?.subjectCode === subj.code;
                          const cellVal = studentMarks[subj.code];
                          const isAbsent = cellVal === "ABS";
                          const scoreNum = typeof cellVal === "number" ? cellVal : null;
                          const grade = scoreNum !== null ? getGradeFromScore(scoreNum).grade : null;

                          return (
                            <TableCell
                              key={subj.code}
                              onClick={() => {
                                commitCellEdit();
                                setFocusedCell({ studentId: student.id, subjectCode: subj.code });
                              }}
                              className={`border-r border-[var(--color-hairline-border)] p-0 text-center relative cursor-pointer ${
                                isFocused ? "ring-2 ring-[var(--color-primary)] z-10 bg-[var(--color-primary-container)]/20" : ""
                              }`}
                            >
                              {isFocused ? (
                                <input
                                  ref={gridInputRef}
                                  type="text"
                                  inputMode="numeric"
                                  value={editingValue}
                                  onChange={handleInputChange}
                                  onKeyDown={handleGridKeyDown}
                                  onBlur={handleCellBlur}
                                  className="w-full h-full text-center font-tabular-sm text-xs font-semibold bg-transparent border-none outline-none p-0 text-[var(--color-on-surface)]"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center gap-1 px-1 py-1">
                                  <span
                                    className={`font-tabular-sm text-xs ${
                                      isAbsent
                                        ? "text-[var(--color-error)] font-bold"
                                        : cellVal === null || cellVal === undefined
                                        ? "text-[var(--color-on-surface-disabled)]"
                                        : "text-[var(--color-on-surface)] font-medium"
                                    }`}
                                  >
                                    {isAbsent ? "ABS" : cellVal === null || cellVal === undefined ? "—" : cellVal}
                                  </span>
                                  {grade && <GradeChip grade={grade} size="sm" />}
                                </div>
                              )}
                            </TableCell>
                          );
                        })}

                        {/* Summary Columns */}
                        <TableCell className="border-r border-[var(--color-hairline-border)] px-2 py-1 text-center font-tabular-sm text-xs font-medium text-[var(--color-on-surface)] bg-[var(--color-surface-container-low)]/50">
                          {calc ? calc.average.toFixed(1) : "—"}
                        </TableCell>
                        <TableCell className="border-r border-[var(--color-hairline-border)] px-2 py-1 text-center font-tabular-sm text-xs font-semibold text-[var(--color-on-surface)] bg-[var(--color-surface-container-low)]/50">
                          {calc ? calc.aggregate : "—"}
                        </TableCell>
                        <TableCell className="px-2 py-1 text-center bg-[var(--color-surface-container-low)]/50">
                          {calc ? <GradeChip grade={calc.meanGrade} size="sm" /> : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>

                {/* Table Footer: Subject Averages */}
                <TableFooter className="h-10 bg-[var(--color-surface-container-low)] border-t-2 border-[var(--color-on-surface)] font-semibold text-xs">
                  <TableCell className="sticky left-0 z-30 bg-[var(--color-surface-container-low)] border-r border-[var(--color-hairline-border)] px-3 py-2 font-label-caps text-[var(--color-on-surface)] uppercase tracking-wider">
                    SUBJECT MEANS ({students.length})
                  </TableCell>
                  {subjectAverages.map((avg, idx) => (
                    <TableCell key={subjects[idx].code} className="border-r border-[var(--color-hairline-border)] text-center font-tabular-sm text-[var(--color-on-surface)]">
                      {avg}
                    </TableCell>
                  ))}
                  <TableCell className="border-r border-[var(--color-hairline-border)] text-center font-tabular-sm text-[var(--color-primary)]">
                    {rankings.length > 0
                      ? (rankings.reduce((a, b) => a + b.average, 0) / rankings.length).toFixed(1)
                      : "—"}
                  </TableCell>
                  <TableCell className="border-r border-[var(--color-hairline-border)] text-center font-tabular-sm text-[var(--color-on-surface)]">
                    {rankings.length > 0
                      ? (rankings.reduce((a, b) => a + b.aggregate, 0) / rankings.length).toFixed(1)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-center font-label-caps text-[var(--color-on-surface)]">KCSE</TableCell>
                </TableFooter>
              </DataTable>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Next Steps Banner */}
      <Card variant="outlined" className="mt-6">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <Button variant="ghost" size="sm" onClick={() => setActiveView("overview")} className="px-3 py-2 text-xs">
                ← Overview
              </Button>
              <Button size="sm" onClick={() => setActiveView("rankings")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">format_list_numbered</span>} className="px-3.5 py-2 text-xs">
                Class Rankings →
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveView("subject-analysis")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">analytics</span>} className="px-3.5 py-2 text-xs">
                Subject Analysis →
              </Button>
              <Button size="sm" onClick={() => setActiveView("report-cards")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">badge</span>} className="px-3.5 py-2 text-xs">
                Report Cards →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paste from Excel / Sheets Modal - using Sheet component */}
      <Sheet open={isPastingModalOpen} onOpenChange={setIsPastingModalOpen} side="bottom">
        <div className="p-5 max-w-2xl w-full">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-hairline-border)]">
            <div>
              <h3 className="font-headline-md text-headline-md text-[var(--color-on-surface)]">
                Paste Rectangular Marks Matrix
              </h3>
              <p className="text-xs text-[var(--color-on-surface-muted)]">
                Starting at focused cell:{" "}
                <strong>
                  {focusedCell
                    ? `${students.find((s) => s.id === focusedCell.studentId)?.name} (${focusedCell.subjectCode})`
                    : "First cell"}
                </strong>
              </p>
            </div>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setIsPastingModalOpen(false)}
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </IconButton>
          </div>

          <Textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste tab-delimited or comma-delimited columns copied from Excel / Google Sheets here..."
            rows={6}
            className="font-tabular-sm text-xs"
          />

          {/* Paste Preview & Cell Verification */}
          {parsedPasteGrid && (
            <div className="mt-3 p-3 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded text-xs space-y-2">
              <div className="flex items-center justify-between font-medium">
                <span>
                  Detected {parsedPasteGrid.totalCells} cells (
                  <strong className="text-[var(--color-success)]">
                    {parsedPasteGrid.validUpdates.length} valid
                  </strong>
                  ,{" "}
                  <strong className="text-[var(--color-warning)]">
                    {parsedPasteGrid.invalidCount} invalid
                  </strong>
                  )
                </span>
              </div>
              <div className="text-[11px] text-[var(--color-on-surface-muted)] font-tabular-sm">
                {parsedPasteGrid.sampleRows.map((sample, idx) => (
                  <span key={idx} className="mr-3 inline-block">
                    {sample.studentName.split(" ")[0]} ({sample.subjectCode}):{" "}
                    <strong>{String(sample.parsed)}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-hairline-border)] mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsPastingModalOpen(false)} className="min-h-[44px]">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApplyPaste}
              disabled={!parsedPasteGrid || parsedPasteGrid.validUpdates.length === 0}
              className="min-h-[44px]"
            >
              Apply {parsedPasteGrid?.validUpdates.length || 0} Marks
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
};