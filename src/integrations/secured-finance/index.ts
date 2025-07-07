/**
 * Secured Finance Integration
 * Stablecoin SDK for DeFi operations
 */

import { StablecoinSDK } from '@secured-finance/stablecoin-sdk';

export interface SecuredFinanceConfig {
  network: 'mainnet' | 'testnet';
  apiKey?: string;
  contractAddress?: string;
}

export class SecuredFinanceIntegration {
  private sdk: StablecoinSDK;
  private config: SecuredFinanceConfig;

  constructor(config: SecuredFinanceConfig) {
    this.config = config;
    this.sdk = new StablecoinSDK({
      network: config.network,
      apiKey: config.apiKey,
    });
  }

  /**
   * Get stablecoin balance for an address
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.sdk.getBalance(address);
      return balance.toString();
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  /**
   * Transfer stablecoins
   */
  async transfer(to: string, amount: string, privateKey: string): Promise<string> {
    try {
      const txHash = await this.sdk.transfer({
        to,
        amount,
        privateKey,
      });
      return txHash;
    } catch (error) {
      console.error('Error transferring stablecoins:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(address: string): Promise<any[]> {
    try {
      const history = await this.sdk.getTransactionHistory(address);
      return history;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  /**
   * Get current stablecoin price
   */
  async getPrice(): Promise<number> {
    try {
      const price = await this.sdk.getPrice();
      return price;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }
}

export default SecuredFinanceIntegration;