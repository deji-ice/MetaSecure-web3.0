import { useContext } from "react";
import { TransactionContext } from "../../context/TransactionsContext";


const Transactions = () => {
  const { currentAccount } = useContext(TransactionContext);
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
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
    </div>
  )
}

export default Transactions