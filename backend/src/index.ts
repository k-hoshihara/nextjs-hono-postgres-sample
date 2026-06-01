import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { authorsRouter } from "./openapi/routes/authors.ts";
import { booksRouter } from "./openapi/routes/books.ts";
import { bookshelfRouter } from "./openapi/routes/bookshelf.ts";
import { publishersRouter } from "./openapi/routes/publishers.ts";
import { tagsRouter } from "./openapi/routes/tags.ts";

const app = new OpenAPIHono();

app.route("/api/publishers", publishersRouter);
app.route("/api/authors", authorsRouter);
app.route("/api/books", booksRouter);
app.route("/api/tags", tagsRouter);
app.route("/api/bookshelf", bookshelfRouter);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "0.1.0",
    title: "Yomilog API",
    description: "ブクログ風 読書記録アプリの API",
  },
});

app.get("/ui", swaggerUI({ url: "/doc" }));

const port = Number(process.env.PORT ?? 8080);
serve({ fetch: app.fetch, port }, ({ port }) => {
  console.log(`Yomilog API listening on http://localhost:${port}`);
  console.log(`Swagger UI:  http://localhost:${port}/ui`);
});
