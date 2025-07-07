/**
 * Integrations Index
 * Central export point for all protocol integrations
 */

// Secured Finance Integration
export { default as SecuredFinanceIntegration } from './secured-finance';
export type { SecuredFinanceConfig } from './secured-finance';

// Filecoin Integration
export { default as FilecoinIntegration } from './filecoin';
export type { FilecoinConfig, StorageRequest } from './filecoin';

// Anthropic MCP Integration
export { default as AnthropicMCPIntegration } from './anthropic-mcp';
export type { MCPConfig, MCPRequest } from './anthropic-mcp';

// WeatherXM Integration
export { default as WeatherXMIntegration } from './weatherxm';
export type { WeatherXMConfig, WeatherData, WeatherStation } from './weatherxm';

// Checker Network Integration
export { default as CheckerNetworkIntegration } from './checker-network';
export type { CheckerNetworkConfig, VerificationRequest, VerificationResult } from './checker-network';

// NEAR Shade Agents Integration
export { default as NearShadeIntegration } from './near-shade';
export type { ShadeAgentConfig, AgentDeployment, DeployedAgent } from './near-shade';

/**
 * Integration Manager
 * Centralized management of all protocol integrations
 */
export class IntegrationManager {
  private integrations: Map<string, any> = new Map();

  /**
   * Register an integration
   */
  register(name: string, integration: any): void {
    this.integrations.set(name, integration);
  }

  /**
   * Get an integration by name
   */
  get(name: string): any {
    return this.integrations.get(name);
  }

  /**
   * Initialize all integrations
   */
  async initializeAll(configs: Record<string, any>): Promise<void> {
    const promises = [];

    if (configs.securedFinance) {
      const integration = new SecuredFinanceIntegration(configs.securedFinance);
      this.register('securedFinance', integration);
    }

    if (configs.filecoin) {
      const integration = new FilecoinIntegration(configs.filecoin);
      this.register('filecoin', integration);
    }

    if (configs.anthropicMCP) {
      const integration = new AnthropicMCPIntegration(configs.anthropicMCP);
      this.register('anthropicMCP', integration);
    }

    if (configs.weatherXM) {
      const integration = new WeatherXMIntegration(configs.weatherXM);
      this.register('weatherXM', integration);
    }

    if (configs.checkerNetwork) {
      const integration = new CheckerNetworkIntegration(configs.checkerNetwork);
      this.register('checkerNetwork', integration);
    }

    if (configs.nearShade) {
      const integration = new NearShadeIntegration(configs.nearShade);
      await integration.initialize();
      this.register('nearShade', integration);
    }

    await Promise.all(promises);
  }

  /**
   * Get all registered integrations
   */
  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, integration] of this.integrations) {
      result[name] = integration;
    }
    return result;
  }

  /**
   * Check if an integration is available
   */
  isAvailable(name: string): boolean {
    return this.integrations.has(name);
  }
}

export default IntegrationManager;