import type { AttendanceRow, ClassRow, FeeRow, Student } from "@/lib/classledger-data";

export type InsightPriority = "High" | "Medium" | "Good" | "New";

export type InsightIcon =
  | "alert"
  | "attendance"
  | "growth"
  | "money"
  | "student"
  | "info";

export type GeneratedInsight = {
  id: string;
  title: string;
  description: string;
  priority: InsightPriority;
  icon: InsightIcon;
};

export type InsightInput = {
  today: string;
  month: string;
  classes: ClassRow[];
  students: Student[];
  attendance: AttendanceRow[];
  fees: FeeRow[];
};

const PRIORITY_WEIGHT: Record<InsightPriority, number> = {
  High: 0,
  Medium: 1,
  New: 2,
  Good: 3,
};

const plural = (n: number, one: string, many = `${one}s`) => (n === 1 ? one : many);

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((r) => [r.id, r]));
}

/** Number of trailing consecutive absences for a student, most recent first. */
function consecutiveAbsences(rows: AttendanceRow[]) {
  let streak = 0;
  for (const r of rows) {
    if (r.status === "absent") streak += 1;
    else break;
  }
  return streak;
}

export function generateInsights(input: InsightInput): GeneratedInsight[] {
  const { today, classes, students, attendance, fees } = input;
  const out: GeneratedInsight[] = [];

  const studentMap = byId(students);
  const classMap = byId(classes);

  // ---------- Onboarding (very little data) ----------
  if (classes.length === 0) {
    out.push({
      id: "onboard-class",
      title: "Create your first class",
      description: "Add a class or batch to start tracking students, attendance and fees.",
      priority: "New",
      icon: "info",
    });
  } else if (students.length === 0) {
    out.push({
      id: "onboard-student",
      title: "Add your first student",
      description: `You have ${classes.length} ${plural(classes.length, "class", "classes")} but no students yet. Add students to unlock insights.`,
      priority: "New",
      icon: "student",
    });
  }

  // ---------- Per-student attendance history ----------
  const historyByStudent = new Map<string, AttendanceRow[]>();
  for (const row of attendance) {
    const list = historyByStudent.get(row.student_id);
    if (list) list.push(row);
    else historyByStudent.set(row.student_id, [row]);
  }
  historyByStudent.forEach((list) => list.sort((a, b) => (a.date < b.date ? 1 : -1)));

  const chronicAbsentees = students
    .map((s) => ({ s, streak: consecutiveAbsences(historyByStudent.get(s.id) ?? []) }))
    .filter((x) => x.streak >= 3)
    .sort((a, b) => b.streak - a.streak);

  if (chronicAbsentees.length > 0) {
    const top = chronicAbsentees[0];
    const others = chronicAbsentees.length - 1;
    out.push({
      id: "attendance-streak",
      title: "Attendance Alert",
      description:
        `${top.s.student_name} has missed the last ${top.streak} consecutive classes` +
        (others > 0 ? ` — and ${others} other ${plural(others, "student")} also missed 3+ in a row.` : "."),
      priority: "High",
      icon: "alert",
    });
  }
  
  // ---------- Today's attendance ----------
  const todayRows = attendance.filter((a) => a.date === today);
  const yesterdayDate = (() => {
    const d = new Date(`${today}T00:00:00`);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  })();
  const yesterdayRows = attendance.filter((a) => a.date === yesterdayDate);

  const absentToday = todayRows.filter((a) => a.status === "absent");
  if (absentToday.length > 0) {
    const names = absentToday
      .map((a) => studentMap.get(a.student_id)?.student_name)
      .filter(Boolean) as string[];
    out.push({
      id: "absent-today",
      title: "Absent Today",
      description: `${absentToday.length} ${plural(absentToday.length, "student")} marked absent today${names.length ? `: ${names.slice(0, 3).join(", ")}${names.length > 3 ? "…" : ""}` : ""}.`,
      priority: "High",
      icon: "alert",
    });
  }
  
  // Per-class attendance rate today
  const classStats = classes.map((c) => {
    const ids = new Set(students.filter((s) => s.class_id === c.id).map((s) => s.id));
    const rows = todayRows.filter((a) => ids.has(a.student_id));
    const present = rows.filter((a) => a.status === "present").length;
    return {
      cls: c,
      total: ids.size,
      marked: rows.length,
      present,
      rate: rows.length > 0 ? (present / rows.length) * 100 : null,
    };
  });
  
  const perfect = classStats.filter((c) => c.total > 0 && c.marked === c.total && c.rate === 100);
  if (perfect.length > 0) {
    out.push({
      id: "perfect-attendance",
      title: "Perfect Attendance",
      description:
        perfect.length === 1
          ? `${perfect[0].cls.name} recorded 100% attendance today.`
          : `${perfect.length} classes achieved 100% attendance today.`,
      priority: "Good",
      icon: "attendance",
    });
  }

  const rated = classStats.filter((c) => c.rate !== null) as (typeof classStats[number] & { rate: number })[];
  if (rated.length > 1) {
    const lowest = [...rated].sort((a, b) => a.rate - b.rate)[0];
    if (lowest.rate < 75) {
      out.push({
        id: "lowest-class-attendance",
        title: "Low Attendance Class",
        description: `${lowest.cls.name} recorded only ${Math.round(lowest.rate)}% attendance today.`,
        priority: "Medium",
        icon: "alert",
      });
    }
    const highest = [...rated].sort((a, b) => b.rate - a.rate)[0];
    if (highest.rate >= 90 && perfect.length === 0) {
      out.push({
        id: "highest-class-attendance",
        title: "Top Performing Class",
        description: `${highest.cls.name} leads today with ${Math.round(highest.rate)}% attendance.`,
        priority: "Good",
        icon: "attendance",
      });
    }
  }

  const unmarked = classStats.filter((c) => c.total > 0 && c.marked === 0);
  if (unmarked.length > 0) {
    out.push({
      id: "unmarked-classes",
      title: "Attendance Pending",
      description:
        unmarked.length === 1
          ? `Attendance has not been marked for ${unmarked[0].cls.name} today.`
          : `${unmarked.length} classes have no attendance marked today.`,
      priority: "Medium",
      icon: "attendance",
    });
  }
  
  // Attendance trend vs yesterday
  const rate = (rows: AttendanceRow[]) =>
    rows.length ? (rows.filter((r) => r.status === "present").length / rows.length) * 100 : null;
  const todayRate = rate(todayRows);
  const yRate = rate(yesterdayRows);
  if (todayRate !== null && yRate !== null && Math.abs(todayRate - yRate) >= 5) {
    const up = todayRate > yRate;
    out.push({
      id: "attendance-trend",
      title: up ? "Attendance Improving" : "Attendance Dropping",
      description: `Today's attendance is ${Math.abs(Math.round(todayRate - yRate))}% ${up ? "higher" : "lower"} than yesterday (${Math.round(todayRate)}% vs ${Math.round(yRate)}%).`,
      priority: up ? "Good" : "Medium",
      icon: up ? "growth" : "alert",
    });
  }

  // ---------- Fees (current month) ----------
  const paid = fees.filter((f) => f.status === "paid");
  const paidStudentIds = new Set(paid.map((f) => f.student_id));
  const pendingStudents = students.filter((s) => !paidStudentIds.has(s.id));
  const pendingAmount = pendingStudents.reduce((sum, s) => sum + Number(s.monthly_fee || 0), 0);
  const collected = paid.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const expected = students.reduce((sum, s) => sum + Number(s.monthly_fee || 0), 0);

  if (students.length > 0 && fees.length === 0) {
    out.push({
      id: "onboard-fee",
      title: "Collect your first fee",
      description: "No fee records this month yet — mark a payment to unlock revenue insights.",
      priority: "New",
      icon: "money",
    });
  }

  const paidToday = paid.filter((f) => f.payment_date === today);
  if (paidToday.length > 0) {
    const amountToday = paidToday.reduce((sum, f) => sum + Number(f.amount || 0), 0);
    out.push({
      id: "fees-today",
      title: "Fees Collected Today",
      description: `${paidToday.length} ${plural(paidToday.length, "student")} paid today, totalling ${inr(amountToday)}.`,
      priority: "Good",
      icon: "money",
    });
  }

  if (pendingStudents.length > 0 && pendingAmount > 0) {
    out.push({
      id: "fees-pending",
      title: "Pending Fees",
      description: `${pendingStudents.length} ${plural(pendingStudents.length, "student")} still owe ${inr(pendingAmount)} for this month.`,
      priority: pendingStudents.length >= Math.max(3, students.length / 2) ? "High" : "Medium",
      icon: "money",
    });

    // Class with highest pending fees
    if (classes.length > 1) {
      const pendingByClass = new Map<string, number>();
      pendingStudents.forEach((s) => {
        pendingByClass.set(s.class_id, (pendingByClass.get(s.class_id) ?? 0) + Number(s.monthly_fee || 0));
      });
      const worst = [...pendingByClass.entries()].sort((a, b) => b[1] - a[1])[0];
      const cls = worst && classMap.get(worst[0]);
      if (cls) {
        out.push({
          id: "fees-pending-class",
          title: "Highest Pending Class",
          description: `${cls.name} has the most outstanding fees this month (${inr(worst[1])}).`,
          priority: "Medium",
          icon: "money",
        });
      }
    }
  } else if (expected > 0 && collected >= expected) {
    out.push({
      id: "fees-target",
      title: "Collection Target Achieved",
      description: `All fees for this month are collected — ${inr(collected)} in total.`,
      priority: "Good",
      icon: "money",
    });
  }

  // ---------- Students ----------
  const joinedToday = students.filter((s) => s.joining_date === today);
  if (joinedToday.length > 0) {
    out.push({
      id: "joined-today",
      title: "New Students Today",
      description: `${joinedToday.length} new ${plural(joinedToday.length, "student")} joined today${joinedToday.length === 1 ? `: ${joinedToday[0].student_name}` : ""}.`,
      priority: "New",
      icon: "student",
    });
  }

  if (classes.length > 0 && students.length > 0) {
    const countByClass = new Map<string, number>();
    students.forEach((s) => countByClass.set(s.class_id, (countByClass.get(s.class_id) ?? 0) + 1));

    const monthStart = `${input.month}-01`;
    const growthByClass = new Map<string, number>();
    students
      .filter((s) => s.joining_date >= monthStart)
      .forEach((s) => growthByClass.set(s.class_id, (growthByClass.get(s.class_id) ?? 0) + 1));
    const fastest = [...growthByClass.entries()].sort((a, b) => b[1] - a[1])[0];
    if (fastest && fastest[1] > 0 && classMap.has(fastest[0])) {
      out.push({
        id: "fastest-class",
        title: "Fastest Growing Class",
        description: `${classMap.get(fastest[0])!.name} gained ${fastest[1]} new ${plural(fastest[1], "student")} this month.`,
        priority: "New",
        icon: "growth",
      });
    }

    const biggest = [...countByClass.entries()].sort((a, b) => b[1] - a[1])[0];
    if (biggest && classMap.has(biggest[0])) {
      out.push({
        id: "biggest-class",
        title: "Largest Class",
        description: `${classMap.get(biggest[0])!.name} has the most students (${biggest[1]}).`,
        priority: "Good",
        icon: "student",
      });
    }

    const emptyClasses = classes.filter((c) => !countByClass.has(c.id));
    if (emptyClasses.length > 0) {
      out.push({
        id: "empty-classes",
        title: "Empty Class",
        description:
          emptyClasses.length === 1
            ? `${emptyClasses[0].name} has no students yet.`
            : `${emptyClasses.length} classes have no students yet.`,
        priority: "Medium",
        icon: "info",
      });
    }
  }

  // ---------- Fallbacks ----------
  if (out.length === 0) {
    out.push({
      id: "all-good",
      title: "All Caught Up",
      description:
        students.length > 0
          ? `Everything looks healthy across ${students.length} ${plural(students.length, "student")} today.`
          : "Nothing needs your attention right now.",
      priority: "Good",
      icon: "attendance",
    });
  }

  return out
    .sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority])
    .slice(0, 3);
}