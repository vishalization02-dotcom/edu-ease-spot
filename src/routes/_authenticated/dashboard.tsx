import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Users, IndianRupee, AlertTriangle, CalendarCheck, UserPlus, ClipboardCheck, Wallet, BookOpen, Plus, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { currentMonth, fetchFees, fetchStudents, todayISO, fetchAttendance, fetchClasses } from "@/lib/classledger-data";

import { SpeedInsights } from "@vercel/speed-insights/next"

// chatGPT
import AnalyticsCard from "@/components/dashboard/analytics-card";
import { MonthComparison } from "@/components/dashboard/MonthComparison";
import { Footer } from "@/components/dashboard/Footer";
import { Activity } from "lucide-react";
import { TeacherProgress } from "@/components/dashboard/TeacherProgress";
// import { NoticeBoard } from "@/components/dashboard/NoticeBoard";
// import { ClassLedgerAI } from "@/components/dashboard/ClassLedgerAI";
import { TeachingLegacy } from "@/components/dashboard/TeachingLegacy";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DailyInspiration } from "@/components/dashboard/DailyInspiration";

import { BusinessOverview } from "@/components/dashboard/BusinessOverview";

import { MonthClosed } from "@/components/dashboard/MonthClosed";
const lastMonth = "July";
const lastMonthExpected = 40000;
const lastMonthCollected = 34000;
const unpaidStudents = 6;

import { TodaySnapshot } from "@/components/dashboard/TodaySnapshot";
export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});
function TaskRow({
  icon,
  iconBg,
  title,
  description,
  buttonLabel,
  buttonClassName,
  buttonVariant = "default",
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "secondary";
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-5 py-4 transition-colors hover:bg-card/70">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>

        <div>
          <h3 className="font-semibold">{title}</h3>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Button
        size="sm"
        variant={buttonVariant}
        className={buttonClassName}
      >
        {buttonLabel}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const hour = new Date().getHours();

  const greeting = 
      hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const students = useQuery({ queryKey: ["students", "all"], queryFn: () => fetchStudents() });
  const classes = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  const month = currentMonth();
  const today = todayISO();
  const fees = useQuery({ queryKey: ["fees", "month", month], queryFn: () => fetchFees({ month }) });
  const attendance = useQuery({ queryKey: ["attendance", "day", today], queryFn: () => fetchAttendance({ date: today }) });
  const profile = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await supabase.from("teachers").select("*").maybeSingle();
      return data;
    },
  });

  const totalStudents = students.data?.length ?? 0;
  const collected = (fees.data ?? []).filter((f) => f.status === "paid").reduce((s, f) => s + Number(f.amount || 0), 0);
  // Pending: for each student, expected monthly fee minus paid this month
  const pendingAmount = (() => {
    if (!students.data || !fees.data) return 0;
    const paidMap = new Map(fees.data.filter((f) => f.status === "paid").map((f) => [f.student_id, true]));
    return students.data
      .filter((s) => !paidMap.get(s.id))
      .reduce((sum, s) => sum + Number(s.monthly_fee || 0), 0);
  })();
  const todayPresent = (attendance.data ?? []).filter((a) => a.date === today && a.status === "present").length;
  const todayAbsent = (attendance.data ?? []).filter((a) => a.date === today && a.status === "absent").length;

  const studentCountByClass = new Map<string, number>();
  (students.data ?? []).forEach((s) => studentCountByClass.set(s.class_id, (studentCountByClass.get(s.class_id) ?? 0) + 1));

  // Top-3 classes by student count (or all if fewer than 3)
  const topClasses = useMemo(() => {
    const list = (classes.data ?? []).slice();
    list.sort((a, b) => (studentCountByClass.get(b.id) ?? 0) - (studentCountByClass.get(a.id) ?? 0));
    return list.slice(0, 3);
  }, [classes.data, students.data]);

  // Map student_id -> class_id for grouping today's attendance and pending fees
  const studentClassMap = useMemo(() => {
    const m = new Map<string, string>();
    (students.data ?? []).forEach((s) => m.set(s.id, s.class_id));
    return m;
  }, [students.data]);

  const attendanceByClass = useMemo(() => {
    const m = new Map<string, { present: number; absent: number }>();
    (attendance.data ?? []).forEach((a) => {
      const cid = studentClassMap.get(a.student_id);
      if (!cid) return;
      const cur = m.get(cid) ?? { present: 0, absent: 0 };
      if (a.status === "present") cur.present += 1;
      else if (a.status === "absent") cur.absent += 1;
      m.set(cid, cur);
    });
    return m;
  }, [attendance.data, studentClassMap]);

  const pendingByClass = useMemo(() => {
    const paidSet = new Set((fees.data ?? []).filter((f) => f.status === "paid").map((f) => f.student_id));
    const m = new Map<string, number>();
    (students.data ?? []).forEach((s) => {
      if (paidSet.has(s.id)) return;
      m.set(s.class_id, (m.get(s.class_id) ?? 0) + Number(s.monthly_fee || 0));
    });
    return m;
  }, [students.data, fees.data]);

  return (
  <div className="w-full space-y-2 px-2 py-1">
      {/* CHANGES FROM HERE IN H1  */}
     <div className="space-y-0.5 -mt-1">

  {/* Header */}
  <div className="flex items-start justify-between">

    <div className="-mt-1 space-y-1">
     <h1 className="text-2xl font-semibold tracking-tight">
  {greeting}
  {profile.data?.full_name
    ? `, ${profile.data.full_name.split(" ")[0]}`
    : ""}
  👋
</h1>

     <p className="text-sm text-muted-foreground">
  Ready to inspire your students today.
</p>
    </div>

    <div className="flex items-center gap-3">
  <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
    <CalendarCheck className="h-4 w-4 text-muted-foreground" />

    <span className="text-sm text-muted-foreground">
      {new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short",
      })}
    </span>
  </div>

  {/* Notification button later */}

  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark"
            ? <Sun className="h-5 w-5" />
            : <Moon className="h-5 w-5" />}
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>

  </div>

  {/* Dashboard Cards */}
