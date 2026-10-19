import React, { useMemo, useState } from "react";
import { useGrading } from "../context/GradingContext";
import { feeBalance, getContact, ops, smsSegments, useSchoolOps } from "../lib/schoolOps";

const TEMPLATES: { name: string; text: string }[] = [
  {
    name: "Fee reminder",
    text: "Dear {parent}, {student} (Adm {adm}) has a fee balance of KES {balance}. Kindly clear before the end of term. Thank you.",
  },
  {
    name: "Results ready",
    text: "Dear {parent}, {student} scored a mean grade {grade} (rank {rank}) in {exam}. Log in to the Parent Portal for the full report.",
  },
  {
    name: "Meeting",
    text: "Dear {parent}, you are invited to a parents meeting on Friday 8am at {school}. Your attendance is highly appreciated.",
  },
  {
    name: "Closing day",
    text: "Dear {parent}, {school} closes on {closing}. Please ensure {student} is picked up with all fees cleared.",
  },
];

type Audience = "stream" | "all" | "defaulters";

export const BulkSmsView: React.FC = () => {
  const { students, filteredStudents, rankings, schoolConfig, activeStream, activeExam } =
    useGrading();
  const store = useSchoolOps();
  const [audience, setAudience] = useState<Audience>("stream");
  const [text, setText] = useState(TEMPLATES[0]?.text ?? "");
  const [result, setResult] = useState("");

  const pool = audience === "all" ? students : filteredStudents;
  const recipients = useMemo(
    () =>
      pool
        .filter((s) => s.status === "Active")
        .filter((s) => audience !== "defaulters" || feeBalance(store, s.id).balance > 0),
    [pool, audience, store],
  );

  const render = (s: (typeof students)[number]) => {
    const c = getContact(store, s);
    const r = rankings.find((x) => x.student.id === s.id);
    return text
      .replace(/{parent}/g, c.parentName)
      .replace(/{student}/g, s.name)
      .replace(/{adm}/g, s.admNo)
      .replace(/{balance}/g, feeBalance(store, s.id).balance.toLocaleString())
      .replace(/{grade}/g, r ? r.meanGrade : "—")
      .replace(/{rank}/g, r ? String(r.rank) : "—")
      .replace(/{exam}/g, activeExam)
      .replace(/{school}/g, schoolConfig.schoolName)
      .replace(/{closing}/g, schoolConfig.termClosingDate || "TBA");
  };

  const preview = recipients[0] ? render(recipients[0]) : "";
  const segs = smsSegments(preview);
  const label =
    audience === "all"
      ? "All students"
      : audience === "defaulters"
        ? `Fee defaulters · ${activeStream}`
        : activeStream;

  const send = () => {
    if (!recipients.length || !text.trim()) return;
    ops.logSms({
      audience: label,
      recipients: recipients.length,
      segments: segs * recipients.length,
      text,
      sample: getContact(store, recipients[0]!).phone,
    });
    setResult(`${recipients.length} message(s) queued (${segs * recipients.length} SMS units).`);
  };

  const copyNumbers = async () => {
    const nums = recipients.map((s) => getContact(store, s).phone).join(", ");
    try {
      await navigator.clipboard.writeText(nums);
      setResult("Phone numbers copied.");
    } catch {
      setResult(nums);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 text-[#111111]">
      <section className="pb-4 border-b border-[#DDD6C7]">
        <h1 className="font-headline-lg text-headline-lg tracking-tight">Bulk SMS</h1>
        <p className="text-xs sm:text-sm text-[#5F5E5E] mt-1">
          Message many parents with one click. Merge fields personalise each text.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 py-5">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["stream", activeStream],
                ["all", "Whole school"],
                ["defaulters", "Fee defaulters"],
              ] as [Audience, string][]
            ).map(([id, l]) => (
              <button
                key={id}
                type="button"
                onClick={() => setAudience(id)}
                className={`h-9 px-3 rounded border text-sm ${audience === id ? "bg-[#111111] text-white border-[#111111]" : "border-[#DDD6C7] hover:bg-[#F2EDE3]"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setText(t.text)}
                className="h-8 px-3 rounded-full border border-[#DDD6C7] text-xs hover:bg-[#F2EDE3]"
              >
                {t.name}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full border border-[#DDD6C7] bg-[#FBF8F1] rounded p-3 text-sm"
          />
          <p className="text-[11px] text-[#5F5E5E] font-mono">
            {"{parent} {student} {adm} {balance} {grade} {rank} {exam} {school} {closing}"}
          </p>
          <div className="border border-dashed border-[#DDD6C7] rounded p-3 text-sm bg-[#FBF8F1]">
            <div className="text-[11px] uppercase tracking-wider text-[#5F5E5E] mb-1">
              Preview · {recipients[0]?.name || "no recipients"}
            </div>
            {preview || "—"}
            <div className="text-[11px] text-[#5F5E5E] mt-2">
              {preview.length} chars · {segs} SMS per recipient
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={send}
              disabled={!recipients.length}
              className="h-10 px-5 rounded bg-[#C2410C] text-white font-semibold text-sm disabled:opacity-40"
            >
              Send to {recipients.length} parent{recipients.length === 1 ? "" : "s"}
            </button>
            <button
              type="button"
              onClick={copyNumbers}
              className="h-10 px-4 rounded border border-[#DDD6C7] text-sm hover:bg-[#F2EDE3]"
            >
              Copy numbers
            </button>
            {result && <span className="text-sm text-[#5F5E5E]">{result}</span>}
          </div>
          <p className="text-[11px] text-[#9A958A]">
            Messages are logged here. No SMS gateway is connected yet, so nothing leaves the device
            until you plug in a provider (e.g. Africa&apos;s Talking).
          </p>
        </div>

        <aside className="border border-[#DDD6C7] rounded bg-[#FBF8F1] p-4 h-fit">
          <h2 className="font-semibold text-sm mb-2">Sent log</h2>
          {store.smsLog.length === 0 && <p className="text-sm text-[#5F5E5E]">Nothing sent yet.</p>}
          <ul className="space-y-3 max-h-[480px] overflow-y-auto">
            {store.smsLog.map((m) => (
              <li key={m.id} className="text-xs border-b border-[#EEE8DA] pb-2">
                <div className="font-medium">
                  {m.audience} · {m.recipients} recipient{m.recipients === 1 ? "" : "s"}
                </div>
                <div className="text-[#5F5E5E]">{new Date(m.sentAt).toLocaleString()}</div>
                <div className="mt-1 line-clamp-2">{m.text}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};
