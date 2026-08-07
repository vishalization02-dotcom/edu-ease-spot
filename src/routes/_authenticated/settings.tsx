import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
// import { Settings as SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Upload,
  Download,
  Bell,
  Palette,
  School,
  CreditCard,
  ChevronRight,
  Building2,
  BellElectric,
  ThermometerSnowflakeIcon,
  LockKeyholeOpenIcon,
  LockIcon,
} from "lucide-react";
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
  // const [selected, setSelected] = useState<"home" | "profile" | "security">("home");

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
  const [selected, setSelected] = useState<
  | "home"
  | "profile"
  | "security"
  | "import"
  | "export"
  | "notifications"
  | "appearance"
  | "institute"
  | "subscription"
>("home");
const [exportDialog, setExportDialog] = useState(false);

const [exportType, setExportType] = useState("");

const [format, setFormat] = useState("pdf");
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
const settingCards = [
  {
    key: "profile",
    title: "Profile",
    desc: "Update your profile information",
    icon: User,
  },
  {
    key: "security",
    title: "Security",
    desc: "Password & login security",
    icon: Shield,
  },
  {
    key: "import",
    title: "Import Data",
    desc: "Import students and classes",
    icon: Upload,
  },
  {
    key: "export",
    title: "Export Data",
    desc: "Download reports",
    icon: Download,
  },
  {
    key: "notifications",
    title: "Notifications",
    desc: "Manage reminders",
    icon: Bell,
  },
  {
    key: "appearance",
    title: "Appearance",
    desc: "Theme settings",
    icon: Palette,
  },
  {
    key: "institute",
    title: "Institute",
    desc: "Institute information",
    icon: School,
  },
  {
    key: "subscription",
    title: "Subscription",
    desc: "Manage your plan",
    icon: CreditCard,
  },
] as const;

