import { AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MonthClosedProps {
  month: string;
  expected: number;
  collected: number;
  unpaidStudents: number;
}

export function MonthClosed({ month, expected, collected, unpaidStudents }: MonthClosedProps) {
  const outstanding = expected - collected;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertCircle className="h-5 w-5 text-orange-500" />
        <CardTitle>{month} Closed</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Collected</p>
            <p className="text-xl font-bold text-green-600">₹{collected.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-xl font-bold text-red-600">₹{outstanding.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Unpaid Students</p>
            <p className="text-xl font-bold">{unpaidStudents}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-orange-50 dark:bg-orange-950/20 p-4">
          <p className="font-medium">
            {unpaidStudents} student{unpaidStudents !== 1 ? "s" : ""} didn't pay their {month} fees.
          </p>

          <Button variant="link" className="px-0 mt-2">
            Review Outstanding Fees
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
