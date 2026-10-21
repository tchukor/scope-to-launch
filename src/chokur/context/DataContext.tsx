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
import type {
  ClassStream,
  ExamPeriod,
  SchoolConfig,
  Student,
  Subject,
  TeacherProfile,
  TermConfig,
  WhatsAppMessage,
} from "../types";

interface DataContextType {
  // Core Data
  schoolConfig: SchoolConfig;
  updateSchoolConfig: (config: Partial<SchoolConfig>) => void;
  students: Student[];
  subjects: Subject[];
  streams: ClassStream[];
  exams: ExamPeriod[];
  terms: TermConfig[];
  marks: Record<string, Record<string, any>>;

  // Student Operations
  addStudent: (student: Omit<Student, "id">) => Student;
  updateStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
  bulkAddStudents: (newStudents: Array<Omit<Student, "id">>) => { added: number; skipped: number };

  // Subject Operations
  addSubject: (subject: Omit<Subject, "id">) => Subject;
  updateSubject: (subject: Subject) => void;
  removeSubject: (subjectCode: string) => void;

  // Stream & Exam Operations
  addClassStream: (stream: Omit<ClassStream, "id">) => ClassStream;
  updateClassStream: (stream: ClassStream) => void;
  removeClassStream: (streamId: string) => void;

  addExamPeriod: (exam: Omit<ExamPeriod, "id">) => ExamPeriod;
  updateExamPeriod: (exam: ExamPeriod) => void;
  removeExamPeriod: (examId: string) => void;

  // Teacher Profile & WhatsApp Communication
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  whatsAppMessages: WhatsAppMessage[];
  sendWhatsAppMessage: (msg: Omit<WhatsAppMessage, "id" | "timestamp" | "status">) => void;
}