<div className="mb-3">
  <DailyInspiration />
</div>

<div className="flex flex-col gap-1 lg:flex-row">
  <div className="lg:w-2/3">
    <BusinessOverview
      collected={collected}
      pending={pendingAmount}
    />
  </div>

  <div className="lg:w-1/3">
    <TodaySnapshot
      students={totalStudents}
      classes={(classes.data ?? []).length}
      present={todayPresent}
      absent={todayAbsent}
    />
  </div>
</div>

</div>

      <QuickActions />
{/* chatGPT */}
<div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
  <div className="xl:col-span-2">
    <SmartInsights />
  </div>

  <div className="xl:col-span-3">
    <MonthComparison />
    {/* <AnalyticsCard/> */}
  </div>
</div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Classes</h2>
          {(classes.data ?? []).length > 0 && (
            <Link to="/classes"><Button size="sm" variant="ghost">View All <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          )}
        </div>
        
        {(classes.data ?? []).length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <div className="font-semibold">No classes created yet.</div>
            <div className="text-sm text-muted-foreground mt-1 mb-5">Create a class to start organizing your students.</div>
            <Link to="/classes"><Button className="h-11"><Plus className="h-4 w-4 mr-1" />Create Your First Class</Button></Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {topClasses.map((c) => {
              const count = studentCountByClass.get(c.id) ?? 0;
              const att = attendanceByClass.get(c.id) ?? { present: 0, absent: 0 };
              const pending = pendingByClass.get(c.id) ?? 0;
              const totalAttendance = att.present + att.absent;

const attendancePercentage =
  totalAttendance === 0
    ? 0
    : Math.round((att.present / totalAttendance) * 100);
              return (
                <Link key={c.id} to="/classes/$id" params={{ id: c.id }}>
                 <Card className="group h-full w-full rounded-2xl border border-border/60 bg-card/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <BookOpen className="h-5 w-5" />
                      </div>
                     <div className="text-xs text-muted-foreground">
                        <div className="truncate text-[15px] font-semibold"></div><div className="font-semibold truncate">{c.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground"></div><div className="text-xs text-muted-foreground">{count} student{count === 1 ? "" : "s"}</div>
                       <div className="mt-1 flex items-center gap-1 text-xs text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
  View Details
  <ArrowRight className="h-3 w-3" />
</div>
                      </div>
                    </div>
                   <div>
  <div className="mb-2 flex items-center justify-between">
    <span className="font-medium text-muted-foreground">
      Today's Attendance
    </span>

    <span className="text-xs font-semibold text-primary">
      {attendancePercentage}%
    </span>
  </div>

  <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
    <div
      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
      style={{ width: `${attendancePercentage}%` }}
    />
  </div>

  <div className="flex items-center justify-end gap-2">
    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-400">
      {att.present} P
    </span>

    <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-medium text-red-400">
      {att.absent} A
    </span>
  </div>
</div>
                      <div className="flex items-center justify-between">
                       <span className="font-medium text-muted-foreground">
  Pending Fees
</span>
                        <span
  className={`font-semibold ${
    pending > 0
      ? "text-amber-500"
      : "text-emerald-500"
  }`}
>₹{pending.toLocaleString()}</span>
                      </div>
         
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
<div className="grid gap-6 lg:grid-cols-5 items-start">

  {/* Left Column */}
<Card className="lg:col-span-3 p-6">

  <div className="mb-6 flex items-center gap-4">

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
      <Activity className="h-5 w-5 text-violet-400" />
    </div>

    <h2 className="text-2xl font-bold tracking-tight">
      Recent Activity
    </h2>

  </div>

  <RecentActivity />

</Card>

  {/* Right Column */}
  <div className="lg:col-span-2 grid gap-2.5">

    {/* <AchievementsCard /> */}
    <TeacherProgress />

    {/* <NoticeBoard /> */}
    {/* <ClassLedgerAI /> */}
       <TeachingLegacy />
    

  </div>
<SpeedInsights/>
</div>
<Footer />
    </div>
  );

}

function StatCard({ label, value, icon: Icon, tone, emoji }: { label: string; value: React.ReactNode; icon: React.ElementType; tone: "primary" | "success" | "warning"; emoji: string }) {
  const toneBg = tone === "success" ? "bg-success/10 text-success" : tone === "warning" ? "bg-warning/15 text-warning-foreground" : "bg-primary/10 text-primary";
  return (
    <Card className="group h-full rounded-2xl border border-border/60 bg-card/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-lg cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="text-2xl font-semibold mt-2">{value}</div>
        </div>
        <div className={`h-10 w-10 rounded-lg grid place-items-center text-lg ${toneBg}`} aria-hidden>
          <span>{emoji}</span>
        </div>
      </div>
    </Card>
  );
}

function ActionButton({ to, icon: Icon, title, desc }: { to: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <Link to={to as any}>
     <Card className="group rounded-2xl border border-border/60 bg-card/50 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg cursor-pointer h-full">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-sm">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}


function RecentActivity() {
  
  const students = useQuery({ queryKey: ["students", "all"], queryFn: () => fetchStudents() });
  const fees = useQuery({ queryKey: ["fees", "recent"], queryFn: () => fetchFees({ limit: 20 }) });
  const att = useQuery({ queryKey: ["attendance", "recent"], queryFn: () => fetchAttendance({ limit: 20 }) });

  if (students.isLoading || fees.isLoading || att.isLoading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  const studentsById = new Map((students.data ?? []).map((s) => [s.id, s]));

  type Item = {
  when: string;
  title: string;
  subtitle: string;
  kind: "fee" | "att" | "new";
};
  const items: Item[] = [];
  (fees.data ?? []).filter((f) => f.status === "paid" && f.payment_date).forEach((f) => {
    const name = studentsById.get(f.student_id)?.student_name ?? "Student";
   items.push({
  when: f.payment_date!,
  title: name,
  subtitle: `Collected ₹${Number(f.amount).toLocaleString()}`,
  kind: "fee",
});
  });
  (att.data ?? []).forEach((a) => {
    const name = studentsById.get(a.student_id)?.student_name ?? "Student";
    items.push({
  when: a.date,
  title: name,
  subtitle:
    a.status === "present"
      ? "Attendance marked Present"
      : "Attendance marked Absent",
  kind: "att",
});
  });
  (students.data ?? []).forEach((s) => {
    items.push({
  when: s.created_at.slice(0, 10),
  title: s.student_name,
  subtitle: "New student enrolled",
  kind: "new",
});
  });

  items.sort((a, b) => (a.when < b.when ? 1 : -1));
  const top = items.slice(0, 8);
  if (top.length === 0) return <div className="text-sm text-muted-foreground">No activity yet. Start by adding a student.</div>;

return (
  <div className="space-y-4">
    {top.map((i, idx) => {
      const icon =
        i.kind === "fee" ? (
          <Wallet className="h-5 w-5 text-amber-400" />
        ) : i.kind === "att" ? (
        <CalendarCheck className="h-5 w-5 text-sky-400" />
        ) : (
          <UserPlus className="h-5 w-5 text-violet-400" />
        );

      const iconBg =
        i.kind === "fee"
          ? "bg-amber-500/15"
          : i.kind === "att"
          ? "bg-sky-500/15"
          : "bg-violet-500/15";

      const dotColor =
        i.kind === "fee"
          ? "bg-amber-400"
          : i.kind === "att"
          ? i.subtitle.includes("Absent")
            ? "bg-red-400"
            : "bg-emerald-400"
          : "bg-violet-400";

      const date = new Date(i.when);

      const day = getRelativeDay(i.when);

      return (
        <div
          key={idx}
         className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/40 px-4 py-3 transition-all duration-300 hover:border-violet-500/20 hover:bg-card hover:shadow-lg hover:shadow-violet-500/5"
        >
          {/* Left */}

          <div className="flex items-center gap-4">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
            >
              {icon}
            </div>

            <div>

              <h3 className="text-base font-semibold">
                {i.title}
              </h3>

              <p className="mt-0.5 text-sm text-muted-foreground">
                {i.subtitle}
              </p>

            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-3">

            <div className="text-right">

              <div className="text-sm font-semibold">
                {day}
              </div>

              <div className="text-xs text-muted-foreground">
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

            </div>

            <div className={`h-3 w-3 rounded-full ${dotColor}`} />

          </div>

        </div>
      );
    })}
  </div>
);
}
function monthLabel(m: string) {
  const [y, mm] = m.split("-").map(Number);
  return new Date(y, mm - 1, 1).toLocaleString(undefined, { month: "short" });

}
function getRelativeDay(dateString: string) {
  const today = new Date();
  const date = new Date(dateString);

  // Reset time to midnight for comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff =
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff === 2) return "2 days ago";
  if (diff === 3) return "3 days ago";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

