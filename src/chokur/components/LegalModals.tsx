import React, { useState } from "react";
import { ChokurLogo } from "./brand/ChokurLogo";

export type LegalModalType = "privacy" | "terms" | "compliance" | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "compliance">(
    activeModal || "privacy",
  );

  React.useEffect(() => {
    if (activeModal) {
      setActiveTab(activeModal);
    }
  }, [activeModal]);

  if (!activeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FEF9EF] border-2 border-[#111111] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#111111]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#FBF8F1] border-b border-[#DDD6C7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ChokurLogo variant="symbol" size={26} />
            <div>
              <h2
                id="legal-modal-title"
                className="font-headline-md text-base sm:text-lg font-bold text-[#111111] leading-tight"
              >
                Chokur Legal &amp; Compliance Center
              </h2>
              <p className="text-xs text-[#5F5E5E]">
                Kenyan Secondary School Basic Education &amp; Data Protection Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close dialog"
            className="p-1.5 rounded hover:bg-[#F2EDE3] text-[#5F5E5E] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 bg-[#FBF8F1] border-b border-[#DDD6C7] flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "privacy"
                ? "border-[#C2410C] text-[#C2410C]"
                : "border-transparent text-[#5F5E5E] hover:text-[#111111]"
            }`}
          >
            Privacy Policy (DPA 2019)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "terms"
                ? "border-[#C2410C] text-[#C2410C]"
                : "border-transparent text-[#5F5E5E] hover:text-[#111111]"
            }`}
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("compliance")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "compliance"
                ? "border-[#C2410C] text-[#C2410C]"
                : "border-transparent text-[#5F5E5E] hover:text-[#111111]"
            }`}
          >
            MoE / KNEC Compliance
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed text-[#333333]">
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F2EDE3] border border-[#DDD6C7] rounded text-xs">
                <strong>Kenya Data Protection Act (DPA No. 24 of 2019) Notice:</strong> Chokur is
                engineered as a zero-cloud-telemetry, offline-first application. All student
                biodata, marks, and guardian telephone records reside exclusively in your local
                browser storage (IndexedDB Level 2).
              </div>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  1. Information Collected &amp; Processed
                </h3>
                <p>
                  The Chokur system processes educational records required under the Ministry of
                  Education Basic Education curriculum, including:
                </p>
                <ul className="list-disc list-inside pl-2 space-y-1 text-xs">
                  <li>
                    <strong>Pupil Biodata:</strong> Official school admission number (NEMIS
                    compatible), legal full name, gender, KCPE baseline scores, and class stream
                    assignment.
                  </li>
                  <li>
                    <strong>Academic Marks:</strong> Raw continuous assessment test (CAT) marks,
                    mid-term, and end-term exam percentages across all registered KCSE subjects.
                  </li>
                  <li>
                    <strong>Guardian Contacts:</strong> Parent or guardian full names and phone
                    numbers used strictly for attendance alerts and fee billing notifications.
                  </li>
                  <li>
                    <strong>Financial Records:</strong> School term fee assessments, receipts,
                    M-Pesa/Bank reference codes, and outstanding balances.
                  </li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  2. Section 31: Processing of Children’s Personal Data
                </h3>
                <p>
                  Under Section 31 of the Kenya Data Protection Act 2019, processing of personal
                  data relating to a child is carried out with the prior authorization of the
                  child’s parent, guardian, or educational authority. Student data is never used for
                  automated profiling, advertising, or commercial monetization.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  3. Data Storage &amp; Zero Cloud Exposure
                </h3>
                <p>
                  Unlike typical SaaS platforms, Chokur does not stream entered marks to foreign
                  cloud servers. Your school’s database is stored locally inside your browser’s
                  encrypted IndexedDB sandbox. Even in offline rural schools without internet
                  access, your ledger functions reliably with zero third-party exposure.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  4. Rights of Data Subjects
                </h3>
                <p>
                  Parents, guardians, and adult students maintain the statutory right to request
                  access to their records, rectify inaccurate examination entries, and request
                  export of their complete academic history in standardized JSON or CSV format.
                </p>
              </section>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F2EDE3] border border-[#DDD6C7] rounded text-xs">
                <strong>Standard School Software Agreement:</strong> By accessing and utilizing the
                Chokur School Management platform, educational institutions and authorized teachers
                agree to the operational guidelines outlined herein.
              </div>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  1. Authorized Institutional Use
                </h3>
                <p>
                  Chokur is licensed for use by recognized Kenyan secondary schools, academies,
                  teachers, directors of studies (DoS), bursars, and guardians. User accounts must
                  accurately reflect the staff member's real responsibility within the school
                  hierarchy.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  2. KCSE 12-Point Grading Standard Adherence
                </h3>
                <p>
                  Calculations executed within the system conform strictly to the Kenya National
                  Examinations Council (KNEC) 12-point grading scale (A = 12 points, A- = 11, B+ =
                  10, down to E = 1 point). While Chokur automates points aggregation and KUCCPS
                  minimum C+ university entry qualifications, the final validity of transcripts
                  remains the legal responsibility of the school principal.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  3. Offline Responsibility &amp; Database Backups
                </h3>
                <p>
                  Because the application operates offline-first using client-side IndexedDB,
                  schools must periodically export JSON backup files from the{" "}
                  <em>Settings &amp; Backups</em> view and store them securely on physical school
                  hard drives or institutional email archives. Chokur is not liable for data loss
                  caused by hard drive wipes or clearing browser cache without prior backups.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  4. Report Card Certification
                </h3>
                <p>
                  Official printed report cards generated by this software must bear the physical or
                  certified digital signature of the class teacher and the principal, alongside the
                  official school rubber stamp or embossed seal, to be recognized as authentic
                  Kenyan academic transcripts.
                </p>
              </section>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F2EDE3] border border-[#DDD6C7] rounded text-xs">
                <strong>Ministry of Education &amp; KNEC Compliance Alignment:</strong> System
                specifications built directly for Kenyan secondary curricula (Form 1 through Form
                4).
              </div>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  1. KCSE Subject Groupings &amp; Calculation Methods
                </h3>
                <p>Chokur natively enforces KNEC subject classifications:</p>
                <ul className="list-disc list-inside pl-2 space-y-1 text-xs">
                  <li>
                    <strong>Group I (Compulsory):</strong> Mathematics (121), English (101),
                    Kiswahili (102).
                  </li>
                  <li>
                    <strong>Group II (Sciences):</strong> Biology (231), Chemistry (233), Physics
                    (232).
                  </li>
                  <li>
                    <strong>Group III (Humanities):</strong> History &amp; Government (311),
                    Geography (312), Christian Religious Education (313).
                  </li>
                  <li>
                    <strong>Group IV &amp; V (Applied &amp; Technical):</strong> Business Studies
                    (565), Agriculture (443), Computer Studies (451).
                  </li>
                </ul>
                <p className="pt-1">
                  The grading engine supports both <strong>Mean of All Subjects</strong> and{" "}
                  <strong>Official KNEC Best 7</strong> aggregation formulas, ensuring candidate
                  qualifications for KUCCPS degree placement are exact.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  2. Roll-Call Attendance &amp; Child Safety Standards
                </h3>
                <p>
                  Under basic education safety directives, schools are required to account for
                  learner presence every school day. Chokur's integrated attendance ledger
                  automatically isolates absent pupils and prepares instant SMS alerts to parents,
                  ensuring unaccounted absenteeism is eliminated.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-bold text-[#111111] text-sm sm:text-base">
                  3. Auditability &amp; Data Purging
                </h3>
                <p>
                  Schools can instantly purge alumni cohorts upon completion of Form 4 graduation,
                  or retain archive snapshots for up to 7 years in compliance with Kenya public
                  records retention regulations.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#FBF8F1] border-t border-[#DDD6C7] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-[#5F5E5E] font-mono">
            Republic of Kenya · Basic Education Act 2013 &amp; DPA 2019
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-[#DDD6C7] bg-[#FEF9EF] hover:bg-[#F2EDE3] rounded text-xs font-medium text-[#111111] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              <span>Print Policy</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#111111] text-[#FEF9EF] hover:bg-neutral-800 rounded text-xs font-semibold cursor-pointer"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
