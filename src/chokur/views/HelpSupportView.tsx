import React, { useState } from "react";
import { useGrading } from "../context/GradingContext";
import { KCSE_GRADING_TABLE } from "../utils/grading";

interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Grading" | "Offline" | "Parents" | "CSV";
}

const FAQS: FAQItem[] = [
  {
    category: "Grading",
    question: "How does the KCSE 12-point grading scale work in Chokur?",
    answer:
      "Scores between 0 and 100 are automatically converted to letter grades and points according to standard KNEC thresholds: A (80-100, 12 pts), A- (75-79, 11 pts), down to E (0-29, 1 pt). The mean grade is calculated from candidate mean points. C+ (6.5 Mean Points) is the official cutoff for KUCCPS direct university admission.",
  },
  {
    category: "Grading",
    question: "What is the difference between 'Best 7' and 'Simple Mean' calculation?",
    answer:
      "In Best 7 mode (official KNEC KCSE standard), the system computes candidate aggregate from: Mathematics + 2 Languages + 2 Sciences + 1 Humanity + 1 best elective (max 84 points). In Simple Mean mode, a straight arithmetic average of all entered subject marks is used.",
  },
  {
    category: "Offline",
    question: "Can I use Chokur completely offline without an internet connection?",
    answer:
      "Yes! Chokur is a Progressive Web App (PWA) with client-authoritative dual-write storage (IndexedDB and LocalStorage). Once loaded, you can record marks, compute class rankings, take daily roll-call attendance, and print report cards with no internet required. Changes sync automatically when reconnected.",
  },
  {
    category: "CSV",
    question: "How do I format an Excel or Google Sheets spreadsheet for bulk marks import?",
    answer:
      "Your spreadsheet should contain: Column A: Admission Number (e.g. 4001), followed by subject codes as column headers (e.g. MAT, ENG, KIS, BIO, CHE, PHY, HIS, GEO, CRE, BST). You can download a pre-formatted CSV template from Settings & Backups › Download Template CSV.",
  },
  {
    category: "Parents",
    question: "How do parents log into the Parent Portal?",
    answer:
      "Parents navigate to the Parent Portal and enter their child's official Admission Number and their registered mobile phone number (+254 standard format). The system authenticates against school operations contact records. Parents can only see their own child's grades, fee ledger, and attendance.",
  },
  {
    category: "General",
    question: "How do I print official A4 report cards for the entire stream?",
    answer:
      "Go to Report Cards from the navigation menu or rankings ledger, click 'Print All' in the top action toolbar, or press Ctrl+P (Cmd+P on Mac). The layout automatically formats into official A4 portrait sheets with school archival headers, teacher remarks, and principal seal placeholders.",
  },
];

