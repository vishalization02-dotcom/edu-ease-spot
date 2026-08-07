import { Link } from "@tanstack/react-router";
import { ArrowRight, UserPlus, ClipboardCheck, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <QuickActionCard
        to="/students"
        title="Add Student"
        description="Register a new learner"
        icon={<UserPlus className="h-5 w-5" />}
        color="bg-violet-500/15 text-violet-400"
      />

      <QuickActionCard
        to="/attendance"
        title="Mark Attendance"
        description="Mark present or absent"
        icon={<ClipboardCheck className="h-5 w-5" />}
        color="bg-emerald-500/15 text-emerald-400"
      />

      <QuickActionCard
        to="/fees"
        title="Collect Fee"
        description="Record fee payment"
        icon={<Wallet className="h-5 w-5" />}
        color="bg-orange-500/15 text-orange-400"
      />
    </div>
  );
}

interface QuickActionCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function QuickActionCard({ to, title, description, icon, color }: QuickActionCardProps) {
  return (
    <Link to={to as never}>
      <Card className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-2 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl">
        <div className="flex items-center gap-2.5 ">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${color}`}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-[17px] font-semibold transition-colors duration-300 group-hover:text-primary">
              {title}
            </h3>

            <p className="text-[13px] text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}
