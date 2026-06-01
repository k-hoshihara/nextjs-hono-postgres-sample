import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  ErrorSchema,
  IdParamSchema,
  notImplemented,
  TimestampsSchema,
} from "../common.ts";

export const PublisherSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 1 }),
    name: z.string().openapi({ example: "オライリー・ジャパン" }),
  })
  .merge(TimestampsSchema)
  .openapi("Publisher");

export const CreatePublisherSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "オライリー・ジャパン" }),
  })
  .openapi("CreatePublisher");

export const UpdatePublisherSchema = z
  .object({
    name: z.string().min(1).optional(),
  })
  .openapi("UpdatePublisher");

const tags = ["Publishers"];

const list = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "出版社一覧",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(PublisherSchema) } },
      description: "出版社の一覧",
    },
  },
});

const create = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "出版社を登録",
  request: {
    body: {
      content: { "application/json": { schema: CreatePublisherSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: PublisherSchema } },
      description: "作成された出版社",
    },
    409: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "重複",
    },
  },
});

const get = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "出版社の詳細",
  request: { params: IdParamSchema },
  responses: {
    200: {
      content: { "application/json": { schema: PublisherSchema } },
      description: "出版社",
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
  summary: "出版社を更新",
  request: {
    params: IdParamSchema,
    body: {
      content: { "application/json": { schema: UpdatePublisherSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: PublisherSchema } },
      description: "更新後の出版社",
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
  summary: "出版社を削除",
  request: { params: IdParamSchema },
  responses: {
    204: { description: "削除済み" },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "見つからない",
    },
  },
});

export const publishersRouter = new OpenAPIHono()
  .openapi(list, notImplemented)
  .openapi(create, notImplemented)
  .openapi(get, notImplemented)
  .openapi(update, notImplemented)
  .openapi(remove, notImplemented);
