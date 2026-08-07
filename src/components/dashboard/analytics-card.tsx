import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnalyticsGraph from "./analytics-graph";

export default function AnalyticsCard() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-xl font-semibold">Analytics</CardTitle>

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Select defaultValue="revenue">
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="fees">Pending Fees</SelectItem>
              <SelectItem value="xp">XP</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="current">
            <SelectTrigger className="w-full sm:w-[170px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="last">Last Month</SelectItem>
              <SelectItem value="january">January</SelectItem>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <AnalyticsGraph />

        <div className="grid grid-cols-4 gap-2 border-t pt-3">
          <div>
            <p className="text-sm text-muted-foreground">Current</p>

            <h3 className="mt-1 text-xl font-bold">₹52K</h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Previous</p>

            <h3 className="mt-1 text-xl font-bold">₹44K</h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Growth</p>

            <h3 className="mt-1 text-2xl font-bold text-emerald-500">+18%</h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Avg / Day</p>

            <h3 className="mt-1 text-2xl font-bold">₹1.7K</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
