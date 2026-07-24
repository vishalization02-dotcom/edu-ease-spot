import { supabase } from "@/integrations/supabase/client";

// Normalize a mobile number to digits only.
export function normalizeMobile(mobile: string): string {
  return mobile.replace(/\D/g, "");
}

// ClassLedger signs users in with mobile + password. Supabase auth needs an
// email, so we synthesize a stable one from the normalized mobile.
export function mobileToEmail(mobile: string): string {
  return `${normalizeMobile(mobile)}@classledger.local`;
}

export async function signUpTeacher(params: {
  fullName: string;
  mobile: string;
  password: string;
  instituteName?: string;
}) {
  const mobile = normalizeMobile(params.mobile);
  return supabase.auth.signUp({
    email: mobileToEmail(mobile),
    password: params.password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        full_name: params.fullName,
        mobile,
        institute_name: params.instituteName ?? null,
      },
    },
  });
}

export async function signInTeacher(mobile: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: mobileToEmail(mobile),
    password,
  });
}