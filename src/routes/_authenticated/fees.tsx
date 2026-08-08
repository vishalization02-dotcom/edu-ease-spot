import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Wallet, Users, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { currentMonth, fetchClasses, fetchFees, fetchStudents } from "@/lib/classledger-data";
import { ClassSelector } from "@/components/class-selector";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_authenticated/fees")({
  validateSearch: (search: Record<string, unknown>): { classId?: string } =>
    typeof search.classId === "string" ? { classId: search.classId } : {},
  component: FeesPage,
});

function FeesPage() {
  const qc = useQueryClient();
  const [month, setMonth] = useState(currentMonth());
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const { classId: classIdParam } = Route.useSearch();
  const [classId, setClassId] = useState<string | undefined>(classIdParam);

  const classes = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });
  useEffect(() => {
    if (!classId && classes.data && classes.data.length > 0) setClassId(classes.data[0].id);
  }, [classes.data, classId, classIdParam]);

  const students = useQuery({
    queryKey: ["students", "class", classId ?? ""],
    queryFn: () => fetchStudents(classId),
    enabled: !!classId,
  });
  const studentIds = useMemo(() => (students.data ?? []).map((s) => s.id), [students.data]);
  const fees = useQuery({
    queryKey: ["fees", "month", month, "class", classId ?? ""],
    queryFn: () => fetchFees({ month, studentIds }),
    enabled: studentIds.length > 0,
  });

  const feeMap = useMemo(() => {
    const m = new Map<
      string,
      { id?: string; status: "paid" | "pending"; amount: number; payment_date?: string | null }
    >();
    (fees.data ?? []).forEach((f) =>
      m.set(f.student_id, {
        id: f.id,
        status: f.status,
        amount: Number(f.amount),
        payment_date: f.payment_date,
      }),
    );
    return m;
  }, [fees.data]);

  const totals = useMemo(() => {
    const list = students.data ?? [];
    let collected = 0;
    let pending = 0;
    list.forEach((s) => {
      const f = feeMap.get(s.id);
      if (f?.status === "paid") collected += f.amount;
      else pending += Number(s.monthly_fee);
    });
    return { collected, pending };
  }, [students.data, feeMap]);

  async function setStatus(studentId: string, monthlyFee: number, status: "paid" | "pending") {
    const { data: userData } = await supabase.auth.getUser();
    const teacherId = userData.user?.id;
    if (!teacherId) return toast.error("Not signed in");
    const payload = {
      teacher_id: teacherId,
      student_id: studentId,
      month,
      amount: monthlyFee,
      status,
      payment_date: status === "paid" ? new Date().toISOString().slice(0, 10) : null,
    };
    const { error } = await supabase
      .from("fees")
      .upsert(payload, { onConflict: "student_id,month" });
    if (error) return toast.error(error.message);
    toast.success(status === "paid" ? "Marked as paid" : "Marked as pending");
    qc.invalidateQueries({ queryKey: ["fees"] });
  }
async function createPaymentLink(
  studentId: string,
  monthlyFee: number,
  existingFeeId?: string
) {
  try {
    setPaymentLoading(studentId);

    let feeId = existingFeeId;

    // ---------------------------------------------
    // Make sure a fee record exists first
    // ---------------------------------------------
    if (!feeId) {
      const { data: userData } = await supabase.auth.getUser();
      const teacherId = userData.user?.id;

      if (!teacherId) {
        toast.error("Not signed in");
        return;
      }

      const { data: fee, error: feeError } = await supabase
        .from("fees")
        .upsert(
          {
            teacher_id: teacherId,
            student_id: studentId,
            month,
            amount: monthlyFee,
            status: "pending",
          },
          {
            onConflict: "student_id,month",
          }
        )
        .select("id")
        .single();

      if (feeError || !fee) {
        toast.error(feeError?.message ?? "Could not create fee record");
        return;
      }

      feeId = fee.id;

      // Refresh fees so the new record appears in the UI
      await qc.invalidateQueries({
        queryKey: ["fees"],
      });
    }

    // ---------------------------------------------
    // Call our Supabase Edge Function
    // ---------------------------------------------
    const { data, error } = await supabase.functions.invoke(
      "create-payment-link",
      {
        body: {
          fee_id: feeId,
        },
      }
    );

    if (error) {
      console.error("Payment function error:", error);
      toast.error(error.message || "Could not create payment link");
      return;
    }

    if (!data?.success || !data?.payment_link_url) {
      toast.error(
        data?.error || "Payment link could not be created"
      );
      return;
    }

    // ---------------------------------------------
    // Success
    // ---------------------------------------------
    toast.success("Payment link created!");

    // Open Razorpay test payment page
    window.open(
      data.payment_link_url,
      "_blank",
      "noopener,noreferrer"
    );

    // Refresh fee data
    await qc.invalidateQueries({
      queryKey: ["fees"],
    });
  } catch (error) {
    console.error("Payment link error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setPaymentLoading(null);
  }
}
  return (
    <div className="space-y-5 max-w-5xl mx-auto animate-fade-in">
      <PageHeader icon={Wallet} title="Fees" description="Track monthly fee collection.">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Class</Label>
          <ClassSelector
            classes={classes.data ?? []}
            value={classId}
            onChange={setClassId}
            placeholder="Select class"
            className="w-[160px] sm:w-[180px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Month</Label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-[160px] sm:w-[180px]"
          />
        </div>
      </PageHeader>

      {(classes.data ?? []).length === 0 && (
        <Card>
          <EmptyState
            icon={Users}
            title="No classes yet"
            description="Create a class before you can collect fees."
            action={
              <Link to="/classes">
                <Button>Go to Classes</Button>
              </Link>
            }
          />
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5 hover-lift">
          <div className="text-xs font-medium text-muted-foreground">Collected</div>
          <div className="text-2xl font-semibold text-success mt-1">
            ₹{totals.collected.toLocaleString()}
          </div>
        </Card>
        <Card className="p-5 hover-lift">
          <div className="text-xs font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-semibold text-destructive mt-1">
            ₹{totals.pending.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card className="divide-y divide-border/60 overflow-hidden">
        {(students.data ?? []).length === 0 && (
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Add students to this class to track their fees."
          />
        )}
        {(students.data ?? []).map((s) => {
          const f = feeMap.get(s.id);
          const status = f?.status ?? "pending";
          return (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-accent/30"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{s.student_name}</div>
                <div className="text-xs text-muted-foreground">
                  {s.course} · ₹{Number(s.monthly_fee).toLocaleString()}/mo
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {status === "paid" ? (
                  <Badge variant="success">
                    Paid{f?.payment_date ? ` · ${f.payment_date}` : ""}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Pending</Badge>
                )}
                {status === "paid" ? (
  <Button
    variant="outline"
    size="sm"
    onClick={() =>
      setStatus(
        s.id,
        Number(s.monthly_fee),
        "pending"
      )
    }
  >
    Mark Pending
  </Button>
) : (
  <>
    <Button
      variant="outline"
      size="sm"
      disabled={paymentLoading === s.id}
      onClick={() =>
        createPaymentLink(
          s.id,
          Number(s.monthly_fee),
          f?.id
        )
      }
      className="gap-1.5"
    >
      <CreditCard className="h-4 w-4" />

      {paymentLoading === s.id
        ? "Creating..."
        : "Payment Link"}
    </Button>

    <Button
      size="sm"
      className="bg-success hover:bg-success/90 text-success-foreground"
      onClick={() =>
        setStatus(
          s.id,
          Number(s.monthly_fee),
          "paid"
        )
      }
    >
      Mark Paid
    </Button>
  </>
)}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
