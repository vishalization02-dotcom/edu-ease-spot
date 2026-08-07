import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { signInTeacher, signUpTeacher, normalizeMobile } from "@/lib/auth-helpers";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground glow-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">ClassLedger</div>
            <div className="text-xs text-muted-foreground">For independent teachers</div>
          </div>
        </div>

        <Card className="p-6 shadow-xl">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onDone={() => navigate({ to: "/dashboard", replace: true })} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onDone={() => setTab("login")} />
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">
            Back home
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const m = normalizeMobile(mobile);
    if (m.length < 6) return toast.error("Enter a valid mobile number");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await signInTeacher(m, password);
    setLoading(false);
    if (error) return toast.error(error.message || "Invalid mobile or password");
    toast.success("Welcome back!");
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="l-mobile">Mobile number</Label>
        <Input
          id="l-mobile"
          inputMode="tel"
          autoComplete="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="9876543210"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="l-pw">Password</Label>
        <Input
          id="l-pw"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [institute, setInstitute] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullName.trim().length < 2) return toast.error("Enter your full name");
    const m = normalizeMobile(mobile);
    if (m.length < 6) return toast.error("Enter a valid mobile number");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const { error } = await signUpTeacher({
      fullName: fullName.trim(),
      mobile: m,
      password,
      instituteName: institute.trim() || undefined,
    });
    setLoading(false);
    if (error) return toast.error(error.message || "Could not create account");
    toast.success("Account created — please sign in");
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="r-name">Full name</Label>
        <Input
          id="r-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Priya Sharma"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="r-mobile">Mobile number</Label>
        <Input
          id="r-mobile"
          inputMode="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="9876543210"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="r-institute">
          Institute name <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="r-institute"
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
          placeholder="Priya's Music Class"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="r-pw">Password</Label>
          <Input
            id="r-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-pw2">Confirm</Label>
          <Input
            id="r-pw2"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
}
