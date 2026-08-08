import { supabase } from "@/integrations/supabase/client";

export type ClassRow = {
  id: string;
  teacher_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Student = {
  id: string;
  teacher_id: string;
  class_id: string;
  student_name: string;
  parent_name: string | null;
  parent_phone: string | null;
  course: string;
  monthly_fee: number;
  joining_date: string;
  notes: string | null;
  created_at: string;
};

export type AttendanceRow = {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent";
  created_at?: string;
};

export type FeeRow = {
  id: string;
  student_id: string;
  month: string;
  amount: number;
  status: "paid" | "pending";
  payment_date: string | null;
  created_at?: string;
};

export function currentMonth(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function todayISO(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function fetchClasses() {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ClassRow[];
}

export async function fetchStudents(classId?: string) {
  let q = supabase.from("students").select("*").order("created_at", { ascending: false });
  if (classId) q = q.eq("class_id", classId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Student[];
}

export async function fetchAttendance(opts?: {
  date?: string;
  dateFrom?: string;
  studentIds?: string[];
  limit?: number;
}) {
  let q = supabase.from("attendance").select("*").order("date", { ascending: false });
  if (opts?.date) q = q.eq("date", opts.date);
  if (opts?.dateFrom) q = q.gte("date", opts.dateFrom);
  if (opts?.studentIds && opts.studentIds.length > 0) q = q.in("student_id", opts.studentIds);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as AttendanceRow[];
}

export async function fetchFees(opts?: { month?: string; studentIds?: string[]; limit?: number }) {
  let q = supabase.from("fees").select("*");
  if (opts?.month) q = q.eq("month", opts.month);
  if (opts?.studentIds && opts.studentIds.length > 0) q = q.in("student_id", opts.studentIds);
  if (opts?.limit) q = q.order("payment_date", { ascending: false }).limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as FeeRow[];
}
