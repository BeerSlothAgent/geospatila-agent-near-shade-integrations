# API Documentation

## 🌐 API Overview

The AgentSphere NEAR API provides comprehensive endpoints for managing autonomous AI agents, wallet operations, and real-time interactions. All endpoints support both REST and real-time WebSocket communication.

## 🔗 Base Configuration

### API Base URL
```
Development: http://localhost:3000/api
Production: https://agentsphere-near.vercel.app/api
```

### Authentication
All API calls require NEAR wallet authentication via signed messages.

```typescript
// Authentication header format
{
  "Authorization": "Bearer <NEAR_WALLET_SIGNATURE>",
  "X-Wallet-ID": "<NEAR_ACCOUNT_ID>",
  "Content-Type": "application/json"
}
```

### Response Format
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId: string;
}
```

---

## 🤖 Agent Management Endpoints

### Deploy New Agent
Deploy a new autonomous agent with specified capabilities.

**Endpoint:** `POST /api/agents`

**Request Body:**
```typescript
interface DeployAgentRequest {
  name: string;
  latitude: number;
  longitude: number;
  agentType: 'basic' | 'weather' | 'crypto' | 'defi' | 'custom';
  capabilities: string[];
  description?: string;
  initialFunding: number; // in NEAR
  spendingLimit?: number; // in NEAR
  isPublic?: boolean;
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Authorization: Bearer <signature>" \
  -H "X-Wallet-ID: alice.testnet" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weather Agent NYC",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "agentType": "weather",
    "capabilities": ["chat", "weather", "location_services"],
    "description": "Provides weather updates for NYC area",
    "initialFunding": 2.5,
    "spendingLimit": 1.0,
    "isPublic": true
  }'
```

**Response:**
```typescript
interface DeployAgentResponse {
  agent: {
    id: number;
    shadeAgentId: string;
    contractAddress: string;
    wallets: {
      near: string;
      ethereum: string;
      bitcoin: string;
    };
    status: 'active';
  };
  deploymentTx: string;
  estimatedCosts: {
    deployment: number;
    monthly: number;
  };
}
```

---

### List User Agents
Get all agents deployed by the authenticated user.

**Endpoint:** `GET /api/agents`

**Query Parameters:**
```typescript
interface ListAgentsQuery {
  page?: number; // Default: 1
  limit?: number; // Default: 20, Max: 100
  status?: 'active' | 'inactive' | 'busy' | 'error';
  agentType?: string;
  sortBy?: 'created_at' | 'name' | 'last_activity';
  sortOrder?: 'asc' | 'desc';
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/agents?page=1&limit=10&status=active" \
  -H "Authorization: Bearer <signature>" \
  -H "X-Wallet-ID: alice.testnet"
```

**Response:**
```typescript
interface ListAgentsResponse {
  agents: Agent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    activeAgents: number;
    totalInteractions: number;
    totalSpent: number;
    totalEarned: number;
  };
}
```

---

### Get Agent Details
Retrieve detailed information about a specific agent.

**Endpoint:** `GET /api/agents/[id]`

**Path Parameters:**
- `id` (required): Agent ID

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/agents/123 \
  -H "Authorization: Bearer <signature>" \
  -H "X-Wallet-ID: alice.testnet"
```

**Response:**
```typescript
interface AgentDetailsResponse {
  agent: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    agentType: string;
    capabilities: string[];
    description: string;
    status: string;
    wallets: Record<string, string>;
    createdAt: string;
    lastActivity: string;
  };
  status: {
    uptime: number;
    totalInteractions: number;
    successRate: number;
    avgResponseTime: number;
    walletBalances: Record<string, string>;
  };
  recentInteractions: Interaction[];
  performance: {
    last24h: PerformanceMetrics;
    last7d: PerformanceMetrics;
    last30d: PerformanceMetrics;
  };
}
```

---

### Update Agent Configuration
Update agent settings and configuration.

**Endpoint:** `PUT /api/agents/[id]`

**Request Body:**
```typescript
interface UpdateAgentRequest {
  name?: string;
  description?: string;
  capabilities?: string[];
  spendingLimit?: number;
  isPublic?: boolean;
  status?: 'active' | 'inactive' | 'maintenance';
}
```

