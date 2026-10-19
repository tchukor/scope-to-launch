import React, { useState } from "react";
import { ChokurLogo } from "./brand/ChokurLogo";
import { useGrading } from "../context/GradingContext";
import { ROLES, Role } from "../utils/roles";
import { getBreadcrumbs, VIEW_METADATA } from "../utils/navigation";
import { TestPresetsModal } from "./TestPresetsModal";
import { LegalModals, LegalModalType } from "./LegalModals";

export const TopNavBar: React.FC = () => {
  const {
    activeStream,
    setActiveStream,
    activeExam,
    setActiveExam,
    activeView,
    setActiveView,
    streams,
    exams,
    saveStatus,
    canInstallPwa,
    installPwa,
    role,
    setRole,
    goBack,
    canGoBack,
    selectedStudentId,
    students,
  } = useGrading();

  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const breadcrumbs = getBreadcrumbs(activeView, role, currentStudent?.name);
  const currentViewMeta = VIEW_METADATA[activeView];

  return (
    <>
      <header className="fixed top-0 left-0 md:left-[72px] lg:left-[200px] xl:left-[220px] right-0 h-14 bg-[#FEF9EF] border-b border-[#DDD6C7] flex items-center justify-between px-2.5 sm:px-6 z-30 no-print transition-all duration-200">
        {/* Left Side: Back button + Mobile Logo + Breadcrumbs & Context Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          {/* Back button (always visible when deep in workflow) */}
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back to previous screen"
              title="Return to previous screen"
              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded border border-[#DDD6C7] bg-[#FBF8F1] hover:bg-[#F2EDE3] text-[#111111] cursor-pointer transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
          )}

          {/* Mobile Logo Brand Mark */}
          <div className="md:hidden flex items-center pr-1 shrink-0">
            <ChokurLogo
              variant="symbol"
              size={24}
              onClick={() => setActiveView("landing")}
              className="cursor-pointer"
            />
          </div>

          {/* Responsive Breadcrumbs Trail */}
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#5F5E5E] shrink-0 mr-1"
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-[#DDD6C7] font-light">/</span>}
                  {isLast ? (
                    <span className="font-semibold text-[#111111] truncate max-w-[140px] md:max-w-[180px]">
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveView(crumb.view)}
                      className="hover:text-[#111111] hover:underline cursor-pointer truncate max-w-[100px]"
                    >
                      {crumb.label}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <span className="hidden sm:inline-block text-[#DDD6C7] font-light">|</span>

          {/* Context: Stream Selector Chip */}
          {role !== "Parent" ? (
            <>
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setShowStreamModal(!showStreamModal);
                    setShowExamModal(false);
                    setShowRoleModal(false);
                  }}
                  type="button"
                  title="Filter by class stream"
                  className="border border-[#DDD6C7] bg-[#FBF8F1] px-2 sm:px-2.5 py-1 min-h-[36px] rounded text-[#111111] font-body-sm text-[12px] sm:text-[13px] font-medium flex items-center gap-1.5 transition-colors hover:bg-[#F2EDE3] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C2410C] shrink-0"></span>
                  <span className="truncate max-w-[90px] sm:max-w-none">{activeStream}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#5F5E5E]">
                    expand_more
                  </span>
                </button>
              </div>

              <span className="text-[#DDD6C7] font-light hidden xs:inline">/</span>

              {/* Exam Period Selector Chip */}
              <div className="relative shrink-0 hidden xs:block">
                <button
                  onClick={() => {
                    setShowExamModal(!showExamModal);
                    setShowStreamModal(false);
                    setShowRoleModal(false);
                  }}
                  type="button"
                  title="Switch examination period"
                  className="border border-transparent hover:border-[#DDD6C7] bg-transparent hover:bg-[#FBF8F1] text-[#5F5E5E] hover:text-[#111111] font-body-sm text-[12px] sm:text-[13px] px-1.5 sm:px-2 py-1 min-h-[36px] rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#5F5E5E] shrink-0">
                    calendar_today
                  </span>
                  <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-[190px]">
                    {activeExam}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#5F5E5E]">
                    expand_more
                  </span>
                </button>
              </div>
            </>
          ) : (
            <span className="text-xs font-medium text-[#5F5E5E] bg-[#FBF8F1] border border-[#DDD6C7] px-2.5 py-1 rounded">
              Parent Portal View
            </span>
          )}
        </div>

        {/* Right Side: Role Selector + PWA Install + Save / Sync Status */}
        <div className="flex items-center gap-2 sm:gap-3 text-[#5F5E5E] font-body-sm text-[12px] sm:text-[13px]">
          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleModal(!showRoleModal);
                setShowStreamModal(false);
                setShowExamModal(false);
              }}
              type="button"
              title="Switch user role mode"
              className="flex items-center gap-1 px-2 py-1 rounded border border-[#DDD6C7] bg-[#FBF8F1] hover:bg-[#F2EDE3] text-[#111111] text-[11px] font-semibold cursor-pointer min-h-[36px]"
            >
              <span className="material-symbols-outlined text-[15px] text-[#C2410C]">
                {role === "Admin"
                  ? "shield_person"
                  : role === "Teacher"
                    ? "school"
                    : "family_restroom"}
              </span>
              <span>{role}</span>
              <span className="material-symbols-outlined text-[14px] text-[#5F5E5E]">
                arrow_drop_down
              </span>
            </button>

            {showRoleModal && (
              <div className="absolute right-0 mt-1 w-44 bg-[#FBF8F1] border border-[#DDD6C7] rounded shadow-lg z-50 py-1 divide-y divide-[#DDD6C7]/50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#9A958A]">
                  Active User Role
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleModal(false);
                    }}
                    type="button"
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F2EDE3] cursor-pointer ${
                      role === r ? "font-bold text-[#C2410C] bg-[#F8F3E9]" : "text-[#111111]"
                    }`}
                  >
                    <span>{r}</span>
                    {role === r && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA Install Button */}
          {canInstallPwa && (
            <button
              onClick={installPwa}
              type="button"
              className="px-2.5 py-1 bg-[#111111] text-[#FEF9EF] rounded text-xs font-semibold flex items-center gap-1 hover:bg-neutral-800 transition-colors cursor-pointer min-h-[36px]"
              title="Install Chokur System as an offline application"
            >
              <span className="material-symbols-outlined text-[15px] text-[#C2410C]">download</span>
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Test Presets Modal Button */}
          {role !== "Parent" && (
            <button
              onClick={() => setShowPresetsModal(true)}
              type="button"
              className="hidden sm:flex items-center gap-1 text-[#5F5E5E] hover:text-[#111111] transition-colors px-2 py-1 rounded hover:bg-[#F2EDE3] cursor-pointer min-h-[36px]"
              title="Switch test data presets or reset database"
            >
              <span className="material-symbols-outlined text-[15px] text-[#C2410C]">science</span>
              <span className="text-xs font-medium">Presets</span>
            </button>
          )}

          {/* Legal & Compliance Policies Link */}
          <button
            onClick={() => setLegalModal("privacy")}
            type="button"
            className="hidden xl:flex items-center gap-1 text-[#5F5E5E] hover:text-[#111111] transition-colors px-2 py-1 rounded hover:bg-[#F2EDE3] cursor-pointer min-h-[36px]"
            title="Kenya DPA 2019 Privacy & School Terms"
          >
            <span className="material-symbols-outlined text-[15px] text-[#5F5E5E]">verified_user</span>
            <span className="text-xs font-medium">Policies</span>
          </button>

          {/* About & Spec Sheet Link */}
          <button
            onClick={() => setActiveView("landing")}
            type="button"
            className="hidden lg:flex items-center gap-1 text-[#5F5E5E] hover:text-[#111111] transition-colors px-2 py-1 rounded hover:bg-[#F2EDE3] cursor-pointer min-h-[36px]"
            title="View Chokur System Spec Sheet & Landing Page"
          >
            <span className="material-symbols-outlined text-[15px] text-[#C2410C]">info</span>
            <span className="text-xs font-medium">Spec</span>
          </button>

          {/* Save Status Indicator */}
          <div className="flex items-center gap-1.5">
            {saveStatus.state === "saving" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-amber-700 font-medium hidden md:inline text-xs">
                  Saving...
                </span>
              </>
            ) : saveStatus.state === "offline" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span className="hidden md:inline text-xs">Offline</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px] text-emerald-600">
                  cloud_done
                </span>
                <span className="text-[#5C5850] hidden md:inline text-xs">Saved</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Stream Selector Bottom Sheet / Modal */}
      {showStreamModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-start sm:pt-16 sm:pl-28 lg:pl-56 bg-black/30 animate-fadeIn">
          <div className="flex-1" onClick={() => setShowStreamModal(false)} />
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] rounded-t-xl sm:rounded-md shadow-xl max-w-sm w-full mx-auto sm:mx-0 overflow-hidden pb-4 sm:pb-1">
            <div className="px-4 py-2.5 bg-[#FEF9EF] border-b border-[#DDD6C7] flex items-center justify-between">
              <span className="text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider font-semibold">
                Select Class &amp; Stream
              </span>
              <button
                onClick={() => setShowStreamModal(false)}
                type="button"
                className="text-[#5F5E5E] hover:text-[#111111] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-[#DDD6C7]/50">
              {streams.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStream(s.name);
                    setShowStreamModal(false);
                  }}
                  type="button"
                  className={`w-full text-left px-4 py-3 sm:py-2 text-[13px] min-h-[48px] hover:bg-[#F2EDE3] flex items-center justify-between cursor-pointer ${
                    activeStream === s.name
                      ? "font-medium text-[#C2410C] bg-[#F8F3E9]"
                      : "text-[#111111]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{s.name}</span>
                    {s.classTeacher && (
                      <span className="text-[11px] text-[#5F5E5E]">{s.classTeacher}</span>
                    )}
                  </div>
                  {activeStream === s.name && (
                    <span className="text-[14px] font-bold text-[#C2410C]">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exam Selector Bottom Sheet / Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-start sm:pt-16 sm:pl-32 lg:pl-64 bg-black/30 animate-fadeIn">
          <div className="flex-1" onClick={() => setShowExamModal(false)} />
          <div className="bg-[#FBF8F1] border border-[#DDD6C7] rounded-t-xl sm:rounded-md shadow-xl max-w-md w-full mx-auto sm:mx-0 overflow-hidden pb-4 sm:pb-1">
            <div className="px-4 py-2.5 bg-[#FEF9EF] border-b border-[#DDD6C7] flex items-center justify-between">
              <span className="text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider font-semibold">
                Select Examination Period
              </span>
              <button
                onClick={() => setShowExamModal(false)}
                type="button"
                className="text-[#5F5E5E] hover:text-[#111111] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-[#DDD6C7]/50">
              {exams.map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    setActiveExam(e.name);
                    setShowExamModal(false);
                  }}
                  type="button"
                  className={`w-full text-left px-4 py-3 sm:py-2 text-[13px] min-h-[48px] hover:bg-[#F2EDE3] flex items-center justify-between cursor-pointer ${
                    activeExam === e.name
                      ? "font-medium text-[#C2410C] bg-[#F8F3E9]"
                      : "text-[#111111]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{e.name}</span>
                    <span className="text-[11px] text-[#5F5E5E]">
                      {e.type} · {e.term} ({e.year})
                    </span>
                  </div>
                  {activeExam === e.name && (
                    <span className="text-[14px] font-bold text-[#C2410C]">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Presets Modal */}
      <TestPresetsModal
        isOpen={showPresetsModal}
        onClose={() => setShowPresetsModal(false)}
      />

      {/* Kenya DPA & School Legal Modals */}
      <LegalModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
      />
    </>
  );
};
