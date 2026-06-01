import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  ErrorSchema,
  IdParamSchema,
  notImplemented,
  TimestampsSchema,
} from "../common.ts";
import { AuthorSchema } from "./authors.ts";
import { PublisherSchema } from "./publishers.ts";

export const BookSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 1 }),
    title: z.string().openapi({ example: "吾輩は猫である" }),
    isbn: z.string().nullable().openapi({ example: "9784101010014" }),
    publisher: PublisherSchema.nullable(),
    authors: z.array(AuthorSchema),
    publishedDate: z.string().date().nullable().openapi({ example: "1905-10-06" }),
    coverUrl: z.string().url().nullable().openapi({ example: "https://example.com/cover.jpg" }),
  })
  .merge(TimestampsSchema)
  .openapi("Book");

export const CreateBookSchema = z
  .object({
    title: z.string().min(1).openapi({ example: "吾輩は猫である" }),
    isbn: z.string().optional().openapi({ example: "9784101010014" }),
    publisherId: z.number().int().positive().optional(),
    authorIds: z.array(z.number().int().positive()).default([]),
    publishedDate: z.string().date().optional(),
    coverUrl: z.string().url().optional(),
  })
  .openapi("CreateBook");

export const UpdateBookSchema = z
  .object({
    title: z.string().min(1).optional(),
    isbn: z.string().nullable().optional(),
    publisherId: z.number().int().positive().nullable().optional(),
    authorIds: z.array(z.number().int().positive()).optional(),
    publishedDate: z.string().date().nullable().optional(),
    coverUrl: z.string().url().nullable().optional(),
  })
  .openapi("UpdateBook");

const BookListQuerySchema = z.object({
  q: z
    .string()
    .optional()
    .openapi({ param: { name: "q", in: "query" }, example: "猫" }),
  authorId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .openapi({ param: { name: "authorId", in: "query" } }),
  publisherId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .openapi({ param: { name: "publisherId", in: "query" } }),
});

const tags = ["Books"];

const list = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "本一覧",
  request: { query: BookListQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: z.array(BookSchema) } },
      description: "本の一覧",
    },
  },
});

const create = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "本を登録",
  request: {
    body: { content: { "application/json": { schema: CreateBookSchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: BookSchema } },
      description: "作成された本",
    },
    409: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "ISBN重複など",
    },
  },
});

const get = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "本の詳細",
  request: { params: IdParamSchema },
  responses: {
    200: {
      content: { "application/json": { schema: BookSchema } },
      description: "本",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "見つからない",
    },
  },
});

const update = createRoute({
  method: "patch",
  path: "/{id}",
  tags,
  summary: "本を更新",
  request: {
    params: IdParamSchema,
    body: { content: { "application/json": { schema: UpdateBookSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: BookSchema } },
      description: "更新後の本",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "見つからない",
    },
  },
});

const remove = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "本を削除",
  request: { params: IdParamSchema },
  responses: {
    204: { description: "削除済み" },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "見つからない",
    },
  },
});

export const booksRouter = new OpenAPIHono()
  .openapi(list, notImplemented)
  .openapi(create, notImplemented)
  .openapi(get, notImplemented)
  .openapi(update, notImplemented)
  .openapi(remove, notImplemented);
