import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  ErrorSchema,
  IdParamSchema,
  notImplemented,
  TimestampsSchema,
} from "../common.ts";

export const AuthorSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 1 }),
    name: z.string().openapi({ example: "夏目漱石" }),
  })
  .merge(TimestampsSchema)
  .openapi("Author");

export const CreateAuthorSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "夏目漱石" }),
  })
  .openapi("CreateAuthor");

export const UpdateAuthorSchema = z
  .object({
    name: z.string().min(1).optional(),
  })
  .openapi("UpdateAuthor");

const tags = ["Authors"];

const list = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "著者一覧",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(AuthorSchema) } },
      description: "著者の一覧",
    },
  },
});

const create = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "著者を登録",
  request: {
    body: { content: { "application/json": { schema: CreateAuthorSchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: AuthorSchema } },
      description: "作成された著者",
    },
  },
});

const get = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "著者の詳細",
  request: { params: IdParamSchema },
  responses: {
    200: {
      content: { "application/json": { schema: AuthorSchema } },
      description: "著者",
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
  summary: "著者を更新",
  request: {
    params: IdParamSchema,
    body: { content: { "application/json": { schema: UpdateAuthorSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: AuthorSchema } },
      description: "更新後の著者",
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
  summary: "著者を削除",
  request: { params: IdParamSchema },
  responses: {
    204: { description: "削除済み" },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "見つからない",
    },
  },
});

export const authorsRouter = new OpenAPIHono()
  .openapi(list, notImplemented)
  .openapi(create, notImplemented)
  .openapi(get, notImplemented)
  .openapi(update, notImplemented)
  .openapi(remove, notImplemented);
