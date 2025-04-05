import Lock_ABI from "./Lock_ABI.json";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { CONTRACT_ADDRESS } from "./constants";

// Module-level variables to store provider, signer, and contract
let provider;
let signer;
let contract;

// Function to initialize the provider, signer, and contract
const initialize = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, Lock_ABI, signer);
  } else {
    console.error("Please install MetaMask!");
  }
};


// Initialize once when the module is loaded
const ensureInitialized = async () => {
    if (!provider || !signer || !contract) {
      await initialize();
    }
};

// Function to request single account
export const requestAccount = async () => {
    await ensureInitialized(); // pastikan init

  try {
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0]; // Return the first account
  } catch (error) {
    console.error("Error requesting account:", error.message);
    return null;
  }
};
// Function to get contract balance in ETH
export const getContractBalanceInETH = async () => {
    await ensureInitialized(); // pastikan init

  const balanceWei = await provider.getBalance(CONTRACT_ADDRESS);
  const balanceEth = formatEther(balanceWei); // Convert Wei to ETH string
  return balanceEth; // Convert ETH string to number
};

export const depositFund = async (depositValue) => {
    await ensureInitialized(); // pastikan init

    const ethValue = parseEther(depositValue);
    const deposit = await contract.deposit({ value: ethValue });
    await deposit.wait();
  };
  
  export const withdrawFund = async () => {
    await ensureInitialized(); // pastikan init
    const withdrawTx = await contract.withdraw();
    await withdrawTx.wait();
    console.log("Withdrawal successful!");
  };
  