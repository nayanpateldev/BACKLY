import { z } from "zod";

export const generateUrlQrSchema = z.object({
  body: z.object({
    url: z.string().url("Please provide a valid URL."),
  }),
});

export const generateUpiQrSchema = z.object({
  body: z.object({
    upiId: z.string().min(3),

    name: z.string().min(2).max(80),

    amount: z
      .number()
      .positive()
      .optional(),

    note: z
      .string()
      .max(100)
      .optional(),
  }),
});