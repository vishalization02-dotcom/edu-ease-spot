import { supabase } from "@/integrations/supabase/client";

export function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, "");
}

export async function signUpTeacher(params: {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  instituteName?: string;
}) {
  return supabase.auth.signUp({
    email: params.email.trim().toLowerCase(),
    password: params.password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        full_name: params.fullName,
        mobile: normalizeMobile(params.mobile),
        institute_name: params.instituteName ?? null,
      },
    },
  });
}

export async function signInTeacher(
  identifier: string,
  password: string,
) {
  const value = identifier.trim();

  // Email login
  if (value.includes("@")) {
    return supabase.auth.signInWithPassword({
      email: value.toLowerCase(),
      password,
    });
  }

  // Mobile login
  const mobile = normalizeMobile(value);

  const { data: authEmail, error: lookupError } = await supabase.rpc(
    "get_auth_email_by_mobile",
    {
      p_mobile: mobile,
    },
  );

  if (lookupError) {
    return {
      data: { user: null, session: null },
      error: lookupError,
    };
  }

  if (!authEmail) {
    return {
      data: { user: null, session: null },
      error: new Error("Invalid mobile number or password"),
    };
  }

  return supabase.auth.signInWithPassword({
    email: authEmail,
    password,
  });
}