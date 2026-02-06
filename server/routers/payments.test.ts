import { describe, expect, it } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    loginMethod: 'manus',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };

  return { ctx };
}

describe('payments router', () => {
  describe('initiateMobileMoneyPayment', () => {
    it('should initiate a payment with valid input', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.initiateMobileMoneyPayment({
        amount: 50,
        phoneNumber: '+243812345678',
        provider: 'orange',
        formationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.status).toBe('pending');
      expect(result.amount).toBe(50);
      expect(result.provider).toBe('orange');
      expect(result.transactionId).toBeDefined();
    });

    it('should handle different providers', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const providers: Array<'orange' | 'vodacom' | 'airtel'> = ['orange', 'vodacom', 'airtel'];

      for (const provider of providers) {
        const result = await caller.payments.initiateMobileMoneyPayment({
          amount: 100,
          phoneNumber: '+243812345678',
          provider,
          formationId: 1,
        });

        expect(result.provider).toBe(provider);
        expect(result.status).toBe('pending');
      }
    });
  });

  describe('checkPaymentStatus', () => {
    it('should check payment status', async () => {
      const caller = appRouter.createCaller({} as any);

      const result = await caller.payments.checkPaymentStatus({
        transactionId: 'TXN-123456',
        provider: 'orange',
      });

      expect(result).toBeDefined();
      expect(result.transactionId).toBe('TXN-123456');
      expect(result.provider).toBe('orange');
    });
  });

  describe('createCertificateNFT', () => {
    it('should create an NFT certificate', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.createCertificateNFT({
        enrollmentId: 1,
        formationTitle: 'React Developer',
        completionDate: new Date(),
        grade: 'A',
      });

      expect(result).toBeDefined();
      expect(result.studentId).toBe(1);
      expect(result.formationId).toBe(1);
      expect(result.certificateNumber).toBeDefined();
      expect(result.tokenId).toBeDefined();
      expect(result.transactionHash).toBeDefined();
      expect(result.metadata.formationTitle).toBe('React Developer');
      expect(result.metadata.studentName).toBe('Test User');
      expect(result.metadata.grade).toBe('A');
    });
  });

  describe('verifyCertificate', () => {
    it('should verify a certificate', async () => {
      const caller = appRouter.createCaller({} as any);

      const result = await caller.payments.verifyCertificate({
        tokenId: 'TOKEN-123456',
        certificateNumber: 'CERT-2026-001',
      });

      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(result.details).toBeDefined();
      expect(result.details.tokenId).toBe('TOKEN-123456');
    });
  });

  describe('recordDonation', () => {
    it('should record a donation', async () => {
      const caller = appRouter.createCaller({} as any);

      const result = await caller.payments.recordDonation({
        amount: 100,
        phoneNumber: '+243812345678',
        provider: 'orange',
        message: 'Support your mission',
      });

      expect(result).toBeDefined();
      expect(result.payment).toBeDefined();
      expect(result.payment.amount).toBe(100);
      expect(result.payment.status).toBe('pending');
      expect(result.donation).toBeDefined();
      expect(result.donation.amount).toBe(100);
      expect(result.donation.transactionHash).toBeDefined();
    });

    it('should handle donations without message', async () => {
      const caller = appRouter.createCaller({} as any);

      const result = await caller.payments.recordDonation({
        amount: 50,
        phoneNumber: '+243812345678',
        provider: 'vodacom',
      });

      expect(result).toBeDefined();
      expect(result.payment.amount).toBe(50);
      expect(result.donation.amount).toBe(50);
    });
  });

  describe('getDonationHistory', () => {
    it('should get donation history', async () => {
      const caller = appRouter.createCaller({} as any);

      const result = await caller.payments.getDonationHistory({
        limit: 10,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const caller = appRouter.createCaller({} as any);

      const result = await caller.payments.getDonationHistory({
        limit: 5,
      });

      expect(result.length).toBeLessThanOrEqual(5);
    });
  });
});
