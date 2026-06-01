import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ErrorSchema, IdParamSchema, notImplemented } from "../common.ts";

export const TagSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 1 }),
    name: z.string().openapi({ example: "技術書" }),
    createdAt: z.string().datetime().openapi({ example: "2026-06-02T00:00:00Z" }),
  })
  .openapi("Tag");

export const CreateTagSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "技術書" }),
  })
  .openapi("CreateTag");

const routeTags = ["Tags"];

const list = createRoute({
  method: "get",
  path: "/",
  tags: routeTags,
  summary: "タグ一覧",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(TagSchema) } },
      description: "タグの一覧",
    },
  },
});

const create = createRoute({
  method: "post",
  path: "/",
  tags: routeTags,
  summary: "タグを登録",
  request: {
    body: { content: { "application/json": { schema: CreateTagSchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: TagSchema } },
      description: "作成されたタグ",
    },
    409: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "重複",
    },
  },
});

const remove = createRoute({
  method: "delete",
  path: "/{id}",
  tags: routeTags,
  summary: "タグを削除",
  request: { params: IdParamSchema },
  responses: {
    204: { description: "削除済み" },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "見つからない",
    },
  },
});

export const tagsRouter = new OpenAPIHono()
  .openapi(list, notImplemented)
  .openapi(create, notImplemented)
  .openapi(remove, notImplemented);
