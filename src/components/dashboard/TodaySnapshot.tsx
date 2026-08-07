import { Card } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle2, XCircle, BarChart3 } from "lucide-react";

interface TodaySnapshotProps {
  students: number;
  classes: number;
  present: number;
  absent: number;
}

export function TodaySnapshot({ students, classes, present, absent }: TodaySnapshotProps) {
  return (
    <Card className="rounded-2xl border border-border/60 bg-card p-6">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15">
          <BarChart3 className="h-6 w-6 text-blue-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold">Today's Snapshot</h2>

          <p className="text-sm text-muted-foreground">Quick overview of today's activity</p>
        </div>
      </div>

      {/* Grid */}

      <div className="grid grid-cols-2 gap-3">
        <SnapshotItem
          icon={<Users className="h-5 w-5 text-violet-400" />}
          bg="bg-violet-500/15"
          label="Students"
          value={students}
        />

        <SnapshotItem
          icon={<BookOpen className="h-5 w-5 text-green-400" />}
          bg="bg-green-500/15"
          label="Classes"
          value={classes}
        />

        <SnapshotItem
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          bg="bg-emerald-500/15"
          label="Present"
          value={present}
        />

        <SnapshotItem
          icon={<XCircle className="h-5 w-5 text-red-400" />}
          bg="bg-red-500/15"
          label="Absent"
          value={absent}
        />
      </div>
    </Card>
  );
}

interface SnapshotItemProps {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: number;
}

function SnapshotItem({ icon, bg, label, value }: SnapshotItemProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-2.5 transition-all duration-200 hover:border-primary/30 hover:bg-background/70">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>{icon}</div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>

          <p className="mt-0.5 text-1xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
