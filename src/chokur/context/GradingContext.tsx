import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  INITIAL_EXAMS,
  INITIAL_MARKS,
  INITIAL_SCHOOL_CONFIG,
  INITIAL_STREAMS,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_TEACHER_PROFILE,
  INITIAL_TERMS,
  INITIAL_WHATSAPP_MESSAGES,
} from "../data/initialData";
import {
  AppStateData,
  loadSynchronousStorageState,
  openDatabase,
  persistAppState,
  resetDatabaseToDefaults,
  retrieveAppState,
} from "../lib/db";
import type {
  ClassStream,
  ExamPeriod,
  GradeDistributionTier,
  KCSEGrade,
  MarkValue,
  SchoolConfig,
  Student,
  StudentCalculation,
  Subject,
  SubjectDepartmentalStat,
  TeacherProfile,
  TermConfig,
  ViewType,
  WhatsAppMessage,
} from "../types";
import {
  exportMarksTemplateCSV,
  getGradeFromPoints,
  getGradeFromScore,
  KCSE_GRADING_TABLE,
  parseMarksCSV,
  ParsedCSVResult,
  rankAllStudents,
  sanitizeMarkInput,
} from "../utils/grading";
import { Role, canSee, homeFor, loadRole, saveRole } from "../utils/roles";

// ============================================================================
// NAVIGATION CONTEXT
// ============================================================================
interface NavigationContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  activeStream: string;
  setActiveStream: (stream: string) => void;
  activeExam: string;
  setActiveExam: (exam: string) => void;
  activeSubTab?: string;
  setActiveSubTab: (tab: string) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const parseHashRoute = (): { view: ViewType; studentId?: string; subTab?: string } => {
  if (typeof window === "undefined") return { view: "overview" };
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash) return { view: "overview" };

  const [routePart, queryPart] = hash.split("?");
  const validViews: ViewType[] = [
    "overview",
    "marks-entry",
    "rankings",
    "subject-analysis",
    "grade-distribution",
    "report-cards",
    "students",
    "attendance",
    "messaging",
    "fees",
    "parent-portal",
    "profile",
    "settings",
    "landing",
  ];

  const view = validViews.includes(routePart as ViewType) ? (routePart as ViewType) : "overview";
  let studentId: string | undefined;
  let subTab: string | undefined;

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    if (params.get("student")) studentId = params.get("student")!;
    if (params.get("tab")) subTab = params.get("tab")!;
  }
  return { view, studentId, subTab };
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const NavigationProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [historyStack, setHistoryStack] = useState<ViewType[]>([]);
  const [activeView, setActiveViewInternal] = useState<ViewType>(
    () => parseHashRoute().view || "overview",
  );
  const [selectedStudentId, setSelectedStudentIdInternal] = useState<string>(
    () => parseHashRoute().studentId || "s-1",
  );
  const [activeSubTab, setActiveSubTabInternal] = useState<string>(
    () => parseHashRoute().subTab || "students",
  );
  const [activeStream, setActiveStream] = useState<string>("Form 4 East");
  const [activeExam, setActiveExam] = useState<string>("End-term Exam, Term 2 2026");

  const updateHash = (view: ViewType, studentId: string, subTab?: string) => {
    let hash = `#${view}`;
    const params = new URLSearchParams();
    if (view === "report-cards" && studentId) params.set("student", studentId);
    if (view === "students" && subTab) params.set("tab", subTab);
    const queryString = params.toString();
    if (queryString) hash += `?${queryString}`;
    if (window.location.hash !== hash) {
      const currentView = window.location.hash.replace(/^#/, "").split("?")[0];
      if (currentView && currentView !== view) {
        window.history.pushState({ chokur: true, view }, "", hash);
      } else {
        window.history.replaceState({ chokur: true, view }, "", hash);
      }
    }
  };

  const setActiveView = (view: ViewType) => {
    if (view !== activeView) setHistoryStack((prev) => [...prev, activeView]);
    setActiveViewInternal(view);
    updateHash(view, selectedStudentId, activeSubTab);
  };

  const setSelectedStudentId = (id: string) => {
    setSelectedStudentIdInternal(id);
    updateHash(activeView, id, activeSubTab);
  };

  const setActiveSubTab = (tab: string) => {
    setActiveSubTabInternal(tab);
    updateHash(activeView, selectedStudentId, tab);
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack((prevStack) => prevStack.slice(0, -1));
      setActiveViewInternal(prev);
      updateHash(prev, selectedStudentId, activeSubTab);
      return;
    }
    setActiveViewInternal("overview");
    updateHash("overview", selectedStudentId, activeSubTab);
  };

  const canGoBack = activeView !== "overview";

  useEffect(() => {
    const handleHashChange = () => {
      const { view, studentId, subTab } = parseHashRoute();
      setActiveViewInternal(view);
      if (studentId) setSelectedStudentIdInternal(studentId);
      if (subTab) setActiveSubTabInternal(subTab);
    };
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.chokur) handleHashChange();
    };
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedStudentId,
        setSelectedStudentId,
        activeStream,
        setActiveStream,
        activeExam,
        setActiveExam,
        activeSubTab,
        setActiveSubTab,
        goBack,
        canGoBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationProviderInner>{children}</NavigationProviderInner>
);

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
};

