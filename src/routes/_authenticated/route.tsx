import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
// import ProfileDialog from "@/components/profile/ProfileDialog";
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
  const navigate = useNavigate();
  const router = useRouter();
  const [userName, setUserName] = useState("Teacher");
  // const [profileOpen, setProfileOpen] = useState(false);
  const [email, setEmail] = useState("");
useEffect(() => {
  async function loadProfile() {
    const {
  data: { user },
} = await supabase.auth.getUser();

setEmail(user?.email ?? "");
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
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border/70 bg-card/80 px-3 backdrop-blur-xl md:px-6">

  {/* Left */}

  <div className="flex min-w-0 items-center gap-3">

    <SidebarTrigger />

    <div className="hidden h-6 w-px bg-border sm:block" />

    <h1 className="truncate text-lg font-semibold tracking-tight">
      ClassLedger
    </h1>

  </div>

  {/* Right */}

  <div className="flex shrink-0 items-center gap-2 md:gap-3">

    {/* Notification */}

    <button
      aria-label="Notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/60 transition-all duration-200 hover:border-primary/40 hover:bg-accent/50 hover:text-primary"
    >
      <Bell className="h-[18px] w-[18px] text-muted-foreground" />

      <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-card">
        3
      </span>

    </button>

    {/* Profile */}

    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button className="group flex h-10 items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 px-2 transition-all duration-200 hover:border-primary/40 hover:bg-accent/50 md:px-3">

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            {userName.charAt(0)}
          </div>

          <div className="hidden text-left leading-tight md:block">

            <div className="text-[13px] font-semibold">
              Hi, {userName}
            </div>

            <div className="text-[11px] text-muted-foreground">
              Teacher
            </div>

          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">

<DropdownMenuItem
  className="rounded-lg py-2"
  onClick={() => navigate({ to: "/profile" })}
>
  <User className="mr-2 h-4 w-4" />
  My Profile
</DropdownMenuItem>

        <DropdownMenuItem
  className="rounded-lg py-2"
onClick={() => navigate({ to: "/settings" })}
>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          className="rounded-lg py-2 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  </div>

</header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
          
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}