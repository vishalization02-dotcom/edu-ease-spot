import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ArrowLeft, Users, CalendarCheck, AlertTriangle, IndianRupee, ClipboardCheck, Wallet, UserPlus, CalendarDays, Check, X, HelpCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  currentMonth,
  fetchAttendance,
  fetchClasses,
  fetchFees,
  fetchStudents,
  todayISO,
} from "@/lib/classledger-data";

export const Route = createFileRoute("/_authenticated/classes/$id")({
  component: ClassDashboardPage,
});

function ClassDashboardPage() {
  const { id } = Route.useParams();
  const classes = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  const cls = (classes.data ?? []).find((c) => c.id === id);

  const students = useQuery({
    queryKey: ["students", "class", id],
    queryFn: () => fetchStudents(id),
  });

  const studentIds = useMemo(() => (students.data ?? []).map((s) => s.id), [students.data]);
  const today = todayISO();
  const month = currentMonth();

  const attendance = useQuery({
    queryKey: ["attendance", "day", today, "class", id],
    queryFn: () => fetchAttendance({ date: today, studentIds }),
    enabled: studentIds.length > 0,
  });
  // Last 90 days for per-student attendance %
  const attFrom = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  }, []);
  const attendance90 = useQuery({
    queryKey: ["attendance", "class-summary", id, attFrom],
    queryFn: () => fetchAttendance({ dateFrom: attFrom, studentIds }),
    enabled: studentIds.length > 0,
  });
  const fees = useQuery({
    queryKey: ["fees", "month", month, "class", id],
    queryFn: () => fetchFees({ month, studentIds }),
    enabled: studentIds.length > 0,
  });

  const totalStudents = students.data?.length ?? 0;
  const present = (attendance.data ?? []).filter((a) => a.status === "present").length;
  const absent = (attendance.data ?? []).filter((a) => a.status === "absent").length;
  const paidSet = new Set((fees.data ?? []).filter((f) => f.status === "paid").map((f) => f.student_id));
  const collected = (fees.data ?? []).filter((f) => f.status === "paid").reduce((s, f) => s + Number(f.amount || 0), 0);
  const pending = (students.data ?? []).filter((s) => !paidSet.has(s.id)).reduce((s, x) => s + Number(x.monthly_fee || 0), 0);
  const expectedTotal = (students.data ?? []).reduce((s, x) => s + Number(x.monthly_fee || 0), 0);
  const collectionRate = expectedTotal > 0 ? Math.round((collected / expectedTotal) * 100) : 0;

  const attStats = useMemo(() => {
    const m = new Map<string, { present: number; total: number }>();
    (attendance90.data ?? []).forEach((a) => {
      const cur = m.get(a.student_id) ?? { present: 0, total: 0 };
      cur.total += 1;
      if (a.status === "present") cur.present += 1;
      m.set(a.student_id, cur);
    });
    return m;
  }, [attendance90.data]);

  const feeStatusMap = useMemo(() => {
    const m = new Map<string, "paid" | "pending">();
    (fees.data ?? []).forEach((f) => m.set(f.student_id, f.status));
    return m;
  }, [fees.data]);

  const todayMap = useMemo(() => {
    const m = new Map<string, "present" | "absent">();
    (attendance.data ?? []).forEach((a) => m.set(a.student_id, a.status));
    return m;
  }, [attendance.data]);

  const roster = students.data ?? [];
  const presentList = roster.filter((s) => todayMap.get(s.id) === "present");
  const absentList = roster.filter((s) => todayMap.get(s.id) === "absent");
  const unmarkedList = roster.filter((s) => !todayMap.has(s.id));
  const paidList = roster.filter((s) => feeStatusMap.get(s.id) === "paid");
  const unpaidList = roster.filter((s) => feeStatusMap.get(s.id) !== "paid");

  if (!classes.isLoading && !cls) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-10 text-center">
          <div className="font-semibold text-lg">Class not found</div>
          <div className="text-sm text-muted-foreground mt-1 mb-5">This class no longer exists.</div>
          <Link to="/classes"><Button>Back to Classes</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <Link to="/classes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />Back to Classes
        </Link>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{cls?.name ?? "Class"}</h1>
        {cls?.description && <p className="text-sm text-muted-foreground mt-1">{cls.description}</p>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Students" value={totalStudents} icon={Users} tone="primary" />
        <Stat label="Today's Attendance" value={`${present} present · ${absent} absent`} icon={CalendarCheck} tone="primary" />
        <Stat label={`Pending Fees (${monthLabel(month)})`} value={`₹${pending.toLocaleString()}`} icon={AlertTriangle} tone="warning" />
        <Stat label={`Collected (${monthLabel(month)})`} value={`₹${collected.toLocaleString()}`} icon={IndianRupee} tone="success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Action to="/students" classId={id} icon={UserPlus} title="Manage Students" desc="View and edit students" />
        <Action to="/attendance" classId={id} icon={ClipboardCheck} title="Mark Attendance" desc="Record today's attendance" />
        <Action to="/fees" classId={id} icon={Wallet} title="Collect Fees" desc="Track monthly payments" />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold">Class Overview</h2>
            <p className="text-xs text-muted-foreground">Fee collection this month & attendance over last 90 days</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <MiniStat label="Expected" value={`₹${expectedTotal.toLocaleString()}`} />
          <MiniStat label="Collected" value={`₹${collected.toLocaleString()}`} tone="success" />
          <MiniStat label="Pending" value={`₹${pending.toLocaleString()}`} tone="warning" />
          <MiniStat label="Collection Rate" value={`${collectionRate}%`} tone="primary" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Students in this class</h2>
          <span className="text-xs text-muted-foreground">{totalStudents} total</span>
        </div>
        {students.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : totalStudents === 0 ? (
          <div className="p-10 text-center">
            <div className="font-semibold">No students in this class yet</div>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first student to this class.</p>
            <Link to="/students" search={{ classId: id } as any}><Button><UserPlus className="h-4 w-4 mr-1" />Add Student</Button></Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Monthly Fee</TableHead>
                <TableHead>Attendance (90d)</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead className="hidden md:table-cell"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Joined</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(students.data ?? []).map((s) => {
                const st = attStats.get(s.id);
                const pct = st && st.total > 0 ? Math.round((st.present / st.total) * 100) : null;
                const feeStatus = feeStatusMap.get(s.id) ?? "pending";
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link to="/students/$id" params={{ id: s.id }} className="font-medium hover:text-primary">
                        {s.student_name}
                      </Link>
                      {s.parent_name && <div className="text-xs text-muted-foreground">Parent: {s.parent_name}</div>}
                    </TableCell>
                    <TableCell>{s.course}</TableCell>
                    <TableCell className="text-right">₹{Number(s.monthly_fee).toLocaleString()}</TableCell>
                    <TableCell>{pct == null ? <span className="text-muted-foreground text-xs">—</span> : `${pct}%`}</TableCell>
                    <TableCell>
                      {feeStatus === "paid" ? (
                        <Badge className="bg-success text-success-foreground hover:bg-success/90">Paid</Badge>
                      ) : (
                        <Badge variant="destructive">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{s.joining_date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {totalStudents > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h2 className="text-lg font-semibold">Today's attendance</h2>
            <p className="text-xs text-muted-foreground mb-4">{today}</p>
            <div className="space-y-4">
              <NameList title="Present" tone="success" icon={Check} students={presentList} />
              <NameList title="Absent" tone="destructive" icon={X} students={absentList} />
              <NameList title="Not marked yet" tone="muted" icon={HelpCircle} students={unmarkedList} />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-semibold">Fees · {monthLabel(month)}</h2>
            <p className="text-xs text-muted-foreground mb-4">Who has paid this month</p>
            <div className="space-y-4">
              <NameList title="Paid" tone="success" icon={Check} students={paidList} showFee />
              <NameList title="Pending" tone="destructive" icon={AlertTriangle} students={unpaidList} showFee />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function NameList({
  title,
  tone,
  icon: Icon,
  students,
  showFee,
}: {
  title: string;
  tone: "success" | "destructive" | "muted";
  icon: React.ElementType;
  students: { id: string; student_name: string; monthly_fee: number }[];
  showFee?: boolean;
}) {
  const chip =
    tone === "success"
      ? "bg-success/10 text-success"
      : tone === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-6 w-6 rounded-md grid place-items-center ${chip}`}><Icon className="h-3.5 w-3.5" /></span>
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">({students.length})</span>
      </div>
      {students.length === 0 ? (
        <div className="text-xs text-muted-foreground pl-8">None</div>
      ) : (
        <ul className="pl-8 space-y-1">
          {students.map((s) => (
            <li key={s.id} className="text-sm flex items-center justify-between gap-2">
              <Link to="/students/$id" params={{ id: s.id }} className="hover:text-primary truncate">{s.student_name}</Link>
              {showFee && <span className="text-xs text-muted-foreground shrink-0">₹{Number(s.monthly_fee).toLocaleString()}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "success" | "warning" | "primary" }) {
  const color = tone === "success" ? "text-success" : tone === "warning" ? "text-warning-foreground" : tone === "primary" ? "text-primary" : "";
  return (
    <div>
      <div className={`text-xl font-semibold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: React.ReactNode; icon: React.ElementType; tone: "primary" | "success" | "warning" }) {
  const toneBg = tone === "success" ? "bg-success/10 text-success" : tone === "warning" ? "bg-warning/15 text-warning-foreground" : "bg-primary/10 text-primary";
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="text-2xl font-semibold mt-2">{value}</div>
        </div>
        <div className={`h-10 w-10 rounded-lg grid place-items-center ${toneBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function Action({ to, classId, icon: Icon, title, desc }: { to: string; classId?: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <Link to={to as any} search={{ classId } as any}>
      <Card className="p-5 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer h-full">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-sm">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function monthLabel(m: string) {
  const [y, mm] = m.split("-").map(Number);
  return new Date(y, mm - 1, 1).toLocaleString(undefined, { month: "short" });
}