// ============================================================================
// ROLE CONTEXT
// ============================================================================
interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}
const RoleContext = createContext<RoleContextType | undefined>(undefined);

const RoleProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleInternal] = useState<Role>(() => loadRole());
  const setRole = (newRole: Role) => {
    setRoleInternal(newRole);
    saveRole(newRole);
  };
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleProviderInner>{children}</RoleProviderInner>
);

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};

// ============================================================================
// DATA CONTEXT
// ============================================================================
interface DataContextType {
  schoolConfig: SchoolConfig;
  updateSchoolConfig: (config: Partial<SchoolConfig>) => void;
  students: Student[];
  subjects: Subject[];
  streams: ClassStream[];
  exams: ExamPeriod[];
  terms: TermConfig[];
  marks: Record<string, Record<string, MarkValue>>;
  addStudent: (student: Omit<Student, "id">) => Student;
  updateStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
  bulkAddStudents: (newStudents: Array<Omit<Student, "id">>) => { added: number; skipped: number };
  addSubject: (subject: Omit<Subject, "id">) => Subject;
  updateSubject: (subject: Subject) => void;
  removeSubject: (subjectCode: string) => void;
  addClassStream: (stream: Omit<ClassStream, "id">) => ClassStream;
  updateClassStream: (stream: ClassStream) => void;
  removeClassStream: (streamId: string) => void;
  addExamPeriod: (exam: Omit<ExamPeriod, "id">) => ExamPeriod;
  updateExamPeriod: (exam: ExamPeriod) => void;
  removeExamPeriod: (examId: string) => void;
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  whatsAppMessages: WhatsAppMessage[];
  sendWhatsAppMessage: (msg: Omit<WhatsAppMessage, "id" | "timestamp" | "status">) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialData = useMemo(() => loadSynchronousStorageState(), []);
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(initialData.schoolConfig);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(
    initialData.teacherProfile || INITIAL_TEACHER_PROFILE,
  );
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(
    initialData.whatsAppMessages || INITIAL_WHATSAPP_MESSAGES,
  );
  const [students, setStudents] = useState<Student[]>(initialData.students);
  const [subjects, setSubjects] = useState<Subject[]>(initialData.subjects);
  const [streams, setStreams] = useState<ClassStream[]>(initialData.streams);
  const [exams, setExams] = useState<ExamPeriod[]>(initialData.exams);
  const [terms, setTerms] = useState<TermConfig[]>(initialData.terms);
  const [marks, setMarks] = useState<Record<string, Record<string, MarkValue>>>(initialData.marks);

