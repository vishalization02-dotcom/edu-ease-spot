import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Lock, Trophy, Target } from "lucide-react";
import type { TeacherXp } from "@/lib/teacher-xp";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xp: TeacherXp;
};

export function RewardsDialog({ open, onOpenChange, xp }: Props) {
  const unlocked = xp.achievements.filter((a) => a.unlocked).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Rewards &amp; Challenges
          </DialogTitle>
        </DialogHeader>

        {/* Weekly challenges */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-violet-400" />
            This Week's Challenges
          </div>
          {xp.weeklyChallenges.map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{c.title}</span>
                <span className={c.completed ? "text-green-500" : "text-muted-foreground"}>
                  {c.completed ? "Completed" : `${c.current}/${c.target}`}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{c.completed ? "Challenge complete" : `${c.remaining} to go`}</span>
                <span className="font-semibold text-violet-400">+{c.rewardXp} XP</span>
              </div>
            </div>
          ))}
        </section>

        {/* Achievements */}
        <section className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Achievements</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {unlocked}/{xp.achievements.length}
            </span>
          </div>
          {xp.achievements.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {a.unlocked ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  {a.unlocked && a.unlockedAt ? (
                    <div className="text-xs text-muted-foreground">
                      Unlocked {new Date(a.unlockedAt).toLocaleDateString()}
                    </div>
                  ) : null}
                </div>
              </div>
              <span
                className={
                  a.unlocked
                    ? "text-sm font-medium text-green-500"
                    : "text-sm text-muted-foreground"
                }
              >
                {a.unlocked ? "Completed" : `${a.progress}%`}
              </span>
            </div>
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
}
