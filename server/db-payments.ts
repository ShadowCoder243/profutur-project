import { eq } from 'drizzle-orm';
import {
  mobileMoneyTransactions,
  blockchainRecords,
  transactions,
  certificates,
  donations,
  InsertMobileMoneyTransaction,
  InsertBlockchainRecord,
  InsertTransaction,
  InsertCertificate,
} from '../drizzle/schema';
import { getDb } from './db';

/**
 * Mobile Money Transaction Helpers
 */
export async function createMobileMoneyTransaction(
  data: InsertMobileMoneyTransaction
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(mobileMoneyTransactions).values(data);
    const result = await db
      .select()
      .from(mobileMoneyTransactions)
      .where(eq(mobileMoneyTransactions.transactionId, data.transactionId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to create mobile money transaction:', error);
    return null;
  }
}

export async function getMobileMoneyTransaction(transactionId: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(mobileMoneyTransactions)
      .where(eq(mobileMoneyTransactions.transactionId, transactionId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to get mobile money transaction:', error);
    return null;
  }
}

export async function updateMobileMoneyTransactionStatus(
  transactionId: string,
  status: 'pending' | 'completed' | 'failed'
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(mobileMoneyTransactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(mobileMoneyTransactions.transactionId, transactionId));
    return true;
  } catch (error) {
    console.error('[DB] Failed to update mobile money transaction status:', error);
    return null;
  }
}

export async function getUserMobileMoneyTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(mobileMoneyTransactions)
      .where(eq(mobileMoneyTransactions.userId, userId));
  } catch (error) {
    console.error('[DB] Failed to get user mobile money transactions:', error);
    return [];
  }
}

/**
 * Blockchain Record Helpers
 */
export async function createBlockchainRecord(
  data: InsertBlockchainRecord
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(blockchainRecords).values(data);
    const result = await db
      .select()
      .from(blockchainRecords)
      .where(eq(blockchainRecords.transactionHash, data.transactionHash))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to create blockchain record:', error);
    return null;
  }
}

export async function getBlockchainRecord(transactionHash: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(blockchainRecords)
      .where(eq(blockchainRecords.transactionHash, transactionHash))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to get blockchain record:', error);
    return null;
  }
}

export async function getBlockchainRecordsByType(
  recordType: 'certificate' | 'donation' | 'badge'
) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(blockchainRecords)
      .where(eq(blockchainRecords.recordType, recordType));
  } catch (error) {
    console.error('[DB] Failed to get blockchain records by type:', error);
    return [];
  }
}

export async function verifyBlockchainRecord(transactionHash: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(blockchainRecords)
      .set({ verified: true, updatedAt: new Date() })
      .where(eq(blockchainRecords.transactionHash, transactionHash));
    return true;
  } catch (error) {
    console.error('[DB] Failed to verify blockchain record:', error);
    return null;
  }
}

/**
 * Transaction Helpers
 */
export async function createTransaction(
  data: InsertTransaction
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(transactions).values(data);
    const result = await db
      .select()
      .from(transactions)
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to create transaction:', error);
    return null;
  }
}

export async function getTransaction(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to get transaction:', error);
    return null;
  }
}

export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.fromUserId, userId));
  } catch (error) {
    console.error('[DB] Failed to get user transactions:', error);
    return [];
  }
}

export async function updateTransactionStatus(
  id: number,
  status: 'pending' | 'completed' | 'failed'
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id));
    return true;
  } catch (error) {
    console.error('[DB] Failed to update transaction status:', error);
    return null;
  }
}

/**
 * Certificate Helpers
 */
export async function createCertificate(
  data: InsertCertificate
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(certificates).values(data);
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateNumber, data.certificateNumber))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to create certificate:', error);
    return null;
  }
}

export async function getCertificate(certificateNumber: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to get certificate:', error);
    return null;
  }
}

export async function getCertificateByEnrollment(enrollmentId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.enrollmentId, enrollmentId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Failed to get certificate by enrollment:', error);
    return null;
  }
}

export async function updateCertificateBlockchain(
  certificateNumber: string,
  tokenId: string,
  blockchainHash: string
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(certificates)
      .set({ tokenId, blockchainHash })
      .where(eq(certificates.certificateNumber, certificateNumber));
    return true;
  } catch (error) {
    console.error('[DB] Failed to update certificate blockchain:', error);
    return null;
  }
}

/**
 * Statistics Helpers
 */
export async function getTotalDonations() {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db
      .select()
      .from(donations);
    return result.reduce((sum: number, d: any) => sum + parseFloat(d.amount?.toString() || '0'), 0);
  } catch (error) {
    console.error('[DB] Failed to get total donations:', error);
    return 0;
  }
}

export async function getTotalPayments() {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db
      .select()
      .from(mobileMoneyTransactions);
    return result.reduce((sum: number, t: any) => sum + parseFloat(t.amount?.toString() || '0'), 0);
  } catch (error) {
    console.error('[DB] Failed to get total payments:', error);
    return 0;
  }
}

export async function getCertificateCount() {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.select().from(certificates);
    return result.length;
  } catch (error) {
    console.error('[DB] Failed to get certificate count:', error);
    return 0;
  }
}

export async function getBlockchainRecordCount() {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.select().from(blockchainRecords);
    return result.length;
  } catch (error) {
    console.error('[DB] Failed to get blockchain record count:', error);
    return 0;
  }
}
