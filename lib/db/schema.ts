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
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
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

// Connections Table - Updated with URL as unique identifier
export const connections = pgTable('connections', {
  id: serial('id').primaryKey(),
  organisationId: integer('organisation_id')
    .notNull()
    .references(() => organisations.id, { onDelete: 'cascade' }),
  
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

// Keep the existing lookerConnections for backward compatibility
export const lookerConnections = pgTable('looker_connections', {
  id: serial('id').primaryKey(),
  organisationId: integer('organisation_id')
    .notNull()
    .unique()
    .references(() => organisations.id, { onDelete: 'cascade' }),
  
  lookerUrl: text('looker_url').notNull(),
  lookerPort: integer('looker_port'),
  lookerClientId: varchar('looker_client_id', { length: 256 }).notNull(),
  encryptedLookerSecret: text('encrypted_looker_secret').notNull(),
});
  
  export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  });
  
  export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  });
  
  export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
      () => /* @__PURE__ */ new Date(),
    ),
  });
  