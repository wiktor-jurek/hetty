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
  