const exportOptions = {
  Students: {
    fields: [
      "Student Name",
      "Class",
      "Mobile Number",
      "Guardian Name",
      "Monthly Fee",
      "Address",
    ],
  },

  Attendance: {
    fields: [
      "Student Name",
      "Class",
      "Attendance Status",
      "Date",
      "Batch",
    ],
  },

  Fees: {
    fields: [
      "Student Name",
      "Amount",
      "Payment Date",
      "Payment Method",
      "Remarks",
      "Pending Amount",
    ],
  },

  Reports: {
    fields: [
      "Student Summary",
      "Attendance Summary",
      "Fee Summary",
      "Performance",
    ],
  },
} as const;

  return (
  <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">

    <PageHeader
      icon={SettingsIcon}
      title="Settings"
      description="Manage your teacher profile."
    />
{selected === "home" && (
  <div className="space-y-8">

    {/* General */}

    <div>

      <h2 className="mb-3 text-lg font-semibold">
        General
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

    <Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
  onClick={() => setSelected("profile")}
>
          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
              <User className="h-5 w-5 text-primary" /> 
              
              </div>

              <p className="text-sm text-muted-foreground">
                Update your personal information
              </p>

            </div>

            <span className="text-xl">›</span>

          </div>
        </Card>

        <Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
>
          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
                <Building2 className="h-5 w-5 text-primary" />

              </div>

              <p className="text-sm text-muted-foreground">
                Institute details
              </p>

            </div>

            <span className="text-xs bg-primary/20 rounded-full px-2 py-1">
              Soon
            </span>

          </div>
        </Card>

      </div>

    </div>

    {/* Data */}

    <div>

      <h2 className="mb-3 text-lg font-semibold">
        Data
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

    <Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"

>

          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
                <Upload className="h-5 w-5 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Import students & classes
              </p>

            </div>

            <span className="text-xs bg-primary/20 rounded-full px-2 py-1">
              Soon
            </span>

          </div>

        </Card>

 <Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
  onClick={() => setSelected("export")}
>
          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
                <Download className="h-5 w-5 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Download reports
              </p>

            </div>

           <span className="text-xl">›</span>

          </div>

        </Card>

      </div>

    </div>

    {/* Preferences */}

    <div>

      <h2 className="mb-3 text-lg font-semibold">
        Preferences
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

    <Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
 
>

          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
                <Bell className="h-5 w-5 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Fee reminders & alerts
              </p>

            </div>

            <span className="text-xs bg-primary/20 rounded-full px-2 py-1">
              Soon
            </span>

          </div>

        </Card>

<Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"

>
          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
                <Palette className="h-5 w-5 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Theme settings
              </p>

            </div>

            <span className="text-xs bg-primary/20 rounded-full px-2 py-1">
              Soon
            </span>

          </div>

        </Card>

      </div>

    </div>

    {/* Account */}

    <div>

      <h2 className="mb-3 text-lg font-semibold">
        Account
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

 <Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
  onClick={() => setSelected("security")}
>
          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
                <LockIcon className="h-5 w-5 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Change password
              </p>

            </div>

            <span className="text-xl">›</span>

          </div>

        </Card>
<Card
  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"

>
          <div className="flex justify-between items-center">

            <div>

              <div className="text-lg font-semibold">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Free Plan
              </p>

            </div>

            <span className="text-xs bg-primary/20 rounded-full px-2 py-1">
              Soon
            </span>

          </div>

        </Card>

      </div>

    </div>

  </div>
)}


    {selected === "profile" && (
      <>
        <Button
          variant="ghost"
          onClick={() => setSelected("home")}
        >
          ← Back
        </Button>

        <Card className="p-6">

          <h2 className="mb-4 text-base font-semibold tracking-tight">
            Profile
          </h2>

          <form onSubmit={saveProfile} className="space-y-4">

            <div className="space-y-1.5">
              <Label>Teacher name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Institute name</Label>
              <Input
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Mobile number</Label>
              <Input value={mobile} disabled />
            </div>

            <p className="text-xs text-muted-foreground">
              Mobile number is used to sign in and cannot be changed here.
            </p>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>

          </form>

        </Card>
      </>
    )}

    {selected === "security" && (
      <>
        <Button
          variant="ghost"
          onClick={() => setSelected("home")}
        >
          ← Back
        </Button>

        <Card className="p-6">

          <h2 className="mb-4 text-base font-semibold tracking-tight">
            Change Password
          </h2>

          <form
            onSubmit={changePassword}
            className="space-y-4"
          >

            <div className="space-y-1.5">
              <Label>New password</Label>

              <Input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Confirm password</Label>

              <Input
                type="password"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={pwSaving}
            >
              {pwSaving ? "Updating..." : "Update Password"}
            </Button>

          </form>

        </Card>
      </>
    )}

{selected === "export" && (
  <>
    <Button
      variant="ghost"
      className="mb-4"
      onClick={() => setSelected("home")}
    >
      ← Back
    </Button>

    <Card className="p-6">

      <h2 className="text-2xl font-bold">
        Export Data
      </h2>

      <p className="text-muted-foreground mb-6">
        Download your ClassLedger data in different formats.
      </p>

      <div className="space-y-4">

        <Card className="p-4 flex justify-between items-center">

          <div>

            <h3 className="font-semibold">
              📚 Students
            </h3>

            <p className="text-sm text-muted-foreground">
              Export student records
            </p>

          </div>

          <Button
    variant="outline"
    onClick={()=>{
        setExportType("Students");
        setExportDialog(true);
    }}
>
    Export
</Button>

        </Card>

        <Card className="p-4 flex justify-between items-center">

          <div>

            <h3 className="font-semibold">
              📅 Attendance
            </h3>

            <p className="text-sm text-muted-foreground">
              Export attendance reports
            </p>

          </div>

          <Button
    variant="outline"
    onClick={()=>{
        setExportType("Attendance");
        setExportDialog(true);
    }}
>
    Export
</Button>

        </Card>

        <Card className="p-4 flex justify-between items-center">

          <div>

            <h3 className="font-semibold">
              💰 Fees
            </h3>

            <p className="text-sm text-muted-foreground">
              Export fee collection reports
            </p>

          </div>

         <Button
    variant="outline"
    onClick={()=>{
        setExportType("Fees");
        setExportDialog(true);
    }}
>
    Export
</Button>

        </Card>

        <Card className="p-4 flex justify-between items-center">

          <div>

            <h3 className="font-semibold">
              📄 Reports
            </h3>

            <p className="text-sm text-muted-foreground">
              Export generated reports
            </p>

          </div>
<Button
    variant="outline"
    onClick={()=>{
        setExportType("Reports");
        setExportDialog(true);
    }}
>
    Export
</Button>

        </Card>

        <Card className="p-4 flex justify-between items-center border-primary/40">

          <div>

            <h3 className="font-semibold">
              💾 Full Backup
            </h3>

            <p className="text-sm text-muted-foreground">
              Download everything from your account
            </p>

          </div>

          <Button>
            Download
          </Button>

        </Card>

      </div>

    </Card>

  </>
)}
<Dialog
    open={exportDialog}
    onOpenChange={setExportDialog}
>

<DialogContent className="max-w-md">

<DialogHeader>

<DialogTitle>

Export {exportType}

</DialogTitle>

</DialogHeader>

<div className="space-y-6">

<div>

<p className="mb-3 font-medium">

Choose Format

</p>

<RadioGroup
value={format}
onValueChange={setFormat}
>

<div className="flex items-center gap-2">

<RadioGroupItem value="pdf" id="pdf"/>

<Label htmlFor="pdf">

PDF

</Label>

</div>

<div className="flex items-center gap-2">

<RadioGroupItem value="excel" id="excel"/>

<Label htmlFor="excel">

Excel

</Label>

</div>

<div className="flex items-center gap-2">

<RadioGroupItem value="csv" id="csv"/>

<Label htmlFor="csv">

CSV

</Label>

</div>

</RadioGroup>

</div>

<div>

<p className="mb-3 font-medium">

Include

</p>

<div className="space-y-3">

  {exportType &&
    exportOptions[
      exportType as keyof typeof exportOptions
    ]?.fields.map((field) => (

      <div
        key={field}
        className="flex items-center gap-3"
      >

        <Checkbox defaultChecked />

        <Label>{field}</Label>

      </div>

  ))}

</div>

</div>

</div>

<DialogFooter>

<Button
variant="outline"
onClick={()=>setExportDialog(false)}
>

Cancel

</Button>

<Button>

Export

</Button>

</DialogFooter>

</DialogContent>

</Dialog>
  </div>
);
}