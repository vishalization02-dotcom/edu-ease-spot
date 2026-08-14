import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  Palette,
  Phone,
  Receipt,
  Rocket,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";

type IconType = typeof Sparkles;

type Feature = {
  icon: IconType;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

type Testimonial = {
  name: string;
  role: string;
  initials: string;
  quote: string;
  metric: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#workflow" },
  { label: "Insights", href: "#insights" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const features: Feature[] = [
  {
    icon: Users,
    eyebrow: "Student hub",
    title: "Know every student at a glance",
    description:
      "Keep student profiles, batches, fees, attendance, and important notes connected instead of scattered across notebooks and spreadsheets.",
    points: [
      "Profiles that stay organized",
      "Batch and class grouping",
      "Quick search and filtering",
    ],
  },
  {
    icon: CalendarCheck,
    eyebrow: "Attendance",
    title: "Attendance without the paperwork",
    description:
      "Mark a whole batch in seconds and instantly see today's attendance, attendance history, and students who may need a follow-up.",
    points: [
      "Fast daily marking",
      "History by student and batch",
      "Absence patterns at a glance",
    ],
  },
  {
    icon: WalletCards,
    eyebrow: "Fee desk",
    title: "Make fee collection predictable",
    description:
      "See who has paid, who is pending, and how much is due before you start chasing parents manually.",
    points: [
      "Monthly fee tracking",
      "Pending amount visibility",
      "Collection history",
    ],
  },
  {
    icon: BarChart3,
    eyebrow: "Business view",
    title: "Understand how your class is doing",
    description:
      "Turn day-to-day records into a simple picture of students, attendance, collections, and growth.",
    points: [
      "Monthly trends",
      "Collection performance",
      "Attendance health",
    ],
  },
  {
    icon: MessageSquare,
    eyebrow: "Communication",
    title: "Follow up at the right moment",
    description:
      "Surface the students and payments that deserve attention so communication happens before a small issue becomes a bigger one.",
    points: [
      "Fee follow-up queue",
      "Attendance alerts",
      "Parent-ready actions",
    ],
  },
  {
    icon: Download,
    eyebrow: "Your data",
    title: "Keep control of your records",
    description:
      "Export the information you need for your own records, reporting, backups, or future workflows.",
    points: [
      "Student exports",
      "Attendance exports",
      "Fee data exports",
    ],
  },
];

const audiences = [
  { icon: BookOpen, title: "Tuition teachers", description: "Independent tutors and home tuition teachers." },
  { icon: Monitor, title: "Computer classes", description: "Small institutes teaching practical technology skills." },
  { icon: Palette, title: "Creative classes", description: "Drawing, design, craft, and hobby instructors." },
  { icon: Zap, title: "Coding classes", description: "Programming teachers running batches." },
  { icon: GraduationCap, title: "Coaching classes", description: "Teachers managing multiple subjects or batches." },
  { icon: Music2Placeholder, title: "Music teachers", description: "Private and small-group music instructors." },
];

function Music2Placeholder(props: { className?: string }) {
  return <span className={props.className} aria-hidden="true">♫</span>;
}

const testimonials: Testimonial[] = [
  {
    name: "Neha Sharma",
    role: "Tuition teacher",
    initials: "NS",
    quote:
      "The biggest difference is that I no longer have to remember where I wrote something. Student, attendance, and fee information finally feels connected.",
    metric: "Less admin every week",
  },
  {
    name: "Amit Verma",
    role: "Computer institute",
    initials: "AV",
    quote:
      "I wanted something much simpler than a full school ERP. This feels designed for the way a small coaching class actually works.",
    metric: "Everything in one view",
  },
  {
    name: "Priya Mehta",
    role: "Drawing teacher",
    initials: "PM",
    quote:
      "The dashboard gives me the important things first. I can open it before class and immediately know what needs attention.",
    metric: "Faster daily decisions",
  },
];

const faqs: FaqItem[] = [
  {
    question: "Is YourClass only for tuition teachers?",
    answer:
      "No. It is designed for teachers and small coaching businesses that need student, attendance, fee, and class-management workflows without the complexity of a large school ERP.",
  },
  {
    question: "Can I manage multiple batches?",
    answer:
      "Yes. The product is designed around batches and classes, so you can organize students according to the way you actually teach.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. The experience is intentionally built around simple actions such as adding a student, marking attendance, recording a payment, and reviewing what needs attention.",
  },
  {
    question: "What happens after the free trial?",
    answer:
      "The current plan is designed around a simple ₹299/month subscription after the 7-day trial. There is no need to choose between complicated feature tiers.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. Export workflows are part of the product direction so your records remain useful outside the dashboard too.",
  },
  {
    question: "Is my class data secure?",
    answer:
      "The application is designed with account-level data separation and secure backend access patterns. YourClass should still be treated like any cloud service: use a strong password and keep your account credentials private.",
  },
];

const dashboardStats = [
  { label: "Students", value: "128", change: "+8 this month", icon: Users, tone: "primary" },
  { label: "Attendance", value: "91%", change: "+3.2% this month", icon: UserCheck, tone: "success" },
  { label: "Collected", value: "₹42,800", change: "+12.4% this month", icon: IndianRupee, tone: "warning" },
  { label: "Pending", value: "₹8,600", change: "7 students", icon: Receipt, tone: "danger" },
];

const miniRevenue = [
  { month: "Mar", value: 52 },
  { month: "Apr", value: 61 },
  { month: "May", value: 58 },
  { month: "Jun", value: 73 },
  { month: "Jul", value: 79 },
  { month: "Aug", value: 88 },
];

const attentionItems = [
  {
    icon: Receipt,
    tone: "danger",
    title: "7 fee payments are pending",
    detail: "₹8,600 is currently outstanding.",
    action: "Review fees",
  },
  {
    icon: CalendarCheck,
    tone: "warning",
    title: "2 students missed class",
    detail: "Both were absent from today's batch.",
    action: "View attendance",
  },
  {
    icon: TrendingUp,
    tone: "success",
    title: "Collection is ahead of last month",
    detail: "You're currently 12.4% higher.",
    action: "View report",
  },
];

const workflowSteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Add your students",
    description: "Create a profile once and keep the important information together.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Run your classes",
    description: "Mark attendance as you teach and keep each batch organized.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Record payments",
    description: "Capture fee collections and instantly see what remains pending.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Understand the month",
    description: "Use simple insights to know where your class stands.",
  },
];

const insightCards = [
  {
    icon: Target,
    title: "Know what needs attention",
    value: "3 actions",
    detail: "Suggested from your class activity",
  },
  {
    icon: TrendingUp,
    title: "Watch your momentum",
    value: "+12.4%",
    detail: "Collection compared with last month",
  },
  {
    icon: UserCheck,
    title: "Spot attendance changes",
    value: "91%",
    detail: "Average attendance this month",
  },
];

const pricingFeatures = [
  "Student management",
  "Batch and class organization",
  "Attendance tracking",
  "Monthly fee tracking",
  "Pending fee visibility",
  "Reports and insights",
  "Data export",
  "7-day free trial",
];

const footerColumns = [
  {
    title: "Product",
    links: [
      ["Features", "#features"],
      ["How it works", "#workflow"],
      ["Insights", "#insights"],
      ["Pricing", "#pricing"],
    ],
  },
  {
    title: "For teachers",
    links: [
      ["Tuition teachers", "#audience"],
      ["Coaching classes", "#audience"],
      ["Computer classes", "#audience"],
      ["Creative classes", "#audience"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#about"],
      ["FAQ", "#faq"],
      ["Get started", "/auth"],
      ["Login", "/auth"],
    ],
  },
];

function scrollToId(id: string) {
  const element = document.getElementById(id.replace("#", ""));
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={classNames(
      "max-w-3xl",
      align === "center" ? "mx-auto text-center" : "text-left"
    )}>
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-5 text-4xl font-black tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Glow({
  className = "",
  tone = "primary",
}: {
  className?: string;
  tone?: "primary" | "blue" | "success";
}) {
  const toneClass = {
    primary: "bg-primary/15",
    blue: "bg-blue-500/10",
    success: "bg-emerald-500/10",
  }[tone];

  return (
    <div
      aria-hidden="true"
      className={classNames(
        "pointer-events-none absolute rounded-full blur-3xl",
        toneClass,
        className
      )}
    />
  );
}

function BrowserDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
    </div>
  );
}

function MiniSidebar() {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Students", active: false },
    { icon: CalendarCheck, label: "Attendance", active: false },
    { icon: Receipt, label: "Fees", active: false },
    { icon: BarChart3, label: "Reports", active: false },
  ];

  return (
    <aside className="hidden w-44 shrink-0 border-r border-border/70 bg-card/90 p-4 lg:block">
      <div className="flex items-center gap-2 px-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-black tracking-tight">YourClass</p>
          <p className="text-[9px] text-muted-foreground">Teacher workspace</p>
        </div>
      </div>

      <div className="mt-8 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={classNames(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[10px] font-semibold",
                item.active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border/70 bg-muted/30 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[9px] font-bold">Private workspace</p>
            <p className="text-[8px] text-muted-foreground">Your records</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MiniStat({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  icon: IconType;
  tone: string;
}) {
  const toneMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className={classNames("flex h-8 w-8 items-center justify-center rounded-xl", toneMap[tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <p className="mt-3 text-[9px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-black tracking-tight">{value}</p>
      <p className="mt-1 text-[8px] font-semibold text-muted-foreground">{change}</p>
    </div>
  );
}

function MiniRevenueChart() {
  const points = miniRevenue.map((item, index) => {
    const x = 12 + index * 55;
    const y = 104 - item.value * 0.82;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold">Collection trend</p>
          <p className="mt-0.5 text-[8px] text-muted-foreground">Last 6 months</p>
        </div>
        <div className="rounded-lg bg-primary/10 px-2 py-1 text-[8px] font-bold text-primary">
          +12.4%
        </div>
      </div>

      <div className="mt-4 h-28">
        <svg viewBox="0 0 300 120" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="landingRevenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.20" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M ${points} L 287 120 L 12 120 Z`}
            className="fill-primary/10"
          />
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />
          {miniRevenue.map((item, index) => {
            const x = 12 + index * 55;
            const y = 104 - item.value * 0.82;
            return (
              <g key={item.month}>
                <circle cx={x} cy={y} r="4" className="fill-card stroke-primary" strokeWidth="2" />
                <text x={x} y="118" textAnchor="middle" className="fill-muted-foreground text-[7px]">
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function MiniAttentionCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold">Today's attention</p>
          <p className="mt-0.5 text-[8px] text-muted-foreground">Things worth checking</p>
        </div>
        <Bell className="h-4 w-4 text-primary" />
      </div>

      <div className="mt-4 space-y-2.5">
        {attentionItems.map((item) => {
          const Icon = item.icon;
          const iconClass =
            item.tone === "danger"
              ? "bg-red-500/10 text-red-600 dark:text-red-400"
              : item.tone === "warning"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

          return (
            <div key={item.title} className="flex items-center gap-2.5 rounded-xl border border-border/60 p-2.5">
              <div className={classNames("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", iconClass)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[8px] font-bold">{item.title}</p>
                <p className="truncate text-[7px] text-muted-foreground">{item.detail}</p>
              </div>
              <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <Glow className="-inset-12" />

      <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-[0_30px_100px_-35px_hsl(var(--primary)/0.45)]">
        <div className="flex h-11 items-center justify-between border-b border-border/70 bg-muted/30 px-4 sm:px-5">
          <BrowserDots />
          <div className="flex max-w-[210px] flex-1 items-center justify-center">
            <div className="w-full max-w-[210px] truncate rounded-lg border border-border/70 bg-background px-3 py-1.5 text-center text-[8px] text-muted-foreground shadow-sm">
              app.yourclass.in/dashboard
            </div>
          </div>
          <div className="h-5 w-5" />
        </div>

        <div className="flex min-h-[470px] bg-muted/10">
          <MiniSidebar />

          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground">Friday, August 14</p>
                <h3 className="mt-1 text-lg font-black tracking-tight sm:text-xl">
                  Good morning, Teacher 👋
                </h3>
                <p className="mt-1 text-[9px] text-muted-foreground">
                  Here's what deserves your attention today.
                </p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                  <Search className="h-3.5 w-3.5" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                  <Bell className="h-3.5 w-3.5" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[9px] font-black text-primary">
                  VK
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
              {dashboardStats.map((stat) => (
                <MiniStat key={stat.label} {...stat} />
              ))}
            </div>

            <div className="mt-3 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
              <MiniRevenueChart />
              <MiniAttentionCard />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Clock3, title: "4:00 PM", detail: "10th Maths", status: "Next class" },
                { icon: CalendarCheck, title: "43 / 47", detail: "Present today", status: "Attendance" },
                { icon: IndianRupee, title: "₹5,200", detail: "Collected this week", status: "Cash flow" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black">{item.title}</p>
                        <p className="text-[7px] text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
                      {item.status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-2xl sm:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[9px] font-semibold text-muted-foreground">Monthly collection</p>
          <p className="text-sm font-black">₹42,800 <span className="text-[9px] font-bold text-emerald-600">+12.4%</span></p>
        </div>
      </div>

      <div className="absolute -right-4 top-1/4 hidden rounded-2xl border border-border bg-card p-3 shadow-2xl sm:block">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[8px] font-bold">Smart attention</p>
            <p className="text-[7px] text-muted-foreground">3 things to review</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={classNames(
        "flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20",
        compact ? "h-8 w-8" : "h-9 w-9"
      )}>
        <Sparkles className={compact ? "h-4 w-4" : "h-4.5 w-4.5"} />
      </div>
      <span className={classNames(
        "font-black tracking-[-0.03em]",
        compact ? "text-base" : "text-lg"
      )}>
        Your<span className="text-primary">Class</span>
      </span>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 sm:p-7">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-primary/5 blur-2xl transition-transform duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-5.5 w-5.5" />
          </div>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            {feature.eyebrow}
          </span>
        </div>

        <h3 className="mt-6 text-xl font-black tracking-tight">{feature.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>

        <ul className="mt-6 space-y-3">
          {feature.points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-xs font-semibold">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Check className="h-3 w-3" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function WorkflowCard({
  step,
  index,
}: {
  step: typeof workflowSteps[number];
  index: number;
}) {
  const Icon = step.icon;

  return (
    <div className="relative">
      {index < workflowSteps.length - 1 ? (
        <div className="absolute left-[calc(50%+45px)] right-[-45px] top-10 hidden h-px bg-gradient-to-r from-primary/20 via-border to-transparent xl:block" />
      ) : null}

      <div className="relative rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-black tracking-widest text-muted-foreground">{step.number}</span>
        </div>
        <h3 className="mt-6 text-lg font-black tracking-tight">{step.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
      </div>
    </div>
  );
}

function InsightCard({
  item,
}: {
  item: typeof insightCards[number];
}) {
  const Icon = item.icon;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 text-sm font-bold text-muted-foreground">{item.title}</p>
      <p className="mt-1 text-3xl font-black tracking-tight">{item.value}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p>
    </div>
  );
}

function BeforeAfterPanel() {
  const before = [
    "Notebook fee records",
    "Separate attendance sheet",
    "WhatsApp reminders",
    "Excel calculations",
    "Scattered student details",
    "No clear monthly picture",
  ];

  const after = [
    "One student workspace",
    "Fast batch attendance",
    "Pending fees in one view",
    "Automatic totals",
    "Simple monthly insights",
    "A clear daily action list",
  ];

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-xl lg:grid-cols-2">
      <div className="border-b border-border/70 p-7 sm:p-10 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Before
        </div>
        <h3 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
          Your class lives in too many places.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The problem isn't that teachers don't work hard. It's that admin work gets fragmented.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {before.map((item) => (
            <div key={item} className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <X className="h-4 w-4 text-red-500" />
              <p className="mt-3 text-xs font-bold">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/[0.035] p-7 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
          <span className="h-2 w-2 rounded-full bg-primary" />
          With YourClass
        </div>
        <h3 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
          Your class becomes one calm workspace.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          One dashboard, clear actions, and the information you need when you need it.
        </p>

        <div className="mt-8 space-y-3">
          {after.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-card px-4 py-3.5 shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-bold">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
          {item.metric}
        </span>
      </div>

      <p className="mt-6 text-sm leading-7 text-muted-foreground">
        “{item.quote}”
      </p>

      <div className="mt-7 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
          {item.initials}
        </div>
        <div>
          <p className="text-sm font-black">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.role}</p>
        </div>
      </div>
    </article>
  );
}

function AudienceCard({
  item,
}: {
  item: typeof audiences[number];
}) {
  const Icon = item.icon;

  return (
    <div className="group rounded-3xl border border-border/70 bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-black">{item.title}</h3>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
    </div>
  );
}

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={classNames(
      "overflow-hidden rounded-2xl border transition-colors",
      open ? "border-primary/20 bg-primary/[0.025]" : "border-border/70 bg-card"
    )}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
        aria-expanded={open}
      >
        <span className="text-sm font-black sm:text-base">{item.question}</span>
        <ChevronDown className={classNames(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
          open && "rotate-180 text-primary"
        )} />
      </button>
      <div className={classNames(
        "grid transition-[grid-template-rows,opacity] duration-300",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="min-h-0 overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground sm:px-6">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card p-7 shadow-[0_30px_90px_-45px_hsl(var(--primary)/0.5)] sm:p-9">
      <div className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary-foreground">
        Simple & fair
      </div>

      <div className="max-w-sm">
        <p className="text-sm font-bold text-muted-foreground">Teacher plan</p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-6xl font-black tracking-[-0.06em]">₹299</span>
          <span className="mb-2 text-sm text-muted-foreground">/ month</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          One plan. The core tools you need to manage a growing class.
        </p>
      </div>

      <div className="my-7 h-px bg-border" />

      <div className="grid gap-3 sm:grid-cols-2">
        {pricingFeatures.map((feature) => (
          <div key={feature} className="flex items-center gap-2.5 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" />
            </span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
      >
        Start 7-day free trial
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        No credit card required
      </div>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: IconType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  onStart,
}: {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}) {
  if (!open) return null;

  return (
    <div className="border-t border-border/70 bg-background/95 px-5 py-5 backdrop-blur-xl md:hidden">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="rounded-xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {item.label}
          </a>
        ))}

        <a
          href="/auth"
          onClick={onClose}
          className="rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground"
        >
          Login
        </a>

        <button
          type="button"
          onClick={onStart}
          className="mt-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground"
        >
          Start free trial
        </button>
      </div>
    </div>
  );
}

function StickyMobileCta({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 520);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 p-3 shadow-2xl backdrop-blur-xl md:hidden">
      <button
        type="button"
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20"
      >
        Start your 7-day free trial
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const goToAuth = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
     <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Your<span className="text-primary">Class</span>
            </span>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>

            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </a>

            <a
              href="#who-its-for"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              For Teachers
            </a>
          </nav>

          {/* =====================================================
              DESKTOP ACTIONS
          ===================================================== */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Desktop theme */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <a
              href="/auth"
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Login
            </a>

            <button
              type="button"
              onClick={goToAuth}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
            >
              Start Free Trial
            </button>
          </div>

          {/* =====================================================
              MOBILE ACTIONS
              
              IMPORTANT:
              THEME BUTTON IS HERE.
              IT IS OUTSIDE THE MOBILE MENU.
          ===================================================== */}
          <div className="flex items-center gap-1 md:hidden">
            {/* MOBILE THEME BUTTON */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* MOBILE HAMBURGER */}
            <button
              type="button"
              onClick={() => setMobileMenu((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* =========================================================
            MOBILE MENU

            NOTICE:
            THERE IS NO THEME BUTTON HERE.
        ========================================================= */}
        {mobileMenu && (
          <div className="border-t border-border bg-background px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMobileMenu(false)}
                className="text-sm font-medium"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMobileMenu(false)}
                className="text-sm font-medium"
              >
                How It Works
              </a>

              <a
                href="#pricing"
                onClick={() => setMobileMenu(false)}
                className="text-sm font-medium"
              >
                Pricing
              </a>

              <a
                href="#who-its-for"
                onClick={() => setMobileMenu(false)}
                className="text-sm font-medium"
              >
                For Teachers
              </a>

              <a
                href="/auth"
                className="text-sm font-medium text-muted-foreground"
              >
                Login
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenu(false);
                  goToAuth();
                }}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Start 7-Day Free Trial
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <main>
        {/* =======================================================
            HERO
        ======================================================= */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-info/10 blur-3xl" />

         <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:pb-20 lg:pt-25">
            {/* Hero text */}
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Built for teachers who run their own classes
              </div>

              <h1 className="max-w-2xl text-5xl font-black leading-[1.03] tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]">
                Run your classes.
                <span className="block text-primary">
                  Not your paperwork.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Manage students, attendance, fees and batches — all in one
                simple dashboard built for independent teachers and small
                coaching classes.
              </p>

              <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Clock3,
                    text: "Save time",
                  },
                  {
                    icon: Zap,
                    text: "Easy to use",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Secure data",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>

                      {item.text}
                    </div>
                  );
                })}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={goToAuth}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/25"
                >
                  Start 7-Day Free Trial

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-4 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  See How It Works
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required • ₹299/month after trial
              </p>
            </div>

            {/* =====================================================
                DASHBOARD PREVIEW
            ===================================================== */}
            <div className="relative min-w-0">
              <div className="absolute -inset-8 rounded-[3rem] bg-primary/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-primary/10">
                {/* Browser top */}
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  </div>

                  <div className="rounded-md bg-background px-8 py-1 text-[9px] text-muted-foreground shadow-sm">
                    yourclass.app/dashboard
                  </div>

                  <div className="w-8" />
                </div>

                {/* IMPORTANT:
                    Mobile = one column
                    Desktop = sidebar + content
                */}
                <div className="grid min-h-[410px] grid-cols-1 bg-muted/10 sm:grid-cols-[150px_1fr]">
                  {/* Sidebar */}
                  <div className="hidden border-r border-border bg-card p-4 sm:block">
                    <div className="mb-7 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>

                      <span className="text-xs font-bold">
                        YourClass
                      </span>
                    </div>

                    <div className="space-y-1">
                      {[
                        "Dashboard",
                        "Students",
                        "Attendance",
                        "Fees",
                        "Reports",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2 text-[10px] font-medium ${
                            index === 0
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard */}
                  <div className="min-w-0 p-4 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground">
                          Dashboard
                        </p>

                        <h3 className="mt-1 text-sm font-bold sm:text-lg">
                          Welcome back, Teacher 👋
                        </h3>
                      </div>

                      <div className="shrink-0 rounded-lg border border-border px-2 py-1 text-[8px] text-muted-foreground">
                        This Month
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        {
                          label: "Total Students",
                          value: "128",
                          icon: Users,
                          style: "bg-primary/10 text-primary",
                        },
                        {
                          label: "Present Today",
                          value: "96",
                          icon: CalendarCheck,
                          style: "bg-success/10 text-success",
                        },
                        {
                          label: "Fees Collected",
                          value: "₹42,800",
                          icon: IndianRupee,
                          style: "bg-warning/10 text-warning",
                        },
                        {
                          label: "Pending Fees",
                          value: "₹8,600",
                          icon: Receipt,
                          style: "bg-destructive/10 text-destructive",
                        },
                      ].map((stat) => {
                        const Icon = stat.icon;

                        return (
                          <div
                            key={stat.label}
                            className="min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm"
                          >
                            <div
                              className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg ${stat.style}`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>

                            <p className="truncate text-[8px] text-muted-foreground">
                              {stat.label}
                            </p>

                            <p className="mt-1 truncate text-xs font-bold sm:text-sm">
                              {stat.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Lower cards */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                      {/* Chart */}
                      <div className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold">
                              Attendance Overview
                            </p>

                            <p className="text-[8px] text-muted-foreground">
                              This week
                            </p>
                          </div>

                          <BarChart3 className="h-4 w-4 shrink-0 text-primary" />
                        </div>

                        <div className="relative mt-5 h-28">
                          <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-border" />
                          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
                          <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-border" />

                          <svg
                            viewBox="0 0 500 120"
                            className="absolute inset-0 h-full w-full"
                          >
                            <path
                              d="M0 85 C55 70 65 90 110 65 S180 78 225 48 S290 58 335 35 S410 55 500 18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="text-primary"
                            />

                            <path
                              d="M0 85 C55 70 65 90 110 65 S180 78 225 48 S290 58 335 35 S410 55 500 18 L500 120 L0 120 Z"
                              className="fill-primary/10"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Fees */}
                      <div className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
                        <p className="text-xs font-semibold">
                          Recent Fee Collection
                        </p>

                        <div className="mt-3 space-y-3">
                          {[
                            ["Aarav Sharma", "₹1,200"],
                            ["Diya Patel", "₹1,500"],
                            ["Rohan Verma", "₹1,200"],
                            ["Ishita Singh", "₹1,000"],
                          ].map(([name, amount]) => (
                            <div
                              key={name}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[7px] font-bold text-primary">
                                  {name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>

                                <span className="truncate text-[8px] font-medium">
                                  {name}
                                </span>
                              </div>

                              <span className="shrink-0 text-[8px] font-semibold text-success">
                                {amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                    <Check className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold">
                      Fees collected
                    </p>

                    <p className="text-sm font-bold">
                      ₹42,800
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            TRUST STRIP
        ======================================================= */}
        <section className="border-y border-border/60 bg-muted/20">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-5 py-5 text-center sm:flex-row">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-5 w-5 text-success" />
              Your class data stays secure
            </div>

            <div className="hidden h-5 w-px bg-border sm:block" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-success" />
              Simple to use
            </div>

            <div className="hidden h-5 w-px bg-border sm:block" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4 text-primary" />
              Built to save teachers time
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="A better way to manage"
              title={
                <>
                  The work behind teaching
                  <span className="text-primary"> shouldn't run your day.</span>
                </>
              }
              description="You became a teacher to teach. Yet every month brings the same small admin jobs: checking attendance, finding fee records, updating lists, and remembering who needs a follow-up."
            />

            <div className="mt-14">
              <BeforeAfterPanel />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="scroll-mt-24 bg-muted/20 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Everything in one place"
              title={
                <>
                  The everyday tools your
                  <span className="text-primary"> class actually needs.</span>
                </>
              }
              description="No giant ERP. No confusing maze of settings. Just focused tools for the work a teacher does every day."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Simple workflow"
              title={
                <>
                  From today's class
                  <span className="text-primary"> to a clearer month.</span>
                </>
              }
              description="YourClass follows the natural rhythm of running a class: students, classes, attendance, payments, and review."
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <WorkflowCard key={step.number} step={step} index={index} />
              ))}
            </div>

            <div className="mt-12 rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">A calmer routine</p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                    Open the dashboard. Know what matters.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    The product should help a teacher decide what to do next without making them dig through reports first.
                  </p>
                  <button
                    type="button"
                    onClick={goToAuth}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-primary-foreground shadow-lg shadow-primary/15"
                  >
                    Try the workflow
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Bell, title: "Attention", detail: "See what needs follow-up." },
                    { icon: CalendarCheck, title: "Today", detail: "Know your class schedule." },
                    { icon: BarChart3, title: "Progress", detail: "Understand the month." },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <p className="mt-5 text-sm font-black">{item.title}</p>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSIGHTS */}
        <section id="insights" className="scroll-mt-24 bg-muted/20 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  The dashboard advantage
                </div>

                <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                  Don't just store
                  <span className="text-primary"> information.</span>
                  <br />
                  Make it useful.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  A good dashboard shouldn't make you read six reports. It should help you understand the state of your class and point you toward the next useful action.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: Bell,
                      title: "Today's Attention",
                      description: "Pending fees, absences, and changes that deserve a look.",
                    },
                    {
                      icon: TrendingUp,
                      title: "Monthly Momentum",
                      description: "See whether collections and attendance are moving in the right direction.",
                    },
                    {
                      icon: UserCheck,
                      title: "Student Signals",
                      description: "Create a foundation for identifying students who may need support.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-sm lg:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">August overview</p>
                      <p className="mt-1 text-3xl font-black">₹51,400</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-muted-foreground">
                        Fee collections
                      </span>
                      <span className="text-[9px] font-bold text-emerald-500">
                        +12.4% vs last month
                      </span>
                    </div>

                    <div className="relative h-36 overflow-hidden rounded-2xl bg-muted/20 px-2 pt-2">
                      <div className="pointer-events-none absolute inset-x-2 top-4 border-t border-border/50" />
                      <div className="pointer-events-none absolute inset-x-2 top-1/2 border-t border-dashed border-border/40" />
                      <div className="pointer-events-none absolute inset-x-2 bottom-5 border-t border-border/50" />

                      <svg
                        viewBox="0 0 520 150"
                        preserveAspectRatio="none"
                        className="relative h-full w-full overflow-visible"
                        aria-label="August fee collection trend"
                        role="img"
                      >
                        <defs>
                          <linearGradient id="collectionArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.28" />
                            <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0" />
                          </linearGradient>
                          <filter id="collectionGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        <path
                          d="M0 116 C38 112 48 98 82 102 C116 106 132 84 164 88 C196 92 211 72 246 77 C278 82 291 58 325 63 C359 68 372 45 405 52 C438 59 458 36 520 24 L520 150 L0 150 Z"
                          fill="url(#collectionArea)"
                        />

                        <path
                          d="M0 116 C38 112 48 98 82 102 C116 106 132 84 164 88 C196 92 211 72 246 77 C278 82 291 58 325 63 C359 68 372 45 405 52 C438 59 458 36 520 24"
                          fill="none"
                          className="stroke-primary"
                          strokeWidth="3"
                          strokeLinecap="round"
                          filter="url(#collectionGlow)"
                        />

                        <circle cx="520" cy="24" r="5" className="fill-primary" />
                        <circle cx="520" cy="24" r="9" className="fill-primary/15" />
                      </svg>

                      <div className="pointer-events-none absolute bottom-1.5 left-2 right-2 flex justify-between text-[8px] font-semibold text-muted-foreground">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:col-span-3 sm:grid-cols-3 lg:col-span-1 lg:grid-cols-3">
                  {insightCards.map((item) => (
                    <InsightCard key={item.title} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section id="audience" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Made for real teachers"
              title={
                <>
                  Whether you teach one batch
                  <span className="text-primary"> or many.</span>
                </>
              }
              description="YourClass is intentionally focused on the needs of small teaching businesses and independent educators."
            />

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {audiences.map((item) => (
                <AudienceCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-muted/20 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Built around the teacher"
              title={
                <>
                  Less admin.
                  <span className="text-primary"> More headspace.</span>
                </>
              }
              description="The goal isn't to add another complicated tool to your routine. It's to remove the little jobs that keep pulling your attention away from teaching."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <TestimonialCard key={item.name} item={item} />
              ))}
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
                { value: "1", label: "focused workspace", icon: LayoutDashboard },
                { value: "₹299", label: "simple monthly plan", icon: WalletCards },
                { value: "7 days", label: "to try it free", icon: Rocket },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xl font-black">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
          <Glow className="left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2" tone="success" />

          <div className="relative mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Simple pricing"
              title={
                <>
                  One plan.
                  <span className="text-primary"> No pricing maze.</span>
                </>
              }
              description="Start with the full core experience and decide if YourClass fits the way you run your classes."
            />

            <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-5">
                {[
                  {
                    icon: CheckCircle2,
                    title: "Everything you need included",
                    description: "No artificial feature gates between basic and useful workflows.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "No credit card for the trial",
                    description: "Explore the product before making a payment decision.",
                  },
                  {
                    icon: Clock3,
                    title: "Cancel anytime",
                    description: "A simple subscription should stay simple.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-black">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <PricingCard onStart={goToAuth} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 bg-muted/20 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="Questions"
              title={
                <>
                  Everything you need to know
                  <span className="text-primary"> before you start.</span>
                </>
              }
            />

            <div className="mt-12 space-y-3">
              {faqs.map((item, index) => (
                <FaqRow
                  key={item.question}
                  item={item}
                  open={openFaq === index}
                  onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        {/* <section className="px-5 pb-20 pt-20 sm:px-8 lg:pb-28 lg:pt-28">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-primary/15 bg-[#11111d] px-7 py-14 text-foreground shadow-[0_35px_100px_-45px_hsl(var(--primary)/0.45)] sm:px-12 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-24 -top-44 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-48 -left-24 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,_hsl(var(--primary)/0.18),_transparent_34%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.025),transparent_45%,hsl(var(--primary)/0.035))]" />

            <div className="relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-black text-primary">
                  <Rocket className="h-3.5 w-3.5" />
                  Start today
                </div>

                <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Your next class
                  <span className="block text-muted-foreground">
                    shouldn't create more paperwork.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Bring your students, attendance, and fee tracking into one place. Try YourClass free for 7 days.
                </p>
              </div>

              <div className="w-full max-w-sm">
                <button
                  type="button"
                  onClick={goToAuth}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-sm font-black text-primary shadow-2xl transition-all hover:-translate-y-1 hover:shadow-3xl"
                >
                  Start my free trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="mt-3 text-center text-xs text-primary-foreground/60">
                  7 days free <span className="mx-1">•</span> No credit card required
                </p>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/70 bg-card">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <a href="#" aria-label="YourClass home">
                <LogoMark compact />
              </a>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                Simple class management for teachers who want to spend more time teaching and less time managing.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <LockKeyhole className="h-3.5 w-3.5 text-primary" />
                Designed with privacy and account separation in mind
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-black uppercase tracking-[0.16em]">{column.title}</h3>
                <div className="mt-4 space-y-3">
                  {column.links.map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} YourClass. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure workspace
              </span>
              <span>Built for teachers.</span>
            </div>
          </div>
        </div>
      </footer>

      <StickyMobileCta onStart={goToAuth} />
    </div>
  );
}