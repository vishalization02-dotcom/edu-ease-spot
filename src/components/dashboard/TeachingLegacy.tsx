import { useQuery } from "@tanstack/react-query";
import { Heart, IndianRupee, Users, BookOpen, HandHeart, Sparkles, Quote } from "lucide-react";

import { Card } from "@/components/ui/card";
import { fetchTeachingLegacy } from "@/lib/teaching-legacy";
import { quoteOfTheDay } from "@/lib/teaching-quotes";

type StatTone = "rose" | "violet" | "emerald" | "amber";

const TONES: Record<StatTone, { icon: string; value: string }> = {
  rose: {
    icon: "bg-[#ff5c7a] text-white",
    value: "text-rose-600 dark:text-[#ff8ea5]",
  },

  violet: {
    icon: "bg-[#8b6bf0] text-white",
    value: "text-violet-600 dark:text-[#b98dff]",
  },

  emerald: {
    icon: "bg-[#22c58b] text-white",
    value: "text-emerald-600 dark:text-[#6cf5b5]",
  },

  amber: {
    icon: "bg-[#c4791f] text-white",
    value: "text-amber-600 dark:text-[#ffc34d]",
  },
};

function LegacyStat({
  icon: Icon,
  label,
  value,
  caption,
  tone,
}: {
  icon: typeof Heart;
  label: string;
  value: string;
  caption?: string;
  tone: StatTone;
}) {
  const t = TONES[tone];

  return (
    <div
      className="
      group
      rounded-[16px]
      border
      border-black/5
      dark:border-white/5
      bg-black/[0.02]
      dark:bg-white/[0.02]
      p-3.5
      transition-all
      duration-300
      hover:-translate-y-[2px]
      hover:border-primary/20
      hover:bg-black/[0.035]
      dark:hover:bg-white/[0.035]
      "
    >
      <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg ${t.icon}`}>
        <Icon className="h-4 w-4" />
      </div>

      <p className="mb-1 text-[12px] font-medium text-slate-500 dark:text-slate-400">{label}</p>

      <p
        className={`
        text-[24px]
        leading-none
        tracking-tight
        font-semibold
        ${t.value}
        `}
      >
        {value}
      </p>

      {caption && (
        <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      )}
    </div>
  );
}

function TeacherIllustration() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-2 hidden h-[68px] w-[68px] text-rose-500/15 dark:text-rose-400/25 sm:block"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="35" cy="30" r="11" />
      <path d="M18 78c0-11 8-19 17-19s17 8 17 19" />
      <circle cx="70" cy="46" r="8" />
      <path d="M58 78c0-8 5-14 12-14s12 6 12 14" />
      <path d="M48 58c5-4 10-5 14-4" />
    </svg>
  );
}

const inr = (n: number) => `\u20B9${Math.round(n).toLocaleString("en-IN")}`;

export function TeachingLegacy() {
  const { data, isLoading } = useQuery({
    queryKey: ["teaching-legacy"],
    queryFn: fetchTeachingLegacy,
    staleTime: 60_000,
  });

  const stats = data ?? { earned: 0, students: 0, attendanceRecords: 0, families: 0 };
  const isEmpty = !isLoading && stats.students === 0 && stats.attendanceRecords === 0;

  return (
    <Card
      className="
      relative
      flex
      h-full
      flex-col
      overflow-hidden
      rounded-[24px]
      border
      border-slate-200/60
      dark:border-white/5
      bg-gradient-to-br
      from-white
      to-slate-50
      dark:from-[#111827]
      dark:to-[#0f172a]
      p-4
      shadow-[0_0_30px_rgba(255,90,120,0.04)]
      "
    >
      <div className="mb-4 flex items-start gap-3">
        <div
          className="
          relative
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-rose-500/20
          bg-gradient-to-br
          from-rose-500/20
          to-transparent
          "
        >
          <span
            className="absolute inset-0 rounded-full bg-rose-500/20 blur-md"
            aria-hidden="true"
          />
          <Heart className="relative h-4 w-4 text-rose-500 dark:text-rose-400" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-rose-600 dark:text-[#ff6b85]">
            Teaching Legacy
          </h2>
          <p className="text-[13px] leading-snug text-muted-foreground">
            {isEmpty
              ? "Your teaching journey begins with your first student."
              : "Every number tells the story of your teaching journey."}
          </p>
        </div>
        <Sparkles
          className="ml-auto h-4 w-4 shrink-0 animate-pulse text-rose-400/70 dark:text-rose-300/70"
          aria-hidden="true"
        />
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2.5">
        <LegacyStat
          icon={IndianRupee}
          tone="rose"
          label="Earned Through Teaching"
          value={inr(stats.earned)}
        />
        <LegacyStat
          icon={Users}
          tone="violet"
          label="Young Minds Guided"
          value={stats.students.toLocaleString("en-IN")}
          caption="Students"
        />
        <LegacyStat
          icon={BookOpen}
          tone="emerald"
          label="Learning Moments"
          value={stats.attendanceRecords.toLocaleString("en-IN")}
          caption="Attendance Records"
        />
        <LegacyStat
          icon={HandHeart}
          tone="amber"
          label="Families Who Trusted You"
          value={stats.families.toLocaleString("en-IN")}
          caption="Families"
        />
      </div>

      <div
        className="
        relative
        mt-3
        rounded-2xl
        bg-black/[0.02]
        dark:bg-white/[0.02]
        px-3.5
        py-2.5
        pr-3.5
        sm:pr-20
        "
      >
        <div className="flex items-start gap-2">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" />

          <p
            className="
            line-clamp-3
            text-[13px]
            font-medium
            italic
            leading-relaxed
            text-rose-600
            dark:text-[#ff9ab0]
            "
          >
            {quoteOfTheDay()}
          </p>
        </div>
      </div>

      <TeacherIllustration />
    </Card>
  );
}
