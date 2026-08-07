import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { BooksIllustration } from "@/components/illustrations/BooksIllustration";

export const quotes = [
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "A teacher affects eternity; he can never tell where his influence stops.",
    author: "Henry Adams",
  },
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey",
  },
  {
    text: "The art of teaching is the art of assisting discovery.",
    author: "Mark Van Doren",
  },
  {
    text: "It is the supreme art of the teacher to awaken joy in creative expression and knowledge.",
    author: "Albert Einstein",
  },
  {
    text: "The dream begins with a teacher who believes in you.",
    author: "Dan Rather",
  },
  {
    text: "Nine-tenths of education is encouragement.",
    author: "Anatole France",
  },
  {
    text: "The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires.",
    author: "William Arthur Ward",
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
  },
  {
    text: "Teachers open the door, but you must enter by yourself.",
    author: "Chinese Proverb",
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
  },
  {
    text: "A good teacher can inspire hope, ignite the imagination, and instill a love of learning.",
    author: "Brad Henry",
  },
  {
    text: "Develop a passion for learning. If you do, you will never cease to grow.",
    author: "Anthony J. D'Angelo",
  },
  {
    text: "Education's purpose is to replace an empty mind with an open one.",
    author: "Malcolm Forbes",
  },
  {
    text: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle",
  },
  {
    text: "The function of education is to teach one to think intensively and to think critically.",
    author: "Martin Luther King Jr.",
  },
  {
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
  },
  {
    text: "The whole purpose of education is to turn mirrors into windows.",
    author: "Sydney J. Harris",
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford",
  },
  {
    text: "Wisdom begins in wonder.",
    author: "Socrates",
  },
  {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams",
  },
  {
    text: "Education is simply the soul of a society as it passes from one generation to another.",
    author: "G. K. Chesterton",
  },
  {
    text: "The purpose of learning is growth, and our minds, unlike our bodies, can continue growing as we continue to live.",
    author: "Mortimer J. Adler",
  },
  {
    text: "The mind is not a vessel to be filled but a fire to be kindled.",
    author: "Plutarch",
  },
  {
    text: "Study without desire spoils the memory, and it retains nothing that it takes in.",
    author: "Leonardo da Vinci",
  },
  {
    text: "I am still learning.",
    author: "Michelangelo",
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
            <h2 className="text-xl font-bold">Today's Inspiration</h2>

            <p className="mt-1 max-w-2xl text-base italic leading-7 text-muted-foreground">
              "{quote.text}"
            </p>

            <p className="mt-2 text-sm text-muted-foreground">— {quote.author}</p>
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
