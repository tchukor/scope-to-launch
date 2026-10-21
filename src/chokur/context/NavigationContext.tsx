import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ViewType } from "../types";
import { parseMarksCSV } from "../utils/grading";

interface NavigationContextType {
  // Navigation & Hash Routing
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  activeStream: string;
  setActiveStream: (stream: string) => void;
  activeExam: string;
  setActiveExam: (exam: string) => void;
  activeSubTab?: string;
  setActiveSubTab: (tab: string) => void;
  goBack: () => void;
  canGoBack: boolean;
}

// Keep one context instance across hot reloads
const ctxStore = globalThis as unknown as {
  __chokurNavigationContext?: React.Context<NavigationContextType | undefined>;
};
const NavigationContext =
  ctxStore.__chokurNavigationContext ??
  (ctxStore.__chokurNavigationContext = createContext<NavigationContextType | undefined>(
    undefined,
  ));

// Hash route parser
const parseHashRoute = (): { view: ViewType; studentId?: string; subTab?: string } => {
  if (typeof window === "undefined") return { view: "overview" };
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash) return { view: "overview" };

  const [routePart, queryPart] = hash.split("?");
  const validViews: ViewType[] = [
    "overview",
    "marks-entry",
    "rankings",
    "subject-analysis",
    "grade-distribution",
    "report-cards",
    "students",
    "attendance",
    "messaging",
    "fees",
    "parent-portal",
    "profile",
    "settings",
    "landing",
  ];

  const view = validViews.includes(routePart as ViewType) ? (routePart as ViewType) : "overview";
  let studentId: string | undefined;
  let subTab: string | undefined;

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    if (params.get("student")) studentId = params.get("student")!;
    if (params.get("tab")) subTab = params.get("tab")!;
  }

  return { view, studentId, subTab };
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [historyStack, setHistoryStack] = useState<ViewType[]>([]);
  const [activeView, setActiveViewInternal] = useState<ViewType>(() => {
    const raw = parseHashRoute().view;
    return raw || "overview";
  });
  const [selectedStudentId, setSelectedStudentIdInternal] = useState<string>(() => {
    return parseHashRoute().studentId || "s-1";
  });
  const [activeSubTab, setActiveSubTabInternal] = useState<string>(() => {
    return parseHashRoute().subTab || "students";
  });
  const [activeStream, setActiveStream] = useState<string>("Form 4 East");
  const [activeExam, setActiveExam] = useState<string>("End-term Exam, Term 2 2026");
  const isInitialMount = useRef(true);

  const updateHash = (view: ViewType, studentId: string, subTab?: string) => {
    let hash = `#${view}`;
    const params = new URLSearchParams();
    if (view === "report-cards" && studentId) {
      params.set("student", studentId);
    }
    if (view === "students" && subTab) {
      params.set("tab", subTab);
    }
    const queryString = params.toString();
    if (queryString) {
      hash += `?${queryString}`;
    }
    if (window.location.hash !== hash) {
      const currentView = window.location.hash.replace(/^#/, "").split("?")[0];
      if (currentView && currentView !== view) {
        window.history.pushState({ chokur: true, view }, "", hash);
      } else {
        window.history.replaceState({ chokur: true, view }, "", hash);
      }
    }
  };

  const setActiveView = (view: ViewType) => {
    if (view !== activeView) {
      setHistoryStack((prev) => [...prev, activeView]);
    }
    setActiveViewInternal(view);
    updateHash(view, selectedStudentId, activeSubTab);
  };

  const setSelectedStudentId = (id: string) => {
    setSelectedStudentIdInternal(id);
    updateHash(activeView, id, activeSubTab);
  };

  const setActiveSubTab = (tab: string) => {
    setActiveSubTabInternal(tab);
    updateHash(activeView, selectedStudentId, tab);
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack((prevStack) => prevStack.slice(0, -1));
      setActiveViewInternal(prev);
      updateHash(prev, selectedStudentId, activeSubTab);
      return;
    }
    setActiveViewInternal("overview");
    updateHash("overview", selectedStudentId, activeSubTab);
  };

  const canGoBack = activeView !== "overview";

  // Listen to browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const { view, studentId, subTab } = parseHashRoute();
      setActiveViewInternal(view);
      if (studentId) setSelectedStudentIdInternal(studentId);
      if (subTab) setActiveSubTabInternal(subTab);
    };

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.chokur) {
        handleHashChange();
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedStudentId,
        setSelectedStudentId,
        activeStream,
        setActiveStream,
        activeExam,
        setActiveExam,
        activeSubTab,
        setActiveSubTab,
        goBack,
        canGoBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
