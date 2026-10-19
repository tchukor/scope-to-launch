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

const today = () => new Date().toISOString().slice(0, 10);

const MARKS: { id: AttendanceMark; label: string; on: string }[] = [
  { id: "P", label: "Present", on: "bg-emerald-600 text-white border-emerald-600" },
  { id: "L", label: "Late", on: "bg-amber-500 text-white border-amber-500" },
  { id: "A", label: "Absent", on: "bg-[#C2410C] text-white border-[#C2410C]" },
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
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 text-[#111111]">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#DDD6C7]">
        <div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight">Attendance</h1>
          <p className="text-xs sm:text-sm text-[#5F5E5E] mt-1">
            {activeStream} · mark the register from your phone
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value || today())}
            className="h-10 px-3 border border-[#DDD6C7] bg-[#FBF8F1] rounded text-sm"
          />
          <button
            type="button"
            onClick={() => markAll("P")}
            className="h-10 px-3 border border-[#DDD6C7] rounded text-sm hover:bg-[#F2EDE3]"
          >
            All present
          </button>
          <button
            type="button"
            onClick={save}
            className="h-10 px-4 rounded text-sm font-semibold bg-[#C2410C] text-white hover:bg-[#9A3412]"
          >
            Save register
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        {[
          ["Present", counts.P, "text-emerald-700"],
          ["Late", counts.L, "text-amber-600"],
          ["Absent", counts.A, "text-[#C2410C]"],
          ["Not marked", counts.unmarked, "text-[#5F5E5E]"],
        ].map(([label, n, color]) => (
          <div key={label as string} className="border border-[#DDD6C7] bg-[#FBF8F1] rounded p-3">
            <div className="text-[11px] uppercase tracking-wider text-[#5F5E5E]">{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{n as number}</div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-3 pb-3 text-sm">
        <button
          type="button"
          onClick={smsAbsentees}
          className="h-9 px-3 border border-[#C2410C] text-[#C2410C] rounded hover:bg-[#FBF8F1]"
        >
          SMS parents of absentees
        </button>
        <button
          type="button"
          onClick={exportCsv}
          className="h-9 px-3 border border-[#DDD6C7] rounded hover:bg-[#F2EDE3]"
        >
          Export term CSV
        </button>
        <button
          type="button"
          onClick={() => setActiveView("messaging")}
          className="h-9 px-3 underline text-[#5F5E5E]"
        >
          Open Bulk SMS
        </button>
        {savedAt && <span className="text-emerald-700 font-medium">✓ {savedAt}</span>}
        {notice && (
          <span className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-[#FBF8F1] border border-[#DDD6C7] text-[#111111] rounded">
            <span>{notice}</span>
            {notice.includes("queued") && (
              <button
                type="button"
                onClick={() => setActiveView("messaging")}
                className="underline font-bold text-[#C2410C] hover:text-[#9A3412] cursor-pointer"
              >
                View in Bulk SMS →
              </button>
            )}
          </span>
        )}
      </div>

      <div className="border border-[#DDD6C7] rounded overflow-x-auto bg-[#FBF8F1]">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-[#5F5E5E] border-b border-[#DDD6C7]">
              <th className="p-3">Adm</th>
              <th className="p-3">Student</th>
              <th className="p-3">Term attendance</th>
              <th className="p-3">Today</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const a = attendanceSummary(store, s.id);
              return (
                <tr key={s.id} className="border-b border-[#EEE8DA] last:border-0">
                  <td className="p-3 font-mono text-xs">{s.admNo}</td>
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-[#5F5E5E]">
                    {a.rate === null ? "—" : `${a.rate}% (${a.absent} absent)`}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      {MARKS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMark(s.id, m.id)}
                          className={`min-h-[36px] px-3 rounded border text-xs font-medium ${draft[s.id] === m.id ? m.on : "border-[#DDD6C7] text-[#5F5E5E] hover:bg-[#F2EDE3]"}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
