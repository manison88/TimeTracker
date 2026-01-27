"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import type { ActionResult, TimerState } from "@/types";

/**
 * Start a timer on a specific feature.
 * If another timer is running, it will be stopped first.
 */
export async function startTimer(
  featureId: string
): Promise<ActionResult<TimerState>> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    // Verify feature exists and belongs to user's project
    const feature = await db.feature.findFirst({
      where: { id: featureId },
      include: { project: true },
    });

    if (!feature || feature.project.userId !== userId) {
      return { success: false, error: "Feature not found" };
    }

    // Check for existing running timer
    const existingTimer = await db.runningTimer.findUnique({
      where: { userId },
    });

    const now = new Date();

    // If there's an existing timer, stop it first
    if (existingTimer) {
      // Find and complete the running time entry
      const runningEntry = await db.timeEntry.findFirst({
        where: {
          userId,
          endTime: null,
        },
      });

      if (runningEntry) {
        const durationSeconds = Math.floor(
          (now.getTime() - new Date(runningEntry.startTime).getTime()) / 1000
        );

        await db.timeEntry.update({
          where: { id: runningEntry.id },
          data: {
            endTime: now,
            durationSeconds,
          },
        });
      }

      // Delete the running timer record
      await db.runningTimer.delete({
        where: { userId },
      });
    }

    // Create new time entry
    const timeEntry = await db.timeEntry.create({
      data: {
        featureId,
        userId,
        startTime: now,
        endTime: null,
        durationSeconds: null,
      },
    });

    // Create running timer record
    await db.runningTimer.create({
      data: {
        userId,
        featureId,
        timeEntryId: timeEntry.id,
        startedAt: now,
      },
    });

    // Update project's updatedAt
    await db.project.update({
      where: { id: feature.projectId },
      data: { updatedAt: now },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${feature.projectId}`);

    return {
      success: true,
      data: {
        isRunning: true,
        featureId: feature.id,
        featureName: feature.name,
        projectId: feature.projectId,
        projectName: feature.project.name,
        startTime: now,
        timeEntryId: timeEntry.id,
      },
    };
  } catch (error) {
    console.error("Start timer error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start timer",
    };
  }
}

/**
 * Stop the currently running timer for the user.
 */
export async function stopTimer(
  notes?: string
): Promise<ActionResult<{ durationSeconds: number }>> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    // Find the running timer
    const runningTimer = await db.runningTimer.findUnique({
      where: { userId },
      include: {
        feature: {
          include: { project: true },
        },
      },
    });

    if (!runningTimer) {
      // No timer running - this is not an error, just a no-op
      return { success: true, data: { durationSeconds: 0 } };
    }

    const now = new Date();

    // Find and complete the running time entry
    const runningEntry = await db.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    let durationSeconds = 0;

    if (runningEntry) {
      durationSeconds = Math.floor(
        (now.getTime() - new Date(runningEntry.startTime).getTime()) / 1000
      );

      await db.timeEntry.update({
        where: { id: runningEntry.id },
        data: {
          endTime: now,
          durationSeconds,
          notes: notes || null,
        },
      });
    }

    // Delete the running timer record
    await db.runningTimer.delete({
      where: { userId },
    });

    const projectId = runningTimer.feature.projectId;

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${projectId}`);

    return { success: true, data: { durationSeconds } };
  } catch (error) {
    console.error("Stop timer error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to stop timer",
    };
  }
}

/**
 * Get the current running timer state for the user.
 */
export async function getRunningTimer(): Promise<TimerState> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    const runningTimer = await db.runningTimer.findUnique({
      where: { userId },
      include: {
        feature: {
          include: { project: true },
        },
      },
    });

    if (!runningTimer) {
      return {
        isRunning: false,
        featureId: null,
        featureName: null,
        projectId: null,
        projectName: null,
        startTime: null,
        timeEntryId: null,
      };
    }

    // Get the actual time entry for accurate start time
    const timeEntry = await db.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    return {
      isRunning: true,
      featureId: runningTimer.featureId,
      featureName: runningTimer.feature.name,
      projectId: runningTimer.feature.projectId,
      projectName: runningTimer.feature.project.name,
      startTime: timeEntry?.startTime || runningTimer.startedAt,
      timeEntryId: runningTimer.timeEntryId,
    };
  } catch {
    // User not authenticated or other error - return no timer
    return {
      isRunning: false,
      featureId: null,
      featureName: null,
      projectId: null,
      projectName: null,
      startTime: null,
      timeEntryId: null,
    };
  }
}
