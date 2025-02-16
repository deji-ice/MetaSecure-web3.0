import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiEthereum } from "react-icons/si";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsShieldLockFill, BsGlobe } from "react-icons/bs";
import { TransactionContext } from "../../context/TransactionsContext";
import Loader from "./Loader";
const Input = ({ placeholder, name, type, value, handleChange }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="relative group">
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="w-full px-6 py-4 bg-white/5 border border-white/10
      text-white placeholder-gray-500 outline-none focus:border-white/30 transition-all
      font-mono text-sm"
    />
    <div
      className="absolute inset-0 bg-white/5 opacity-0 
      group-hover:opacity-100 transition-opacity -z-10"
    />
  </motion.div>
);

const Welcome = () => {
  const {
    connectWallet,
    currentAccount,
    formData,
    handleChange,
    sendTransaction,
  } = useContext(TransactionContext);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen  bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-6xl font-bold leading-tight tracking-tighter">
                <span className="text-white inline-block">
                  META
                  <span className="text-neutral-500">SECURE</span>
                </span>
                <br />
                <span className="text-neutral-300">
                  Web3 Transfer
                  <br />
                  Protocol
                </span>
              </h1>
              <p className="text-neutral-400 text-xl max-w-2xl font-light">
                Experience the future of digital asset transfers with immutable
                blockchain verification and unique transaction receipts.
              </p>
            </div>

            {!currentAccount && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectWallet}
                className="px-8 py-4 bg-white text-black font-medium 
  hover:bg-neutral-100 transition-all duration-300"
              >
                Connect Wallet
              </motion.button>
            )}
          </motion.div>

          {/* Card and Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 w-full max-w-md space-y-8"
          >
            {/* ATM Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-[1px] rounded-2xl bg-gradient-to-r from-white/20 to-white/5"
            >
              <div className="bg-black p-6 rounded-2xl space-y-8">
                <div className="flex justify-between items-center">
                  <SiEthereum className="text-3xl text-white" />
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/50"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-neutral-400 text-sm">
                    {currentAccount
                      ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(
                          -4
                        )}`
                      : "0x0000...0000"}
                  </p>
                  <p className="text-2xl font-medium tracking-tight">
                    MetaSecure
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Transaction Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl 
              border border-white/10"
            >
              <Input
                placeholder="Recipient Address"
                name="addressTo"
                type="text"
                handleChange={handleChange}
              />
              <Input
                placeholder="Amount (ETH)"
                name="amount"
                type="number"
                handleChange={handleChange}
              />
              <Input
                placeholder="Enter Message"
                name="message"
                type="text"
                handleChange={handleChange}
              />
              <Input
                placeholder="GIF Keyword"
                name="keyword"
                type="text"
                handleChange={handleChange}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-8 bg-white text-black rounded-xl 
                font-medium hover:bg-neutral-100 disabled:opacity-50 
                disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? <Loader /> : "Send Transaction"}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
