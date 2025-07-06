# Backend Architecture Documentation

## 🏗️ Backend Overview

The AgentSphere NEAR backend is built on a modern, scalable architecture designed for autonomous AI agent management with blockchain integration.

## 🔧 Core Architecture

### Technology Stack
- **Runtime**: Node.js with Next.js 14 API routes
- **Language**: TypeScript for type safety
- **Database**: Supabase (PostgreSQL) for real-time data
- **Blockchain**: NEAR Protocol with Shade Agents
- **Authentication**: NEAR Wallet integration
- **Real-time**: WebSocket + Server-Sent Events
- **Deployment**: Vercel (dev) + Phala Cloud TEE (production)

### Architecture Patterns
- **Serverless Functions**: Next.js API routes for scalability
- **Event-Driven**: WebSocket for real-time communication
- **Microservices**: Modular agent capabilities
- **Chain Abstraction**: Multi-chain wallet management
- **TEE Security**: Trusted Execution Environment for production

---

## 📊 Database Layer

### Supabase Integration
```typescript
// Database connection and configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Real-time subscriptions
supabase
  .channel('agents')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'agents' 
  }, payload => {
    handleAgentUpdate(payload);
  })
  .subscribe();
```

### Data Models
- **Agents**: Core agent information and configuration
- **Agent Status**: Real-time status and performance metrics
- **Agent Interactions**: User interaction history and analytics
- **Agent Transactions**: Blockchain transaction tracking
- **Agent Wallets**: Multi-chain wallet management

---

## 🔗 NEAR Blockchain Integration

### Shade Agents Core
```typescript
class ShadeAgentManager {
  // Deploy autonomous agent to NEAR
  async deployAgent(config: AgentConfig): Promise<DeployResult> {
    const contract = new Contract(
      this.wallet.account(),
      this.contractId,
      {
        changeMethods: ['deploy_agent', 'register_worker'],
        viewMethods: ['get_agent_status', 'get_agent_wallets']
      }
    );

    return await contract.deploy_agent({
      args: config,
      gas: '300000000000000',
      amount: config.initialFunding
    });
  }

  // Generate multi-chain wallets using Chain Signatures
  async generateAgentWallets(agentId: string): Promise<AgentWallets> {
    const wallets = {
      near: await this.deriveWallet(agentId, 'near', 'ed25519'),
      ethereum: await this.deriveWallet(agentId, 'ethereum', 'secp256k1'),
      bitcoin: await this.deriveWallet(agentId, 'bitcoin', 'secp256k1')
    };
    return wallets;
  }
}
```

### Chain Signatures
- **Multi-chain Support**: Generate wallets for NEAR, Ethereum, Bitcoin
- **Secure Key Management**: Keys never leave TEE environment
- **Autonomous Signing**: Agents can sign transactions independently
- **Cross-chain Operations**: Seamless multi-chain interactions

---

## 🤖 Agent Capabilities System

### Capability Framework
```typescript
interface AgentCapability {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
  requiredPermissions: string[];
  costEstimate: number;
}

class CapabilityManager {
  private capabilities: Map<string, AgentCapability> = new Map();

  registerCapability(capability: AgentCapability) {
    this.capabilities.set(capability.name, capability);
  }

  async executeCapability(
    agentId: string, 
    capabilityName: string, 
    params: any
  ): Promise<any> {
    const capability = this.capabilities.get(capabilityName);
    
    // Permission check
    await this.checkPermissions(agentId, capability.requiredPermissions);
    
    // Cost check
    await this.checkAgentBalance(agentId, capability.costEstimate);
    
    // Execute capability
    return await capability.execute(params);
  }
}
```

### Built-in Capabilities
1. **Weather Services**: Real-time weather data for agent location
2. **Crypto Prices**: Live cryptocurrency price feeds
3. **Blockchain Monitoring**: Transaction and block monitoring
4. **AI Chat**: Natural language processing and responses
5. **DeFi Operations**: Automated DeFi interactions
6. **Location Services**: GPS and geolocation features

---

## 🌐 API Layer

### RESTful Endpoints
```typescript
// Agent Management
POST   /api/agents                    // Deploy new agent
GET    /api/agents                    // List all agents
GET    /api/agents/[id]               // Get agent details
PUT    /api/agents/[id]               // Update agent
DELETE /api/agents/[id]               // Delete agent

// Agent Interactions
POST   /api/agents/[id]/interact      // Interact with agent
GET    /api/agents/[id]/status        // Get agent status
GET    /api/agents/[id]/history       // Get interaction history

// Wallet Operations
GET    /api/agents/[id]/wallets       // Get agent wallets
POST   /api/agents/[id]/fund          // Fund agent
POST   /api/agents/[id]/withdraw      // Withdraw from agent

// External Services
GET    /api/weather/[agentId]         // Weather for agent location
GET    /api/crypto/[agentId]          // Crypto prices
GET    /api/blockchain/[agentId]      // Blockchain data
```

