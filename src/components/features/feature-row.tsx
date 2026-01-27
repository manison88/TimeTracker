"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteFeature, updateFeature } from "@/actions/features";
import { TimerButton } from "@/components/timer/timer-button";
import { TimeDisplay } from "@/components/timer/time-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/time";
import type { FeatureSummary } from "@/types";

interface FeatureRowProps {
  feature: FeatureSummary;
}

export function FeatureRow({ feature }: FeatureRowProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this feature? All time entries will be lost.")) {
      return;
    }

    startTransition(async () => {
      await deleteFeature(feature.id);
      router.refresh();
    });
  };

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      await updateFeature(feature.id, { status });
      router.refresh();
    });
  };

  const statusBadge = () => {
    switch (feature.status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "paused":
        return <Badge variant="warning">Paused</Badge>;
      default:
        return null;
    }
  };

  return (
    <div
      className="group flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-200 hover:shadow-sm transition-all"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900 truncate">{feature.name}</h4>
          {statusBadge()}
          {feature.isRunning && (
            <Badge variant="success" className="animate-pulse">
              Running
            </Badge>
          )}
        </div>
        {feature.description && (
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {feature.description}
          </p>
        )}
        {feature.lastWorked && (
          <p className="text-xs text-gray-400 mt-1" suppressHydrationWarning>
            Last worked: {formatDateTime(feature.lastWorked)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <TimeDisplay
            totalSeconds={feature.totalSeconds}
            isRunning={feature.isRunning}
            startTime={feature.runningStartTime}
            format="both"
            size="sm"
          />
        </div>

        <TimerButton
          featureId={feature.id}
          isRunning={feature.isRunning}
          size="sm"
        />

        <div
          className={`flex items-center gap-1 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              handleStatusChange(
                feature.status === "completed" ? "active" : "completed"
              )
            }
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600"
          >
            <CheckIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-400 hover:text-red-600"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
