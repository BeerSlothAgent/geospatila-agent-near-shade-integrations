# Database Schemas Documentation

## 📊 Database Architecture Overview

The AgentSphere NEAR project uses Supabase (PostgreSQL) for robust, real-time data management with the following core principles:

- **Real-time Updates**: Live synchronization across all clients
- **Type Safety**: Strong typing with generated TypeScript types
- **Scalability**: Optimized for high-throughput agent operations
- **Security**: Row-level security (RLS) for data protection
- **Analytics**: Comprehensive tracking for insights

---

## 🤖 Core Agent Schema

### Agents Table
Primary table for storing agent configurations and metadata.

```sql
CREATE TABLE agents (
  -- Primary identification
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  
  -- Location data (required for location-based agents)
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_accuracy DECIMAL(5, 2) DEFAULT 10.0, -- meters
  
  -- Agent configuration
  agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN (
    'basic', 'weather', 'crypto', 'defi', 'custom'
  )),
  capabilities JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  
  -- NEAR Shade Agent integration
  shade_agent_id VARCHAR(100) UNIQUE,
  contract_address VARCHAR(100),
  deployer_wallet VARCHAR(100) NOT NULL,
  
  -- Multi-chain wallet addresses
  agent_wallets JSONB DEFAULT '{
    "near": null,
    "ethereum": null, 
    "bitcoin": null,
    "solana": null
  }'::jsonb,
  
  -- Agent state and configuration
  status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN (
    'inactive', 'active', 'busy', 'error', 'maintenance'
  )),
  is_autonomous BOOLEAN DEFAULT false,
  initial_funding DECIMAL(20, 8) DEFAULT 0,
  spending_limit DECIMAL(20, 8) DEFAULT 1.0,
  
  -- Access control
  is_public BOOLEAN DEFAULT false,
  authorized_users JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_location CHECK (
    latitude BETWEEN -90 AND 90 AND 
    longitude BETWEEN -180 AND 180
  ),
  CONSTRAINT positive_funding CHECK (initial_funding >= 0),
  CONSTRAINT positive_spending_limit CHECK (spending_limit >= 0)
);

-- Indexes for performance
CREATE INDEX idx_agents_shade_agent_id ON agents(shade_agent_id);
CREATE INDEX idx_agents_deployer_wallet ON agents(deployer_wallet);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_location ON agents(latitude, longitude);
CREATE INDEX idx_agents_created_at ON agents(created_at);

-- RLS Policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public agents" ON agents
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own agents" ON agents
  FOR SELECT USING (deployer_wallet = current_setting('request.jwt.claim.wallet_id', true));

CREATE POLICY "Users can manage their own agents" ON agents
  FOR ALL USING (deployer_wallet = current_setting('request.jwt.claim.wallet_id', true));
```

### Agent Capabilities Schema
```sql
-- Capabilities enum for type safety
CREATE TYPE agent_capability AS ENUM (
  'chat',
  'weather',
  'crypto_prices',
  'blockchain_tx',
  'defi_operations',
  'location_services',
  'ai_analysis',
  'social_media',
  'data_collection',
  'automated_trading'
);

-- Agent capabilities junction table
CREATE TABLE agent_capabilities (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  capability agent_capability NOT NULL,
  configuration JSONB DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN DEFAULT true,
  cost_per_use DECIMAL(10, 8) DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(agent_id, capability)
);

CREATE INDEX idx_agent_capabilities_agent_id ON agent_capabilities(agent_id);
CREATE INDEX idx_agent_capabilities_capability ON agent_capabilities(capability);
```

---

## 📊 Agent Status & Performance Schema

### Agent Status Table
Real-time status tracking and performance metrics.

