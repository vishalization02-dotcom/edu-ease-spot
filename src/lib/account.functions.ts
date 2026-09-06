import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const emailInput = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
});

/** Updates the authenticated user's email without changing their Auth UUID. */
export const updateAccountEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => emailInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: updatedUser, error } = await context.supabase.auth.updateUser({
      email: data.email,
    });

    if (error) throw new Error(error.message);

    return {
      email: updatedUser.user?.email ?? data.email,
      emailConfirmedAt: updatedUser.user?.email_confirmed_at ?? null,
    };
  });