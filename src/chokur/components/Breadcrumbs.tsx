import React from "react";
import { useGrading } from "../context/GradingContext";
import { getBreadcrumbs } from "../utils/navigation";

export const Breadcrumbs: React.FC = () => {
  const { activeView, role, setActiveView, selectedStudentId, students } = useGrading();
  const breadcrumbs = getBreadcrumbs(activeView, role, students.find(s => s.id === selectedStudentId)?.name);
  if (activeView === "landing" || breadcrumbs.length <= 1) return null;
  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-[#5F5E5E] shrink-0 mr-1">
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-[#DDD6C7] font-light">/</span>}
            {isLast ? <span className="font-semibold text-[#111111] truncate max-w-[140px] md:max-w-[180px]">{crumb.label}</span> : <button type="button" onClick={() => setActiveView(crumb.view!)} className="hover:text-[#111111] hover:underline cursor-pointer truncate max-w-[100px]">{crumb.label}</button>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
