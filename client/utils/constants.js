import abi from "../utils/Transactions.json";

// console.log("ABI from import:", abi);
// The CONTRACT_ADDRESS is set in the .env file and accessed via Vite's import.meta.env
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const CONTRACT_ABI = abi.abi;
