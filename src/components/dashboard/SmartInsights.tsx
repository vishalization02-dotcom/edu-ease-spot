import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarCheck,
  Info,
  Sparkles,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  currentMonth,
  fetchAttendance,
  fetchClasses,
  fetchFees,
  fetchStudents,
  todayISO,
} from "@/lib/classledger-data";
import {
  generateInsights,
  type GeneratedInsight,
  type InsightIcon,
  type InsightPriority,
} from "@/lib/insights";

type Insight = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: string;
  badgeColor: string;
};

const ICON_MAP: Record<InsightIcon, typeof AlertTriangle> = {
  alert: AlertTriangle,
  attendance: CalendarCheck,
  growth: TrendingUp,
  money: Wallet,
  student: UserPlus,
  info: Info,
};

const PRIORITY_STYLES: Record<InsightPriority, { text: string; badge: string; iconBg: string }> = {
  High: { text: "text-red-400", badge: "bg-red-500/15 text-red-400", iconBg: "bg-red-500/15" },
  Medium: {
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-400",
    iconBg: "bg-amber-500/15",
  },
  Good: {
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
  New: { text: "text-sky-400", badge: "bg-sky-500/15 text-sky-400", iconBg: "bg-sky-500/15" },
};

function toInsight(generated: GeneratedInsight): Insight {
  const styles = PRIORITY_STYLES[generated.priority];
  const Icon = ICON_MAP[generated.icon];
  return {
    id: generated.id,
    title: generated.title,
    description: generated.description,
    badge: generated.priority,
    badgeColor: styles.badge,
    iconBg: styles.iconBg,
    icon: <Icon className={`h-5 w-5 ${styles.text}`} />,
  };
}

function InsightRow({ title, description, icon, iconBg, badge, badgeColor }: Insight) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 px-4 py-3 transition-all duration-200 hover:bg-card hover:border-primary/30">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>

          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor}`}>
            {badge}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function SmartInsights() {
  const today = todayISO();
  const month = currentMonth();

  const { data, isLoading } = useQuery({
    queryKey: ["insights", today, month],
    staleTime: 60_000,
    queryFn: async () => {
      const dateFrom = (() => {
        const d = new Date(`${today}T00:00:00`);
        d.setDate(d.getDate() - 30);
        return d.toISOString().slice(0, 10);
      })();

      const [classes, students, attendance, fees] = await Promise.all([
        fetchClasses(),
        fetchStudents(),
        fetchAttendance({ dateFrom }),
        fetchFees({ month }),
      ]);

      return { classes, students, attendance, fees };
    },
  });

  const insights: Insight[] = useMemo(() => {
    if (!data) return [];
    return generateInsights({ today, month, ...data }).map(toInsight);
  }, [data, today, month]);

  const summary = useMemo(() => {
    if (!data) return null;
    const totalStudents = data.students.length;
    const todayRows = data.attendance.filter((a) => a.date === today);
    const todayRate = todayRows.length
      ? Math.round(
          (todayRows.filter((a) => a.status === "present").length / todayRows.length) * 100,
        )
      : 0;
    const collected = data.fees
      .filter((f) => f.status === "paid")
      .reduce((sum, f) => sum + Number(f.amount || 0), 0);
    return { totalStudents, todayRate, collected };
  }, [data, today]);

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Today's Insights</h2>

          <p className="text-sm text-muted-foreground">Powered by your classroom activity.</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {isLoading &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[86px] animate-pulse rounded-xl border border-border/60 bg-card/40"
            />
          ))}
        {!isLoading && insights.map((insight) => <InsightRow key={insight.id} {...insight} />)}
      </div>

      {!isLoading && summary && (
        <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-card/40 p-4">
  {/* Students — YourClass theme color */}
  <div className="text-center">
    <p className="text-xs text-muted-foreground">Students</p>

    <p className="mt-1 text-lg font-semibold text-primary">
      {summary.totalStudents}
    </p>
  </div>

  {/* Attendance — Red when 0%, Orange otherwise */}
  <div className="text-center">
    <p className="text-xs text-muted-foreground">Attendance</p>

    <p
      className={`mt-1 text-lg font-semibold ${
        summary.todayRate === 0
          ? "text-red-500"
          : "text-orange-500"
      }`}
    >
      {summary.todayRate}%
    </p>
  </div>

  {/* Collected — Green */}
  <div className="text-center">
    <p className="text-xs text-muted-foreground">Collected</p>

    <p className="mt-1 text-lg font-semibold text-emerald-500">
      ₹{Math.round(summary.collected).toLocaleString("en-IN")}
    </p>
  </div>
</div>
      )}
    </Card>
  );
}
