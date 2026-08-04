import { z } from "zod";
import { BCRYPT } from "./security.constants.js";

// Generation Schemas
export const generateBasicHashSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1, "Text is required."),

    costFactor: z
      .number()
      .int()
      .min(BCRYPT.MIN_COST_FACTOR)
      .max(BCRYPT.MAX_COST_FACTOR)
      .optional()
      .default(BCRYPT.DEFAULT_COST_FACTOR),
  }),
});

export const generateSaltHashSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1, "Text is required."),

    salt: z
      .string()
      .trim()
      .min(4, "Salt must be at least 4 characters.")
      .max(128, "Salt cannot exceed 128 characters."),

    costFactor: z
      .number()
      .int()
      .min(BCRYPT.MIN_COST_FACTOR)
      .max(BCRYPT.MAX_COST_FACTOR)
      .optional()
      .default(BCRYPT.DEFAULT_COST_FACTOR),
  }),
});

export const generateSaltPepperHashSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1, "Text is required."),

    salt: z
      .string()
      .trim()
      .min(4, "Salt must be at least 4 characters.")
      .max(128, "Salt cannot exceed 128 characters."),

    costFactor: z
      .number()
      .int()
      .min(BCRYPT.MIN_COST_FACTOR)
      .max(BCRYPT.MAX_COST_FACTOR)
      .optional()
      .default(BCRYPT.DEFAULT_COST_FACTOR),
  }),
});

// Verification Schemas
export const verifyBasicHashSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1, "Text is required."),

    hash: z.string().trim().min(1, "Hash is required."),
  }),
});

export const verifySaltHashSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1, "Text is required."),

    salt: z
      .string()
      .trim()
      .min(4, "Salt must be at least 4 characters.")
      .max(128, "Salt cannot exceed 128 characters."),

    hash: z.string().trim().min(1, "Hash is required."),
  }),
});

export const verifySaltPepperHashSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1, "Text is required."),

    salt: z
      .string()
      .trim()
      .min(4, "Salt must be at least 4 characters.")
      .max(128, "Salt cannot exceed 128 characters."),

    hash: z.string().trim().min(1, "Hash is required."),
  }),
});
