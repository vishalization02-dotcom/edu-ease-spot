import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Check, X, Save, CalendarCheck, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { fetchAttendance, fetchClasses, fetchStudents, todayISO } from "@/lib/classledger-data";
import { ClassSelector } from "@/components/class-selector";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_authenticated/attendance")({
  validateSearch: (search: Record<string, unknown>): { classId?: string } =>
    typeof search.classId === "string" ? { classId: search.classId } : {},
  component: AttendancePage,
});

function AttendancePage() {
  const qc = useQueryClient();
  const [date, setDate] = useState(todayISO());
  const [marks, setMarks] = useState<Record<string, "present" | "absent">>({});
  const [saving, setSaving] = useState(false);
  const { classId: classIdParam } = Route.useSearch();
  const [classId, setClassId] = useState<string | undefined>(classIdParam);

  const classes = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  useEffect(() => {
    if (!classId && classes.data && classes.data.length > 0) setClassId(classes.data[0].id);
  }, [classes.data, classId, classIdParam]);

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
    <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        icon={CalendarCheck}
        title="Attendance"
        description="Tap Present or Absent for each student, then Save."
      >
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Class</Label>
            <ClassSelector classes={classes.data ?? []} value={classId} onChange={setClassId} placeholder="Select class" className="w-[160px] sm:w-[180px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[150px] sm:w-[160px]" />
          </div>
          <Button onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>
      </PageHeader>

      {(classes.data ?? []).length === 0 && (
        <Card>
          <EmptyState
            icon={Users}
            title="No classes yet"
            description="Create a class before you can mark attendance."
            action={<Link to="/classes"><Button>Go to Classes</Button></Link>}
          />
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center hover-lift"><div className="text-2xl font-semibold text-success">{summary.present}</div><div className="mt-0.5 text-xs font-medium text-muted-foreground">Present</div></Card>
        <Card className="p-4 text-center hover-lift"><div className="text-2xl font-semibold text-destructive">{summary.absent}</div><div className="mt-0.5 text-xs font-medium text-muted-foreground">Absent</div></Card>
        <Card className="p-4 text-center hover-lift"><div className="text-2xl font-semibold text-muted-foreground">{Math.max(summary.unmarked, 0)}</div><div className="mt-0.5 text-xs font-medium text-muted-foreground">Unmarked</div></Card>
      </div>

      <Card className="divide-y divide-border/60 overflow-hidden">
        {(students.data ?? []).length === 0 && (
          <EmptyState icon={Users} title="No students yet" description="Add students to this class to start marking attendance." />
        )}
        {(students.data ?? []).map((s) => {
          const m = marks[s.id];
          return (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-accent/30">
              <div className="min-w-0">
                <div className="truncate font-medium">{s.student_name}</div>
                <div className="text-xs text-muted-foreground">{s.course}</div>
              </div>
              <div className="flex flex-1 gap-2 sm:flex-none">
                <Button
                  size="sm"
                  variant={m === "present" ? "default" : "outline"}
                  className={`flex-1 sm:flex-none ${m === "present" ? "bg-success text-success-foreground hover:bg-success/90" : ""}`}
                  onClick={() => setMarks((prev) => ({ ...prev, [s.id]: "present" }))}
                >
                  <Check className="h-4 w-4" />Present
                </Button>
                <Button
                  size="sm"
                  variant={m === "absent" ? "destructive" : "outline"}
                  className="flex-1 sm:flex-none"
                  onClick={() => setMarks((prev) => ({ ...prev, [s.id]: "absent" }))}
                >
                  <X className="h-4 w-4" />Absent
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}