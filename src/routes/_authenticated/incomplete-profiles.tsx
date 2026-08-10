import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  UserRoundX,
  Users,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchClasses, fetchStudents } from "@/lib/classledger-data";

export const Route = createFileRoute("/_authenticated/incomplete-profiles")({
  component: IncompleteProfilesPage,
});

function IncompleteProfilesPage() {
  const navigate = useNavigate();

  const classes = useQuery({
    queryKey: ["incomplete-profiles-classes"],
    queryFn: fetchClasses,
  });

  const students = useQuery({
    queryKey: ["incomplete-profiles-students"],
    queryFn: () => fetchStudents(),
  });

  const classMap = new Map(
    (classes.data ?? []).map((classItem) => [
      classItem.id,
      classItem,
    ]),
  );

  const incompleteStudents = (students.data ?? [])
    .filter(
      (student) =>
        !student.parent_phone ||
        !String(student.parent_phone).trim(),
    )
    .map((student) => ({
      ...student,
      className:
        classMap.get(student.class_id)?.name ??
        "Unassigned Class",
    }));

  const isLoading =
    classes.isLoading || students.isLoading;

  const affectedClasses = new Set(
    incompleteStudents.map((student) => student.class_id),
  ).size;

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
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <UserRoundX className="h-6 w-6 text-amber-400" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Incomplete Student Profiles
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Review students whose profiles are missing important information.
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <Card className="border-border/60">
          <div className="p-6 text-sm text-muted-foreground">
            Checking student profiles...
          </div>
        </Card>
      )}

      {/* Summary */}
      {!isLoading && incompleteStudents.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Users className="h-5 w-5 text-amber-400" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground">
                  Students
                </div>

                <div className="text-2xl font-semibold">
                  {incompleteStudents.length}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <UserRoundX className="h-5 w-5 text-violet-400" />
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

        </div>
      )}

      {/* Students */}
      {!isLoading && incompleteStudents.length > 0 && (
        <Card className="overflow-hidden border-border/60">

          <div className="border-b border-border/60 bg-card/60 px-5 py-4">
            <h2 className="font-semibold">
              Students needing attention
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Complete the missing information for these students.
            </p>
          </div>

          <div className="divide-y divide-border/60">

            {incompleteStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 transition-colors hover:bg-accent/30"
              >

                {/* Student information */}
                <div className="min-w-0">

                  <div className="font-medium">
                    {student.student_name}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {student.className}
                    {" · "}
                    Parent:{" "}
                    {student.parent_name || "Not provided"}
                  </div>

                  <div className="mt-1 text-xs text-amber-400">
                    Parent phone number missing
                  </div>

                </div>

                {/* Action */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    navigate({
                      to: "/students",
                      search: {
                        classId: student.class_id,
                        studentId: student.id,
                      },
                    })
                  }
                >
                  Complete
                  <ChevronRight className="h-4 w-4" />
                </Button>

              </div>
            ))}

          </div>
        </Card>
      )}

      {/* No incomplete profiles */}
      {!isLoading && incompleteStudents.length === 0 && (
        <Card className="border-border/60">
          <div className="flex flex-col items-center justify-center p-10 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>

            <h2 className="mt-4 font-semibold">
              All student profiles are complete
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              There are no students missing a parent phone number.
            </p>

          </div>
        </Card>
      )}

    </div>
  );
}