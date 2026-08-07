import { supabase } from "@/integrations/supabase/client";

export function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, "");
}

function mobileToEmail(mobile: string) {
  return `${normalizeMobile(mobile)}@classledger.local`;
}

export async function signUpTeacher(params: {
  fullName: string;
  mobile: string;
  password: string;
  instituteName?: string;
}) {
  return supabase.auth.signUp({
    email: mobileToEmail(params.mobile),
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

export async function signInTeacher(mobile: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: mobileToEmail(mobile),
    password,
  });
}
