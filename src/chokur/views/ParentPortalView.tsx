import React, { useMemo, useState } from "react";
import { GradeChip } from "../components/GradeChip";
import { useGrading } from "../context/GradingContext";
import { attendanceSummary, feeBalance, getContact, ops, useSchoolOps } from "../lib/schoolOps";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button, IconButton } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input, Select } from "../components/ui/Input";
import { DataTable, TableHeader, TableHead, TableRow, TableCell } from "../components/ui/DataTable";

export const ParentPortalView: React.FC = () => {
  const {
    students,
    rankings,
    subjects,
    marks,
    schoolConfig,
    activeExam,
    setSelectedStudentId,
    setActiveView,
  } = useGrading();
  const store = useSchoolOps();
  const [adm, setAdm] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState<string | null>(() => {
    try {
      if (typeof window !== "undefined") {
        const sessionId = sessionStorage.getItem("chokur.parent_auth_student_id");
        if (sessionId) return sessionId;
        return localStorage.getItem("chokur.parent_auth_student_id");
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ parentName: "", phone: "" });

  const norm = (p: string) => p.replace(/\D/g, "").slice(-9);

  const signIn = () => {
    const s = students.find((x) => x.admNo === adm.trim());
    if (!s || norm(getContact(store, s).phone) !== norm(phone)) {
      setError("Admission number and registered phone number do not match.");
      return;
    }
    setError("");
    setStudentId(s.id);
    setSelectedStudentId(s.id);
    try {
      sessionStorage.setItem("chokur.parent_auth_student_id", s.id);
      localStorage.setItem("chokur.parent_auth_student_id", s.id);
    } catch {
      // ignore
    }
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem("chokur.parent_auth_student_id");
      localStorage.removeItem("chokur.parent_auth_student_id");
    } catch {
      // ignore
    }
    setStudentId(null);
  };

  const student = students.find((s) => s.id === studentId);
  const standing = useMemo(
    () => rankings.find((r) => r.student.id === studentId),
    [rankings, studentId],
  );
  const contact = student ? getContact(store, student) : null;
  const fee = student ? feeBalance(store, student.id) : null;
  const att = student ? attendanceSummary(store, student.id) : null;

  if (!student || !contact || !fee || !att) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-10 font-body-md text-[var(--color-on-surface)]">
        <h1 className="font-headline-lg text-headline-lg tracking-tight">Parent Portal</h1>
        <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)] mt-1 mb-6">
          See your child&apos;s results, attendance and fee balance.
        </p>
        <Card variant="outlined" className="p-4 space-y-3">
          <Input
            label="Child's Admission Number"
            type="text"
            value={adm}
            onChange={(e) => setAdm(e.target.value)}
            placeholder="Enter admission number"
          />
          <Input
            label="Registered Parent Phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+254..."
          />
          {error && <Badge variant="error" className="w-full justify-center">{error}</Badge>}
          <Button onClick={signIn} className="w-full" size="lg">
            View my child
          </Button>
        </Card>
        <p className="font-caption text-caption text-[var(--color-on-surface-muted)] mt-3">
          Demo: parent phone numbers are set under Parent Portal › Edit contact once signed in, or
          use a staff view. Data stays on this device.
        </p>
        <details className="mt-4 font-body-sm text-body-sm">
          <summary className="cursor-pointer text-[var(--color-on-surface-muted)]">
            Staff: look up a parent&apos;s registered phone
          </summary>
          <Select
            onChange={(e) => {
              const s = students.find((x) => x.id === e.target.value);
              if (s) {
                setAdm(s.admNo);
                setPhone(getContact(store, s).phone);
              }
            }}
            className="mt-2 w-full"
            placeholder="Pick a student to prefill…"
          >
            <option value="">Pick a student to prefill…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.admNo})
              </option>
            ))}
          </Select>
        </details>
      </div>
    );
  }

  const rows = subjects
    .map((sub) => ({ sub, mark: marks[student.id]?.[sub.code] }))
    .filter((r) => r.mark !== undefined && r.mark !== null);

  return (
    <div className="w-full min-w-0 max-w-[900px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-body-md text-[var(--color-on-surface)]">
      <section className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[var(--color-hairline-border)]">
        <div>
          <p className="font-caption text-caption text-[var(--color-on-surface-muted)] uppercase tracking-wider">
            {schoolConfig.schoolName}
          </p>
          <h1 className="font-headline-lg text-headline-lg tracking-tight">{student.name}</h1>
          <p className="font-body-sm text-body-sm text-[var(--color-on-surface-muted)]">
            Adm {student.admNo} · {student.stream}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedStudentId(student.id);
              setActiveView("report-cards");
            }}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">print</span>}
          >
            Printable report card
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">logout</span>}
          >
            Sign out
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] text-[11px] uppercase tracking-wider">Mean grade</div>
            <div className="mt-1">{standing ? <GradeChip grade={standing.meanGrade} /> : "—"}</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] text-[11px] uppercase tracking-wider">Class rank</div>
            <div className="font-headline-lg text-headline-lg font-bold text-[var(--color-on-surface)]">{standing ? `#${standing.rank}` : "—"}</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] text-[11px] uppercase tracking-wider">Attendance</div>
            <div className="font-headline-lg text-headline-lg font-bold text-[var(--color-on-surface)]">{att.rate === null ? "—" : `${att.rate}%`}</div>
            <div className="font-body-xs text-body-xs text-[var(--color-on-surface-muted)]">{att.absent} absent</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="font-label-caps text-label-caps text-[var(--color-on-surface-muted)] text-[11px] uppercase tracking-wider">Fee balance</div>
            <div className={`font-headline-lg text-headline-lg font-bold ${fee.balance > 0 ? "text-[var(--color-error)]" : "text-[var(--color-success)]"}`}>
              KES {fee.balance.toLocaleString()}
            </div>
            <div className="font-body-xs text-body-xs text-[var(--color-on-surface-muted)]">Paid {fee.paid.toLocaleString()}</div>
          </CardContent>
        </Card>
      </section>

      <h2 className="font-headline-sm text-headline-sm font-semibold mb-2">{activeExam}</h2>
      <Card variant="outlined" className="overflow-x-auto">
        <CardContent className="p-0">
          <DataTable compact>
            <TableHeader>
              <tr className="h-9 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] font-label-caps text-label-caps text-[10px] text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                <TableHead scope="col" className="px-3">Subject</TableHead>
                <TableHead scope="col" className="px-3 text-right">Mark</TableHead>
              </tr>
            </TableHeader>
            <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="px-3 py-4 text-center text-[var(--color-on-surface-muted)]">
                    No marks entered yet.
                  </TableCell>
                </TableRow>
              )}
              {rows.map(({ sub, mark }) => (
                <TableRow key={sub.id} className="h-9 hover:bg-[var(--color-surface-container)]">
                  <TableCell className="px-3 text-[var(--color-on-surface)]">{sub.name}</TableCell>
                  <TableCell className="px-3 text-right font-semibold font-tabular-sm text-[var(--color-on-surface)]">{String(mark)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        </CardContent>
      </Card>

      <Card variant="outlined" className="mt-5 p-4">
        {!editing ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[var(--color-on-surface)]">{contact.parentName} · {contact.phone}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setForm(contact);
                setEditing(true);
              }}
              className="p-0 min-h-0 text-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Edit contact
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Input
              value={form.parentName}
              onChange={(e) => setForm({ ...form, parentName: e.target.value })}
              placeholder="Parent name"
              className="flex-1 min-w-[160px]"
            />
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
              className="flex-1 min-w-[160px]"
            />
            <Button
              size="sm"
              onClick={() => {
                ops.setContact(student.id, form);
                setEditing(false);
              }}
              className="min-h-[40px]"
            >
              Save
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};