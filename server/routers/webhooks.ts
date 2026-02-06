import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import {
  updateMobileMoneyTransactionStatus,
  updateTransactionStatus,
  createTransaction,
} from '../db-payments';
import { getDb } from '../db';
import { eq } from 'drizzle-orm';
import { enrollments } from '../../drizzle/schema';

export const webhooksRouter = router({
  // Webhook for Mobile Money payment confirmation
  confirmMobileMoneyPayment: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        provider: z.enum(['orange', 'vodacom', 'airtel']),
        status: z.enum(['completed', 'failed']),
        amount: z.number().optional(),
        timestamp: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Update mobile money transaction status
        const mmUpdate = await updateMobileMoneyTransactionStatus(
          input.transactionId,
          input.status
        );

        if (!mmUpdate) {
          throw new Error('Failed to update mobile money transaction');
        }

        // If payment is completed, update associated transaction
        if (input.status === 'completed') {
          // Find and update the related transaction
          const db = await getDb();
          if (db) {
            // Create a new transaction record for the completed payment
            await createTransaction({
              type: 'payment',
              amount: input.amount?.toString() || '0',
              status: 'completed',
              description: `Mobile Money payment confirmed via ${input.provider}`,
              blockchainHash: `WEBHOOK-${input.transactionId}`,
            });
          }
        }

        return {
          success: true,
          transactionId: input.transactionId,
          status: input.status,
          message: `Payment ${input.status} successfully`,
        };
      } catch (error) {
        console.error('[Webhooks] Payment confirmation failed:', error);
        throw new Error(`Payment confirmation failed: ${error}`);
      }
    }),

  // Webhook for formation enrollment confirmation after payment
  confirmFormationEnrollment: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        formationId: z.number(),
        studentId: z.number(),
        status: z.enum(['active', 'completed']),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        // Update enrollment status
        const result = await db
          .update(enrollments)
          .set({
            status: input.status,
            enrolledAt: new Date(),
          })
          .where(
            eq(enrollments.studentId, input.studentId)
          );

        return {
          success: true,
          formationId: input.formationId,
          studentId: input.studentId,
          status: input.status,
          message: 'Enrollment confirmed',
        };
      } catch (error) {
        console.error('[Webhooks] Enrollment confirmation failed:', error);
        throw new Error(`Enrollment confirmation failed: ${error}`);
      }
    }),

  // Webhook for donation confirmation
  confirmDonation: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        status: z.enum(['completed', 'failed']),
        amount: z.number().optional(),
        blockchainHash: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Update donation transaction status
        const donationUpdate = await updateMobileMoneyTransactionStatus(
          input.transactionId,
          input.status
        );

        if (!donationUpdate) {
          throw new Error('Failed to update donation transaction');
        }

        // If donation is completed, create transaction record
        if (input.status === 'completed') {
          await createTransaction({
            type: 'donation',
            amount: input.amount?.toString() || '0',
            status: 'completed',
            description: 'Donation confirmed',
            blockchainHash: input.blockchainHash,
          });
        }

        return {
          success: true,
          transactionId: input.transactionId,
          status: input.status,
          message: `Donation ${input.status} successfully`,
        };
      } catch (error) {
        console.error('[Webhooks] Donation confirmation failed:', error);
        throw new Error(`Donation confirmation failed: ${error}`);
      }
    }),

  // Health check endpoint
  health: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      return {
        status: 'ok',
        database: db ? 'connected' : 'disconnected',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }),
});
