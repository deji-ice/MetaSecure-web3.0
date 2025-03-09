/* eslint-disable react/prop-types */
import { BrowserProvider, ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/constants";
import toast from "react-hot-toast";
import { useEffect, useState, createContext, useCallback } from "react";

export const TransactionContext = createContext();
const { ethereum } = window;

// Custom toast styling that matches your theme
const toastStyle = {
  style: {
    background: "#1f1f1f",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  success: {
    icon: "🔗",
    duration: 4000,
  },
  error: {
    icon: "❌",
    duration: 4000,
  },
};

const fetchTransactionContract = async () => {
  try {
    if (!ethereum) throw new Error("No ethereum object");
    if (!CONTRACT_ADDRESS) throw new Error("Contract address is not defined");
    if (!CONTRACT_ABI) throw new Error("Contract ABI is not defined");

    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    // Debug logging
    console.log("Contract Address:", CONTRACT_ADDRESS);
    console.log("Contract ABI available:", !!CONTRACT_ABI);

    const transactionContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    return transactionContract;
  } catch (error) {
    console.error("Error creating Ethereum contract:", error);
    toast.error(
      `Contract connection failed: ${error.message}`,
      toastStyle.error
    );
    throw error;
  }
};

const checkIfTransacionsExist = async () => {
  try {
    const transactionContract = await fetchTransactionContract();
    const transactionCount = await transactionContract.getTransactionCount();
    window.localStorage.setItem("transactionCount", transactionCount);
    return transactionCount;
  } catch (error) {
    console.error("Error checking if transactions exist:", error);
  }
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount") || "0"
  );
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getAllTransaction = useCallback(
    async (account = null) => {
      try {
        const accountToUse = account || currentAccount;

        if (!ethereum) throw new Error("Please install MetaMask");
        if (!accountToUse) throw new Error("No account connected");

        const transactionContract = await fetchTransactionContract();
        const availableTransactions =
          await transactionContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction[1],
            addressFrom: transaction[0],
            amount: ethers.formatEther(transaction[2]),
            message: transaction[3],
            keyword: transaction[5],
            timestamp: new Date(Number(transaction[4]) * 1000).toLocaleString(),
          })
        );

        setTransactions(structuredTransactions);
        return structuredTransactions;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }
    },
    [currentAccount]
  );

  const connectWallet = async () => {
    const connectingToast = toast.loading("Connecting wallet...", toastStyle);
    try {
      if (!ethereum) {
        toast.dismiss(connectingToast);
        toast.error(
          "Please install an Ethereum wallet like MetaMask",
          toastStyle.error
        );
        return;
      }

      // Request wallet connection
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        toast.dismiss(connectingToast);
        toast.success(
          `Wallet connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(
            -4
          )}`,
          toastStyle.success
        );

        // FIXED: Pass the account directly instead of relying on state
        try {
          await getAllTransaction(accounts[0]);
        } catch (error) {
          console.error("Error fetching initial transactions:", error);
        }
      } else {
        toast.dismiss(connectingToast);
        toast.error("No accounts found or access denied", toastStyle.error);
        console.log("No accounts found or user denied access");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.dismiss(connectingToast);
      toast.error("Failed to connect wallet", toastStyle.error);
    }
  };

  const sendTransaction = async () => {
    let pendingToast;
    try {
      if (!ethereum) throw new Error("No ethereum object");

      const { addressTo, amount, keyword, message } = formData;
      if (!addressTo || !amount) {
        toast.error("Address and amount are required", toastStyle.error);
        throw new Error("Missing required fields");
      }

      const transactionContract = await fetchTransactionContract();
      const parsedAmount = ethers.parseEther(amount);

      // Show processing toast
      pendingToast = toast.loading("Processing transaction...", toastStyle);

      // First send the transaction
      const transactionParameters = {
        to: addressTo,
        from: currentAccount,
        gas: "0x5208", // 21000 gwei
        value: parsedAmount.toString(),
      };

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      setLoading(true);

      // Then add to blockchain
      const transaction = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      await transaction.wait();
      // Update transaction count in localStorage directly
      const transactionCount = await transactionContract.getTransactionCount();
      window.localStorage.setItem(
        "transactionCount",
        transactionCount.toString()
      );
      setTransactionCount(Number(transactionCount));
      await getAllTransaction(currentAccount); // Refresh transactions list

      setLoading(false);
      setFormData({ addressTo: "", amount: "", keyword: "", message: "" }); // Reset form

      toast.dismiss(pendingToast);
      toast.success(
        `${amount} ETH sent successfully to ${addressTo.slice(
          0,
          6
        )}...${addressTo.slice(-4)}`,
        toastStyle.success
      );

      return txHash;
    } catch (error) {
      console.error("Transaction error:", error);
      setLoading(false);

      // Dismiss pending toast if it exists
      if (pendingToast) toast.dismiss(pendingToast);

      // Show error message
      toast.error(error.message || "Transaction failed", toastStyle.error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    const disconnectToast = toast.loading(
      "Disconnecting wallet...",
      toastStyle
    );

    try {
      // Clear local state
      setCurrentAccount(null);
      setTransactions([]);

      // Reset form data
      setFormData({
        addressTo: "",
        amount: "",
        keyword: "",
        message: "",
      });

      toast.dismiss(disconnectToast);
      toast.success("Wallet disconnected", toastStyle.success);

      console.log("Wallet disconnected from application");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.dismiss(disconnectToast);
      toast.error("Failed to disconnect wallet", toastStyle.error);
    }
  };

  useEffect(() => {
    // No auto-connection logic here - just account change detection
    if (ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          console.log("Account changed:", accounts[0]);
          setCurrentAccount(accounts[0]);
          toast.success(
            `Switched to account: ${accounts[0].slice(
              0,
              6
            )}...${accounts[0].slice(-4)}`,
            toastStyle.success
          );
          getAllTransaction(accounts[0]);
        } else {
          // User disconnected their wallet
          setCurrentAccount(null);
          setTransactions([]);
          toast.error("Wallet disconnected", toastStyle.error);
        }
      };

      ethereum.on("accountsChanged", handleAccountsChanged);

      // Initialize transaction count from localStorage
      const initData = async () => {
        try {
          await checkIfTransacionsExist();
        } catch (error) {
          console.error("Init error:", error);
        }
      };

      initData();

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [getAllTransaction]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        disconnectWallet, // Add this new function
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        loading,
        setLoading,
        getAllTransaction,
        transactionCount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
