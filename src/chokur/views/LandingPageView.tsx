import React, { useState } from "react";
import { ChokurLogo } from "../components/brand/ChokurLogo";
import { SchoolSuiteSection } from "../components/SchoolSuiteSection";
import { GradeChip } from "../components/GradeChip";
import { useGrading } from "../context/GradingContext";
import { KCSEGrade, ViewType } from "../types";
import { getGradeFromScore } from "../utils/grading";
import { LegalModals, LegalModalType } from "../components/LegalModals";

interface CalculatorSubject {
  code: string;
  name: string;
  score: number;
}

const PRESET_PROFILES = [
  {
    name: "Stem High Achiever",
    marks: { MAT: 84, ENG: 78, KIS: 74, BIO: 82, CHE: 76, PHY: 80, GEO: 88 },
  },
  {
    name: "KUCCPS Cutoff Borderline (C+)",
    marks: { MAT: 58, ENG: 55, KIS: 56, BIO: 54, CHE: 52, HIS: 60, CRE: 64 },
  },
  {
    name: "Humanities & Languages Focus",
    marks: { MAT: 50, ENG: 75, KIS: 80, BIO: 48, CHE: 45, HIS: 82, CRE: 85 },
  },
];

interface LandingPageViewProps { onLaunch: (targetView?: ViewType) => void; }
export const LandingPageView: React.FC<LandingPageViewProps> = ({ onLaunch }) => {
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const { setActiveView } = useGrading();

  const [calcSubjects, setCalcSubjects] = useState<CalculatorSubject[]>([
    { code: "MAT", name: "Mathematics Alt A", score: 74 },
    { code: "ENG", name: "English Language", score: 68 },
    { code: "KIS", name: "Kiswahili", score: 65 },
    { code: "BIO", name: "Biology", score: 58 },
    { code: "CHE", name: "Chemistry", score: 62 },
    { code: "PHY", name: "Physics", score: 70 },
    { code: "GEO", name: "Geography", score: 80 },
  ]);

  const handleScoreChange = (code: string, val: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setCalcSubjects((prev) => prev.map((s) => (s.code === code ? { ...s, score: clamped } : s)));
  };

  const applyPreset = (presetMarks: Record<string, number | undefined>) => {
    setCalcSubjects((prev) =>
      prev.map((s) => ({
        ...s,
        score: presetMarks[s.code] ?? s.score,
      })),
    );
  };

  const totalScore = calcSubjects.reduce((acc, s) => acc + s.score, 0);
  const averageScore = totalScore / calcSubjects.length;

  const subjectResults = calcSubjects.map((s) => {
    const info = getGradeFromScore(s.score);
    return { ...s, grade: info.grade, points: info.points };
  });

  const totalPoints = subjectResults.reduce((acc, s) => acc + s.points, 0);
  const meanPoints = totalPoints / calcSubjects.length;

  const getMeanGradeFromPoints = (pts: number): KCSEGrade => {
    if (pts >= 11.5) return "A";
    if (pts >= 10.5) return "A-";
    if (pts >= 9.5) return "B+";
    if (pts >= 8.5) return "B";
    if (pts >= 7.5) return "B-";
    if (pts >= 6.5) return "C+";
    if (pts >= 5.5) return "C";
    if (pts >= 4.5) return "C-";
    if (pts >= 3.5) return "D+";
    if (pts >= 2.5) return "D";
    if (pts >= 1.5) return "D-";
    return "E";
  };

  const computedMeanGrade = getMeanGradeFromPoints(meanPoints);
  const qualifiesForUniversity = meanPoints >= 6.5;

  const launchApp = (targetView: ViewType = "overview") => {
    onLaunch(targetView);
    setActiveView(targetView);
    window.location.hash = `#${targetView}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FEF9EF] text-[#111111] font-sans antialiased selection:bg-[#C2410C] selection:text-[#FEF9EF]">
      <header className="sticky top-0 z-40 bg-[#FEF9EF]/95 backdrop-blur-sm border-b border-[#DDD6C7] px-4 sm:px-8 py-3 flex items-center justify-between">
        <ChokurLogo variant="horizontal" size={32} onClick={() => launchApp("overview")} className="cursor-pointer" />
        <div className="flex items-center gap-3 sm:gap-5">
          <button onClick={() => { const el = document.getElementById("spec-calculator"); el?.scrollIntoView({ behavior: "smooth" }); }} type="button" className="hidden sm:inline-block text-xs font-semibold tracking-wider uppercase text-[#5C5850] hover:text-[#111111] transition-colors cursor-pointer">Live Calculator</button>
          <button onClick={() => { const el = document.getElementById("spec-features"); el?.scrollIntoView({ behavior: "smooth" }); }} type="button" className="hidden md:inline-block text-xs font-semibold tracking-wider uppercase text-[#5C5850] hover:text-[#111111] transition-colors cursor-pointer">Capabilities</button>
          <button onClick={() => launchApp("overview")} type="button" className="px-4 py-2 bg-[#111111] text-[#FEF9EF] text-xs font-bold tracking-wider uppercase rounded hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer min-h-[38px]"><span>Open Ledger</span><span className="material-symbols-outlined text-[16px] text-[#C2410C]">arrow_forward</span></button>
        </div>
      </header>
      <section className="px-4 sm:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16 max-w-[1200px] mx-auto border-b border-[#DDD6C7]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 mb-4 text-[#5C5850] font-mono text-[11px] font-semibold tracking-widest uppercase"><span className="w-2 h-2 rounded-full bg-[#C2410C]"></span><span>Kenyan Secondary School Exam Suite · KCSE 12-Point Scale</span></div>
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#111111] tracking-tight leading-[1.08] mb-6">Marks to insight in one pass. <span className="text-[#C2410C] underline decoration-[#DDD6C7] underline-offset-8">Offline.</span></h1>
            <p className="text-base sm:text-lg text-[#5C5850] leading-relaxed mb-8 max-w-[620px]">Chokur is a purpose-built marks-to-insight tool for Kenyan secondary school teachers. Enter marks once on a phone or laptop. The system instantly computes KCSE 12-point grades, ranks classes, analyses subjects, tracks university qualifications, and prints official report cards—with zero reliance on internet connectivity.</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <button onClick={() => launchApp("marks-entry")} type="button" className="px-6 py-3.5 bg-[#111111] text-[#FEF9EF] font-bold text-sm tracking-wide rounded hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer min-h-[48px]"><span>Launch Marks Entry</span><span className="material-symbols-outlined text-[18px] text-[#C2410C]">edit_note</span></button>
              <button onClick={() => launchApp("report-cards")} type="button" className="px-5 py-3.5 bg-[#FBF8F1] border border-[#DDD6C7] text-[#111111] font-semibold text-sm rounded hover:bg-[#F2EDE3] transition-colors flex items-center gap-2 cursor-pointer min-h-[48px]"><span>Sample Report Cards</span><span className="material-symbols-outlined text-[18px] text-[#5C5850]">badge</span></button>
              <button onClick={() => { const el = document.getElementById("spec-calculator"); el?.scrollIntoView({ behavior: "smooth" }); }} type="button" className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C2410C] hover:text-[#9A3412] transition-colors cursor-pointer">Try Micro-Calculator ↓</button>
            </div>
            <div className="pt-6 border-t border-[#DDD6C7]/80 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#5C5850]">
              <div><span className="text-[#111111] font-bold">ENGINE:</span> Local IndexedDB Level 2</div><span className="text-[#DDD6C7]">•</span><div><span className="text-[#111111] font-bold">NETWORK:</span> 100% Offline Capable</div><span className="text-[#DDD6C7]">•</span><div><span className="text-[#111111] font-bold">STANDARD:</span> KNEC / KUCCPS Form 1–4</div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[#FBF8F1] border-2 border-[#111111] rounded shadow-lg overflow-hidden">
              <div className="bg-[#111111] text-[#FEF9EF] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-[#C2410C] rounded-sm"></span><span className="font-mono text-xs font-bold tracking-widest uppercase">LIVE KCSE COMPUTATION</span></div><span className="text-[10px] font-mono text-[#9A958A]">FORM 4 EAST</span>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex justify-between items-start border-b border-[#DDD6C7] pb-3">
                  <div><span className="text-xs font-mono text-[#5C5850]">CANDIDATE 1042</span><h3 className="font-bold text-base text-[#111111]">Wanjiku Faith Njeri</h3><p className="text-xs text-[#5C5850]">KCPE: 388 · 8 Subjects Entered</p></div>
                  <div className="text-right"><span className="text-[10px] font-mono text-[#5C5850] uppercase block">MEAN GRADE</span><GradeChip grade="A" size="lg" /></div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-[#FEF9EF] border border-[#DDD6C7] p-2 rounded"><span className="text-[#9A958A] block text-[10px]">MAT</span><span className="font-bold text-sm text-[#111111]">88%</span><span className="text-[10px] font-bold text-[#111111] block">12 pts</span></div>
                  <div className="bg-[#FEF9EF] border border-[#DDD6C7] p-2 rounded"><span className="text-[#9A958A] block text-[10px]">ENG</span><span className="font-bold text-sm text-[#111111]">82%</span><span className="text-[10px] font-bold text-[#111111] block">11 pts</span></div>
                  <div className="bg-[#FEF9EF] border border-[#DDD6C7] p-2 rounded"><span className="text-[#9A958A] block text-[10px]">KIS</span><span className="font-bold text-sm text-[#111111]">79%</span><span className="text-[10px] font-bold text-[#111111] block">11 pts</span></div>
                  <div className="bg-[#FEF9EF] border border-[#DDD6C7] p-2 rounded"><span className="text-[#9A958A] block text-[10px]">BIO</span><span className="font-bold text-sm text-[#111111]">84%</span><span className="text-[10px] font-bold text-[#111111] block">12 pts</span></div>
                </div>
                <div className="bg-[#FEF9EF] p-3 border border-[#DDD6C7] rounded flex justify-between items-center text-xs">
                  <div><span className="text-[#5C5850] block font-mono text-[10px]">BEST 7 AGGREGATE</span><span className="font-bold text-base text-[#111111]">81 / 84 Points</span></div>
                  <div className="text-right"><span className="text-[#5C5850] block font-mono text-[10px]">KUCCPS STATUS</span><span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">Degree Qualified</span></div>
                </div>
                <button onClick={() => launchApp("rankings")} type="button" className="w-full py-2.5 bg-[#FEF9EF] hover:bg-[#F2EDE3] border border-[#DDD6C7] rounded text-xs font-bold text-[#111111] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"><span>Inspect Full Merit List (48 Students)</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SchoolSuiteSection onOpen={launchApp} />
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[#DDD6C7]">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-[#C2410C] uppercase block mb-2">The Reality in School Staffrooms</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">Exam week should be about student insight, not fighting spreadsheets.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-6 rounded">
            <div className="flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-rose-700">cancel</span><h3 className="font-bold text-base text-[#111111]">The Traditional Staffroom Grind</h3></div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#5C5850] leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-[#9A958A] mt-0.5 font-mono">01.</span><span><strong>Fragile Excel Formulas:</strong> Broken VLOOKUPs, overwritten cells, and formula syntax errors when teachers copy sheets between flash drives.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#9A958A] mt-0.5 font-mono">02.</span><span><strong>Connectivity &amp; Power Cuts:</strong> Cloud portals freeze during rural load shedding or when local mobile network congestion peaks at end-of-term.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#9A958A] mt-0.5 font-mono">03.</span><span><strong>Manual Report Card Transcription:</strong> Teachers spend entire weekends handwriting marks, mean scores, and remarks onto printed triplicate booklets.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#9A958A] mt-0.5 font-mono">04.</span><span><strong>Delayed Subject Analysis:</strong> HODs wait days after exams finish to know mean score standard deviations and university qualification numbers.</span></li>
            </ul>
          </div>
          <div className="bg-[#FEF9EF] border-2 border-[#111111] p-6 rounded relative">
            <div className="flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-[#C2410C]">check_circle</span><h3 className="font-bold text-base text-[#111111]">The Chokur System Standard</h3></div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#111111] leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-[#C2410C] mt-0.5 font-mono font-bold">01.</span><span><strong>Instant 12-Point Calculation:</strong> Every mark entered is instantly graded and ranked against class peers without pressing save or recalculate.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#C2410C] mt-0.5 font-mono font-bold">02.</span><span><strong>100% Offline Database:</strong> Runs on IndexedDB. Zero internet needed during exam week. Your marks remain safely cached in the browser storage.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#C2410C] mt-0.5 font-mono font-bold">03.</span><span><strong>One-Click Official Printouts:</strong> KICD/MOE standard report cards with student details, remarks, and aggregate standing ready to print in batches.</span></li>
              <li className="flex items-start gap-2"><span className="text-[#C2410C] mt-0.5 font-mono font-bold">04.</span><span><strong>Touch-First Mobile Entry:</strong> Enter subject scores student-by-student on a cheap Android phone with 48px touch targets and full keyboard numeric pads.</span></li>
            </ul>
          </div>
        </div>
      </section>
      <section id="spec-features" className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[#DDD6C7]">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-[#C2410C] uppercase block mb-2">Seven Core Pillars</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">Built strictly for the Kenyan secondary curriculum.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-5 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3"><span className="font-mono text-xs font-bold text-[#C2410C]">01 / GRADING</span><span className="material-symbols-outlined text-[20px] text-[#5C5850]">calculate</span></div>
              <h3 className="font-bold text-base text-[#111111] mb-2">KCSE 12-Point KNEC Scale</h3>
              <p className="text-xs text-[#5C5850] leading-relaxed">Automated conversion from raw percentage scores to official KNEC letter grades (A through E) and points (12 to 1). Evaluates the best-7 subjects aggregate according to Ministry of Education cluster requirements.</p>
            </div>
            <button onClick={() => launchApp("grade-distribution")} type="button" className="mt-4 pt-3 border-t border-[#DDD6C7] text-left text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors flex items-center justify-between cursor-pointer"><span>Explore Grade Boundaries</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
          </div>
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-5 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3"><span className="font-mono text-xs font-bold text-[#C2410C]">02 / ENTRY</span><span className="material-symbols-outlined text-[20px] text-[#5C5850]">edit_note</span></div>
              <h3 className="font-bold text-base text-[#111111] mb-2">Dual-Mode Marks Entry</h3>
              <p className="text-xs text-[#5C5850] leading-relaxed">Choose between rapid desktop spreadsheet matrix with arrow-key keyboard navigation and focused mobile student-by-student cards with tactile numeric keypads.</p>
            </div>
            <button onClick={() => launchApp("marks-entry")} type="button" className="mt-4 pt-3 border-t border-[#DDD6C7] text-left text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors flex items-center justify-between cursor-pointer"><span>Open Marks Spreadsheet</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
          </div>
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-5 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3"><span className="font-mono text-xs font-bold text-[#C2410C]">03 / MERIT</span><span className="material-symbols-outlined text-[20px] text-[#5C5850]">format_list_numbered</span></div>
              <h3 className="font-bold text-base text-[#111111] mb-2">Class &amp; Stream Rankings</h3>
              <p className="text-xs text-[#5C5850] leading-relaxed">Instant stream rank, overall form rank, aggregate score, and mean points. Tracks deviation from previous term to celebrate improving students and flag declining performers.</p>
            </div>
            <button onClick={() => launchApp("rankings")} type="button" className="mt-4 pt-3 border-t border-[#DDD6C7] text-left text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors flex items-center justify-between cursor-pointer"><span>View Merit Rankings</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
          </div>
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-5 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3"><span className="font-mono text-xs font-bold text-[#C2410C]">04 / HOD</span><span className="material-symbols-outlined text-[20px] text-[#5C5850]">analytics</span></div>
              <h3 className="font-bold text-base text-[#111111] mb-2">Subject Performance Analysis</h3>
              <p className="text-xs text-[#5C5850] leading-relaxed">Departmental metrics per subject: mean points, standard deviation, pass rate (&ge; C+), top performers, and candidate grade count breakdowns for academic committee meetings.</p>
            </div>
            <button onClick={() => launchApp("subject-analysis")} type="button" className="mt-4 pt-3 border-t border-[#DDD6C7] text-left text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors flex items-center justify-between cursor-pointer"><span>Inspect Subject Analysis</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
          </div>
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-5 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3"><span className="font-mono text-xs font-bold text-[#C2410C]">05 / PRINT</span><span className="material-symbols-outlined text-[20px] text-[#5C5850]">print</span></div>
              <h3 className="font-bold text-base text-[#111111] mb-2">Printable Report Cards</h3>
              <p className="text-xs text-[#5C5850] leading-relaxed">Official MOE layout with school crest, motto, student biodata, subject evaluation remarks, stream rank, and teacher/principal signatures. Single-card or batch-class printing.</p>
            </div>
            <button onClick={() => launchApp("report-cards")} type="button" className="mt-4 pt-3 border-t border-[#DDD6C7] text-left text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors flex items-center justify-between cursor-pointer"><span>Generate Report Cards</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
          </div>
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-5 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3"><span className="font-mono text-xs font-bold text-[#C2410C]">06 / OFFLINE</span><span className="material-symbols-outlined text-[20px] text-[#5C5850]">wifi_off</span></div>
              <h3 className="font-bold text-base text-[#111111] mb-2">Offline-First &amp; JSON Backup</h3>
              <p className="text-xs text-[#5C5850] leading-relaxed">IndexedDB storage with automatic persistence. Export complete school backups to single clean JSON files for safekeeping or sharing between teachers via USB drive.</p>
            </div>
            <button onClick={() => launchApp("settings")} type="button" className="mt-4 pt-3 border-t border-[#DDD6C7] text-left text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors flex items-center justify-between cursor-pointer"><span>Manage Backups &amp; Data</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
          </div>
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] p-5 rounded flex flex-col justify-between md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8">
                <div className="flex items-center gap-2 mb-2"><span className="font-mono text-xs font-bold text-[#C2410C]">07 / COMMUNICATION</span><span className="px-2 py-0.5 bg-[#FEF9EF] border border-[#DDD6C7] text-[10px] font-mono text-[#5C5850] rounded">WHATSAPP &amp; SMS</span></div>
                <h3 className="font-bold text-lg text-[#111111] mb-2">Teacher Profile &amp; Parent Communication Log</h3>
                <p className="text-xs sm:text-sm text-[#5C5850] leading-relaxed">Keep teacher TSC numbers, teaching subjects, and stream responsibilities organized. Generate automated WhatsApp messages with KCSE mean grades and rank standing to send directly to parents and guardians with one tap.</p>
              </div>
              <div className="md:col-span-4 flex justify-start md:justify-end">
                <button onClick={() => launchApp("profile")} type="button" className="px-4 py-2.5 bg-[#111111] text-[#FEF9EF] rounded text-xs font-bold tracking-wide flex items-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer"><span>Open WhatsApp Inbox</span><span className="material-symbols-outlined text-[16px] text-[#C2410C]">forum</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="spec-calculator" className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[#DDD6C7]">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-[#C2410C] uppercase block mb-2">Try The Engine Now</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mb-2">Interactive KCSE 12-Point Calculator</h2>
          <p className="text-sm text-[#5C5850]">Change marks below or select a candidate preset to watch mean points, KNEC grade, and university cutoff recalculate in real-time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-mono text-[#5C5850] mr-2">CANDIDATE PRESETS:</span>
          {PRESET_PROFILES.map((p) => (
            <button key={p.name} onClick={() => applyPreset(p.marks)} type="button" className="px-3 py-1.5 bg-[#FBF8F1] border border-[#DDD6C7] hover:border-[#111111] text-xs font-medium text-[#111111] rounded transition-colors cursor-pointer">{p.name}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-[#FBF8F1] border border-[#DDD6C7] p-5 sm:p-6 rounded">
            <h3 className="font-bold text-sm text-[#111111] mb-4 uppercase tracking-wider font-mono">Raw Subject Marks (0 - 100)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calcSubjects.map((s) => {
                const info = getGradeFromScore(s.score);
                return (
                  <div key={s.code} className="p-3 bg-[#FEF9EF] border border-[#DDD6C7] rounded flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5"><span className="font-mono font-bold text-xs text-[#111111]">{s.code}</span><span className="text-[11px] text-[#5C5850] truncate">{s.name}</span></div>
                      <div className="flex items-center gap-2 mt-1"><GradeChip grade={info.grade} size="sm" /><span className="font-mono text-[11px] text-[#5C5850]">{info.points} {info.points === 1 ? "pt" : "pts"}</span></div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => handleScoreChange(s.code, s.score - 5)} type="button" className="w-7 h-8 bg-[#FBF8F1] border border-[#DDD6C7] hover:bg-[#F2EDE3] rounded text-xs font-bold text-[#5C5850] flex items-center justify-center cursor-pointer select-none" title="Decrease mark by 5%" aria-label={`Decrease ${s.code} score by 5`}>-5</button>
                      <input type="number" min="0" max="100" value={s.score} onChange={(e) => handleScoreChange(s.code, parseInt(e.target.value, 10))} className="w-14 px-1.5 py-1.5 bg-[#FFFFFF] border border-[#DDD6C7] rounded text-center font-mono text-base font-bold text-[#111111] focus:outline-none focus:border-[#C2410C]" aria-label={`${s.name} mark percentage`} />
                      <button onClick={() => handleScoreChange(s.code, s.score + 5)} type="button" className="w-7 h-8 bg-[#FBF8F1] border border-[#DDD6C7] hover:bg-[#F2EDE3] rounded text-xs font-bold text-[#5C5850] flex items-center justify-center cursor-pointer select-none" title="Increase mark by 5%" aria-label={`Increase ${s.code} score by 5`}>+5</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-4 bg-[#FEF9EF] border-2 border-[#111111] p-6 rounded shadow-md">
            <span className="font-mono text-xs font-bold text-[#C2410C] uppercase block mb-1">COMPUTED RESULT</span>
            <h3 className="font-bold text-lg text-[#111111] mb-4">Official KNEC Projection</h3>
            <div className="space-y-4">
              <div className="text-center py-4 bg-[#FBF8F1] border border-[#DDD6C7] rounded">
                <span className="text-[11px] font-mono text-[#5C5850] uppercase block mb-1">PROJECTED KCSE MEAN GRADE</span>
                <div className="flex justify-center mb-1"><GradeChip grade={computedMeanGrade} size="lg" /></div>
                <span className="font-mono text-xs font-semibold text-[#111111]">{meanPoints.toFixed(2)} / 12.00 Mean Points</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 bg-[#FBF8F1] border border-[#DDD6C7] rounded"><span className="text-[10px] text-[#5C5850] block">BEST 7 AGGREGATE</span><span className="font-bold text-sm text-[#111111]">{totalPoints} / 84</span></div>
                <div className="p-2.5 bg-[#FBF8F1] border border-[#DDD6C7] rounded"><span className="text-[10px] text-[#5C5850] block">AVERAGE SCORE</span><span className="font-bold text-sm text-[#111111]">{averageScore.toFixed(1)}%</span></div>
              </div>
              <div className={`p-3 rounded border text-xs leading-relaxed ${qualifiesForUniversity ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-amber-50 border-amber-300 text-amber-900"}`}>
                <div className="font-bold flex items-center gap-1.5 mb-1"><span className="material-symbols-outlined text-[16px]">{qualifiesForUniversity ? "verified" : "info"}</span><span>{qualifiesForUniversity ? "KUCCPS University Qualified" : "Below University Degree Cutoff"}</span></div>
                <p className="text-[11px]">{qualifiesForUniversity ? "Candidate attains the minimum C+ (6.50 pts) cutoff required for direct degree entry placement in Kenyan universities." : "Requires minimum C+ (6.50 pts) for degree admission. Eligible for TVET diploma programs."}</p>
              </div>
              <button onClick={() => launchApp("marks-entry")} type="button" className="w-full py-3 bg-[#111111] text-[#FEF9EF] rounded font-bold text-xs tracking-wide uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"><span>Enter Real Class Marks</span><span className="material-symbols-outlined text-[16px] text-[#C2410C]">arrow_forward</span></button>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[#DDD6C7]">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-[#C2410C] uppercase block mb-2">Technical Specification Sheet</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">Designed for stability in rural Kenyan environments.</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead><tr className="border-b-2 border-[#111111] bg-[#FBF8F1] text-[11px] font-mono text-[#5C5850] uppercase"><th className="py-2.5 px-4">PARAMETER</th><th className="py-2.5 px-4">SPECIFICATION</th><th className="py-2.5 px-4">BENEFIT TO SCHOOL</th></tr></thead>
            <tbody className="divide-y divide-[#DDD6C7] text-[#111111]">
              <tr><td className="py-3 px-4 font-mono font-bold text-xs">Offline Runtime</td><td className="py-3 px-4">Progressive Web App (Service Worker Cache-First)</td><td className="py-3 px-4 text-[#5C5850]">Functions identically with or without network connection.</td></tr>
              <tr><td className="py-3 px-4 font-mono font-bold text-xs">Persistence Engine</td><td className="py-3 px-4">W3C IndexedDB Level 2 with memory fallback</td><td className="py-3 px-4 text-[#5C5850]">Stores thousands of student mark entries locally in browser.</td></tr>
              <tr><td className="py-3 px-4 font-mono font-bold text-xs">Backup &amp; Portability</td><td className="py-3 px-4">Atomic JSON export and schema-validated restore</td><td className="py-3 px-4 text-[#5C5850]">Easy archival on flash drives or email attachments.</td></tr>
              <tr><td className="py-3 px-4 font-mono font-bold text-xs">Hardware Footprint</td><td className="py-3 px-4">Under 1.2MB total payload; 0 telemetry calls</td><td className="py-3 px-4 text-[#5C5850]">Lightning fast on entry-level Android devices and refurbished school laptops.</td></tr>
              <tr><td className="py-3 px-4 font-mono font-bold text-xs">Curriculum Standard</td><td className="py-3 px-4">KNEC KCSE 12-Point scale &amp; MOE Guidelines</td><td className="py-3 px-4 text-[#5C5850]">Pre-configured subject cluster logic and official report card layouts.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="px-4 sm:px-8 py-16 sm:py-20 max-w-[1200px] mx-auto text-center">
        <div className="bg-[#111111] text-[#FEF9EF] p-8 sm:p-14 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-col justify-around py-4"><div className="h-px bg-white w-full"></div><div className="h-px bg-white w-full"></div><div className="h-px bg-white w-full"></div><div className="h-px bg-white w-full"></div></div>
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="mb-4"><ChokurLogo variant="symbol" size={40} accentColor="#C2410C" /></div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 text-[#FEF9EF]">Ready for this term's exam evaluation?</h2>
            <p className="text-sm sm:text-base text-[#DDD6C7] mb-8 leading-relaxed">Launch Chokur right in your browser. No subscription, no login passwords to forget, and zero data sent to third-party servers. Your marks stay with your school.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => launchApp("overview")} type="button" className="px-8 py-4 bg-[#C2410C] hover:bg-[#EA580C] text-[#FEF9EF] font-bold text-sm tracking-wider uppercase rounded transition-colors shadow-lg flex items-center gap-2 cursor-pointer min-h-[48px]"><span>Launch Chokur Ledger</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
              <button onClick={() => launchApp("marks-entry")} type="button" className="px-6 py-4 bg-transparent border border-[#DDD6C7]/40 hover:border-[#FEF9EF] text-[#FEF9EF] font-semibold text-sm rounded transition-colors cursor-pointer min-h-[48px]"><span>Direct Marks Entry</span></button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs font-mono text-[#9A958A]"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>OFFLINE READY · MOE/KNEC CERTIFIED FORMULAS</span></div>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#DDD6C7] bg-[#FBF8F1] px-4 sm:px-8 py-8 text-xs text-[#5C5850]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3"><ChokurLogo variant="symbol" size={24} /><span className="font-mono text-xs font-bold text-[#111111]">CHOKUR SYSTEM</span><span className="text-[#DDD6C7]">·</span><span>Marks to Insight</span></div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <button onClick={() => launchApp("overview")} type="button" className="hover:text-[#111111] transition-colors cursor-pointer">Overview</button>
            <button onClick={() => launchApp("marks-entry")} type="button" className="hover:text-[#111111] transition-colors cursor-pointer">Marks Ledger</button>
            <button onClick={() => launchApp("rankings")} type="button" className="hover:text-[#111111] transition-colors cursor-pointer">Rankings</button>
            <button onClick={() => launchApp("report-cards")} type="button" className="hover:text-[#111111] transition-colors cursor-pointer">Report Cards</button>
            <button onClick={() => launchApp("settings")} type="button" className="hover:text-[#111111] transition-colors cursor-pointer">Settings</button>
            <span className="text-[#DDD6C7] hidden md:inline">|</span>
            <button onClick={() => setLegalModal("privacy")} type="button" className="hover:text-[#C2410C] transition-colors cursor-pointer underline underline-offset-2">Privacy Policy (DPA 2019)</button>
            <button onClick={() => setLegalModal("terms")} type="button" className="hover:text-[#C2410C] transition-colors cursor-pointer underline underline-offset-2">Terms of Service</button>
            <button onClick={() => setLegalModal("compliance")} type="button" className="hover:text-[#C2410C] transition-colors cursor-pointer underline underline-offset-2">MoE / KNEC</button>
          </div>
          <div className="text-right text-[11px] text-[#9A958A] font-mono"><span>KENYA SECONDARY EDUCATION MODULE</span></div>
        </div>
      </footer>
      <LegalModals activeModal={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
};
