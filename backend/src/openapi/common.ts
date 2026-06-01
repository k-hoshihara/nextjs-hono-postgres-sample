import { z } from "@hono/zod-openapi";

export const IdParamSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .openapi({
      param: { name: "id", in: "path" },
      example: 1,
    }),
});

export const ErrorSchema = z
  .object({
    message: z.string().openapi({ example: "Not Found" }),
  })
  .openapi("Error");

export const PaginationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .openapi({ param: { name: "limit", in: "query" }, example: 20 }),
  offset: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .openapi({ param: { name: "offset", in: "query" }, example: 0 }),
});

export const TimestampsSchema = z.object({
  createdAt: z.string().datetime().openapi({ example: "2026-06-02T00:00:00Z" }),
  updatedAt: z.string().datetime().openapi({ example: "2026-06-02T00:00:00Z" }),
});

export const notImplemented = (): never => {
  throw new Error("Not implemented");
};
