import { Mail, Globe, ShieldCheck, FileText, LifeBuoy } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-8 rounded-2xl border border-border/60 bg-card/50 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left */}

        <div>
          <h3 className="text-xl font-bold">ClassLedger</h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Smart Fee & Attendance Management for Teachers. Built to simplify classrooms and help
            teachers focus on what matters most.
          </p>
        </div>

        {/* Right */}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-violet-400" />
            support@classledger.in
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4 text-violet-400" />
            www.classledger.in
          </div>
        </div>
      </div>

      <div className="my-6 border-t border-border/60" />

      <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>© 2026 ClassLedger. All rights reserved.</div>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 transition-colors hover:text-violet-400">
            <ShieldCheck className="h-4 w-4" />
            Privacy
          </button>

          <button className="flex items-center gap-2 transition-colors hover:text-violet-400">
            <FileText className="h-4 w-4" />
            Terms
          </button>

          <button className="flex items-center gap-2 transition-colors hover:text-violet-400">
            <LifeBuoy className="h-4 w-4" />
            Help
          </button>
        </div>
      </div>
    </footer>
  );
}
