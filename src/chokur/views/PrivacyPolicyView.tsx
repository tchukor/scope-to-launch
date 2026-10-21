import React from "react";
import { useGrading } from "../context/GradingContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button, IconButton } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export const PrivacyPolicyView: React.FC = () => {
  const { setActiveView, schoolConfig, role } = useGrading();

  return (
    <div className="w-full min-w-0 max-w-[960px] mx-auto px-4 sm:px-8 py-6 sm:py-10 font-body-md text-[var(--color-on-surface)]">
      {/* Header */}
      <section className="pb-6 border-b border-[var(--color-hairline-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-on-surface-muted)] uppercase tracking-wider mb-1">
            <Badge variant="success" className="w-2 h-2 p-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[8px]">check</span>
            </Badge>
            <span>Data Protection Compliance · Kenya Data Protection Act 2019</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-[var(--color-on-surface)]">
            Privacy Policy & Data Residency
          </h1>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)] mt-1">
            Institutional guidelines for candidate academic records, student confidentiality, and
            offline storage.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveView(role === "Parent" ? "parent-portal" : "overview")}
          iconPosition="left"
          icon={<span className="material-symbols-outlined text-[16px]">arrow_back</span>}
          className="self-start sm:self-auto"
        >
          Return to {role === "Parent" ? "Parent Portal" : "Overview"}
        </Button>
      </section>

      {/* Content */}
      <div className="py-6 space-y-8 text-sm leading-relaxed text-[var(--color-on-surface)]">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[var(--color-primary)]">shield</span>
            <span>1. Offline-First Architecture & Local Data Residency</span>
          </h2>
          <p className="text-[var(--color-on-surface-muted)]">
            Chokur System is engineered as a zero-cloud, client-authoritative academic ledger. All
            student demographic profiles, KCSE score entries, subject means, attendance logs, and
            parent contact registers reside exclusively inside your device&apos;s sandboxed browser
            storage (IndexedDB and encrypted LocalStorage).
          </p>
          <Card variant="outlined" className="p-4">
            <div className="font-semibold text-[var(--color-on-surface)] text-sm mb-2">Key Storage Guarantees:</div>
            <ul className="list-disc list-inside space-y-1 text-[var(--color-on-surface-muted)] text-sm">
              <li>
                No candidate scores or marks are transmitted to remote cloud databases or
                third-party analytical brokers.
              </li>
              <li>
                Calculations for the 12-point KCSE scale, aggregate points (/84), and university
                admission cutoff run client-side.
              </li>
              <li>
                Network disconnects do not impede grading, ranking generation, or official report
                card printing.
              </li>
            </ul>
          </Card>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[var(--color-primary)]">person_search</span>
            <span>2. Candidate & Parent Information Collected</span>
          </h2>
          <p className="text-[var(--color-on-surface-muted)]">
            The software processes data strictly entered by authorized school teachers, principals,
            and administrative staff:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Card variant="outlined" className="p-3">
              <span className="font-semibold block text-[var(--color-on-surface)] mb-1">
                Student & Academic Data:
              </span>
              <p className="text-[var(--color-on-surface-muted)]">
                Official Admission Number, Full Legal Name, Class Form & Stream, Gender, KCPE
                Baseline Entry Marks, and Subject Assessment Scores (0–100 or ABS).
              </p>
            </Card>
            <Card variant="outlined" className="p-3">
              <span className="font-semibold block text-[var(--color-on-surface)] mb-1">
                Parent & Operational Contacts:
              </span>
              <p className="text-[var(--color-on-surface-muted)]">
                Parent/Guardian Legal Name, Registered Mobile Phone Number (+254 standard format),
                Roll-call attendance status, and Term Tuition Ledger balance.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[var(--color-primary)]">lock</span>
            <span>3. Parent Portal Confidentiality & Access Controls</span>
          </h2>
          <p className="text-[var(--color-on-surface-muted)]">
            The Parent Portal strictly enforces single-student confidentiality. A parent is
            authenticated exclusively against matching records of their child&apos;s Admission
            Number and registered phone number.
          </p>
          <p className="font-body-xs text-body-xs text-[var(--color-on-surface-muted)]">
            Parents cannot browse, search, inspect, or print the marks, rankings, or report cards of
            any other learner in the cohort.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[var(--color-primary)]">download</span>
            <span>4. Data Backup, Export & Erasure Rights</span>
          </h2>
          <p className="text-[var(--color-on-surface-muted)]">School administrators retain 100% sovereign ownership over institutional data:</p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-[var(--color-on-surface-muted)]">
            <li>
              <strong>JSON Backups:</strong> Administrators can export the complete database to an
              offline, encrypted JSON snapshot at any time under Settings & Backups.
            </li>
            <li>
              <strong>CSV Export:</strong> Class rankings, subject departmental analyses, and fee
              ledgers can be exported directly to standard CSV format.
            </li>
            <li>
              <strong>Complete Erasure:</strong> The "Reset to Defaults" tool allows
              complete erasure of local candidate data from the device browser storage upon session
              termination.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-headline-md text-base sm:text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[var(--color-primary)]">support_agent</span>
            <span>5. Institutional Data Controller</span>
          </h2>
          <p className="text-[var(--color-on-surface-muted)]">
            Under the provisions of the Kenya Data Protection Act (2019), the designated institution
            (<strong>{schoolConfig.schoolName}</strong>) acts as the Data Controller. The software
            author acts solely as the technical provider of the offline toolset.
          </p>
          <p className="font-body-xs text-body-xs text-[var(--color-on-surface-muted)]">
            For data inquiries or candidate record modifications, contact:{" "}
            {schoolConfig.contactPhoneEmail} ({schoolConfig.postalAddress}).
          </p>
        </section>
      </div>

      {/* Footer Return Link */}
      <div className="pt-6 border-t border-[var(--color-hairline-border)] flex justify-between items-center font-body-xs text-body-xs text-[var(--color-on-surface-muted)]">
        <span>Chokur Academic System v2.4 · KCSE Compliant</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveView("legal")}
          className="p-0 min-h-0 hover:text-[var(--color-on-surface)]"
        >
          View Terms & Conditions →
        </Button>
      </div>
    </div>
  );
};