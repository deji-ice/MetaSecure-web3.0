/* eslint-disable react/prop-types */
import { BrowserProvider, ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/constants";

import { useEffect, useState, createContext } from "react";

export const TransactionContext = createContext();
const { ethereum } = window;

const fetchTransactionContract = async () => {
  if (!ethereum) {
    // console.log("MetaMask not installed; using read-only defaults");
    provider = ethers.getDefaultProvider();
  }
  let signer = null;

  let provider;
  try {
    // Request account access from MetaMask
    provider = new BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);

    // Get the signer (active account)
    signer = await provider.getSigner();

    // Initialize the contract instance
    const transactionContract = new ethers.Contract(
      CONTRACT_ADDRESS, // replace with your actual contract address
      CONTRACT_ABI, // replace with your actual contract ABI
      signer
    );

    // console.log({ provider, signer, transactionContract });
    return transactionContract;
  } catch (error) {
    console.error("Error creating Ethereum contract:", error);
  }
};

const checkIfTransacionsExist = async () => {
  try {
    const transactionContract = await fetchTransactionContract();
    const transactionCount = await transactionContract.getTransactionCount();
    window.localStorage.setItem("transactionCount", transactionCount);
    // console.log("transactionCount", transactionCount);
    return transactionCount;
  } catch (error) {
    console.error("Error checking if transactions exist:", error);
  }
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  // const [avatarUrl, setAvatarUrl] = useState(null);
  // console.log(formData);
  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const getAllTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const transactionContract = await fetchTransactionContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();
      const structuredTransactions = availableTransactions.map(
        (transaction) => {
          return {
            addressTo: transaction[1],
            addressFrom: transaction[0],
            amount: ethers.formatEther(transaction[2]),
            message: transaction[3],
            keyword: transaction[5],
            timestamp: new Date(
              parseInt(transaction[4]) * 1000
            ).toLocaleString(),
          };
        }
      );

    //  console.log("structuredTransactions", structuredTransactions);
      setTransactions(structuredTransactions);
      // window.reload();
    } catch (error) {
      console.error("Error getting all transactions:", error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        getAllTransaction();
      } else {
        // console.log("No accounts found");
      }
    } catch {
      // console.log(error);
      throw new Error("no ethereum object");
    }
  };
 
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      // console.log(accounts);
      
    } catch {
      // console.log(error);
      throw new Error("no ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await fetchTransactionContract();
      const parsedAmount = ethers.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: addressTo,
            from: currentAccount,
            gas: "0x5208", // 21000 gwei in hex format (gas limit
            value: parsedAmount.toString(),
          },
        ],
      });
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setLoading(true);
      // console.log(`Loading: ${transactionHash.hash}`);
      await transactionHash.wait();
      setLoading(false);
      // console.log(`Loading: ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(Number(transactionCount));
    } catch {
      // console.log(error);
    }
  };
  // const getWalletAvatar = async (address) => {
  //   const alchemyProvider = new ethers.providers.JsonRpcProvider(
  //     import.meta.env.VITE_ALCHEMY_URL
  //   );
  //   console.log(import.meta.env.VITE_ALCHEMY_URL, alchemyProvider);
  //   try {
  //     const ensResolver = await alchemyProvider.lookupAddress(address);
  //     console.log(ensResolver);
  //     // const provider = new BrowserProvider(ethereum);

  //     if (ensResolver) {
  //       const avatar = await ensResolver.getAvatar();
  //       setAvatarUrl(avatar);
  //       return avatar;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Error fetching avatar:", error);
  //     return null;
  //   }
  // };
  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransacionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        checkIfWalletIsConnected,
        sendTransaction,
        formData,
        handleChange,
        // avatarUrl,
        // getWalletAvatar,
        transactions,
        loading,
        setLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
