import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, GraduationCap } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { currentMonth, type Student, type AttendanceRow, type FeeRow } from "@/lib/classledger-data";

export const Route = createFileRoute("/_authenticated/students/$id")({
  component: StudentDetail,
});

function StudentDetail() {
  const { id } = Route.useParams();

  const student = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Student | null;
    },
  });
  const attendance = useQuery({
    queryKey: ["attendance", "student", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("attendance").select("*").eq("student_id", id).order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AttendanceRow[];
    },
  });
  const fees = useQuery({
    queryKey: ["fees", "student", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("fees").select("*").eq("student_id", id).order("month", { ascending: false });
      if (error) throw error;
      return (data ?? []) as FeeRow[];
    },
  });

  if (student.isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  if (!student.data) return <div className="p-8">Student not found. <Link to="/students" className="text-primary">Back to students</Link></div>;

  const s = student.data;
  const att = attendance.data ?? [];
  const present = att.filter((a) => a.status === "present").length;
  const absent = att.filter((a) => a.status === "absent").length;
  const pct = att.length ? Math.round((present / att.length) * 100) : 0;
  const cur = (fees.data ?? []).find((f) => f.month === currentMonth());

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/students"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" />Students</Button></Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary glow-primary">
            <User className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{s.student_name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" /> {s.course}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-muted-foreground">Monthly fee</div>
            <div className="text-xl font-semibold">₹{Number(s.monthly_fee).toLocaleString()}</div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="mb-3 text-base font-semibold tracking-tight">Parent</h2>
          <div className="text-sm space-y-1">
            <div><span className="text-muted-foreground">Name:</span> {s.parent_name || "—"}</div>
            <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{s.parent_phone || "—"}</div>
            <div><span className="text-muted-foreground">Joined:</span> {s.joining_date}</div>
            {s.notes && <div className="pt-2 text-muted-foreground">{s.notes}</div>}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-base font-semibold tracking-tight">Attendance Summary</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-success/5 py-3"><div className="text-2xl font-semibold text-success">{present}</div><div className="text-xs font-medium text-muted-foreground">Present</div></div>
            <div className="rounded-xl bg-destructive/5 py-3"><div className="text-2xl font-semibold text-destructive">{absent}</div><div className="text-xs font-medium text-muted-foreground">Absent</div></div>
            <div className="rounded-xl bg-primary/5 py-3"><div className="text-2xl font-semibold text-primary">{pct}%</div><div className="text-xs font-medium text-muted-foreground">Rate</div></div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold tracking-tight">Current Month</h2>
          {cur?.status === "paid" ? (
            <Badge variant="success">Paid</Badge>
          ) : (
            <Badge variant="destructive">Pending</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {cur?.status === "paid"
            ? `Paid ₹${Number(cur.amount).toLocaleString()} on ${cur.payment_date}`
            : `Expected ₹${Number(s.monthly_fee).toLocaleString()}`}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-base font-semibold tracking-tight">Fee History</h2>
        {(fees.data ?? []).length === 0 ? (
          <div className="text-sm text-muted-foreground">No fee records yet.</div>
        ) : (
          <ul className="divide-y divide-border/60">
            {(fees.data ?? []).map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="font-medium">{f.month}</span>
                <span className="text-muted-foreground">₹{Number(f.amount).toLocaleString()}</span>
                {f.status === "paid" ? <Badge variant="success">Paid</Badge> : <Badge variant="destructive">Pending</Badge>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-base font-semibold tracking-tight">Recent Attendance</h2>
        {att.length === 0 ? (
          <div className="text-sm text-muted-foreground">No attendance recorded yet.</div>
        ) : (
          <ul className="divide-y divide-border/60">
            {att.slice(0, 15).map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium">{a.date}</span>
                {a.status === "present" ? <Badge variant="success">Present</Badge> : <Badge variant="destructive">Absent</Badge>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}