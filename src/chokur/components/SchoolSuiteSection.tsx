import React, { useState } from "react";
import { ViewType } from "../types";

const FEATURES: { icon: string; title: string; text: string; view: ViewType }[] = [
  {
    icon: "fact_check",
    title: "Attendance",
    text: "Mark daily roll-call for each stream through the term, straight from your phone.",
    view: "attendance",
  },
  {
    icon: "sms",
    title: "Bulk SMS",
    text: "Send results, fee reminders and notices to many parents in one go.",
    view: "messaging",
  },
  {
    icon: "group",
    title: "Student records",
    text: "Admission numbers, streams and parent contacts, always at hand.",
    view: "students",
  },
  {
    icon: "edit_note",
    title: "Marks entry",
    text: "Enter exam marks quickly. KCSE grades and points work themselves out.",
    view: "marks-entry",
  },
  {
    icon: "badge",
    title: "Report forms",
    text: "Print report cards and merit lists, or save them as PDF.",
    view: "report-cards",
  },
  {
    icon: "family_restroom",
    title: "Parent view",
    text: "Show a parent their child\u2019s results, attendance and fee balance.",
    view: "parent-portal",
  },
];

const AUDIENCES = {
  Admins: [
    "Whole-school mean scores and grade spreads",
    "Stream and subject comparisons",
    "Fee balances in one place",
    "Backups you keep yourself",
  ],
  Teachers: [
    "Fast marks entry per subject",
    "Automatic grading and ranking",
    "Subject analysis by department",
    "Daily attendance in seconds",
  ],
  Parents: [
    "Clear report cards",
    "Results sent by SMS or WhatsApp",
    "Attendance record",
    "Fee balance summary",
  ],
} as const;

const WHY = [
  {
    icon: "bolt",
    title: "Fast on any device",
    text: "Works on phones, tablets and staffroom computers.",
  },
  {
    icon: "wifi_off",
    title: "Works offline",
    text: "No internet needed. Your records stay on the device.",
  },
  {
    icon: "insights",
    title: "Clear analysis",
    text: "Means, deviations and grade spreads, worked out for you.",
  },
  {
    icon: "touch_app",
    title: "Easy to pick up",
    text: "No tech know-how needed. Open it and start entering marks.",
  },
];

export const SchoolSuiteSection: React.FC<{ onOpen: (v: ViewType) => void }> = ({ onOpen }) => {
  const [tab, setTab] = useState<keyof typeof AUDIENCES>("Teachers");
  return (
    <>
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[#DDD6C7]">
        <span className="text-xs font-mono font-bold tracking-widest text-[#C2410C] uppercase block mb-2">
          Features
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight max-w-2xl mb-8">
          Less time on daily admin. More time on teaching.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#DDD6C7]">
          {FEATURES.map((f) => (
            <button
              key={f.title}
              type="button"
              onClick={() => onOpen(f.view)}
              className="group text-left p-5 sm:p-6 border-r border-b border-[#DDD6C7] bg-[#FBF8F1] hover:bg-[#F2EDE3] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-[#C2410C]">{f.icon}</span>
              <h3 className="mt-3 text-[15px] font-bold text-[#111111]">{f.title}</h3>
              <p className="mt-1 text-[13px] leading-5 text-[#5C5850]">{f.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#111111] group-hover:text-[#C2410C]">
                Open <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-[1200px] mx-auto border-b border-[#DDD6C7] grid lg:grid-cols-2 gap-10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#C2410C] uppercase block mb-2">
            Built for everyone in school
          </span>
          <div className="flex gap-0 border border-[#DDD6C7] rounded w-fit mb-5" role="tablist">
            {(Object.keys(AUDIENCES) as (keyof typeof AUDIENCES)[]).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${tab === k ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5C5850] hover:bg-[#F2EDE3]"}`}
              >
                {k}
              </button>
            ))}
          </div>
          <ul className="space-y-2.5">
            {AUDIENCES[tab].map((x) => (
              <li key={x} className="flex items-start gap-2 text-[14px] text-[#111111]">
                <span className="material-symbols-outlined text-[18px] text-[#C2410C]">check</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#C2410C] uppercase block mb-2">
            Why Chokur
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY.map((w) => (
              <div key={w.title} className="p-4 border border-[#DDD6C7] rounded bg-[#FBF8F1]">
                <span className="material-symbols-outlined text-[20px] text-[#111111]">
                  {w.icon}
                </span>
                <h3 className="mt-2 text-[14px] font-bold text-[#111111]">{w.title}</h3>
                <p className="mt-1 text-[12px] leading-4 text-[#5C5850]">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