```sql
CREATE TABLE agent_status (
  agent_id INTEGER PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Current status
  status VARCHAR(20) DEFAULT 'inactive',
  status_message TEXT,
  last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Performance metrics
  uptime_seconds INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  successful_interactions INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  
  -- Resource usage
  memory_usage_mb INTEGER DEFAULT 0,
  cpu_usage_percent DECIMAL(5, 2) DEFAULT 0,
  network_requests_count INTEGER DEFAULT 0,
  
  -- Financial tracking
  total_spent DECIMAL(20, 8) DEFAULT 0,
  total_earned DECIMAL(20, 8) DEFAULT 0,
  wallet_balances JSONB DEFAULT '{
    "near": "0",
    "ethereum": "0", 
    "bitcoin": "0",
    "solana": "0"
  }'::jsonb,
  last_balance_update TIMESTAMP WITH TIME ZONE,
  
  -- Location tracking
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  location_updated_at TIMESTAMP WITH TIME ZONE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agent_status_status ON agent_status(status);
CREATE INDEX idx_agent_status_last_heartbeat ON agent_status(last_heartbeat);
CREATE INDEX idx_agent_status_location ON agent_status(current_latitude, current_longitude);

-- RLS
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view status of their agents" ON agent_status
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents 
      WHERE deployer_wallet = current_setting('request.jwt.claim.wallet_id', true)
    )
  );
```

---

## 💬 Agent Interactions Schema

### Agent Interactions Table
Comprehensive logging of all agent interactions.

```sql
CREATE TABLE agent_interactions (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  
  -- User information
  user_wallet VARCHAR(100),
  user_location JSONB, -- {latitude, longitude, accuracy}
  user_ip_address INET,
  user_agent TEXT,
  
  -- Interaction details
  action VARCHAR(50) NOT NULL,
  request_data JSONB,
  response_data JSONB,
  
  -- Performance metrics
  response_time_ms INTEGER,
  tokens_consumed INTEGER DEFAULT 0,
  cost_incurred DECIMAL(20, 8) DEFAULT 0,
  
  -- Status and error handling
  success BOOLEAN DEFAULT true,
  error_code VARCHAR(50),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Context and metadata
  session_id VARCHAR(100),
  conversation_id VARCHAR(100),
  interaction_type VARCHAR(30) DEFAULT 'user_initiated' CHECK (
    interaction_type IN ('user_initiated', 'autonomous', 'scheduled', 'system')
  ),
  
  -- Timestamps
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for analytics and performance
CREATE INDEX idx_agent_interactions_agent_id ON agent_interactions(agent_id);
CREATE INDEX idx_agent_interactions_user_wallet ON agent_interactions(user_wallet);
CREATE INDEX idx_agent_interactions_timestamp ON agent_interactions(timestamp);
CREATE INDEX idx_agent_interactions_action ON agent_interactions(action);
CREATE INDEX idx_agent_interactions_success ON agent_interactions(success);
CREATE INDEX idx_agent_interactions_conversation ON agent_interactions(conversation_id);

-- Composite indexes for common queries
CREATE INDEX idx_agent_interactions_agent_timestamp ON agent_interactions(agent_id, timestamp DESC);
CREATE INDEX idx_agent_interactions_user_timestamp ON agent_interactions(user_wallet, timestamp DESC);

-- RLS
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions with their agents" ON agent_interactions
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents 
      WHERE deployer_wallet = current_setting('request.jwt.claim.wallet_id', true)
    ) OR
    user_wallet = current_setting('request.jwt.claim.wallet_id', true)
  );
```

---

## 💰 Financial & Transaction Schema

### Agent Transactions Table
Blockchain transaction tracking for all agent wallets.

```sql
CREATE TYPE blockchain_network AS ENUM (
  'near-mainnet', 'near-testnet',
  'ethereum-mainnet', 'ethereum-sepolia',
  'bitcoin-mainnet', 'bitcoin-testnet',
  'solana-mainnet', 'solana-devnet'
);

CREATE TYPE transaction_type AS ENUM (
  'funding', 'withdrawal', 'payment', 'fee',
  'smart_contract', 'nft_mint', 'nft_transfer',
  'defi_swap', 'defi_stake', 'defi_unstake'
);

CREATE TABLE agent_transactions (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Blockchain details
  chain blockchain_network NOT NULL,
  tx_hash VARCHAR(100) NOT NULL,
  block_number BIGINT,
  block_hash VARCHAR(100),
  
  -- Transaction details
  tx_type transaction_type NOT NULL,
  from_address VARCHAR(100),
  to_address VARCHAR(100),
  amount DECIMAL(30, 18), -- Support for high precision
  token_symbol VARCHAR(20) DEFAULT 'NATIVE',
  token_address VARCHAR(100),
  
  -- Status and confirmation
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'failed', 'cancelled'
  )),
  confirmation_count INTEGER DEFAULT 0,
  
  -- Cost analysis
  gas_limit BIGINT,
  gas_used BIGINT,
  gas_price DECIMAL(30, 18),
  transaction_fee DECIMAL(30, 18),
  
  -- Metadata
  description TEXT,
  internal_reference VARCHAR(100),
  interaction_id INTEGER REFERENCES agent_interactions(id),
  
  -- Timestamps
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(chain, tx_hash)
);

-- Indexes
CREATE INDEX idx_agent_transactions_agent_id ON agent_transactions(agent_id);
CREATE INDEX idx_agent_transactions_chain ON agent_transactions(chain);
CREATE INDEX idx_agent_transactions_status ON agent_transactions(status);
CREATE INDEX idx_agent_transactions_tx_hash ON agent_transactions(tx_hash);
CREATE INDEX idx_agent_transactions_initiated_at ON agent_transactions(initiated_at);

-- Composite indexes
CREATE INDEX idx_agent_transactions_agent_chain ON agent_transactions(agent_id, chain);
CREATE INDEX idx_agent_transactions_status_initiated ON agent_transactions(status, initiated_at);

-- RLS
ALTER TABLE agent_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transactions of their agents" ON agent_transactions
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents 
      WHERE deployer_wallet = current_setting('request.jwt.claim.wallet_id', true)
    )
  );
```

