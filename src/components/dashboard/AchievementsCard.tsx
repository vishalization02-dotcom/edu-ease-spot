import { Card } from "@/components/ui/card";
import { Trophy, CheckCircle2, Lock, ChevronRight } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First 10 Students",
    unlocked: true,
  },
  {
    id: 2,
    title: "30 Days Attendance",
    unlocked: true,
  },
  {
    id: 3,
    title: "₹50K Fees Collected",
    progress: 62,
    unlocked: false,
  },
  {
    id: 4,
    title: "Gold Teacher",
    unlocked: false,
  },
];

export function AchievementsCard() {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <Card className="p-5">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">
            Achievements
          </h2>
        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {unlocked}/{achievements.length}
        </span>

      </div>

      {/* List */}

      <div className="space-y-2">

        {achievements.map((achievement) => (

          <div
            key={achievement.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
          >

            <div className="flex items-center gap-3">

              {achievement.unlocked ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}

              <span className="font-medium">
                {achievement.title}
              </span>

            </div>

            <div>

              {achievement.unlocked ? (

                <span className="text-sm font-medium text-green-500">
                  Completed
                </span>

              ) : achievement.progress ? (

                <span className="text-sm font-medium text-yellow-500">
                  {achievement.progress}%
                </span>

              ) : (

                <span className="text-sm text-muted-foreground">
                  Locked
                </span>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <button className="mt-5 flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3">
        View All
        <ChevronRight className="h-4 w-4" />
      </button>

    </Card>
  );
}