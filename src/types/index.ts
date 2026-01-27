import type { Project, Feature, TimeEntry, RunningTimer } from "@prisma/client";

// Extended types with relations
export interface ProjectWithFeatures extends Project {
  features: FeatureWithTimeEntries[];
}

export interface FeatureWithTimeEntries extends Feature {
  timeEntries: TimeEntry[];
  runningTimer: RunningTimer | null;
}

export interface FeatureWithProject extends Feature {
  project: Project;
  timeEntries: TimeEntry[];
  runningTimer: RunningTimer | null;
}

export interface RunningTimerWithDetails extends RunningTimer {
  feature: FeatureWithProject;
}

// Project status type
export type ProjectStatus = "active" | "completed" | "on_break" | "discontinued";

// Dashboard view types
export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  status: ProjectStatus;
  endReason: string | null;
  endedAt: Date | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  featureCount: number;
  totalSeconds: number;
  hasRunningTimer: boolean;
}

export interface FeatureSummary {
  id: string;
  name: string;
  description: string | null;
  status: string;
  projectId: string;
  totalSeconds: number;
  isRunning: boolean;
  runningStartTime: Date | null;
  lastWorked: Date | null;
}

// Timer state
export interface TimerState {
  isRunning: boolean;
  featureId: string | null;
  featureName: string | null;
  projectId: string | null;
  projectName: string | null;
  startTime: Date | null;
  timeEntryId: string | null;
}

// Insights types
export interface FeatureInsight {
  id: string;
  name: string;
  totalSeconds: number;
  percentOfProject: number;
  entryCount: number;
  lastWorked: Date | null;
}

export interface ProjectInsights {
  projectId: string;
  projectName: string;
  totalSeconds: number;
  features: FeatureInsight[];
}

// Action response types
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Re-export Prisma types for convenience
export type { Project, Feature, TimeEntry, RunningTimer };
