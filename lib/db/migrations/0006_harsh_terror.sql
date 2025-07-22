CREATE TABLE "explores" (
	"id" serial PRIMARY KEY NOT NULL,
	"runId" text NOT NULL,
	"modelName" text NOT NULL,
	"name" text NOT NULL,
	"isHidden" boolean DEFAULT false,
	"hasDescription" boolean DEFAULT false,
	"numJoins" integer DEFAULT 0,
	"numUnusedJoins" integer DEFAULT 0,
	"numFields" integer DEFAULT 0,
	"numUnusedFields" integer DEFAULT 0,
	"queryCount" integer DEFAULT 0,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "henry_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"runId" text NOT NULL,
	"organisationId" integer NOT NULL,
	"connectionId" integer NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"totalUnusedFields" integer DEFAULT 0,
	"totalUnusedExplores" integer DEFAULT 0,
	"projectsWithGitIssues" integer DEFAULT 0,
	"contentBloatScore" integer DEFAULT 0,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "henry_runs_runId_unique" UNIQUE("runId")
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"runId" text NOT NULL,
	"projectName" text NOT NULL,
	"name" text NOT NULL,
	"numExplores" integer DEFAULT 0,
	"numUnusedExplores" integer DEFAULT 0,
	"queryCount" integer DEFAULT 0,
	"unusedExploresList" text,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"runId" text NOT NULL,
	"name" text NOT NULL,
	"numModels" integer DEFAULT 0,
	"numViewFiles" integer DEFAULT 0,
	"gitConnectionStatus" text NOT NULL,
	"prMode" text NOT NULL,
	"isValidationRequired" boolean DEFAULT false,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unused_fields" (
	"id" serial PRIMARY KEY NOT NULL,
	"runId" text NOT NULL,
	"exploreId" integer NOT NULL,
	"fieldName" text NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unused_joins" (
	"id" serial PRIMARY KEY NOT NULL,
	"runId" text NOT NULL,
	"exploreId" integer NOT NULL,
	"joinName" text NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organisations" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "unique_identifier" TO "uniqueIdentifier";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "created_by" TO "createdBy";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "encrypted_credentials" TO "encryptedCredentials";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "organisation_id" TO "organisationId";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "connection_id" TO "connectionId";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "added_by" TO "addedBy";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "organisation_id" TO "organisationId";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "organisation_id" TO "organisationId";--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "expires_at" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "ip_address" TO "ipAddress";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "user_agent" TO "userAgent";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "account_id" TO "accountId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "provider_id" TO "providerId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "access_token" TO "accessToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "refresh_token" TO "refreshToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "id_token" TO "idToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "access_token_expires_at" TO "accessTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "refresh_token_expires_at" TO "refreshTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "verification" RENAME COLUMN "expires_at" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "verification" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "verification" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "connections" DROP CONSTRAINT "connections_unique_identifier_unique";--> statement-breakpoint
ALTER TABLE "connections" DROP CONSTRAINT "connections_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_connections" DROP CONSTRAINT "organisation_connections_organisation_id_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_connections" DROP CONSTRAINT "organisation_connections_connection_id_connections_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_connections" DROP CONSTRAINT "organisation_connections_added_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "join_requests" DROP CONSTRAINT "join_requests_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "join_requests" DROP CONSTRAINT "join_requests_organisation_id_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_organisation_id_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "createdAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "explores" ADD CONSTRAINT "explores_runId_henry_runs_runId_fk" FOREIGN KEY ("runId") REFERENCES "public"."henry_runs"("runId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "henry_runs" ADD CONSTRAINT "henry_runs_organisationId_organisations_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "henry_runs" ADD CONSTRAINT "henry_runs_connectionId_connections_id_fk" FOREIGN KEY ("connectionId") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_runId_henry_runs_runId_fk" FOREIGN KEY ("runId") REFERENCES "public"."henry_runs"("runId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_runId_henry_runs_runId_fk" FOREIGN KEY ("runId") REFERENCES "public"."henry_runs"("runId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_fields" ADD CONSTRAINT "unused_fields_runId_henry_runs_runId_fk" FOREIGN KEY ("runId") REFERENCES "public"."henry_runs"("runId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_fields" ADD CONSTRAINT "unused_fields_exploreId_explores_id_fk" FOREIGN KEY ("exploreId") REFERENCES "public"."explores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_joins" ADD CONSTRAINT "unused_joins_runId_henry_runs_runId_fk" FOREIGN KEY ("runId") REFERENCES "public"."henry_runs"("runId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_joins" ADD CONSTRAINT "unused_joins_exploreId_explores_id_fk" FOREIGN KEY ("exploreId") REFERENCES "public"."explores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_organisationId_organisations_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_connectionId_connections_id_fk" FOREIGN KEY ("connectionId") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_addedBy_user_id_fk" FOREIGN KEY ("addedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_organisationId_organisations_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organisationId_organisations_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "salt";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_uniqueIdentifier_unique" UNIQUE("uniqueIdentifier");