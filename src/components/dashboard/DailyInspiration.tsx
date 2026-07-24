import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { BooksIllustration } from "@/components/illustrations/BooksIllustration";

const quotes = [
  {
    text: "Teaching is the profession that creates all other professions.",
    author: "Unknown",
  },
  {
    text: "A teacher affects eternity; they can never tell where their influence stops.",
    author: "Henry Adams",
  },
  {
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
  },
  {
    text: "Every child is one caring teacher away from a better future.",
    author: "Unknown",
  },
  {
    text: "Great teachers don't just teach subjects—they inspire lives.",
    author: "Unknown",
  },
];

export function DailyInspiration() {
  const today = new Date().getDate();
  const quote = quotes[today % quotes.length];

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-6 py-3">

      {/* Glow */}
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-600/15">
            <Sparkles className="h-7 w-7 text-violet-400" />
          </div>

          <div>

            <h2 className="text-xl font-bold">
              Today's Inspiration
            </h2>

            <p className="mt-1 max-w-2xl text-base italic leading-7 text-muted-foreground">
              "{quote.text}"
            </p>

           <p className="mt-2 text-sm text-muted-foreground">
              — {quote.author}
            </p>

          </div>

        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center justify-end">
  <BooksIllustration />
</div>

      </div>

    </Card>
  );
}