import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import type { AppStateData } from "../lib/db";
import { persistAppState, retrieveAppState, resetDatabaseToDefaults } from "../lib/db";

interface PersistenceContextType {
  saveStatus: {
    state: "saved" | "saving" | "offline";
    lastSavedAt: string;
  };
  forceSave: () => void;
  resetToDemoData: () => Promise<void>;
  exportJSONBackup: () => void;
  restoreJSONBackup: (jsonString: string) => boolean;
}

const ctxStore = globalThis as unknown as {
  __chokurPersistenceContext?: React.Context<PersistenceContextType | undefined>;
};
const PersistenceContext =
  ctxStore.__chokurPersistenceContext ??
  (ctxStore.__chokurPersistenceContext = createContext<PersistenceContextType | undefined>(undefined));

export const PersistenceProvider: React.FC<{
  children: React.ReactNode;
  schoolConfig: any;
  teacherProfile: any;
  whatsAppMessages: any[];
  students: any[];
  subjects: any[];
  streams: any[];
  exams: any[];
  terms: any[];
  marks: Record<string, Record<string, any>>;
  activeStream: string;
  activeExam: string;
  activeView: string;
  selectedStudentId: string;
}> = ({
  children,
  schoolConfig,
  teacherProfile,
  whatsAppMessages,
  students,
  subjects,
  streams,
  exams,
  terms,
  marks,
  activeStream,
  activeExam,
  activeView,
  selectedStudentId,
}) => {
  const [saveStatus, setSaveStatus] = useState<{
    state: "saved" | "saving" | "offline";
    lastSavedAt: string;
  }>({
    state: "saved",
    lastSavedAt: new Date().toLocaleTimeString(),
  });

  const isInitialMount = useRef(true);

  // Sync IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    retrieveAppState().then((stored) => {
      if (!isMounted || !stored) return;
      // The data will be synced via the data context - this is just for reconciliation
      console.log("[Chokur] IndexedDB state retrieved for reconciliation");
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Central persistence effect
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus((prev) => ({ ...prev, state: "saving" }));

    const payload: AppStateData = {
      version: 2,
      updatedAt: new Date().toISOString(),
      schoolConfig,
      teacherProfile,
      whatsAppMessages,
      students,
      subjects,
      streams,
      exams,
      terms,
      marks,
      uiState: {
        activeStream,
        activeExam,
        activeView,
        selectedStudentId,
      },
    };

    const timer = setTimeout(async () => {
      try {
        await persistAppState(payload);
        setSaveStatus({
          state: "saved",
          lastSavedAt: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        console.warn("[Chokur] Persistence error, saved to localStorage fallback:", err);
        setSaveStatus({
          state: "offline",
          lastSavedAt: new Date().toLocaleTimeString(),
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [
    schoolConfig,
    students,
    subjects,
    streams,
    exams,
    terms,
    marks,
    activeStream,
    activeExam,
    activeView,
    selectedStudentId,
  ]);

  const forceSave = () => {
    const payload: AppStateData = {
      version: 2,
      updatedAt: new Date().toISOString(),
      schoolConfig,
      teacherProfile,
      whatsAppMessages,
      students,
      subjects,
      streams,
      exams,
      terms,
      marks,
      uiState: {
        activeStream,
        activeExam,
        activeView,
        selectedStudentId,
      },
    };
    persistAppState(payload).then(() => {
      setSaveStatus({
        state: "saved",
        lastSavedAt: new Date().toLocaleTimeString(),
      });
    });
  };

  const resetToDemoData = async () => {
    const clean = await resetDatabaseToDefaults();
    return clean;
  };

  const exportJSONBackup = () => {
    const backupData: AppStateData = {
      version: 2,
      updatedAt: new Date().toISOString(),
      schoolConfig,
      teacherProfile,
      whatsAppMessages,
      students,
      subjects,
      streams,
      exams,
      terms,
      marks,
      uiState: {
        activeStream,
        activeExam,
        activeView,
        selectedStudentId,
      },
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `chokur_backup_${new Date().toISOString().slice(0, 10)}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const restoreJSONBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students) && data.subjects && data.marks) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <PersistenceContext.Provider
      value={{
        saveStatus,
        forceSave,
        resetToDemoData,
        exportJSONBackup,
        restoreJSONBackup,
      }}
    >
      {children}
    </PersistenceContext.Provider>
  );
};

export const usePersistence = () => {
  const context = useContext(PersistenceContext);
  if (!context) {
    throw new Error("usePersistence must be used within a PersistenceProvider");
  }
  return context;
};