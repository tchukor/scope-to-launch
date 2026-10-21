import React, { useMemo, useState } from "react";
import { useGrading } from "../context/GradingContext";
import { WhatsAppMessage } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge } from "@/chokur/components/ui";
import { Input, Textarea, Select } from "@/chokur/components/ui";
import { Sheet, SheetTrigger } from "@/chokur/components/ui";

export const ProfileInboxView: React.FC = () => {
  const {
    filteredStudents,
    rankings,
    schoolConfig,
    activeStream,
    activeExam,
    teacherProfile,
    updateTeacherProfile,
    whatsAppMessages,
    sendWhatsAppMessage,
  } = useGrading();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    filteredStudents[0]?.id || "s-1",
  );
  const [composerText, setComposerText] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(teacherProfile);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Selected student & their academic standing
  const currentStudent = useMemo(() => {
    return filteredStudents.find((s) => s.id === selectedStudentId) || filteredStudents[0];
  }, [filteredStudents, selectedStudentId]);

  const currentStanding = useMemo(() => {
    return rankings.find((r) => r.student.id === selectedStudentId);
  }, [rankings, selectedStudentId]);

  // Thread messages for selected student
  const threadMessages = useMemo(() => {
    return whatsAppMessages.filter((m) => m.studentId === selectedStudentId);
  }, [whatsAppMessages, selectedStudentId]);

  // Generate official KCSE progress text
  const generateOfficialReportMessage = () => {
    if (!currentStudent || !currentStanding) return "";
    return `Good day, this is ${teacherProfile.name} (Class Teacher, ${activeStream}) from ${schoolConfig.schoolName}.

*OFFICIAL KCSE PROGRESS UPDATE*
Student: ${currentStudent.name} (Adm: ${currentStudent.admNo})
Exam: ${activeExam}
Rank: #${currentStanding.rank} of ${filteredStudents.length} candidates
Mean Grade: ${currentStanding.meanGrade} (${currentStanding.meanPoints.toFixed(1)} pts)
Best 7 Aggregate: ${currentStanding.aggregate} / 84
Subjects Passed: ${currentStanding.subjectsPassed} / ${currentStanding.enteredSubjectsCount}
University Qualification: ${currentStanding.qualifies ? "YES (Qualified for Degree entry)" : "Needs improvement"}

Term Next Opening: ${schoolConfig.termOpeningDate || "TBA"}.
Principal: ${schoolConfig.principalName || "Mrs. J. K. Cheruiyot"}.`;
  };

  const handleSendOfficialBroadcast = () => {
    const text = generateOfficialReportMessage();
    if (!text || !currentStudent) return;

    sendWhatsAppMessage({
      studentId: currentStudent.id,
      studentAdm: currentStudent.admNo,
      studentName: currentStudent.name,
      parentName: `Parent of ${currentStudent.name}`,
      parentPhone: "+254 712 000 111",
      sender: "teacher",
      text,
    });
  };

  const handleSendCustomMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!composerText.trim() || !currentStudent) return;

    sendWhatsAppMessage({
      studentId: currentStudent.id,
      studentAdm: currentStudent.admNo,
      studentName: currentStudent.name,
      parentName: `Parent of ${currentStudent.name}`,
      parentPhone: "+254 712 000 111",
      sender: "teacher",
      text: composerText.trim(),
    });

    setComposerText("");
  };

  const handleCopyText = () => {
    const text = composerText.trim() || generateOfficialReportMessage();
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile(profileForm);
    setIsEditingProfile(false);
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1360px] mx-auto w-full font-body-md text-[var(--color-on-surface)]">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[var(--color-hairline-border)] gap-3">
        <div>
          <div className="flex items-center gap-2 font-caption text-caption text-[var(--color-on-surface-muted)] mb-1">
            <span>Staff Portal</span>
            <span>/</span>
            <span className="text-[var(--color-primary)] font-medium">
              Profile & WhatsApp Communication Hub
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Teacher Profile & Parent Broadcast
          </h1>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)]">
            Verified TSC teacher identity and official KCSE WhatsApp communication ledger.
          </p>
        </div>

        {/* Quick Edit Profile Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setProfileForm(teacherProfile);
            setIsEditingProfile(true);
          }}
          iconPosition="left"
          icon={
            <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">
              edit
            </span>
          }
          className="self-start sm:self-auto min-h-[44px]"
        >
          Edit Profile
        </Button>
      </div>

      {/* Top Teacher Profile Card */}
      <Card variant="outlined" className="mb-6">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[var(--color-on-surface)] text-[var(--color-surface)] flex items-center justify-center font-tabular-md font-bold text-lg shrink-0">
                {teacherProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(-2)
                  .join("")}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-headline-md text-headline-md text-[var(--color-on-surface)] font-semibold">
                    {teacherProfile.name}
                  </span>
                  <Badge variant="success" size="sm">
                    TSC VERIFIED
                  </Badge>
                </div>
                <div className="font-body-xs text-body-xs text-[var(--color-on-surface-muted)] mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>{teacherProfile.tscNumber}</span>
                  <span>•</span>
                  <span>{teacherProfile.department}</span>
                  <span>•</span>
                  <span>Stream: {teacherProfile.assignedStream}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-body-xs text-body-xs text-[var(--color-on-surface-muted)] pt-2 md:pt-0 border-t md:border-t-0 border-[var(--color-hairline-border)]">
              <div className="px-2.5 py-1.5 rounded bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)]">
                <span className="text-[var(--color-on-surface-disabled)] block text-[10px] uppercase font-label-caps">
                  Phone
                </span>
                <span className="font-tabular-sm text-[var(--color-on-surface)]">
                  {teacherProfile.phone}
                </span>
              </div>
              <div className="px-2.5 py-1.5 rounded bg-[var(--color-surface-container-low)] border border-[var(--color-hairline-border)]">
                <span className="text-[var(--color-on-surface-disabled)] block text-[10px] uppercase font-label-caps">
                  Subjects
                </span>
                <span className="text-[var(--color-on-surface)]">
                  {teacherProfile.subjectsTaught.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main WhatsApp Hub: 2-Column Responsive Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[500px]">
        {/* Left Column: Student Roster Picker */}
        <Card variant="outlined" className="lg:col-span-4 flex flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="p-3 bg-[var(--color-surface-container-low)] border-b border-[var(--color-hairline-border)] flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider text-[11px]">
                Class Roster ({filteredStudents.length})
              </span>
              <span className="font-tabular-sm text-tabular-sm text-[var(--color-primary)] font-semibold">
                {activeStream}
              </span>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto max-h-[320px] lg:max-h-[560px] divide-y divide-[var(--color-hairline-border)]/60 p-2">
              {filteredStudents.map((student) => {
                const standing = rankings.find((r) => r.student.id === student.id);
                const isSelected = student.id === selectedStudentId;
                const studentMsgCount = whatsAppMessages.filter(
                  (m) => m.studentId === student.id,
                ).length;

                return (
                  <Button
                    key={student.id}
                    variant={isSelected ? "primary" : "ghost"}
                    className={`w-full text-left justify-start min-h-[54px] px-3 ${
                      isSelected
                        ? "bg-[var(--color-primary-container)] border-l-3 border-[var(--color-primary)]"
                        : "hover:bg-[var(--color-surface-container-low)]"
                    }`}
                    onClick={() => setSelectedStudentId(student.id)}
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-hairline-border)] flex items-center justify-center font-tabular-sm text-xs font-medium text-[var(--color-on-surface)] shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-xs text-[var(--color-on-surface)] line-clamp-1">
                          {student.name}
                        </div>
                        <div className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)] text-[10px]">
                          ADM {student.admNo} ·{" "}
                          {standing ? `#${standing.rank} (${standing.meanGrade})` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {studentMsgCount > 0 && (
                        <Badge
                          variant="success"
                          size="sm"
                          className="text-[10px] w-5 h-5 p-0 flex items-center justify-center"
                        >
                          {studentMsgCount}
                        </Badge>
                      )}
                      <span className="material-symbols-outlined text-[16px] text-[var(--color-on-surface-disabled)]">
                        chevron_right
                      </span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: WhatsApp Interactive Thread & Broadcast Composer */}
        <Card variant="outlined" className="lg:col-span-8 flex flex-col overflow-hidden">
          {/* Thread Header */}
          <CardContent className="p-3 bg-[var(--color-surface-container-low)] border-b border-[var(--color-hairline-border)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[var(--color-success)] text-[var(--color-on-success)] flex items-center justify-center font-bold text-sm">
                💬
              </div>
              <div>
                <div className="font-semibold text-xs text-[var(--color-on-surface)] flex items-center gap-2">
                  <span>Parent of {currentStudent?.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]"></span>
                  <span className="font-caption text-caption text-[var(--color-success)]">
                    WhatsApp Active
                  </span>
                </div>
                <div className="font-tabular-sm text-tabular-sm text-[var(--color-on-surface-muted)] text-[11px]">
                  Candidate ADM: {currentStudent?.admNo} · Mean: {currentStanding?.meanGrade} (
                  {currentStanding?.meanPoints.toFixed(1)} pts) · Rank: #{currentStanding?.rank}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendOfficialBroadcast}
                iconPosition="left"
                icon={<span className="material-symbols-outlined text-[16px]">campaign</span>}
                className="min-h-[40px]"
              >
                Post Official Report
              </Button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(composerText.trim() || generateOfficialReportMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer min-h-[40px]"
                title="Open directly in WhatsApp Web or Mobile App"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Open in WhatsApp</span>
              </a>
            </div>
          </CardContent>

          {/* Quick Template Chips */}
          <div className="px-3 py-2 bg-[var(--color-surface-container-low)] border-b border-[var(--color-hairline-border)] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[var(--color-on-surface-muted)] font-medium shrink-0">
              Templates:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setComposerText(
                  `Dear Parent, ${currentStudent?.name} scored ${currentStanding?.meanGrade} in ${activeExam}. Please review weak subjects with extra homework.`,
                )
              }
              className="shrink-0 text-[11px]"
            >
              Academic Notice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setComposerText(
                  `Congratulations! ${currentStudent?.name} ranked #${currentStanding?.rank} in ${activeStream} with Grade ${currentStanding?.meanGrade}. Keep up the great spirit!`,
                )
              }
              className="shrink-0 text-[11px]"
            >
              Top Honor Praise
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setComposerText(
                  `Reminder: Term 3 commences on ${schoolConfig.termOpeningDate || "1st Sept"}. Ensure all clearance forms are signed.`,
                )
              }
              className="shrink-0 text-[11px]"
            >
              Term Opening
            </Button>
          </div>

          {/* Message Thread History */}
          <CardContent className="flex-1 p-4 overflow-y-auto max-h-[380px] bg-[var(--color-surface-container)]/30 space-y-3">
            {threadMessages.length === 0 ? (
              <div className="text-center py-10 text-[var(--color-on-surface-muted)] font-body-xs text-body-xs">
                <span className="material-symbols-outlined text-3xl text-[var(--color-on-surface-disabled)] mb-2 block">
                  chat_bubble_outline
                </span>
                No WhatsApp messages logged yet for {currentStudent?.name}.
                <br />
                Click <strong>"Post Official Report"</strong> above or type below to send.
              </div>
            ) : (
              threadMessages.map((msg) => {
                const isTeacher = msg.sender === "teacher";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isTeacher ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-lg font-body-xs text-body-xs leading-relaxed shadow-xs whitespace-pre-wrap ${
                        isTeacher
                          ? "bg-[var(--color-success-container)] text-[var(--color-on-success-container)] rounded-tr-none"
                          : "bg-[var(--color-surface)] text-[var(--color-on-surface)] rounded-tl-none border border-[var(--color-hairline-border)]"
                      }`}
                    >
                      <div className="font-semibold text-[10px] text-[var(--color-on-surface-muted)] mb-1">
                        {isTeacher ? "You (Class Teacher)" : msg.parentName}
                      </div>
                      <div>{msg.text}</div>
                      <div className="flex items-center justify-end gap-1 mt-1.5 font-tabular-sm text-tabular-sm text-[var(--color-on-surface-disabled)] text-[9px]">
                        <span>{msg.timestamp}</span>
                        {isTeacher && (
                          <span
                            className={`text-[12px] font-bold ${
                              msg.status === "read"
                                ? "text-blue-500"
                                : "text-[var(--color-on-surface-disabled)]"
                            }`}
                          >
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>

          {/* Fixed Composer Bar */}
          <form
            onSubmit={handleSendCustomMessage}
            className="p-2 sm:p-3 bg-[var(--color-surface-container-low)] border-t border-[var(--color-hairline-border)] flex items-center gap-2"
          >
            <Textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder={`Message parent of ${currentStudent?.name || "student"}...`}
              rows={1}
              className="flex-1 min-h-[44px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendCustomMessage();
                }
              }}
            />

            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
              aria-label="Copy message text"
              className="min-h-[44px] min-w-[44px]"
            >
              <span className="material-symbols-outlined text-[18px] text-[var(--color-on-surface-muted)]">
                {copiedNotification ? "check" : "content_copy"}
              </span>
            </IconButton>

            <Button
              type="submit"
              disabled={!composerText.trim()}
              size="sm"
              iconPosition="right"
              icon={<span className="material-symbols-outlined text-[16px]">send</span>}
              className="min-h-[44px] shrink-0"
            >
              Send
            </Button>
          </form>
        </Card>

        {/* Profile Edit Sheet */}
        <Sheet open={isEditingProfile} onOpenChange={setIsEditingProfile} side="right">
          <div className="max-w-lg w-full p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline-border)] mb-3">
              <CardTitle className="font-headline-md text-headline-md">
                Edit Teacher Profile
              </CardTitle>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingProfile(false)}
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </IconButton>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 font-body-xs text-body-xs">
              <div>
                <label className="block text-[var(--color-on-surface-muted)] font-medium mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] font-medium mb-1">
                    TSC Number
                  </label>
                  <Input
                    type="text"
                    value={profileForm.tscNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, tscNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] font-medium mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--color-on-surface-muted)] font-medium mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] font-medium mb-1">
                    Department
                  </label>
                  <Input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-on-surface-muted)] font-medium mb-1">
                    Assigned Stream
                  </label>
                  <Input
                    type="text"
                    value={profileForm.assignedStream}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, assignedStream: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-hairline-border)] mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(false)}
                  className="min-h-[44px]"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="min-h-[44px]">
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </Sheet>
      </div>
    </div>
  );
};
