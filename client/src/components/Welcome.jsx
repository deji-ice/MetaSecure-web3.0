import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { SiEthereum } from "react-icons/si";
import { TransactionContext } from "../../context/TransactionsContext";
import Loader from "./Loader";
import Input from "./Input";
import { ethers } from "ethers";
import { FaArrowRight } from "react-icons/fa";


const Welcome = () => {
  const { connectWallet, currentAccount, handleChange, sendTransaction } =
    useContext(TransactionContext);
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getBalance = async () => {
      if (currentAccount && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(currentAccount);
          setBalance(ethers.formatEther(balance).substring(0, 6));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    getBalance();
  }, [currentAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendTransaction();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-5">
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight">
                <span className="text-white">
                  META<span className="text-neutral-500">SECURE</span>
                </span>
                <br />
                <span className="text-neutral-300 mt-2 block">
                  Web3 Transfer Protocol
                </span>
              </h1>
              <p className="text-neutral-400 text-lg max-w-xl leading-relaxed">
                Experience the future of digital asset transfers with immutable
                blockchain verification and unique transaction receipts.
              </p>
            </div>

            {!currentAccount && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectWallet}
                className="px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black 
                font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 
                flex items-center"
              >
                Connect Wallet
                <FaArrowRight className="ml-2" />
              </motion.button>
            )}
          </motion.div>

          {/* Card and Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto space-y-6"
          >
            {/* ETH Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative bg-gradient-to-br from-gray-900 to-black 
              rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            >
              {/* Card pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -left-4 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
              </div>
              
              <div className="relative h-48 flex flex-col justify-between p-6">
                <div className="flex justify-between items-center">
                  <SiEthereum className="text-3xl text-white" />
                  <div className="flex items-center">
                    <div className="h-5 w-8 rounded-md bg-gradient-to-r from-white/20 to-white/10"></div>
                    <div className="h-5 w-8 rounded-md bg-gradient-to-r from-white/10 to-white/5 ml-2"></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="font-mono text-neutral-400 text-sm">
                    {currentAccount
                      ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
                      : "0x0000...0000"}
                  </p>
                  {currentAccount && (
                    <p className="text-white font-mono mt-1">
                      <span className="text-neutral-500">Balance:</span> {balance} ETH
                    </p>
                  )}
                  <p className="text-xl font-medium tracking-tight mt-2">MetaSecure</p>
                </div>
              </div>
            </motion.div>

            {/* Transaction Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 p-6 bg-white/5 backdrop-blur-lg rounded-2xl 
              border border-white/10 shadow-lg"
            >
              <h3 className="text-lg font-medium mb-5">Send Transaction</h3>
              
              <Input
                placeholder="Recipient Address"
                name="addressTo"
                type="text"
                handleChange={handleChange}
              />
              <Input
                placeholder="Amount (ETH)"
                name="amount"
                type="text"
                handleChange={handleChange}
              />
              <Input
                placeholder="Enter Message (Optional)"
                name="message"
                type="text"
                handleChange={handleChange}
              />
              <Input
                placeholder="GIF Keyword (Optional)"
                name="keyword"
                type="text"
                handleChange={handleChange}
              />

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading || !currentAccount}
                className="w-full py-4 mt-2 bg-white text-black rounded-lg
                font-medium hover:bg-gray-100 disabled:opacity-50 
                disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? <Loader /> : "Send Now"}
              </motion.button>
              
              {!currentAccount && (
                <p className="text-xs text-center text-neutral-500 mt-2">
                  Connect your wallet to send transactions
                </p>
              )}
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;