**Response:**
```typescript
interface UpdateAgentResponse {
  agent: Agent;
  updated: string[];
  warnings?: string[];
}
```

---

### Delete Agent
Permanently delete an agent and withdraw remaining funds.

**Endpoint:** `DELETE /api/agents/[id]`

**Query Parameters:**
- `withdrawFunds` (optional): boolean - Whether to withdraw remaining funds

**Response:**
```typescript
interface DeleteAgentResponse {
  success: boolean;
  withdrawnAmount?: number;
  withdrawalTx?: string;
  message: string;
}
```

---

## 💬 Agent Interaction Endpoints

### Interact with Agent
Send a message or command to an agent.

**Endpoint:** `POST /api/agents/[id]/interact`

**Request Body:**
```typescript
interface InteractRequest {
  action: 'chat' | 'weather' | 'crypto_prices' | 'blockchain_tx' | 'status';
  message?: string;
  parameters?: Record<string, any>;
  userLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  sessionId?: string;
  conversationId?: string;
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/agents/123/interact \
  -H "Authorization: Bearer <signature>" \
  -H "X-Wallet-ID: alice.testnet" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "chat",
    "message": "What is the weather like?",
    "userLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "sessionId": "session_123",
    "conversationId": "conv_456"
  }'
```

**Response:**
```typescript
interface InteractResponse {
  response: {
    type: 'text' | 'data' | 'error';
    content: string;
    data?: any;
    metadata?: Record<string, any>;
  };
  interaction: {
    id: number;
    responseTime: number;
    tokensUsed?: number;
    cost: number;
  };
  agent: {
    status: string;
    remainingBalance: number;
  };
}
```

---

### Get Agent Status
Get real-time status of an agent.

**Endpoint:** `GET /api/agents/[id]/status`

**Response:**
```typescript
interface AgentStatusResponse {
  status: {
    current: 'active' | 'inactive' | 'busy' | 'error' | 'maintenance';
    message?: string;
    lastHeartbeat: string;
    uptime: number;
  };
  performance: {
    totalInteractions: number;
    successfulInteractions: number;
    errorCount: number;
    avgResponseTime: number;
  };
  resources: {
    memoryUsage: number;
    cpuUsage: number;
    networkRequests: number;
  };
  walletStatus: {
    balances: Record<string, string>;
    lastUpdate: string;
    lowBalanceWarning: boolean;
  };
}
```

---

### Get Interaction History
Retrieve interaction history for an agent.

**Endpoint:** `GET /api/agents/[id]/history`

**Query Parameters:**
```typescript
interface HistoryQuery {
  page?: number;
  limit?: number;
  action?: string;
  success?: boolean;
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  userWallet?: string;
}
```

**Response:**
```typescript
interface InteractionHistoryResponse {
  interactions: {
    id: number;
    action: string;
    userWallet: string;
    userLocation?: Location;
    requestData: any;
    responseData: any;
    responseTime: number;
    success: boolean;
    cost: number;
    timestamp: string;
  }[];
  pagination: PaginationInfo;
  analytics: {
    totalInteractions: number;
    successRate: number;
    avgResponseTime: number;
    totalCost: number;
    topActions: { action: string; count: number }[];
  };
}
```

---

## 💰 Wallet Operations Endpoints

### Get Agent Wallets
Retrieve all wallet addresses for an agent.

**Endpoint:** `GET /api/agents/[id]/wallets`

**Response:**
```typescript
interface AgentWalletsResponse {
  wallets: {
    near: {
      address: string;
      balance: string;
      balanceUSD: number;
      network: 'mainnet' | 'testnet';
    };
    ethereum: {
      address: string;
      balance: string;
      balanceUSD: number;
      network: 'mainnet' | 'sepolia';
      tokens: { symbol: string; balance: string; balanceUSD: number }[];
    };
    bitcoin: {
      address: string;
      balance: string;
      balanceUSD: number;
      network: 'mainnet' | 'testnet';
    };
  };
  totalBalanceUSD: number;
  lastUpdated: string;
}
```

---

### Fund Agent
Transfer funds to an agent wallet.

**Endpoint:** `POST /api/agents/[id]/fund`

**Request Body:**
```typescript
interface FundAgentRequest {
  amount: number;
  chain: 'near' | 'ethereum' | 'bitcoin';
  token?: string; // For ERC-20 tokens
  fromWallet?: string; // Default: authenticated wallet
}
```

