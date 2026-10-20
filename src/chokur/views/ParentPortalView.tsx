import React, { useMemo, useState } from "react";
import { GradeChip } from "../components/GradeChip";
import { useGrading } from "../context/GradingContext";
import { attendanceSummary, feeBalance, getContact, ops, useSchoolOps } from "../lib/schoolOps";

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
      <div className="w-full max-w-md mx-auto px-4 py-10 text-[#111111]">
        <h1 className="font-headline-lg text-headline-lg tracking-tight">Parent Portal</h1>
        <p className="text-sm text-[#5F5E5E] mt-1 mb-6">
          See your child&apos;s results, attendance and fee balance.
        </p>
        <div className="border border-[#DDD6C7] bg-[#FBF8F1] rounded p-4 space-y-3">
          <input
            value={adm}
            onChange={(e) => setAdm(e.target.value)}
            placeholder="Child's admission number"
            className="w-full h-11 px-3 border border-[#DDD6C7] rounded bg-white text-sm"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Registered parent phone (+254…)"
            className="w-full h-11 px-3 border border-[#DDD6C7] rounded bg-white text-sm"
          />
          {error && <p className="text-sm text-[#C2410C]">{error}</p>}
          <button
            type="button"
            onClick={signIn}
            className="w-full h-11 rounded bg-[#C2410C] text-white font-semibold text-sm"
          >
            View my child
          </button>
        </div>
        <p className="text-[11px] text-[#9A958A] mt-3">
          Demo: parent phone numbers are set under Parent Portal › Edit contact once signed in, or
          use a staff view. Data stays on this device.
        </p>
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-[#5F5E5E]">
            Staff: look up a parent&apos;s registered phone
          </summary>
          <select
            onChange={(e) => {
              const s = students.find((x) => x.id === e.target.value);
              if (s) {
                setAdm(s.admNo);
                setPhone(getContact(store, s).phone);
              }
            }}
            className="mt-2 w-full h-10 px-2 border border-[#DDD6C7] rounded bg-white"
          >
            <option value="">Pick a student to prefill…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.admNo})
              </option>
            ))}
          </select>
        </details>
      </div>
    );
  }

  const rows = subjects
    .map((sub) => ({ sub, mark: marks[student.id]?.[sub.code] }))
    .filter((r) => r.mark !== undefined && r.mark !== null);

  return (
    <div className="w-full min-w-0 max-w-[900px] mx-auto px-3 sm:px-6 py-4 sm:py-8 text-[#111111]">
      <section className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#DDD6C7]">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#5F5E5E]">
            {schoolConfig.schoolName}
          </p>
          <h1 className="font-headline-lg text-headline-lg tracking-tight">{student.name}</h1>
          <p className="text-sm text-[#5F5E5E]">
            Adm {student.admNo} · {student.stream}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedStudentId(student.id);
              setActiveView("report-cards");
            }}
            className="h-9 px-3 border border-[#DDD6C7] rounded text-sm hover:bg-[#F2EDE3]"
          >
            Printable report card
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="h-9 px-3 border border-[#DDD6C7] rounded text-sm hover:bg-[#F2EDE3] cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
        <div className="border border-[#DDD6C7] bg-[#FBF8F1] rounded p-3">
          <div className="text-[11px] uppercase tracking-wider text-[#5F5E5E]">Mean grade</div>
          <div className="mt-1">{standing ? <GradeChip grade={standing.meanGrade} /> : "—"}</div>
        </div>
        <div className="border border-[#DDD6C7] bg-[#FBF8F1] rounded p-3">
          <div className="text-[11px] uppercase tracking-wider text-[#5F5E5E]">Class rank</div>
          <div className="text-2xl font-bold">{standing ? `#${standing.rank}` : "—"}</div>
        </div>
        <div className="border border-[#DDD6C7] bg-[#FBF8F1] rounded p-3">
          <div className="text-[11px] uppercase tracking-wider text-[#5F5E5E]">Attendance</div>
          <div className="text-2xl font-bold">{att.rate === null ? "—" : `${att.rate}%`}</div>
          <div className="text-[11px] text-[#5F5E5E]">{att.absent} absent</div>
        </div>
        <div className="border border-[#DDD6C7] bg-[#FBF8F1] rounded p-3">
          <div className="text-[11px] uppercase tracking-wider text-[#5F5E5E]">Fee balance</div>
          <div
            className={`text-2xl font-bold ${fee.balance > 0 ? "text-[#C2410C]" : "text-emerald-700"}`}
          >
            KES {fee.balance.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5F5E5E]">Paid {fee.paid.toLocaleString()}</div>
        </div>
      </section>

      <h2 className="font-semibold text-sm mb-2">{activeExam}</h2>
      <div className="border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-x-auto">
        <table className="w-full text-sm min-w-[360px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-[#5F5E5E] border-b border-[#DDD6C7]">
              <th className="p-3">Subject</th>
              <th className="p-3 text-right">Mark</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="p-3 text-[#5F5E5E]" colSpan={2}>
                  No marks entered yet.
                </td>
              </tr>
            )}
            {rows.map(({ sub, mark }) => (
              <tr key={sub.id} className="border-b border-[#EEE8DA] last:border-0">
                <td className="p-3">{sub.name}</td>
                <td className="p-3 text-right font-semibold">{String(mark)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 border border-[#DDD6C7] rounded bg-[#FBF8F1] p-4 text-sm">
        {!editing ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              {contact.parentName} · {contact.phone}
            </span>
            <button
              type="button"
              className="underline text-[#5F5E5E]"
              onClick={() => {
                setForm(contact);
                setEditing(true);
              }}
            >
              Edit contact
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <input
              value={form.parentName}
              onChange={(e) => setForm({ ...form, parentName: e.target.value })}
              className="h-10 px-3 border border-[#DDD6C7] rounded bg-white flex-1 min-w-[160px]"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-10 px-3 border border-[#DDD6C7] rounded bg-white flex-1 min-w-[160px]"
            />
            <button
              type="button"
              onClick={() => {
                ops.setContact(student.id, form);
                setEditing(false);
              }}
              className="h-10 px-4 rounded bg-[#C2410C] text-white font-semibold"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
