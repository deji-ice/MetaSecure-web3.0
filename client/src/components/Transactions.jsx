import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransactionContext } from "../../context/TransactionsContext";
import TransactionCard from "./TransactionCard";

// Group transactions by date
const groupByDate = (transactions) =>
  transactions.reduce((groups, tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
    return groups;
  }, {});

const Transactions = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);
  const [openGroup, setOpenGroup] = useState(null);
  const groupedTransactions = groupByDate(transactions);

  // Set most recent date group as open by default
  useEffect(() => {
    if (transactions.length > 0) {
      // Get sorted dates (most recent first)
      const dates = Object.keys(groupedTransactions).sort(
        (a, b) => new Date(b) - new Date(a)
      );

      // If we have dates and no group is currently open, open the most recent
      if (dates.length > 0 && openGroup === null) {
        setOpenGroup(dates[0]);
      }
    }
  }, [transactions, groupedTransactions, openGroup]);

  const toggleGroup = (date) => {
    setOpenGroup((prev) => (prev === date ? null : date));
  };

  return (
    <div
      className="py-20 px-4 md:px-8 lg:px-16 relative z-10"
      id="transactions"
    >
      <div className="max-w-7xl mx-auto">
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

        {currentAccount && Object.keys(groupedTransactions).length > 0 && (
          <div>
            {Object.entries(groupedTransactions)
              // Sort by date, most recent first
              .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
              .map(([date, txs]) => (
                <div key={date} className="mb-8">
                  <button
                    onClick={() => toggleGroup(date)}
                    className="w-full text-left flex justify-between items-center text-white text-xl font-bold mb-4 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span>{date}</span>
                    <span>{openGroup === date ? "▲" : "▼"}</span>
                  </button>
                  <AnimatePresence>
                    {openGroup === date && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden"
                      >
                        {txs.map((transaction, index) => (
                          <TransactionCard
                            key={index}
                            transaction={transaction}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
