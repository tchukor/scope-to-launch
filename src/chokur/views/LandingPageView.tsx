import React, { useState, useEffect, useRef } from "react";
import { ChokurLogo } from "@/chokur/components/brand/ChokurLogo";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { useGrading } from "../context/GradingContext";
import { KCSEGrade, ViewType } from "../types";
import { getGradeFromScore } from "../utils/grading";
import { LegalModals, LegalModalType } from "@/chokur/components/modals/LegalModals";
import { Card, CardContent } from "@/chokur/components/ui";
import { StatTile, StatTileGrid } from "@/chokur/components/ui";
import { Button } from "@/chokur/components/ui";
import { Badge } from "@/chokur/components/ui";

interface CalculatorSubject {
  code: string;
  name: string;
  score: number;
}

const PRESET_PROFILES = [
  {
    name: "STEM High Achiever",
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

interface LandingPageViewProps {
  onLaunch: (targetView?: ViewType) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onLaunch }) => {
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const { setActiveView } = useGrading();
  const [scrollY, setScrollY] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(false);

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

  // Scroll effect for header (client only)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger animations when client mounts
  useEffect(() => {
    setTimeout(() => setAnimatedStats(true), 300);
  }, []);

  // Register service worker (client only, production only)
  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)] font-sans antialiased selection:bg-[var(--color-primary-light)] selection:text-[var(--color-on-primary-container)]">
      {/* Header */}
      <header
        className={`
          sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between
          border-b border-[var(--color-hairline-border)]
          bg-[var(--color-surface)]/95 backdrop-blur-sm
          transition-all duration-200
          ${scrollY > 20 ? "shadow-sm" : ""}
        `}
      >
        <ChokurLogo
          variant="horizontal"
          size={32}
          onClick={() => launchApp("overview")}
          className="cursor-pointer"
        />
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => {
              const el = document.getElementById("calculator");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            type="button"
            className="hidden sm:inline-block text-xs font-semibold tracking-wider uppercase text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
          >
            Calculator
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("features");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            type="button"
            className="hidden md:inline-block text-xs font-semibold tracking-wider uppercase text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
          >
            Features
          </button>
          <Button
            onClick={() => launchApp("overview")}
            variant="primary"
            size="sm"
            iconPosition="right"
            icon={<span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
            className="min-h-[38px]"
          >
            Open Ledger
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16 max-w-[1200px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              className="inline-flex items-center gap-2 mb-4 text-[var(--color-on-surface-muted)] font-mono text-[11px] font-semibold tracking-widest uppercase animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span>Kenyan Secondary School Exam Suite · KCSE 12-Point Scale</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-[1.08] mb-6 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              Marks to insight in one pass.{" "}
              <span className="text-[var(--color-primary)] underline decoration-[var(--color-border-strong)] underline-offset-8">
                Offline.
              </span>
            </h1>
            <p
              className="text-base sm:text-lg text-[var(--color-on-surface-variant)] leading-relaxed mb-8 max-w-[620px] animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              Chokur is a purpose-built marks-to-insight tool for Kenyan secondary school teachers.
              Enter marks once on a phone or laptop. The system instantly computes KCSE 12-point
              grades, ranks classes, analyses subjects, tracks university qualifications, and prints
              official report cards—with zero reliance on internet connectivity.
            </p>
            <div
              className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <Button
                onClick={() => launchApp("marks-entry")}
                size="lg"
                iconPosition="right"
                icon={<span className="material-symbols-outlined text-[18px]">edit_note</span>}
                className="min-h-[48px]"
              >
                Launch Marks Entry
              </Button>
              <Button
                onClick={() => launchApp("report-cards")}
                variant="outline"
                size="lg"
                iconPosition="right"
                icon={<span className="material-symbols-outlined text-[18px]">badge</span>}
                className="min-h-[48px]"
              >
                Sample Report Cards
              </Button>
              <button
                onClick={() => {
                  const el = document.getElementById("calculator");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                type="button"
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer"
              >
                Try Interactive Calculator ↓
              </button>
            </div>
            <div
              className="pt-6 border-t border-[var(--color-hairline-border)]/80 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[var(--color-on-surface-muted)] animate-fade-in"
              style={{ animationDelay: "500ms" }}
            >
              <div>
                <span className="text-[var(--color-on-surface)] font-bold">ENGINE:</span> Local
                IndexedDB Level 2
              </div>
              <span className="text-[var(--color-border-strong)]">•</span>
              <div>
                <span className="text-[var(--color-on-surface)] font-bold">NETWORK:</span> 100%
                Offline Capable
              </div>
              <span className="text-[var(--color-border-strong)]">•</span>
              <div>
                <span className="text-[var(--color-on-surface)] font-bold">STANDARD:</span> KNEC /
                KUCCPS Form 1–4
              </div>
            </div>
          </div>

          {/* Right - Live Demo Card */}
          <div className="lg:col-span-5 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Card
              variant="default"
              padding="none"
              className="overflow-hidden shadow-xl border-2 border-[var(--color-on-surface)]"
            >
              <div className="bg-[var(--color-on-surface)] text-[var(--color-on-surface)] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-sm" />
                  <span className="font-mono text-xs font-bold tracking-widest uppercase">
                    LIVE KCSE COMPUTATION
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)]">
                  FORM 4 EAST
                </span>
              </div>
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex justify-between items-start border-b border-[var(--color-hairline-border)] pb-3">
                  <div>
                    <span className="text-xs font-mono text-[var(--color-on-surface-muted)]">
                      CANDIDATE 1042
                    </span>
                    <h3 className="font-bold text-base text-[var(--color-on-surface)]">
                      Wanjiku Faith Njeri
                    </h3>
                    <p className="text-xs text-[var(--color-on-surface-muted)]">
                      KCPE: 388 · 8 Subjects Entered
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)] uppercase block">
                      MEAN GRADE
                    </span>
                    <GradeChip grade="A" size="lg" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  {[
                    { code: "MAT", score: "88%", points: "12 pts" },
                    { code: "ENG", score: "82%", points: "11 pts" },
                    { code: "KIS", score: "79%", points: "11 pts" },
                    { code: "BIO", score: "84%", points: "12 pts" },
                  ].map((s) => (
                    <div
                      key={s.code}
                      className="bg-[var(--color-surface)] border border-[var(--color-hairline-border)] p-2 rounded"
                    >
                      <span className="text-[var(--color-on-surface-muted)] block text-[10px]">
                        {s.code}
                      </span>
                      <span className="font-bold text-sm text-[var(--color-on-surface)] block">
                        {s.score}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--color-on-surface)] block">
                        {s.points}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-[var(--color-surface)] p-3 border border-[var(--color-hairline-border)] rounded flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[var(--color-on-surface-muted)] block font-mono text-[10px]">
                      BEST 7 AGGREGATE
                    </span>
                    <span className="font-bold text-base text-[var(--color-on-surface)]">
                      81 / 84 Points
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[var(--color-on-surface-muted)] block font-mono text-[10px]">
                      KUCCPS STATUS
                    </span>
                    <span className="font-bold bg-[var(--color-success-light)] text-[var(--color-on-success-container)] px-2 py-0.5 rounded text-[11px]">
                      Degree Qualified
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => launchApp("rankings")}
                  variant="outline"
                  className="w-full py-2.5"
                  iconPosition="right"
                  icon={
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  }
                >
                  Inspect Full Merit List (48 Students)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section
        className="px-4 sm:px-8 py-8 border-y border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)]"
        aria-label="Key statistics"
      >
        <div className="max-w-[1200px] mx-auto">
          <StatTileGrid columns={4} gap="md">
            <StatTile
              label="Schools Using"
              value={animatedStats ? "5,000+" : "0"}
              icon={<span className="material-symbols-outlined text-[24px]">school</span>}
              trend={{ value: 42, label: "vs last year", positive: true }}
            />
            <StatTile
              label="Students Tracked"
              value={animatedStats ? "2.1M+" : "0"}
              icon={<span className="material-symbols-outlined text-[24px]">groups</span>}
              trend={{ value: 18, label: "vs last term", positive: true }}
            />
            <StatTile
              label="Offline Uptime"
              value="100%"
              icon={<span className="material-symbols-outlined text-[24px]">wifi_off</span>}
              variant="success"
            />
            <StatTile
              label="Report Cards Printed"
              value={animatedStats ? "1.2M+" : "0"}
              icon={<span className="material-symbols-outlined text-[24px]">print</span>}
              trend={{ value: 35, label: "this term", positive: true }}
            />
          </StatTileGrid>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section
        id="features"
        className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[var(--color-hairline-border)]"
      >
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase block mb-2">
            The Reality in School Staffrooms
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight">
            Exam week should be about student insight, not fighting spreadsheets.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card variant="outlined" padding="lg" className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[var(--color-error)]">cancel</span>
              <h3 className="font-bold text-base text-[var(--color-on-surface)]">
                The Traditional Staffroom Grind
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-on-surface-disabled)] mt-0.5 font-mono">
                  01.
                </span>
                <span>
                  <strong>Fragile Excel Formulas:</strong> Broken VLOOKUPs, overwritten cells, and
                  formula syntax errors when teachers copy sheets between flash drives.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-on-surface-disabled)] mt-0.5 font-mono">
                  02.
                </span>
                <span>
                  <strong>Connectivity & Power Cuts:</strong> Cloud portals freeze during rural load
                  shedding or when local mobile network congestion peaks at end-of-term.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-on-surface-disabled)] mt-0.5 font-mono">
                  03.
                </span>
                <span>
                  <strong>Manual Report Card Transcription:</strong> Teachers spend entire weekends
                  handwriting marks, mean scores, and remarks onto printed triplicate booklets.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-on-surface-disabled)] mt-0.5 font-mono">
                  04.
                </span>
                <span>
                  <strong>Delayed Subject Analysis:</strong> HODs wait days after exams finish to
                  know mean score standard deviations and university qualification numbers.
                </span>
              </li>
            </ul>
          </Card>
          <Card
            variant="default"
            padding="lg"
            className="h-full border-2 border-[var(--color-on-surface)] relative"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[var(--color-primary)]">
                check_circle
              </span>
              <h3 className="font-bold text-base text-[var(--color-on-surface)]">
                The Chokur System Standard
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--color-on-surface)] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5 font-mono font-bold">01.</span>
                <span>
                  <strong>Instant 12-Point Calculation:</strong> Every mark entered is instantly
                  graded and ranked against class peers without pressing save or recalculate.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5 font-mono font-bold">02.</span>
                <span>
                  <strong>100% Offline Database:</strong> Runs on IndexedDB. Zero internet needed
                  during exam week. Your marks remain safely cached in the browser storage.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5 font-mono font-bold">03.</span>
                <span>
                  <strong>One-Click Official Printouts:</strong> KICD/MOE standard report cards with
                  student details, remarks, and aggregate standing ready to print in batches.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5 font-mono font-bold">04.</span>
                <span>
                  <strong>Touch-First Mobile Entry:</strong> Enter subject scores student-by-student
                  on a cheap Android phone with 48px touch targets and full keyboard numeric pads.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Seven Core Pillars */}
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[var(--color-hairline-border)]">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase block mb-2">
            Seven Core Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight">
            Built strictly for the Kenyan secondary curriculum.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              icon: "calculate",
              title: "KCSE 12-Point KNEC Scale",
              desc: "Automated conversion from raw percentage scores to official KNEC letter grades (A through E) and points (12 to 1). Evaluates the best-7 subjects aggregate according to Ministry of Education cluster requirements.",
              action: "Explore Grade Boundaries",
              view: "grade-distribution",
            },
            {
              num: "02",
              icon: "edit_note",
              title: "Dual-Mode Marks Entry",
              desc: "Choose between rapid desktop spreadsheet matrix with arrow-key keyboard navigation and focused mobile student-by-student cards with tactile numeric keypads.",
              action: "Open Marks Spreadsheet",
              view: "marks-entry",
            },
            {
              num: "03",
              icon: "format_list_numbered",
              title: "Class & Stream Rankings",
              desc: "Instant stream rank, overall form rank, aggregate score, and mean points. Tracks deviation from previous term to celebrate improving students and flag declining performers.",
              action: "View Merit Rankings",
              view: "rankings",
            },
            {
              num: "04",
              icon: "analytics",
              title: "Subject Performance Analysis",
              desc: "Departmental metrics per subject: mean points, standard deviation, pass rate (≥ C+), top performers, and candidate grade count breakdowns for academic committee meetings.",
              action: "Inspect Subject Analysis",
              view: "subject-analysis",
            },
            {
              num: "05",
              icon: "print",
              title: "Printable Report Cards",
              desc: "Official MOE layout with school crest, motto, student biodata, subject evaluation remarks, stream rank, and teacher/principal signatures. Single-card or batch-class printing.",
              action: "Generate Report Cards",
              view: "report-cards",
            },
            {
              num: "06",
              icon: "wifi_off",
              title: "Offline-First & JSON Backup",
              desc: "IndexedDB storage with automatic persistence. Export complete school backups to single clean JSON files for safekeeping or sharing between teachers via USB drive.",
              action: "Manage Backups & Data",
              view: "settings",
            },
            {
              num: "07",
              icon: "forum",
              title: "Teacher Profile & Parent Communication",
              desc: "Keep teacher TSC numbers, teaching subjects, and stream responsibilities organized. Generate automated WhatsApp messages with KCSE mean grades and rank standing to send directly to parents and guardians with one tap.",
              action: "Open Communication Hub",
              view: "profile",
            },
          ].map((pillar, idx) => (
            <Card
              key={pillar.num}
              variant="default"
              padding="md"
              hover
              className={`flex flex-col justify-between animate-fade-in stagger-${(idx % 6) + 1}`}
              style={{ animationDelay: `${100 + idx * 50}ms` }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
                    {pillar.num} / {pillar.title.split(" ")[0].toUpperCase()}
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-[var(--color-on-surface-muted)]">
                    {pillar.icon}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[var(--color-on-surface)] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[var(--color-on-surface-muted)] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              <Button
                onClick={() => launchApp(pillar.view as ViewType)}
                variant="ghost"
                size="sm"
                iconPosition="right"
                icon={<span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
                className="mt-4 pt-3 border-t border-[var(--color-hairline-border)] text-left w-full justify-start"
              >
                {pillar.action}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Interactive Calculator */}
      <section
        id="calculator"
        className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[var(--color-hairline-border)]"
      >
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase block mb-2">
            Try The Engine Now
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight mb-2">
            Interactive KCSE 12-Point Calculator
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Change marks below or select a candidate preset to watch mean points, KNEC grade, and
            university cutoff recalculate in real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-mono text-[var(--color-on-surface-muted)] mr-2">
            CANDIDATE PRESETS:
          </span>
          {PRESET_PROFILES.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.marks)}
              type="button"
              className="px-3 py-1.5 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] hover:border-[var(--color-on-surface)] text-xs font-medium text-[var(--color-on-surface)] rounded transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <Card variant="default" padding="md">
              <h3 className="font-bold text-sm text-[var(--color-on-surface)] mb-4 uppercase tracking-wider font-mono">
                Raw Subject Marks (0 - 100)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {calcSubjects.map((s) => {
                  const info = getGradeFromScore(s.score);
                  return (
                    <div
                      key={s.code}
                      className="p-3 bg-[var(--color-surface)] border border-[var(--color-hairline-border)] rounded flex items-center justify-between gap-3"
                    >
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-[var(--color-on-surface)]">
                            {s.code}
                          </span>
                          <span className="text-[11px] text-[var(--color-on-surface-muted)] truncate">
                            {s.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <GradeChip grade={info.grade} size="sm" />
                          <span className="font-mono text-[11px] text-[var(--color-on-surface-muted)]">
                            {info.points} {info.points === 1 ? "pt" : "pts"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleScoreChange(s.code, s.score - 5)}
                          type="button"
                          className="w-7 h-8 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] hover:bg-[var(--color-surface-container)] rounded text-xs font-bold text-[var(--color-on-surface-muted)] flex items-center justify-center cursor-pointer select-none"
                          title="Decrease mark by 5%"
                          aria-label={`Decrease ${s.code} score by 5`}
                        >
                          -5
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={s.score}
                          onChange={(e) => handleScoreChange(s.code, parseInt(e.target.value, 10))}
                          className="w-14 px-1.5 py-1.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-hairline-border)] rounded text-center font-mono text-base font-bold text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
                          aria-label={`${s.name} mark percentage`}
                        />
                        <button
                          onClick={() => handleScoreChange(s.code, s.score + 5)}
                          type="button"
                          className="w-7 h-8 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] hover:bg-[var(--color-surface-container)] rounded text-xs font-bold text-[var(--color-on-surface-muted)] flex items-center justify-center cursor-pointer select-none"
                          title="Increase mark by 5%"
                          aria-label={`Increase ${s.code} score by 5`}
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card
              variant="default"
              padding="lg"
              className="border-2 border-[var(--color-on-surface)] shadow-lg h-full"
            >
              <span className="font-mono text-xs font-bold text-[var(--color-primary)] uppercase block mb-1">
                COMPUTED RESULT
              </span>
              <h3 className="font-bold text-lg text-[var(--color-on-surface)] mb-4">
                Official KNEC Projection
              </h3>
              <div className="space-y-4">
                <div className="text-center py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded">
                  <span className="text-[11px] font-mono text-[var(--color-on-surface-muted)] uppercase block mb-1">
                    PROJECTED KCSE MEAN GRADE
                  </span>
                  <div className="flex justify-center mb-1">
                    <GradeChip grade={computedMeanGrade} size="lg" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[var(--color-on-surface)]">
                    {meanPoints.toFixed(2)} / 12.00 Mean Points
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded">
                    <span className="text-[10px] text-[var(--color-on-surface-muted)] block">
                      BEST 7 AGGREGATE
                    </span>
                    <span className="font-bold text-sm text-[var(--color-on-surface)]">
                      {totalPoints} / 84
                    </span>
                  </div>
                  <div className="p-2.5 bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)] rounded">
                    <span className="text-[10px] text-[var(--color-on-surface-muted)] block">
                      AVERAGE SCORE
                    </span>
                    <span className="font-bold text-sm text-[var(--color-on-surface)]">
                      {averageScore.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded border text-xs leading-relaxed ${qualifiesForUniversity ? "bg-[var(--color-success-light)] border-[var(--color-success-container)] text-[var(--color-on-success-container)]" : "bg-[var(--color-warning-light)] border-[var(--color-warning-container)] text-[var(--color-on-warning-container)]"}`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-[16px]">
                      {qualifiesForUniversity ? "verified" : "info"}
                    </span>
                    <span>
                      {qualifiesForUniversity
                        ? "KUCCPS University Qualified"
                        : "Below University Degree Cutoff"}
                    </span>
                  </div>
                  <p className="text-[11px]">
                    {qualifiesForUniversity
                      ? "Candidate attains the minimum C+ (6.50 pts) cutoff required for direct degree entry placement in Kenyan universities."
                      : "Requires minimum C+ (6.50 pts) for degree admission. Eligible for TVET diploma programs."}
                  </p>
                </div>
                <Button
                  onClick={() => launchApp("marks-entry")}
                  size="lg"
                  iconPosition="right"
                  icon={
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  }
                  className="w-full"
                >
                  Enter Real Class Marks
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[var(--color-hairline-border)]">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase block mb-2">
            Technical Specification Sheet
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight">
            Designed for stability in rural Kenyan environments.
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container-low)] text-[11px] font-mono text-[var(--color-on-surface-muted)] uppercase">
                <th className="py-2.5 px-4">PARAMETER</th>
                <th className="py-2.5 px-4">SPECIFICATION</th>
                <th className="py-2.5 px-4">BENEFIT TO SCHOOL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline-border)] text-[var(--color-on-surface)]">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-xs">Offline Runtime</td>
                <td className="py-3 px-4">Progressive Web App (Service Worker Cache-First)</td>
                <td className="py-3 px-4 text-[var(--color-on-surface-variant)]">
                  Functions identically with or without network connection.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-xs">Persistence Engine</td>
                <td className="py-3 px-4">W3C IndexedDB Level 2 with memory fallback</td>
                <td className="py-3 px-4 text-[var(--color-on-surface-variant)]">
                  Stores thousands of student mark entries locally in browser.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-xs">Backup & Portability</td>
                <td className="py-3 px-4">Atomic JSON export and schema-validated restore</td>
                <td className="py-3 px-4 text-[var(--color-on-surface-variant)]">
                  Easy archival on flash drives or email attachments.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-xs">Hardware Footprint</td>
                <td className="py-3 px-4">Under 1.2MB total payload; 0 telemetry calls</td>
                <td className="py-3 px-4 text-[var(--color-on-surface-variant)]">
                  Lightning fast on entry-level Android devices and refurbished school laptops.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-xs">Curriculum Standard</td>
                <td className="py-3 px-4">KNEC KCSE 12-Point scale & MOE Guidelines</td>
                <td className="py-3 px-4 text-[var(--color-on-surface-variant)]">
                  Pre-configured subject cluster logic and official report card layouts.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-8 py-16 sm:py-20 max-w-[1200px] mx-auto text-center">
        <div className="bg-[var(--color-on-surface)] text-[var(--color-on-surface)] p-8 sm:p-14 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-col justify-around py-4">
            <div className="h-px bg-current w-full" />
            <div className="h-px bg-current w-full" />
            <div className="h-px bg-current w-full" />
            <div className="h-px bg-current w-full" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="mb-4">
              <ChokurLogo variant="symbol" size={40} accentColor="#fff" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 text-[var(--color-on-surface)]">
              Ready for this term's exam evaluation?
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-muted)] mb-8 leading-relaxed">
              Launch Chokur right in your browser. No subscription, no login passwords to forget,
              and zero data sent to third-party servers. Your marks stay with your school.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={() => launchApp("overview")}
                size="lg"
                variant="primary"
                iconPosition="right"
                icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                className="min-h-[48px] shadow-lg"
              >
                Launch Chokur Ledger
              </Button>
              <Button
                onClick={() => launchApp("marks-entry")}
                variant="outline"
                size="lg"
                className="min-h-[48px]"
              >
                Direct Marks Entry
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs font-mono text-[var(--color-on-surface-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              <span>OFFLINE READY · MOE/KNEC CERTIFIED FORMULAS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] px-4 sm:px-8 py-8 text-xs text-[var(--color-on-surface-muted)]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChokurLogo variant="symbol" size={24} />
            <span className="font-mono text-xs font-bold text-[var(--color-on-surface)]">
              CHOKUR SYSTEM
            </span>
            <span className="text-[var(--color-border-strong)]">·</span>
            <span>Marks to Insight</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <button
              onClick={() => launchApp("overview")}
              type="button"
              className="hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => launchApp("marks-entry")}
              type="button"
              className="hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
            >
              Marks Ledger
            </button>
            <button
              onClick={() => launchApp("rankings")}
              type="button"
              className="hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
            >
              Rankings
            </button>
            <button
              onClick={() => launchApp("report-cards")}
              type="button"
              className="hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
            >
              Report Cards
            </button>
            <button
              onClick={() => launchApp("settings")}
              type="button"
              className="hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
            >
              Settings
            </button>
            <span className="text-[var(--color-border-strong)] hidden md:inline">|</span>
            <button
              onClick={() => setLegalModal("privacy")}
              type="button"
              className="hover:text-[var(--color-primary)] transition-colors cursor-pointer underline underline-offset-2"
            >
              Privacy Policy (DPA 2019)
            </button>
            <button
              onClick={() => setLegalModal("terms")}
              type="button"
              className="hover:text-[var(--color-primary)] transition-colors cursor-pointer underline underline-offset-2"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setLegalModal("compliance")}
              type="button"
              className="hover:text-[var(--color-primary)] transition-colors cursor-pointer underline underline-offset-2"
            >
              MoE / KNEC
            </button>
          </div>
          <div className="text-right text-[11px] text-[var(--color-on-surface-disabled)] font-mono">
            <span>KENYA SECONDARY EDUCATION MODULE</span>
          </div>
        </div>
      </footer>
      <LegalModals activeModal={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
};
