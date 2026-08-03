import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot, Search, X, Lightbulb, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AI_SUGGESTIONS, localAiEngine } from "./ai-data";
import type { AiAnswer, AiStat } from "./ai-types";

const toneClass = (tone: AiStat["tone"]) =>
  tone === "positive"
    ? "text-emerald-400"
    : tone === "negative"
    ? "text-red-400"
    : "text-foreground";

function AnswerView({ answer }: { answer: AiAnswer }) {
  const hasItems = !!answer.items?.length;
  const showEmpty = !hasItems && !answer.stats?.length && !!answer.empty;

  return (
    <div key={answer.title + (answer.items?.length ?? 0)} className="animate-fade-in space-y-3">
      {!showEmpty && (
        <h3 className="text-sm font-semibold tracking-tight">{answer.title}</h3>
      )}

      {hasItems && (
        <ul className="space-y-1.5">
          {answer.items!.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 px-3 py-2 text-sm"
            >
              <span className="truncate">{item.label}</span>
              {item.value && (
                <span className="ml-3 shrink-0 font-medium text-muted-foreground">
                  {item.value}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {!hasItems && answer.empty && !showEmpty && (
        <p className="text-sm text-muted-foreground">{answer.empty}</p>
      )}

      {!!answer.stats?.length && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {answer.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-background/30 px-3 py-2 text-center"
            >
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              <p className={`mt-0.5 text-base font-semibold ${toneClass(stat.tone)}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {showEmpty && (
        <p className="text-sm text-muted-foreground">{answer.empty}</p>
      )}

      {answer.footnote && (
        <p className="text-xs text-muted-foreground">{answer.footnote}</p>
      )}
    </div>
  );
}

export function ClassLedgerAI() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data: answer, isFetching } = useQuery({
    queryKey: ["classledger-ai", submitted],
    queryFn: () => localAiEngine.answer(submitted),
    enabled: submitted.trim().length > 0,
    staleTime: 30_000,
  });

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">ClassLedger AI</h2>
          <p className="text-sm text-muted-foreground">Ask anything about your coaching.</p>
        </div>
      </div>

      {/* Search */}
      <form
        className="px-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query);
        }}
      >
        <div className="group flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-2 transition-all duration-300 focus-within:border-primary/50 focus-within:bg-background/70 focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question... e.g. Who hasn't paid fees?"
            aria-label="Ask ClassLedger AI a question"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear question"
              onClick={() => {
                setQuery("");
                setSubmitted("");
              }}
              className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <Button type="submit" size="sm" className="h-7 shrink-0 rounded-full px-3 text-xs">
            Ask
          </Button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 px-4 pt-3">
        {AI_SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            type="button"
            onClick={() => {
              setQuery(s.text);
              setSubmitted(s.text);
            }}
            className="rounded-full border border-border/60 bg-background/30 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background/60 hover:text-foreground"
          >
            {s.emoji} {s.text}
          </button>
        ))}
      </div>

      {/* Answer area */}
      <div className="mt-4 flex-1 border-t border-border/60 p-4">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking that up...
          </div>
        )}

        {!isFetching && answer && <AnswerView answer={answer} />}

        {!isFetching && !answer && (
          <div className="animate-fade-in space-y-2">
            <p className="text-sm font-medium">Ask a question to get started.</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" /> Try asking:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Who hasn't paid fees?</li>
              <li>• Who was absent today?</li>
              <li>• Show revenue</li>
              <li>• Best performing class</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}