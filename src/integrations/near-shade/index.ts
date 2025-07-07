/**
 * NEAR Shade Agents Integration
 * Core NEAR Protocol and Shade Agents functionality
 */

import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';

export interface ShadeAgentConfig {
  networkId: 'testnet' | 'mainnet';
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  contractName: string;
}

export interface AgentDeployment {
  name: string;
  capabilities: string[];
  initialFunding: string;
  spendingLimit: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isPublic: boolean;
}

export interface DeployedAgent {
  id: string;
  contractAddress: string;
  wallets: {
    near: string;
    ethereum: string;
    bitcoin: string;
  };
  status: 'active' | 'inactive' | 'error';
  balance: string;
  lastActivity: Date;
}

export class NearShadeIntegration {
  private near: any;
  private wallet: WalletConnection;
  private contract: Contract;
  private config: ShadeAgentConfig;

  constructor(config: ShadeAgentConfig) {
    this.config = config;
  }

  /**
   * Initialize NEAR connection and wallet
   */
  async initialize(): Promise<void> {
    try {
      const keyStore = new keyStores.BrowserLocalStorageKeyStore();
      
      const nearConfig = {
        networkId: this.config.networkId,
        keyStore,
        nodeUrl: this.config.nodeUrl,
        walletUrl: this.config.walletUrl,
        helperUrl: this.config.helperUrl,
        headers: {},
      };

      this.near = await connect(nearConfig);
      this.wallet = new WalletConnection(this.near, 'agentsphere-near');

      if (this.wallet.isSignedIn()) {
        this.contract = new Contract(
          this.wallet.account(),
          this.config.contractName,
          {
            changeMethods: [
              'deploy_agent',
              'update_agent',
              'delete_agent',
              'fund_agent',
              'withdraw_from_agent',
            ],
            viewMethods: [
              'get_agent',
              'get_agents_by_owner',
              'get_agent_status',
              'get_agent_wallets',
              'get_agent_balance',
            ],
          }
        );
      }
    } catch (error) {
      console.error('Error initializing NEAR connection:', error);
      throw error;
    }
  }

  /**
   * Deploy a new Shade Agent
   */
  async deployAgent(deployment: AgentDeployment): Promise<DeployedAgent> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please sign in first.');
      }

      const result = await (this.contract as any).deploy_agent({
        args: {
          name: deployment.name,
          capabilities: deployment.capabilities,
          location: deployment.location,
          is_public: deployment.isPublic,
          spending_limit: deployment.spendingLimit,
        },
        gas: '300000000000000', // 300 TGas
        amount: deployment.initialFunding,
      });

      // Generate multi-chain wallets using Chain Signatures
      const wallets = await this.generateAgentWallets(result.agent_id);

      return {
        id: result.agent_id,
        contractAddress: result.contract_address,
        wallets,
        status: 'active',
        balance: deployment.initialFunding,
        lastActivity: new Date(),
      };
    } catch (error) {
      console.error('Error deploying agent:', error);
      throw error;
    }
  }

  /**
   * Get agent details
   */
  async getAgent(agentId: string): Promise<DeployedAgent | null> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const agent = await (this.contract as any).get_agent({
        agent_id: agentId,
      });

      if (!agent) {
        return null;
      }

      return {
        id: agent.id,
        contractAddress: agent.contract_address,
        wallets: agent.wallets,
        status: agent.status,
        balance: agent.balance,
        lastActivity: new Date(agent.last_activity),
      };
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  }

  /**
   * Get all agents owned by current user
   */
  async getUserAgents(): Promise<DeployedAgent[]> {
    try {
      if (!this.contract || !this.wallet.isSignedIn()) {
        return [];
      }

      const accountId = this.wallet.getAccountId();
      const agents = await (this.contract as any).get_agents_by_owner({
        owner_id: accountId,
      });

      return agents.map((agent: any) => ({
        id: agent.id,
        contractAddress: agent.contract_address,
        wallets: agent.wallets,
        status: agent.status,
        balance: agent.balance,
        lastActivity: new Date(agent.last_activity),
      }));
    } catch (error) {
      console.error('Error fetching user agents:', error);
      return [];
    }
  }

  /**
   * Fund an agent
   */
  async fundAgent(agentId: string, amount: string): Promise<string> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const result = await (this.contract as any).fund_agent({
        args: { agent_id: agentId },
        gas: '100000000000000', // 100 TGas
        amount,
      });

      return result.transaction_hash;
    } catch (error) {
      console.error('Error funding agent:', error);
      throw error;
    }
  }

  /**
   * Withdraw from agent
   */
  async withdrawFromAgent(agentId: string, amount: string): Promise<string> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const result = await (this.contract as any).withdraw_from_agent({
        args: {
          agent_id: agentId,
          amount,
        },
        gas: '100000000000000', // 100 TGas
      });

      return result.transaction_hash;
    } catch (error) {
      console.error('Error withdrawing from agent:', error);
      throw error;
    }
  }

  /**
   * Generate multi-chain wallets for agent using Chain Signatures
   */
  private async generateAgentWallets(agentId: string): Promise<any> {
    try {
      // This would use NEAR Chain Signatures to generate wallets
      // For now, return mock addresses
      return {
        near: `${agentId}.shade-agents.testnet`,
        ethereum: `0x${this.generateRandomHex(40)}`,
        bitcoin: `bc1${this.generateRandomString(39)}`,
      };
    } catch (error) {
      console.error('Error generating agent wallets:', error);
      throw error;
    }
  }

  /**
   * Get agent status and performance metrics
   */
  async getAgentStatus(agentId: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const status = await (this.contract as any).get_agent_status({
        agent_id: agentId,
      });

      return {
        status: status.status,
        uptime: status.uptime,
        totalInteractions: status.total_interactions,
        successRate: status.success_rate,
        lastActivity: new Date(status.last_activity),
        walletBalances: status.wallet_balances,
      };
    } catch (error) {
      console.error('Error fetching agent status:', error);
      return null;
    }
  }

  /**
   * Update agent configuration
   */
  async updateAgent(agentId: string, updates: Partial<AgentDeployment>): Promise<boolean> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      await (this.contract as any).update_agent({
        args: {
          agent_id: agentId,
          updates,
        },
        gas: '100000000000000', // 100 TGas
      });

      return true;
    } catch (error) {
      console.error('Error updating agent:', error);
      return false;
    }
  }

  /**
   * Delete agent and withdraw remaining funds
   */
  async deleteAgent(agentId: string): Promise<boolean> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      await (this.contract as any).delete_agent({
        args: { agent_id: agentId },
        gas: '100000000000000', // 100 TGas
      });

      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      return false;
    }
  }

  private generateRandomHex(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private generateRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}

export default NearShadeIntegration;