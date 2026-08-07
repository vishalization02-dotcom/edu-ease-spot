import {
  currentMonth,
  fetchAttendance,
  fetchClasses,
  fetchFees,
  fetchStudents,
  todayISO,
} from "@/lib/classledger-data";
import type { AiAnswer, AiEngine, AiIntent, AiSuggestion } from "./ai-types";

export const AI_SUGGESTIONS: AiSuggestion[] = [
  { emoji: "💰", text: "Who hasn't paid fees?" },
  { emoji: "👨", text: "Who was absent today?" },
  { emoji: "📈", text: "Show this month's revenue" },
  { emoji: "🏆", text: "Best performing class" },
  { emoji: "📚", text: "Total students" },
  { emoji: "📅", text: "Show today's attendance" },
];

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const prevMonth = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const has = (q: string, ...words: string[]) => words.every((w) => q.includes(w));

export function detectIntent(question: string): AiIntent {
  const q = question.toLowerCase().trim();
  if (!q) return "unsupported";

  if (has(q, "pending") && (q.includes("amount") || q.includes("total"))) return "pending_amount";
  if (
    (q.includes("fee") &&
      (q.includes("not paid") ||
        q.includes("hasn't") ||
        q.includes("hasnt") ||
        q.includes("unpaid") ||
        q.includes("pending") ||
        q.includes("due"))) ||
    has(q, "who", "fee")
  )
    return "pending_fees";
  if (q.includes("absent")) return "absent_today";
  if (
    q.includes("revenue") ||
    q.includes("earning") ||
    q.includes("income") ||
    has(q, "collected", "month")
  )
    return "revenue_month";
  if (
    q.includes("best") ||
    q.includes("highest") ||
    q.includes("top class") ||
    has(q, "which", "class")
  )
    return "best_class";
  if (
    q.includes("student") &&
    (q.includes("total") || q.includes("how many") || q.includes("enrolled") || q.includes("count"))
  )
    return "total_students";
  if (q.includes("attendance")) return "attendance_today";
  if (q.includes("pending")) return "pending_amount";
  return "unsupported";
}

async function loadContext() {
  const today = todayISO();
  const month = currentMonth();
  const [classes, students, attendanceToday, fees, feesPrev] = await Promise.all([
    fetchClasses(),
    fetchStudents(),
    fetchAttendance({ date: today }),
    fetchFees({ month }),
    fetchFees({ month: prevMonth(month) }),
  ]);
  return { today, month, classes, students, attendanceToday, fees, feesPrev };
}

type Ctx = Awaited<ReturnType<typeof loadContext>>;

function pendingFees(ctx: Ctx): AiAnswer {
  const paid = new Set(ctx.fees.filter((f) => f.status === "paid").map((f) => f.student_id));
  const unpaid = ctx.students.filter((s) => !paid.has(s.id));
  const total = unpaid.reduce((sum, s) => sum + Number(s.monthly_fee || 0), 0);
  return {
    intent: "pending_fees",
    title: "Pending Fee Students",
    items: unpaid.map((s) => ({ label: s.student_name, value: inr(Number(s.monthly_fee || 0)) })),
    stats: [{ label: "Total Pending", value: inr(total), tone: "negative" }],
    empty: "Everyone has paid this month. 🎉",
  };
}

function absentToday(ctx: Ctx): AiAnswer {
  const byId = new Map(ctx.students.map((s) => [s.id, s]));
  const absentees = ctx.attendanceToday
    .filter((a) => a.status === "absent")
    .map((a) => byId.get(a.student_id)?.student_name)
    .filter((n): n is string => !!n);
  return {
    intent: "absent_today",
    title: "Today's Absentees",
    items: absentees.map((n) => ({ label: n })),
    stats: [
      {
        label: "Total",
        value: `${absentees.length} ${absentees.length === 1 ? "Student" : "Students"}`,
        tone: absentees.length ? "negative" : "positive",
      },
    ],
    empty: ctx.attendanceToday.length
      ? "No absentees today. Full attendance!"
      : "Attendance hasn't been marked today yet.",
  };
}

function revenueMonth(ctx: Ctx): AiAnswer {
  const collected = ctx.fees
    .filter((f) => f.status === "paid")
    .reduce((s, f) => s + Number(f.amount || 0), 0);
  const paid = new Set(ctx.fees.filter((f) => f.status === "paid").map((f) => f.student_id));
  const pending = ctx.students
    .filter((s) => !paid.has(s.id))
    .reduce((s, st) => s + Number(st.monthly_fee || 0), 0);
  const prev = ctx.feesPrev
    .filter((f) => f.status === "paid")
    .reduce((s, f) => s + Number(f.amount || 0), 0);
  const growth = prev > 0 ? Math.round(((collected - prev) / prev) * 100) : collected > 0 ? 100 : 0;
  return {
    intent: "revenue_month",
    title: "Monthly Revenue",
    stats: [
      { label: "Collected", value: inr(collected), tone: "positive" },
      { label: "Pending", value: inr(pending), tone: "negative" },
      {
        label: "Growth",
        value: `${growth >= 0 ? "+" : ""}${growth}%`,
        tone: growth >= 0 ? "positive" : "negative",
      },
    ],
    footnote: "Compared with last month's collection.",
  };
}

