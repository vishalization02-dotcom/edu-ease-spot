import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Metric = "revenue" | "attendance" | "students";

function monthBounds(offset: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  return { start: iso(start), end: iso(end), daysInMonth: end.getDate(), label: start.toLocaleString("en-IN", { month: "long" }) };
}

async function fetchRange() {
  const prev = monthBounds(-1);
  const cur = monthBounds(0);

  const [feesRes, attRes, studRes] = await Promise.all([
    supabase
      .from("fees")
      .select("amount,status,payment_date")
      .eq("status", "paid")
      .gte("payment_date", prev.start)
      .lte("payment_date", cur.end),
    supabase
      .from("attendance")
      .select("date,status")
      .gte("date", prev.start)
      .lte("date", cur.end),
    supabase
      .from("students")
      .select("created_at")
      .gte("created_at", prev.start),
  ]);

  return {
    fees: feesRes.data ?? [],
    attendance: attRes.data ?? [],
    students: studRes.data ?? [],
    prev,
    cur,
  };
}

export function MonthComparison() {
  const [metric, setMetric] = useState<Metric>("revenue");
  const q = useQuery({ queryKey: ["month-comparison"], queryFn: fetchRange });

  const { chartData, curTotal, prevTotal, prevLabel, curLabel } = useMemo(() => {
    if (!q.data)
      return { chartData: [], curTotal: 0, prevTotal: 0, prevLabel: "", curLabel: "" };
    const { fees, attendance, students, prev, cur } = q.data;
    const days = Math.max(prev.daysInMonth, cur.daysInMonth);

    const pick = (dateStr: string) => {
      const d = new Date(dateStr);
      return { month: d.getMonth(), day: d.getDate(), year: d.getFullYear() };
    };
    const inMonth = (dateStr: string, b: ReturnType<typeof monthBounds>) =>
      dateStr >= b.start && dateStr <= b.end;

    const bucket = new Array(days).fill(0).map((_, i) => ({
      day: i + 1,
      current: 0,
      previous: 0,
    }));

    if (metric === "revenue") {
      fees.forEach((f: any) => {
        if (!f.payment_date) return;
        const { day } = pick(f.payment_date);
        if (inMonth(f.payment_date, cur)) bucket[day - 1].current += Number(f.amount || 0);
        else if (inMonth(f.payment_date, prev)) bucket[day - 1].previous += Number(f.amount || 0);
      });
    } else if (metric === "attendance") {
      attendance.forEach((a: any) => {
        if (a.status !== "present") return;
        const { day } = pick(a.date);
        if (inMonth(a.date, cur)) bucket[day - 1].current += 1;
        else if (inMonth(a.date, prev)) bucket[day - 1].previous += 1;
      });
    } else {
      students.forEach((s: any) => {
        const dateStr = String(s.created_at).slice(0, 10);
        const { day } = pick(dateStr);
        if (inMonth(dateStr, cur)) bucket[day - 1].current += 1;
        else if (inMonth(dateStr, prev)) bucket[day - 1].previous += 1;
      });
    }
 // cumulative for smoother comparison
    let c = 0;
    let p = 0;
    const cumulative = bucket.map((row) => {
      c += row.current;
      p += row.previous;
      return { day: row.day, current: c, previous: p };
    });

    return {
      chartData: cumulative,
      curTotal: c,
      prevTotal: p,
      prevLabel: prev.label,
      curLabel: cur.label,
    };
  }, [q.data, metric]);

  const growth =
    prevTotal === 0
      ? curTotal > 0
        ? 100
        : 0
      : ((curTotal - prevTotal) / prevTotal) * 100;
  const positive = growth >= 0;

  const format = (v: number) =>
    metric === "revenue" ? `₹${v.toLocaleString()}` : v.toLocaleString();

  const metricLabel =
    metric === "revenue" ? "Revenue" : metric === "attendance" ? "Attendance" : "New Students";

  const metrics: { key: Metric; label: string }[] = [
    { key: "revenue", label: "Revenue" },
    { key: "attendance", label: "Attendance" },
    { key: "students", label: "Students" },
  ];
 return (
    <Card className="p-6 h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Monthly Performance</h2>
            <p className="text-sm text-muted-foreground">
              {curLabel} vs {prevLabel}
            </p>
          </div>
        </div>
        <div className="flex gap-1 rounded-lg border border-border/60 bg-card/40 p-1">
          {metrics.map((m) => (
            <Button
              key={m.key}
              size="sm"
              variant={metric === m.key ? "default" : "ghost"}
              className="h-7 px-3 text-xs"
              onClick={() => setMetric(m.key)}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>
 <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (metric === "revenue" ? `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}` : String(v))}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number, name) => [format(value), name === "current" ? curLabel : prevLabel]}
              labelFormatter={(d) => `Day ${d}`}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => (value === "current" ? curLabel : prevLabel)}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#94a3b8"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: "#94a3b8" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
        <div>
          <div className="text-xs text-muted-foreground">{prevLabel} ({metricLabel})</div>
          <div className="mt-1 text-lg font-semibold">{format(prevTotal)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{curLabel} ({metricLabel})</div>
          <div className="mt-1 text-lg font-semibold text-primary">{format(curTotal)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Growth</div>
          <div
            className={`mt-1 flex items-center gap-1 text-lg font-semibold ${
              positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {positive ? "+" : ""}
            {growth.toFixed(1)}%
          </div>
        </div>
      </div>
    </Card>
  );
}