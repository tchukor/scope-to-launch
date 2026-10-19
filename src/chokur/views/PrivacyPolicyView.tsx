import React from "react";
import { useGrading } from "../context/GradingContext";

export const PrivacyPolicyView: React.FC = () => {
  const { setActiveView, schoolConfig, role } = useGrading();

  return (
    <div className="w-full min-w-0 max-w-[960px] mx-auto px-4 sm:px-8 py-6 sm:py-10 text-[#111111] font-body-md">
      {/* Header */}
      <section className="pb-6 border-b border-[#DDD6C7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5C5850] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Data Protection Compliance · Kenya Data Protection Act 2019</span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Privacy Policy &amp; Data Residency
          </h1>
          <p className="text-xs sm:text-sm text-[#5F5E5E] mt-1">
            Institutional guidelines for candidate academic records, student confidentiality, and offline storage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveView(role === "Parent" ? "parent-portal" : "overview")}
          className="px-3.5 py-2 border border-[#DDD6C7] rounded bg-[#FBF8F1] hover:bg-[#F2EDE3] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to {role === "Parent" ? "Parent Portal" : "Overview"}</span>
        </button>
      </section>

      {/* Content */}
      <div className="py-6 space-y-8 text-sm leading-relaxed text-[#1D1C16]">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#C2410C]">shield</span>
            <span>1. Offline-First Architecture &amp; Local Data Residency</span>
          </h2>
          <p>
            Chokur System is engineered as a zero-cloud, client-authoritative academic ledger. All student demographic
            profiles, KCSE score entries, subject means, attendance logs, and parent contact registers reside
            exclusively inside your device&apos;s sandboxed browser storage (IndexedDB and encrypted LocalStorage).
          </p>
          <div className="p-4 bg-[#FBF8F1] border border-[#DDD6C7] rounded text-xs space-y-1.5">
            <div className="font-semibold text-[#111111]">Key Storage Guarantees:</div>
            <ul className="list-disc list-inside space-y-1 text-[#5F5E5E]">
              <li>No candidate scores or marks are transmitted to remote cloud databases or third-party analytical brokers.</li>
              <li>Calculations for the 12-point KCSE scale, aggregate points (/84), and university admission cutoff run client-side.</li>
              <li>Network disconnects do not impede grading, ranking generation, or official report card printing.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#C2410C]">person_search</span>
            <span>2. Candidate &amp; Parent Information Collected</span>
          </h2>
          <p>
            The software processes data strictly entered by authorized school teachers, principals, and administrative staff:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FBF8F1] border border-[#DDD6C7] rounded">
              <span className="font-semibold block text-[#111111] mb-1">Student &amp; Academic Data:</span>
              <p className="text-[#5F5E5E]">
                Official Admission Number, Full Legal Name, Class Form &amp; Stream, Gender, KCPE Baseline Entry Marks, and Subject Assessment Scores (0–100 or ABS).
              </p>
            </div>
            <div className="p-3 bg-[#FBF8F1] border border-[#DDD6C7] rounded">
              <span className="font-semibold block text-[#111111] mb-1">Parent &amp; Operational Contacts:</span>
              <p className="text-[#5F5E5E]">
                Parent/Guardian Legal Name, Registered Mobile Phone Number (+254 standard format), Roll-call attendance status, and Term Tuition Ledger balance.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#C2410C]">lock</span>
            <span>3. Parent Portal Confidentiality &amp; Access Controls</span>
          </h2>
          <p>
            The Parent Portal strictly enforces single-student confidentiality. A parent is authenticated exclusively
            against matching records of their child&apos;s Admission Number and registered phone number.
          </p>
          <p className="text-xs text-[#5F5E5E]">
            Parents cannot browse, search, inspect, or print the marks, rankings, or report cards of any other learner in the cohort.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#C2410C]">download</span>
            <span>4. Data Backup, Export &amp; Erasure Rights</span>
          </h2>
          <p>
            School administrators retain 100% sovereign ownership over institutional data:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5F5E5E]">
            <li><strong>JSON Backups:</strong> Administrators can export the complete database to an offline, encrypted JSON snapshot at any time under Settings &amp; Backups.</li>
            <li><strong>CSV Export:</strong> Class rankings, subject departmental analyses, and fee ledgers can be exported directly to standard CSV format.</li>
            <li><strong>Complete Erasure:</strong> The &quot;Reset to Defaults&quot; tool allows complete erasure of local candidate data from the device browser storage upon session termination.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#C2410C]">support_agent</span>
            <span>5. Institutional Data Controller</span>
          </h2>
          <p>
            Under the provisions of the Kenya Data Protection Act (2019), the designated institution (<strong>{schoolConfig.schoolName}</strong>) acts
            as the Data Controller. The software author acts solely as the technical provider of the offline toolset.
          </p>
          <p className="text-xs text-[#5F5E5E]">
            For data inquiries or candidate record modifications, contact: {schoolConfig.contactPhoneEmail} ({schoolConfig.postalAddress}).
          </p>
        </section>
      </div>

      {/* Footer Return Link */}
      <div className="pt-6 border-t border-[#DDD6C7] flex justify-between items-center text-xs text-[#5C5850]">
        <span>Chokur Academic System v2.4 · KCSE Compliant</span>
        <button
          type="button"
          onClick={() => setActiveView("terms")}
          className="underline hover:text-[#111111] cursor-pointer"
        >
          View Terms &amp; Conditions →
        </button>
      </div>
    </div>
  );
};
