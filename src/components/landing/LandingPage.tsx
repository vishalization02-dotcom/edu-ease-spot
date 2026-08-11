import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  Download,
  IndianRupee,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  Music2,
  Palette,
  Receipt,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description:
      "Add students, manage their details, batches, classes and more.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance Tracking",
    description:
      "Mark attendance in seconds and instantly view attendance history.",
  },
  {
    icon: IndianRupee,
    title: "Fee Management",
    description:
      "Track payments, pending fees and monthly collections effortlessly.",
  },
  {
    icon: Receipt,
    title: "Pending Fees",
    description:
      "Always know who has paid and who still needs to pay.",
  },
  {
    icon: BarChart3,
    title: "Reports & Insights",
    description:
      "Get a clear picture of your students, attendance and fee collection.",
  },
  {
    icon: Download,
    title: "Export Your Data",
    description:
      "Export student, attendance and fee data whenever you need it.",
  },
];

const audiences = [
  { icon: BookOpen, label: "Tuition Teachers" },
  { icon: Monitor, label: "Computer Classes" },
  { icon: Palette, label: "Drawing Classes" },
  { icon: Zap, label: "Coding Classes" },
  { icon: Music2, label: "Music Teachers" },
  { icon: Users, label: "Coaching Centers" },
];

const testimonials = [
  {
    name: "Neha Sharma",
    role: "Tuition Teacher",
    text: "Managing attendance and fees has become so much easier. I save hours every week.",
  },
  {
    name: "Amit Verma",
    role: "Computer Institute",
    text: "I used to maintain everything in Excel. Now I can see my entire class in one place.",
  },
  {
    name: "Priya Mehta",
    role: "Drawing Teacher",
    text: "Simple, clean and very useful. I can finally keep track of everything without paperwork.",
  },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

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
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
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

          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:pb-28 lg:pt-24">
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

        {/* =======================================================
            PROBLEM / SOLUTION
        ======================================================= */}
        <section
          id="how-it-works"
          className="px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
              {/* Before */}
              <div className="border-b border-border p-8 sm:p-12 lg:border-b-0 lg:border-r">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Before
                </span>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Still managing your class like this?
                </h2>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    "Notebooks",
                    "Excel sheets",
                    "WhatsApp messages",
                    "Forgotten payments",
                    "Scattered records",
                    "No clear reports",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-border bg-muted/30 p-4"
                    >
                      <X className="mb-3 h-4 w-4 text-destructive" />

                      <p className="text-sm font-medium">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div className="bg-primary/[0.035] p-8 sm:p-12">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">
                  After
                </span>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Everything in one place.
                </h2>

                <div className="mt-8 space-y-4">
                  {[
                    "Manage all your students in one dashboard",
                    "Mark attendance in seconds",
                    "Track every fee payment",
                    "See pending fees instantly",
                    "Get useful reports and insights",
                    "Spend more time teaching",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-primary/10 bg-card px-4 py-3 shadow-sm"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10">
                        <Check className="h-4 w-4 text-success" />
                      </div>

                      <span className="text-sm font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            FEATURES
        ======================================================= */}
        <section
          id="features"
          className="bg-muted/20 px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Everything you need
              </div>

              <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Everything you need to{" "}
                <span className="text-primary">
                  run your class
                </span>
              </h2>

              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Simple tools that take the boring work off your plate.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="icon-tile icon-tile-lg">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>

                    <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =======================================================
            AUDIENCE
        ======================================================= */}
        <section
          id="who-its-for"
          className="px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Built for teachers who{" "}
                <span className="text-primary">
                  run their own classes
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
                Whether you teach 10 students or 200, keep your class
                organized without complicated software.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {audiences.map((audience) => {
                const Icon = audience.icon;

                return (
                  <div
                    key={audience.label}
                    className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                  >
                    <div className="icon-tile">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="mt-3 text-xs font-semibold leading-5">
                      {audience.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =======================================================
            PRICING
        ======================================================= */}
        <section
          id="pricing"
          className="relative overflow-hidden bg-primary/[0.045] px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Simple pricing
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                No complicated plans.
              </h2>

              <p className="mt-4 text-lg text-muted-foreground">
                One simple plan for teachers. Everything included.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 shadow-2xl shadow-primary/10">
                <div className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                  SIMPLE & FAIR
                </div>

                <div className="pt-3">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Teacher Plan
                  </p>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tight">
                      ₹299
                    </span>

                    <span className="mb-2 text-sm text-muted-foreground">
                      / month
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Everything you need to manage your class.
                  </p>
                </div>

                <div className="my-7 h-px bg-border" />

                <div className="space-y-4">
                  {[
                    "All core features included",
                    "Manage students and batches",
                    "Attendance tracking",
                    "Fee collection and pending fees",
                    "Reports and data exports",
                    "7-day free trial",
                    "Cancel anytime",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                        <Check className="h-3 w-3 text-success" />
                      </div>

                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={goToAuth}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Start 7-Day Free Trial
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            TESTIMONIALS
        ======================================================= */}
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Made for teachers.
              </h2>

              <p className="mt-4 text-lg text-muted-foreground">
                Simple enough to use every day.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>

                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    “{testimonial.text}”
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {testimonial.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================
            FINAL CTA
        ======================================================= */}
        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-7 py-14 text-primary-foreground shadow-2xl shadow-primary/20 sm:px-12 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute -right-20 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold text-primary-foreground/70">
                  START TODAY
                </p>

                <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Spend less time managing your class.

                  <span className="block text-primary-foreground/70">
                    Spend more time teaching.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/75">
                  Try it free for 7 days. No credit card required. Continue
                  for just ₹299/month after your trial.
                </p>
              </div>

              <button
                type="button"
                onClick={goToAuth}
                className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-primary shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                Start Free Trial

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>

                <span className="font-bold">
                  Your<span className="text-primary">Class</span>
                </span>
              </div>

              <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
                Simple class management for teachers who want to spend more
                time teaching and less time managing.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold">Product</h3>

              <div className="mt-4 space-y-3">
                <a
                  href="#features"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Features
                </a>

                <a
                  href="#pricing"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </a>

                <a
                  href="#how-it-works"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  How It Works
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">For Teachers</h3>

              <div className="mt-4 space-y-3">
                <a
                  href="#who-its-for"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Tuition Teachers
                </a>

                <a
                  href="#who-its-for"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Computer Classes
                </a>

                <a
                  href="#who-its-for"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Coaching Classes
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Support</h3>

              <div className="mt-4 space-y-3">
                <a
                  href="/auth"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  Login
                </a>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Secure & Reliable
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} YourClass. All rights reserved.
            </p>

            <p>Built for teachers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}