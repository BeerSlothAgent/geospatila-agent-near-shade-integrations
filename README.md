# AgentSphere NEAR - Complete Testing Environment

A comprehensive platform for deploying and testing autonomous AI agents on NEAR Protocol with multi-chain wallet integration and advanced protocol support.

## 🚀 Features

- **NEAR Shade Agents**: Deploy autonomous AI agents on NEAR Protocol
- **Multi-chain Wallets**: NEAR Chain Signatures for Ethereum and Bitcoin
- **Location-based Services**: GPS integration with WeatherXM
- **DeFi Integration**: Secured Finance stablecoin operations
- **Decentralized Storage**: Filecoin integration for agent data
- **AI Capabilities**: Anthropic MCP for advanced AI features
- **Verification Services**: Checker Network for data validation
- **Real-time Communication**: WebSocket-powered interactions

## 🏗️ Architecture

### Core Integrations

- **NEAR Protocol**: Blockchain foundation and Shade Agents
- **Secured Finance**: DeFi and stablecoin operations
- **Filecoin**: Decentralized storage for agent data
- **Anthropic MCP**: Advanced AI capabilities
- **WeatherXM**: Decentralized weather data
- **Checker Network**: Verification and validation services

### Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Blockchain**: NEAR Protocol with Chain Signatures
- **AI**: Anthropic Claude with MCP
- **Storage**: Filecoin for decentralized data storage
- **Weather**: WeatherXM for location-based data
- **Verification**: Checker Network for data validation
- **DeFi**: Secured Finance for stablecoin operations

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/agentsphere-near.git
   cd agentsphere-near
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# NEAR Configuration
VITE_NEAR_CONTRACT_NAME=shade-agents.testnet

# Secured Finance
VITE_SECURED_FINANCE_API_KEY=your_api_key
VITE_SECURED_FINANCE_CONTRACT=contract_address

# Filecoin
VITE_FILECOIN_ENDPOINT=https://api.node.glif.io
VITE_FILECOIN_TOKEN=your_token

# Anthropic MCP
VITE_ANTHROPIC_API_KEY=your_api_key

# WeatherXM
VITE_WEATHERXM_API_KEY=your_api_key
VITE_WEATHERXM_BASE_URL=https://api.weatherxm.com/api/v1

# Checker Network
VITE_CHECKER_NETWORK_API_KEY=your_api_key
VITE_CHECKER_NETWORK_BASE_URL=https://api.checker.network/v1
```

## 🤖 Agent Deployment

### Basic Agent Deployment

```typescript
import { useIntegrations } from './hooks/useIntegrations';

const { getIntegration } = useIntegrations();
const nearShade = getIntegration('nearShade');

const deployAgent = async () => {
  const agent = await nearShade.deployAgent({
    name: 'Weather Agent NYC',
    capabilities: ['chat', 'weather', 'location_services'],
    initialFunding: '2.5',
    spendingLimit: '1.0',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    isPublic: true,
  });
  
  console.log('Agent deployed:', agent);
};
```

### Advanced Agent with Multiple Integrations

```typescript
const deployAdvancedAgent = async () => {
  const nearShade = getIntegration('nearShade');
  const weatherXM = getIntegration('weatherXM');
  const anthropicMCP = getIntegration('anthropicMCP');
  
  // Deploy agent
  const agent = await nearShade.deployAgent({
    name: 'Advanced Weather AI',
    capabilities: ['chat', 'weather', 'ai_analysis', 'data_storage'],
    initialFunding: '5.0',
    spendingLimit: '2.0',
    location: { latitude: 40.7128, longitude: -74.0060 },
    isPublic: true,
  });
  
  // Set up weather monitoring
  const unsubscribe = await weatherXM.subscribeToUpdates(
    40.7128, -74.0060,
    async (weatherData) => {
      // Analyze weather data with AI
      const analysis = await anthropicMCP.analyzeAgentBehavior({
        agentId: agent.id,
        weatherData,
        timestamp: Date.now(),
      });
      
      console.log('Weather analysis:', analysis);
    }
  );
};
```

## 📚 Integration Documentation

### NEAR Shade Agents
- Deploy autonomous agents on NEAR Protocol
- Multi-chain wallet generation via Chain Signatures
- Real-time agent status monitoring
- Funding and withdrawal operations

### Secured Finance
- Stablecoin balance management
- DeFi operations and transfers
- Transaction history tracking
- Price monitoring

### Filecoin Storage
- Decentralized data storage for agents
- IPFS integration for content addressing
- Storage deal management
- Data retrieval and verification

### Anthropic MCP
- Advanced AI capabilities for agents
- Natural language processing
- Behavior analysis and optimization
- Personality generation

### WeatherXM
- Decentralized weather data
- Real-time weather monitoring
- Historical weather analysis
- Location-based weather services

### Checker Network
- Data verification and validation
- Identity verification for agents
- Transaction authenticity checks
- Consensus-based validation

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Development
```bash
npm run build
npm run preview
```

### Production
```bash
npm run build
# Deploy to your preferred hosting platform
```

## 📖 API Reference

Detailed API documentation is available in the `/docs` directory:

- [API Documentation](./Docs/API_Documentation.md)
- [Backend Architecture](./Docs/Backend.md)
- [Database Schemas](./Docs/Schemas.md)
- [Project Plan](./Docs/Project_plan.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NEAR Protocol](https://near.org/)
- [Shade Agents Documentation](https://docs.near.org/ai/shade-agents)
- [Secured Finance](https://docs.secured.finance/)
- [Filecoin](https://docs.filecoin.io/)
- [Anthropic MCP](https://docs.anthropic.com/en/docs/mcp)
- [WeatherXM](https://github.com/weatherxm)
- [Checker Network](https://www.checker.network/)

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Join our Discord community
- Check the documentation in `/docs`

---

Built with ❤️ for the NEAR ecosystem
