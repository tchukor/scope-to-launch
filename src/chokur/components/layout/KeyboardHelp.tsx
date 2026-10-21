import React, { useState } from "react";

const SHORTCUTS = [
  { keys: "Tab / Enter", description: "Move to next cell in marks grid", context: "Marks Entry" },
  { keys: "Arrow Keys", description: "Navigate grid up/down/left/right", context: "Marks Entry" },
  { keys: "[ / ]", description: "Previous / Next report card", context: "Report Cards" },
  { keys: "Ctrl + V", description: "Paste rectangular block from Excel", context: "Marks Entry" },
  { keys: "Escape", description: "Close modal / cancel edit", context: "Global" },
  { keys: "Ctrl + S", description: "Save all marks", context: "Marks Entry" },
];

export const KeyboardHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg border border-[#DDD6C7] bg-[#FBF8F1] hover:bg-[#F2EDE3] text-[#5F5E5E] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Keyboard shortcuts"
      >
        <span className="material-symbols-outlined text-[20px]">keyboard</span>
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fadeIn">
          <div onClick={() => setIsOpen(false)} className="absolute inset-0" />
          <div className="relative bg-[#FEF9EF] border border-[#DDD6C7] rounded-xl p-6 max-w-md w-full shadow-xl animate-slideUp max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DDD6C7]">
              <h3 className="font-headline-md text-[#111111]">Keyboard Shortcuts</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#5F5E5E] hover:text-[#111111] p-1"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {SHORTCUTS.map((s) => (
                <div
                  key={s.keys}
                  className="flex items-center gap-3 p-3 bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg"
                >
                  <kbd className="px-2 py-1 bg-white border border-[#DDD6C7] rounded font-mono text-xs font-bold text-[#111111] min-w-[80px] text-center">
                    {s.keys}
                  </kbd>
                  <div className="flex-1 text-sm text-[#111111]">{s.description}</div>
                  <span className="text-[10px] text-[#5F5E5E] font-mono uppercase">
                    {s.context}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
