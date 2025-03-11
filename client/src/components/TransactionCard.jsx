/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import { shortenAddress } from "../../utils/helpers";
import { FaExternalLinkAlt, FaArrowRight, FaClock, FaEthereum } from "react-icons/fa";

const TransactionCard = ({ transaction }) => {
  const gifUrl = useFetch({ keyword: transaction.keyword });

  // Format the timestamp to show date and time
  const formattedTime = new Date(transaction.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Faster animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2, transition: { duration: 0.1 } }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl overflow-hidden"
      initial="hidden"
      animate="show"
      layoutId={`transaction-${transaction.addressFrom}-${transaction.timestamp}`}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-white text-sm font-medium">Transaction</span>
        </div>
        <div className="flex items-center text-neutral-400 text-xs">
          <FaClock className="mr-1 text-[10px]" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Transaction Details - More Compact */}
      <div className="mb-3">
        <div className="grid grid-cols-[70px_1fr] gap-y-2 text-xs">
          <span className="text-neutral-500">From:</span>
          <a
            href={`https://sepolia.etherscan.io/address/${transaction.addressFrom}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-mono flex items-center"
          >
            {shortenAddress(transaction.addressFrom)}
            <FaExternalLinkAlt className="ml-1 text-[10px]" />
          </a>

          {/* Arrow in the middle */}
          <div className="col-span-2 flex items-center justify-center my-1">
            <div className="h-[1px] flex-grow bg-white/10"></div>
            <FaArrowRight className="mx-2 text-xs text-neutral-400" />
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>

          <span className="text-neutral-500">To:</span>
          <a
            href={`https://sepolia.etherscan.io/address/${transaction.addressTo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-mono flex items-center"
          >
            {shortenAddress(transaction.addressTo)}
            <FaExternalLinkAlt className="ml-1 text-[10px]" />
          </a>

          <span className="text-neutral-500">Amount:</span>
          <span className="text-white font-mono flex items-center">
            <FaEthereum className="mr-1 text-xs" /> 
            {transaction.amount}
          </span>

          {transaction.message && (
            <>
              <span className="text-neutral-500">Message:</span>
              <span className="text-neutral-300 truncate" title={transaction.message}>
                {transaction.message.length > 30 
                  ? `${transaction.message.substring(0, 30)}...` 
                  : transaction.message}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Smaller GIF */}
   {/* Make sure to check if gifUrl exists before rendering */}
   {gifUrl && (
        <motion.div className="relative rounded-lg overflow-hidden bg-black/20">
          <img 
            src={gifUrl} 
            alt="transaction gif" 
            className="w-full h-32 object-cover"
            loading="lazy" 
            // Add an onError handler as a fallback
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-2 right-2">
            <a
              href={`https://sepolia.etherscan.io/tx/${
                transaction.transactionHash || ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-2 py-0.5 rounded-full flex items-center text-[10px]"
            >
              View on Etherscan
              <FaExternalLinkAlt className="ml-1 text-[8px]" />
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionCard;