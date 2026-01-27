import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/actions/projects";
import { FeatureList } from "@/components/features/feature-list";
import { ProjectHeader } from "@/components/projects/project-header";
import type { FeatureSummary } from "@/types";

// Use edge runtime only in production (Cloudflare)
// export const runtime = "edge";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);
  return {
    title: project ? `${project.name} - TimeTracker` : "Project Not Found",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  // Calculate totals and transform to FeatureSummary
  let projectTotalSeconds = 0;
  let hasRunningTimer = false;

  const features: FeatureSummary[] = project.features.map((feature) => {
    let totalSeconds = 0;
    let isRunning = false;
    let runningStartTime: Date | null = null;
    let lastWorked: Date | null = null;

    for (const entry of feature.timeEntries) {
      if (entry.durationSeconds !== null) {
        totalSeconds += entry.durationSeconds;
      } else if (entry.endTime === null) {
        // Running entry - don't add elapsed time to totalSeconds
        // The client TimeDisplay component will calculate and display it
        isRunning = true;
        hasRunningTimer = true;
        runningStartTime = entry.startTime;
        // For project total, we still need to calculate elapsed
        const elapsed = Math.floor(
          (Date.now() - new Date(entry.startTime).getTime()) / 1000
        );
        projectTotalSeconds += elapsed;
      }

      const entryTime = entry.endTime || entry.startTime;
      if (!lastWorked || entryTime > lastWorked) {
        lastWorked = entryTime;
      }
    }

    projectTotalSeconds += totalSeconds;

    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      status: feature.status,
      projectId: feature.projectId,
      totalSeconds,
      isRunning,
      runningStartTime,
      lastWorked,
    };
  });

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{project.name}</li>
        </ol>
      </nav>

      {/* Project Header */}
      <ProjectHeader
        project={{
          id: project.id,
          name: project.name,
          description: project.description,
          iconUrl: project.iconUrl,
          status: project.status,
          endReason: project.endReason,
        }}
        totalSeconds={projectTotalSeconds}
        hasRunningTimer={hasRunningTimer}
        featureCount={features.length}
      />

      {/* Features List */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Features</h2>
      </div>

      <FeatureList features={features} projectId={project.id} />
    </div>
  );
}