**Response:**
```typescript
interface FundAgentResponse {
  transaction: {
    hash: string;
    chain: string;
    amount: number;
    token: string;
    status: 'pending' | 'confirmed';
    explorerUrl: string;
  };
  agentBalance: {
    before: number;
    after: number;
    currency: string;
  };
}
```

---

### Withdraw from Agent
Withdraw funds from an agent wallet.

**Endpoint:** `POST /api/agents/[id]/withdraw`

**Request Body:**
```typescript
interface WithdrawRequest {
  amount: number;
  chain: 'near' | 'ethereum' | 'bitcoin';
  token?: string;
  toWallet: string;
  reason?: string;
}
```

**Response:**
```typescript
interface WithdrawResponse {
  transaction: {
    hash: string;
    chain: string;
    amount: number;
    token: string;
    fee: number;
    netAmount: number;
    status: 'pending' | 'confirmed';
    explorerUrl: string;
  };
  agentBalance: {
    before: number;
    after: number;
    currency: string;
  };
}
```

---

### Get Transaction History
Get blockchain transaction history for an agent.

**Endpoint:** `GET /api/agents/[id]/transactions`

**Query Parameters:**
```typescript
interface TransactionHistoryQuery {
  page?: number;
  limit?: number;
  chain?: string;
  txType?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  dateFrom?: string;
  dateTo?: string;
}
```

**Response:**
```typescript
interface TransactionHistoryResponse {
  transactions: {
    id: number;
    chain: string;
    txHash: string;
    txType: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    tokenSymbol: string;
    status: string;
    gasUsed?: number;
    transactionFee: number;
    explorerUrl: string;
    timestamp: string;
  }[];
  pagination: PaginationInfo;
  summary: {
    totalTransactions: number;
    totalInflow: number;
    totalOutflow: number;
    totalFees: number;
    byChain: Record<string, number>;
  };
}
```

---

## 🌍 External Service Endpoints

### Weather Data
Get weather information for agent location.

**Endpoint:** `GET /api/weather/[agentId]`

**Query Parameters:**
- `forecast` (optional): boolean - Include forecast data
- `units` (optional): 'metric' | 'imperial' - Temperature units

**Response:**
```typescript
interface WeatherResponse {
  current: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    description: string;
    icon: string;
  };
  forecast?: {
    date: string;
    high: number;
    low: number;
    description: string;
    icon: string;
    precipitation: number;
  }[];
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  lastUpdated: string;
}
```

---

### Cryptocurrency Prices
Get current cryptocurrency prices.

**Endpoint:** `GET /api/crypto/[agentId]`

**Query Parameters:**
```typescript
interface CryptoPricesQuery {
  symbols?: string; // Comma-separated list, default: "near,btc,eth"
  currency?: string; // Default: "usd"
  include24hChange?: boolean;
  includeMarketCap?: boolean;
}
```

**Response:**
```typescript
interface CryptoPricesResponse {
  prices: {
    [symbol: string]: {
      price: number;
      currency: string;
      change24h?: number;
      changePercent24h?: number;
      marketCap?: number;
      volume24h?: number;
      lastUpdated: string;
    };
  };
  timestamp: string;
  source: string;
}
```

---

### Blockchain Information
Get blockchain data and statistics.

**Endpoint:** `GET /api/blockchain/[agentId]`

**Query Parameters:**
- `chain` (required): 'near' | 'ethereum' | 'bitcoin'
- `includeStats` (optional): boolean

**Response:**
```typescript
interface BlockchainInfoResponse {
  chain: string;
  network: string;
  latestBlock: {
    number: number;
    hash: string;
    timestamp: string;
    transactionCount: number;
  };
  stats?: {
    totalTransactions: number;
    averageBlockTime: number;
    networkHashRate?: number;
    totalSupply?: number;
    circulatingSupply?: number;
  };
  agentAddress: string;
  agentBalance: string;
}
```

---

## 🔄 WebSocket API

### Connection
Connect to real-time agent updates via WebSocket.

**Endpoint:** `ws://localhost:3001/agent/[agentId]`

**Connection Headers:**
```typescript
{
  "Authorization": "Bearer <signature>",
  "X-Wallet-ID": "<account_id>"
}
```

