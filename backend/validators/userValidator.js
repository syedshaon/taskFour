import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password cannot be empty"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password cannot be empty"),
});

// Validate user ID (assumes UUID format)
export const userIdsSchema = z.object({
  ids: z.array(
    z.preprocess((val) => {
      if (typeof val === "string" && !isNaN(Number(val))) {
        return Number(val);
      }
      return val;
    }, z.number().int().positive())
  ),
});

// Validate status update request
export const userStatusSchema = z.object({
  status: z.enum(["active", "blocked", "deleted"], {
    message: "Status must be 'active', 'blocked' or 'deleted'",
  }),
});