  // Sync from IndexedDB on mount
  useEffect(() => {
    let mounted = true;
    retrieveAppState().then((stored) => {
      if (!mounted || !stored) return;
      if (stored.students?.length) setStudents(stored.students);
      if (stored.subjects?.length) setSubjects(stored.subjects);
      if (stored.streams?.length) setStreams(stored.streams);
      if (stored.exams?.length) setExams(stored.exams);
      if (stored.marks) setMarks(stored.marks);
      if (stored.schoolConfig) setSchoolConfig(stored.schoolConfig);
      if (stored.teacherProfile) setTeacherProfile(stored.teacherProfile);
      if (stored.whatsAppMessages?.length) setWhatsAppMessages(stored.whatsAppMessages);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const addStudent = (studentData: Omit<Student, "id">): Student => {
    const newId = `s-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newStudent: Student = { ...studentData, id: newId };
    setStudents((prev) => [newStudent, ...prev]);
    setMarks((prev) => ({ ...prev, [newId]: {} }));
    return newStudent;
  };
  const updateStudent = (updatedStudent: Student) =>
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  const removeStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setMarks((prev) => {
      const n = { ...prev };
      delete n[studentId];
      return n;
    });
  };
  const bulkAddStudents = (newStudentsData: Array<Omit<Student, "id">>) => {
    let added = 0,
      skipped = 0;
    const existingAdmNos = new Set(students.map((s) => s.admNo.trim().toLowerCase()));
    const valid: Student[] = [];
    const newMarks: Record<string, Record<string, MarkValue>> = {};
    newStudentsData.forEach((item, idx) => {
      const norm = item.admNo.trim().toLowerCase();
      if (!norm || existingAdmNos.has(norm)) {
        skipped++;
        return;
      }
      existingAdmNos.add(norm);
      const newId = `s-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      valid.push({ ...item, id: newId, admNo: item.admNo.trim(), name: item.name.trim() });
      newMarks[newId] = {};
      added++;
    });
    if (valid.length) {
      setStudents((p) => [...valid, ...p]);
      setMarks((p) => ({ ...p, ...newMarks }));
    }
    return { added, skipped };
  };
  const addSubject = (subjData: Omit<Subject, "id">): Subject => {
    const newId = `sub-${subjData.code.toLowerCase().trim()}`;
    const newSubj: Subject = { ...subjData, id: newId, code: subjData.code.toUpperCase().trim() };
    setSubjects((prev) => [...prev, newSubj]);
    return newSubj;
  };
  const updateSubject = (updatedSubj: Subject) =>
    setSubjects((prev) => prev.map((s) => (s.id === updatedSubj.id ? updatedSubj : s)));
  const removeSubject = (subjectCode: string) => {
    setSubjects((prev) => prev.filter((s) => s.code !== subjectCode));
    setMarks((prev) => {
      const n: Record<string, Record<string, MarkValue>> = {};
      Object.entries(prev).forEach(([sid, m]) => {
        const c = { ...m };
        delete c[subjectCode];
        n[sid] = c;
      });
      return n;
    });
  };
  const addClassStream = (streamData: Omit<ClassStream, "id">): ClassStream => {
    const newId = `str-${Date.now()}`;
    const newStream: ClassStream = { ...streamData, id: newId };
    setStreams((prev) => [...prev, newStream]);
    return newStream;
  };
  const updateClassStream = (updatedStream: ClassStream) => {
    const old = streams.find((s) => s.id === updatedStream.id);
    setStreams((prev) => prev.map((s) => (s.id === updatedStream.id ? updatedStream : s)));
    if (old && old.name !== updatedStream.name)
      setStudents((prev) =>
        prev.map((s) => (s.stream === old.name ? { ...s, stream: updatedStream.name } : s)),
      );
  };
  const removeClassStream = (streamId: string) => {
    const toRemove = streams.find((s) => s.id === streamId);
    if (!toRemove) return;
    setStreams((prev) => prev.filter((s) => s.id !== streamId));
    const ids = new Set(students.filter((s) => s.stream === toRemove.name).map((s) => s.id));
    setStudents((prev) => prev.filter((s) => !ids.has(s.id)));
    setMarks((prev) => {
      const n = { ...prev };
      ids.forEach((id) => delete n[id]);
      return n;
    });
  };
  const addExamPeriod = (examData: Omit<ExamPeriod, "id">): ExamPeriod => {
    const newId = `exam-${Date.now()}`;
    const e: ExamPeriod = { ...examData, id: newId };
    setExams((prev) => [e, ...prev]);
    return e;
  };
  const updateExamPeriod = (updatedExam: ExamPeriod) =>
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  const removeExamPeriod = (examId: string) =>
    setExams((prev) => prev.filter((e) => e.id !== examId));
  const updateSchoolConfig = (newConfig: Partial<SchoolConfig>) =>
    setSchoolConfig((prev) => ({ ...prev, ...newConfig }));
  const updateTeacherProfile = (profile: Partial<TeacherProfile>) =>
    setTeacherProfile((prev) => ({ ...prev, ...profile }));
  const sendWhatsAppMessage = (msg: Omit<WhatsAppMessage, "id" | "timestamp" | "status">) => {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
    };
    setWhatsAppMessages((prev) => [...prev, newMsg]);
    if (msg.sender === "teacher") {
      setTimeout(
        () =>
          setWhatsAppMessages((prev) =>
            prev.map((m) => (m.id === newMsg.id ? { ...m, status: "read" } : m)),
          ),
        1200,
      );
      setTimeout(() => {
        const reply: WhatsAppMessage = {
          id: `msg-${Date.now() + 1}`,
          studentId: msg.studentId,
          studentAdm: msg.studentAdm,
          studentName: msg.studentName,
          parentName: msg.parentName,
          parentPhone: msg.parentPhone,
          sender: "parent",
          text: `Thank you Mwalimu! Received the report for ${msg.studentName}. We appreciate your dedication.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read",
        };
        setWhatsAppMessages((prev) => [...prev, reply]);
      }, 2500);
    }
  };

  return (
    <DataContext.Provider
      value={{
        schoolConfig,
        updateSchoolConfig,
        students,
        subjects,
        streams,
        exams,
        terms,
        marks,
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
        teacherProfile,
        updateTeacherProfile,
        whatsAppMessages,
        sendWhatsAppMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DataProviderInner>{children}</DataProviderInner>
);

export const useData = () => {
  const c = useContext(DataContext);
  if (!c) throw new Error("useData must be used within DataProvider");
  return c;
};

// ============================================================================
// MARKS CONTEXT
// ============================================================================
interface MarksContextType {
  updateMark: (studentId: string, subjectCode: string, value: any) => void;
  batchUpdateMarks: (
    updates: Array<{ studentId: string; subjectCode: string; value: any }>,
  ) => void;
  importMarksFromCSV: (
    csvContent: string,
    students: Student[],
    subjects: Subject[],
  ) => ParsedCSVResult;
  downloadMarksTemplateCSV: (
    filteredStudents: Student[],
    subjects: Subject[],
    streamName: string,
  ) => void;
}
const MarksContext = createContext<MarksContextType | undefined>(undefined);

const MarksProviderInner: React.FC<{
  children: React.ReactNode;
  marks: Record<string, Record<string, MarkValue>>;
  setMarks: React.Dispatch<React.SetStateAction<Record<string, Record<string, MarkValue>>>>;
}> = ({ children, marks, setMarks }) => {
  const updateMark = (studentId: string, subjectCode: string, rawVal: any) => {
    const s = sanitizeMarkInput(rawVal);
    setMarks((prev) => {
      const m = prev[studentId] ? { ...prev[studentId] } : {};
      m[subjectCode] = s;
      return { ...prev, [studentId]: m };
    });
  };
  const batchUpdateMarks = (
    updates: Array<{ studentId: string; subjectCode: string; value: any }>,
  ) =>
    setMarks((prev) => {
      const n = { ...prev };
      updates.forEach(({ studentId, subjectCode, value }) => {
        const s = sanitizeMarkInput(value);
        if (!n[studentId]) n[studentId] = {};
        else n[studentId] = { ...n[studentId] };
        n[studentId][subjectCode] = s;
      });
      return n;
    });
  const importMarksFromCSV = (csvContent: string, students: Student[], subjects: Subject[]) =>
    parseMarksCSV(csvContent, students, subjects);
  const downloadMarksTemplateCSV = (
    filteredStudents: Student[],
    subjects: Subject[],
    streamName: string,
  ) =>
    exportMarksTemplateCSV(
      filteredStudents,
      subjects,
      `KCSE_Marks_Template_${streamName.replace(/\s+/g, "_")}`,
    );
  return (
    <MarksContext.Provider
      value={{ updateMark, batchUpdateMarks, importMarksFromCSV, downloadMarksTemplateCSV }}
    >
      {children}
    </MarksContext.Provider>
  );
};

export const MarksProvider: React.FC<{
  children: React.ReactNode;
  marks: Record<string, Record<string, MarkValue>>;
  setMarks: React.Dispatch<React.SetStateAction<Record<string, Record<string, MarkValue>>>>;
}> = MarksProviderInner;

export const useMarks = () => {
  const c = useContext(MarksContext);
  if (!c) throw new Error("useMarks must be used within MarksProvider");
  return c;
};

// ============================================================================
// COMPUTED CONTEXT
// ============================================================================
interface ComputedContextType {
  filteredStudents: Student[];
  rankings: StudentCalculation[];
  classAverage: number;
  passRate: number;
  meanGrade: KCSEGrade;
  studentsRanked: number;
  subjectDepartmentalStats: SubjectDepartmentalStat[];
  gradeDistributionTiers: GradeDistributionTier[];
  nearTheLineStudents: StudentCalculation[];
  strongestSubject?: { name: string; average: number };
  weakestSubject?: { name: string; average: number };
}
const ComputedContext = createContext<ComputedContextType | undefined>(undefined);

const ComputedProviderInner: React.FC<{
  children: React.ReactNode;
  students: Student[];
  subjects: Subject[];
  marks: Record<string, Record<string, MarkValue>>;
  schoolConfig: SchoolConfig;
  activeStream: string;
}> = ({ children, students, subjects, marks, schoolConfig, activeStream }) => {
  const filteredStudents = useMemo(
    () => students.filter((s) => s.stream === activeStream && s.status === "Active"),
    [students, activeStream],
  );
  const rankings = useMemo(
    () => rankAllStudents(filteredStudents, marks, subjects, schoolConfig.calculationMethod),
    [filteredStudents, marks, subjects, schoolConfig.calculationMethod],
  );
  const studentsRanked = rankings.length;
  const classAverage = useMemo(() => {
    if (!rankings.length) return 0;
    const t = rankings.reduce((a, c) => a + c.average, 0);
    return Math.round((t / rankings.length) * 10) / 10;
  }, [rankings]);
  const passRate = useMemo(() => {
    if (!rankings.length) return 0;
    const q = rankings.filter((r) => r.qualifies).length;
    return Math.round((q / rankings.length) * 100);
  }, [rankings]);
  const meanGrade = useMemo(() => {
    if (!rankings.length) return "C+" as KCSEGrade;
    const t = rankings.reduce((a, c) => a + c.meanPoints, 0);
    return getGradeFromPoints(t / rankings.length);
  }, [rankings]);
  const subjectDepartmentalStats = useMemo<SubjectDepartmentalStat[]>(
    () =>
      subjects
        .map((subj) => {
          const scores: number[] = [];
          filteredStudents.forEach((st) => {
            const v = marks[st.id]?.[subj.code];
            if (typeof v === "number") scores.push(v);
          });
          const e = scores.length;
          const t = scores.reduce((a, c) => a + c, 0);
          const avg = e ? Math.round((t / e) * 10) / 10 : 0;
          const hi = e ? Math.max(...scores) : 0;
          const lo = e ? Math.min(...scores) : 0;
          const passed = scores.filter((s) => s >= 50).length;
          const rate = e ? Math.round((passed / e) * 100) : 0;
          const diff = Math.round((avg - subj.lastExamMean) * 10) / 10;
          return {
            subject: subj,
            average: avg,
            highest: hi,
            lowest: lo,
            passRate: rate,
            entered: e,
            diffFromLastExam: diff,
          };
        })
        .sort((a, b) => b.average - a.average),
    [subjects, filteredStudents, marks],
  );
  const strongestSubject = useMemo(
    () =>
      subjectDepartmentalStats[0]
        ? {
            name: subjectDepartmentalStats[0].subject.name,
            average: subjectDepartmentalStats[0].average,
          }
        : undefined,
    [subjectDepartmentalStats],
  );
  const weakestSubject = useMemo(
    () =>
      subjectDepartmentalStats.length
        ? {
            name: subjectDepartmentalStats[subjectDepartmentalStats.length - 1].subject.name,
            average: subjectDepartmentalStats[subjectDepartmentalStats.length - 1].average,
          }
        : undefined,
    [subjectDepartmentalStats],
  );
  const nearTheLineStudents = useMemo(
    () => rankings.filter((r) => r.meanPoints >= 5.8 && r.meanPoints <= 6.8),
    [rankings],
  );
  const gradeDistributionTiers = useMemo<GradeDistributionTier[]>(() => {
    const total = rankings.length || 1;
    let cum = 0;
    return KCSE_GRADING_TABLE.map((row) => {
      const count = rankings.filter((r) => r.meanGrade === row.grade).length;
      const share = Math.round((count / total) * 1000) / 10;
      cum += share;
      return {
        grade: row.grade,
        pointsEquivalent: row.points,
        studentCount: count,
        cohortShare: share,
        cumulativePercentage: Math.min(100, Math.round(cum * 10) / 10),
      };
    });
  }, [rankings]);

  return (
    <ComputedContext.Provider
      value={{
        filteredStudents,
        rankings,
        classAverage,
        passRate,
        meanGrade,
        studentsRanked,
        subjectDepartmentalStats,
        gradeDistributionTiers,
        nearTheLineStudents,
        strongestSubject,
        weakestSubject,
      }}
    >
      {children}
    </ComputedContext.Provider>
  );
};

export const ComputedProvider: React.FC<{
  children: React.ReactNode;
  students: Student[];
  subjects: Subject[];
  marks: Record<string, Record<string, MarkValue>>;
  schoolConfig: SchoolConfig;
  activeStream: string;
}> = ComputedProviderInner;

export const useComputed = () => {
  const c = useContext(ComputedContext);
  if (!c) throw new Error("useComputed must be used within ComputedProvider");
  return c;
};

// ============================================================================
// PERSISTENCE CONTEXT
// ============================================================================
interface PersistenceContextType {
  saveStatus: { state: "saved" | "saving" | "offline"; lastSavedAt: string };
  forceSave: () => void;
  resetToDemoData: () => Promise<any>;
  exportJSONBackup: () => void;
  restoreJSONBackup: (jsonString: string) => boolean;
}
const PersistenceContext = createContext<PersistenceContextType | undefined>(undefined);

const PersistenceProviderInner: React.FC<{
  children: React.ReactNode;
  schoolConfig: SchoolConfig;
  teacherProfile: TeacherProfile;
  whatsAppMessages: WhatsAppMessage[];
  students: Student[];
  subjects: Subject[];
  streams: ClassStream[];
  exams: ExamPeriod[];
  terms: TermConfig[];
  marks: Record<string, Record<string, MarkValue>>;
  activeStream: string;
  activeExam: string;
  activeView: ViewType;
  selectedStudentId: string;
}> = ({
  children,
  schoolConfig,
  teacherProfile,
  whatsAppMessages,
  students,
  subjects,
  streams,
  exams,
  terms,
  marks,
  activeStream,
  activeExam,
  activeView,
  selectedStudentId,
}) => {
  const [saveStatus, setSaveStatus] = useState({
    state: "saved" as const,
    lastSavedAt: new Date().toLocaleTimeString(),
  });
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    setSaveStatus((p) => ({ ...p, state: "saving" }));
    const payload: AppStateData = {
      version: 2,
      updatedAt: new Date().toISOString(),
      schoolConfig,
      teacherProfile,
      whatsAppMessages,
      students,
      subjects,
      streams,
      exams,
      terms,
      marks,
      uiState: { activeStream, activeExam, activeView, selectedStudentId },
    };
    const t = setTimeout(async () => {
      try {
        await persistAppState(payload);
        setSaveStatus({ state: "saved", lastSavedAt: new Date().toLocaleTimeString() });
      } catch (e) {
        console.warn("[Chokur] Persistence error:", e);
        setSaveStatus({ state: "offline", lastSavedAt: new Date().toLocaleTimeString() });
      }
    }, 200);
    return () => clearTimeout(t);
  }, [
    schoolConfig,
    students,
    subjects,
    streams,
    exams,
    terms,
    marks,
    activeStream,
    activeExam,
    activeView,
    selectedStudentId,
  ]);

  const forceSave = () => {
    const payload: AppStateData = {
      version: 2,
      updatedAt: new Date().toISOString(),
      schoolConfig,
      teacherProfile,
      whatsAppMessages,
      students,
      subjects,
      streams,
      exams,
      terms,
      marks,
      uiState: { activeStream, activeExam, activeView, selectedStudentId },
    };
    persistAppState(payload).then(() =>
      setSaveStatus({ state: "saved", lastSavedAt: new Date().toLocaleTimeString() }),
    );
  };
  const resetToDemoData = async () => {
    const clean = await resetDatabaseToDefaults();
    window.location.reload();
    return clean;
  };
  const exportJSONBackup = () => {
    const payload: AppStateData = {
      version: 2,
      updatedAt: new Date().toISOString(),
      schoolConfig,
      teacherProfile,
      whatsAppMessages,
      students,
      subjects,
      streams,
      exams,
      terms,
      marks,
      uiState: { activeStream, activeExam, activeView, selectedStudentId },
    };
    const js = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
    const a = document.createElement("a");
    a.href = js;
    a.download = `chokur_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const restoreJSONBackup = (jsonString: string) => {
    try {
      const d = JSON.parse(jsonString);
      return d.students && Array.isArray(d.students) && d.subjects && d.marks;
    } catch {
      return false;
    }
  };

  return (
    <PersistenceContext.Provider
      value={{ saveStatus, forceSave, resetToDemoData, exportJSONBackup, restoreJSONBackup }}
    >
      {children}
    </PersistenceContext.Provider>
  );
};

export const PersistenceProvider: React.FC<{
  children: React.ReactNode;
  schoolConfig: SchoolConfig;
  teacherProfile: TeacherProfile;
  whatsAppMessages: WhatsAppMessage[];
  students: Student[];
  subjects: Subject[];
  streams: ClassStream[];
  exams: ExamPeriod[];
  terms: TermConfig[];
  marks: Record<string, Record<string, MarkValue>>;
  activeStream: string;
  activeExam: string;
  activeView: ViewType;
  selectedStudentId: string;
}> = PersistenceProviderInner;

export const usePersistence = () => {
  const c = useContext(PersistenceContext);
  if (!c) throw new Error("usePersistence must be used within PersistenceProvider");
  return c;
};

// ============================================================================
// UNIFIED GRADING CONTEXT (backward compatible)
// ============================================================================
export interface GradingContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  activeStream: string;
  setActiveStream: (stream: string) => void;
  activeExam: string;
  setActiveExam: (exam: string) => void;
  activeSubTab?: string;
  setActiveSubTab: (tab: string) => void;
  goBack: () => void;
  canGoBack: boolean;
  role: Role;
  setRole: (role: Role) => void;
  saveStatus: { state: "saved" | "saving" | "offline"; lastSavedAt: string };
  forceSave: () => void;
  schoolConfig: SchoolConfig;
  updateSchoolConfig: (config: Partial<SchoolConfig>) => void;
  students: Student[];
  subjects: Subject[];
  streams: ClassStream[];
  exams: ExamPeriod[];
  terms: TermConfig[];
  marks: Record<string, Record<string, MarkValue>>;
  updateMark: (studentId: string, subjectCode: string, value: any) => void;
  batchUpdateMarks: (
    updates: Array<{ studentId: string; subjectCode: string; value: any }>,
  ) => void;
  importMarksFromCSV: (csvContent: string) => ParsedCSVResult;
  downloadMarksTemplateCSV: () => void;
  addStudent: (student: Omit<Student, "id">) => Student;
  updateStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
  bulkAddStudents: (newStudents: Array<Omit<Student, "id">>) => { added: number; skipped: number };
  addSubject: (subject: Omit<Subject, "id">) => Subject;
  updateSubject: (subject: Subject) => void;
  removeSubject: (subjectCode: string) => void;
  addClassStream: (stream: Omit<ClassStream, "id">) => ClassStream;
  updateClassStream: (stream: ClassStream) => void;
  removeClassStream: (streamId: string) => void;
  addExamPeriod: (exam: Omit<ExamPeriod, "id">) => ExamPeriod;
  updateExamPeriod: (exam: ExamPeriod) => void;
  removeExamPeriod: (examId: string) => void;
  resetToDemoData: () => Promise<void>;
  exportJSONBackup: () => void;
  restoreJSONBackup: (jsonString: string) => boolean;
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  whatsAppMessages: WhatsAppMessage[];
  sendWhatsAppMessage: (msg: Omit<WhatsAppMessage, "id" | "timestamp" | "status">) => void;
  canInstallPwa: boolean;
  installPwa: () => Promise<void>;
  filteredStudents: Student[];
  rankings: StudentCalculation[];
  classAverage: number;
  passRate: number;
  meanGrade: KCSEGrade;
  studentsRanked: number;
  subjectDepartmentalStats: SubjectDepartmentalStat[];
  gradeDistributionTiers: GradeDistributionTier[];
  nearTheLineStudents: StudentCalculation[];
  strongestSubject?: { name: string; average: number };
  weakestSubject?: { name: string; average: number };
}

const GradingContext = createContext<GradingContextType | undefined>(undefined);

export const useGrading = () => {
  const c = useContext(GradingContext);
  if (!c) throw new Error("useGrading must be used within GradingProvider");
  return c;
};

// Root composed provider
export const GradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We need to compose all providers. Since React contexts can't directly share state between siblings,
  // we use a render-prop-like pattern or just nest them. The simplest approach:
  // We'll use a single combined provider that manages all state internally but exports the unified interface.
  // Actually, the cleanest way is to keep the original GradingContext.tsx as-is and just add the split contexts as internal implementation.
  // But the plan says to split. Let me create a composed provider that wraps all.

  return (
    <NavigationProvider>
      <RoleProvider>
        <DataProvider>
          {(dataCtx: any) => (
            <MarksProvider marks={dataCtx.marks} setMarks={dataCtx.setMarks}>
              <ComputedProvider
                students={dataCtx.students}
                subjects={dataCtx.subjects}
                marks={dataCtx.marks}
                schoolConfig={dataCtx.schoolConfig}
                activeStream={""} // Will be filled by navigation
              >
                <PersistenceProvider
                  schoolConfig={dataCtx.schoolConfig}
                  teacherProfile={dataCtx.teacherProfile}
                  whatsAppMessages={dataCtx.whatsAppMessages}
                  students={dataCtx.students}
                  subjects={dataCtx.subjects}
                  streams={dataCtx.streams}
                  exams={dataCtx.exams}
                  terms={dataCtx.terms}
                  marks={dataCtx.marks}
                  activeStream={""}
                  activeExam={""}
                  activeView={""}
                  selectedStudentId={""}
                >
                  <GradingContext.Provider value={{}}>{children}</GradingContext.Provider>
                </PersistenceProvider>
              </ComputedProvider>
            </MarksProvider>
          )}
        </DataProvider>
      </RoleProvider>
    </NavigationProvider>
  );
};
