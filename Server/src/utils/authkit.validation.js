import { z } from "zod";

export const generatePasswordSchema = z.object({
  body: z
    .object({
      length: z
        .number()
        .int("Length must be an integer.")
        .min(4, "Minimum password length is 4.")
        .max(128, "Maximum password length is 128."),

      uppercase: z.boolean().default(true),

      lowercase: z.boolean().default(true),

      numbers: z.boolean().default(true),

      symbols: z.boolean().default(true),
    })
    .refine(
      (data) =>
        data.uppercase ||
        data.lowercase ||
        data.numbers ||
        data.symbols,
      {
        message: "Select at least one character type.",
      }
    ),
});


export const passwordStrengthSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(1, "Password is required.")
      .max(256, "Password is too long."),
  }),
});