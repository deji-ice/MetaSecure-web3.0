import { BrowserProvider, ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/constants";
import toast from "react-hot-toast";
import { useEffect, useState, createContext, useCallback } from "react";
import PropTypes from "prop-types";

export const TransactionContext = createContext();
const { ethereum } = typeof window !== "undefined" ? window : {};

// Network mapping
const networkNames = {
  "0x1": "Ethereum Mainnet",
  "0x5": "Goerli Testnet",
  "0xaa36a7": "Sepolia Testnet",
  "0x89": "Polygon Mainnet",
  "0xa4b1": "Arbitrum One",
  "0xa": "Optimism",
  "0x2105": "Base",
};

// Toast styling
const toastStyle = {
  style: {
    background: "#1f1f1f",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  success: { icon: "🔗", duration: 4000 },
  error: { icon: "❌", duration: 4000 },
};

// Helper to produce friendly error messages
const getFriendlyError = (error, defaultMsg) => {
  if (
    error.code === -32002 ||
    (error.message &&
      error.message.includes("Already processing eth_requestAccounts"))
  ) {
    return "Wallet connection request is already in progress. Please check your wallet.";
  }
  if (
    error.code === 4001 ||
    (error.message && error.message.includes("User rejected"))
  ) {
    return "Wallet connection was rejected by the user.";
  }
  return defaultMsg;
};

const fetchTransactionContract = async () => {
  try {
    if (!ethereum) throw new Error("No ethereum object");
    if (!CONTRACT_ADDRESS) throw new Error("Contract address is not defined");
    if (!CONTRACT_ABI) throw new Error("Contract ABI is not defined");

    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (error) {
    const msg = getFriendlyError(
      error,
      "Unable to connect to the contract. Please try again later."
    );
    console.error("Error creating Ethereum contract:", error);
    toast.error(msg, toastStyle.error);
    throw error;
  }
};

const checkIfTransactionsExist = async () => {
  try {
    const contract = await fetchTransactionContract();
    const count = await contract.getTransactionCount();
    window.localStorage.setItem("transactionCount", count);
    return count;
  } catch (error) {
    console.error("Error checking transactions:", error);
  }
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount") || "0"
  );
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  // Get current network
  const getNetwork = async () => {
    try {
      if (!ethereum) return null;
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const networkName =
        networkNames[chainId] || `Chain ID: ${parseInt(chainId, 16)}`;
      setCurrentNetwork(networkName);
      return networkName;
    } catch (error) {
      console.error("Error getting network:", error);
      return null;
    }
  };

  const handleChange = (e, name) =>
    setFormData({ ...formData, [name]: e.target.value });

  const getAllTransaction = useCallback(
    async (account = null) => {
      try {
        const accountToUse = account || currentAccount;
        if (!ethereum) throw new Error("Please install MetaMask");
        if (!accountToUse) throw new Error("No account connected");

        const contract = await fetchTransactionContract();
        const rawTransactions = await contract.getAllTransactions();
        console.log("Raw transactions:", rawTransactions);

        if (!rawTransactions || rawTransactions.length === 0) {
          setTransactions([]);
          return [];
        }

        // Format transactions
        const formatted = rawTransactions
          .map((tx) => {
            try {
              return {
                addressFrom: tx[0].toLowerCase(),
                addressTo: tx[1].toLowerCase(),
                amount: ethers.formatEther(tx[2]),
                message: tx[3] || "",
                timestamp: new Date(Number(tx[4]) * 1000).toLocaleString(),
                keyword: tx[5] || "",
              };
            } catch (error) {
              console.error("Error parsing transaction:", error, tx);
              return null;
            }
          })
          .filter(Boolean);

        const lcAccount = accountToUse.toLowerCase();
        const userTx = formatted.filter(
          (tx) => tx.addressFrom === lcAccount || tx.addressTo === lcAccount
        );
        const sorted = userTx.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setTransactions(sorted);
        return sorted;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load your transactions", toastStyle.error);
        return [];
      }
    },
    [currentAccount]
  );

  const connectWallet = async () => {
    const connectingToast = toast.loading("Connecting wallet...", toastStyle);
    try {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (!ethereum) {
        toast.dismiss(connectingToast);
        if (isMobile) {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          window.location.href = isIOS
            ? `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`
            : "https://metamask.io/download.html";
          toast.error(
            "Please open this site in your wallet's browser",
            toastStyle.error
          );
        } else {
          toast.error(
            "Please install an Ethereum wallet like MetaMask",
            toastStyle.error
          );
        }
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        await getNetwork();
        toast.dismiss(connectingToast);
        toast.success(
          `Wallet connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(
            -4
          )}`,
          toastStyle.success
        );
        await getAllTransaction(accounts[0]);
      } else {
        toast.dismiss(connectingToast);
        toast.error("No accounts found or access denied", toastStyle.error);
      }
    } catch (error) {
      toast.dismiss(connectingToast);
      const msg = getFriendlyError(
        error,
        "Failed to connect wallet. Please try again."
      );
      console.error("Error connecting wallet:", error);
      toast.error(msg, toastStyle.error);
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
      const contract = await fetchTransactionContract();
      const parsedAmount = ethers.parseEther(amount);
      pendingToast = toast.loading("Processing transaction...", toastStyle);
      const txParams = {
        to: addressTo,
        from: currentAccount,
        gas: "0x5208",
        value: parsedAmount.toString(),
      };
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });
      setLoading(true);
      const transaction = await contract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      await transaction.wait();
      const count = await contract.getTransactionCount();
      window.localStorage.setItem("transactionCount", count.toString());
      setTransactionCount(Number(count));
      await getAllTransaction(currentAccount);
      setLoading(false);
      setFormData({ addressTo: "", amount: "", keyword: "", message: "" });
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
      setLoading(false);
      if (pendingToast) toast.dismiss(pendingToast);
      console.error("Transaction error:", error);
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
      setCurrentAccount(null);
      setTransactions([]);
      setFormData({ addressTo: "", amount: "", keyword: "", message: "" });
      toast.dismiss(disconnectToast);
      toast.success("Wallet disconnected", toastStyle.success);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.dismiss(disconnectToast);
      toast.error("Failed to disconnect wallet", toastStyle.error);
    }
  };

  useEffect(() => {
    if (ethereum) {
      const handleChainChanged = (chainId) => {
        const networkName =
          networkNames[chainId] || `Chain ID: ${parseInt(chainId, 16)}`;
        setCurrentNetwork(networkName);
        toast.success(`Network changed to ${networkName}`, toastStyle.success);
        window.location.reload();
      };

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          getNetwork();
          toast.success(
            `Switched to account: ${accounts[0].slice(
              0,
              6
            )}...${accounts[0].slice(-4)}`,
            toastStyle.success
          );
          getAllTransaction(accounts[0]);
        } else {
          setCurrentAccount(null);
          setTransactions([]);
          toast.error("Wallet disconnected", toastStyle.error);
        }
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      const initData = async () => {
        try {
          await getNetwork();
          await checkIfTransactionsExist();
        } catch (error) {
          console.error("Init error:", error);
        }
      };
      initData();

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [getAllTransaction]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
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
        currentNetwork,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

TransactionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
