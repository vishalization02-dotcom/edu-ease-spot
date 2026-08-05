import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Trophy, Gift, ChevronRight } from "lucide-react";
import { RewardsDialog } from "@/components/dashboard/RewardsDialog";
import { EMPTY_XP, ensureLevel10Reward, teacherXpQueryOptions } from "@/lib/teacher-xp";

export function TeacherProgress() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery(teacherXpQueryOptions);
  const xp = data ?? EMPTY_XP;

  useEffect(() => {
    if (xp.level >= 10) void ensureLevel10Reward(xp.level);
  }, [xp.level]);

  const level = xp.level;
  const currentXP = xp.totalXp;
  const nextLevelXP = xp.xpForNextLevel;

  const progress = xp.progress;
  const xpRemaining = xp.xpRemaining;

  return (
    <Card className="p-6">
       

      {/* Header */}

      <div className="mb-2.5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
            <Trophy className="h-5 w-5 text-violet-400" />
          </div>

          <h2 className="text-xl font-semibold">
            Teacher Progress
          </h2>

        </div>
        

        <div className="rounded-full bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-300">
          Level {level}
        </div>

      </div>

      {/* XP */}

      {/* Progress Container */}

<div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.02] p-5">

  {/* XP */}

  <div>

    <div className="mb-2 flex items-center justify-between">

      <span className="text-sm font-medium text-muted-foreground">
        {xp.title}
      </span>

      <span className="text-sm font-semibold">
        <span className="text-violet-400">
          {currentXP}
        </span>

        {" / "}

        {nextLevelXP} XP
      </span>

    </div>

    <div className="h-3 overflow-hidden rounded-full bg-muted">

      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
        style={{
          width: `${progress}%`,
        }}
      />

    </div>

    <p className="mt-3 text-sm text-muted-foreground">
      {xp.isMaxLevel ? (
        <>
          <span className="font-semibold text-foreground">Max level reached</span>{" "}
          — you are a <span className="font-semibold">Teaching Icon</span>
        </>
      ) : (
        <>
          <span className="font-semibold text-foreground">
            {xpRemaining} XP
          </span>{" "}
          to reach <span className="font-semibold">Level {level + 1}</span>
        </>
      )}
    </p>

  </div>

  {/* Reward */}

  <div className="mt-4 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-2">

    <div className="flex gap-4">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">

        <Gift className="h-6 w-6 text-yellow-400" />

      </div>

      <div>

        <div className="text-sm text-muted-foreground">
          Next Reward
        </div>

        <h3 className="mt-1 text-lg font-semibold">
          {xp.nextReward?.name ?? "🎁 1 Month FREE ClassLedger Pro"}
        </h3>

        <p className="text-sm text-muted-foreground">
          {xp.nextReward
            ? `Reach Level ${xp.nextReward.level} to unlock`
            : "All rewards unlocked"}
        </p>

      </div>

    </div>

  </div>

</div>

      {/* Footer */}

      <div className=" mt-5 flex justify-center">
  <button
    onClick={() => setOpen(true)}
    className="group flex items-center gap-2 text-x font-semibold text-violet-400 transition-all duration-300 hover:text-violet-300"
  >
    View All Rewards
    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </button>
</div>

      <RewardsDialog open={open} onOpenChange={setOpen} xp={xp} />

    </Card>
  );
}