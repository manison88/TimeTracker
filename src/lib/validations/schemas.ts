import { z } from "zod";

// Auth schemas
export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  iconUrl: z.string().optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  iconUrl: z.string().optional().nullable(),
  archived: z.boolean().optional(),
});

export const endProjectSchema = z.object({
  status: z.enum(["completed", "on_break", "discontinued"]),
  endReason: z.string().max(500).optional(),
});

export const projectStatusEnum = z.enum(["active", "completed", "on_break", "discontinued"]);

// Feature schemas
export const createFeatureSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  name: z.string().min(1, "Feature name is required").max(100),
  description: z.string().max(500).optional(),
});

export const updateFeatureSchema = z.object({
  name: z.string().min(1, "Feature name is required").max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(["active", "completed", "paused"]).optional(),
});

// Timer schemas
export const startTimerSchema = z.object({
  featureId: z.string().min(1, "Feature ID is required"),
});

export const stopTimerSchema = z.object({
  notes: z.string().max(500).optional(),
});

// Types inferred from schemas
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type EndProjectInput = z.infer<typeof endProjectSchema>;
export type ProjectStatus = z.infer<typeof projectStatusEnum>;
export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>;
export type StartTimerInput = z.infer<typeof startTimerSchema>;
export type StopTimerInput = z.infer<typeof stopTimerSchema>;