### Agent Balances Table
Cached wallet balances for quick access.

```sql
CREATE TABLE agent_balances (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  chain blockchain_network NOT NULL,
  wallet_address VARCHAR(100) NOT NULL,
  
  -- Balance details
  native_balance DECIMAL(30, 18) DEFAULT 0,
  token_balances JSONB DEFAULT '{}'::jsonb, -- {symbol: balance}
  
  -- USD values (cached from price feeds)
  native_balance_usd DECIMAL(15, 2) DEFAULT 0,
  total_balance_usd DECIMAL(15, 2) DEFAULT 0,
  
  -- Update tracking
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_frequency_minutes INTEGER DEFAULT 5,
  
  UNIQUE(agent_id, chain, wallet_address)
);

CREATE INDEX idx_agent_balances_agent_id ON agent_balances(agent_id);
CREATE INDEX idx_agent_balances_chain ON agent_balances(chain);
CREATE INDEX idx_agent_balances_last_updated ON agent_balances(last_updated);
```

---

## 🔐 Security & Access Control Schema

### Agent Permissions Table
Fine-grained access control for agent operations.

```sql
CREATE TYPE permission_type AS ENUM (
  'view', 'interact', 'configure', 'fund', 'withdraw', 'delete'
);

CREATE TABLE agent_permissions (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  user_wallet VARCHAR(100) NOT NULL,
  permission permission_type NOT NULL,
  
  -- Permission constraints
  max_amount DECIMAL(20, 8), -- For funding/withdrawal permissions
  rate_limit_per_hour INTEGER DEFAULT 100,
  expiry_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  granted_by VARCHAR(100) NOT NULL, -- Wallet that granted permission
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  
  UNIQUE(agent_id, user_wallet, permission)
);

CREATE INDEX idx_agent_permissions_agent_id ON agent_permissions(agent_id);
CREATE INDEX idx_agent_permissions_user_wallet ON agent_permissions(user_wallet);
CREATE INDEX idx_agent_permissions_permission ON agent_permissions(permission);
```

### Security Audit Log
```sql
CREATE TABLE security_audit_log (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Event details
  event_type VARCHAR(50) NOT NULL,
  event_description TEXT,
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN (
    'info', 'warning', 'error', 'critical'
  )),
  
  -- Actor information
  actor_wallet VARCHAR(100),
  actor_ip INET,
  actor_user_agent TEXT,
  
  -- Event data
  event_data JSONB,
  
  -- Timestamps
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_security_audit_log_agent_id ON security_audit_log(agent_id);
CREATE INDEX idx_security_audit_log_severity ON security_audit_log(severity);
CREATE INDEX idx_security_audit_log_timestamp ON security_audit_log(timestamp);
CREATE INDEX idx_security_audit_log_actor ON security_audit_log(actor_wallet);
```

---

## 📈 Analytics & Reporting Schema

### Agent Analytics Table
Aggregated metrics for performance analysis.

