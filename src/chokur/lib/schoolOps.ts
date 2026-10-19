/**
 * School operations store: attendance, parent contacts, fees and bulk-SMS log.
 * Self-contained, persisted to localStorage, shared across views via useSyncExternalStore.
 */
import { useSyncExternalStore } from 'react';

export type AttendanceMark = 'P' | 'A' | 'L'; // Present / Absent / Late

export interface ParentContact {
  parentName: string;
  phone: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'M-Pesa' | 'Bank' | 'Cash' | 'Cheque';
  ref: string;
}

export interface SmsLogEntry {
  id: string;
  sentAt: string;
  audience: string;
  recipients: number;
  segments: number;
  text: string;
  sample: string;
}

export interface SchoolOpsState {
  /** key: `${YYYY-MM-DD}|${stream}` -> studentId -> mark */
  attendance: Record<string, Record<string, AttendanceMark>>;
  contacts: Record<string, ParentContact>;
  feePerTerm: number;
  payments: FeePayment[];
  smsLog: SmsLogEntry[];
}

const KEY = 'chokur_school_ops_v1';

const seedPayments = (): FeePayment[] => [];

const initial = (): SchoolOpsState => ({
  attendance: {},
  contacts: {},
  feePerTerm: 45000,
  payments: seedPayments(),
  smsLog: [],
});

const load = (): SchoolOpsState => {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(KEY) : null;
    if (raw) return { ...initial(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return initial();
};

let state: SchoolOpsState = load();
const listeners = new Set<() => void>();

const commit = (next: SchoolOpsState) => {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable */
  }
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const uid = () => Math.random().toString(36).slice(2, 10);

/** Deterministic placeholder contact so every student has a parent record to edit. */
export const defaultContact = (admNo: string, studentName: string): ParentContact => {
  const n = parseInt(admNo.replace(/\D/g, '') || '0', 10);
  const tail = String(10000000 + ((n * 7919) % 89999999)).slice(0, 8);
  return { parentName: `Parent of ${studentName.split(' ')[0]}`, phone: `+2547${tail}` };
};

export const getContact = (
  s: SchoolOpsState,
  student: { id: string; admNo: string; name: string }
): ParentContact => s.contacts[student.id] || defaultContact(student.admNo, student.name);

export const smsSegments = (text: string) => {
  if (!text) return 0;
  return text.length <= 160 ? 1 : Math.ceil(text.length / 153);
};

export const feeBalance = (s: SchoolOpsState, studentId: string) => {
  const paid = s.payments.filter((p) => p.studentId === studentId).reduce((a, p) => a + p.amount, 0);
  return { paid, balance: Math.max(0, s.feePerTerm - paid), overpaid: Math.max(0, paid - s.feePerTerm) };
};

export const attendanceSummary = (s: SchoolOpsState, studentId: string) => {
  let present = 0,
    late = 0,
    absent = 0;
  Object.values(s.attendance).forEach((day) => {
    const m = day[studentId];
    if (m === 'P') present++;
    else if (m === 'L') late++;
    else if (m === 'A') absent++;
  });
  const total = present + late + absent;
  return { present, late, absent, total, rate: total ? Math.round(((present + late) / total) * 100) : null };
};

export const ops = {
  saveAttendance(date: string, stream: string, marks: Record<string, AttendanceMark>) {
    commit({ ...state, attendance: { ...state.attendance, [`${date}|${stream}`]: marks } });
  },
  setContact(studentId: string, contact: ParentContact) {
    commit({ ...state, contacts: { ...state.contacts, [studentId]: contact } });
  },
  setFeePerTerm(amount: number) {
    commit({ ...state, feePerTerm: Math.max(0, amount) });
  },
  addPayment(p: Omit<FeePayment, 'id'>) {
    commit({ ...state, payments: [{ ...p, id: uid() }, ...state.payments] });
  },
  removePayment(id: string) {
    commit({ ...state, payments: state.payments.filter((p) => p.id !== id) });
  },
  logSms(e: Omit<SmsLogEntry, 'id' | 'sentAt'>) {
    commit({ ...state, smsLog: [{ ...e, id: uid(), sentAt: new Date().toISOString() }, ...state.smsLog].slice(0, 200) });
  },
};

export const useSchoolOps = (): SchoolOpsState =>
  useSyncExternalStore(subscribe, () => state, () => state);
