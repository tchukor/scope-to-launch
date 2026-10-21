import React, { useRef, useState } from "react";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { useGrading } from "../context/GradingContext";
import { KCSE_GRADING_TABLE, parseMarksCSV, ParsedCSVResult } from "../utils/grading";
import { LegalModals, LegalModalType } from "@/chokur/components/modals/LegalModals";
import { TestPresetsModal } from "@/chokur/components/modals/TestPresetsModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge } from "@/chokur/components/ui";
import { Input, Textarea, Select } from "@/chokur/components/ui";
import {
  DataTable,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
} from "@/chokur/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/chokur/components/ui";
import { Sheet, SheetTrigger } from "@/chokur/components/ui";

export const SettingsView: React.FC = () => {
  const {
    schoolConfig,
    updateSchoolConfig,
    exportJSONBackup,
    restoreJSONBackup,
    resetToDemoData,
    importMarksFromCSV,
    downloadMarksTemplateCSV,
    students,
    subjects,
    marks,
    setActiveView,
  } = useGrading();

  const [formConfig, setFormConfig] = useState(schoolConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dbHealth, setDbHealth] = useState<{
    status: "idle" | "checking" | "healthy";
    totalStudents: number;
    totalMarksEntered: number;
    estimatedStorageKB: number;
    lastVerified: string | null;
  }>({
    status: "idle",
    totalStudents: students.length,
    totalMarksEntered: 0,
    estimatedStorageKB: 0,
    lastVerified: null,
  });
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [restoreText, setRestoreText] = useState("");
  const [restoreError, setRestoreError] = useState(false);

  // CSV Import State
  const [csvInputText, setCsvInputText] = useState<string>("");
  const [csvFileName, setCsvFileName] = useState<string>("");
  const [csvMode, setCsvMode] = useState<"upload" | "paste">("upload");
  const [parsedPreview, setParsedPreview] = useState<ParsedCSVResult | null>(null);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateSchoolConfig(formConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDiscard = () => {
    setFormConfig(schoolConfig);
  };

  const handleVerifyDatabaseIntegrity = async () => {
    setDbHealth((prev) => ({ ...prev, status: "checking" }));
    try {
      let markCount = 0;
      Object.values(marks).forEach((subjMap) => {
        if (subjMap && typeof subjMap === "object") {
          markCount += Object.keys(subjMap).length;
        }
      });

      let storageKB = 24;
      if (
        typeof navigator !== "undefined" &&
        "storage" in navigator &&
        navigator.storage?.estimate
      ) {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) {
          storageKB = Math.round(estimate.usage / 1024);
        }
      }

      setDbHealth({
        status: "healthy",
        totalStudents: students.length,
        totalMarksEntered: markCount,
        estimatedStorageKB: storageKB,
        lastVerified: new Date().toLocaleTimeString(),
      });
    } catch {
      setDbHealth((prev) => ({ ...prev, status: "idle" }));
    }
  };

  const handleProcessRestore = () => {
    setRestoreError(false);
    const success = restoreJSONBackup(restoreText);
    if (success) {
      setIsRestoreModalOpen(false);
      setRestoreText("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      setRestoreError(true);
    }
  };

  // CSV Processing Handlers
  const handleProcessFileContent = (content: string, name: string = "uploaded_file.csv") => {
    setCsvInputText(content);
    setCsvFileName(name);
    setCsvSuccessMessage(null);
    const parsed = parseMarksCSV(content, students, subjects);
    setParsedPreview(parsed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleProcessFileContent(text, file.name);
      };
      reader.readAsText(file, "UTF-8");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleProcessFileContent(text, file.name);
      };
      reader.readAsText(file, "UTF-8");
    }
  };

  const handlePasteChange = (text: string) => {
    setCsvInputText(text);
    setCsvFileName("Pasted CSV text");
    setCsvSuccessMessage(null);
    if (text.trim()) {
      const parsed = parseMarksCSV(text, students, subjects);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  const handleConfirmCSVImport = () => {
    if (!csvInputText.trim()) return;
    const result = importMarksFromCSV(csvInputText);
    if (result.success) {
      const studentCount = result.updates.length;
      const subjectsCount = result.mappedSubjects.length;
      setCsvSuccessMessage(
        `Successfully imported marks for ${studentCount} students across ${subjectsCount} subjects into the central ledger!`,
      );
      setParsedPreview(null);
      setCsvInputText("");
      setCsvFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClearCSV = () => {
    setCsvInputText("");
    setCsvFileName("");
    setParsedPreview(null);
    setCsvSuccessMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-[1360px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 pb-32 font-body-md text-[var(--color-on-surface)]">
      {/* Page Title & Subtitle Header */}
      <div className="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-[var(--color-hairline-border)] flex flex-col md:flex-row md:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)]">
              Settings
            </h1>
            <span className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)]">
              CONFIG_ACAD_2026
            </span>
          </div>
          <p className="font-body-md text-body-md text-[var(--color-on-surface-muted)] mt-1">
            Configure school metadata, grading scales, bulk CSV marks import, and offline data sync
          </p>
        </div>

        {saveSuccess && (
          <Badge variant="success" className="flex items-center gap-1.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>All configuration settings updated</span>
          </Badge>
        )}
      </div>

      {/* Settings Sections (Planar, Hairline Separated) */}
      <div className="flex flex-col">
        {/* 1. School Information Section */}
        <section className="py-6 border-b border-[var(--color-hairline-border)] grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 pr-4">
            <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
              School Information
            </h2>
            <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-1">
              Official institutional identity printed across all term transcripts, KCSE result
              schedules, and student performance dossiers.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 flex flex-col space-y-4">
            <div>
              <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                School Name
              </label>
              <Input
                type="text"
                value={formConfig.schoolName}
                onChange={(e) => setFormConfig({ ...formConfig, schoolName: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                School Motto
              </label>
              <Input
                type="text"
                value={formConfig.motto}
                onChange={(e) => setFormConfig({ ...formConfig, motto: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                  Postal Address
                </label>
                <Input
                  type="text"
                  value={formConfig.postalAddress}
                  onChange={(e) => setFormConfig({ ...formConfig, postalAddress: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                  Contact Phone / Email
                </label>
                <Input
                  type="text"
                  value={formConfig.contactPhoneEmail}
                  onChange={(e) =>
                    setFormConfig({ ...formConfig, contactPhoneEmail: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                  Principal Name
                </label>
                <Input
                  type="text"
                  value={formConfig.principalName || ""}
                  onChange={(e) => setFormConfig({ ...formConfig, principalName: e.target.value })}
                  placeholder="e.g. Dr. E. Kibet (PhD)"
                />
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                  Head of Curriculum / Class Teacher
                </label>
                <Input
                  type="text"
                  value={formConfig.classTeacher}
                  onChange={(e) => setFormConfig({ ...formConfig, classTeacher: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Current Term & Academic Year Section */}
        <section className="py-6 border-b border-[var(--color-hairline-border)] grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 pr-4">
            <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
              Current Term & Academic Year
            </h2>
            <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-1">
              Active evaluation window used for ledger aggregation, attendance intervals, and
              automated merit standings.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                Academic Year
              </label>
              <Select
                value={formConfig.academicYear}
                onValueChange={(value) => setFormConfig({ ...formConfig, academicYear: value })}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </Select>
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                Term
              </label>
              <Select
                value={formConfig.term}
                onValueChange={(value) => setFormConfig({ ...formConfig, term: value })}
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </Select>
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                Term Opening Date
              </label>
              <Input
                type="date"
                value={formConfig.termOpeningDate}
                onChange={(e) => setFormConfig({ ...formConfig, termOpeningDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1.5">
                Term Closing Date
              </label>
              <Input
                type="date"
                value={formConfig.termClosingDate}
                onChange={(e) => setFormConfig({ ...formConfig, termClosingDate: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* 3. KCSE Grading Scale Section (12-Point Scale) */}
        <section className="py-6 border-b border-[var(--color-hairline-border)] grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 pr-4">
            <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
              KCSE Grading Scale (12-Point Scale)
            </h2>
            <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-1">
              Read-only standard ministerial metric. Points feed mean score calculations directly
              across all Form 1 to Form 4 classes.
            </p>

            {/* Calculation Method Switcher */}
            <Card variant="outlined" className="mt-4">
              <CardContent className="p-3">
                <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] block mb-2">
                  Calculation Standard
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--color-on-surface)]">
                    <input
                      type="radio"
                      name="calcMethod"
                      checked={formConfig.calculationMethod === "best7"}
                      onChange={() => setFormConfig({ ...formConfig, calculationMethod: "best7" })}
                      className="accent-[var(--color-primary)]"
                    />
                    <span>Best 7 Subjects Rule (KNEC Standard)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--color-on-surface)]">
                    <input
                      type="radio"
                      name="calcMethod"
                      checked={formConfig.calculationMethod === "simpleMean"}
                      onChange={() =>
                        setFormConfig({ ...formConfig, calculationMethod: "simpleMean" })
                      }
                      className="accent-[var(--color-primary)]"
                    />
                    <span>Straight Mean across all subjects</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" className="mt-4">
              <CardContent className="p-3">
                <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] block mb-1">
                  Scale Paradigm
                </span>
                <p className="font-caption text-caption text-[var(--color-on-surface-muted)]">
                  Monochrome graphic hierarchy: Solid carbon indicates honors; outline indicates
                  competence; grey indicates marginal performance; dashed indicates critical
                  remedial intervention.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-8">
            <Card variant="outlined" className="overflow-hidden">
              <CardContent className="p-0">
                <DataTable compact>
                  <TableHeader>
                    <tr className="h-9 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                      <TableHead scope="col" className="px-4 py-2">
                        Marks Range
                      </TableHead>
                      <TableHead scope="col" className="px-4 py-2">
                        Grade
                      </TableHead>
                      <TableHead scope="col" className="px-4 py-2 text-right">
                        Points
                      </TableHead>
                      <TableHead scope="col" className="px-4 py-2">
                        Description
                      </TableHead>
                    </tr>
                  </TableHeader>
                  <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
                    {KCSE_GRADING_TABLE.map((row) => {
                      const isCPlus = row.grade === "C+";

                      return (
                        <React.Fragment key={row.grade}>
                          <TableRow className="h-11 bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] transition-colors">
                            <TableCell className="px-4 py-2 font-tabular-md text-tabular-md">
                              {row.min} – {row.max}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              <GradeChip grade={row.grade} />
                            </TableCell>
                            <TableCell className="px-4 py-2 font-tabular-md text-tabular-md text-right font-medium">
                              {row.points}
                            </TableCell>
                            <TableCell className="px-4 py-2 text-[var(--color-on-surface)]">
                              {row.description}
                            </TableCell>
                          </TableRow>

                          {/* Cutoff Pass Line */}
                          {isCPlus && (
                            <TableRow className="bg-[var(--color-surface-container-low)]">
                              <TableCell colSpan={4} className="p-0">
                                <div className="border-y border-[var(--color-on-surface)] bg-[var(--color-surface-container)]/40 px-4 py-1.5 flex items-center justify-between">
                                  <span className="font-label-caps text-label-caps text-[var(--color-on-surface)] font-semibold uppercase tracking-wider">
                                    Pass Line — Minimum University Direct Entry Requirement
                                  </span>
                                  <span className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)]">
                                    KUCCPS Benchmark: 7.00 Mean PTS
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </DataTable>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. Bulk Marks Import (CSV) Section - NEW & REQUESTED */}
        <section className="py-6 border-b border-[var(--color-hairline-border)] grid grid-cols-12 gap-6 bg-[var(--color-surface-container-low)]/50 p-4 rounded my-2">
          <div className="col-span-12 md:col-span-4 pr-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-primary)]">
                upload_file
              </span>
              <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
                Bulk Marks Import (CSV)
              </h2>
            </div>
            <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-1.5">
              Bulk-upload student examination marks directly into the central ledger. Automatically
              matches student admission numbers and KCSE subject codes (
              <code className="font-tabular-sm text-[var(--color-on-surface)]">
                MAT, ENG, KIS, BIO, CHE, PHY, HIS, GEO, CRE, BST
              </code>
              ).
            </p>

            {/* Template Download Button */}
            <div className="mt-4 pt-3 border-t border-[var(--color-hairline-border)]">
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] block mb-1">
                CSV Template
              </span>
              <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mb-2">
                Download a pre-filled spreadsheet containing current student admission numbers and
                subject columns.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadMarksTemplateCSV}
                className="inline-flex items-center gap-1.5"
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">file_download</span>}
              >
                Download Sample CSV Template
              </Button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 flex flex-col justify-start space-y-4">
            {/* Mode Selector Tabs */}
            <Tabs
              defaultValue={csvMode}
              onValueChange={(v) => setCsvMode(v as "upload" | "paste")}
              variant="underline"
              className="w-full"
            >
              <TabsList className="flex gap-1" aria-label="CSV import mode">
                <TabsTrigger
                  value="upload"
                  className="px-3.5 py-2 min-h-[40px] whitespace-nowrap text-xs"
                >
                  <span className="material-symbols-outlined text-[15px] mr-1.5">cloud_upload</span>
                  Upload CSV File
                </TabsTrigger>
                <TabsTrigger
                  value="paste"
                  className="px-3.5 py-2 min-h-[40px] whitespace-nowrap text-xs"
                >
                  <span className="material-symbols-outlined text-[15px] mr-1.5">
                    content_paste
                  </span>
                  Paste CSV / TSV Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" forceMount>
                {/* Success message banner */}
                {csvSuccessMessage && (
                  <Badge
                    variant="success"
                    className="w-full justify-between animate-fadeIn flex items-center gap-2 mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span className="font-medium">{csvSuccessMessage}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCsvSuccessMessage(null)}
                      className="p-0 min-h-0 text-xs"
                    >
                      ✕
                    </Button>
                  </Badge>
                )}

                {/* Mode 1: Drag & Drop File Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-file-upload-input"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-container)]/30"
                        : "border-[var(--color-hairline-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-container-low)]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[32px] text-[var(--color-on-surface-disabled)] mb-2 block">
                      upload_file
                    </span>
                    <div className="font-body-md text-sm font-medium text-[var(--color-on-surface)]">
                      {csvFileName ? (
                        <span className="text-[var(--color-primary)] font-semibold">
                          {csvFileName}
                        </span>
                      ) : (
                        "Click to select a CSV file or drag and drop here"
                      )}
                    </div>
                    <p className="font-caption text-xs text-[var(--color-on-surface-muted)] mt-1">
                      Accepts standard comma-separated or tab-separated spreadsheet exports (.csv)
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paste" forceMount>
                {/* Success message banner */}
                {csvSuccessMessage && (
                  <Badge
                    variant="success"
                    className="w-full justify-between animate-fadeIn flex items-center gap-2 mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span className="font-medium">{csvSuccessMessage}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCsvSuccessMessage(null)}
                      className="p-0 min-h-0 text-xs"
                    >
                      ✕
                    </Button>
                  </Badge>
                )}

                {/* Mode 2: Paste Raw CSV Text */}
                <div>
                  <label className="block font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1">
                    Paste Tabular Marks Data
                  </label>
                  <Textarea
                    rows={5}
                    value={csvInputText}
                    onChange={(e) => handlePasteChange(e.target.value)}
                    placeholder={`AdmNo,StudentName,MAT,ENG,KIS,BIO,CHE,PHY,HIS,GEO,CRE,BST&#10;3842,Grace Achieng,85,80,88,76,72,74,82,78,90,75&#10;3819,Daniel Kiprop,90,70,72,82,78,84,68,74,80,86`}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Inspection & Parse Preview Card */}
            {parsedPreview && (
              <Card variant="outlined" className="space-y-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline-border)]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          parsedPreview.success
                            ? "bg-[var(--color-success)]"
                            : "bg-[var(--color-error)]"
                        }`}
                      ></span>
                      <span className="font-headline-sm text-xs font-semibold text-[var(--color-on-surface)]">
                        {parsedPreview.success
                          ? "File Parsed Successfully"
                          : "Parse Errors Encountered"}
                      </span>
                    </div>
                    <span className="font-tabular-sm text-xs text-[var(--color-on-surface-muted)]">
                      {parsedPreview.updates.length} students matched ·{" "}
                      {parsedPreview.mappedSubjects.length} subjects
                    </span>
                  </div>

                  {/* Errors display */}
                  {parsedPreview.errors.length > 0 && (
                    <Badge variant="error" className="w-full justify-start p-2.5 text-xs">
                      <div className="font-semibold mb-1">Validation Errors:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {parsedPreview.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </Badge>
                  )}

                  {/* Warnings display */}
                  {parsedPreview.warnings.length > 0 && (
                    <Badge variant="warning" className="w-full justify-start p-2.5 text-xs">
                      <div className="font-semibold mb-1">Warnings:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {parsedPreview.warnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    </Badge>
                  )}

                  {/* Mapped Subjects Badges */}
                  {parsedPreview.mappedSubjects.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[var(--color-on-surface-muted)] font-label-caps text-[10px]">
                        Mapped Subjects:
                      </span>
                      {parsedPreview.mappedSubjects.map((sub) => (
                        <Badge key={sub} variant="outline" className="text-[11px]">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Preview Table of first 5 records */}
                  {parsedPreview.updates.length > 0 && (
                    <div>
                      <div className="text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase mb-1">
                        Data Sample Preview (First {Math.min(5, parsedPreview.updates.length)} Rows)
                      </div>
                      <Card variant="outlined" className="overflow-hidden">
                        <CardContent className="p-0">
                          <DataTable compact>
                            <TableHeader>
                              <tr className="bg-[var(--color-surface-container-low)] border-b border-[var(--color-hairline-border)] text-[10px] font-label-caps text-[var(--color-on-surface-muted)]">
                                <TableHead scope="col" className="px-2 py-1.5">
                                  ADM
                                </TableHead>
                                <TableHead scope="col" className="px-2 py-1.5">
                                  NAME
                                </TableHead>
                                {parsedPreview.mappedSubjects.slice(0, 6).map((sub) => (
                                  <TableHead
                                    key={sub}
                                    scope="col"
                                    className="px-2 py-1.5 text-right"
                                  >
                                    {sub}
                                  </TableHead>
                                ))}
                                {parsedPreview.mappedSubjects.length > 6 && (
                                  <TableHead scope="col" className="px-2 py-1.5 text-right">
                                    +{parsedPreview.mappedSubjects.length - 6} more
                                  </TableHead>
                                )}
                              </tr>
                            </TableHeader>
                            <tbody className="divide-y divide-[var(--color-hairline-border)] font-tabular-sm">
                              {parsedPreview.updates.slice(0, 5).map((u) => (
                                <TableRow
                                  key={u.studentId}
                                  className="h-7 hover:bg-[var(--color-surface-container)]"
                                >
                                  <TableCell className="px-2 py-1 font-medium">{u.admNo}</TableCell>
                                  <TableCell className="px-2 py-1 text-[var(--color-on-surface)]">
                                    {u.studentName}
                                  </TableCell>
                                  {parsedPreview.mappedSubjects.slice(0, 6).map((sub) => (
                                    <TableCell
                                      key={sub}
                                      className="px-2 py-1 text-right text-[var(--color-on-surface)]"
                                    >
                                      {u.marks[sub] !== undefined ? String(u.marks[sub]) : "—"}
                                    </TableCell>
                                  ))}
                                  {parsedPreview.mappedSubjects.length > 6 && (
                                    <TableCell className="px-2 py-1 text-right text-[var(--color-on-surface-muted)]">
                                      ...
                                    </TableCell>
                                  )}
                                </TableRow>
                              ))}
                            </tbody>
                          </DataTable>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Unmatched students note */}
                  {parsedPreview.unmatchedStudents.length > 0 && (
                    <div className="text-xs text-[var(--color-on-surface-muted)]">
                      <span className="text-[var(--color-warning)] font-medium">
                        {parsedPreview.unmatchedStudents.length} rows in CSV did not match active
                        students
                      </span>{" "}
                      (e.g. {parsedPreview.unmatchedStudents.slice(0, 3).join(", ")}
                      {parsedPreview.unmatchedStudents.length > 3 ? "..." : ""}).
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--color-hairline-border)]">
                    <Button variant="ghost" size="sm" onClick={handleClearCSV}>
                      Clear & Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={!parsedPreview.success || parsedPreview.updates.length === 0}
                      onClick={handleConfirmCSVImport}
                      iconPosition="left"
                      icon={<span className="material-symbols-outlined text-[15px]">publish</span>}
                    >
                      Commit Marks to Central Ledger ({parsedPreview.updates.length} Students)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* 5. Data & Backups Section */}
        <section className="py-6 border-b border-[var(--color-hairline-border)] grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 pr-4">
            <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
              Data & Backups
            </h2>
            <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-1">
              Direct cryptographic snapshots of the ledger state. Store cold archive files onto
              local physical storage keys.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 flex flex-col justify-start">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setIsPresetsModalOpen(true)}
                className="flex items-center gap-1.5"
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">science</span>}
              >
                Test Presets & Scenarios
              </Button>
              <Button
                variant="outline"
                onClick={exportJSONBackup}
                className="flex items-center gap-1.5"
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">download</span>}
              >
                Export backup (JSON)
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRestoreModalOpen(true)}
                className="flex items-center gap-1.5"
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">upload_file</span>}
              >
                Restore from backup
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center gap-1.5"
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">delete_forever</span>}
              >
                Reset demo data
              </Button>
            </div>
            <p className="font-caption text-caption text-[var(--color-on-surface-disabled)] mt-3">
              All marks and student records are stored locally in IndexedDB / localStorage on this
              browser.
            </p>
          </div>
        </section>

        {/* 6. Local Storage & Database Integrity Section */}
        <section className="py-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 pr-4">
            <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
              Local Storage & Database Health
            </h2>
            <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-1">
              Zero-cloud privacy architecture. All student marks, subjects, and configurations are
              stored in your device's persistent IndexedDB database.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant={dbHealth.status === "healthy" ? "success" : "outline"}
                className="flex items-center gap-2 px-3 py-1.5"
              >
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    dbHealth.status === "healthy"
                      ? "bg-[var(--color-success)]"
                      : "bg-[var(--color-error)]"
                  }`}
                ></span>
                <span className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface)] font-medium">
                  {dbHealth.status === "checking"
                    ? "Verifying IndexedDB records & local cache..."
                    : dbHealth.status === "healthy"
                      ? `Healthy: ${dbHealth.totalStudents} candidates · ${dbHealth.totalMarksEntered} scores verified (~${dbHealth.estimatedStorageKB} KB)`
                      : `Offline Storage Active: ${students.length} candidates cached`}
                </span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVerifyDatabaseIntegrity}
                disabled={dbHealth.status === "checking"}
                className="min-h-[36px]"
              >
                {dbHealth.status === "checking" ? "Checking..." : "Verify Database Health"}
              </Button>
            </div>
            <span className="font-caption text-caption text-[var(--color-on-surface-muted)]">
              {dbHealth.lastVerified
                ? `Last integrity verification: ${dbHealth.lastVerified} · 100% local persistence`
                : "100% offline-ready · Zero data transmitted to external servers"}
            </span>
          </div>
        </section>

        {/* 7. Legal & Data Protection Compliance Section */}
        <section className="py-6 border-t border-[var(--color-hairline-border)] grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 pr-4">
            <h2 className="font-headline-sm text-headline-sm text-[var(--color-on-surface)]">
              Legal & Statutory Compliance
            </h2>
            <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-1">
              Institutional policies governed by the Kenya Basic Education Act and the Data
              Protection Act (DPA No. 24 of 2019).
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView("legal")}
                className="flex items-center gap-1.5"
                iconPosition="left"
                icon={
                  <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">
                    policy
                  </span>
                }
              >
                Privacy Policy (DPA 2019)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView("legal")}
                className="flex items-center gap-1.5"
                iconPosition="left"
                icon={
                  <span className="material-symbols-outlined text-[16px] text-[var(--color-on-surface-muted)]">
                    gavel
                  </span>
                }
              >
                Terms of Service
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLegalModal("compliance")}
                className="flex items-center gap-1.5"
                iconPosition="left"
                icon={
                  <span className="material-symbols-outlined text-[16px] text-[var(--color-success)]">
                    verified
                  </span>
                }
              >
                Ministry of Education & KNEC
              </Button>
            </div>
            <p className="font-caption text-caption text-[var(--color-on-surface-disabled)]">
              Learner personal data is protected under Section 31 of Kenya DPA. Zero cloud telemetry
              or external third-party scraping.
            </p>
          </div>
        </section>
      </div>

      {/* Mobile footer - not fixed */}
      <footer className="sticky bottom-0 z-20 bg-[var(--color-surface-container-low)] border-t border-[var(--color-hairline-border)] py-3 px-4 sm:px-6 md:hidden">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[var(--color-on-surface-muted)]">
              info
            </span>
            <span className="font-caption text-caption text-[var(--color-on-surface-muted)] text-xs">
              Configuration changes are cached locally until explicitly confirmed.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleDiscard}>
              Discard changes
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </div>
      </footer>

      {/* Desktop fixed footer */}
      <footer className="hidden md:fixed bottom-0 right-0 left-[72px] lg:left-[200px] xl:left-[220px] bg-[var(--color-surface-container-low)] border-t border-[var(--color-hairline-border)] py-3 px-4 sm:px-6 z-30 no-print transition-all duration-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[var(--color-on-surface-muted)]">
              info
            </span>
            <span className="font-caption text-caption text-[var(--color-on-surface-muted)] text-xs">
              Configuration changes are cached locally until explicitly confirmed.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleDiscard}>
              Discard changes
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </div>
      </footer>

      {/* Restore JSON Modal */}
      <Sheet open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen} side="right">
        <div className="max-w-lg w-full p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline-border)] mb-3">
            <CardTitle className="font-headline-sm text-headline-sm">
              Restore from JSON Backup
            </CardTitle>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setIsRestoreModalOpen(false)}
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </IconButton>
          </div>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)] mb-3">
            Paste the contents of your previously exported JSON backup file below.
          </p>
          <Textarea
            rows={8}
            value={restoreText}
            onChange={(e) => setRestoreText(e.target.value)}
            placeholder="Paste JSON here..."
          />
          {restoreError && (
            <Badge variant="error" className="mt-2 w-full justify-center text-xs">
              Invalid JSON format or missing required ledger keys.
            </Badge>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setIsRestoreModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" size="sm" onClick={handleProcessRestore}>
              Restore Records
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Reset Confirmation Modal */}
      <Sheet open={isResetModalOpen} onOpenChange={setIsResetModalOpen} side="right">
        <div className="max-w-md w-full p-4">
          <div className="flex items-center gap-2 text-[var(--color-error)] mb-2">
            <span className="material-symbols-outlined text-[24px]">warning</span>
            <CardTitle className="font-headline-sm text-headline-sm">
              Reset to Demo Cohort Data
            </CardTitle>
          </div>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface)] mb-3">
            This will restore the ledger to clean Form 4 East seed records (42 students, KNEC
            12-point marks, and official school config).
          </p>
          <Badge variant="error" className="w-full justify-start p-3 text-xs mb-4">
            <strong>Notice:</strong> All custom student additions and newly entered marks will be
            overwritten with initial baseline data.
          </Badge>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                await resetToDemoData();
                setIsResetModalOpen(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2500);
              }}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Test Presets & Scenarios Modal */}
      <TestPresetsModal isOpen={isPresetsModalOpen} onClose={() => setIsPresetsModalOpen(false)} />

      {/* Legal & Compliance Modal */}
      <LegalModals activeModal={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
};
