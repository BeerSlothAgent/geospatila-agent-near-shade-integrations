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
      console.log('Initializing NEAR wallet...');
      
      // Initialize wallet selector with proper configuration
      const selector = await setupWalletSelector({
        network: 'testnet',
        modules: [
          setupMyNearWallet(),
        ],
      });

      console.log('Wallet selector initialized');

      // Setup modal for wallet selection
      const modal = setupModal(selector, {
        contractId: 'guest-book.testnet',
      });

      console.log('Modal setup complete');

      // Update state with initialized components
      setWalletState(prev => ({
        ...prev,
        selector,
        modal,
        isLoading: false,
      }));

      // Check if wallet is already connected
      const state = selector.store.getState();
      console.log('Current wallet state:', state);
      
      if (state.accounts && state.accounts.length > 0) {
        const accountId = state.accounts[0].accountId;
        console.log('Found connected account:', accountId);
        
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
    console.log('Connect wallet clicked');
    
    if (!walletState.modal) {
      console.error('Modal not initialized');
      return;
    }

    try {
      console.log('Showing wallet modal...');
      
      // Force modal to be visible
      const modalElement = document.querySelector('.near-wallet-selector-modal');
      if (modalElement) {
        (modalElement as HTMLElement).style.zIndex = '999999';
        (modalElement as HTMLElement).style.display = 'flex';
      }
      
      walletState.modal.show();
      
      // Additional check to ensure modal is visible
      setTimeout(() => {
        const overlay = document.querySelector('.near-wallet-selector-modal-overlay, .modal-overlay');
        if (overlay) {
          (overlay as HTMLElement).style.zIndex = '999999';
          (overlay as HTMLElement).style.display = 'flex';
          console.log('Modal overlay forced to be visible');
        }
        
        const body = document.querySelector('.near-wallet-selector-modal-body, .modal-body');
        if (body) {
          (body as HTMLElement).style.zIndex = '999999';
          console.log('Modal body forced to be visible');
        }
      }, 100);
      
    } catch (error) {
      console.error('Failed to show wallet modal:', error);
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
    ...walletState,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
};