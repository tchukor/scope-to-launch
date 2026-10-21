import React, { useEffect, useMemo, useState } from "react";
import { useGrading } from "../context/GradingContext";
import {
  AttendanceMark,
  attendanceSummary,
  getContact,
  ops,
  smsSegments,
  useSchoolOps,
} from "../lib/schoolOps";
import { Card, CardHeader, CardTitle, CardContent } from "@/chokur/components/ui";
import { Button, IconButton } from "@/chokur/components/ui";
import { Badge, StatusBadge } from "@/chokur/components/ui";
import { Input } from "@/chokur/components/ui";
import { DataTable, TableHeader, TableHead, TableRow, TableCell } from "@/chokur/components/ui";

const today = () => new Date().toISOString().slice(0, 10);

const MARKS: { id: AttendanceMark; label: string; variant: "success" | "warning" | "error" }[] = [
  { id: "P", label: "Present", variant: "success" },
  { id: "L", label: "Late", variant: "warning" },
  { id: "A", label: "Absent", variant: "error" },
];

export const AttendanceView: React.FC = () => {
  const { filteredStudents, activeStream, setActiveView } = useGrading();
  const store = useSchoolOps();
  const [date, setDate] = useState(today());
  const [draft, setDraft] = useState<Record<string, AttendanceMark>>({});
  const [savedAt, setSavedAt] = useState<string>("");
  const [notice, setNotice] = useState("");

  const key = `${date}|${activeStream}`;
  useEffect(() => {
    setDraft(store.attendance[key] || {});
    setSavedAt(store.attendance[key] ? "Saved" : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const students = useMemo(
    () => filteredStudents.filter((s) => s.status === "Active"),
    [filteredStudents],
  );
  const counts = useMemo(() => {
    const c = { P: 0, L: 0, A: 0, unmarked: 0 };
    students.forEach((s) => {
      const m = draft[s.id];
      if (m) c[m]++;
      else c.unmarked++;
    });
    return c;
  }, [students, draft]);

  const setMark = (id: string, m: AttendanceMark) => {
    setDraft((d) => ({ ...d, [id]: m }));
    setSavedAt("");
  };
  const markAll = (m: AttendanceMark) => {
    const next: Record<string, AttendanceMark> = {};
    students.forEach((s) => (next[s.id] = m));
    setDraft(next);
    setSavedAt("");
  };
  const save = () => {
    ops.saveAttendance(date, activeStream, draft);
    setSavedAt("Saved");
    setNotice("");
  };

  const smsAbsentees = () => {
    const absent = students.filter((s) => draft[s.id] === "A");
    if (!absent.length) {
      setNotice("No absent students marked for this date.");
      return;
    }
    ops.saveAttendance(date, activeStream, draft);
    absent.forEach((s) => {
      const c = getContact(store, s);
      const text = `Dear ${c.parentName}, ${s.name} (Adm ${s.admNo}) was marked absent on ${date}. Kindly confirm the reason.`;
      ops.logSms({
        audience: `Absent · ${activeStream}`,
        recipients: 1,
        segments: smsSegments(text),
        text,
        sample: c.phone,
      });
    });
    setNotice(`${absent.length} absence alert(s) queued. See Bulk SMS for the log.`);
  };

  const exportCsv = () => {
    const rows = [["Adm No", "Name", "Stream", "Present", "Late", "Absent", "Rate %"]];
    students.forEach((s) => {
      const a = attendanceSummary(store, s.id);
      rows.push([
        s.admNo,
        s.name,
        s.stream,
        String(a.present),
        String(a.late),
        String(a.absent),
        a.rate === null ? "" : String(a.rate),
      ]);
    });
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${activeStream.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:px-8 font-body-md text-[var(--color-on-surface)]">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[var(--color-hairline-border)]">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[var(--color-on-surface)] tracking-tight">
            Attendance
          </h1>
          <p className="font-body-md text-xs sm:text-body-md text-[var(--color-on-surface-muted)] mt-1">
            {activeStream} · mark the register from your phone
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value || today())}
            className="w-auto min-w-[160px]"
          />
          <Button variant="outline" size="sm" onClick={() => markAll("P")} className="min-h-[40px]">
            All Present
          </Button>
          <Button
            size="sm"
            onClick={save}
            className="min-h-[40px]"
            iconPosition="left"
            icon={<span className="material-symbols-outlined text-[16px]">save</span>}
          >
            Save Register
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              Present
            </div>
            <div className="text-2xl font-bold text-[var(--color-success)]">{counts.P}</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              Late
            </div>
            <div className="text-2xl font-bold text-[var(--color-warning)]">{counts.L}</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              Absent
            </div>
            <div className="text-2xl font-bold text-[var(--color-error)]">{counts.A}</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="text-[11px] font-label-caps text-label-caps uppercase tracking-wider text-[var(--color-on-surface-muted)]">
              Not Marked
            </div>
            <div className="text-2xl font-bold text-[var(--color-on-surface-disabled)]">
              {counts.unmarked}
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="flex flex-wrap items-center gap-3 pb-3 text-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={smsAbsentees}
          className="min-h-[36px] border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error-container)]"
        >
          SMS Parents of Absentees
        </Button>
        <Button variant="outline" size="sm" onClick={exportCsv} className="min-h-[36px]">
          Export Term CSV
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveView("messaging")}
          className="min-h-[36px]"
        >
          Open Bulk SMS
        </Button>
        {savedAt && <span className="text-[var(--color-success)] font-medium">✓ {savedAt}</span>}
        {notice && (
          <Badge
            variant={notice.includes("queued") ? "success" : "outline"}
            className="flex items-center gap-2"
          >
            <span>{notice}</span>
            {notice.includes("queued") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("messaging")}
                className="p-0 min-h-0 text-xs"
              >
                View in Bulk SMS →
              </Button>
            )}
          </Badge>
        )}
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <CardContent className="p-0">
          <DataTable hoverable compact>
            <TableHeader>
              <tr className="h-10 border-b border-[var(--color-hairline-border)] bg-[var(--color-surface-container-low)] text-[11px] font-label-caps text-[var(--color-on-surface-muted)] uppercase tracking-wider">
                <TableHead scope="col" className="w-20 px-4">
                  ADM
                </TableHead>
                <TableHead scope="col" className="px-4">
                  STUDENT
                </TableHead>
                <TableHead scope="col" className="px-4">
                  TERM ATTENDANCE
                </TableHead>
                <TableHead scope="col" className="px-4">
                  TODAY
                </TableHead>
              </tr>
            </TableHeader>
            <tbody className="divide-y divide-[var(--color-hairline-border)] font-body-sm text-body-sm">
              {students.map((s) => {
                const a = attendanceSummary(store, s.id);
                return (
                  <TableRow
                    key={s.id}
                    className="h-12 hover:bg-[var(--color-surface-container)] transition-colors"
                  >
                    <TableCell className="px-4 font-tabular-sm text-[11px] text-[var(--color-on-surface-muted)]">
                      {s.admNo}
                    </TableCell>
                    <TableCell className="px-4 font-medium text-[var(--color-on-surface)]">
                      {s.name}
                    </TableCell>
                    <TableCell className="px-4 text-[var(--color-on-surface-muted)]">
                      {a.rate === null ? "—" : `${a.rate}% (${a.absent} absent)`}
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex gap-1.5">
                        {MARKS.map((m) => (
                          <Button
                            key={m.id}
                            variant={draft[s.id] === m.id ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setMark(s.id, m.id)}
                            className="min-h-[36px] px-3 text-xs font-medium"
                          >
                            {m.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
};
