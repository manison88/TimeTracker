import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimeDisplay } from "@/components/timer/time-display";
import type { ProjectSummary } from "@/types";
import { formatDate } from "@/lib/utils/time";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card
        variant="bordered"
        className="hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer group"
      >
        <CardContent>
          <div className="flex items-start gap-3 mb-3">
            {/* Project Icon */}
            {project.iconUrl ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                <img
                  src={project.iconUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-semibold text-lg">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                  {project.name}
                </h3>
                {project.status === "completed" && (
                  <Badge variant="success">Completed</Badge>
                )}
                {project.status === "on_break" && (
                  <Badge variant="warning">On Break</Badge>
                )}
                {project.status === "discontinued" && (
                  <Badge variant="danger">Discontinued</Badge>
                )}
                {project.hasRunningTimer && (
                  <Badge variant="info" className="animate-pulse">
                    Active
                  </Badge>
                )}
              </div>
              {project.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FeaturesIcon className="w-4 h-4" />
              <span>
                {project.featureCount}{" "}
                {project.featureCount === 1 ? "feature" : "features"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500" suppressHydrationWarning>
            Updated {formatDate(project.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-gray-400" />
            <TimeDisplay
              totalSeconds={project.totalSeconds}
              isRunning={project.hasRunningTimer}
              format="friendly"
              size="sm"
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

function FeaturesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
