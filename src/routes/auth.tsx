// import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  createFileRoute,
  useNavigate,
  Link,
  Outlet,
} from "@tanstack/react-router";
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

  const pathname = window.location.pathname;

  useEffect(() => {
    // Do not redirect recovery/forgot-password pages
    if (pathname === "/auth/forgot" || pathname === "/auth/reset") {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
      }
    });
  }, [navigate, pathname]);

  if (pathname === "/auth/forgot" || pathname === "/auth/reset") {
    return <Outlet />;
  }

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
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
const value = identifier.trim();

if (!value) {
  return toast.error("Enter your email or mobile number");
}

if (password.length < 6) {
  return toast.error("Password must be at least 6 characters");
}

setLoading(true);
const { error } = await signInTeacher(value, password);
    setLoading(false);
    if (error) return toast.error(error.message || "Invalid email/mobile or password")
    toast.success("Welcome back!");
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="l-identifier">Email or mobile number</Label>
        <Input
  id="l-identifier"
  type="text"
  autoComplete="username"
  value={identifier}
  onChange={(e) => setIdentifier(e.target.value)}
  placeholder="Email or 9876543210"
/>
      </div>
      <div className="space-y-1.5">
  <div className="flex items-center justify-between">
    <Label htmlFor="l-pw">Password</Label>

    <button
  type="button"
  onClick={() => {
    window.location.href = "/auth/forgot";
  }}
  className="text-xs text-primary hover:underline cursor-pointer"
>
  Forgot password?
</button>
  </div>

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [institute, setInstitute] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullName.trim().length < 2) return toast.error("Enter your full name");
    const m = normalizeMobile(mobile);
if (!/^[6-9]\d{9}$/.test(m)) {
  return toast.error("Enter a valid 10-digit mobile number");
}
const normalizedEmail = email.trim().toLowerCase();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
  return toast.error("Enter a valid email address");
}
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const { error } = await signUpTeacher({
  fullName: fullName.trim(),
  mobile: m,
  email: normalizedEmail,
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
        <div className="space-y-1.5">
  <Label htmlFor="r-email">Email address</Label>
  <Input
    id="r-email"
    type="email"
    autoComplete="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="you@example.com"
  />
</div>
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
