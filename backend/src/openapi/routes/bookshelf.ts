import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  ErrorSchema,
  IdParamSchema,
  notImplemented,
  TimestampsSchema,
} from "../common.ts";
import { BookSchema } from "./books.ts";
import { TagSchema } from "./tags.ts";

export const BookStatusSchema = z
  .enum(["want_to_read", "reading", "read", "paused"])
  .openapi("BookStatus");

export const BookshelfEntrySchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 1 }),
    book: BookSchema,
    status: BookStatusSchema,
    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .nullable()
      .openapi({ example: 5 }),
    review: z.string().nullable().openapi({ example: "面白かった" }),
    startedAt: z.string().date().nullable().openapi({ example: "2026-05-01" }),
    finishedAt: z.string().date().nullable().openapi({ example: "2026-05-20" }),
    tags: z.array(TagSchema),
  })
  .merge(TimestampsSchema)
  .openapi("BookshelfEntry");

export const CreateBookshelfEntrySchema = z
  .object({
    bookId: z.number().int().positive(),
    status: BookStatusSchema,
    rating: z.number().int().min(1).max(5).optional(),
    review: z.string().optional(),
    startedAt: z.string().date().optional(),
    finishedAt: z.string().date().optional(),
    tagIds: z.array(z.number().int().positive()).default([]),
  })
  .openapi("CreateBookshelfEntry");

export const UpdateBookshelfEntrySchema = z
  .object({
    status: BookStatusSchema.optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
    review: z.string().nullable().optional(),
    startedAt: z.string().date().nullable().optional(),
    finishedAt: z.string().date().nullable().optional(),
  })
  .openapi("UpdateBookshelfEntry");

const ListQuerySchema = z.object({
  status: BookStatusSchema.optional().openapi({
    param: { name: "status", in: "query" },
  }),
  tagId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .openapi({ param: { name: "tagId", in: "query" } }),
});

const TagIdParamSchema = z.object({
  id: z.coerce.number().int().positive().openapi({
    param: { name: "id", in: "path" },
    example: 1,
  }),
  tagId: z.coerce.number().int().positive().openapi({
    param: { name: "tagId", in: "path" },
    example: 1,
  }),
});

const AttachTagBodySchema = z
  .object({
    tagId: z.number().int().positive(),
  })
  .openapi("AttachTag");

const routeTags = ["Bookshelf"];

const list = createRoute({
  method: "get",
  path: "/",
  tags: routeTags,
  summary: "本棚エントリ一覧",
  request: { query: ListQuerySchema },
  responses: {
    200: {
      content: {
        "application/json": { schema: z.array(BookshelfEntrySchema) },
      },
      description: "本棚エントリの一覧",
    },
  },
});

const create = createRoute({
  method: "post",
  path: "/",
  tags: routeTags,
  summary: "本棚に本を追加",
  request: {
    body: {
      content: { "application/json": { schema: CreateBookshelfEntrySchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: BookshelfEntrySchema } },
      description: "作成された本棚エントリ",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "本が見つからない",
    },
    409: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "既に本棚にある",
    },
  },
});

const get = createRoute({
  method: "get",
  path: "/{id}",
  tags: routeTags,
  summary: "本棚エントリの詳細",
  request: { params: IdParamSchema },
  responses: {
    200: {
      content: { "application/json": { schema: BookshelfEntrySchema } },
      description: "本棚エントリ",
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
  tags: routeTags,
  summary: "本棚エントリを更新",
  request: {
    params: IdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateBookshelfEntrySchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: BookshelfEntrySchema } },
      description: "更新後の本棚エントリ",
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
  tags: routeTags,
  summary: "本棚から削除",
  request: { params: IdParamSchema },
  responses: {
    204: { description: "削除済み" },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "見つからない",
    },
  },
});

const attachTag = createRoute({
  method: "post",
  path: "/{id}/tags",
  tags: routeTags,
  summary: "本棚エントリにタグを付与",
  request: {
    params: IdParamSchema,
    body: {
      content: { "application/json": { schema: AttachTagBodySchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: BookshelfEntrySchema } },
      description: "タグ付与後の本棚エントリ",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "エントリ or タグが見つからない",
    },
  },
});

const detachTag = createRoute({
  method: "delete",
  path: "/{id}/tags/{tagId}",
  tags: routeTags,
  summary: "本棚エントリからタグを外す",
  request: { params: TagIdParamSchema },
  responses: {
    204: { description: "削除済み" },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "関連が存在しない",
    },
  },
});

export const bookshelfRouter = new OpenAPIHono()
  .openapi(list, notImplemented)
  .openapi(create, notImplemented)
  .openapi(get, notImplemented)
  .openapi(update, notImplemented)
  .openapi(remove, notImplemented)
  .openapi(attachTag, notImplemented)
  .openapi(detachTag, notImplemented);
