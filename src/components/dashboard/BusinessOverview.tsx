import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IndianRupee, TrendingUp, TrendingDown } from "lucide-react";

interface BusinessOverviewProps {
  collected: number;
  pending: number;
}

export function BusinessOverview({
  collected,
  pending,
}: BusinessOverviewProps) {
  const expected = collected + pending;

  const percentage =
    expected === 0 ? 0 : Math.round((collected / expected) * 100);

  return (
    <Card className="rounded-2xl border border-border/60 bg-card px-5 py-4">

      {/* Header */}
      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
          <IndianRupee className="h-8 w-8 text-emerald-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Business Overview
          </h2>

          <p className="text-base text-muted-foreground">
            Track your coaching income at a glance.
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-border/50">

        <div className="pr-5">
          <p className="text-sm text-muted-foreground">
            Collected (This Month)
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            ₹{collected.toLocaleString()}
          </p>

          <div className="mt-2 flex items-center gap-1 text-sm text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span>Live Data</span>
          </div>
        </div>

        <div className="px-5">
          <p className="text-sm text-muted-foreground">
            Pending (This Month)
          </p>

          <p className="mt-2 text-3xl font-bold text-red-400">
            ₹{pending.toLocaleString()}
          </p>

          <div className="mt-2 flex items-center gap-1 text-sm text-red-400">
            <TrendingDown className="h-4 w-4" />
            <span>Awaiting Payment</span>
          </div>
        </div>

        <div className="px-5">
          <p className="text-sm text-muted-foreground">
            Expected Income
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            ₹{expected.toLocaleString()}
          </p>

          <p className="mt-2 flex items-center gap-1">
            This Month
          </p>
        </div>

        <div className="pl-5">
          <p className="text-sm text-muted-foreground">
            Collection Rate
          </p>

          <p className="mt-2 text-3xl font-bold text-violet-400">
            {percentage}%
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            of expected income
          </p>
        </div>

      </div>

      {/* Progress */}
      <div className="mt-4">
       <Progress value={percentage} className="h-2 rounded-full" />

        <p className="mt-2 text-center text-xs text-muted-foreground">
          {percentage}% collected of expected income
        </p>
      </div>

    </Card>
  );
}