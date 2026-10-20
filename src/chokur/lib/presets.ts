import { Student, Subject, ClassStream, ExamPeriod, SchoolConfig, AppStateData } from "../types";
import {
  INITIAL_SCHOOL_CONFIG,
  INITIAL_SUBJECTS,
  INITIAL_STREAMS,
  INITIAL_EXAMS,
  INITIAL_TERMS,
} from "../data/initialData";
import { ops, resetSchoolOps } from "./schoolOps";

export interface TestPreset {
  id: string;
  name: string;
  tagline: string;
  form: string;
  stream: string;
  studentCount: number;
  meanGrade: string;
  meanPoints: number;
  highlight: string;
  category: "Standard" | "STEM" | "Remedial" | "Finance" | "Admissions";
  generate: () => {
    state: Partial<AppStateData>;
    opsData?: {
      feePerTerm: number;
      absentStudents?: string[];
      payments?: {
        studentId: string;
        amount: number;
        method: "M-Pesa" | "Bank" | "Cash";
        ref: string;
      }[];
    };
  };
}

export const TEST_PRESETS: TestPreset[] = [
  {
    id: "preset-form4-east",
    name: "Form 4 East — Standard KCSE Cohort",
    tagline: "Realistic balanced performance bell curve",
    form: "Form 4",
    stream: "Form 4 East",
    studentCount: 42,
    meanGrade: "B-",
    meanPoints: 7.21,
    highlight:
      "Standard distribution from A down to D- across 8 subjects. Ideal for checking general rankings and report card generation.",
    category: "Standard",
    generate: () => {
      // Returns standard initial cohort
      return {
        state: {
          uiState: {
            activeStream: "Form 4 East",
            activeExam: "End-term Exam, Term 2 2026",
            activeView: "overview",
            selectedStudentId: "s-1",
            activeSubTab: "students",
          },
        },
      };
    },
  },
  {
    id: "preset-form4-stem",
    name: "Form 4 West — STEM High Achievers",
    tagline: "Exemplary science & mathematics cohort",
    form: "Form 4",
    stream: "Form 4 West",
    studentCount: 38,
    meanGrade: "B+",
    meanPoints: 9.35,
    highlight:
      "Multiple A and A- grades with high subject means in Mathematics, Chemistry, Physics, and Biology. Minimal fee arrears.",
    category: "STEM",
    generate: () => {
      const stemStudents: Student[] = Array.from({ length: 38 }, (_, i) => {
        const id = `stem-${i + 1}`;
        const adm = `38${String(10 + i).padStart(2, "0")}`;
        const names = [
          "Otieno Brian Kevin",
          "Kiprono Mercy Jepchumba",
          "Njoroge Samuel Kamau",
          "Achieng Stephanie Nicole",
          "Kariuki Emmanuel Mwangi",
          "Mutua Daniel Kyalo",
          "Chepkirui Joyline",
          "Wamalwa Victor Barasa",
          "Mwangi Dennis Githinji",
          "Onyango Cynthia Akoth",
          "Kipchumba Festus",
          "Maina Grace Wambui",
          "Koech Kelvin Kiprotich",
          "Wambua Faith Mwende",
          "Korir Allan Kiprop",
          "Mwende Christine",
          "Njuguna Ian Ndung'u",
          "Chebet Gloria",
          "Kimani David Macharia",
          "Atieno Lavender",
          "Simiyu Collins",
          "Kiptoo Evans",
          "Muthoni Sharon",
          "Ouma George",
          "Kosgei Brenda",
          "Cheruiyot Gideon",
          "Moraa Janet",
          "Rono Dominic",
          "Wairimu Lucy",
          "Kibet Hillary",
          "Jepkemboi Vivian",
          "Ndegwa Peter",
          "Auma Belinda",
          "Rotich Nathan",
          "Njeri Beatrice",
          "Kiptanui Silas",
          "Wanja Esther",
          "Kipruto Titus",
        ];
        return {
          id,
          admNo: adm,
          name: names[i % names.length],
          gender: (i % 2 === 0 ? "M" : "F") as "M" | "F",
          stream: "Form 4 West",
          kcpeMarks: 360 + ((i * 11) % 65),
          subjects: ["MAT", "ENG", "KIS", "BIO", "CHE", "PHY", "GEO", "BST"],
        };
      });

      const stemMarks: Record<string, Record<string, number>> = {};
      stemStudents.forEach((student, idx) => {
        stemMarks[student.id] = {
          MAT: Math.min(98, 72 + ((idx * 7) % 27)),
          ENG: Math.min(94, 68 + ((idx * 5) % 26)),
          KIS: Math.min(92, 65 + ((idx * 8) % 26)),
          CHE: Math.min(96, 70 + ((idx * 6) % 27)),
          PHY: Math.min(95, 74 + ((idx * 9) % 24)),
          BIO: Math.min(93, 69 + ((idx * 4) % 24)),
          GEO: Math.min(94, 68 + ((idx * 7) % 26)),
          BST: Math.min(96, 75 + ((idx * 5) % 23)),
        };
      });

      return {
        state: {
          students: stemStudents,
          marks: stemMarks,
          uiState: {
            activeStream: "Form 4 West",
            activeExam: "End-term Exam, Term 2 2026",
            activeView: "rankings",
            selectedStudentId: "stem-1",
            activeSubTab: "students",
          },
        },
        opsData: {
          feePerTerm: 45000,
          payments: stemStudents.slice(0, 32).map((s, i) => ({
            studentId: s.id,
            amount: 45000,
            method: i % 2 === 0 ? "M-Pesa" : "Bank",
            ref: `MPESA-STEM-${1000 + i}`,
          })),
        },
      };
    },
  },
  {
    id: "preset-form3-remedial",
    name: "Form 3 East — Academic Intervention & Recovery",
    tagline: "High failure rate & remedial tracking",
    form: "Form 3",
    stream: "Form 3 East",
    studentCount: 30,
    meanGrade: "C-",
    meanPoints: 4.85,
    highlight:
      "Significant grade dip in Mathematics and Chemistry with 12 candidates in D and E grade tiers. Tests bulk SMS intervention and parent alerts.",
    category: "Remedial",
    generate: () => {
      const remedialStudents: Student[] = Array.from({ length: 30 }, (_, i) => {
        const id = `rem-${i + 1}`;
        const adm = `29${String(20 + i).padStart(2, "0")}`;
        const names = [
          "Karanja Paul Mwangi",
          "Wanjala Moses Wekesa",
          "Adhiambo Cynthia",
          "Kipkoech Brian",
          "Nekesa Mercy",
          "Murimi Antony",
          "Chepkoech Lilian",
          "Wafula Dennis",
          "Mwangi Kelvin",
          "Akoth Millicent",
          "Koech Collins",
          "Njoki Faith",
          "Ochieng Kennedy",
          "Chepngetich Daisy",
          "Kariuki Francis",
          "Auma Everlyne",
          "Kiprotich Dan",
          "Wambui Mary",
          "Odhiambo Philip",
          "Jeptoo Maureen",
          "Mutiso Justus",
          "Muthoni Jane",
          "Kiptoo Amos",
          "Wanjiru Ann",
          "Barasa Felix",
          "Chebet Sheila",
          "Ndung'u Joseph",
          "Awino Grace",
          "Kipkemoi Eric",
          "Wangari Sarah",
        ];
        return {
          id,
          admNo: adm,
          name: names[i % names.length],
          gender: (i % 2 === 0 ? "M" : "F") as "M" | "F",
          stream: "Form 3 East",
          kcpeMarks: 270 + ((i * 9) % 70),
          subjects: ["MAT", "ENG", "KIS", "BIO", "CHE", "CRE", "HIS", "AGR"],
        };
      });

      const remedialMarks: Record<string, Record<string, number>> = {};
      remedialStudents.forEach((student, idx) => {
        remedialMarks[student.id] = {
          MAT: Math.max(18, 22 + ((idx * 8) % 42)),
          ENG: Math.max(30, 40 + ((idx * 5) % 35)),
          KIS: Math.max(28, 38 + ((idx * 6) % 36)),
          CHE: Math.max(16, 24 + ((idx * 7) % 38)),
          BIO: Math.max(25, 34 + ((idx * 6) % 40)),
          CRE: Math.max(38, 48 + ((idx * 7) % 36)),
          HIS: Math.max(32, 44 + ((idx * 5) % 38)),
          AGR: Math.max(30, 42 + ((idx * 6) % 39)),
        };
      });

      const absents = remedialStudents.slice(0, 8).map((s) => s.id);

      return {
        state: {
          students: remedialStudents,
          marks: remedialMarks,
          uiState: {
            activeStream: "Form 3 East",
            activeExam: "Mid-term Exam, Term 2 2026",
            activeView: "subject-analysis",
            selectedStudentId: "rem-1",
            activeSubTab: "students",
          },
        },
        opsData: {
          feePerTerm: 42000,
          absentStudents: absents,
          payments: remedialStudents.slice(0, 10).map((s, i) => ({
            studentId: s.id,
            amount: 20000,
            method: "M-Pesa",
            ref: `MPESA-REM-${i + 10}`,
          })),
        },
      };
    },
  },
  {
    id: "preset-fee-arrears",
    name: "Form 4 North — High Fee Arrears & Defaulters",
    tagline: "Stress test for fee collection & SMS notices",
    form: "Form 4",
    stream: "Form 4 North",
    studentCount: 35,
    meanGrade: "B-",
    meanPoints: 6.94,
    highlight:
      "Simulates Term 2 fee ledger with KES 850,000+ total arrears. Prepares instant bulk SMS reminder broadcasts and bursar payment records.",
    category: "Finance",
    generate: () => {
      const feeStudents: Student[] = Array.from({ length: 35 }, (_, i) => {
        const id = `fee-${i + 1}`;
        const adm = `44${String(10 + i).padStart(2, "0")}`;
        const names = [
          "Mokua Geoffrey",
          "Kipchirchir Enock",
          "Wanjohi Simon",
          "Chemutai Sharon",
          "Omondi Patrick",
          "Gathoni Priscillah",
          "Kiptalam Noah",
          "Wamalwa Collins",
          "Achieng Beatrice",
          "Kipruto Mathew",
          "Nyambura Caroline",
          "Mutuku Boniface",
          "Jemutai Gladys",
          "Ouma Victor",
          "Kariuki Benson",
          "Chepkorir Jackline",
          "Kipng'etich Ronald",
          "Njeri Damaris",
          "Maina Stephen",
          "Awuor Hellen",
          "Kiprop Edwin",
          "Muthomi Martin",
          "Cherotich Diana",
          "Simiyu Brian",
          "Wangui Elizabeth",
          "Koech Wesley",
          "Akello Judith",
          "Wanyonyi Samuel",
          "Chebet Purity",
          "Kimutai Alex",
          "Mumbi Agnes",
          "Kiprono Dominic",
          "Atieno Linet",
          "Nduta Mercy",
          "Kipkemoi Vincent",
        ];
        return {
          id,
          admNo: adm,
          name: names[i % names.length],
          gender: (i % 2 === 0 ? "M" : "F") as "M" | "F",
          stream: "Form 4 North",
          kcpeMarks: 310 + ((i * 7) % 60),
          subjects: ["MAT", "ENG", "KIS", "BIO", "CHE", "PHY", "GEO", "BST"],
        };
      });

      const feeMarks: Record<string, Record<string, number>> = {};
      feeStudents.forEach((student, idx) => {
        feeMarks[student.id] = {
          MAT: 55 + ((idx * 6) % 35),
          ENG: 62 + ((idx * 4) % 28),
          KIS: 58 + ((idx * 5) % 30),
          CHE: 52 + ((idx * 7) % 36),
          PHY: 54 + ((idx * 6) % 34),
          BIO: 58 + ((idx * 5) % 30),
          GEO: 60 + ((idx * 4) % 30),
          BST: 64 + ((idx * 5) % 26),
        };
      });

      // Payments: 8 fully paid, 12 partial, 15 zero
      const payments = [
        ...feeStudents.slice(0, 8).map((s, i) => ({
          studentId: s.id,
          amount: 45000,
          method: "Bank" as const,
          ref: `BANK-DEP-${200 + i}`,
        })),
        ...feeStudents.slice(8, 20).map((s, i) => ({
          studentId: s.id,
          amount: 15000 + i * 1500,
          method: "M-Pesa" as const,
          ref: `MPESA-PART-${300 + i}`,
        })),
      ];

      return {
        state: {
          students: feeStudents,
          marks: feeMarks,
          uiState: {
            activeStream: "Form 4 North",
            activeExam: "End-term Exam, Term 2 2026",
            activeView: "fees",
            selectedStudentId: "fee-1",
            activeSubTab: "students",
          },
        },
        opsData: {
          feePerTerm: 45000,
          payments,
        },
      };
    },
  },
  {
    id: "preset-form1-clean",
    name: "Form 1 East — Fresh Admissions Baseline",
    tagline: "Clean enrollment roster awaiting marks",
    form: "Form 1",
    stream: "Form 1 East",
    studentCount: 32,
    meanGrade: "—",
    meanPoints: 0,
    highlight:
      "Initial intake with admission numbers and KCPE entry scores ready for Term 1 marks entry. Excellent for testing zero-state and data entry.",
    category: "Admissions",
    generate: () => {
      const f1Students: Student[] = Array.from({ length: 32 }, (_, i) => {
        const id = `f1-${i + 1}`;
        const adm = `51${String(1 + i).padStart(2, "0")}`;
        const names = [
          "Mumo Daniel Musyoka",
          "Chepkemoi Mercy",
          "Oduor Michael Kevin",
          "Njeri Sandra Wairimu",
          "Kiplangat Caleb",
          "Kwamboka Brenda",
          "Wanjiku Brian Njuguna",
          "Nakhumicha Faith",
          "Kiprono Emmanuel",
          "Atieno Joy",
          "Mutua Kelvin",
          "Jeptum Naomy",
          "Kariuki Dennis",
          "Achieng Tracy",
          "Simiyu Abel",
          "Moraa Sharon",
          "Kibet Gideon",
          "Wambui Claire",
          "Onyango Elvis",
          "Chebet Yvonne",
          "Ndung'u Allan",
          "Akoth Irene",
          "Kiptoo Felix",
          "Muthoni Hope",
          "Barasa Bravin",
          "Cherono Daisy",
          "Mwangi Ryan",
          "Awino Joan",
          "Rotich Ian",
          "Wanja Ruth",
          "Kipchumba Seth",
          "Njoki Gloria",
        ];
        return {
          id,
          admNo: adm,
          name: names[i % names.length],
          gender: (i % 2 === 0 ? "M" : "F") as "M" | "F",
          stream: "Form 1 East",
          kcpeMarks: 320 + ((i * 8) % 75),
          subjects: ["MAT", "ENG", "KIS", "BIO", "CHE", "PHY", "GEO", "HIS", "CRE", "BST", "AGR"],
        };
      });

      return {
        state: {
          students: f1Students,
          marks: {}, // completely empty marks ledger
          uiState: {
            activeStream: "Form 1 East",
            activeExam: "End-term Exam, Term 1 2026",
            activeView: "marks-entry",
            selectedStudentId: "f1-1",
            activeSubTab: "students",
          },
        },
        opsData: {
          feePerTerm: 40000,
          payments: f1Students.slice(0, 24).map((s, i) => ({
            studentId: s.id,
            amount: 40000,
            method: "Bank" as const,
            ref: `F1-BANK-${400 + i}`,
          })),
        },
      };
    },
  },
];
