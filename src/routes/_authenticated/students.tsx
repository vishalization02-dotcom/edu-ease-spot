import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  currentMonth,
  fetchAttendance,
  fetchClasses,
  fetchFees,
  fetchStudents,
  todayISO,
  type ClassRow,
  type Student,
} from "@/lib/classledger-data";
import { ClassSelector } from "@/components/class-selector";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_authenticated/students")({
  validateSearch: (search: Record<string, unknown>): { classId?: string } =>
    typeof search.classId === "string" ? { classId: search.classId } : {},
  component: StudentsPage,
});

function StudentsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
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
  // Last 90 days attendance only, scoped to this class's students
  const attFrom = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  }, []);
  const attendance = useQuery({
    queryKey: ["attendance", "class-summary", classId ?? "", attFrom],
    queryFn: () => fetchAttendance({ dateFrom: attFrom, studentIds }),
    enabled: studentIds.length > 0,
  });
  const fees = useQuery({
    queryKey: ["fees", "month", currentMonth(), "class", classId ?? ""],
    queryFn: () => fetchFees({ month: currentMonth(), studentIds }),
    enabled: studentIds.length > 0,
  });

  const attStats = useMemo(() => {
    const map = new Map<string, { present: number; total: number }>();
    (attendance.data ?? []).forEach((a) => {
      const cur = map.get(a.student_id) ?? { present: 0, total: 0 };
      cur.total += 1;
      if (a.status === "present") cur.present += 1;
      map.set(a.student_id, cur);
    });
    return map;
  }, [attendance.data]);

  const feeMap = useMemo(() => {
    const m = new Map<string, "paid" | "pending">();
    (fees.data ?? []).forEach((f) => m.set(f.student_id, f.status));
    return m;
  }, [fees.data]);

  const filtered = useMemo(() => {
    const list = students.data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (s) =>
        s.student_name.toLowerCase().includes(term) ||
        (s.course ?? "").toLowerCase().includes(term) ||
        (s.parent_name ?? "").toLowerCase().includes(term) ||
        (s.parent_phone ?? "").includes(term),
    );
  }, [students.data, q]);

  async function handleDelete(id: string) {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Student removed");
    qc.invalidateQueries({ queryKey: ["students"] });
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-in">
      <PageHeader icon={Users} title="Students" description="Add, edit, and search your learners.">
        <ClassSelector
          classes={classes.data ?? []}
          value={classId}
          onChange={setClassId}
          placeholder="Select class"
        />
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={(classes.data ?? []).length === 0}>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>
            </DialogHeader>
            <StudentForm
              student={editing}
              classes={classes.data ?? []}
              defaultClassId={classId}
              onSaved={() => {
                setOpen(false);
                setEditing(null);
                qc.invalidateQueries({ queryKey: ["students"] });
              }}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {(classes.data ?? []).length === 0 ? (
        <Card>
          <EmptyState
            icon={BookOpen}
            title="No classes created yet."
            description="Please create a class before adding students."
            action={
              <Link to="/classes">
                <Button>
                  <Plus className="h-4 w-4" />
                  Create Class
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <Card className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, course, parent, phone…"
                className="pl-9 h-11 border-transparent bg-muted/40"
              />
            </div>
          </Card>

          <Card className="overflow-hidden mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Monthly Fee</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Fee Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground py-8"
                    >
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!students.isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground py-10"
                    >
                      No students yet. Add your first student to get started.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((s: Student) => {
                  const st = attStats.get(s.id);
                  const pct = st && st.total > 0 ? Math.round((st.present / st.total) * 100) : null;
                  const feeStatus = feeMap.get(s.id) ?? "pending";
                  return (
                    <TableRow key={s.id} className="group">
                      <TableCell>
                        <Link
                          to="/students/$id"
                          params={{ id: s.id }}
                          className="font-medium hover:text-primary"
                        >
                          {s.student_name}
                        </Link>
                        {s.parent_name && (
                          <div className="text-xs text-muted-foreground">
                            Parent: {s.parent_name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{s.course}</TableCell>
                      <TableCell className="text-right">
                        ₹{Number(s.monthly_fee).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {pct == null ? (
                          <span className="text-muted-foreground text-xs">—</span>
                        ) : (
                          `${pct}%`
                        )}
                      </TableCell>
                      <TableCell>
                        {feeStatus === "paid" ? (
                          <Badge className="bg-success text-success-foreground hover:bg-success/90">
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9"
                            onClick={() => {
                              setEditing(s);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete {s.student_name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will also delete attendance and fee records for this student.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(s.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}

function StudentForm({
  student,
  classes,
  defaultClassId,
  onSaved,
}: {
  student: Student | null;
  classes: ClassRow[];
  defaultClassId?: string;
  onSaved: () => void;
}) {
  const [name, setName] = useState(student?.student_name ?? "");
  const [parentName, setParentName] = useState(student?.parent_name ?? "");
  const [parentPhone, setParentPhone] = useState(student?.parent_phone ?? "");
  const [course, setCourse] = useState(student?.course ?? "");
  const [fee, setFee] = useState(String(student?.monthly_fee ?? ""));
  const [joining, setJoining] = useState(student?.joining_date ?? todayISO());
  const [notes, setNotes] = useState(student?.notes ?? "");
  const [classId, setClassId] = useState<string>(
    student?.class_id ?? defaultClassId ?? classes[0]?.id ?? "",
  );
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Student name is required");
    if (!course.trim()) return toast.error("Course is required");
    if (!classId) return toast.error("Choose a class");
    const monthlyFee = Number(fee || 0);
    if (Number.isNaN(monthlyFee) || monthlyFee < 0) return toast.error("Fee must be a number");
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const teacherId = userData.user?.id;
    if (!teacherId) {
      setSaving(false);
      return toast.error("Not signed in");
    }
    const payload = {
      student_name: name.trim(),
      parent_name: parentName.trim() || null,
      parent_phone: parentPhone.trim() || null,
      course: course.trim(),
      monthly_fee: monthlyFee,
      joining_date: joining,
      notes: notes.trim() || null,
      class_id: classId,
    };
    const res = student
      ? await supabase.from("students").update(payload).eq("id", student.id)
      : await supabase.from("students").insert({ ...payload, teacher_id: teacherId });
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(student ? "Student updated" : "Student added");
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Class</Label>
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Student name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Parent name</Label>
          <Input value={parentName} onChange={(e) => setParentName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Parent phone</Label>
          <Input
            value={parentPhone}
            inputMode="tel"
            onChange={(e) => setParentPhone(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Course / Class</Label>
          <Input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. Guitar Beginner"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Monthly fee (₹)</Label>
          <Input value={fee} onChange={(e) => setFee(e.target.value)} inputMode="decimal" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Joining date</Label>
        <Input type="date" value={joining} onChange={(e) => setJoining(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Notes (optional)</Label>
        <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <DialogFooter>
        <Button type="submit" size="lg" disabled={saving} className="w-full">
          {saving ? "Saving…" : student ? "Save changes" : "Add student"}
        </Button>
      </DialogFooter>
    </form>
  );
}