function totalStudents(ctx: Ctx): AiAnswer {
  const marked = ctx.attendanceToday.length;
  const present = ctx.attendanceToday.filter((a) => a.status === "present").length;
  const rate = marked ? Math.round((present / marked) * 100) : 0;
  return {
    intent: "total_students",
    title: "Total Students",
    stats: [
      { label: "Students", value: String(ctx.students.length) },
      { label: "Active Classes", value: String(ctx.classes.length) },
      { label: "Attendance Today", value: `${rate}%`, tone: rate >= 75 ? "positive" : "negative" },
    ],
  };
}

function bestClass(ctx: Ctx): AiAnswer {
  const paid = new Set(ctx.fees.filter((f) => f.status === "paid").map((f) => f.student_id));
  const ranked = ctx.classes
    .map((c) => {
      const students = ctx.students.filter((s) => s.class_id === c.id);
      const ids = new Set(students.map((s) => s.id));
      const rows = ctx.attendanceToday.filter((a) => ids.has(a.student_id));
      const rate = rows.length
        ? Math.round((rows.filter((r) => r.status === "present").length / rows.length) * 100)
        : 0;
      const feeRate = students.length
        ? Math.round((students.filter((s) => paid.has(s.id)).length / students.length) * 100)
        : 0;
      return { name: c.name, count: students.length, rate, feeRate };
    })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.rate - a.rate || b.feeRate - a.feeRate || b.count - a.count);

  const top = ranked[0];
  if (!top) {
    return {
      intent: "best_class",
      title: "Best Performing Class",
      empty: "No classes with students yet.",
    };
  }
  return {
    intent: "best_class",
    title: top.name,
    stats: [
      { label: "Attendance", value: `${top.rate}%`, tone: "positive" },
      { label: "Students", value: String(top.count) },
      { label: "Fees Collected", value: `${top.feeRate}%` },
    ],
    footnote: "Ranked by today's attendance, then fee collection.",
  };
}

function attendanceToday(ctx: Ctx): AiAnswer {
  const present = ctx.attendanceToday.filter((a) => a.status === "present").length;
  const absent = ctx.attendanceToday.filter((a) => a.status === "absent").length;
  const marked = present + absent;
  const rate = marked ? Math.round((present / marked) * 100) : 0;
  return {
    intent: "attendance_today",
    title: "Today's Attendance",
    stats: [
      { label: "Present", value: String(present), tone: "positive" },
      { label: "Absent", value: String(absent), tone: "negative" },
      { label: "Rate", value: `${rate}%` },
    ],
    footnote: `${marked} of ${ctx.students.length} students marked.`,
    empty: marked ? undefined : "Attendance hasn't been marked today yet.",
  };
}

function pendingAmount(ctx: Ctx): AiAnswer {
  const paid = new Set(ctx.fees.filter((f) => f.status === "paid").map((f) => f.student_id));
  const unpaid = ctx.students.filter((s) => !paid.has(s.id));
  const pending = unpaid.reduce((s, st) => s + Number(st.monthly_fee || 0), 0);
  return {
    intent: "pending_amount",
    title: "Pending Fees",
    stats: [
      { label: "Amount", value: inr(pending), tone: "negative" },
      { label: "Students", value: String(unpaid.length) },
    ],
  };
}

const UNSUPPORTED: AiAnswer = {
  intent: "unsupported",
  title: "Not supported yet",
  empty: "I'm not able to answer that yet. More questions will be supported soon.",
};

const HANDLERS: Record<Exclude<AiIntent, "unsupported">, (ctx: Ctx) => AiAnswer> = {
  pending_fees: pendingFees,
  absent_today: absentToday,
  revenue_month: revenueMonth,
  total_students: totalStudents,
  best_class: bestClass,
  attendance_today: attendanceToday,
  pending_amount: pendingAmount,
};

/** Local rule-based engine backed by live Supabase data. Swap for an AI engine later. */
export const localAiEngine: AiEngine = {
  async answer(question: string): Promise<AiAnswer> {
    const intent = detectIntent(question);
    if (intent === "unsupported") return UNSUPPORTED;
    const ctx = await loadContext();
    return HANDLERS[intent](ctx);
  },
};
