import { Contract } from "ethers";
import { BrowserProvider } from "ethers";
import gameABI from "../KnowledgeKingGameABI.json"
import tokenABI from "../KnowledgeKingTokenABI.json"


/**
 * Get wallet address
 * @returns 
 */
async function getWalletAddress(): Promise<string | undefined> {
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

/**
 * Connect wallet and give players initial supply of KnowledgeKingToken (KKT)
 *
 * @returns 
 */
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


const gameAddress = "0xa5C05e3390ea6f85f9cdbeB3B62FD8df39DDd5f8";
async function initPlayer(playerAccount: string): boolean {
  if (!window.ethereum) {
    console.log("connect to your wallet first")
    return false
  }

  // Connect to the Ethereum provider
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner();
  const gameContract = new Contract(gameAddress, gameABI, signer);
  try {
      const result = await gameContract.initPlayer(playerAccount);
      console.log("Function result:", result);
      return true
  } catch (error) {
      console.error("Error calling 'initPlayer' function:", error);
      return false
  }
}

async function playGame() {
  if (!window.ethereum) {
    console.log("connect to your wallet first")
    return false
  }

  // Connect to the Ethereum provider
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner();
  const gameContract = new Contract(gameAddress, gameABI, signer);

  const tokenContract = new Contract(tokenAddress, tokenABI, signer);
  try {
      let tokenResult = await tokenContract.balanceOf(await signer.getAddress());
      console.log(`balanceOf result: ${tokenResult}`)
      const result = await gameContract.play();
      console.log("play result:", result);
      return true
  } catch (error) {
      console.error("Error calling 'playGame' function:", error);
      return false
  }
}

const tokenAddress = "0x37A00a8e37Cd8f0a1365728e181CD1EfAA7551Ee";
async function getKKTBalance(): number {
  if (!window.ethereum) {
    console.log("connect to your wallet first")
    return
  }

  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner();
  const tokenContract = new Contract(tokenAddress, tokenABI, signer);
  try {
    const result = await tokenContract.balanceOf(playerAccount);
    console.log("Function result:", result);
    return result
  } catch (error) {
    console.error("Error calling contract function:", error);
    return false
  }
}

export {
  getWalletAddress,
  connectWallet,
  initPlayer,
  playGame,
}