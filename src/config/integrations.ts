/**
 * Integration Configuration
 * Environment-specific configuration for all protocol integrations
 */

export interface IntegrationConfigs {
  securedFinance: {
    network: 'mainnet' | 'testnet';
    apiKey?: string;
    contractAddress?: string;
  };
  filecoin: {
    endpoint: string;
    token?: string;
    network: 'mainnet' | 'testnet';
  };
  anthropicMCP: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  weatherXM: {
    apiKey?: string;
    baseUrl: string;
    network: 'mainnet' | 'testnet';
  };
  checkerNetwork: {
    apiKey?: string;
    baseUrl: string;
    network: 'mainnet' | 'testnet';
  };
  nearShade: {
    networkId: 'testnet' | 'mainnet';
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
    contractName: string;
  };
}

/**
 * Development configuration
 */
export const developmentConfig: IntegrationConfigs = {
  securedFinance: {
    network: 'testnet',
    apiKey: process.env.VITE_SECURED_FINANCE_API_KEY,
    contractAddress: process.env.VITE_SECURED_FINANCE_CONTRACT,
  },
  filecoin: {
    endpoint: process.env.VITE_FILECOIN_ENDPOINT || 'https://api.node.glif.io',
    token: process.env.VITE_FILECOIN_TOKEN,
    network: 'testnet',
  },
  anthropicMCP: {
    apiKey: process.env.VITE_ANTHROPIC_API_KEY || '',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4000,
  },
  weatherXM: {
    apiKey: process.env.VITE_WEATHERXM_API_KEY,
    baseUrl: process.env.VITE_WEATHERXM_BASE_URL || 'https://api.weatherxm.com/api/v1',
    network: 'testnet',
  },
  checkerNetwork: {
    apiKey: process.env.VITE_CHECKER_NETWORK_API_KEY,
    baseUrl: process.env.VITE_CHECKER_NETWORK_BASE_URL || 'https://api.checker.network/v1',
    network: 'testnet',
  },
  nearShade: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://testnet.mynearwallet.com/',
    helperUrl: 'https://helper.testnet.near.org',
    contractName: process.env.VITE_NEAR_CONTRACT_NAME || 'shade-agents.testnet',
  },
};

/**
 * Production configuration
 */
export const productionConfig: IntegrationConfigs = {
  securedFinance: {
    network: 'mainnet',
    apiKey: process.env.VITE_SECURED_FINANCE_API_KEY,
    contractAddress: process.env.VITE_SECURED_FINANCE_CONTRACT,
  },
  filecoin: {
    endpoint: process.env.VITE_FILECOIN_ENDPOINT || 'https://api.node.glif.io',
    token: process.env.VITE_FILECOIN_TOKEN,
    network: 'mainnet',
  },
  anthropicMCP: {
    apiKey: process.env.VITE_ANTHROPIC_API_KEY || '',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4000,
  },
  weatherXM: {
    apiKey: process.env.VITE_WEATHERXM_API_KEY,
    baseUrl: process.env.VITE_WEATHERXM_BASE_URL || 'https://api.weatherxm.com/api/v1',
    network: 'mainnet',
  },
  checkerNetwork: {
    apiKey: process.env.VITE_CHECKER_NETWORK_API_KEY,
    baseUrl: process.env.VITE_CHECKER_NETWORK_BASE_URL || 'https://api.checker.network/v1',
    network: 'mainnet',
  },
  nearShade: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://app.mynearwallet.com/',
    helperUrl: 'https://helper.mainnet.near.org',
    contractName: process.env.VITE_NEAR_CONTRACT_NAME || 'shade-agents.near',
  },
};

/**
 * Get configuration based on environment
 */
export function getIntegrationConfig(): IntegrationConfigs {
  const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';
  return isDevelopment ? developmentConfig : productionConfig;
}

/**
 * Validate configuration
 */
export function validateConfig(config: IntegrationConfigs): boolean {
  const requiredFields = [
    'nearShade.networkId',
    'nearShade.nodeUrl',
    'nearShade.walletUrl',
    'nearShade.helperUrl',
    'nearShade.contractName',
  ];

  for (const field of requiredFields) {
    const keys = field.split('.');
    let value: any = config;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    if (!value) {
      console.warn(`Missing required configuration: ${field}`);
      return false;
    }
  }

  return true;
}

export default getIntegrationConfig;