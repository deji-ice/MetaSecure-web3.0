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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 lg:py-24 relative z-10">
        {/* Main two-column section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column: Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 lg:pr-8"
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

              {!currentAccount && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={connectWallet}
                  className="mt-6 px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black 
                  font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 
                  flex items-center"
                >
                  Connect Wallet
                  <FaArrowRight className="ml-2" />
                </motion.button>
              )}
            </div>

            {/* Value proposition for larger screens */}
            <div className="hidden md:block mt-8 space-y-4">
              <h3 className="text-xl font-medium mb-3">Why Use MetaSecure?</h3>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-start">
                  <span className="text-white mr-3">•</span>
                  <span>Immutable record-keeping on the blockchain</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-3">•</span>
                  <span>Visual transaction receipts with custom keywords</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-3">•</span>
                  <span>Transparent verification across the Ethereum ecosystem</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right column: Card and Form */}
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
                      <span className="text-neutral-500">Balance:</span>{" "}
                      {balance} ETH
                    </p>
                  )}
                  <p className="text-xl font-medium tracking-tight mt-2">
                    MetaSecure
                  </p>
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
        
        {/* How it Works Section - Full width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-24 border-t border-white/10 pt-16"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">How MetaSecure Works</h2>
            <p className="text-neutral-400 max-w-md">
              A secure and transparent way to transfer Ethereum assets with
              visual verification
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  1
                </span>
                Connect Wallet
              </h3>
              <p className="text-neutral-400">
                Securely connect your Ethereum wallet to access the full
                functionality of the MetaSecure protocol.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  2
                </span>
                Enter Details
              </h3>
              <p className="text-neutral-400">
                Specify recipient, amount, and optional message. Add keywords
                to generate unique visual receipts.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  3
                </span>
                Confirm Transfer
              </h3>
              <p className="text-neutral-400">
                Approve the transaction in your wallet. MetaSecure handles the
                blockchain verification and recording.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  4
                </span>
                Receive Receipt
              </h3>
              <p className="text-neutral-400">
                Each transaction generates a unique visual receipt and is
                permanently recorded on the blockchain.
              </p>
            </motion.div>
          </div>
          
          <div className="mt-12 bg-white/5 p-4 rounded-lg border border-white/10">
            <p className="text-xs text-neutral-500 text-center">
              MetaSecure operates on the Ethereum blockchain, ensuring your transactions are secure, transparent, and verifiable.
              Always verify the network you&apos;re connected to in your wallet before sending transactions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;