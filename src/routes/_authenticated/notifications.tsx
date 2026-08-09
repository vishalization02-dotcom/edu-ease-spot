import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {fetchFees,fetchStudents,} from "@/lib/classledger-data";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
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

function getMonthDateRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);

  const start = new Date(year, monthNumber - 1, 1);
  const end = new Date(year, monthNumber, 1);

  return {
    start,
    end,
  };
}

function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-");

  return new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function NotificationsPage() {
  const navigate = useNavigate();

  const previousMonth = getPreviousMonth();

  /*
   * Get ALL students first.
   */
  const students = useQuery({
    queryKey: ["notification-students"],
    queryFn: () => fetchStudents(),
  });

  /*
   * Find the exact date range for the previous month.
   *
   * Example:
   * Current month = August 2026
   * Previous month = July 2026
   *
   * July 1 <= created_at < August 1
   */
  const { start, end } = getMonthDateRange(previousMonth);

  /*
   * IMPORTANT:
   * Only students who were added during the previous
   * month are considered for the notification.
   */
  const previousMonthStudents = (students.data ?? []).filter(
  (student) => {
    if (!student.joining_date) return false;

    const joiningDate = new Date(
      student.joining_date
    );

    return joiningDate >= start && joiningDate < end;
  }
);
const incompleteStudents = (students.data ?? []).filter(
  (student) =>
    !student.parent_phone ||
    !String(student.parent_phone).trim()
);

  const studentIds = previousMonthStudents.map(
    (student) => student.id
  );

  /*
   * Get fees ONLY for students who were added
   * during the previous month.
   */
  const fees = useQuery({
    queryKey: [
      "notification-fees",
      previousMonth,
      studentIds,
    ],
    queryFn: () =>
      fetchFees({
        month: previousMonth,
        studentIds,
      }),
    enabled: studentIds.length > 0,
  });

  /*
   * Map fees by student ID so we can quickly
   * determine who paid and who didn't.
   */
  const feeMap = new Map(
    (fees.data ?? []).map((fee) => [
      fee.student_id,
      fee,
    ])
  );

  /*
   * Only students added during the previous month
   * AND without a paid fee are shown.
   */
  const pendingStudents = previousMonthStudents.filter(
    (student) => {
      const fee = feeMap.get(student.id);

      return !fee || fee.status !== "paid";
    }
  );

  const isLoading =
    students.isLoading ||
    (studentIds.length > 0 && fees.isLoading);

  const hasPendingFees =
    !isLoading && pendingStudents.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Back to Dashboard */}
      <Button
        variant="ghost"
        className="gap-2 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
          <Bell className="h-6 w-6 text-violet-400" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with everything that needs your attention.
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <Card className="border-border/60">
          <div className="p-6 text-sm text-muted-foreground">
            Checking for notifications...
          </div>
        </Card>
      )}

      {/* Pending Fees */}
      {!isLoading && hasPendingFees && (
        <Card className="overflow-hidden border-border/60 transition-all duration-200 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]">
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">
                  Pending Fees
                </h3>

                <span className="text-xs text-muted-foreground">
                  {pendingStudents.length}{" "}
                  {pendingStudents.length === 1
                    ? "student"
                    : "students"}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {pendingStudents.length}{" "}
                {pendingStudents.length === 1
                  ? "student has"
                  : "students have"}{" "}
                pending fees for{" "}
                <span className="font-medium text-foreground">
                  {formatMonth(previousMonth)}
                </span>
                .
              </p>

              <Button
  variant="outline"
  size="sm"
  className="mt-4"
 onClick={() =>
  navigate({
    to: "/pending-fees",
  })
}
>
  View Fees
</Button>
            </div>
          </div>
        </Card>
      )}

{!isLoading && incompleteStudents.length > 0 && (
  <Card className="overflow-hidden border-border/60 transition-all duration-200 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]">
    <div className="flex items-start gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
        <UserRoundX className="h-5 w-5 text-amber-400" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">
            Complete Student Profile
          </h3>

          <span className="text-xs text-muted-foreground">
            {incompleteStudents.length} missing
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {incompleteStudents.length}{" "}
          {incompleteStudents.length === 1
            ? "student is"
            : "students are"}{" "}
          missing a parent phone number.
        </p>

        <Link to="/students">
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
          >
            Complete Profiles
          </Button>
        </Link>
      </div>
    </div>
  </Card>
)}

      {/* All Caught Up */}
      {!isLoading &&
  !hasPendingFees &&
  incompleteStudents.length === 0 && (
        <Card className="border-border/60">
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <h3 className="font-semibold">
                You're all caught up
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                There are no notifications that need your attention.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}