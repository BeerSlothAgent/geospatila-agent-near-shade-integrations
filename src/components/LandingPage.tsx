import React, { useState, useEffect } from 'react';
import { useNearWallet } from '../hooks/useNearWallet';
import { 
  Bot, 
  Wallet, 
  Globe, 
  Zap, 
  Shield, 
  TrendingUp,
  ArrowRight,
  Github,
  Twitter,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Cpu,
  DollarSign,
  Users,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  // Use real NEAR wallet hook
  const { 
    isConnected: isWalletConnected,
    accountId, 
    balance, 
    isLoading: walletLoading,
    connectWallet, 
    disconnectWallet,
    refreshBalance 
  } = useNearWallet();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Autonomous AI Agents",
      description: "Deploy intelligent agents that operate independently with multi-chain wallet access"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location-Based Services",
      description: "Precision GPS integration for location-aware agent interactions and services"
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Multi-Chain Wallets",
      description: "NEAR Chain Signatures enable agents to manage NEAR, Ethereum, and Bitcoin wallets"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Interactions",
      description: "WebSocket-powered live communication between users and autonomous agents"
    }
  ];

  const stats = [
    { number: "100+", label: "Active Agents", icon: <Bot className="w-5 h-5" /> },
    { number: "$50K+", label: "Managed Funds", icon: <DollarSign className="w-5 h-5" /> },
    { number: "10K+", label: "Interactions", icon: <MessageCircle className="w-5 h-5" /> },
    { number: "500+", label: "Developers", icon: <Users className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Blockchain Developer",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "AgentSphere NEAR made it incredibly easy to deploy my first autonomous agent. The wallet integration is seamless!"
    },
    {
      name: "Sarah Martinez",
      role: "AI Researcher",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The location-based features opened up entirely new possibilities for my research projects. Amazing platform!"
    },
    {
      name: "David Kumar",
      role: "DeFi Developer",
      avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Multi-chain wallet support through Chain Signatures is a game-changer. My agents can now operate across ecosystems."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AgentSphere NEAR</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="https://docs.near.org/ai/shade-agents" target="_blank" className="text-gray-300 hover:text-white transition-colors">Docs</a>
              
              {walletLoading ? (
                <div className="bg-gray-500/20 text-gray-400 px-4 py-2 rounded-lg border border-gray-500/30">
                  <span className="text-sm font-medium">Initializing wallet...</span>
                </div>
              ) : !isWalletConnected ? (
                <button 
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-sm">
                      <div className="font-medium">{accountId}</div>
                      <div className="text-xs text-green-300">{balance} NEAR</div>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={refreshBalance}
                    className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-sm font-medium"
                    title="Refresh Balance"
                  >
                    ↻
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white">How it Works</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white">Testimonials</a>
              <a href="https://docs.near.org/ai/shade-agents" target="_blank" className="block text-gray-300 hover:text-white">Docs</a>
              
              {walletLoading ? (
                <div className="w-full bg-gray-500/20 text-gray-400 px-6 py-3 rounded-lg border border-gray-500/30 text-center">
                  Loading wallet...
                </div>
              ) : !isWalletConnected ? (
                <button 
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Connect NEAR Wallet
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 bg-green-500/20 text-green-400 px-4 py-3 rounded-lg border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-sm text-center">
                      <div className="font-medium">{accountId}</div>
                      <div className="text-xs text-green-300">{balance} NEAR</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={refreshBalance}
                      className="flex-1 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-sm font-medium"
                    >
                      Refresh
                    </button>
                    <button
                      onClick={disconnectWallet}
                      className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 text-sm font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full border border-blue-500/30 mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Connect Your NEAR Testnet Wallet</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Deploy{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Autonomous
              </span>
              <br />
              AI Agents on NEAR
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Build, test, and deploy location-based autonomous AI agents with multi-chain wallet integration 
              powered by NEAR Shade Agents and Chain Signatures.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {walletLoading ? (
                <div className="bg-gray-500/20 text-gray-400 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-500/30">
                  Loading wallet...
                </div>
              ) : !isWalletConnected ? (
                <button 
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Connect NEAR Wallet</span>
                </button>
              ) : (
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>Deploy Your First Agent</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              
              <a 
                href="https://github.com/agentsphere-near" 
                target="_blank"
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </a>
            </div>

            {/* Testnet Notice */}
            {!isWalletConnected && !walletLoading && (
              <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg inline-block">
                <div className="text-yellow-400 text-sm space-y-2">
                  <p>
                    🚰 Need testnet NEAR? Get free tokens at{' '}
                    <a href="https://near-faucet.io" target="_blank" className="underline hover:text-yellow-300">
                      near-faucet.io
                    </a>
                  </p>
                  <p>
                    🔗 Clicking "Connect Wallet" will redirect you to MyNEAR Wallet
                  </p>
                </div>
              </div>
            )}

            {/* Connection Success Notice */}
            {isWalletConnected && (
              <div className="mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-lg inline-block">
                <p className="text-green-400 text-sm">
                  ✅ Successfully connected to {accountId} with {balance} NEAR
                </p>
              </div>
            )}
          </div>

          {/* Connection Instructions */}
          {!isWalletConnected && !walletLoading && (
            <div className="mt-12 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">How to Connect:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                  <div className="text-blue-400 font-medium mb-2">1. Click Connect</div>
                  <div className="text-gray-300">Click the "Connect NEAR Wallet" button above</div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                  <div className="text-blue-400 font-medium mb-2">2. Sign In</div>
                  <div className="text-gray-300">You'll be redirected to MyNEAR Wallet to sign in</div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                  <div className="text-blue-400 font-medium mb-2">3. Authorize</div>
                  <div className="text-gray-300">Approve the connection and return to AgentSphere</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have a NEAR testnet account?{' '}
                  <a href="https://near-faucet.io" target="_blank" className="underline hover:text-yellow-300">
                    Create one here
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
                <div className="flex justify-center mb-2 text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Autonomous Agents
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to build, test, and deploy intelligent agents that operate independently on the blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Feature Showcase */}
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {features[activeFeature].description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">One-click deployment to NEAR testnet</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Real-time monitoring and analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Complete wallet and transaction management</span>
                  </div>
                </div>

                <button className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-green-400">$ npm install @neardefi/shade-agent-cli</div>
                    <div className="text-blue-400">$ shade-agent deploy --type weather</div>
                    <div className="text-gray-400">Deploying agent to NEAR testnet...</div>
                    <div className="text-green-400">✓ Agent deployed successfully!</div>
                    <div className="text-gray-400">Agent ID: weather-agent-nyc-001</div>
                    <div className="text-gray-400">Wallets generated: NEAR, ETH, BTC</div>
                    <div className="text-green-400">✓ Ready for interactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started with autonomous AI agents in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Wallet",
                description: "Connect your NEAR testnet wallet to get started. We'll guide you through the setup process.",
                icon: <Wallet className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "Deploy Your Agent",
                description: "Choose your agent type, set location, and configure capabilities. Deploy with one click.",
                icon: <Bot className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Interact & Monitor",
                description: "Chat with your agent, monitor performance, and watch it operate autonomously.",
                icon: <TrendingUp className="w-8 h-8" />
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center p-8 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-500 mb-4">{item.step}</div>
                  <div className="flex justify-center mb-4 text-blue-400">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Developers Are Saying
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the growing community of developers building the future with autonomous AI agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Deploy Your First{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Autonomous Agent?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join the future of autonomous AI on the blockchain. Start building intelligent agents that work for you 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {walletLoading ? (
              <div className="bg-gray-500/20 text-gray-400 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-500/30">
                Loading wallet...
              </div>
            ) : !isWalletConnected ? (
              <>
                <button 
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Get Started Now</span>
                </button>
                <a 
                  href="https://near-faucet.io" 
                  target="_blank"
                  className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500/10 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Get Testnet NEAR</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </>
            ) : (
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Deploy Your First Agent</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">AgentSphere NEAR</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The leading platform for deploying and testing autonomous AI agents on NEAR Protocol with multi-chain wallet integration.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/agentsphere-near" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/agentsphere_near" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://discord.gg/agentsphere" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <div className="space-y-2">
                <a href="https://docs.near.org/ai/shade-agents" target="_blank" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API Reference</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Tutorials</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Examples</a>
              </div>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-semibold text-white mb-4">Community</h3>
              <div className="space-y-2">
                <a href="https://near-faucet.io" target="_blank" className="block text-gray-400 hover:text-white transition-colors">Testnet Faucet</a>
                <a href="https://testnet.nearblocks.io" target="_blank" className="block text-gray-400 hover:text-white transition-colors">NEAR Explorer</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Discord</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgentSphere NEAR. Built for the NEAR ecosystem with ❤️</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      {scrollY > 100 && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 z-40"
        >
          <ChevronDown className="w-5 h-5 transform rotate-180" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;