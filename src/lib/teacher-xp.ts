import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type XpBreakdown = {
  students: number;
  classes: number;
  paidFees: number;
  attendance: number;
  perfectDays: number;
  profile: number;
  photo: number;
  monthlyAttendance: number;
  fullFeeMonths: number;
  referrals: number;
};

export type LevelInfo = {
  level: number;
  title: string;
  minXp: number;
};

export type RewardInfo = {
  level: number;
  name: string;
  description: string;
  unlocked: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  unlocked: boolean;
  progress: number; // 0-100
  current: number;
  target: number;
  unlockedAt: string | null;
};

export type WeeklyChallenge = {
  id: string;
  title: string;
  progress: number; // 0-100
  current: number;
  target: number;
  completed: boolean;
  remaining: number;
  rewardXp: number;
};

export type TeacherXp = {
  totalXp: number;
  breakdown: XpBreakdown;
  level: number;
  title: string;
  nextLevel: number | null;
  nextLevelTitle: string | null;
  xpForNextLevel: number;
  xpRemaining: number;
  progress: number;
  isMaxLevel: boolean;
  currentReward: RewardInfo | null;
  nextReward: RewardInfo | null;
  achievements: Achievement[];
  weeklyChallenges: WeeklyChallenge[];
  weekStart: string;
};

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

export const XP_RULES = {
  addStudent: 25,
  createClass: 20,
  paidFee: 15,
  attendanceRecord: 2,
  perfectClassDay: 30,
  completeProfile: 50,
  profilePhoto: 20,
  monthlyAttendanceAbove90: 150,
  fullMonthFeeCollection: 200,
  referral: 250,
} as const;

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "New Teacher 🌱", minXp: 0 },
  { level: 2, title: "Organizer 📒", minXp: 150 },
  { level: 3, title: "Mentor 👨‍🏫", minXp: 400 },
  { level: 4, title: "Guide ⭐", minXp: 800 },
  { level: 5, title: "Inspiration 🌟", minXp: 1400 },
  { level: 6, title: "Classroom Expert 🎓", minXp: 2200 },
  { level: 7, title: "Master Educator 🏆", minXp: 3200 },
  { level: 8, title: "Legend 💎", minXp: 4500 },
  { level: 9, title: "Hall of Fame 👑", minXp: 6000 },
  { level: 10, title: "Teaching Icon ❤️", minXp: 10000 },
];

const REWARDS: Record<number, { name: string; description: string }> = {
  2: { name: "Bronze Badge", description: "A bronze badge on your teacher profile" },
  3: { name: "Profile Border", description: "A decorative border around your profile" },
  4: { name: "Dashboard Theme", description: "Unlock an extra dashboard theme" },
  5: { name: "Achievement Badge", description: "Showcase achievements on your profile" },
  6: { name: "Advanced Analytics", description: "Deeper attendance & revenue analytics" },
  7: { name: "Gold Profile Border", description: "A premium gold profile border" },
  8: { name: "Legend Badge", description: "The Legend badge for your profile" },
  9: { name: "Hall of Fame Frame", description: "An exclusive Hall of Fame frame" },
  10: { name: "🎁 1 Month FREE ClassLedger Pro", description: "One free month of ClassLedger Pro" },
};

export const LEVEL10_REWARD_NAME = "1 Month ClassLedger Pro";

/* ------------------------------------------------------------------ */
/* Date helpers                                                        */
/* ------------------------------------------------------------------ */

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Monday 00:00 of the current week. */
export function weekStartDate(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d;
}

/* ------------------------------------------------------------------ */
/* Raw data                                                            */
/* ------------------------------------------------------------------ */

type RawData = {
  teacher: Record<string, unknown> | null;
  classes: { id: string; created_at: string }[];
  students: { id: string; class_id: string; parent_phone: string | null; created_at: string }[];
  attendance: { student_id: string; date: string; status: string; created_at: string }[];
  fees: { student_id: string; month: string; amount: number; status: string; payment_date: string | null; created_at: string }[];
};

export async function fetchTeacherXpData(): Promise<RawData> {
  const [teacher, classes, students, attendance, fees] = await Promise.all([
    supabase.from("teachers").select("*").maybeSingle(),
    supabase.from("classes").select("id, created_at"),
    supabase.from("students").select("id, class_id, parent_phone, created_at"),
    supabase.from("attendance").select("student_id, date, status, created_at"),
    supabase.from("fees").select("student_id, month, amount, status, payment_date, created_at"),
  ]);

  for (const r of [teacher, classes, students, attendance, fees]) {
    if (r.error) throw r.error;
  }

  return {
    teacher: (teacher.data as Record<string, unknown>) ?? null,
    classes: (classes.data ?? []) as RawData["classes"],
    students: (students.data ?? []) as RawData["students"],
    attendance: (attendance.data ?? []) as RawData["attendance"],
    fees: (fees.data ?? []) as RawData["fees"],
  };
}

/* ------------------------------------------------------------------ */
/* Calculation                                                         */
/* ------------------------------------------------------------------ */

export function computeTeacherXp(data: RawData, now = new Date()): TeacherXp {
  const { teacher, classes, students, attendance, fees } = data;

  const studentsById = new Map(students.map((s) => [s.id, s]));
  const presentRecords = attendance.filter((a) => a.status === "present");
  const paidFees = fees.filter((f) => f.status === "paid");

  /* --- perfect class days: every student of a class present that day --- */
  const classSize = new Map<string, number>();
  for (const s of students) classSize.set(s.class_id, (classSize.get(s.class_id) ?? 0) + 1);

  const perClassDay = new Map<string, Set<string>>(); // `${classId}|${date}` -> present student ids
  const markedPerClassDay = new Map<string, Set<string>>();
  for (const a of attendance) {
    const s = studentsById.get(a.student_id);
    if (!s) continue;
    const key = `${s.class_id}|${a.date}`;
    if (!markedPerClassDay.has(key)) markedPerClassDay.set(key, new Set());
    markedPerClassDay.get(key)!.add(a.student_id);
    if (a.status === "present") {
      if (!perClassDay.has(key)) perClassDay.set(key, new Set());
      perClassDay.get(key)!.add(a.student_id);
    }
  }
  let perfectDays = 0;
  for (const [key, marked] of markedPerClassDay) {
    const classId = key.split("|")[0]!;
    const size = classSize.get(classId) ?? 0;
    if (size > 0 && marked.size === size && (perClassDay.get(key)?.size ?? 0) === size) perfectDays++;
  }

  /* --- monthly attendance above 90% --- */
  const monthAtt = new Map<string, { present: number; total: number }>();
  for (const a of attendance) {
    const m = a.date.slice(0, 7);
    const entry = monthAtt.get(m) ?? { present: 0, total: 0 };
    entry.total++;
    if (a.status === "present") entry.present++;
    monthAtt.set(m, entry);
  }
  let goodMonths = 0;
  for (const [, v] of monthAtt) if (v.total > 0 && v.present / v.total > 0.9) goodMonths++;

  /* --- 100% fee collection months --- */
  const monthFees = new Map<string, { paid: number; total: number }>();
  for (const f of fees) {
    const entry = monthFees.get(f.month) ?? { paid: 0, total: 0 };
    entry.total++;
    if (f.status === "paid") entry.paid++;
    monthFees.set(f.month, entry);
  }
  let fullFeeMonths = 0;
  for (const [, v] of monthFees) if (v.total > 0 && v.paid === v.total) fullFeeMonths++;

  /* --- profile --- */
  const t = teacher ?? {};
  const str = (k: string) => (typeof t[k] === "string" ? (t[k] as string).trim() : "");
  const profileComplete = Boolean(str("full_name") && str("mobile") && str("institute_name"));
  const hasPhoto = Boolean(str("avatar_url") || str("photo_url"));

  const breakdown: XpBreakdown = {
    students: students.length * XP_RULES.addStudent,
    classes: classes.length * XP_RULES.createClass,
    paidFees: paidFees.length * XP_RULES.paidFee,
    attendance: attendance.length * XP_RULES.attendanceRecord,
    perfectDays: perfectDays * XP_RULES.perfectClassDay,
    profile: profileComplete ? XP_RULES.completeProfile : 0,
    photo: hasPhoto ? XP_RULES.profilePhoto : 0,
    monthlyAttendance: goodMonths * XP_RULES.monthlyAttendanceAbove90,
    fullFeeMonths: fullFeeMonths * XP_RULES.fullMonthFeeCollection,
    referrals: 0, // future: student referrals
  };

  const totalXp = Object.values(breakdown).reduce((a, b) => a + b, 0);

  /* --- level --- */
  let current = LEVELS[0]!;
  for (const l of LEVELS) if (totalXp >= l.minXp) current = l;
  const next = LEVELS.find((l) => l.level === current.level + 1) ?? null;
  const isMaxLevel = next === null;
  const xpForNextLevel = next ? next.minXp : current.minXp;
  const xpRemaining = next ? Math.max(0, next.minXp - totalXp) : 0;
  const span = next ? next.minXp - current.minXp : 1;
  const progress = isMaxLevel ? 100 : Math.min(100, Math.max(0, ((totalXp - current.minXp) / span) * 100));

  const toReward = (level: number | null, unlocked: boolean): RewardInfo | null => {
    if (level === null) return null;
    const r = REWARDS[level];
    if (!r) return null;
    return { level, name: r.name, description: r.description, unlocked };
  };

  /* --- achievements --- */
  const earned = paidFees.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const families = new Set(
    students.map((s) => (s.parent_phone ?? "").replace(/\s+/g, "")).filter((p) => p.length > 0),
  ).size;
  const attendanceRate = attendance.length ? presentRecords.length / attendance.length : 0;
  const firstActivity = [...classes, ...students]
    .map((r) => r.created_at)
    .sort()[0];
  const daysWithClassLedger = firstActivity
    ? Math.floor((now.getTime() - new Date(firstActivity).getTime()) / 86400000)
    : 0;

  const sortedByDate = <T extends { created_at: string }>(rows: T[]) =>
    [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const nth = <T extends { created_at: string }>(rows: T[], n: number) =>
    rows.length >= n ? sortedByDate(rows)[n - 1]!.created_at : null;

  const feeDateAt = (target: number) => {
    let sum = 0;
    for (const f of sortedByDate(paidFees)) {
      sum += Number(f.amount || 0);
      if (sum >= target) return f.created_at;
    }
    return null;
  };

  const mk = (
    id: string,
    title: string,
    currentVal: number,
    target: number,
    unlockedAt: string | null,
  ): Achievement => ({
    id,
    title,
    current: Math.min(currentVal, target),
    target,
    unlocked: currentVal >= target,
    progress: Math.min(100, Math.round((currentVal / target) * 100)),
    unlockedAt: currentVal >= target ? unlockedAt : null,
  });

  const achievements: Achievement[] = [
    mk("first-student", "First Student", students.length, 1, nth(students, 1)),
    mk("first-10k", "First ₹10,000 Earned", earned, 10000, feeDateAt(10000)),
    mk("attendance-100", "100 Attendance Records", attendance.length, 100, nth(attendance, 100)),
    mk("attendance-1000", "1000 Attendance Records", attendance.length, 1000, nth(attendance, 1000)),
    mk("students-100", "100 Students Guided", students.length, 100, nth(students, 100)),
    mk(
      "attendance-champion",
      "Attendance Champion",
      attendance.length >= 50 ? Math.round(attendanceRate * 100) : 0,
      95,
      null,
    ),
    mk("fee-master", "Fee Master", paidFees.length, 50, nth(paidFees, 50)),
    mk("perfect-month", "Perfect Month", fullFeeMonths, 1, null),
    mk("trusted-50", "Trusted By 50 Families", families, 50, null),
    mk("one-year", "One Year With ClassLedger", daysWithClassLedger, 365, null),
  ];

  /* --- weekly challenges (regenerate every Monday) --- */
  const ws = weekStartDate(now);
  const wsIso = iso(ws);
  const weekAttendance = attendance.filter((a) => a.date >= wsIso);
  const daysMarked = new Set(weekAttendance.map((a) => a.date)).size;
  const feesThisWeek = paidFees.filter((f) => (f.payment_date ?? f.created_at.slice(0, 10)) >= wsIso).length;
  const studentsThisWeek = students.filter((s) => s.created_at.slice(0, 10) >= wsIso).length;

  const chal = (id: string, title: string, cur: number, target: number, rewardXp: number): WeeklyChallenge => ({
    id,
    title,
    current: Math.min(cur, target),
    target,
    completed: cur >= target,
    remaining: Math.max(0, target - cur),
    progress: Math.min(100, Math.round((cur / target) * 100)),
    rewardXp,
  });

  const weeklyChallenges: WeeklyChallenge[] = [
    chal("attendance-5-days", "Mark attendance for 5 days", daysMarked, 5, 100),
    chal("fees-10-students", "Collect fees from 10 students", feesThisWeek, 10, 150),
    chal("add-3-students", "Add 3 students", studentsThisWeek, 3, 75),
  ];

  return {
    totalXp,
    breakdown,
    level: current.level,
    title: current.title,
    nextLevel: next?.level ?? null,
    nextLevelTitle: next?.title ?? null,
    xpForNextLevel,
    xpRemaining,
    progress,
    isMaxLevel,
    currentReward: toReward(current.level >= 2 ? current.level : null, true),
    nextReward: toReward(next?.level ?? null, false),
    achievements,
    weeklyChallenges,
    weekStart: wsIso,
  };
}

/* ------------------------------------------------------------------ */
/* Level 10 reward record                                              */
/* ------------------------------------------------------------------ */

/** Inserts a pending Pro reward the first time a teacher hits Level 10. */
export async function ensureLevel10Reward(level: number) {
  if (level < 10) return;
  const { data: auth } = await supabase.auth.getUser();
  const teacherId = auth.user?.id;
  if (!teacherId) return;

  const existing = await supabase
    .from("teacher_rewards" as never)
    .select("id")
    .eq("teacher_id", teacherId)
    .eq("reward_name", LEVEL10_REWARD_NAME)
    .maybeSingle();

  if (existing.error || existing.data) return; // table missing or already rewarded

  await supabase.from("teacher_rewards" as never).insert({
    teacher_id: teacherId,
    reward_name: LEVEL10_REWARD_NAME,
    reward_status: "Pending",
  } as never);
}

/* ------------------------------------------------------------------ */
/* Query options                                                       */
/* ------------------------------------------------------------------ */

export const teacherXpQueryOptions = {
  queryKey: ["classledger", "teacher-xp"] as const,
  queryFn: async () => computeTeacherXp(await fetchTeacherXpData()),
  staleTime: 60_000,
};

export const EMPTY_XP: TeacherXp = computeTeacherXp({
  teacher: null,
  classes: [],
  students: [],
  attendance: [],
  fees: [],
});

export { iso as isoDate, monthKey };