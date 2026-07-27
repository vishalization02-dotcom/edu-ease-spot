import {
  AlertTriangle,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  UserPlus,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type Insight = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: string;
  badgeColor: string;
};

function InsightRow({
  title,
  description,
  icon,
  iconBg,
  badge,
  badgeColor,
}: Insight) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 transition-all duration-200 hover:bg-card hover:border-primary/30">
      <div
        className={`flex h-9 w-9 shrink- items-center justify-center rounded-lg ${iconBg}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor}`}
      >
        {badge}
      </span>
    </div>
  );
}

export function SmartInsights() {
  // Temporary static insights
  // Later these will come from Supabase.

  const insights: Insight[] = [
    {
      id: 1,
      title: "Attendance Alert",
      description: "Rahul has missed the last 3 consecutive classes.",
      badge: "High",
      badgeColor: "bg-red-500/15 text-red-400",
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
      iconBg: "bg-red-500/15",
    },

    {
      id: 2,
      title: "Perfect Attendance",
      description: "2 batches achieved 100% attendance today.",
      badge: "Good",
      badgeColor: "bg-emerald-500/15 text-emerald-400",
      icon: <CalendarCheck className="h-5 w-5 text-emerald-400" />,
      iconBg: "bg-emerald-500/15",
    },

    {
      id: 3,
      title: "Fastest Growing Batch",
      description: "Science Batch gained 3 new students this month.",
      badge: "New",
      badgeColor: "bg-sky-500/15 text-sky-400",
      icon: <TrendingUp className="h-5 w-5 text-sky-400" />,
      iconBg: "bg-sky-500/15",
    },
  ];

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Today's Insights</h2>

          <p className="text-sm text-muted-foreground">
            Powered by your classroom activity.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightRow key={insight.id} {...insight} />
        ))}
      </div>
    </Card>
  );
}