"use server";

import { getDb } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import type { ProjectInsights, FeatureInsight } from "@/types";

export async function getProjectInsights(
  projectId: string,
  options?: { lastDays?: number }
): Promise<ProjectInsights | null> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    // Verify project ownership
    const project = await db.project.findFirst({
      where: { id: projectId, userId },
      include: {
        features: {
          include: {
            timeEntries: {
              orderBy: { startTime: "desc" },
            },
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    const { lastDays } = options || {};
    const cutoffDate = lastDays
      ? new Date(Date.now() - lastDays * 24 * 60 * 60 * 1000)
      : null;

    // Calculate totals for each feature
    const featureInsights: FeatureInsight[] = [];
    let projectTotalSeconds = 0;

    for (const feature of project.features) {
      let featureTotalSeconds = 0;
      let entryCount = 0;
      let lastWorked: Date | null = null;

      for (const entry of feature.timeEntries) {
        // Apply date filter if specified
        if (cutoffDate && new Date(entry.startTime) < cutoffDate) {
          continue;
        }

        if (entry.durationSeconds !== null) {
          featureTotalSeconds += entry.durationSeconds;
          entryCount++;
        } else if (entry.endTime === null) {
          // Running entry
          const elapsed = Math.floor(
            (Date.now() - new Date(entry.startTime).getTime()) / 1000
          );
          featureTotalSeconds += elapsed;
          entryCount++;
        }

        // Track last worked
        const entryTime = entry.endTime || entry.startTime;
        if (!lastWorked || entryTime > lastWorked) {
          lastWorked = entryTime;
        }
      }

      projectTotalSeconds += featureTotalSeconds;

      featureInsights.push({
        id: feature.id,
        name: feature.name,
        totalSeconds: featureTotalSeconds,
        percentOfProject: 0, // Will be calculated after we have total
        entryCount,
        lastWorked,
      });
    }

    // Calculate percentages and sort by time (desc)
    for (const feature of featureInsights) {
      feature.percentOfProject =
        projectTotalSeconds > 0
          ? Math.round((feature.totalSeconds / projectTotalSeconds) * 100)
          : 0;
    }

    featureInsights.sort((a, b) => b.totalSeconds - a.totalSeconds);

    return {
      projectId: project.id,
      projectName: project.name,
      totalSeconds: projectTotalSeconds,
      features: featureInsights,
    };
  } catch (error) {
    console.error("Get project insights error:", error);
    return null;
  }
}
