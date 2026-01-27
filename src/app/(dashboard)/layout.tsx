export const runtime = "edge";

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getRunningTimer } from "@/actions/timer";
import { GlobalTimerBar } from "@/components/timer/global-timer-bar";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const timerState = await getRunningTimer();

  return (
    <div className={`min-h-screen bg-gray-50 ${timerState.isRunning ? "pt-12" : ""}`}>
      <GlobalTimerBar initialState={timerState} />

      <header
        className={`bg-white border-b border-gray-200 sticky z-40 ${
          timerState.isRunning ? "top-12" : "top-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  TimeTracker
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
