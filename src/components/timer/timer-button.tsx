"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startTimer, stopTimer } from "@/actions/timer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface TimerButtonProps {
  featureId: string;
  isRunning: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TimerButton({
  featureId,
  isRunning,
  size = "md",
  className,
}: TimerButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticRunning, setOptimisticRunning] = useState(isRunning);

  const handleClick = () => {
    // Optimistic update
    setOptimisticRunning(!optimisticRunning);

    startTransition(async () => {
      try {
        if (isRunning) {
          await stopTimer();
        } else {
          await startTimer(featureId);
        }
        router.refresh();
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticRunning(isRunning);
        console.error("Timer action failed:", error);
      }
    });
  };

  const displayRunning = isPending ? optimisticRunning : isRunning;

  return (
    <Button
      variant={displayRunning ? "danger" : "success"}
      size={size}
      onClick={handleClick}
      isLoading={isPending}
      className={cn(
        "min-w-[80px]",
        displayRunning && "animate-pulse-slow",
        className
      )}
    >
      {displayRunning ? (
        <>
          <StopIcon className="w-4 h-4 mr-1.5" />
          Stop
        </>
      ) : (
        <>
          <PlayIcon className="w-4 h-4 mr-1.5" />
          Start
        </>
      )}
    </Button>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
