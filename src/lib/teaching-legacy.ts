import { supabase } from "@/integrations/supabase/client";

export type TeachingLegacyStats = {
  earned: number;
  students: number;
  attendanceRecords: number;
  families: number;
};

/** Lifetime totals for the signed-in teacher (RLS scopes rows automatically). */
export async function fetchTeachingLegacy(): Promise<TeachingLegacyStats> {
  const [paidFees, students, attendance] = await Promise.all([
    supabase.from("fees").select("amount").eq("status", "paid"),
    supabase.from("students").select("parent_phone"),
    supabase.from("attendance").select("id", { count: "exact", head: true }),
  ]);

  if (paidFees.error) throw paidFees.error;
  if (students.error) throw students.error;
  if (attendance.error) throw attendance.error;

  const phones = new Set(
    (students.data ?? [])
      .map((s) => (s.parent_phone ?? "").replace(/\s+/g, ""))
      .filter((p) => p.length > 0),
  );

  return {
    earned: (paidFees.data ?? []).reduce((sum, f) => sum + Number(f.amount || 0), 0),
    students: students.data?.length ?? 0,
    attendanceRecords: attendance.count ?? 0,
    families: phones.size,
  };
}
