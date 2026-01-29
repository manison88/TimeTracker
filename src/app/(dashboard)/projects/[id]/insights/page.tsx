import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectInsights } from "@/actions/insights";
import { InsightsTable } from "@/components/insights/insights-table";
import { TimeDisplay } from "@/components/timer/time-display";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Configure Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

interface InsightsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
}

export async function generateMetadata({ params }: InsightsPageProps) {
  const { id } = await params;
  const insights = await getProjectInsights(id);
  return {
    title: insights
      ? `Insights: ${insights.projectName} - TimeTracker`
      : "Insights Not Found",
  };
}

export default async function InsightsPage({
  params,
  searchParams,
}: InsightsPageProps) {
  const { id } = await params;
  const { days: daysStr } = await searchParams;
  const days = daysStr ? parseInt(daysStr) : undefined;
  const insights = await getProjectInsights(id, { lastDays: days });

  if (!insights) {
    notFound();
  }

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
          <li>
            <Link
              href={`/projects/${id}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {insights.projectName}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Insights</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Insights</h1>
          <p className="text-gray-500 mt-1">{insights.projectName}</p>
        </div>
        <Link href={`/projects/${id}`}>
          <Button variant="secondary">
            <ArrowIcon className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card variant="bordered" className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Time Tracked</div>
            <TimeDisplay
              totalSeconds={insights.totalSeconds}
              format="both"
              size="lg"
            />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Features</div>
            <div className="text-2xl font-bold text-gray-900">
              {insights.features.length}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <FilterLink
            href={`/projects/${id}/insights`}
            active={!days}
            label="All Time"
          />
          <FilterLink
            href={`/projects/${id}/insights?days=7`}
            active={days === 7}
            label="Last 7 Days"
          />
          <FilterLink
            href={`/projects/${id}/insights?days=30`}
            active={days === 30}
            label="Last 30 Days"
          />
        </div>
      </Card>

      {/* Insights Table */}
      <Card variant="bordered">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Time by Feature
        </h2>
        <InsightsTable
          features={insights.features}
          totalSeconds={insights.totalSeconds}
        />
      </Card>
    </div>
  );
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        active
          ? "bg-primary-100 text-primary-700 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}
