import { useState, useEffect } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { providers, utils } from 'near-api-js';

interface WalletState {
  selector: any;
  modal: any;
  accounts: any[];
  accountId: string | null;
  balance: string;
  isConnected: boolean;
  isLoading: boolean;
}

export const useNearWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    selector: null,
    modal: null,
    accounts: [],
    accountId: null,
    balance: '0',
    isConnected: false,
    isLoading: true,
  });

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    try {
      console.log('Initializing wallet selector...');
      
      // Initialize wallet selector with minimal configuration
      const selector = await setupWalletSelector({
        network: 'testnet',
        modules: [
          setupMyNearWallet(),
        ],
      });

      console.log('Wallet selector initialized');

      // Initialize modal separately
      const modal = setupModal(selector, { contractId: 'guest-book.testnet' });

      // Update state with initialized selector
      setWalletState(prev => ({
        ...prev,
        selector,
        modal,
        isLoading: false,
      }));

      // Check if already connected
      const state = selector.store.getState();
      console.log('Wallet state:', state);
      
      if (state.accounts && state.accounts.length > 0) {
        const accountId = state.accounts[0].accountId;
        console.log('Already connected:', accountId);
        
        const balance = await getAccountBalance(accountId);
        
        setWalletState(prev => ({
          ...prev,
          accounts: state.accounts,
          accountId,
          balance,
          isConnected: true,
        }));
      }

      // Set up subscription to wallet state changes
      selector.store.observable.subscribe((state: any) => {
        console.log('Wallet state changed:', state);
        
        if (state.accounts && state.accounts.length > 0) {
          const accountId = state.accounts[0].accountId;
          getAccountBalance(accountId).then(balance => {
            setWalletState(prev => ({
              ...prev,
              accounts: state.accounts,
              accountId,
              balance,
              isConnected: true,
            }));
          });
        } else {
          setWalletState(prev => ({
            ...prev,
            accounts: [],
            accountId: null,
            balance: '0',
            isConnected: false,
          }));
        }
      });

    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const getAccountBalance = async (accountId: string): Promise<string> => {
    try {
      const provider = new providers.JsonRpcProvider({
        url: 'https://rpc.testnet.near.org',
      });
      
      const account = await provider.query({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      }) as any;

      const balanceInNear = utils.format.formatNearAmount(account.amount, 2);
      console.log(`Balance for ${accountId}:`, balanceInNear);
      return balanceInNear;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  };

  const connectWallet = async () => {
    console.log('Starting sign in process...');
    
    if (!walletState.selector) {
      console.error('Selector not initialized');
      return;
    }

    try {
      // Use modal UI to handle wallet selection and connection
      walletState.modal.show();

    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const disconnectWallet = async () => {
    console.log('Disconnect wallet clicked');
    
    if (!walletState.selector) {
      console.error('Selector not initialized');
      return;
    }

    try {
      const wallet = await walletState.selector.wallet();
      await wallet.signOut();
      
      setWalletState(prev => ({
        ...prev,
        accounts: [],
        accountId: null,
        balance: '0',
        isConnected: false,
      }));
      
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const refreshBalance = async () => {
    console.log('Refresh balance clicked');
    
    if (!walletState.accountId) {
      console.error('No account ID available');
      return;
    }

    try {
      const balance = await getAccountBalance(walletState.accountId);
      setWalletState(prev => ({
        ...prev,
        balance,
      }));
      console.log('Balance refreshed:', balance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  return {
    selector: walletState.selector,
    accounts: walletState.accounts,
    accountId: walletState.accountId,
    balance: walletState.balance,
    isConnected: walletState.isConnected,
    isLoading: walletState.isLoading,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    // Legacy aliases for compatibility
    signIn: connectWallet,
    signOut: disconnectWallet,
    isSignedIn: walletState.isConnected,
  };
};