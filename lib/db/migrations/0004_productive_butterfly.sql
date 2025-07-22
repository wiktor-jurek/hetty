CREATE TABLE "organisation_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"organisation_id" integer NOT NULL,
	"connection_id" integer NOT NULL,
	"added_by" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "connections" DROP CONSTRAINT "connections_organisation_id_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_connection_id_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" DROP COLUMN "organisation_id";