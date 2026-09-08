import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/reset")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset your ClassLedger password" },
      {
        name: "description",
        content: "Set a new password for your ClassLedger account.",
      },
      { property: "og:title", content: "Reset your ClassLedger password" },
      {
        property: "og:description",
        content: "Set a new password for your ClassLedger account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);

useEffect(() => {
  let active = true;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (!active) return;

    console.log("AUTH RECOVERY EVENT:", event, session?.user?.email);

    if (event === "PASSWORD_RECOVERY" && session) {
      setReady(true);
      setChecking(false);
    }
  });

  async function initializeRecovery() {
    try {
      const hash = window.location.hash;

      const params = new URLSearchParams(hash.replace(/^#/, ""));

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      console.log("RECOVERY URL:", {
        type,
        hasAccessToken: Boolean(accessToken),
        hasRefreshToken: Boolean(refreshToken),
      });

      /*
       * Supabase normally detects these tokens automatically.
       * If the session has not been created yet, establish it explicitly.
       */
      if (type === "recovery" && accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!active) return;

        if (!error && data.session) {
          console.log("RECOVERY SESSION CREATED");
          setReady(true);
          setChecking(false);
          return;
        }

        console.error("RECOVERY SESSION ERROR:", error);
      }

      /*
       * Supabase may already have consumed the URL and created
       * the recovery session.
       */
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (!error && data.session) {
        console.log("EXISTING RECOVERY SESSION FOUND");
        setReady(true);
        setChecking(false);
        return;
      }

      console.log("NO RECOVERY SESSION YET");
    } catch (error) {
      console.error("RECOVERY INITIALIZATION ERROR:", error);
    }
  }

  initializeRecovery();

  const timeout = window.setTimeout(() => {
    if (!active) return;

    setChecking(false);
    setReady(false);
  }, 15000);

  return () => {
    active = false;
    window.clearTimeout(timeout);
    subscription.unsubscribe();
  };
}, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated successfully");

    await supabase.auth.signOut();

    navigate({
      to: "/auth",
      replace: true,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="icon-tile icon-tile-lg">
            <KeyRound className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-semibold">
              Create a new password
            </h1>

            <p className="text-sm text-muted-foreground">
              Keep your ClassLedger account secure.
            </p>
          </div>
        </div>

        {checking ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Verifying your reset link...
            </p>
          </div>
        ) : !ready ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              This reset link is invalid or has expired.
            </p>

            <Button
              className="w-full"
              onClick={() => navigate({ to: "/auth" })}
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reset-password">
                New password
              </Label>

              <Input
                id="reset-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reset-confirmation">
                Confirm new password
              </Label>

              <Input
                id="reset-confirmation"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={saving}
            >
              {saving ? (
                "Updating..."
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update password
                </>
              )}
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}