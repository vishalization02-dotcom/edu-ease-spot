import {
  Bell,
  Calendar,
  Pin,
  Plus,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const notices = [
  {
    title: "Unit Test",
    subtitle: "Friday • 10:00 AM",
    priority: "HIGH",
    color: "red",
  },
  {
    title: "Fee Collection",
    subtitle: "Last Date • 31 July",
    priority: "MEDIUM",
    color: "yellow",
  },
  {
    title: "Independence Day",
    subtitle: "Holiday • 15 August",
    priority: "INFO",
    color: "emerald",
  },
];

export function NoticeBoard() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/50">

      {/* Header */}

      <div className="flex items-center justify-between p-6 pb-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <Bell className="h-5 w-5 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Notice Board
          </h2>

        </div>

        <Button
          size="sm"
          className="rounded-full px-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>

      </div>

      {/* Cards */}

      <div className="space-y-3 px-4">

        {notices.map((notice) => (
          <div
            key={notice.title}
            className="rounded-2xl border border-border/60 bg-background/20 px-4 py-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-background/40"
          >

            <div className="flex items-center">

              {/* Dot */}

              <div
                className={`mr-4 h-3 w-3 rounded-full
                  ${
                    notice.color === "red"
                      ? "bg-red-500"
                      : notice.color === "yellow"
                      ? "bg-yellow-400"
                      : "bg-emerald-500"
                  }`}
              />

              {/* Badge */}

              <span
                className={`mr-4 rounded-full border px-3 py-1 text-xL font-semibold
                ${
                  notice.color === "red"
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : notice.color === "yellow"
                    ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {notice.priority}
              </span>

              {/* Text */}

              <div className="flex-1">

                <h3 className="font-semibold">
                  {notice.title}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">

                  <Calendar className="h-3.5 w-3.5" />

                  {notice.subtitle}

                </div>

              </div>

              {/* Pin */}

              <Pin className="h-4 w-4 text-muted-foreground" />

            </div>

          </div>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-5 border-t border-border/60 py-4">

        <button className="group mx-auto flex items-center gap-2 text-sm font-semibold text-violet-400 transition-all duration-300 hover:text-violet-300">

          View All Notices

          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

        </button>

      </div>

    </Card>
  );
}