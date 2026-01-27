"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { CreateProjectForm } from "./create-project-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ProjectSummary } from "@/types";

interface ProjectListProps {
  projects: ProjectSummary[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (projects.length === 0 && !showCreateForm) {
    return (
      <EmptyState
        icon={<FolderIcon className="w-12 h-12" />}
        title="No projects yet"
        description="Create your first project to start tracking time on your features."
        action={
          <Button onClick={() => setShowCreateForm(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Projects ({projects.length})
        </h2>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)} size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card variant="bordered" className="bg-gray-50">
          <CreateProjectForm
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  );
}