### WebSocket Events
```typescript
// Real-time communication
interface WebSocketEvents {
  'agent:status': AgentStatusUpdate;
  'agent:message': AgentMessage;
  'agent:transaction': TransactionUpdate;
  'user:message': UserMessage;
  'system:notification': SystemNotification;
}

// WebSocket server implementation
const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws, req) => {
  const agentId = extractAgentId(req.url);
  
  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString());
    await handleAgentInteraction(agentId, message, ws);
  });
});
```

---

## 🔐 Security Layer

### Authentication & Authorization
```typescript
// NEAR wallet verification
async function verifyWalletSignature(
  message: string, 
  signature: string, 
  accountId: string
): Promise<boolean> {
  const publicKey = await getNearPublicKey(accountId);
  return verifySignature(message, signature, publicKey);
}

// Permission management
class PermissionManager {
  async checkAgentAccess(
    userId: string, 
    agentId: string
  ): Promise<boolean> {
    const agent = await getAgent(agentId);
    return agent.deployerWallet === userId || 
           agent.authorizedUsers.includes(userId);
  }
}
```

### Rate Limiting
```typescript
// API rate limiting
const rateLimiter = new Map();

function rateLimit(userId: string, limit: number = 100) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  
  // Remove old requests (1 minute window)
  const recentRequests = userRequests.filter(
    time => now - time < 60000
  );
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
}
```

---

## 📊 Monitoring & Analytics

### Performance Monitoring
```typescript
// Request monitoring
function monitorApiCall(endpoint: string, duration: number, success: boolean) {
  const metrics = {
    endpoint,
    duration,
    success,
    timestamp: new Date(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };
  
  // Log to monitoring service
  logger.info('API_CALL', metrics);
  
  // Update performance counters
  updateMetrics(metrics);
}

// Agent performance tracking
async function trackAgentPerformance(agentId: string, action: string, result: any) {
  await supabase
    .from('agent_interactions')
    .insert({
      agent_id: agentId,
      action,
      response_time_ms: result.duration,
      success: result.success,
      error_message: result.error
    });
}
```

### Error Handling
```typescript
// Global error handler
function handleError(error: Error, context: any) {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date(),
    severity: determineSeverity(error)
  };
  
  // Log error
  logger.error('SYSTEM_ERROR', errorLog);
  
  // Send to monitoring service
  sendToMonitoring(errorLog);
  
  // Notify if critical
  if (errorLog.severity === 'critical') {
    sendAlert(errorLog);
  }
}
```

---

## 🚀 Deployment Architecture

### Development Environment
- **Local Development**: Next.js dev server with hot reload
- **Database**: Supabase test instance
- **Wallet**: NEAR testnet integration
- **APIs**: Mock external services for testing

### Production Environment (TEE)
- **Runtime**: Phala Cloud Trusted Execution Environment
- **Security**: Hardware-level encryption and isolation
- **Scalability**: Auto-scaling based on demand
- **Monitoring**: Real-time performance and error tracking

### Environment Configuration
```typescript
// Environment-specific configuration
const config = {
  development: {
    nearNetwork: 'testnet',
    supabaseUrl: process.env.SUPABASE_TEST_URL,
    enableDebugLogs: true,
    mockExternalAPIs: true
  },
  production: {
    nearNetwork: 'mainnet',
    supabaseUrl: process.env.SUPABASE_PROD_URL,
    enableDebugLogs: false,
    mockExternalAPIs: false
  }
};
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: API routes are stateless for easy scaling
- **Database Sharding**: Agent data can be sharded by location
- **CDN Integration**: Static assets served from CDN
- **Load Balancing**: Automatic load distribution

### Performance Optimization
- **Caching Strategy**: Redis for frequently accessed data
- **Database Indexing**: Optimized queries for agent operations
- **Connection Pooling**: Efficient database connections
- **Lazy Loading**: On-demand resource loading

### Future Enhancements
- **GraphQL API**: For more efficient data fetching
- **Message Queues**: For async agent communication
- **Machine Learning**: For agent behavior optimization
- **Multi-region**: Global deployment for low latency