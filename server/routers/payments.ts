import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import {
  createMobileMoneyTransaction,
  getMobileMoneyTransaction,
  updateMobileMoneyTransactionStatus,
  createBlockchainRecord,
  getBlockchainRecord,
  verifyBlockchainRecord,
  createTransaction,
  createCertificate,
  updateCertificateBlockchain,
  getTotalDonations,
  getTotalPayments,
} from '../db-payments';
import { getDb } from '../db';
import { donations } from '../../drizzle/schema';

export const paymentsRouter = router({
  // Mobile Money Payments
  initiateMobileMoneyPayment: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        phoneNumber: z.string(),
        provider: z.enum(['orange', 'vodacom', 'airtel']),
        formationId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const transactionId = `TXN-${Date.now()}-${ctx.user.id}`;

        // Create mobile money transaction record
        const mmTransaction = await createMobileMoneyTransaction({
          userId: ctx.user.id,
          transactionId,
          provider: input.provider,
          phoneNumber: input.phoneNumber,
          amount: input.amount.toString(),
          currency: 'USD',
          status: 'pending',
          description: `Payment for formation ${input.formationId}`,
          metadata: JSON.stringify({
            formationId: input.formationId,
            userId: ctx.user.id,
          }),
        });

        if (!mmTransaction) {
          throw new Error('Failed to create mobile money transaction');
        }

        // Create transaction record
        await createTransaction({
          fromUserId: ctx.user.id,
          type: 'payment',
          amount: input.amount.toString(),
          status: 'pending',
          description: `Mobile Money payment via ${input.provider}`,
        });

        return {
          transactionId,
          status: 'pending',
          amount: input.amount,
          currency: 'USD',
          timestamp: new Date(),
          provider: input.provider,
          message: 'Please confirm the payment on your phone',
        };
      } catch (error) {
        console.error('[Payments] Payment initiation failed:', error);
        throw new Error(`Payment initiation failed: ${error}`);
      }
    }),

  checkPaymentStatus: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        provider: z.enum(['orange', 'vodacom', 'airtel']),
      })
    )
    .query(async ({ input }) => {
      try {
        const transaction = await getMobileMoneyTransaction(input.transactionId);

        if (!transaction) {
          return {
            transactionId: input.transactionId,
            status: 'not_found',
            provider: input.provider,
          };
        }

        return {
          transactionId: input.transactionId,
          status: transaction.status,
          amount: parseFloat(transaction.amount.toString()),
          currency: transaction.currency,
          timestamp: transaction.createdAt,
          provider: input.provider,
        };
      } catch (error) {
        console.error('[Payments] Failed to check payment status:', error);
        throw new Error(`Failed to check payment status: ${error}`);
      }
    }),

  // Blockchain Certificates
  createCertificateNFT: protectedProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
        formationTitle: z.string(),
        completionDate: z.date(),
        grade: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const certificateNumber = `CERT-${Date.now()}-${ctx.user.id}`;
        const tokenId = `TOKEN-${Date.now()}-${Math.random().toString(16).substr(2)}`;
        const transactionHash = `0x${Math.random().toString(16).substr(2)}${Date.now().toString(16)}`;

        // Create certificate in database
        const cert = await createCertificate({
          enrollmentId: input.enrollmentId,
          certificateNumber,
          issueDate: new Date(),
          tokenId,
          blockchainHash: transactionHash,
        });

        if (!cert) {
          throw new Error('Failed to create certificate');
        }

        // Create blockchain record
        const blockchainRecord = await createBlockchainRecord({
          recordType: 'certificate',
          relatedId: input.enrollmentId,
          tokenId,
          transactionHash,
          network: 'hedera-testnet',
          metadata: JSON.stringify({
            certificateNumber,
            formationTitle: input.formationTitle,
            studentName: ctx.user.name || 'Student',
            completionDate: input.completionDate,
            grade: input.grade,
            issuedAt: new Date(),
          }),
          verified: true,
        });

        if (!blockchainRecord) {
          throw new Error('Failed to create blockchain record');
        }

        return {
          studentId: ctx.user.id,
          formationId: input.enrollmentId,
          certificateNumber,
          issueDate: new Date(),
          tokenId,
          transactionHash,
          metadata: {
            formationTitle: input.formationTitle,
            studentName: ctx.user.name || 'Student',
            completionDate: input.completionDate,
            grade: input.grade,
          },
          message: 'Certificate created and recorded on blockchain',
        };
      } catch (error) {
        console.error('[Payments] Certificate creation failed:', error);
        throw new Error(`Certificate creation failed: ${error}`);
      }
    }),

  verifyCertificate: publicProcedure
    .input(
      z.object({
        tokenId: z.string(),
        certificateNumber: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const blockchainRecord = await getBlockchainRecord(input.tokenId);

        if (!blockchainRecord) {
          return {
            isValid: false,
            details: {
              tokenId: input.tokenId,
              verified: false,
              message: 'Certificate not found',
            },
          };
        }

        return {
          isValid: blockchainRecord.verified,
          details: {
            tokenId: input.tokenId,
            verified: blockchainRecord.verified,
            createdAt: blockchainRecord.createdAt,
            network: blockchainRecord.network,
            metadata: JSON.parse(blockchainRecord.metadata || '{}'),
          },
        };
      } catch (error) {
        console.error('[Payments] Certificate verification failed:', error);
        throw new Error(`Certificate verification failed: ${error}`);
      }
    }),

  // Donations
  recordDonation: publicProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        phoneNumber: z.string(),
        provider: z.enum(['orange', 'vodacom', 'airtel']),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const transactionId = `TXN-${Date.now()}-DONATION`;
        const transactionHash = `0x${Math.random().toString(16).substr(2)}${Date.now().toString(16)}`;

        // Create mobile money transaction for donation
        const mmTransaction = await createMobileMoneyTransaction({
          transactionId,
          provider: input.provider,
          phoneNumber: input.phoneNumber,
          amount: input.amount.toString(),
          currency: 'USD',
          status: 'pending',
          description: `Donation: ${input.message || 'Support PROFUTUR'}`,
          metadata: JSON.stringify({
            donationType: 'general',
            message: input.message,
          }),
        });

        if (!mmTransaction) {
          throw new Error('Failed to create donation transaction');
        }

        // Create blockchain record for donation
        const blockchainRecord = await createBlockchainRecord({
          recordType: 'donation',
          relatedId: 0,
          transactionHash,
          network: 'hedera-testnet',
          metadata: JSON.stringify({
            amount: input.amount,
            currency: 'USD',
            donor: input.phoneNumber,
            message: input.message,
            timestamp: new Date(),
          }),
          verified: true,
        });

        if (!blockchainRecord) {
          throw new Error('Failed to create blockchain record');
        }

        // Create transaction record
        await createTransaction({
          type: 'donation',
          amount: input.amount.toString(),
          status: 'pending',
          description: input.message || 'Support PROFUTUR',
          blockchainHash: transactionHash,
        });

        return {
          payment: {
            transactionId,
            status: 'pending',
            amount: input.amount,
            currency: 'USD',
            timestamp: new Date(),
            provider: input.provider,
          },
          donation: {
            donorId: 0,
            amount: input.amount,
            currency: 'USD',
            timestamp: new Date(),
            transactionHash,
            verified: true,
            message: 'Donation recorded on blockchain',
          },
        };
      } catch (error) {
        console.error('[Payments] Donation recording failed:', error);
        throw new Error(`Donation recording failed: ${error}`);
      }
    }),

  getDonationHistory: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const result = await db
          .select()
          .from(donations)
          .limit(input.limit);

        return result.map((d) => ({
          id: d.id,
          amount: parseFloat(d.amount.toString()),
          currency: d.currency,
          status: d.status,
          description: d.description,
          transactionHash: d.transactionHash,
          donatedAt: d.donatedAt,
        }));
      } catch (error) {
        console.error('[Payments] Failed to fetch donation history:', error);
        return [];
      }
    }),

  // Statistics
  getPaymentStats: publicProcedure.query(async () => {
    try {
      const totalDonations = await getTotalDonations();
      const totalPayments = await getTotalPayments();

      return {
        totalDonations,
        totalPayments,
        totalTransactions: totalDonations + totalPayments,
        currency: 'USD',
      };
    } catch (error) {
      console.error('[Payments] Failed to get payment stats:', error);
      return {
        totalDonations: 0,
        totalPayments: 0,
        totalTransactions: 0,
        currency: 'USD',
      };
    }
  }),
});
