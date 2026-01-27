"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import {
  createFeatureSchema,
  updateFeatureSchema,
  type CreateFeatureInput,
  type UpdateFeatureInput,
} from "@/lib/validations/schemas";
import type { ActionResult, FeatureSummary } from "@/types";

export async function createFeature(
  input: CreateFeatureInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();
    const validated = createFeatureSchema.parse(input);
    const db = getDb();

    // Verify project ownership
    const project = await db.project.findFirst({
      where: { id: validated.projectId, userId },
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const feature = await db.feature.create({
      data: {
        projectId: validated.projectId,
        name: validated.name,
        description: validated.description || null,
      },
    });

    revalidatePath(`/projects/${validated.projectId}`);
    return { success: true, data: { id: feature.id } };
  } catch (error) {
    console.error("Create feature error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create feature",
    };
  }
}

export async function updateFeature(
  featureId: string,
  input: UpdateFeatureInput
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const validated = updateFeatureSchema.parse(input);
    const db = getDb();

    // Verify ownership through project
    const existing = await db.feature.findFirst({
      where: { id: featureId },
      include: { project: true },
    });

    if (!existing || existing.project.userId !== userId) {
      return { success: false, error: "Feature not found" };
    }

    await db.feature.update({
      where: { id: featureId },
      data: validated,
    });

    revalidatePath(`/projects/${existing.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Update feature error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update feature",
    };
  }
}

export async function deleteFeature(featureId: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    // Verify ownership through project
    const existing = await db.feature.findFirst({
      where: { id: featureId },
      include: { project: true },
    });

    if (!existing || existing.project.userId !== userId) {
      return { success: false, error: "Feature not found" };
    }

    const projectId = existing.projectId;

    // Delete will cascade to time entries and running timer
    await db.feature.delete({
      where: { id: featureId },
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete feature error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete feature",
    };
  }
}

export async function getFeaturesByProject(
  projectId: string
): Promise<FeatureSummary[]> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    // Verify project ownership
    const project = await db.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return [];
    }

    const features = await db.feature.findMany({
      where: { projectId },
      include: {
        timeEntries: {
          orderBy: { startTime: "desc" },
        },
        runningTimer: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return features.map((feature) => {
      let totalSeconds = 0;
      let isRunning = false;
      let runningStartTime: Date | null = null;
      let lastWorked: Date | null = null;

      for (const entry of feature.timeEntries) {
        if (entry.durationSeconds !== null) {
          totalSeconds += entry.durationSeconds;
        } else if (entry.endTime === null) {
          // Running entry - don't add elapsed time to totalSeconds
          // The client will calculate and display it
          isRunning = true;
          runningStartTime = entry.startTime;
        }

        // Track last worked (most recent end time or start time)
        const entryTime = entry.endTime || entry.startTime;
        if (!lastWorked || entryTime > lastWorked) {
          lastWorked = entryTime;
        }
      }

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
  } catch (error) {
    console.error("Get features error:", error);
    return [];
  }
}
