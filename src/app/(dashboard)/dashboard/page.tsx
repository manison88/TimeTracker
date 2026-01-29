import { Suspense } from "react";
import { getProjects } from "@/actions/projects";
import { ProjectList } from "@/components/projects/project-list";
import { LoadingPage } from "@/components/ui/loading";

export const metadata = {
  title: "Dashboard - TimeTracker",
};

// Configure Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

async function ProjectsContainer() {
  const projects = await getProjects();
  return <ProjectList projects={projects} />;
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage your projects and track your time
        </p>
      </div>

      <Suspense fallback={<LoadingPage message="Loading projects..." />}>
        <ProjectsContainer />
      </Suspense>
    </div>
  );
}
