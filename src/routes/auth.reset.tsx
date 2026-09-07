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

      if (event === "PASSWORD_RECOVERY") {
        setReady(Boolean(session));
        setChecking(false);
      }
    });

    async function checkExistingSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (!error && data.session) {
        setReady(true);
        setChecking(false);
      }
    }

    checkExistingSession();

    const timeout = window.setTimeout(() => {
      if (active) {
        setChecking(false);
        setReady(false);
      }
    }, 10000);

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