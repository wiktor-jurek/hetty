ALTER TABLE "connections" RENAME COLUMN "uniqueIdentifier" TO "unique_identifier";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "encryptedCredentials" TO "encrypted_credentials";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "runId" TO "run_id";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "modelName" TO "model_name";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "isHidden" TO "is_hidden";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "hasDescription" TO "has_description";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "numJoins" TO "num_joins";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "numUnusedJoins" TO "num_unused_joins";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "numFields" TO "num_fields";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "numUnusedFields" TO "num_unused_fields";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "queryCount" TO "query_count";--> statement-breakpoint
ALTER TABLE "explores" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "runId" TO "run_id";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "organisationId" TO "organisation_id";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "connectionId" TO "connection_id";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "totalUnusedFields" TO "total_unused_fields";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "totalUnusedExplores" TO "total_unused_explores";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "projectsWithGitIssues" TO "projects_with_git_issues";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "contentBloatScore" TO "content_bloat_score";--> statement-breakpoint
ALTER TABLE "henry_runs" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "organisationId" TO "organisation_id";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "join_requests" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "organisationId" TO "organisation_id";--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "models" RENAME COLUMN "runId" TO "run_id";--> statement-breakpoint
ALTER TABLE "models" RENAME COLUMN "projectName" TO "project_name";--> statement-breakpoint
ALTER TABLE "models" RENAME COLUMN "numExplores" TO "num_explores";--> statement-breakpoint
ALTER TABLE "models" RENAME COLUMN "numUnusedExplores" TO "num_unused_explores";--> statement-breakpoint
ALTER TABLE "models" RENAME COLUMN "queryCount" TO "query_count";--> statement-breakpoint
ALTER TABLE "models" RENAME COLUMN "unusedExploresList" TO "unused_explores_list";--> statement-breakpoint
ALTER TABLE "models" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "organisationId" TO "organisation_id";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "connectionId" TO "connection_id";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "addedBy" TO "added_by";--> statement-breakpoint
ALTER TABLE "organisation_connections" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "organisations" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "runId" TO "run_id";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "numModels" TO "num_models";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "numViewFiles" TO "num_view_files";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "gitConnectionStatus" TO "git_connection_status";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "prMode" TO "pr_mode";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "isValidationRequired" TO "is_validation_required";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "unused_fields" RENAME COLUMN "runId" TO "run_id";--> statement-breakpoint
ALTER TABLE "unused_fields" RENAME COLUMN "exploreId" TO "explore_id";--> statement-breakpoint
ALTER TABLE "unused_fields" RENAME COLUMN "fieldName" TO "field_name";--> statement-breakpoint
ALTER TABLE "unused_fields" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "unused_joins" RENAME COLUMN "runId" TO "run_id";--> statement-breakpoint
ALTER TABLE "unused_joins" RENAME COLUMN "exploreId" TO "explore_id";--> statement-breakpoint
ALTER TABLE "unused_joins" RENAME COLUMN "joinName" TO "join_name";--> statement-breakpoint
ALTER TABLE "unused_joins" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "connections" DROP CONSTRAINT "connections_uniqueIdentifier_unique";--> statement-breakpoint
ALTER TABLE "henry_runs" DROP CONSTRAINT "henry_runs_runId_unique";--> statement-breakpoint
ALTER TABLE "connections" DROP CONSTRAINT "connections_createdBy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "explores" DROP CONSTRAINT "explores_runId_henry_runs_runId_fk";
--> statement-breakpoint
ALTER TABLE "henry_runs" DROP CONSTRAINT "henry_runs_organisationId_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "henry_runs" DROP CONSTRAINT "henry_runs_connectionId_connections_id_fk";
--> statement-breakpoint
ALTER TABLE "join_requests" DROP CONSTRAINT "join_requests_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "join_requests" DROP CONSTRAINT "join_requests_organisationId_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_organisationId_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "models" DROP CONSTRAINT "models_runId_henry_runs_runId_fk";
--> statement-breakpoint
ALTER TABLE "organisation_connections" DROP CONSTRAINT "organisation_connections_organisationId_organisations_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_connections" DROP CONSTRAINT "organisation_connections_connectionId_connections_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_connections" DROP CONSTRAINT "organisation_connections_addedBy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_runId_henry_runs_runId_fk";
--> statement-breakpoint
ALTER TABLE "unused_fields" DROP CONSTRAINT "unused_fields_runId_henry_runs_runId_fk";
--> statement-breakpoint
ALTER TABLE "unused_fields" DROP CONSTRAINT "unused_fields_exploreId_explores_id_fk";
--> statement-breakpoint
ALTER TABLE "unused_joins" DROP CONSTRAINT "unused_joins_runId_henry_runs_runId_fk";
--> statement-breakpoint
ALTER TABLE "unused_joins" DROP CONSTRAINT "unused_joins_exploreId_explores_id_fk";
--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "explores" ADD CONSTRAINT "explores_run_id_henry_runs_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."henry_runs"("run_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "henry_runs" ADD CONSTRAINT "henry_runs_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "henry_runs" ADD CONSTRAINT "henry_runs_connection_id_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_run_id_henry_runs_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."henry_runs"("run_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_connection_id_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_connections" ADD CONSTRAINT "organisation_connections_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_run_id_henry_runs_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."henry_runs"("run_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_fields" ADD CONSTRAINT "unused_fields_run_id_henry_runs_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."henry_runs"("run_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_fields" ADD CONSTRAINT "unused_fields_explore_id_explores_id_fk" FOREIGN KEY ("explore_id") REFERENCES "public"."explores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_joins" ADD CONSTRAINT "unused_joins_run_id_henry_runs_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."henry_runs"("run_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unused_joins" ADD CONSTRAINT "unused_joins_explore_id_explores_id_fk" FOREIGN KEY ("explore_id") REFERENCES "public"."explores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_unique_identifier_unique" UNIQUE("unique_identifier");--> statement-breakpoint
ALTER TABLE "henry_runs" ADD CONSTRAINT "henry_runs_run_id_unique" UNIQUE("run_id");