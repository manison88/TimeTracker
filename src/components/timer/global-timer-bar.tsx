"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { stopTimer, getRunningTimer } from "@/actions/timer";
import { formatDuration, calculateElapsedSeconds } from "@/lib/utils/time";
import { Button } from "@/components/ui/button";
import type { TimerState } from "@/types";

interface GlobalTimerBarProps {
  initialState: TimerState;
}

export function GlobalTimerBar({ initialState }: GlobalTimerBarProps) {
  const router = useRouter();
  const [timerState, setTimerState] = useState(initialState);
  const [elapsed, setElapsed] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with server state periodically
  useEffect(() => {
    if (!mounted) return;

    const syncTimer = async () => {
      const state = await getRunningTimer();
      setTimerState(state);
    };

    // Sync every 30 seconds
    const interval = setInterval(syncTimer, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Update elapsed time every second
  useEffect(() => {
    if (!mounted || !timerState.isRunning || !timerState.startTime) {
      setElapsed(0);
      return;
    }

    setElapsed(calculateElapsedSeconds(timerState.startTime));

    const interval = setInterval(() => {
      setElapsed(calculateElapsedSeconds(timerState.startTime!));
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, timerState.isRunning, timerState.startTime]);

  const handleStop = () => {
    startTransition(async () => {
      await stopTimer();
      setTimerState({
        isRunning: false,
        featureId: null,
        featureName: null,
        projectId: null,
        projectName: null,
        startTime: null,
        timeEntryId: null,
      });
      router.refresh();
    });
  };

  if (!timerState.isRunning) {
    return null;
  }

  const { hms, friendly } = formatDuration(elapsed);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium">Tracking:</span>
            </div>
            
            <Link
              href={`/projects/${timerState.projectId}`}
              className="text-sm hover:underline"
            >
              <span className="font-medium">{timerState.projectName}</span>
              <span className="mx-2 opacity-60">&rsaquo;</span>
              <span>{timerState.featureName}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right" suppressHydrationWarning>
              <span className="font-mono text-lg font-semibold">{hms}</span>
              <span className="ml-2 text-sm opacity-80">({friendly})</span>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleStop}
              isLoading={isPending}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <StopIcon className="w-4 h-4 mr-1.5" />
              Stop
            </Button>
          </div>
        </div>
      </div>
    </div>
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
