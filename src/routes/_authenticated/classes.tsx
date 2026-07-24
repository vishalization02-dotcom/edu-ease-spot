import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { fetchClasses, fetchStudents, type ClassRow } from "@/lib/classledger-data";

export const Route = createFileRoute("/_authenticated/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const qc = useQueryClient();
  const classes = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  const students = useQuery({ queryKey: ["students", "all"], queryFn: () => fetchStudents() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRow | null>(null);

  const counts = new Map<string, number>();
  (students.data ?? []).forEach((s) => counts.set(s.class_id, (counts.get(s.class_id) ?? 0) + 1));

  async function handleDelete(c: ClassRow) {
    if ((counts.get(c.id) ?? 0) > 0) return toast.error("Move or delete its students first");
    const { error } = await supabase.from("classes").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Class removed");
    qc.invalidateQueries({ queryKey: ["classes"] });
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Classes</h1>
          <p className="text-sm text-muted-foreground">Group students into classes or batches.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="h-11"><Plus className="h-4 w-4 mr-1" />Add Class</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Edit Class" : "Add Class"}</DialogTitle></DialogHeader>
            <ClassForm
              row={editing}
              onSaved={() => { setOpen(false); setEditing(null); qc.invalidateQueries({ queryKey: ["classes"] }); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {classes.isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (classes.data ?? []).length === 0 ? (
        <Card className="p-10 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <div className="font-semibold text-lg">No classes created yet.</div>
          <div className="text-sm text-muted-foreground mt-1 mb-5">Create your first class to start adding students.</div>
          <Button className="h-11" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" />Create Your First Class
          </Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(classes.data ?? []).map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  {c.description && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{c.description}</div>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {c.name}?</AlertDialogTitle>
                        <AlertDialogDescription>Classes with students can't be deleted. Move students first.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(c)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{counts.get(c.id) ?? 0}</span> student{(counts.get(c.id) ?? 0) === 1 ? "" : "s"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ClassForm({ row, onSaved }: { row: ClassRow | null; onSaved: () => void }) {
  const [name, setName] = useState(row?.name ?? "");
  const [desc, setDesc] = useState(row?.description ?? "");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Class name is required");
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const teacherId = userData.user?.id;
    if (!teacherId) { setSaving(false); return toast.error("Not signed in"); }
    const payload = { name: name.trim(), description: desc.trim() || null };
    const res = row
      ? await supabase.from("classes").update(payload).eq("id", row.id)
      : await supabase.from("classes").insert({ ...payload, teacher_id: teacherId });
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(row ? "Class updated" : "Class created");
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Class 10 Science" /></div>
      <div><Label>Description (optional)</Label><Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
      <DialogFooter>
        <Button type="submit" disabled={saving} className="w-full h-11">{saving ? "Saving…" : row ? "Save changes" : "Create class"}</Button>
      </DialogFooter>
    </form>
  );
}