export const HelpSupportView: React.FC = () => {
  const { setActiveView, schoolConfig, role } = useGrading();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [supportSent, setSupportSent] = useState(false);

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCat = selectedCategory === "All" || f.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSent(true);
    setTimeout(() => {
      setSupportMessage("");
      setSupportSent(false);
    }, 3500);
  };

  return (
    <div className="w-full min-w-0 max-w-[1080px] mx-auto px-4 sm:px-8 py-6 sm:py-10 text-[#111111] font-body-md">
      {/* Header */}
      <section className="pb-6 border-b border-[#DDD6C7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5C5850] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
            <span>Knowledge Base &amp; Technical Documentation</span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Help Center &amp; User Manual
          </h1>
          <p className="text-xs sm:text-sm text-[#5F5E5E] mt-1">
            Guides for rapid marks entry, KCSE grading formulas, parent communication, and offline backups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveView(role === "Parent" ? "parent-portal" : "overview")}
          className="px-3.5 py-2 border border-[#DDD6C7] rounded bg-[#FBF8F1] hover:bg-[#F2EDE3] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to {role === "Parent" ? "Parent Portal" : "Overview"}</span>
        </button>
      </section>

      {/* Keyboard Shortcuts Reference Strip */}
      <section className="my-6 p-4 bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg">
        <h3 className="font-headline-sm text-xs font-bold uppercase tracking-wider text-[#111111] mb-2.5 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#C2410C]">keyboard</span>
          <span>Rapid Ledger Keyboard Shortcuts (Marks Entry &amp; Report Cards)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-white border border-[#DDD6C7] rounded">
            <kbd className="px-1.5 py-0.5 bg-[#EEE8DA] rounded font-mono text-[11px] font-bold">Tab / Enter</kbd>
            <p className="text-[11px] text-[#5F5E5E] mt-1">Move to next student / subject cell</p>
          </div>
          <div className="p-2 bg-white border border-[#DDD6C7] rounded">
            <kbd className="px-1.5 py-0.5 bg-[#EEE8DA] rounded font-mono text-[11px] font-bold">Arrow Keys</kbd>
            <p className="text-[11px] text-[#5F5E5E] mt-1">Navigate grid up/down/left/right</p>
          </div>
          <div className="p-2 bg-white border border-[#DDD6C7] rounded">
            <kbd className="px-1.5 py-0.5 bg-[#EEE8DA] rounded font-mono text-[11px] font-bold">[ and ]</kbd>
            <p className="text-[11px] text-[#5F5E5E] mt-1">Prev / Next report card in roster</p>
          </div>
          <div className="p-2 bg-white border border-[#DDD6C7] rounded">
            <kbd className="px-1.5 py-0.5 bg-[#EEE8DA] rounded font-mono text-[11px] font-bold">Ctrl + V</kbd>
            <p className="text-[11px] text-[#5F5E5E] mt-1">Paste rectangular block from Excel</p>
          </div>
        </div>
      </section>

      {/* KNEC 12-Point Scale Reference Table */}
      <section className="mb-8">
        <h3 className="font-headline-sm text-sm font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#C2410C]">bar_chart</span>
          <span>Official KCSE 12-Point Grading Scale &amp; University Cutoff</span>
        </h3>
        <div className="border border-[#DDD6C7] rounded overflow-x-auto bg-[#FBF8F1]">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-[#DDD6C7] text-left text-[10px] uppercase font-mono text-[#5F5E5E] bg-[#FEF9EF]">
                <th className="p-2.5">Grade</th>
                <th className="p-2.5">Score Range (%)</th>
                <th className="p-2.5 text-center">Points</th>
                <th className="p-2.5">Performance Tier</th>
                <th className="p-2.5">KUCCPS University Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6C7]/50 font-tabular-sm">
              {KCSE_GRADING_TABLE.map((row) => (
                <tr key={row.grade} className="hover:bg-[#F2EDE3]">
                  <td className="p-2.5 font-bold font-sans">{row.grade}</td>
                  <td className="p-2.5">{row.minScore} – {row.maxScore}%</td>
                  <td className="p-2.5 text-center font-bold text-[#C2410C]">{row.points}</td>
                  <td className="p-2.5 capitalize">{row.tier}</td>
                  <td className="p-2.5 font-sans">
                    {row.points >= 7 ? (
                      <span className="text-emerald-700 font-medium">Direct Degree Qualified</span>
                    ) : row.points >= 5 ? (
                      <span className="text-amber-700">Diploma / TVET Eligible</span>
                    ) : (
                      <span className="text-[#5F5E5E]">Certificate / Artisan</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Search and Category Filters for FAQ */}
      <section className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="font-headline-sm text-sm font-bold uppercase tracking-wider text-[#111111]">
            Frequently Asked Questions
          </h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs and guides..."
            className="px-3 py-1.5 text-xs bg-white border border-[#DDD6C7] rounded w-full sm:w-64 focus:outline-none focus:border-[#C2410C]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {["All", "Grading", "Offline", "CSV", "Parents", "General"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#111111] text-[#FEF9EF] font-semibold"
                  : "bg-[#FBF8F1] border border-[#DDD6C7] text-[#5F5E5E] hover:bg-[#F2EDE3]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion List */}
      <div className="space-y-3 mb-10">
        {filteredFaqs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#5F5E5E] bg-[#FBF8F1] border border-[#DDD6C7] rounded">
            No FAQ articles match your search query. Try searching for &quot;grading&quot;, &quot;offline&quot;, or &quot;CSV&quot;.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <details
              key={idx}
              className="p-3.5 bg-[#FBF8F1] border border-[#DDD6C7] rounded group cursor-pointer text-xs"
            >
              <summary className="font-semibold text-sm text-[#111111] flex items-center justify-between list-none">
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white border border-[#DDD6C7] text-[#5F5E5E]">
                    {faq.category}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#5F5E5E] group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-[#5F5E5E] pl-1 pt-2 border-t border-[#DDD6C7]/60">
                {faq.answer}
              </p>
            </details>
          ))
        )}
      </div>

      {/* Support Contact Form */}
      <section className="p-5 bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg">
        <h3 className="font-headline-sm text-sm font-bold text-[#111111] mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-[#C2410C]">support_agent</span>
          <span>Technical Support &amp; Assistance</span>
        </h3>
        <p className="text-xs text-[#5F5E5E] mb-4">
          Need assistance with marks entry, school term roll-over, or report card templates? Contact institutional support for {schoolConfig.schoolName}.
        </p>

        {supportSent ? (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            <span>Your support inquiry has been logged locally. Our technical administrator will follow up via your staff email or WhatsApp.</span>
          </div>
        ) : (
          <form onSubmit={handleSendSupport} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name / TSC Number"
                className="px-3 py-2 text-xs bg-white border border-[#DDD6C7] rounded focus:outline-none focus:border-[#C2410C]"
              />
              <input
                type="text"
                readOnly
                value={`${schoolConfig.schoolName} (${schoolConfig.contactPhoneEmail})`}
                className="px-3 py-2 text-xs bg-[#EEE8DA] border border-[#DDD6C7] rounded text-[#5F5E5E] cursor-not-allowed"
              />
            </div>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe your question or issue in detail..."
              rows={3}
              className="w-full p-3 text-xs bg-white border border-[#DDD6C7] rounded focus:outline-none focus:border-[#C2410C]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#C2410C] text-white rounded text-xs font-semibold hover:opacity-90 cursor-pointer min-h-[38px] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>Send Support Inquiry</span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
