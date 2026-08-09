import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
// import ProfileDialog from "@/components/profile/ProfileDialog";
import { Bell, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchFees,
  fetchStudents,
} from "@/lib/classledger-data";
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
function getPreviousMonth(): string {
  const now = new Date();

  const previousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  return `${previousMonth.getFullYear()}-${String(
    previousMonth.getMonth() + 1
  ).padStart(2, "0")}`;
}
function ProtectedLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [userName, setUserName] = useState("Teacher");
  const [logoUrl, setLogoUrl] = useState("");
  // const [profileOpen, setProfileOpen] = useState(false);
  const [email, setEmail] = useState("");
  const previousMonth = getPreviousMonth();

const notificationStudents = useQuery({
  queryKey: ["header-notification-students"],
  queryFn: () => fetchStudents(),
});

const eligibleNotificationStudents = useMemo(() => {
  if (!notificationStudents.data) return [];

  const [year, monthNumber] = previousMonth
    .split("-")
    .map(Number);

  const monthStart = new Date(
    year,
    monthNumber - 1,
    1
  );

  const nextMonthStart = new Date(
    year,
    monthNumber,
    1
  );

  return notificationStudents.data.filter((student) => {
    if (!student.joining_date) return false;

    const joiningDate = new Date(
      student.joining_date
    );

    /*
     * Only students who joined during the
     * previous month are checked for the
     * notification.
     */
    return (
      joiningDate >= monthStart &&
      joiningDate < nextMonthStart
    );
  });
}, [
  notificationStudents.data,
  previousMonth,
]);

const notificationStudentIds =
  eligibleNotificationStudents.map(
    (student) => student.id
  );

const notificationFees = useQuery({
  queryKey: [
    "header-notification-fees",
    previousMonth,
    notificationStudentIds,
  ],
  queryFn: () =>
    fetchFees({
      month: previousMonth,
      studentIds: notificationStudentIds,
    }),
  enabled: notificationStudentIds.length > 0,
});

const notificationFeeMap = useMemo(
  () =>
    new Map(
      (notificationFees.data ?? []).map((fee) => [
        fee.student_id,
        fee,
      ])
    ),
  [notificationFees.data]
);

const pendingNotificationCount =
  eligibleNotificationStudents.filter((student) => {
    const fee = notificationFeeMap.get(student.id);

    return !fee || fee.status !== "paid";
  }).length;
  const incompleteProfileCount =
  (notificationStudents.data ?? []).filter(
    (student) =>
      !student.parent_phone ||
      !String(student.parent_phone).trim()
  ).length;

const totalNotificationCount =
  pendingNotificationCount + incompleteProfileCount;
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? "");
      const { data } = await (supabase.from("teachers") as any)
  .select("full_name, logo_url")
  .maybeSingle();

      if (data) {
        setUserName(data.full_name.split(" ")[0]);
        setLogoUrl(data.logo_url ?? "");
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

              <h1 className="truncate text-lg font-semibold tracking-tight">ClassLedger</h1>
            </div>

            {/* Right */}

            <div className="flex shrink-0 items-center gap-2 md:gap-3">
              {/* Notification */}
{/* Notification */}

<button
  aria-label="Notifications"
  onClick={() =>
    navigate({
      to: "/notifications",
    })
  }
  className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/70 bg-background/60 transition-all duration-300 hover:scale-105 hover:border-violet-500/60 hover:bg-background hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
>
  <Bell className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

  {totalNotificationCount > 0 && (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[10px] font-bold text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]">
      {totalNotificationCount > 99
  ? "99+"
  : totalNotificationCount}
    </span>
  )}
</button>

              {/* Profile */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
               <button className="group flex h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-border/70 bg-card/80 px-2 transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] md:px-3">
                    <div className="flex h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-background shadow-sm">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Institute Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/15">
                          <span className="text-xs font-bold text-primary">
                            {userName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="hidden text-left leading-tight md:block">
                      <div className="text-[13px] font-semibold">Hi, {userName}</div>

                      <div className="text-[11px] text-muted-foreground">Teacher</div>
                    </div>

                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                  <DropdownMenuItem
  className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-primary/10"
  onClick={() => router.navigate({ to: "/profile" })}
>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
  className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-primary/10"
  onClick={() => router.navigate({ to: "/settings" })}
>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                 <DropdownMenuItem
  className="cursor-pointer rounded-lg py-2 text-destructive transition-colors hover:bg-destructive/10 focus:text-destructive"
  onClick={async () => {
    await supabase.auth.signOut();
  }}
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