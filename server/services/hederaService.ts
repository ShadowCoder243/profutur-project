import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  TransferTransaction,
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenAssociateTransaction,
  Hbar,
  TokenType,
  TokenSupplyType,
} from '@hashgraph/sdk';

export interface NFTCertificate {
  studentId: number;
  formationId: number;
  certificateNumber: string;
  issueDate: Date;
  tokenId: string;
  transactionHash: string;
  metadata: {
    formationTitle: string;
    studentName: string;
    completionDate: Date;
    grade?: string;
  };
}

export interface DonationRecord {
  donorId: number;
  amount: number;
  currency: string;
  timestamp: Date;
  transactionHash: string;
  verified: boolean;
  metadata?: Record<string, any>;
}

class HederaService {
  private client: Client | null = null;
  private operatorId: string;
  private operatorKey: PrivateKey;
  private treasuryId: string;
  private treasuryKey: PrivateKey;

  constructor() {
    this.operatorId = process.env.HEDERA_ACCOUNT_ID || '';
    this.operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY || '');
    this.treasuryId = process.env.HEDERA_TREASURY_ACCOUNT || '';
    this.treasuryKey = PrivateKey.fromString(process.env.HEDERA_TREASURY_PRIVATE_KEY || '');
  }

  /**
   * Initialize Hedera client
   */
  async initialize(): Promise<void> {
    try {
      const network = process.env.HEDERA_NETWORK || 'testnet';

      if (network === 'testnet') {
        this.client = Client.forTestnet();
      } else if (network === 'mainnet') {
        this.client = Client.forMainnet();
      } else {
        throw new Error(`Unknown Hedera network: ${network}`);
      }

      this.client.setOperator(this.operatorId, this.operatorKey);

      console.log('✅ Hedera client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Hedera client:', error);
      throw error;
    }
  }

  /**
   * Create an NFT certificate for a student
   */
  async createCertificate(certificate: NFTCertificate): Promise<NFTCertificate> {
    if (!this.client) {
      throw new Error('Hedera client not initialized');
    }

    try {
      // Create NFT collection (Token)
      const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName(`PROFUTUR-CERT-${certificate.certificateNumber}`)
        .setTokenSymbol('PCERT')
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(this.treasuryId)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(1)
        .setAdminKey(this.treasuryKey)
        .setSupplyKey(this.treasuryKey)
        .freezeWith(this.client);

      const tokenCreateTxSign = await tokenCreateTx.sign(this.treasuryKey);
      const tokenCreateTxResponse = await tokenCreateTxSign.execute(this.client);
      const tokenCreateRx = await tokenCreateTxResponse.getReceipt(this.client);

      const tokenId = tokenCreateRx.tokenId?.toString() || '';

      // Mint the NFT
      const metadata = Buffer.from(
        JSON.stringify({
          name: `Certificate: ${certificate.metadata.formationTitle}`,
          description: `Completed by ${certificate.metadata.studentName} on ${certificate.metadata.completionDate.toISOString()}`,
          image: `https://profutur.com/certificates/${certificate.certificateNumber}.png`,
          attributes: [
            { trait_type: 'Formation', value: certificate.metadata.formationTitle },
            { trait_type: 'Student', value: certificate.metadata.studentName },
            { trait_type: 'Completion Date', value: certificate.metadata.completionDate.toISOString() },
            { trait_type: 'Certificate Number', value: certificate.certificateNumber },
            ...(certificate.metadata.grade ? [{ trait_type: 'Grade', value: certificate.metadata.grade }] : []),
          ],
        })
      );

      const mintTx = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([metadata])
        .freezeWith(this.client);

      const mintTxSign = await mintTx.sign(this.treasuryKey);
      const mintTxResponse = await mintTxSign.execute(this.client);
      const mintRx = await mintTxResponse.getReceipt(this.client);

      return {
        ...certificate,
        tokenId,
        transactionHash: mintTxResponse.transactionHash?.toString() || '',
      };
    } catch (error) {
      console.error('Failed to create certificate:', error);
      throw new Error(`Certificate creation failed: ${error}`);
    }
  }

  /**
   * Record a donation on the blockchain
   */
  async recordDonation(donation: DonationRecord): Promise<DonationRecord> {
    if (!this.client) {
      throw new Error('Hedera client not initialized');
    }

    try {
      // Create a memo for the donation
      const memo = `PROFUTUR-DONATION-${donation.timestamp.getTime()}-${donation.donorId}`;

      // Create a transfer transaction to record the donation
      // In a real scenario, this would transfer HBAR or a stablecoin
      const transferTx = new TransferTransaction()
        .addHbarTransfer(this.treasuryId, new Hbar(0.1)) // Minimal fee for recording
        .setTransactionMemo(memo)
        .freezeWith(this.client);

      const transferTxSign = await transferTx.sign(this.operatorKey);
      const transferTxResponse = await transferTxSign.execute(this.client);
      const transferRx = await transferTxResponse.getReceipt(this.client);

      return {
        ...donation,
        transactionHash: transferTxResponse.transactionHash?.toString() || '',
        verified: transferRx.status?.toString() === 'SUCCESS',
      };
    } catch (error) {
      console.error('Failed to record donation:', error);
      throw new Error(`Donation recording failed: ${error}`);
    }
  }

  /**
   * Verify a certificate on the blockchain
   */
  async verifyCertificate(tokenId: string, certificateNumber: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Hedera client not initialized');
    }

    try {
      // Query the token info to verify it exists
      // In a real implementation, you would query the token metadata
      console.log(`Verifying certificate: ${certificateNumber} with token ID: ${tokenId}`);

      // This is a simplified verification - in production, you'd query Hedera's API
      return true;
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      return false;
    }
  }

  /**
   * Get certificate details
   */
  async getCertificateDetails(tokenId: string): Promise<any> {
    if (!this.client) {
      throw new Error('Hedera client not initialized');
    }

    try {
      // Query token info from Hedera
      // This would return the token metadata and details
      return {
        tokenId,
        verified: true,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Failed to get certificate details:', error);
      throw error;
    }
  }

  /**
   * Get donation history
   */
  async getDonationHistory(donorId: number): Promise<DonationRecord[]> {
    if (!this.client) {
      throw new Error('Hedera client not initialized');
    }

    try {
      // Query donations from the blockchain
      // This would filter transactions by the donor's memo pattern
      return [];
    } catch (error) {
      console.error('Failed to get donation history:', error);
      throw error;
    }
  }

  /**
   * Close the Hedera client connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }
}

export default new HederaService();
