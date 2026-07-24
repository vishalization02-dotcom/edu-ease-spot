import { Card } from "@/components/ui/card";
import { Trophy, Gift, ChevronRight } from "lucide-react";

export function TeacherProgress() {
  const level = 3;
  const currentXP = 870;
  const nextLevelXP = 1000;

  const progress = (currentXP / nextLevelXP) * 100;
  const xpRemaining = nextLevelXP - currentXP;

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
        Your XP Progress
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
      <span className="font-semibold text-foreground">
        {xpRemaining} XP
      </span>{" "}
      to reach <span className="font-semibold">Level {level + 1}</span>
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
          🎁 1 Month FREE Pro
        </h3>

        <p className="text-sm text-muted-foreground">
          Reach Level 10 to unlock
        </p>

      </div>

    </div>

  </div>

</div>

      {/* Footer */}

      {/* <button className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-400 transition-all hover:gap-3">

        View All Rewards

        <ChevronRight className="h-4 w-4" />

      </button> */}
      <div className=" mt-5 flex justify-center">
  <button
    className="group flex items-center gap-2 text-x font-semibold text-violet-400 transition-all duration-300 hover:text-violet-300"
  >
    View All Rewards
    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </button>
</div>

    </Card>
  );
}