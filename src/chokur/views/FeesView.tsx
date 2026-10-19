import React, { useMemo, useState } from "react";
import { useGrading } from "../context/GradingContext";
import { feeBalance, ops, useSchoolOps } from "../lib/schoolOps";

const kes = (n: number) => `KES ${n.toLocaleString()}`;

export const FeesView: React.FC = () => {
  const { filteredStudents, activeStream, schoolConfig, setActiveView } = useGrading();
  const store = useSchoolOps();
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"M-Pesa" | "Bank" | "Cash" | "Cheque">("M-Pesa");
  const [ref, setRef] = useState("");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      filteredStudents
        .filter(
          (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.admNo.includes(query),
        )
        .map((s) => ({ s, ...feeBalance(store, s.id) })),
    [filteredStudents, store, query],
  );
  const expected = filteredStudents.length * store.feePerTerm;
  const collected = filteredStudents.reduce((a, s) => a + feeBalance(store, s.id).paid, 0);
  const defaulters = filteredStudents.filter((s) => feeBalance(store, s.id).balance > 0).length;
  const pct = expected ? Math.round((collected / expected) * 100) : 0;

  const record = () => {
    const amt = Number(amount);
    if (!studentId || !(amt > 0)) return;
    ops.addPayment({
      studentId,
      amount: amt,
      date: new Date().toISOString().slice(0, 10),
      method,
      ref: ref.trim() || "—",
    });
    setAmount("");
    setRef("");
  };

  const recent = store.payments
    .filter((p) => filteredStudents.some((s) => s.id === p.studentId))
    .slice(0, 8);

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 text-[#111111]">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#DDD6C7]">
        <div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight">Fees</h1>
          <p className="text-xs sm:text-sm text-[#5F5E5E] mt-1">
            {activeStream} · {schoolConfig.term} {schoolConfig.academicYear}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm flex items-center gap-2">
            Fee per term (KES)
            <input
              type="number"
              min={0}
              value={store.feePerTerm}
              onChange={(e) => ops.setFeePerTerm(Number(e.target.value))}
              className="h-10 w-32 px-3 border border-[#DDD6C7] bg-[#FBF8F1] rounded"
            />
          </label>
          {defaulters > 0 && (
            <button
              type="button"
              onClick={() => setActiveView("messaging")}
              className="h-10 px-3 rounded bg-[#C2410C] text-white text-sm font-medium hover:opacity-90"
            >
              Remind {defaulters} parent{defaulters === 1 ? "" : "s"} by SMS
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4">
        {[
          ["Expected", kes(expected)],
          ["Collected", kes(collected)],
          ["Collection rate", `${pct}%`],
          ["With balance", `${defaulters} students`],
        ].map(([l, v]) => (
          <div key={l} className="border border-[#DDD6C7] bg-[#FBF8F1] rounded p-3">
            <div className="text-[11px] uppercase tracking-wider text-[#5F5E5E]">{l}</div>
            <div className="text-xl font-bold mt-0.5">{v}</div>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or adm no."
            className="h-10 w-full sm:w-72 mb-3 px-3 border border-[#DDD6C7] bg-[#FBF8F1] rounded text-sm"
          />
          <div className="border border-[#DDD6C7] rounded overflow-x-auto bg-[#FBF8F1]">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[#5F5E5E] border-b border-[#DDD6C7]">
                  <th className="p-3">Adm</th>
                  <th className="p-3">Student</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ s, paid, balance }) => (
                  <tr
                    key={s.id}
                    className="border-b border-[#EEE8DA] last:border-0 cursor-pointer hover:bg-[#F2EDE3]"
                    onClick={() => setStudentId(s.id)}
                  >
                    <td className="p-3 font-mono text-xs">{s.admNo}</td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-right">{paid.toLocaleString()}</td>
                    <td
                      className={`p-3 text-right font-semibold ${balance > 0 ? "text-[#C2410C]" : "text-emerald-700"}`}
                    >
                      {balance > 0 ? balance.toLocaleString() : "Cleared"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-[#DDD6C7] rounded bg-[#FBF8F1] p-4 space-y-3">
            <h2 className="font-semibold text-sm">Record payment</h2>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full h-10 px-2 border border-[#DDD6C7] rounded bg-white text-sm"
            >
              <option value="">Select student…</option>
              {filteredStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.admNo})
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (KES)"
              className="w-full h-10 px-3 border border-[#DDD6C7] rounded bg-white text-sm"
            />
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as typeof method)}
                className="h-10 px-2 border border-[#DDD6C7] rounded bg-white text-sm"
              >
                {["M-Pesa", "Bank", "Cash", "Cheque"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="Reference"
                className="flex-1 min-w-0 h-10 px-3 border border-[#DDD6C7] rounded bg-white text-sm"
              />
            </div>
            <button
              type="button"
              onClick={record}
              className="w-full h-10 rounded bg-[#C2410C] text-white font-semibold text-sm"
            >
              Save payment
            </button>
          </div>
          <div className="border border-[#DDD6C7] rounded bg-[#FBF8F1] p-4">
            <h2 className="font-semibold text-sm mb-2">Recent payments</h2>
            {recent.length === 0 && <p className="text-sm text-[#5F5E5E]">None recorded.</p>}
            <ul className="space-y-2">
              {recent.map((p) => {
                const st = filteredStudents.find((s) => s.id === p.studentId);
                return (
                  <li
                    key={p.id}
                    className="text-xs flex justify-between gap-2 border-b border-[#EEE8DA] pb-1.5"
                  >
                    <span>
                      {st?.name} · {p.method} · {p.date}
                    </span>
                    <span className="flex items-center gap-2 font-semibold">
                      {p.amount.toLocaleString()}
                      <button
                        type="button"
                        aria-label="Delete payment"
                        onClick={() => ops.removePayment(p.id)}
                        className="text-[#9A958A] hover:text-[#C2410C]"
                      >
                        ✕
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
