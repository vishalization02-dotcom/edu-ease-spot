import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Check, X, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { fetchAttendance, fetchClasses, fetchStudents, todayISO } from "@/lib/classledger-data";
import { ClassSelector } from "@/components/class-selector";

export const Route = createFileRoute("/_authenticated/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const qc = useQueryClient();
  const [date, setDate] = useState(todayISO());
  const [marks, setMarks] = useState<Record<string, "present" | "absent">>({});
  const [saving, setSaving] = useState(false);
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
  const dayAtt = useQuery({
    queryKey: ["attendance", "day", date, "class", classId ?? ""],
    queryFn: () => fetchAttendance({ date, studentIds }),
    enabled: studentIds.length > 0,
  });

  useEffect(() => {
    // seed marks from any existing attendance for the day
    const seed: Record<string, "present" | "absent"> = {};
    (dayAtt.data ?? []).filter((a) => a.date === date).forEach((a) => (seed[a.student_id] = a.status));
    setMarks(seed);
  }, [dayAtt.data, date]);

  const summary = useMemo(() => {
    const present = Object.values(marks).filter((s) => s === "present").length;
    const absent = Object.values(marks).filter((s) => s === "absent").length;
    return { present, absent, unmarked: (students.data?.length ?? 0) - present - absent };
  }, [marks, students.data]);

  async function save() {
    const list = students.data ?? [];
    if (list.length === 0) return toast.error("Add students first");
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const teacherId = userData.user?.id;
    if (!teacherId) { setSaving(false); return toast.error("Not signed in"); }
    const rows = list
      .filter((s) => marks[s.id])
      .map((s) => ({ teacher_id: teacherId, student_id: s.id, date, status: marks[s.id] }));
    if (rows.length === 0) { setSaving(false); return toast.error("Mark at least one student"); }
    const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "student_id,date" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`Attendance saved for ${rows.length} student${rows.length === 1 ? "" : "s"}`);
    qc.invalidateQueries({ queryKey: ["attendance"] });
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">Tap Present or Absent for each student, then Save.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <Label className="text-xs">Class</Label>
            <ClassSelector classes={classes.data ?? []} value={classId} onChange={setClassId} placeholder="Select class" className="h-10 w-[180px]" />
          </div>
          <div>
            <Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 w-[160px]" />
          </div>
          <Button onClick={save} disabled={saving} className="h-11 mt-4"><Save className="h-4 w-4 mr-1" />{saving ? "Saving…" : "Save Attendance"}</Button>
        </div>
      </div>

      {(classes.data ?? []).length === 0 && (
        <Card className="p-6 text-sm">
          Create a class first. <Link to="/classes" className="text-primary font-medium">Go to Classes</Link>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center"><div className="text-2xl font-semibold text-success">{summary.present}</div><div className="text-xs text-muted-foreground">Present</div></Card>
        <Card className="p-4 text-center"><div className="text-2xl font-semibold text-destructive">{summary.absent}</div><div className="text-xs text-muted-foreground">Absent</div></Card>
        <Card className="p-4 text-center"><div className="text-2xl font-semibold text-muted-foreground">{Math.max(summary.unmarked, 0)}</div><div className="text-xs text-muted-foreground">Unmarked</div></Card>
      </div>

      <Card className="divide-y">
        {(students.data ?? []).length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No students yet.</div>
        )}
        {(students.data ?? []).map((s) => {
          const m = marks[s.id];
          return (
            <div key={s.id} className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{s.student_name}</div>
                <div className="text-xs text-muted-foreground">{s.course}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={m === "present" ? "default" : "outline"}
                  className={m === "present" ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
                  onClick={() => setMarks((prev) => ({ ...prev, [s.id]: "present" }))}
                >
                  <Check className="h-4 w-4 mr-1" />Present
                </Button>
                <Button
                  variant={m === "absent" ? "destructive" : "outline"}
                  onClick={() => setMarks((prev) => ({ ...prev, [s.id]: "absent" }))}
                >
                  <X className="h-4 w-4 mr-1" />Absent
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}