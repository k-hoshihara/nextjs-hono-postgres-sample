import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const bookStatusEnum = pgEnum("book_status", [
  "want_to_read",
  "reading",
  "read",
  "paused",
]);

export const publishers = pgTable("publishers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isbn: text("isbn").unique(),
  publisherId: integer("publisher_id").references(() => publishers.id),
  publishedDate: date("published_date"),
  coverUrl: text("cover_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookAuthors = pgTable(
  "book_authors",
  {
    bookId: integer("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.bookId, t.authorId] })],
);

export const bookshelfEntries = pgTable(
  "bookshelf_entries",
  {
    id: serial("id").primaryKey(),
    bookId: integer("book_id")
      .notNull()
      .unique()
      .references(() => books.id, { onDelete: "cascade" }),
    status: bookStatusEnum("status").notNull(),
    rating: smallint("rating"),
    review: text("review"),
    startedAt: date("started_at"),
    finishedAt: date("finished_at"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check(
      "rating_range",
      sql`${t.rating} IS NULL OR (${t.rating} BETWEEN 1 AND 5)`,
    ),
  ],
);

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookshelfEntryTags = pgTable(
  "bookshelf_entry_tags",
  {
    bookshelfEntryId: integer("bookshelf_entry_id")
      .notNull()
      .references(() => bookshelfEntries.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.bookshelfEntryId, t.tagId] })],
);
