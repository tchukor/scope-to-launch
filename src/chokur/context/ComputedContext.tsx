import React, { createContext, useContext, useMemo } from "react";
import type {
  GradeDistributionTier,
  KCSEGrade,
  Student,
  StudentCalculation,
  Subject,
  SubjectDepartmentalStat,
} from "../types";
import { getGradeFromPoints, KCSE_GRADING_TABLE, rankAllStudents } from "../utils/grading";

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

const ctxStore = globalThis as unknown as {
  __chokurComputedContext?: React.Context<ComputedContextType | undefined>;
};
const ComputedContext =
  ctxStore.__chokurComputedContext ??
  (ctxStore.__chokurComputedContext = createContext<ComputedContextType | undefined>(undefined));

export const ComputedProvider: React.FC<{
  children: React.ReactNode;
  students: Student[];
  subjects: Subject[];
  marks: Record<string, Record<string, any>>;
  schoolConfig: any;
  activeStream: string;
}> = ({ children, students, subjects, marks, schoolConfig, activeStream }) => {
  const filteredStudents = useMemo(() => {
    return students.filter((s) => s.stream === activeStream && s.status === "Active");
  }, [students, activeStream]);

  const rankings = useMemo(() => {
    return rankAllStudents(filteredStudents, marks, subjects, schoolConfig.calculationMethod);
  }, [filteredStudents, marks, subjects, schoolConfig.calculationMethod]);

  const studentsRanked = rankings.length;

  const classAverage = useMemo(() => {
    if (rankings.length === 0) return 0;
    const total = rankings.reduce((acc, curr) => acc + curr.average, 0);
    return Math.round((total / rankings.length) * 10) / 10;
  }, [rankings]);

  const passRate = useMemo(() => {
    if (rankings.length === 0) return 0;
    const qualified = rankings.filter((r) => r.qualifies).length;
    return Math.round((qualified / rankings.length) * 100);
  }, [rankings]);

  const meanGrade = useMemo(() => {
    if (rankings.length === 0) return "C+" as KCSEGrade;
    const totalPoints = rankings.reduce((acc, curr) => acc + curr.meanPoints, 0);
    const avgPoints = totalPoints / rankings.length;
    return getGradeFromPoints(avgPoints);
  }, [rankings]);

  const subjectDepartmentalStats = useMemo<SubjectDepartmentalStat[]>(() => {
    return subjects
      .map((subj) => {
        const subjectScores: number[] = [];
        filteredStudents.forEach((student) => {
          const val = marks[student.id]?.[subj.code];
          if (typeof val === "number") {
            subjectScores.push(val);
          }
        });

        const entered = subjectScores.length;
        const total = subjectScores.reduce((acc, curr) => acc + curr, 0);
        const avg = entered > 0 ? Math.round((total / entered) * 10) / 10 : 0;
        const highest = entered > 0 ? Math.max(...subjectScores) : 0;
        const lowest = entered > 0 ? Math.min(...subjectScores) : 0;
        const passed = subjectScores.filter((s) => s >= 50).length;
        const rate = entered > 0 ? Math.round((passed / entered) * 100) : 0;
        const diffFromLastExam = Math.round((avg - subj.lastExamMean) * 10) / 10;

        return {
          subject: subj,
          average: avg,
          highest,
          lowest,
          passRate: rate,
          entered,
          diffFromLastExam,
        };
      })
      .sort((a, b) => b.average - a.average);
  }, [subjects, filteredStudents, marks]);

  const strongestSubject = useMemo(() => {
    if (subjectDepartmentalStats.length === 0) return undefined;
    const top = subjectDepartmentalStats[0];
    return { name: top.subject.name, average: top.average };
  }, [subjectDepartmentalStats]);

  const weakestSubject = useMemo(() => {
    if (subjectDepartmentalStats.length === 0) return undefined;
    const bottom = subjectDepartmentalStats[subjectDepartmentalStats.length - 1];
    return { name: bottom.subject.name, average: bottom.average };
  }, [subjectDepartmentalStats]);

  const nearTheLineStudents = useMemo(() => {
    return rankings.filter((r) => r.meanPoints >= 5.8 && r.meanPoints <= 6.8);
  }, [rankings]);

  const gradeDistributionTiers = useMemo<GradeDistributionTier[]>(() => {
    const totalCount = rankings.length || 1;
    let cumulative = 0;

    return KCSE_GRADING_TABLE.map((row) => {
      const count = rankings.filter((r) => r.meanGrade === row.grade).length;
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

export const useComputed = () => {
  const context = useContext(ComputedContext);
  if (!context) {
    throw new Error("useComputed must be used within a ComputedProvider");
  }
  return context;
};
