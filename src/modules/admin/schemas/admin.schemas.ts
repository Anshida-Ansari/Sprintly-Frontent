import { z } from "zod";

// Create Project Schema
export const createProjectSchema = z
    .object({
        name: z
            .string()
            .min(1, "Project name is required")
            .min(3, "Project name must be at least 3 characters")
            .max(100, "Project name cannot exceed 100 characters"),
        description: z
            .string()
            .min(1, "Description is required")
            .min(10, "Description must be at least 10 characters")
            .max(1000, "Description cannot exceed 1000 characters"),
        startDate: z
            .string()
            .min(1, "Start date is required"),
        endDate: z
            .string()
            .min(1, "End date is required"),
        gitRepoUrl: z
            .string()
            .url("Please enter a valid URL")
            .optional()
            .or(z.literal("")),
        leadId: z.string().optional(),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export const sprintSchema = z
    .object({
        name: z
            .string()
            .min(1, "Sprint name is required")
            .min(3, "Sprint name must be at least 3 characters")
            .max(100, "Sprint name cannot exceed 100 characters"),
        goal: z
            .string()
            .max(500, "Goal cannot exceed 500 characters")
            .optional()
            .or(z.literal("")),
        startDate: z
            .string()
            .min(1, "Start date is required"),
        endDate: z
            .string()
            .min(1, "End date is required"),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export type SprintFormData = z.infer<typeof sprintSchema>;

export const userStorySchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),
    description: z
        .string()
        .min(1, "Description is required")
        .min(5, "Description must be at least 5 characters")
        .max(500, "Description cannot exceed 500 characters"),
    priority: z.enum(["High", "Medium", "Low"]),
    status: z.enum(["In pending", "In progress", "In review", "Done"]),
    estimationPoints: z.coerce
        .number()
        .min(0, "Estimation points must be a positive number"),
    acceptanceCriteria: z.array(z.string()).optional(),
    acceptanceCriteriaText: z.string().optional(),
});

export type UserStoryFormData = z.infer<typeof userStorySchema>;
