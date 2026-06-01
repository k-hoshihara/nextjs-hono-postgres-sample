CREATE TYPE "public"."book_status" AS ENUM('want_to_read', 'reading', 'read', 'paused');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_authors" (
	"book_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	CONSTRAINT "book_authors_book_id_author_id_pk" PRIMARY KEY("book_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"isbn" text,
	"publisher_id" integer,
	"published_date" date,
	"cover_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
CREATE TABLE "bookshelf_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"status" "book_status" NOT NULL,
	"rating" smallint,
	"review" text,
	"started_at" date,
	"finished_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookshelf_entries_book_id_unique" UNIQUE("book_id"),
	CONSTRAINT "rating_range" CHECK ("bookshelf_entries"."rating" IS NULL OR ("bookshelf_entries"."rating" BETWEEN 1 AND 5))
);
--> statement-breakpoint
CREATE TABLE "bookshelf_entry_tags" (
	"bookshelf_entry_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "bookshelf_entry_tags_bookshelf_entry_id_tag_id_pk" PRIMARY KEY("bookshelf_entry_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "publishers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "publishers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."publishers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookshelf_entries" ADD CONSTRAINT "bookshelf_entries_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookshelf_entry_tags" ADD CONSTRAINT "bookshelf_entry_tags_bookshelf_entry_id_bookshelf_entries_id_fk" FOREIGN KEY ("bookshelf_entry_id") REFERENCES "public"."bookshelf_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookshelf_entry_tags" ADD CONSTRAINT "bookshelf_entry_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;