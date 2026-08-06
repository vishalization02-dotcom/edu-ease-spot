import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teachers").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [name, setName] = useState("");
  const [institute, setInstitute] = useState("");
  const [mobile, setMobile] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile.data) {
      setName(profile.data.full_name ?? "");
      setInstitute(profile.data.institute_name ?? "");
      setMobile(profile.data.mobile ?? "");
    }
  }, [profile.data]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.data?.id) return;
    setSaving(true);
    const { error } = await supabase.from("teachers").update({
      full_name: name.trim(),
      institute_name: institute.trim() || null,
    }).eq("id", profile.data?.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    qc.invalidateQueries({ queryKey: ["me"] });
  }

  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPw !== newPw2) return toast.error("Passwords do not match");
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setNewPw(""); setNewPw2("");
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-fade-in">
      <PageHeader icon={SettingsIcon} title="Settings" description="Manage your teacher profile." />

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold tracking-tight">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="space-y-1.5"><Label>Teacher name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Institute name</Label><Input value={institute} onChange={(e) => setInstitute(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Mobile number</Label><Input value={mobile} disabled /></div>
          <p className="text-xs text-muted-foreground">Mobile number is used to sign in and cannot be changed here.</p>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold tracking-tight">Change password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="space-y-1.5"><Label>New password</Label><Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Confirm new password</Label><Input type="password" value={newPw2} onChange={(e) => setNewPw2(e.target.value)} /></div>
          <Button type="submit" disabled={pwSaving}>{pwSaving ? "Updating…" : "Update password"}</Button>
        </form>
      </Card>
    </div>
  );
}