import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/forgot")({
  ssr: false,
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    toast.error("Enter your email address");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    toast.error("Enter a valid email address");
    return;
  }

  setLoading(true);
console.log("RESET REDIRECT:", "https://edu-ease-spot.vercel.app/auth/reset");
  const { error } = await supabase.auth.resetPasswordForEmail(
    normalizedEmail,
    {
      redirectTo: "https://edu-ease-spot.vercel.app/auth/reset",
    },
  );

  setLoading(false);

  if (error) {
    toast.error(error.message);
    return;
  }

  setSent(true);
  toast.success("Password reset email sent");
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="icon-tile icon-tile-lg">
            <Mail className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-semibold">
              Reset your password
            </h1>

            <p className="text-sm text-muted-foreground">
              We'll send you a link to create a new password.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Check your email for the password reset link.
            </p>

            <Button
              className="w-full"
              onClick={() => navigate({ to: "/auth" })}
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">
                Email address
              </Label>

              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate({ to: "/auth" })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}