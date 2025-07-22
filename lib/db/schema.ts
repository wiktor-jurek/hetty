import { text, boolean, pgTable, timestamp, integer, serial, varchar } from "drizzle-orm/pg-core";

// Organisation Table
export const organisations = pgTable("organisations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Updated User Table - remove direct organisation relationship
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Memberships Table - Many-to-many relationship between users and organizations
export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organisationId: integer("organisation_id")
    .notNull()
    .references(() => organisations.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // "admin", "member"
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Join Requests Table - Track pending organization join requests
export const joinRequests = pgTable("join_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organisationId: integer("organisation_id")
    .notNull()
    .references(() => organisations.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // "pending", "approved", "denied"
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Connections Table - Updated to remove direct organization relationship
export const connections = pgTable('connections', {
  id: serial('id').primaryKey(),
  
  // Globally unique identifier - the Looker URL (e.g., "https://company.looker.com")
  uniqueIdentifier: text('unique_identifier').notNull().unique(),
  
  // Connection type (looker, salesforce, etc.)
  type: text('type').notNull().default('looker'),
  name: text('name').notNull(),
  
  // Who created this connection
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  
  // Connection-specific data (stored as encrypted JSON for flexibility)
  encryptedCredentials: text('encrypted_credentials').notNull(),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Junction table for many-to-many relationship between organizations and connections
export const organisationConnections = pgTable('organisation_connections', {
  id: serial('id').primaryKey(),
  organisationId: integer('organisation_id')
    .notNull()
    .references(() => organisations.id, { onDelete: 'cascade' }),
  connectionId: integer('connection_id')
    .notNull()
    .references(() => connections.id, { onDelete: 'cascade' }),
  // Track who added this connection to the organization
  addedBy: text('added_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});


  
  export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  });
  
  export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  });
  
  export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updatedAt").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
  });

  // Henry Analytics Tables

  // Runs - Track each time the Henry analysis was run
  export const runs = pgTable("runs", {
    runId: serial("run_id").primaryKey(),
    runTimestamp: timestamp("run_timestamp")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    status: text("status").notNull().default("completed"), // "completed", "processing", "failed"
  });

  // Projects - Stores data from analyze_projects.csv
  export const projects = pgTable("projects", {
    projectId: serial("project_id").primaryKey(),
    runId: integer("run_id")
      .notNull()
      .references(() => runs.runId, { onDelete: "cascade" }),
    projectName: text("project_name").notNull(),
    gitConnectionStatus: text("git_connection_status").notNull(),
    prMode: text("pr_mode").notNull(),
    isValidationRequired: boolean("is_validation_required").default(false),
  });

  // Models - Stores data from analyze_models.csv and vacuum_models.csv
  export const models = pgTable("models", {
    modelId: serial("model_id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.projectId, { onDelete: "cascade" }),
    modelName: text("model_name").notNull(),
    totalExplores: integer("total_explores").default(0),
    unusedExplores: integer("unused_explores").default(0),
    queryCount: integer("query_count").default(0),
  });

  // Explores - Stores data from analyze_explores.csv and vacuum_explores.csv
  export const explores = pgTable("explores", {
    exploreId: serial("explore_id").primaryKey(),
    modelId: integer("model_id")
      .notNull()
      .references(() => models.modelId, { onDelete: "cascade" }),
    exploreName: text("explore_name").notNull(),
    isHidden: boolean("is_hidden").default(false),
    hasDescription: boolean("has_description").default(false),
    totalJoins: integer("total_joins").default(0),
    unusedJoins: integer("unused_joins").default(0),
    totalFields: integer("total_fields").default(0),
    unusedFields: integer("unused_fields").default(0),
    queryCount: integer("query_count").default(0),
  });

  // Unused Joins - Detailed list for each explore
  export const unusedJoins = pgTable("unused_joins", {
    unusedJoinId: serial("unused_join_id").primaryKey(),
    exploreId: integer("explore_id")
      .notNull()
      .references(() => explores.exploreId, { onDelete: "cascade" }),
    joinName: text("join_name").notNull(),
  });

  // Unused Fields - Detailed list for each explore
  export const unusedFields = pgTable("unused_fields", {
    unusedFieldId: serial("unused_field_id").primaryKey(),
    exploreId: integer("explore_id")
      .notNull()
      .references(() => explores.exploreId, { onDelete: "cascade" }),
    fieldName: text("field_name").notNull(),
  });
  