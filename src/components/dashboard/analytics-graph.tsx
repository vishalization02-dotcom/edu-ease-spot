import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { revenueData } from "./analytics-data";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-xl">
      <p className="mb-3 text-sm font-semibold">Day {label}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-6">
          <span className="text-sm text-muted-foreground">Current</span>

          <span className="font-semibold text-blue-500">₹{payload[1].value.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-sm text-muted-foreground">Previous</span>

          <span className="font-semibold text-amber-500">₹{payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsGraph() {
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer>
        <AreaChart
          data={revenueData}
          margin={{
            top: 10,
            right: 5,
            left: -15,
            bottom: -11,
          }}
        >
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />

              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />

              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.12} />

          <XAxis dataKey="day" tickLine={false} axisLine={false} />

          <YAxis tickLine={false} axisLine={false} />

          <Tooltip cursor={false} content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="previous"
            stroke="#f59e0b"
            strokeWidth={3}
            fill="url(#previousGradient)"
            animationDuration={1200}
            activeDot={{
              r: 6,
            }}
          />

          <Area
            type="monotone"
            dataKey="current"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#currentGradient)"
            animationDuration={1500}
            activeDot={{
              r: 7,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
