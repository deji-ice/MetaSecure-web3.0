import { useContext, useEffect } from "react";
import { TransactionContext } from "../../context/TransactionsContext";
import TransactionCard from "./TransactionCard";

const Transactions = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);

  useEffect(() => {
    // This effect will run whenever the transactions array changes
  }, [transactions]);

  return (
    <div className="flex flex-col w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">
          Latest Transactions
          {currentAccount ? (
            <p>Your account: {currentAccount}</p>
          ) : (
            <p>Connect your account to see the latest transactions</p>
          )}
        </h3>
      </div>
      <div className="flex flex-wrap justify-center items-center mt-10">
        {transactions.slice().reverse().map((transaction, index) => (
          <TransactionCard transaction={transaction} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Transactions;