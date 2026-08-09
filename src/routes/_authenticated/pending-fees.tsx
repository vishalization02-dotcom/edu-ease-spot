import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertTriangle,
  Users,
  IndianRupee,
  Layers3,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchClasses, fetchFees, fetchStudents } from "@/lib/classledger-data";

export const Route = createFileRoute("/_authenticated/pending-fees")({
  component: PendingFeesPage,
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

function getNextMonthStart(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Date(year, monthNumber, 1);
}

function formatMonth(month: string) {
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

function PendingFeesPage() {
  const navigate = useNavigate();

  const previousMonth = getPreviousMonth();

  const classes = useQuery({
    queryKey: ["pending-fees-classes"],
    queryFn: fetchClasses,
  });

  const students = useQuery({
    queryKey: ["pending-fees-students"],
    queryFn: () => fetchStudents(),
  });

  const nextMonthStart = getNextMonthStart(previousMonth);

  /*
   * Only students who were already enrolled
   * during the previous month are eligible.
   */
  const eligibleStudents = (students.data ?? []).filter((student) => {
    if (!student.joining_date) return false;

    const joiningDate = new Date(student.joining_date);

    return joiningDate < nextMonthStart;
  });

  const studentIds = eligibleStudents.map((student) => student.id);

  const fees = useQuery({
    queryKey: [
      "pending-fees-all",
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

  const feeMap = new Map(
    (fees.data ?? []).map((fee) => [
      fee.student_id,
      fee,
    ])
  );

  const classMap = new Map(
    (classes.data ?? []).map((classItem) => [
      classItem.id,
      classItem,
    ])
  );

  /*
   * Find every student whose fee is still pending.
   */
  const pendingStudents = eligibleStudents
    .filter((student) => {
      const fee = feeMap.get(student.id);

      return !fee || fee.status !== "paid";
    })
    .map((student) => {
      const classItem = classMap.get(student.class_id);

      return {
        ...student,
        className: classItem?.name ?? "Unassigned Class",
        pendingAmount: Number(student.monthly_fee),
      };
    });

  const totalPending = pendingStudents.reduce(
    (total, student) => total + student.pendingAmount,
    0
  );

  const affectedClasses = new Set(
    pendingStudents.map((student) => student.class_id)
  ).size;

  const isLoading =
    classes.isLoading ||
    students.isLoading ||
    (studentIds.length > 0 && fees.isLoading);

  /*
   * Group pending students by class.
   */
  const groupedByClass = pendingStudents.reduce<
    Record<string, typeof pendingStudents>
  >((groups, student) => {
    const classId = student.class_id ?? "unassigned";

    if (!groups[classId]) {
      groups[classId] = [];
    }

    groups[classId].push(student);

    return groups;
  }, {});

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="gap-2 px-2 text-muted-foreground hover:text-foreground"
        onClick={() =>
          navigate({
            to: "/notifications",
          })
        }
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notifications
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pending Fees
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Review unpaid fees across all your classes.
          </p>
        </div>
      </div>

      {/* Month */}
      <div className="text-sm text-muted-foreground">
        Showing pending fees for{" "}
        <span className="font-medium text-foreground">
          {formatMonth(previousMonth)}
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <Card className="border-border/60">
          <div className="p-6 text-sm text-muted-foreground">
            Checking pending fees...
          </div>
        </Card>
      )}

      {/* Summary */}
      {!isLoading && pendingStudents.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <Users className="h-5 w-5 text-red-400" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground">
                  Students
                </div>

                <div className="text-2xl font-semibold">
                  {pendingStudents.length}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Layers3 className="h-5 w-5 text-violet-400" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground">
                  Classes
                </div>

                <div className="text-2xl font-semibold">
                  {affectedClasses}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <IndianRupee className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground">
                  Outstanding
                </div>

                <div className="text-2xl font-semibold">
                  ₹{totalPending.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Pending Students */}
      {!isLoading && pendingStudents.length > 0 && (
        <div className="space-y-4">
          {Object.entries(groupedByClass).map(
            ([classId, classStudents]) => {
              const className =
                classStudents[0]?.className ??
                "Unassigned Class";

              const classTotal = classStudents.reduce(
                (total, student) =>
                  total + student.pendingAmount,
                0
              );

              return (
                <Card
                  key={classId}
                  className="overflow-hidden border-border/60"
                >
                  {/* Class Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-card/60 px-5 py-4">
                    <div>
                      <h2 className="font-semibold">
                        {className}
                      </h2>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {classStudents.length}{" "}
                        {classStudents.length === 1
                          ? "student"
                          : "students"}{" "}
                        pending
                      </p>
                    </div>

                    <div className="text-sm font-medium text-red-400">
                      ₹{classTotal.toLocaleString()}
                    </div>
                  </div>

                  {/* Students */}
                  <div className="divide-y divide-border/60">
                    {classStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-accent/30"
                      >
                        <div className="min-w-0">
                          <div className="font-medium">
                            {student.student_name}
                          </div>

                          <div className="mt-1 text-xs text-muted-foreground">
                            {student.course} · ₹
                            {student.pendingAmount.toLocaleString()}
                            /mo
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-red-400">
                            ₹
                            {student.pendingAmount.toLocaleString()}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              navigate({
                                to: "/fees",
                                search: {
                                  classId:
                                    student.class_id,
                                  month: previousMonth,
                                  studentId:
                                    student.id,
                                },
                              })
                            }
                          >
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            }
          )}
        </div>
      )}

      {/* No pending fees */}
      {!isLoading && pendingStudents.length === 0 && (
        <Card className="border-border/60">
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>

            <h2 className="mt-4 font-semibold">
              No pending fees
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              All eligible students have paid their fees for{" "}
              {formatMonth(previousMonth)}.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}