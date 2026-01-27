"use client";

import { useState, useEffect } from "react";
import { formatDuration, calculateElapsedSeconds } from "@/lib/utils/time";
import { cn } from "@/lib/utils/cn";

interface TimeDisplayProps {
  totalSeconds: number;
  isRunning?: boolean;
  startTime?: Date | string | null;
  format?: "hms" | "friendly" | "both";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TimeDisplay({
  totalSeconds,
  isRunning = false,
  startTime = null,
  format = "both",
  size = "md",
  className,
}: TimeDisplayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isRunning || !startTime) {
      setElapsed(0);
      return;
    }

    // Initial calculation
    setElapsed(calculateElapsedSeconds(startTime));

    // Update every second
    const interval = setInterval(() => {
      setElapsed(calculateElapsedSeconds(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, isRunning, startTime]);

  const displaySeconds = isRunning ? totalSeconds + elapsed : totalSeconds;
  const { hms, friendly } = formatDuration(displaySeconds);

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  if (format === "hms") {
    return (
      <span className={cn("font-mono", sizes[size], className)} suppressHydrationWarning>
        {hms}
      </span>
    );
  }

  if (format === "friendly") {
    return (
      <span className={cn("font-medium", sizes[size], className)} suppressHydrationWarning>
        {friendly}
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-mono", sizes[size])} suppressHydrationWarning>{hms}</span>
      <span className={cn("text-gray-500", sizes[size] === "lg" ? "text-base" : "text-sm")} suppressHydrationWarning>
        ({friendly})
      </span>
    </div>
  );
}
