import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const router = useRouter();
  const [userName, setUserName] = useState("Teacher");

useEffect(() => {
  async function loadProfile() {
    const { data } = await supabase
      .from("teachers")
      .select("full_name")
      .maybeSingle();

    if (data?.full_name) {
      setUserName(data.full_name.split(" ")[0]);
    }
  }

  loadProfile();
}, []);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.invalidate();
    });
    
    return () => sub.subscription.unsubscribe();
  }, [router]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-6">

  {/* Left */}

  <div className="flex items-center gap-3">

    <SidebarTrigger />

    <div className="h-6 w-px bg-border" />

    <h1 className="text-lg font-semibold">
      ClassLedger
    </h1>

  </div>

  {/* Right */}

  <div className="flex items-center gap-3">

    {/* Notification */}

    <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-md">
      <Bell className="h-5 w-5 text-muted-foreground" />

      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
        3
      </span>

    </button>

    {/* Profile */}

    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2 transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-md">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-sm font-bold text-violet-400">
            {userName.charAt(0)}
          </div>

          <div className="hidden text-left md:block">

            <div className="text-sm font-semibold">
              Hi, {userName}
            </div>

            <div className="text-xs text-muted-foreground">
              Teacher
            </div>

          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground" />

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          className="text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  </div>

</header>
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}