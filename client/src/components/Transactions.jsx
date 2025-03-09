import { useContext } from "react";
import { motion } from "framer-motion";
import { TransactionContext } from "../../context/TransactionsContext";
import TransactionCard from "./TransactionCard";
import { FaEthereum } from "react-icons/fa";

const Transactions = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div
      className="py-20 px-4 md:px-8 lg:px-16 relative z-10"
      id="transactions"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transaction <span className="text-neutral-500">History</span>
          </h2>

          {!currentAccount ? (
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Connect your wallet to see your transaction history on the
              blockchain.
            </p>
          ) : transactions.length > 0 ? (
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Browse your recent transactions on the Ethereum blockchain.
            </p>
          ) : (
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              No transactions found. Make your first transfer to see it here!
            </p>
          )}
        </div>

        {/* Transactions Grid */}
        {currentAccount && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {transactions.length > 0 ? (
              transactions
                .slice()
                .reverse()
                .map((transaction, index) => (
                  <TransactionCard
                    key={index}
                    transaction={transaction}
                    index={index}
                  />
                ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20"
              >
                <FaEthereum className="text-6xl text-neutral-700 mb-6" />
                <p className="text-neutral-500 text-xl font-light">
                  No transactions yet
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Transactions;
