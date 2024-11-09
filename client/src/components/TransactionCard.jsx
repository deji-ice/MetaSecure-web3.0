/* eslint-disable react/prop-types */
import useFetch from "../../hooks/useFetch";
import { shortenAddress } from "../../utils/helpers";

const TransactionCard = ({ transaction }) => {
  console.log(transaction);
  const gifUrl = useFetch({ keyword: transaction.message });
  return (
    <div
      className="bg-[#1f1f1f] p-4 flex flex-1 rounded-lg hover:shadow-2xl 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] min-w-full
    m-4 flex-col transition-transform transform hover:scale-105"
    >
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col gap-3 justify-start items-center">
          <div className="ml-3 flex justify-center items-center flex-col">
            <div className="flex text-sm justify-between w-full gap-5 items-center">
              <a
                href={`https://sepolia.etherscan.io/address/${transaction.addressFrom}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                From: {shortenAddress(transaction.addressFrom)}
              </a>
              <a
                href={`https://sepolia.etherscan.io/address/${transaction.addressTo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                To: {shortenAddress(transaction.addressTo)}
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Amount: {transaction.amount} ETH
            </p>
          </div>
        </div>
        <div className="relative flex flex-col justify-center items-center mt-4">
          <img
            src={gifUrl || transaction.url}
            alt="gif"
            className="w-full h-48 2xl:h-96 rounded-lg shadow-md object-cover"
          />
          <p className="absolute bottom-2 text-white text-xs bg-gray-700 p-1 rounded-md">
            {transaction.timestamp.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-center">
        <a
          href={`https://sepolia.etherscan.io/address/${transaction.addressFrom}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm bg-blue-500 hover:bg-blue-400 p-2 rounded-md transition-colors"
        >
          View on Etherscan
        </a>
      </div>
    </div>
  );
};

export default TransactionCard;
