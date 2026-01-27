"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import {
  createProjectSchema,
  updateProjectSchema,
  endProjectSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
  type EndProjectInput,
} from "@/lib/validations/schemas";
import type { ActionResult, ProjectSummary } from "@/types";

export async function createProject(
  input: CreateProjectInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();
    const validated = createProjectSchema.parse(input);
    const db = getDb();

    const project = await db.project.create({
      data: {
        userId,
        name: validated.name,
        description: validated.description || null,
        iconUrl: validated.iconUrl || null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { id: project.id } };
  } catch (error) {
    console.error("Create project error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const validated = updateProjectSchema.parse(input);
    const db = getDb();

    // Verify ownership
    const existing = await db.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    await db.project.update({
      where: { id: projectId },
      data: validated,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Update project error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    // Verify ownership
    const existing = await db.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    // Delete will cascade to features, time entries, and running timers
    await db.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export async function getProjects(): Promise<ProjectSummary[]> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    const projects = await db.project.findMany({
      where: { userId, archived: false },
      include: {
        features: {
          include: {
            timeEntries: true,
            runningTimer: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return projects.map((project) => {
      let totalSeconds = 0;
      let hasRunningTimer = false;

      for (const feature of project.features) {
        for (const entry of feature.timeEntries) {
          if (entry.durationSeconds !== null) {
            totalSeconds += entry.durationSeconds;
          } else if (entry.endTime === null) {
            // Running entry
            const elapsed = Math.floor(
              (Date.now() - new Date(entry.startTime).getTime()) / 1000
            );
            totalSeconds += elapsed;
            hasRunningTimer = true;
          }
        }
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        iconUrl: project.iconUrl,
        status: project.status as "active" | "completed" | "on_break" | "discontinued",
        endReason: project.endReason,
        endedAt: project.endedAt,
        archived: project.archived,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        featureCount: project.features.length,
        totalSeconds,
        hasRunningTimer,
      };
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return [];
  }
}

export async function getProject(projectId: string) {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    const project = await db.project.findFirst({
      where: { id: projectId, userId },
      include: {
        features: {
          include: {
            timeEntries: {
              orderBy: { startTime: "desc" },
            },
            runningTimer: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return project;
  } catch (error) {
    console.error("Get project error:", error);
    return null;
  }
}

export async function archiveProject(projectId: string): Promise<ActionResult> {
  return updateProject(projectId, { archived: true });
}

export async function unarchiveProject(projectId: string): Promise<ActionResult> {
  return updateProject(projectId, { archived: false });
}

export async function getArchivedProjects(): Promise<ProjectSummary[]> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    const projects = await db.project.findMany({
      where: { userId, archived: true },
      include: {
        features: {
          include: {
            timeEntries: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return projects.map((project) => {
      let totalSeconds = 0;

      for (const feature of project.features) {
        for (const entry of feature.timeEntries) {
          if (entry.durationSeconds !== null) {
            totalSeconds += entry.durationSeconds;
          }
        }
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        iconUrl: project.iconUrl,
        status: project.status as "active" | "completed" | "on_break" | "discontinued",
        endReason: project.endReason,
        endedAt: project.endedAt,
        archived: project.archived,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        featureCount: project.features.length,
        totalSeconds,
        hasRunningTimer: false,
      };
    });
  } catch (error) {
    console.error("Get archived projects error:", error);
    return [];
  }
}

export async function endProject(
  projectId: string,
  input: EndProjectInput
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const validated = endProjectSchema.parse(input);
    const db = getDb();

    // Verify ownership
    const existing = await db.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    await db.project.update({
      where: { id: projectId },
      data: {
        status: validated.status,
        endReason: validated.endReason || null,
        endedAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("End project error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to end project",
    };
  }
}

export async function resumeProject(projectId: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const db = getDb();

    // Verify ownership
    const existing = await db.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    await db.project.update({
      where: { id: projectId },
      data: {
        status: "active",
        endReason: null,
        endedAt: null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Resume project error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resume project",
    };
  }
}
