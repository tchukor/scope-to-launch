import React, { useMemo, useState } from "react";
import { useGrading } from "../context/GradingContext";
import { ClassStream, ExamPeriod, Student, Subject } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button, IconButton } from "../components/ui/Button";
import { Badge, StatusBadge } from "../components/ui/Badge";
import { Input, Textarea, Select } from "../components/ui/Input";
import { DataTable, TableHeader, TableHead, TableRow, TableCell, TableFooter } from "../components/ui/DataTable";
import { Sheet, SheetTrigger } from "../components/ui/Sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";

export const StudentsClassesView: React.FC = () => {
  const {
    students,
    subjects,
    streams,
    exams,
    activeStream,
    setActiveStream,
    addStudent,
    updateStudent,
    removeStudent,
    bulkAddStudents,
    addSubject,
    updateSubject,
    removeSubject,
    addClassStream,
    updateClassStream,
    removeClassStream,
    addExamPeriod,
    updateExamPeriod,
    removeExamPeriod,
    activeSubTab,
    setActiveSubTab,
    setActiveView,
  } = useGrading();

  const currentTab =
    (activeSubTab as "students" | "classes" | "subjects" | "periods") || "students";

  const [searchStudent, setSearchStudent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Student Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentFormData, setStudentFormData] = useState({
    admNo: "",
    name: "",
    stream: activeStream,
    gender: "Female" as "Male" | "Female",
    kcpeMarks: 350,
  });
  const [studentFormError, setStudentFormError] = useState<string | null>(null);

  // Student Delete Confirmation Modal
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Bulk CSV Import Modal
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvImportResult, setCsvImportResult] = useState<{
    parsed: Array<{
      admNo: string;
      name: string;
      gender: "Male" | "Female";
      kcpeMarks: number;
      isValid: boolean;
      error?: string;
    }>;
    validCount: number;
    invalidCount: number;
  } | null>(null);

  // Class Stream Modals
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<ClassStream | null>(null);
  const [streamFormData, setStreamFormData] = useState({
    name: "",
    form: "Form 4",
    stream: "",
    classTeacher: "",
  });
  const [deletingStream, setDeletingStream] = useState<ClassStream | null>(null);

  // Subject Modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectFormData, setSubjectFormData] = useState({
    code: "",
    name: "",
    department: "Languages",
    teacher: "",
    lastExamMean: 50.0,
  });
  const [subjectFormError, setSubjectFormError] = useState<string | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  // Exam Period Modals
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamPeriod | null>(null);
  const [examFormData, setExamFormData] = useState({
    name: "",
    term: "Term 2",
    year: 2026,
    type: "End-term" as "Mid-term" | "End-term" | "Mock",
  });
  const [deletingExam, setDeletingExam] = useState<ExamPeriod | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesStream = s.stream === activeStream;
      if (!matchesStream) return false;
      if (!searchStudent.trim()) return true;
      const q = searchStudent.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q);
    });
  }, [students, activeStream, searchStudent]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  // STUDENT ACTIONS
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentFormError(null);
    setStudentFormData({
      admNo: String(4000 + students.length + 1),
      name: "",
      stream: activeStream,
      gender: "Female",
      kcpeMarks: 340,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentFormError(null);
    setStudentFormData({
      admNo: student.admNo,
      name: student.name,
      stream: student.stream,
      gender: student.gender,
      kcpeMarks: student.kcpeMarks,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentFormError(null);
    const adm = studentFormData.admNo.trim();
    const name = studentFormData.name.trim();

    if (!adm || !name) {
      setStudentFormError("Admission Number and Student Full Name are required.");
      return;
    }

    // Check duplicate admission numbers
    const duplicate = students.find(
      (s) =>
        s.admNo.toLowerCase() === adm.toLowerCase() &&
        (!editingStudent || s.id !== editingStudent.id),
    );
    if (duplicate) {
      setStudentFormError(`Admission number "${adm}" is already assigned to ${duplicate.name}.`);
      return;
    }

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        admNo: adm,
        name,
        stream: studentFormData.stream,
        gender: studentFormData.gender,
        kcpeMarks: Number(studentFormData.kcpeMarks) || 300,
      });
    } else {
      addStudent({
        admNo: adm,
        name,
        stream: studentFormData.stream,
        gender: studentFormData.gender,
        kcpeMarks: Number(studentFormData.kcpeMarks) || 300,
        status: "Active",
      });
    }

    setIsAddModalOpen(false);
  };

  const handleConfirmDeleteStudent = () => {
    if (deletingStudent) {
      removeStudent(deletingStudent.id);
      setDeletingStudent(null);
    }
  };

  // BULK IMPORT CSV PARSER
  const handleProcessStudentCSV = (rawText: string) => {
    setCsvText(rawText);
    const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const existingAdms = new Set(students.map((s) => s.admNo.trim().toLowerCase()));

    const parsed: Array<{
      admNo: string;
      name: string;
      gender: "Male" | "Female";
      kcpeMarks: number;
      isValid: boolean;
      error?: string;
    }> = [];

    lines.forEach((line, idx) => {
      // Skip header if line has "adm" or "name"
      if (
        idx === 0 &&
        (line.toLowerCase().includes("adm") || line.toLowerCase().includes("name"))
      ) {
        return;
      }
      const delimiter = line.includes("\t") ? "\t" : ",";
      const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length === 0 || !parts[0]) return;

      const admNo = parts[0];
      const name = parts[1] || "";
      const genderRaw = parts[2] ? parts[2].toUpperCase() : "FEMALE";
      const gender: "Male" | "Female" = genderRaw.startsWith("M") ? "Male" : "Female";
      const kcpe = Number(parts[3]) || 320;

      if (!admNo) {
        parsed.push({
          admNo,
          name,
          gender,
          kcpeMarks: kcpe,
          isValid: false,
          error: "Missing admission number",
        });
      } else if (!name) {
        parsed.push({
          admNo,
          name,
          gender,
          kcpeMarks: kcpe,
          isValid: false,
          error: "Missing student name",
        });
      } else if (existingAdms.has(admNo.toLowerCase())) {
        parsed.push({
          admNo,
          name,
          gender,
          kcpeMarks: kcpe,
          isValid: false,
          error: "Admission number already exists",
        });
      } else {
        existingAdms.add(admNo.toLowerCase());
        parsed.push({ admNo, name, gender, kcpeMarks: kcpe, isValid: true });
      }
    });

    const validCount = parsed.filter((p) => p.isValid).length;
    const invalidCount = parsed.length - validCount;

    setCsvImportResult({ parsed, validCount, invalidCount });
  };

  const handleApplyBulkStudents = () => {
    if (!csvImportResult || csvImportResult.validCount === 0) return;
    const toAdd = csvImportResult.parsed
      .filter((p) => p.isValid)
      .map((p) => ({
        admNo: p.admNo,
        name: p.name,
        stream: activeStream,
        gender: p.gender,
        kcpeMarks: p.kcpeMarks,
        status: "Active" as const,
      }));

    bulkAddStudents(toAdd);
    setIsCSVModalOpen(false);
    setCsvText("");
    setCsvImportResult(null);
  };

  // CLASS STREAM ACTIONS
  const handleOpenAddStream = () => {
    setEditingStream(null);
    setStreamFormData({
      name: "Form 4 ",
      form: "Form 4",
      stream: "Central",
      classTeacher: "",
    });
    setIsStreamModalOpen(true);
  };

  const handleOpenEditStream = (str: ClassStream) => {
    setEditingStream(str);
    setStreamFormData({
      name: str.name,
      form: str.form,
      stream: str.stream,
      classTeacher: str.classTeacher || "",
    });
    setIsStreamModalOpen(true);
  };

  const handleSaveStream = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${streamFormData.form} ${streamFormData.stream}`.trim();
    if (!fullName) return;

    if (editingStream) {
      updateClassStream({
        ...editingStream,
        name: fullName,
        form: streamFormData.form,
        stream: streamFormData.stream,
        classTeacher: streamFormData.classTeacher.trim(),
      });
    } else {
      addClassStream({
        name: fullName,
        form: streamFormData.form,
        stream: streamFormData.stream,
        classTeacher: streamFormData.classTeacher.trim(),
      });
    }
    setIsStreamModalOpen(false);
  };

  // SUBJECT ACTIONS
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormError(null);
    setSubjectFormData({
      code: "",
      name: "",
      department: "Sciences",
      teacher: "",
      lastExamMean: 50.0,
    });
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subj: Subject) => {
    setEditingSubject(subj);
    setSubjectFormError(null);
    setSubjectFormData({
      code: subj.code,
      name: subj.name,
      department: subj.department,
      teacher: subj.teacher || "",
      lastExamMean: subj.lastExamMean,
    });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setSubjectFormError(null);
    const code = subjectFormData.code.toUpperCase().trim();
    const name = subjectFormData.name.trim();

    if (!code || !name) {
      setSubjectFormError("Subject code and Subject name are required.");
      return;
    }

    const dup = subjects.find(
      (s) => s.code === code && (!editingSubject || s.id !== editingSubject.id),
    );
    if (dup) {
      setSubjectFormError(`Subject code "${code}" is already in use by ${dup.name}.`);
      return;
    }

    if (editingSubject) {
      updateSubject({
        ...editingSubject,
        code,
        name,
        department: subjectFormData.department,
        teacher: subjectFormData.teacher.trim(),
        lastExamMean: Number(subjectFormData.lastExamMean) || 50.0,
      });
    } else {
      addSubject({
        code,
        name,
        department: subjectFormData.department,
        teacher: subjectFormData.teacher.trim(),
        lastExamMean: Number(subjectFormData.lastExamMean) || 50.0,
        entered: students.length,
      });
    }
    setIsSubjectModalOpen(false);
  };

  // EXAM PERIOD ACTIONS
  const handleOpenAddExam = () => {
    setEditingExam(null);
    setExamFormData({
      name: "Mid-term Exam, Term 3 2026",
      term: "Term 3",
      year: 2026,
      type: "Mid-term",
    });
    setIsExamModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examFormData.name.trim()) return;

    if (editingExam) {
      updateExamPeriod({
        ...editingExam,
        name: examFormData.name.trim(),
        term: examFormData.term,
        year: Number(examFormData.year),
        type: examFormData.type,
      });
    } else {
      addExamPeriod({
        name: examFormData.name.trim(),
        term: examFormData.term,
        year: Number(examFormData.year),
        type: examFormData.type,
      });
    }
    setIsExamModalOpen(false);
  };

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-body-md text-[var(--color-on-surface)]">
      {/* Header */}
      <section className="mb-4 sm:mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-[var(--color-hairline-border)] pb-4 sm:pb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Students & Administration
          </h1>
          <p className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)] mt-1">
            Manage cohort registers, streams, curriculum subjects, and exam terms
          </p>
        </div>

        {/* Top Tab Bar with Mobile Scroll */}
        <Tabs defaultValue={currentTab} onValueChange={setActiveSubTab} variant="underline" className="w-full max-w-full" aria-label="Admin sections">
          <TabsList className="flex gap-1 overflow-x-auto hide-scrollbar">
            <TabsTrigger value="students" className="px-3.5 sm:px-4 py-2.5 min-h-[44px] whitespace-nowrap">
              Students Register
            </TabsTrigger>
            <TabsTrigger value="classes" className="px-3.5 sm:px-4 py-2.5 min-h-[44px] whitespace-nowrap">
              Classes & Streams ({streams.length})
            </TabsTrigger>
            <TabsTrigger value="subjects" className="px-3.5 sm:px-4 py-2.5 min-h-[44px] whitespace-nowrap">
              Subjects ({subjects.length})
            </TabsTrigger>
            <TabsTrigger value="periods" className="px-3.5 sm:px-4 py-2.5 min-h-[44px] whitespace-nowrap">
              Exam Periods ({exams.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Tab Panels */}
      <Tabs defaultValue={currentTab} onValueChange={setActiveSubTab} variant="underline" className="w-full max-w-full" aria-label="Admin sections">
        <TabsList className="hidden" />

        {/* TAB 1: STUDENTS */}
        <TabsContent value="students" forceMount>
          <section>
          {/* Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center flex-wrap justify-between gap-3 mb-6">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-disabled)] text-[18px]">
                search
              </span>
              <Input
                type="text"
                value={searchStudent}
                onChange={(e) => {
                  setSearchStudent(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search in ${activeStream}...`}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCsvText("");
                  setCsvImportResult(null);
                  setIsCSVModalOpen(true);
                }}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">upload_file</span>}
              >
                Bulk Import Students
              </Button>
              <Button
                size="sm"
                onClick={handleOpenAddStudent}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">person_add</span>}
              >
                Add Student
              </Button>
            </div>
          </div>

          {/* Table */}
          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-0">
              <DataTable hoverable compact>
                <TableHeader>
                  <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                    <TableHead scope="col" className="w-24 px-4">ADM NO</TableHead>
                    <TableHead scope="col" className="px-4">FULL NAME</TableHead>
                    <TableHead scope="col" className="w-24 px-3">GENDER</TableHead>
                    <TableHead scope="col" className="w-32 px-3 text-right">KCPE MARKS</TableHead>
                    <TableHead scope="col" className="w-32 px-3">STREAM</TableHead>
                    <TableHead scope="col" className="w-24 px-3 text-center">STATUS</TableHead>
                    <TableHead scope="col" className="w-32 px-4 text-right">ACTIONS</TableHead>
                  </tr>
                </TableHeader>
                <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                  {paginatedStudents.map((student) => (
                    <TableRow key={student.id} className="h-11 hover:bg-[var(--color-surface-container)] transition-colors">
                      <TableCell className="px-4 font-tabular-sm text-tabular-sm font-semibold text-[var(--color-on-surface)]">
                        {student.admNo}
                      </TableCell>
                      <TableCell className="px-4 font-medium text-[var(--color-on-surface)]">{student.name}</TableCell>
                      <TableCell className="px-3 text-[var(--color-on-surface-muted)]">{student.gender}</TableCell>
                      <TableCell className="px-3 text-right font-tabular-sm text-[var(--color-on-surface)]">
                        {student.kcpeMarks} / 500
                      </TableCell>
                      <TableCell className="px-3 text-[var(--color-on-surface-muted)]">{student.stream}</TableCell>
                      <TableCell className="px-3 text-center">
                        <StatusBadge status={student.status === "Active" ? "active" : "inactive"} size="sm">
                          {student.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditStudent(student)} className="p-0 min-h-0 text-xs">
                            Edit
                          </Button>
                          <span className="text-[var(--color-hairline-border)]">|</span>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingStudent(student)} className="p-0 min-h-0 text-xs text-[var(--color-error)] hover:text-[var(--color-error)]/80">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-[var(--color-on-surface-muted)]">
                        No student records found in {activeStream}.
                      </TableCell>
                    </TableRow>
                  )}
                </tbody>
              </DataTable>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-on-surface-muted)] font-tabular-sm">
            <span>
              Showing {filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, filteredStudents.length)} of{" "}
              {filteredStudents.length} candidates
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="min-h-[36px] px-2.5 py-1"
              >
                Previous
              </Button>
              <span className="px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="min-h-[36px] px-2.5 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </TabsContent>

      {/* TAB 2: CLASSES & STREAMS */}
      <TabsContent value="classes" forceMount>
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-body-sm text-[var(--color-on-surface-muted)]">
              Registered classes and class teachers. Switching streams updates student filters
              across all views.
            </p>
            <Button
              size="sm"
              onClick={handleOpenAddStream}
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">add</span>}
            >
              Add Class Stream
            </Button>
          </div>

          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-0">
              <DataTable hoverable compact>
                <TableHeader>
                  <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                    <TableHead scope="col" className="px-4">CLASS / STREAM</TableHead>
                    <TableHead scope="col" className="px-4">FORM LEVEL</TableHead>
                    <TableHead scope="col" className="px-4">STREAM NAME</TableHead>
                    <TableHead scope="col" className="px-4">CLASS TEACHER</TableHead>
                    <TableHead scope="col" className="px-4 text-right">ENROLLED STUDENTS</TableHead>
                    <TableHead scope="col" className="px-4 text-right">ACTIONS</TableHead>
                  </tr>
                </TableHeader>
                <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                  {streams.map((str) => {
                    const count = students.filter((s) => s.stream === str.name).length;
                    const isCurrentActive = activeStream === str.name;

                    return (
                      <TableRow key={str.id} className="h-11 hover:bg-[var(--color-surface-container)] transition-colors">
                        <TableCell className="px-4 font-semibold text-[var(--color-on-surface)] flex items-center gap-2">
                          <span>{str.name}</span>
                          {isCurrentActive && (
                            <StatusBadge status="active" size="sm">ACTIVE</StatusBadge>
                          )}
                        </TableCell>
                        <TableCell className="px-4 text-[var(--color-on-surface-muted)]">{str.form}</TableCell>
                        <TableCell className="px-4 text-[var(--color-on-surface-muted)]">{str.stream}</TableCell>
                        <TableCell className="px-4 text-[var(--color-on-surface)]">{str.classTeacher || "—"}</TableCell>
                        <TableCell className="px-4 text-right font-tabular-sm text-tabular-sm font-medium">
                          {count} Students
                        </TableCell>
                        <TableCell className="px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!isCurrentActive && (
                              <Button variant="ghost" size="sm" onClick={() => setActiveStream(str.name)} className="p-0 min-h-0 text-xs text-[var(--color-primary)]">
                                Switch to
                              </Button>
                            )}
                            <span className="text-[var(--color-hairline-border)]">|</span>
                            <Button variant="ghost" size="sm" onClick={() => handleOpenEditStream(str)} className="p-0 min-h-0 text-xs">
                              Edit
                            </Button>
                            <span className="text-[var(--color-hairline-border)]">|</span>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingStream(str)} className="p-0 min-h-0 text-xs text-[var(--color-error)] hover:text-[var(--color-error)]/80">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              </DataTable>
            </CardContent>
          </Card>
        </section>
      </TabsContent>

      {/* TAB 3: SUBJECTS */}
      <TabsContent value="subjects" forceMount>
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-body-sm text-[var(--color-on-surface-muted)]">
              KCSE subjects configured in the curriculum ledger.
            </p>
            <Button
              size="sm"
              onClick={handleOpenAddSubject}
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">add</span>}
            >
              Add Subject
            </Button>
          </div>

          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-0">
              <DataTable hoverable compact>
                <TableHeader>
                  <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                    <TableHead scope="col" className="w-24 px-4">CODE</TableHead>
                    <TableHead scope="col" className="px-4">SUBJECT NAME</TableHead>
                    <TableHead scope="col" className="px-4">DEPARTMENT</TableHead>
                    <TableHead scope="col" className="px-4">SUBJECT TEACHER</TableHead>
                    <TableHead scope="col" className="px-4 text-right">BENCHMARK MEAN</TableHead>
                    <TableHead scope="col" className="px-4 text-right">ACTIONS</TableHead>
                  </tr>
                </TableHeader>
                <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                  {subjects.map((subj) => (
                    <TableRow key={subj.id} className="h-11 hover:bg-[var(--color-surface-container)] transition-colors">
                      <TableCell className="px-4 font-tabular-sm text-tabular-sm font-bold text-[var(--color-on-surface)]">
                        {subj.code}
                      </TableCell>
                      <TableCell className="px-4 font-medium text-[var(--color-on-surface)]">{subj.name}</TableCell>
                      <TableCell className="px-4 text-[var(--color-on-surface-muted)]">{subj.department}</TableCell>
                      <TableCell className="px-4 text-[var(--color-on-surface)]">{subj.teacher || "—"}</TableCell>
                      <TableCell className="px-4 text-right font-tabular-sm text-[var(--color-on-surface)]">
                        {subj.lastExamMean.toFixed(1)}%
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditSubject(subj)} className="p-0 min-h-0 text-xs">
                            Edit
                          </Button>
                          <span className="text-[var(--color-hairline-border)]">|</span>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingSubject(subj)} className="p-0 min-h-0 text-xs text-[var(--color-error)] hover:text-[var(--color-error)]/80">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </DataTable>
            </CardContent>
          </Card>
        </section>
      </TabsContent>

      {/* TAB 4: PERIODS */}
      <TabsContent value="periods" forceMount>
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-body-sm text-[var(--color-on-surface-muted)]">Examination periods and term schedules.</p>
            <Button
              size="sm"
              onClick={handleOpenAddExam}
              iconPosition="left"
              icon={<span className="material-symbols-outlined text-[16px]">add</span>}
            >
              Add Exam Period
            </Button>
          </div>

          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-0">
              <DataTable hoverable compact>
                <TableHeader>
                  <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                    <TableHead scope="col" className="px-4">EXAM NAME</TableHead>
                    <TableHead scope="col" className="px-4">TERM</TableHead>
                    <TableHead scope="col" className="px-4">ACADEMIC YEAR</TableHead>
                    <TableHead scope="col" className="px-4">TYPE</TableHead>
                    <TableHead scope="col" className="px-4 text-right">ACTIONS</TableHead>
                  </tr>
                </TableHeader>
                <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                  {exams.map((exam) => (
                    <TableRow key={exam.id} className="h-11 hover:bg-[var(--color-surface-container)] transition-colors">
                      <TableCell className="px-4 font-semibold text-[var(--color-on-surface)]">{exam.name}</TableCell>
                      <TableCell className="px-4 text-[var(--color-on-surface-muted)]">{exam.term}</TableCell>
                      <TableCell className="px-4 font-tabular-sm text-[var(--color-on-surface)]">{exam.year}</TableCell>
                      <TableCell className="px-4 text-[var(--color-on-surface-muted)]">{exam.type}</TableCell>
                      <TableCell className="px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setDeletingExam(exam)} className="p-0 min-h-0 text-xs text-[var(--color-error)] hover:text-[var(--color-error)]/80">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </DataTable>
            </CardContent>
          </Card>
        </section>
      </TabsContent>
      </Tabs>

      {/* ADD / EDIT STUDENT MODAL - using Sheet */}
      <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen} side="right">
        <form onSubmit={handleSaveStudent} className="max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-hairline-border)]">
            <CardTitle className="font-headline-sm text-headline-sm">
              {editingStudent ? "Edit Student Record" : "Add New Candidate"}
            </CardTitle>
            <IconButton variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)} aria-label="Close">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </IconButton>
          </div>
          <div className="p-4 overflow-y-auto max-h-[80vh]">
            {studentFormError && (
              <Badge variant="error" className="mb-3 w-full justify-center">
                {studentFormError}
              </Badge>
            )}

            <div className="space-y-3 font-body-sm text-body-sm">
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Admission Number:
                </label>
                <Input
                  type="text"
                  required
                  value={studentFormData.admNo}
                  onChange={(e) => setStudentFormData({ ...studentFormData, admNo: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Student Full Name:
                </label>
                <Input
                  type="text"
                  required
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                    Gender:
                  </label>
                  <Select
                    value={studentFormData.gender}
                    onValueChange={(value) => setStudentFormData({ ...studentFormData, gender: value as "Male" | "Female" })}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                    KCPE Marks:
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={500}
                    value={studentFormData.kcpeMarks}
                    onChange={(e) => setStudentFormData({ ...studentFormData, kcpeMarks: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Class & Stream:
                </label>
                <Select
                  value={studentFormData.stream}
                  onValueChange={(value) => setStudentFormData({ ...studentFormData, stream: value })}
                >
                  {streams.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-hairline-border)]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Candidate
            </Button>
          </div>
        </form>
      </Sheet>

      {/* CONFIRM DELETE STUDENT MODAL (CASCADING WARNING) */}
      <Sheet open={!!deletingStudent} onOpenChange={setDeletingStudent} side="right">
        <div className="max-w-md w-full p-4">
          <div className="flex items-center gap-2 text-[var(--color-error)] mb-2">
            <span className="material-symbols-outlined text-[24px]">warning</span>
            <CardTitle className="font-headline-sm text-headline-sm">Confirm Student Deletion</CardTitle>
          </div>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface)] mb-3">
            Are you sure you want to delete{" "}
            <strong className="font-semibold">
              {deletingStudent?.name} (Adm: {deletingStudent?.admNo})
            </strong>
            ?
          </p>
          <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 text-[var(--color-on-error-container)] p-3 text-xs mb-4">
            <strong>Cascading effect:</strong> All examination scores and marks entered for this
            student across all subjects will be permanently removed from the ledger and rankings.
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDeletingStudent(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDeleteStudent}>
              Permanently Delete
            </Button>
          </div>
        </div>
      </Sheet>

      {/* BULK CSV IMPORT MODAL */}
      <Sheet open={isCSVModalOpen} onOpenChange={setIsCSVModalOpen} side="bottom">
        <div className="max-w-2xl w-full p-4">
          <div className="flex items-center justify-between mb-3 border-b border-[var(--color-hairline-border)] pb-3">
            <CardTitle className="font-headline-sm text-headline-sm">
              Bulk Import Students to {activeStream}
            </CardTitle>
            <IconButton variant="ghost" size="sm" onClick={() => setIsCSVModalOpen(false)} aria-label="Close">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </IconButton>
          </div>

          <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)] mb-3">
            Paste CSV or Tab-delimited rows with columns:{" "}
            <span className="font-medium text-[var(--color-on-surface)]">AdmissionNo, FullName, Gender, KCPE</span>
          </p>

          <Textarea
            value={csvText}
            onChange={(e) => handleProcessStudentCSV(e.target.value)}
            placeholder="3950, John Doe, Male, 340&#10;3951, Jane Wanjiku, Female, 360"
            rows={6}
          />

          {csvImportResult && (
            <div className="mt-3 p-3 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] text-xs">
              <div className="flex items-center justify-between font-medium mb-1.5">
                <span className="text-[var(--color-success)] font-bold">
                  ✓ {csvImportResult.validCount} valid candidates ready to import
                </span>
                {csvImportResult.invalidCount > 0 && (
                  <span className="text-[var(--color-error)]">
                    ✗ {csvImportResult.invalidCount} invalid rows (skipped)
                  </span>
                )}
              </div>
              <div className="max-h-28 overflow-y-auto divide-y divide-[var(--color-hairline-border)]/50 text-[11px] text-[var(--color-on-surface-muted)]">
                {csvImportResult.parsed.slice(0, 10).map((row, idx) => (
                  <div key={idx} className="py-0.5 flex justify-between">
                    <span>{row.admNo} — {row.name} ({row.gender})</span>
                    <span className={row.isValid ? "text-[var(--color-success)]" : "text-[var(--color-error)] font-semibold"}>
                      {row.isValid ? "Valid" : row.error}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[var(--color-hairline-border)]">
            <Button variant="outline" size="sm" onClick={() => setIsCSVModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApplyBulkStudents}
              disabled={!csvImportResult || csvImportResult.validCount === 0}
            >
              Import {csvImportResult ? csvImportResult.validCount : 0} Students
            </Button>
          </div>
        </div>
      </Sheet>

      {/* STREAM MODAL */}
      <Sheet open={isStreamModalOpen} onOpenChange={setIsStreamModalOpen} side="right">
        <form onSubmit={handleSaveStream} className="max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-hairline-border)]">
            <CardTitle className="font-headline-sm text-headline-sm">
              {editingStream ? "Edit Class Stream" : "Add Class Stream"}
            </CardTitle>
            <IconButton variant="ghost" size="sm" onClick={() => setIsStreamModalOpen(false)} aria-label="Close">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </IconButton>
          </div>
          <div className="p-4 overflow-y-auto max-h-[80vh]">
            <div className="space-y-3 font-body-sm text-body-sm">
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Form Level:
                </label>
                <Select
                  value={streamFormData.form}
                  onValueChange={(value) => setStreamFormData({ ...streamFormData, form: value })}
                >
                  <option value="Form 1">Form 1</option>
                  <option value="Form 2">Form 2</option>
                  <option value="Form 3">Form 3</option>
                  <option value="Form 4">Form 4</option>
                </Select>
              </div>
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Stream Name (e.g. East, West, North, Central):
                </label>
                <Input
                  type="text"
                  required
                  value={streamFormData.stream}
                  onChange={(e) => setStreamFormData({ ...streamFormData, stream: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Class Teacher:
                </label>
                <Input
                  type="text"
                  value={streamFormData.classTeacher}
                  onChange={(e) => setStreamFormData({ ...streamFormData, classTeacher: e.target.value })}
                  placeholder="e.g. Mrs. S. Chelangat"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-hairline-border)]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsStreamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Stream
            </Button>
          </div>
        </form>
      </Sheet>

      {/* DELETE STREAM CONFIRMATION */}
      <Sheet open={!!deletingStream} onOpenChange={setDeletingStream} side="right">
        <div className="max-w-md w-full p-4">
          <CardTitle className="font-headline-sm text-headline-sm text-[var(--color-error)] mb-2">Delete Stream</CardTitle>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface)] mb-3">
            Are you sure you want to delete <strong>{deletingStream?.name}</strong>?
          </p>
          <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 text-[var(--color-on-error-container)] p-3 text-xs mb-4">
            <strong>Cascading warning:</strong> All{" "}
            {students.filter((s) => s.stream === deletingStream?.name).length} students currently
            enrolled in {deletingStream?.name} and their marks will be removed.
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDeletingStream(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { removeClassStream(deletingStream!.id); setDeletingStream(null); }}>
              Delete Stream & Students
            </Button>
          </div>
        </div>
      </Sheet>

      {/* SUBJECT MODAL */}
      <Sheet open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen} side="right">
        <form onSubmit={handleSaveSubject} className="max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-hairline-border)]">
            <CardTitle className="font-headline-sm text-headline-sm">
              {editingSubject ? "Edit Subject" : "Add Curriculum Subject"}
            </CardTitle>
            <IconButton variant="ghost" size="sm" onClick={() => setIsSubjectModalOpen(false)} aria-label="Close">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </IconButton>
          </div>
          <div className="p-4 overflow-y-auto max-h-[80vh]">
            {subjectFormError && (
              <Badge variant="error" className="mb-3 w-full justify-center">
                {subjectFormError}
              </Badge>
            )}
            <div className="space-y-3 font-body-sm text-body-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                    Subject Code:
                  </label>
                  <Input
                    type="text"
                    required
                    maxLength={4}
                    value={subjectFormData.code}
                    onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FRE"
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                    Department:
                  </label>
                  <Select
                    value={subjectFormData.department}
                    onValueChange={(value) => setSubjectFormData({ ...subjectFormData, department: value })}
                  >
                    <option value="Languages">Languages</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Applied Sciences">Applied Sciences</option>
                    <option value="Technicals">Technicals</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Subject Full Name:
                </label>
                <Input
                  type="text"
                  required
                  value={subjectFormData.name}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                  placeholder="e.g. French"
                />
              </div>
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Subject Teacher:
                </label>
                <Input
                  type="text"
                  value={subjectFormData.teacher}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, teacher: e.target.value })}
                  placeholder="e.g. Madame Dubois"
                />
              </div>
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Previous Exam Benchmark Mean:
                </label>
                <Input
                  type="number"
                  step={0.1}
                  value={subjectFormData.lastExamMean}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, lastExamMean: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-hairline-border)]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Subject
            </Button>
          </div>
        </form>
      </Sheet>

      {/* DELETE SUBJECT CONFIRMATION */}
      <Sheet open={!!deletingSubject} onOpenChange={setDeletingSubject} side="right">
        <div className="max-w-md w-full p-4">
          <CardTitle className="font-headline-sm text-headline-sm text-[var(--color-error)] mb-2">Delete Subject</CardTitle>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface)] mb-3">
            Are you sure you want to remove{" "}
            <strong>{deletingSubject?.code} — {deletingSubject?.name}</strong>
            ?
          </p>
          <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 text-[var(--color-on-error-container)] p-3 text-xs mb-4">
            <strong>Cascading warning:</strong> All student marks recorded under{" "}
            {deletingSubject?.code} across all cohort exams will be permanently deleted.
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDeletingSubject(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { removeSubject(deletingSubject!.code); setDeletingSubject(null); }}>
              Delete Subject & Marks
            </Button>
          </div>
        </div>
      </Sheet>

      {/* EXAM PERIOD MODAL */}
      <Sheet open={isExamModalOpen} onOpenChange={setIsExamModalOpen} side="right">
        <form onSubmit={handleSaveExam} className="max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-hairline-border)]">
            <CardTitle className="font-headline-sm text-headline-sm">
              {editingExam ? "Edit Exam Period" : "Add Examination Period"}
            </CardTitle>
            <IconButton variant="ghost" size="sm" onClick={() => setIsExamModalOpen(false)} aria-label="Close">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </IconButton>
          </div>
          <div className="p-4 overflow-y-auto max-h-[80vh]">
            <div className="space-y-3 font-body-sm text-body-sm">
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Examination Name:
                </label>
                <Input
                  type="text"
                  required
                  value={examFormData.name}
                  onChange={(e) => setExamFormData({ ...examFormData, name: e.target.value })}
                  placeholder="e.g. End-term Exam, Term 3 2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                    Term:
                  </label>
                  <Select
                    value={examFormData.term}
                    onValueChange={(value) => setExamFormData({ ...examFormData, term: value })}
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                    Year:
                  </label>
                  <Input
                    type="number"
                    value={examFormData.year}
                    onChange={(e) => setExamFormData({ ...examFormData, year: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[var(--color-on-surface-muted)] text-xs font-medium uppercase mb-1">
                  Exam Type:
                </label>
                <Select
                  value={examFormData.type}
                  onValueChange={(value) => setExamFormData({ ...examFormData, type: value as any })}
                >
                  <option value="Mid-term">Mid-term</option>
                  <option value="End-term">End-term</option>
                  <option value="Mock">Mock Exam</option>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-hairline-border)]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsExamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Exam Period
            </Button>
          </div>
        </form>
      </Sheet>

      {/* DELETE EXAM PERIOD MODAL */}
      <Sheet open={!!deletingExam} onOpenChange={setDeletingExam} side="right">
        <div className="max-w-md w-full p-4">
          <CardTitle className="font-headline-sm text-headline-sm text-[var(--color-error)] mb-2">Delete Exam Period</CardTitle>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface)] mb-3">
            Are you sure you want to delete <strong>{deletingExam?.name}</strong>?
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDeletingExam(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { removeExamPeriod(deletingExam!.id); setDeletingExam(null); }}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Workflow Next Steps Banner */}
      <Card variant="outlined" className="mt-8">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-[var(--color-on-surface)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">route</span>
                <span>Roster & Administration: Next Steps</span>
              </h4>
              <p className="text-xs text-[var(--color-on-surface-muted)] mt-0.5">
                Cohort records updated. Continue to daily roll-call attendance, marks entry, or academic
                rankings.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveView("overview")} className="px-3 py-2 text-xs">
                ← Overview
              </Button>
              <Button size="sm" onClick={() => setActiveView("marks-entry")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">edit_note</span>} className="px-3.5 py-2 text-xs">
                Enter Marks →
              </Button>
              <Button variant="primary" size="sm" onClick={() => setActiveView("attendance")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">fact_check</span>} className="px-3.5 py-2 text-xs">
                Take Attendance →
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveView("rankings")} iconPosition="right" icon={<span className="material-symbols-outlined text-[16px]">format_list_numbered</span>} className="px-3.5 py-2 text-xs">
                Class Rankings →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};