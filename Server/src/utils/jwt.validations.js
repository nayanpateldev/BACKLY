import { z } from "zod";

export const jwtSecretSchema = z.object({
  body: z.object({
    bits: z
      .number()
      .refine((value) => [128, 192, 256, 384, 512].includes(value), {
        message: "Bits must be one of: 128, 192, 256, 384, 512.",
      })
      .optional(),
  }),
});

export const jwtDecodeSchema = z.object({
  body: z.object({
    token: z
      .string({
        required_error: "JWT token is required.",
      })
      .min(1, "JWT token is required."),
  }),
});

export const jwtEncodeSchema = z.object({
  body: z
    .object({
      payload: z.record(z.any()),

      algorithm: z.enum([
        "HS256",
        "HS384",
        "HS512",
        "RS256",
        "RS384",
        "RS512",
        "ES256",
        "ES384",
        "ES512",
        "PS256",
        "PS384",
        "PS512",
      ]),

      secret: z.string().optional(),

      privateKey: z.string().optional(),

      expiresIn: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.algorithm.startsWith("HS")) {
        if (!data.secret) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["secret"],
            message: "Secret is required for HMAC algorithms.",
          });
        }
      } else {
        if (!data.privateKey) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["privateKey"],
            message: "Private key is required for this algorithm.",
          });
        }
      }
    }),
});