const ctxStore = globalThis as unknown as {
  __chokurDataContext?: React.Context<DataContextType | undefined>;
};
const DataContext =
  ctxStore.__chokurDataContext ??
  (ctxStore.__chokurDataContext = createContext<DataContextType | undefined>(undefined));

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initial load from local repository cache
  const initialData = useMemo(() => {
    try {
      const stored = localStorage.getItem("chokur.appState");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          schoolConfig: parsed.schoolConfig || INITIAL_SCHOOL_CONFIG,
          teacherProfile: parsed.teacherProfile || INITIAL_TEACHER_PROFILE,
          whatsAppMessages: parsed.whatsAppMessages || INITIAL_WHATSAPP_MESSAGES,
          students: parsed.students || INITIAL_STUDENTS,
          subjects: parsed.subjects || INITIAL_SUBJECTS,
          streams: parsed.streams || INITIAL_STREAMS,
          exams: parsed.exams || INITIAL_EXAMS,
          terms: parsed.terms || INITIAL_TERMS,
          marks: parsed.marks || INITIAL_MARKS,
        };
      }
    } catch {}
    return {
      schoolConfig: INITIAL_SCHOOL_CONFIG,
      teacherProfile: INITIAL_TEACHER_PROFILE,
      whatsAppMessages: INITIAL_WHATSAPP_MESSAGES,
      students: INITIAL_STUDENTS,
      subjects: INITIAL_SUBJECTS,
      streams: INITIAL_STREAMS,
      exams: INITIAL_EXAMS,
      terms: INITIAL_TERMS,
      marks: INITIAL_MARKS,
    };
  }, []);

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(initialData.schoolConfig);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(initialData.teacherProfile);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(initialData.whatsAppMessages);
  const [students, setStudents] = useState<Student[]>(initialData.students);
  const [subjects, setSubjects] = useState<Subject[]>(initialData.subjects);
  const [streams, setStreams] = useState<ClassStream[]>(initialData.streams);
  const [exams, setExams] = useState<ExamPeriod[]>(initialData.exams);
  const [terms, setTerms] = useState<TermConfig[]>(initialData.terms);
  const [marks, setMarks] = useState<Record<string, Record<string, any>>>(initialData.marks);

  // Student Mutations
  const addStudent = (studentData: Omit<Student, "id">): Student => {
    const newId = `s-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newStudent: Student = { ...studentData, id: newId };
    setStudents((prev) => [newStudent, ...prev]);
    setMarks((prev) => ({ ...prev, [newId]: {} }));
    return newStudent;
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const removeStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setMarks((prev) => {
      const next = { ...prev };
      delete next[studentId];
      return next;
    });
  };

  const bulkAddStudents = (
    newStudentsData: Array<Omit<Student, "id">>,
  ): { added: number; skipped: number } => {
    let addedCount = 0;
    let skippedCount = 0;
    const existingAdmNos = new Set(students.map((s) => s.admNo.trim().toLowerCase()));

    const validNewStudents: Student[] = [];
    const newMarksMap: Record<string, Record<string, any>> = {};

    newStudentsData.forEach((item, idx) => {
      const normalizedAdm = item.admNo.trim().toLowerCase();
      if (!normalizedAdm || existingAdmNos.has(normalizedAdm)) {
        skippedCount++;
        return;
      }
      existingAdmNos.add(normalizedAdm);
      const newId = `s-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      validNewStudents.push({
        ...item,
        id: newId,
        admNo: item.admNo.trim(),
        name: item.name.trim(),
      });
      newMarksMap[newId] = {};
      addedCount++;
    });

    if (validNewStudents.length > 0) {
      setStudents((prev) => [...validNewStudents, ...prev]);
      setMarks((prev) => ({ ...prev, ...newMarksMap }));
    }

    return { added: addedCount, skipped: skippedCount };
  };

  // Subject Mutations
  const addSubject = (subjData: Omit<Subject, "id">): Subject => {
    const newId = `sub-${subjData.code.toLowerCase().trim()}`;
    const newSubj: Subject = { ...subjData, id: newId, code: subjData.code.toUpperCase().trim() };
    setSubjects((prev) => [...prev, newSubj]);
    return newSubj;
  };

  const updateSubject = (updatedSubj: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updatedSubj.id ? updatedSubj : s)));
  };

  const removeSubject = (subjectCode: string) => {
    setSubjects((prev) => prev.filter((s) => s.code !== subjectCode));
    setMarks((prev) => {
      const next: Record<string, Record<string, any>> = {};
      Object.entries(prev).forEach(([studentId, marksMap]) => {
        const copy = { ...marksMap };
        delete copy[subjectCode];
        next[studentId] = copy;
      });
      return next;
    });
  };

  // Class Stream Mutations
  const addClassStream = (streamData: Omit<ClassStream, "id">): ClassStream => {
    const newId = `str-${Date.now()}`;
    const newStream: ClassStream = { ...streamData, id: newId };
    setStreams((prev) => [...prev, newStream]);
    return newStream;
  };

  const updateClassStream = (updatedStream: ClassStream) => {
    const oldStream = streams.find((s) => s.id === updatedStream.id);
    setStreams((prev) => prev.map((s) => (s.id === updatedStream.id ? updatedStream : s)));

    if (oldStream && oldStream.name !== updatedStream.name) {
      setStudents((prev) =>
        prev.map((s) => (s.stream === oldStream.name ? { ...s, stream: updatedStream.name } : s)),
      );
    }
  };

  const removeClassStream = (streamId: string) => {
    const streamToRemove = streams.find((s) => s.id === streamId);
    if (!streamToRemove) return;

    setStreams((prev) => prev.filter((s) => s.id !== streamId));
    const studentIdsToRemove = new Set(
      students.filter((s) => s.stream === streamToRemove.name).map((s) => s.id),
    );
    setStudents((prev) => prev.filter((s) => !studentIdsToRemove.has(s.id)));
    setMarks((prev) => {
      const next = { ...prev };
      studentIdsToRemove.forEach((id) => delete next[id]);
      return next;
    });
  };

  // Exam Period Mutations
  const addExamPeriod = (examData: Omit<ExamPeriod, "id">): ExamPeriod => {
    const newId = `exam-${Date.now()}`;
    const newExam: ExamPeriod = { ...examData, id: newId };
    setExams((prev) => [newExam, ...prev]);
    return newExam;
  };

  const updateExamPeriod = (updatedExam: ExamPeriod) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const removeExamPeriod = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
  };

  // School Config Mutations
  const updateSchoolConfig = (newConfig: Partial<SchoolConfig>) => {
    setSchoolConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Teacher Profile Mutations
  const updateTeacherProfile = (profile: Partial<TeacherProfile>) => {
    setTeacherProfile((prev) => ({ ...prev, ...profile }));
  };

  const sendWhatsAppMessage = (msg: Omit<WhatsAppMessage, "id" | "timestamp" | "status">) => {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
    };
    setWhatsAppMessages((prev) => [...prev, newMsg]);

    if (msg.sender === "teacher") {
      setTimeout(() => {
        setWhatsAppMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: "read" } : m)),
        );
      }, 1200);

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

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};