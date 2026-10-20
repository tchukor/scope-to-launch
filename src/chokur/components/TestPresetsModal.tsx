import React, { useState } from "react";
import { TEST_PRESETS, TestPreset } from "../lib/presets";
import { useGrading } from "../context/GradingContext";
import { applyOpsState, ops } from "../lib/schoolOps";

interface TestPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestPresetsModal: React.FC<TestPresetsModalProps> = ({ isOpen, onClose }) => {
  const { setStudents, setMarks, setActiveStream, setActiveExam, setActiveView, resetToDemoData } =
    useGrading();

  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = (preset: TestPreset) => {
    const data = preset.generate();
    if (data.state.students) {
      setStudents(data.state.students);
    }
    if (data.state.marks) {
      setMarks(data.state.marks);
    }
    if (data.state.uiState?.activeStream) {
      setActiveStream(data.state.uiState.activeStream);
    }
    if (data.state.uiState?.activeExam) {
      setActiveExam(data.state.uiState.activeExam);
    }
    if (data.state.uiState?.activeView) {
      setActiveView(data.state.uiState.activeView);
    }

    if (data.opsData) {
      if (data.opsData.feePerTerm) {
        ops.setFeePerTerm(data.opsData.feePerTerm);
      }
      if (data.opsData.payments) {
        applyOpsState({
          payments: data.opsData.payments.map((p, i) => ({
            ...p,
            id: `pay-preset-${i}`,
            date: "2026-06-15",
          })),
        });
      }
      if (data.opsData.absentStudents && data.state.uiState?.activeStream) {
        const stream = data.state.uiState.activeStream;
        const today = new Date().toISOString().slice(0, 10);
        const marksRecord: Record<string, "P" | "A" | "L"> = {};
        const absSet = new Set(data.opsData.absentStudents);
        (data.state.students || []).forEach((st) => {
          marksRecord[st.id] = absSet.has(st.id) ? "A" : "P";
        });
        ops.saveAttendance(today, stream, marksRecord);
      }
    }

    setAppliedPresetId(preset.id);
    setNotification(`Successfully loaded ${preset.name}!`);
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  const handleFactoryReset = async () => {
    await resetToDemoData();
    setNotification("Database completely reset to clean demo seeds!");
    setConfirmReset(false);
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="presets-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FEF9EF] border-2 border-[#111111] rounded-lg shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#111111]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#FBF8F1] border-b border-[#DDD6C7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#C2410C] text-[24px]">science</span>
            <div>
              <h2
                id="presets-modal-title"
                className="font-headline-md text-base sm:text-lg font-bold text-[#111111]"
              >
                Test Data Presets &amp; Reset Sandbox
              </h2>
              <p className="text-xs text-[#5F5E5E]">
                Instantly simulate diverse cohorts, grading scenarios, and operational stress tests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close dialog"
            className="p-1 rounded hover:bg-[#F2EDE3] text-[#5F5E5E] hover:text-[#111111] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {notification && (
          <div className="bg-emerald-100 border-b border-emerald-300 text-emerald-900 px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shrink-0 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px] text-emerald-700">
              check_circle
            </span>
            <span>{notification}</span>
          </div>
        )}

        {/* Preset Cards List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 divide-y divide-[#DDD6C7]/60">
          {TEST_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="pt-3.5 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#111111]">{preset.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F2EDE3] text-[#5F5E5E] border border-[#DDD6C7]">
                    {preset.category}
                  </span>
                  <span className="text-xs font-mono text-[#C2410C] font-semibold">
                    Mean: {preset.meanGrade} (
                    {preset.meanPoints > 0 ? `${preset.meanPoints} pts` : "Pending"})
                  </span>
                </div>
                <p className="text-xs text-[#5F5E5E] leading-relaxed">{preset.highlight}</p>
                <div className="text-[11px] font-mono text-[#9A958A] flex items-center gap-3">
                  <span>Roster: {preset.studentCount} candidates</span>
                  <span>·</span>
                  <span>Stream: {preset.stream}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApply(preset)}
                className={`px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[38px] ${
                  appliedPresetId === preset.id
                    ? "bg-emerald-700 text-white"
                    : "bg-[#111111] text-[#FEF9EF] hover:bg-neutral-800"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {appliedPresetId === preset.id ? "done" : "play_circle"}
                </span>
                <span>{appliedPresetId === preset.id ? "Applied" : "Load Preset"}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer with Factory Reset */}
        <div className="px-5 py-3.5 bg-[#FBF8F1] border-t border-[#DDD6C7] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#5F5E5E]">
            {confirmReset ? (
              <span className="text-[#DC2626] font-semibold">
                Are you sure? This will clear all changes and restore original demo data.
              </span>
            ) : (
              <span>Need to start from scratch? Reset cleans local storage &amp; IndexedDB.</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {confirmReset ? (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 border border-[#DDD6C7] rounded text-xs text-[#5F5E5E] hover:text-[#111111] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFactoryReset}
                  className="px-3.5 py-1.5 bg-[#DC2626] text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Confirm Factory Reset
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3.5 py-1.5 border border-[#DDD6C7] bg-[#FEF9EF] hover:bg-[#F2EDE3] text-[#DC2626] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset Database to Defaults</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
