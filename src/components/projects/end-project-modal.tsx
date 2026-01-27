"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { endProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EndProjectModalProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EndProjectModal({
  projectId,
  projectName,
  isOpen,
  onClose,
}: EndProjectModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"completed" | "on_break" | "discontinued">("completed");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await endProject(projectId, {
        status,
        endReason: reason || undefined,
      });

      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.error || "Failed to end project");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <Card variant="elevated" className="relative z-10 w-full max-w-md mx-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">End Project</h2>
          <p className="text-gray-500 mt-1">
            Why are you ending &quot;{projectName}&quot;?
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Status options */}
          <div className="space-y-3 mb-6">
            <label
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                status === "completed"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="completed"
                checked={status === "completed"}
                onChange={() => setStatus("completed")}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  Completed
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This project is finished and delivered
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                status === "on_break"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="on_break"
                checked={status === "on_break"}
                onChange={() => setStatus("on_break")}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <PauseCircleIcon className="w-5 h-5 text-yellow-600" />
                  Taking a Break
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Pausing work on this project for now
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                status === "discontinued"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="discontinued"
                checked={status === "discontinued"}
                onChange={() => setStatus("discontinued")}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <StopCircleIcon className="w-5 h-5 text-red-600" />
                  Discontinued
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  No longer planning to work on this project
                </p>
              </div>
            </label>
          </div>

          {/* Optional reason */}
          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes (optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={
                status === "completed"
                  ? "Final thoughts, lessons learned..."
                  : status === "on_break"
                  ? "Why are you pausing? When do you plan to resume?"
                  : "Reason for discontinuing (scope change, priorities shifted, etc.)"
              }
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={status === "completed" ? "success" : status === "discontinued" ? "danger" : "primary"}
              isLoading={isPending}
            >
              {status === "completed" 
                ? "Mark as Completed" 
                : status === "on_break"
                ? "Pause Project"
                : "Discontinue Project"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PauseCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75H9zm5.25 0a.75.75 0 00-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StopCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h6a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
