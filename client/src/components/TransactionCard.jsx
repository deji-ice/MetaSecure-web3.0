/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import { shortenAddress } from "../../utils/helpers";
import { FaExternalLinkAlt, FaArrowRight, FaClock } from "react-icons/fa";

const TransactionCard = ({ transaction }) => {
  const gifUrl = useFetch({ keyword: transaction.keyword });

  // Format the timestamp to show date and time
  const formattedDate = new Date(transaction.timestamp).toLocaleDateString();
  const formattedTime = new Date(transaction.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Faster animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.15 } }, // Faster animation
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.1 } }} // Faster hover animation
      className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl overflow-hidden"
      initial="hidden"
      animate="show"
      layoutId={`transaction-${transaction.addressFrom}-${transaction.timestamp}`}
    >
      {/* Transaction Details */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-white font-medium">Transaction</span>
          </div>
          <div className="flex items-center text-neutral-400 text-sm">
            <FaClock className="mr-1.5 text-xs" />
            <span>{formattedDate}</span>
            <span className="mx-1.5">•</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <span className="text-neutral-500 text-sm w-20">From:</span>
            <a
              href={`https://sepolia.etherscan.io/address/${transaction.addressFrom}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm font-mono flex items-center"
            >
              {shortenAddress(transaction.addressFrom)}
              <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="h-[1px] flex-grow bg-white/10"></div>
            <FaArrowRight className="mx-3 text-neutral-400" />
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>

          <div className="flex items-start">
            <span className="text-neutral-500 text-sm w-20">To:</span>
            <a
              href={`https://sepolia.etherscan.io/address/${transaction.addressTo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm font-mono flex items-center"
            >
              {shortenAddress(transaction.addressTo)}
              <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>

          <div className="flex items-start">
            <span className="text-neutral-500 text-sm w-20">Amount:</span>
            <span className="text-white text-sm font-mono">
              {transaction.amount} ETH
            </span>
          </div>

          {transaction.message && (
            <div className="flex items-start">
              <span className="text-neutral-500 text-sm w-20">Message:</span>
              <span className="text-neutral-300 text-sm">
                {transaction.message}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction GIF with optimized loading */}
      {gifUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative mt-4 rounded-xl overflow-hidden bg-black/20"
        >
          <img
            src={gifUrl}
            alt="transaction gif"
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-2 right-2">
            <a
              href={`https://sepolia.etherscan.io/tx/${
                transaction.transactionHash || ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-1 rounded-full flex items-center"
            >
              View on Etherscan
              <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionCard;
