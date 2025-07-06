import React, { useState } from 'react';
import { useNearWallet } from '../hooks/useNearWallet';
import { 
  Bot, 
  MapPin, 
  Wallet, 
  Settings, 
  ArrowRight, 
  X,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

interface AgentDeploymentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgentConfig {
  name: string;
  latitude: number;
  longitude: number;
  agentType: 'basic' | 'weather' | 'crypto' | 'defi' | 'custom';
  capabilities: string[];
  description: string;
  initialFunding: number;
  spendingLimit: number;
  isPublic: boolean;
}

const AgentDeployment: React.FC<AgentDeploymentProps> = ({ isOpen, onClose }) => {
  const { accountId, balance, isConnected } = useNearWallet();
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    latitude: 40.7128,
    longitude: -74.0060,
    agentType: 'basic',
    capabilities: ['chat'],
    description: '',
    initialFunding: 1.0,
    spendingLimit: 0.5,
    isPublic: true
  });

  const agentTypes = [
    {
      id: 'basic',
      name: 'Basic Agent',
      description: 'Simple chat and interaction capabilities',
      icon: <Bot className="w-6 h-6" />,
      capabilities: ['chat', 'location_services']
    },
    {
      id: 'weather',
      name: 'Weather Agent',
      description: 'Location-based weather information and forecasts',
      icon: <MapPin className="w-6 h-6" />,
      capabilities: ['chat', 'weather', 'location_services']
    },
    {
      id: 'crypto',
      name: 'Crypto Agent',
      description: 'Cryptocurrency prices and market data',
      icon: <Wallet className="w-6 h-6" />,
      capabilities: ['chat', 'crypto_prices', 'blockchain_tx']
    },
    {
      id: 'defi',
      name: 'DeFi Agent',
      description: 'Decentralized finance operations and monitoring',
      icon: <Settings className="w-6 h-6" />,
      capabilities: ['chat', 'crypto_prices', 'defi_operations', 'blockchain_tx']
    }
  ];

  const allCapabilities = [
    { id: 'chat', name: 'Chat & Conversation', description: 'Natural language interaction' },
    { id: 'weather', name: 'Weather Services', description: 'Real-time weather data' },
    { id: 'crypto_prices', name: 'Crypto Prices', description: 'Live cryptocurrency prices' },
    { id: 'blockchain_tx', name: 'Blockchain Monitoring', description: 'Transaction tracking' },
    { id: 'defi_operations', name: 'DeFi Operations', description: 'Automated DeFi interactions' },
    { id: 'location_services', name: 'Location Services', description: 'GPS and geolocation' },
    { id: 'ai_analysis', name: 'AI Analysis', description: 'Advanced data analysis' }
  ];

  const handleAgentTypeChange = (type: string) => {
    const selectedType = agentTypes.find(t => t.id === type);
    if (selectedType) {
      setConfig(prev => ({
        ...prev,
        agentType: type as any,
        capabilities: selectedType.capabilities
      }));
    }
  };

  const handleCapabilityToggle = (capability: string) => {
    setConfig(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capability)
        ? prev.capabilities.filter(c => c !== capability)
        : [...prev.capabilities, capability]
    }));
  };

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setConfig(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not get your location. Please enter coordinates manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const validateConfig = (): boolean => {
    if (!config.name.trim()) {
      setError('Agent name is required');
      return false;
    }
    if (config.capabilities.length === 0) {
      setError('At least one capability must be selected');
      return false;
    }
    if (config.initialFunding <= 0) {
      setError('Initial funding must be greater than 0');
      return false;
    }
    if (parseFloat(balance) < config.initialFunding) {
      setError(`Insufficient balance. You have ${balance} NEAR but need ${config.initialFunding} NEAR`);
      return false;
    }
    setError(null);
    return true;
  };

  const deployAgent = async () => {
    if (!validateConfig()) return;

    setIsDeploying(true);
    setError(null);

    try {
      // Simulate agent deployment (replace with actual NEAR contract call)
      console.log('Deploying agent with config:', config);
      
      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock deployment result
      const result = {
        agentId: `agent_${Date.now()}`,
        contractAddress: `${config.name.toLowerCase().replace(/\s+/g, '-')}.${accountId}`,
        wallets: {
          near: `${config.name.toLowerCase().replace(/\s+/g, '-')}-near.testnet`,
          ethereum: `0x${Math.random().toString(16).substr(2, 40)}`,
          bitcoin: `bc1${Math.random().toString(36).substr(2, 39)}`
        },
        deploymentTx: `${Math.random().toString(36).substr(2, 64)}`,
        status: 'active'
      };

      setDeploymentResult(result);
      setStep(4);
    } catch (error) {
      console.error('Deployment failed:', error);
      setError('Failed to deploy agent. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setConfig({
      name: '',
      latitude: 40.7128,
      longitude: -74.0060,
      agentType: 'basic',
      capabilities: ['chat'],
      description: '',
      initialFunding: 1.0,
      spendingLimit: 0.5,
      isPublic: true
    });
    setDeploymentResult(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Deploy New Agent</h2>
              <p className="text-sm text-gray-500">Step {step} of 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum < step ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    stepNum < step ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Name *
                    </label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Weather Agent NYC"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={config.description}
                      onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what your agent does..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={config.isPublic}
                      onChange={(e) => setConfig(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Make this agent publicly accessible
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!config.name.trim()}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Agent Type & Capabilities */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Type</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {agentTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleAgentTypeChange(type.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        config.agentType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          config.agentType === type.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {type.icon}
                        </div>
                        <h4 className="font-medium text-gray-900">{type.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>

                <h4 className="font-medium text-gray-900 mb-3">Capabilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allCapabilities.map((capability) => (
                    <div
                      key={capability.id}
                      onClick={() => handleCapabilityToggle(capability.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        config.capabilities.includes(capability.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.capabilities.includes(capability.id)}
                          onChange={() => {}}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <h5 className="font-medium text-gray-900">{capability.name}</h5>
                          <p className="text-xs text-gray-600">{capability.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location & Funding */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Funding</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Location
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          step="any"
                          value={config.latitude}
                          onChange={(e) => setConfig(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                          placeholder="Latitude"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          step="any"
                          value={config.longitude}
                          onChange={(e) => setConfig(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                          placeholder="Longitude"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleLocationUpdate}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      📍 Use my current location
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Funding (NEAR)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={config.initialFunding}
                      onChange={(e) => setConfig(prev => ({ ...prev, initialFunding: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available balance: {balance} NEAR
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spending Limit (NEAR)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={config.spendingLimit}
                      onChange={(e) => setConfig(prev => ({ ...prev, spendingLimit: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum amount the agent can spend per transaction
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={deployAgent}
                  disabled={isDeploying}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isDeploying ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Deploying...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Deploy Agent</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && deploymentResult && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Agent Deployed Successfully!</h3>
                <p className="text-gray-600">Your autonomous agent is now active and ready for interactions.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
                  <p className="font-mono text-sm bg-white p-2 rounded border">{deploymentResult.agentId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract Address</label>
                  <p className="font-mono text-sm bg-white p-2 rounded border">{deploymentResult.contractAddress}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Generated Wallets</label>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border">
                      <span className="text-xs text-gray-500">NEAR:</span>
                      <p className="font-mono text-sm">{deploymentResult.wallets.near}</p>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <span className="text-xs text-gray-500">Ethereum:</span>
                      <p className="font-mono text-sm">{deploymentResult.wallets.ethereum}</p>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <span className="text-xs text-gray-500">Bitcoin:</span>
                      <p className="font-mono text-sm">{deploymentResult.wallets.bitcoin}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Deploy Another Agent
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDeployment;