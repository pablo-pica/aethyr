import { useState, useEffect, useCallback } from "react";
import { isConnected, getAddress, requestAccess, signTransaction } from "@stellar/freighter-api";
import { Horizon, Networks, TransactionBuilder, Asset, Operation } from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  error: string | null;
  isLoading: boolean;
}

export function useFreighter() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    error: null,
    isLoading: true,
  });

  // Fetch native XLM balance
  const fetchBalance = useCallback(async (publicKey: string) => {
    try {
      const account = await server.loadAccount(publicKey);
      const nativeBalance = account.balances.find(
        (b) => b.asset_type === "native"
      );
      return nativeBalance ? nativeBalance.balance : "0.0000000";
    } catch (err: any) {
      console.error("Error fetching balance:", err);
      // Account might not exist (not funded)
      if (err.response?.status === 404) {
        return "0.0000000 (Unfunded)";
      }
      return "0.0000000";
    }
  }, []);

  // Update address and balance state
  const checkConnection = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const connectionResult = await isConnected();
      if (connectionResult && connectionResult.isConnected) {
        const addressResult = await getAddress();
        if (addressResult && addressResult.address && !addressResult.error) {
          const balance = await fetchBalance(addressResult.address);
          setState({
            isConnected: true,
            address: addressResult.address,
            balance,
            error: null,
            isLoading: false,
          });
          return;
        }
      }
      setState({
        isConnected: false,
        address: null,
        balance: null,
        error: null,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Connection check failed:", err);
      setState({
        isConnected: false,
        address: null,
        balance: null,
        error: err.message || "Failed to connect to Freighter",
        isLoading: false,
      });
    }
  }, [fetchBalance]);

  // Connect wallet
  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const connectionResult = await isConnected();
      if (!connectionResult || !connectionResult.isConnected) {
        throw new Error("Freighter extension is not installed or enabled.");
      }
      
      const accessResult = await requestAccess();
      if (accessResult.error) {
        throw new Error(accessResult.error.message || "User declined to share their public key.");
      }

      if (!accessResult.address) {
        throw new Error("No address returned from Freighter.");
      }

      const balance = await fetchBalance(accessResult.address);
      setState({
        isConnected: true,
        address: accessResult.address,
        balance,
        error: null,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Connect failed:", err);
      setState((prev) => ({
        ...prev,
        error: err.message || "Failed to connect to Freighter",
        isLoading: false,
      }));
    }
  }, [fetchBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      balance: null,
      error: null,
      isLoading: false,
    });
  }, []);

  // Send XLM transaction
  const sendXLM = useCallback(async (destination: string, amount: string) => {
    if (!state.address) {
      throw new Error("Wallet is not connected.");
    }
    
    try {
      // 1. Load sender account to fetch correct sequence number
      const account = await server.loadAccount(state.address);
      const fee = await server.fetchBaseFee();

      // 2. Build the transaction
      const transaction = new TransactionBuilder(account, {
        fee: fee.toString(),
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination,
            asset: Asset.native(),
            amount,
          })
        )
        .setTimeout(60) // 1 minute timeout
        .build();

      const xdr = transaction.toEnvelope().toXDR("base64");

      // 3. Request Freighter signature
      const { signedTxXdr, error } = await signTransaction(xdr, {
        networkPassphrase: Networks.TESTNET,
      });

      if (error) {
        throw new Error(`Signing failed: ${error.message || error}`);
      }

      if (!signedTxXdr) {
        throw new Error("Transaction was not signed.");
      }

      // 4. Reconstruct signed transaction and submit it
      const signedTransaction = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
      const result = await server.submitTransaction(signedTransaction);

      // 5. Update local balance after success
      await checkConnection();

      return result;
    } catch (err: any) {
      console.error("Payment failed:", err);
      throw err;
    }
  }, [state.address, checkConnection]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    ...state,
    connect,
    disconnect,
    sendXLM,
    refresh: checkConnection,
  };
}
