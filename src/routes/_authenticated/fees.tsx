import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { currentMonth, fetchClasses, fetchFees, fetchStudents } from "@/lib/classledger-data";
import { ClassSelector } from "@/components/class-selector";

export const Route = createFileRoute("/_authenticated/fees")({
  component: FeesPage,
});

function FeesPage() {
  const qc = useQueryClient();
  const [month, setMonth] = useState(currentMonth());
  const [classId, setClassId] = useState<string | undefined>(undefined);

  const classes = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  useEffect(() => {
    if (!classId && classes.data && classes.data.length > 0) setClassId(classes.data[0].id);
  }, [classes.data, classId]);

  const students = useQuery({
    queryKey: ["students", "class", classId ?? ""],
    queryFn: () => fetchStudents(classId),
    enabled: !!classId,
  });
  const studentIds = useMemo(() => (students.data ?? []).map((s) => s.id), [students.data]);
  const fees = useQuery({
    queryKey: ["fees", "month", month, "class", classId ?? ""],
    queryFn: () => fetchFees({ month, studentIds }),
    enabled: studentIds.length > 0,
  });

  const feeMap = useMemo(() => {
    const m = new Map<string, { id?: string; status: "paid" | "pending"; amount: number; payment_date?: string | null }>();
    (fees.data ?? []).forEach((f) => m.set(f.student_id, { id: f.id, status: f.status, amount: Number(f.amount), payment_date: f.payment_date }));
    return m;
  }, [fees.data]);

  const totals = useMemo(() => {
    const list = students.data ?? [];
    let collected = 0;
    let pending = 0;
    list.forEach((s) => {
      const f = feeMap.get(s.id);
      if (f?.status === "paid") collected += f.amount;
      else pending += Number(s.monthly_fee);
    });
    return { collected, pending };
  }, [students.data, feeMap]);

  async function setStatus(studentId: string, monthlyFee: number, status: "paid" | "pending") {
    const { data: userData } = await supabase.auth.getUser();
    const teacherId = userData.user?.id;
    if (!teacherId) return toast.error("Not signed in");
    const payload = {
      teacher_id: teacherId,
      student_id: studentId,
      month,
      amount: monthlyFee,
      status,
      payment_date: status === "paid" ? new Date().toISOString().slice(0, 10) : null,
    };
    const { error } = await supabase.from("fees").upsert(payload, { onConflict: "student_id,month" });
    if (error) return toast.error(error.message);
    toast.success(status === "paid" ? "Marked as paid" : "Marked as pending");
    qc.invalidateQueries({ queryKey: ["fees"] });
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fees</h1>
          <p className="text-sm text-muted-foreground">Track monthly fee collection.</p>
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <Label className="text-xs">Class</Label>
            <ClassSelector classes={classes.data ?? []} value={classId} onChange={setClassId} placeholder="Select class" className="h-10 w-[180px]" />
          </div>
          <div>
            <Label className="text-xs">Month</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-10 w-[180px]" />
          </div>
        </div>
      </div>

      {(classes.data ?? []).length === 0 && (
        <Card className="p-6 text-sm">
          Create a class first. <Link to="/classes" className="text-primary font-medium">Go to Classes</Link>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5"><div className="text-xs text-muted-foreground">Collected</div><div className="text-2xl font-semibold text-success mt-1">₹{totals.collected.toLocaleString()}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Pending</div><div className="text-2xl font-semibold text-destructive mt-1">₹{totals.pending.toLocaleString()}</div></Card>
      </div>

      <Card className="divide-y">
        {(students.data ?? []).length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No students yet.</div>
        )}
        {(students.data ?? []).map((s) => {
          const f = feeMap.get(s.id);
          const status = f?.status ?? "pending";
          return (
            <div key={s.id} className="p-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="font-medium">{s.student_name}</div>
                <div className="text-xs text-muted-foreground">{s.course} · ₹{Number(s.monthly_fee).toLocaleString()}/mo</div>
              </div>
              <div className="flex items-center gap-3">
                {status === "paid" ? (
                  <Badge className="bg-success text-success-foreground">Paid{f?.payment_date ? ` · ${f.payment_date}` : ""}</Badge>
                ) : (
                  <Badge variant="destructive">Pending</Badge>
                )}
                {status === "paid" ? (
                  <Button variant="outline" size="sm" onClick={() => setStatus(s.id, Number(s.monthly_fee), "pending")}>Mark Pending</Button>
                ) : (
                  <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => setStatus(s.id, Number(s.monthly_fee), "paid")}>Mark Paid</Button>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}