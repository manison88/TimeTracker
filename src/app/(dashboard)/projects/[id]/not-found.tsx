import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProjectNotFound() {
  return (
    <EmptyState
      icon={<NotFoundIcon className="w-16 h-16" />}
      title="Project not found"
      description="The project you're looking for doesn't exist or you don't have access to it."
      action={
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      }
    />
  );
}

function NotFoundIcon({ className }: { className?: string }) {
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
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}