```sql
CREATE TABLE agent_analytics (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Time period
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  period_type VARCHAR(10) DEFAULT 'daily' CHECK (period_type IN (
    'hourly', 'daily', 'weekly', 'monthly'
  )),
  
  -- Usage metrics
  total_interactions INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  successful_interactions INTEGER DEFAULT 0,
  failed_interactions INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  
  -- Financial metrics
  total_revenue DECIMAL(20, 8) DEFAULT 0,
  total_costs DECIMAL(20, 8) DEFAULT 0,
  net_profit DECIMAL(20, 8) DEFAULT 0,
  
  -- Performance metrics
  uptime_percentage DECIMAL(5, 2) DEFAULT 100,
  error_rate DECIMAL(5, 2) DEFAULT 0,
  user_satisfaction_score DECIMAL(3, 2), -- 1-5 scale
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(agent_id, period_start, period_type)
);

CREATE INDEX idx_agent_analytics_agent_id ON agent_analytics(agent_id);
CREATE INDEX idx_agent_analytics_period ON agent_analytics(period_start, period_end);
CREATE INDEX idx_agent_analytics_period_type ON agent_analytics(period_type);
```

---

## 🔄 Triggers & Functions

### Update Timestamp Trigger
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON agents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_status_updated_at 
  BEFORE UPDATE ON agent_status 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Agent Status Update Function
```sql
-- Function to update agent status automatically
CREATE OR REPLACE FUNCTION update_agent_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_activity in agents table
  UPDATE agents 
  SET last_activity = NOW() 
  WHERE id = NEW.agent_id;
  
  -- Update interaction count in agent_status
  UPDATE agent_status 
  SET total_interactions = total_interactions + 1,
      successful_interactions = CASE 
        WHEN NEW.success THEN successful_interactions + 1 
        ELSE successful_interactions 
      END,
      error_count = CASE 
        WHEN NOT NEW.success THEN error_count + 1 
        ELSE error_count 
      END,
      last_heartbeat = NOW()
  WHERE agent_id = NEW.agent_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_agent_activity
  AFTER INSERT ON agent_interactions
  FOR EACH ROW EXECUTE FUNCTION update_agent_activity();
```

---

## 🚀 Performance Optimization

### Partitioning Strategy
```sql
-- Partition agent_interactions by month for better performance
CREATE TABLE agent_interactions_y2025m01 PARTITION OF agent_interactions
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE agent_interactions_y2025m02 PARTITION OF agent_interactions
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### Materialized Views for Analytics
```sql
-- Real-time agent performance summary
CREATE MATERIALIZED VIEW agent_performance_summary AS
SELECT 
  a.id,
  a.name,
  a.agent_type,
  a.status,
  ast.total_interactions,
  ast.successful_interactions,
  ROUND((ast.successful_interactions::DECIMAL / NULLIF(ast.total_interactions, 0)) * 100, 2) as success_rate,
  ast.avg_response_time_ms,
  ast.total_spent,
  ast.total_earned,
  (ast.total_earned - ast.total_spent) as net_profit
FROM agents a
LEFT JOIN agent_status ast ON a.id = ast.agent_id;

-- Refresh periodically
CREATE UNIQUE INDEX ON agent_performance_summary (id);
```

---

## 📋 Data Validation & Constraints

### Custom Check Constraints
```sql
-- Ensure agent wallets have valid format
ALTER TABLE agents ADD CONSTRAINT valid_agent_wallets 
CHECK (
  agent_wallets ? 'near' AND 
  agent_wallets ? 'ethereum' AND 
  agent_wallets ? 'bitcoin'
);

-- Ensure reasonable response times
ALTER TABLE agent_interactions ADD CONSTRAINT reasonable_response_time
CHECK (response_time_ms BETWEEN 0 AND 300000); -- Max 5 minutes

-- Ensure positive balances
ALTER TABLE agent_balances ADD CONSTRAINT positive_native_balance
CHECK (native_balance >= 0);
```

### Data Integrity Functions
```sql
-- Function to validate agent capabilities
CREATE OR REPLACE FUNCTION validate_agent_capabilities(capabilities jsonb)
RETURNS boolean AS $$
DECLARE
  valid_capabilities text[] := ARRAY['chat', 'weather', 'crypto_prices', 'blockchain_tx', 'defi_operations'];
  capability text;
BEGIN
  FOR capability IN SELECT jsonb_array_elements_text(capabilities)
  LOOP
    IF capability != ALL(valid_capabilities) THEN
      RETURN false;
    END IF;
  END LOOP;
  RETURN true;
END;
$$ LANGUAGE plpgsql;
```