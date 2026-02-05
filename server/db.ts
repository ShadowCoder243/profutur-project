import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  formations,
  enrollments,
  centerProfiles,
  studentProfiles,
  ambassadorProfiles,
  donations,
  certificates,
  nftBadges,
  transactions
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Formation queries
export async function getFormations(centerId?: number) {
  const db = await getDb();
  if (!db) return [];

  if (centerId) {
    return db.select().from(formations).where(eq(formations.centerId, centerId));
  }
  return db.select().from(formations);
}

export async function getFormationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(formations).where(eq(formations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Enrollment queries
export async function getStudentEnrollments(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
}

export async function getFormationEnrollments(formationId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(enrollments).where(eq(enrollments.formationId, formationId));
}

// Center Profile queries
export async function getCenterProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(centerProfiles).where(eq(centerProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Student Profile queries
export async function getStudentProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Ambassador Profile queries
export async function getAmbassadorProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(ambassadorProfiles).where(eq(ambassadorProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Donation queries
export async function getDonations(donorId?: number) {
  const db = await getDb();
  if (!db) return [];

  if (donorId) {
    return db.select().from(donations).where(eq(donations.donorId, donorId));
  }
  return db.select().from(donations);
}

// Certificate queries
export async function getCertificateByEnrollment(enrollmentId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(certificates).where(eq(certificates.enrollmentId, enrollmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Transaction queries
export async function getTransactions(userId?: number) {
  const db = await getDb();
  if (!db) return [];

  if (userId) {
    return db.select().from(transactions).where(
      userId ? eq(transactions.fromUserId, userId) : undefined
    );
  }
  return db.select().from(transactions);
}

// NFT Badge queries
export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(nftBadges).where(eq(nftBadges.userId, userId));
}
