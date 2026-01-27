"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resumeProject } from "@/actions/projects";
import { TimeDisplay } from "@/components/timer/time-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EndProjectModal } from "./end-project-modal";
import type { ProjectStatus } from "@/types";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    status: string;
    endReason: string | null;
  };
  totalSeconds: number;
  hasRunningTimer: boolean;
  featureCount: number;
}

export function ProjectHeader({
  project,
  totalSeconds,
  hasRunningTimer,
  featureCount,
}: ProjectHeaderProps) {
  const router = useRouter();
  const [showEndModal, setShowEndModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const status = project.status as ProjectStatus;

  const handleResume = () => {
    startTransition(async () => {
      await resumeProject(project.id);
      router.refresh();
    });
  };

  return (
    <>
      <Card variant="bordered" className="mb-8">
        <div className="flex items-start gap-4">
          {/* Project Icon */}
          {project.iconUrl ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              <img
                src={project.iconUrl}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold text-2xl">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {project.name}
              </h1>
              {status === "completed" && (
                <Badge variant="success">Completed</Badge>
              )}
              {status === "on_break" && (
                <Badge variant="warning">On Break</Badge>
              )}
              {status === "discontinued" && (
                <Badge variant="danger">Discontinued</Badge>
              )}
            </div>
            {project.description && (
              <p className="text-gray-500">{project.description}</p>
            )}
            {project.endReason && status !== "active" && (
              <p className="text-sm text-gray-400 mt-2 italic">
                &quot;{project.endReason}&quot;
              </p>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-sm text-gray-500 mb-1">Total Time</div>
            <TimeDisplay
              totalSeconds={totalSeconds}
              isRunning={hasRunningTimer}
              format="both"
              size="lg"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {featureCount} {featureCount === 1 ? "feature" : "features"}
          </div>
          <div className="flex-1" />
          
          <div className="flex items-center gap-2">
            <Link href={`/projects/${project.id}/insights`}>
              <Button variant="secondary" size="sm">
                <ChartIcon className="w-4 h-4 mr-2" />
                View Insights
              </Button>
            </Link>

            {status === "active" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEndModal(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <StopIcon className="w-4 h-4 mr-2" />
                End Project
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleResume}
                isLoading={isPending}
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Resume Project
              </Button>
            )}
          </div>
        </div>
      </Card>

      <EndProjectModal
        projectId={project.id}
        projectName={project.name}
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
      />
    </>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm5-2.25A.75.75 0 017.75 7h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
        clipRule="evenodd"
      />
    </svg>
  );
}
