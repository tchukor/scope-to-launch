import React, { createContext, useContext, useState } from "react";
import type { SchoolConfig, TeacherProfile, WhatsAppMessage } from "../types";

interface SchoolContextType {
  schoolConfig: SchoolConfig;
  updateSchoolConfig: (config: Partial<SchoolConfig>) => void;
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  whatsAppMessages: WhatsAppMessage[];
  sendWhatsAppMessage: (msg: Omit<WhatsAppMessage, "id" | "timestamp" | "status">) => void;
}

const ctxStore = globalThis as unknown as {
  __chokurSchoolContext?: React.Context<SchoolContextType | undefined>;
};
const SchoolContext =
  ctxStore.__chokurSchoolContext ??
  (ctxStore.__chokurSchoolContext = createContext<SchoolContextType | undefined>(undefined));

export const SchoolProvider: React.FC<{
  children: React.ReactNode;
  initialSchoolConfig: SchoolConfig;
  initialTeacherProfile: TeacherProfile;
  initialWhatsAppMessages: WhatsAppMessage[];
}> = ({ children, initialSchoolConfig, initialTeacherProfile, initialWhatsAppMessages }) => {
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(initialSchoolConfig);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(initialTeacherProfile);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(initialWhatsAppMessages);

  const updateSchoolConfig = (newConfig: Partial<SchoolConfig>) => {
    setSchoolConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const updateTeacherProfile = (profile: Partial<TeacherProfile>) => {
    setTeacherProfile((prev) => ({ ...prev, ...profile }));
  };

  const sendWhatsAppMessage = (msg: Omit<WhatsAppMessage, "id" | "timestamp" | "status">) => {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
    };
    setWhatsAppMessages((prev) => [...prev, newMsg]);

    if (msg.sender === "teacher") {
      setTimeout(() => {
        setWhatsAppMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: "read" } : m)),
        );
      }, 1200);

      setTimeout(() => {
        const reply: WhatsAppMessage = {
          id: `msg-${Date.now() + 1}`,
          studentId: msg.studentId,
          studentAdm: msg.studentAdm,
          studentName: msg.studentName,
          parentName: msg.parentName,
          parentPhone: msg.parentPhone,
          sender: "parent",
          text: `Thank you Mwalimu! Received the report for ${msg.studentName}. We appreciate your dedication.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read",
        };
        setWhatsAppMessages((prev) => [...prev, reply]);
      }, 2500);
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolConfig,
        updateSchoolConfig,
        teacherProfile,
        updateTeacherProfile,
        whatsAppMessages,
        sendWhatsAppMessage,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
};