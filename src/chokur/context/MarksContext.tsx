import React, { createContext, useContext, useMemo } from "react";
import type { MarkValue, ParsedCSVResult, Student } from "../types";
import {
  exportMarksTemplateCSV,
  sanitizeMarkInput,
  parseMarksCSV,
} from "../utils/grading";

interface MarksContextType {
  // Mark Operations
  updateMark: (studentId: string, subjectCode: string, value: any) => void;
  batchUpdateMarks: (
    updates: Array<{ studentId: string; subjectCode: string; value: any }>,
  ) => void;
  importMarksFromCSV: (csvContent: string, students: Student[], subjects: any[]) => ParsedCSVResult;
  downloadMarksTemplateCSV: (filteredStudents: Student[], subjects: any[], streamName: string) => void;
}

const ctxStore = globalThis as unknown as {
  __chokurMarksContext?: React.Context<MarksContextType | undefined>;
};
const MarksContext =
  ctxStore.__chokurMarksContext ??
  (ctxStore.__chokurMarksContext = createContext<MarksContextType | undefined>(undefined));

export const MarksProvider: React.FC<{
  children: React.ReactNode;
  marks: Record<string, Record<string, MarkValue>>;
  setMarks: React.Dispatch<React.SetStateAction<Record<string, Record<string, MarkValue>>>>;
}> = ({ children, marks, setMarks }) => {

  const updateMark = (studentId: string, subjectCode: string, rawVal: any) => {
    const sanitized = sanitizeMarkInput(rawVal);
    setMarks((prev) => {
      const studentMap = prev[studentId] ? { ...prev[studentId] } : {};
      studentMap[subjectCode] = sanitized;
      return {
        ...prev,
        [studentId]: studentMap,
      };
    });
  };

  const batchUpdateMarks = (
    updates: Array<{ studentId: string; subjectCode: string; value: any }>,
  ) => {
    setMarks((prev) => {
      const next = { ...prev };
      updates.forEach(({ studentId, subjectCode, value }) => {
        const sanitized = sanitizeMarkInput(value);
        if (!next[studentId]) {
          next[studentId] = {};
        } else {
          next[studentId] = { ...next[studentId] };
        }
        next[studentId][subjectCode] = sanitized;
      });
      return next;
    });
  };

  const importMarksFromCSV = (csvContent: string, students: Student[], subjects: any[]): ParsedCSVResult => {
    return parseMarksCSV(csvContent, students, subjects);
  };

  const downloadMarksTemplateCSV = (filteredStudents: Student[], subjects: any[], streamName: string) => {
    exportMarksTemplateCSV(
      filteredStudents,
      subjects,
      `KCSE_Marks_Template_${streamName.replace(/\s+/g, "_")}`,
    );
  };

  return (
    <MarksContext.Provider
      value={{
        updateMark,
        batchUpdateMarks,
        importMarksFromCSV,
        downloadMarksTemplateCSV,
      }}
    >
      {children}
    </MarksContext.Provider>
  );
};

export const useMarks = () => {
  const context = useContext(MarksContext);
  if (!context) {
    throw new Error("useMarks must be used within a MarksProvider");
  }
  return context;
};