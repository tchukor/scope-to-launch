import React, { useEffect } from "react";
import { useGrading } from "../context/GradingContext";
import { canSee, homeFor } from "../utils/roles";
import { UnauthorizedState } from "./States";

interface ProtectedViewProps { children: React.ReactNode; requiredRole?: string; }

export const ProtectedView: React.FC<ProtectedViewProps> = ({ children, requiredRole }) => {
  const { role, activeView, setActiveView } = useGrading();
  const isAuthorized = canSee(role, activeView);
  useEffect(() => { if (!isAuthorized && activeView !== "landing") setActiveView(homeFor(role)); }, [activeView, role, isAuthorized]);
  if (!isAuthorized && activeView !== "landing") return <UnauthorizedState role={role} onGoHome={() => setActiveView(homeFor(role))} />;
  return <>{children}</>;
};