### Event Types
```typescript
// Incoming events (from server)
interface WebSocketEvents {
  'agent:status': {
    agentId: string;
    status: string;
    message?: string;
    timestamp: string;
  };
  
  'agent:message': {
    agentId: string;
    type: 'response' | 'notification';
    content: string;
    metadata?: any;
    timestamp: string;
  };
  
  'agent:transaction': {
    agentId: string;
    txHash: string;
    chain: string;
    type: string;
    amount: number;
    status: string;
    timestamp: string;
  };
  
  'system:notification': {
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  };
}

// Outgoing events (to server)
interface ClientEvents {
  'user:message': {
    action: string;
    message?: string;
    parameters?: any;
    sessionId?: string;
  };
  
  'user:ping': {
    timestamp: string;
  };
}
```

### Example WebSocket Usage
```typescript
const ws = new WebSocket('ws://localhost:3001/agent/123', [], {
  headers: {
    'Authorization': 'Bearer <signature>',
    'X-Wallet-ID': 'alice.testnet'
  }
});

ws.on('open', () => {
  console.log('Connected to agent 123');
});

ws.on('message', (data) => {
  const event = JSON.parse(data.toString());
  
  switch (event.type) {
    case 'agent:message':
      handleAgentMessage(event.data);
      break;
    case 'agent:status':
      updateAgentStatus(event.data);
      break;
    case 'agent:transaction':
      handleTransaction(event.data);
      break;
  }
});

// Send message to agent
ws.send(JSON.stringify({
  type: 'user:message',
  data: {
    action: 'chat',
    message: 'Hello agent!',
    sessionId: 'session_123'
  }
}));
```

---

## 📊 Analytics Endpoints

### Agent Analytics
Get detailed analytics for agent performance.

**Endpoint:** `GET /api/agents/[id]/analytics`

**Query Parameters:**
```typescript
interface AnalyticsQuery {
  period: 'hour' | 'day' | 'week' | 'month';
  dateFrom?: string;
  dateTo?: string;
  metrics?: string; // Comma-separated list
}
```

**Response:**
```typescript
interface AnalyticsResponse {
  agent: {
    id: number;
    name: string;
  };
  period: {
    from: string;
    to: string;
    granularity: string;
  };
  metrics: {
    interactions: {
      total: number;
      successful: number;
      failed: number;
      timeline: { timestamp: string; count: number }[];
    };
    performance: {
      avgResponseTime: number;
      successRate: number;
      uptime: number;
      timeline: { timestamp: string; value: number }[];
    };
    financial: {
      totalRevenue: number;
      totalCosts: number;
      netProfit: number;
      timeline: { timestamp: string; revenue: number; costs: number }[];
    };
    users: {
      uniqueUsers: number;
      returningUsers: number;
      averageSessionDuration: number;
    };
  };
}
```

---

## ⚠️ Error Handling

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}
```

### Common Error Codes
- **AUTH_REQUIRED** (401): Authentication required
- **INSUFFICIENT_PERMISSIONS** (403): Insufficient permissions
- **AGENT_NOT_FOUND** (404): Agent not found
- **INSUFFICIENT_FUNDS** (400): Insufficient funds for operation
- **RATE_LIMIT_EXCEEDED** (429): Rate limit exceeded
- **AGENT_BUSY** (409): Agent is currently busy
- **INVALID_PARAMETERS** (400): Invalid request parameters
- **BLOCKCHAIN_ERROR** (500): Blockchain operation failed
- **EXTERNAL_SERVICE_ERROR** (502): External service unavailable

### Rate Limiting
- **Default Limit**: 100 requests per hour per wallet
- **Agent Interactions**: 50 requests per hour per agent
- **Wallet Operations**: 20 requests per hour per wallet
- **Headers**: Rate limit info included in response headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 🔐 Security

### Request Signing
All requests must be signed with NEAR wallet private key.

```typescript
// Example request signing
const message = `${method}:${path}:${timestamp}:${bodyHash}`;
const signature = await wallet.signMessage(message);
```

### CORS Configuration
```
Access-Control-Allow-Origin: https://agentsphere-near.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-Wallet-ID
```

### API Versioning
Current API version: `v1`
Version header: `X-API-Version: v1`

Future versions will be accessible via `/api/v2/` endpoints.