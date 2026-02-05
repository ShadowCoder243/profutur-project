import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  longtext
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "student", "center", "ambassador"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Formations (Courses) table
 */
export const formations = mysqlTable("formations", {
  id: int("id").autoincrement().primaryKey(),
  centerId: int("centerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  category: varchar("category", { length: 100 }),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner"),
  duration: int("duration"),
  price: decimal("price", { precision: 10, scale: 2 }),
  maxStudents: int("maxStudents"),
  currentStudents: int("currentStudents").default(0),
  image: text("image"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Enrollments - Student enrollments in formations
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  formationId: int("formationId").notNull(),
  status: mysqlEnum("status", ["pending", "active", "completed", "dropped"]).default("pending"),
  progress: int("progress").default(0),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  certificateIssued: boolean("certificateIssued").default(false),
});

/**
 * Donations - Track donations from donors
 */
export const donations = mysqlTable("donations", {
  id: int("id").autoincrement().primaryKey(),
  donorId: int("donorId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  transactionHash: varchar("transactionHash", { length: 255 }),
  donatedAt: timestamp("donatedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * NFT Badges - Gamification and recognition
 */
export const nftBadges = mysqlTable("nftBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeType: mysqlEnum("badgeType", ["bronze", "silver", "gold", "diamond", "legendary"]).notNull(),
  tokenId: varchar("tokenId", { length: 255 }).unique(),
  metadataUri: text("metadataUri"),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
});

/**
 * Certificates - Course completion certificates
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  certificateNumber: varchar("certificateNumber", { length: 255 }).unique().notNull(),
  issueDate: timestamp("issueDate").defaultNow().notNull(),
  expiryDate: timestamp("expiryDate"),
  verificationUrl: text("verificationUrl"),
});

/**
 * Center Profiles - Information about partner centers
 */
export const centerProfiles = mysqlTable("centerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  centerName: varchar("centerName", { length: 255 }).notNull(),
  description: longtext("description"),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 255 }),
  logo: text("logo"),
  totalStudents: int("totalStudents").default(0),
  totalFormations: int("totalFormations").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Student Profiles - Extended student information
 */
export const studentProfiles = mysqlTable("studentProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  specialization: varchar("specialization", { length: 255 }),
  bio: text("bio"),
  skills: text("skills"),
  completedFormations: int("completedFormations").default(0),
  totalHoursLearned: int("totalHoursLearned").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Ambassador Profiles - Ambassador information
 */
export const ambassadorProfiles = mysqlTable("ambassadorProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  networkSize: int("networkSize").default(0),
  totalCommissions: decimal("totalCommissions", { precision: 10, scale: 2 }).default("0"),
  referrals: int("referrals").default(0),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Transactions - All financial transactions
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  fromUserId: int("fromUserId"),
  toUserId: int("toUserId"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["donation", "payment", "commission", "refund"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  description: text("description"),
  blockchainHash: varchar("blockchainHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Formation = typeof formations.$inferSelect;
export type InsertFormation = typeof formations.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

export type NFTBadge = typeof nftBadges.$inferSelect;
export type InsertNFTBadge = typeof nftBadges.$inferInsert;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

export type CenterProfile = typeof centerProfiles.$inferSelect;
export type InsertCenterProfile = typeof centerProfiles.$inferInsert;

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;

export type AmbassadorProfile = typeof ambassadorProfiles.$inferSelect;
export type InsertAmbassadorProfile = typeof ambassadorProfiles.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;