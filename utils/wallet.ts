import { BrowserProvider } from "ethers";

/**
 * Get wallet address
 * @returns 
 */
async function getWalletAddress(): string | undefined {
  if (!window.ethereum) {
    console.error("connect to your wallet first")
    return undefined
  }

  try {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    return await signer.getAddress()
  } catch (error) {
    console.error(`failed to get wallet address: ${error}`)
    return undefined
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    console.error("No Ethereum provider found. Install MetaMask.");
    return
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Connected account:", accounts);
    // console.log("Connected account:", accounts[0]);
    // setAccount(accounts[0])
    // return accounts[0]; // Return the connected account
  } catch (error) {
      console.error("User denied account access:", error);
  }
}

export {
  getWalletAddress,
  connectWallet
}