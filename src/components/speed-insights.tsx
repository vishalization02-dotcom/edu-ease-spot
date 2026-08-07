import { useEffect } from "react";
import { injectSpeedInsights } from "@vercel/speed-insights";

/**
 * SpeedInsights component for TanStack Start
 * Uses the generic injectSpeedInsights function to avoid Next.js-specific dependencies
 */
export function SpeedInsights() {
  useEffect(() => {
    injectSpeedInsights({
      framework: "react",
    });
  }, []);

  return null;
}
