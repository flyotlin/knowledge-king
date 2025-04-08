import { Contract, parseEther } from "ethers";
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
    console.log(provider)
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

async function approve() {
  if (!window.ethereum) {
    console.log("connect to your wallet first")
    return false
  }

  // Connect to the Ethereum provider
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner();
  console.log(`tokenAddress: ${tokenAddress}`)
  console.log(`gameAddress: ${gameAddress}`)
  const tokenContract = new Contract(tokenAddress!, tokenABI, signer);

  try {
      const tx = await tokenContract.approve(gameAddress, parseEther("5000000000000000000"));
      console.log("Function result:", tx);
      await tx.wait()
      return true
  } catch (error) {
      console.error("Error calling 'initPlayer' function:", error);
      return false
  }
}

//
// const gameAddress = "0x7940e75EA668dC7A259A2839582b443Ecbc5305D";
const gameAddress = process.env.GAME_CONTRACT_ADDR || '0x7F6c26Ec2b8e51b9C5aCA23f1E248132f37E0d78'
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
      const tx = await gameContract.initPlayer(playerAccount);
      console.log("Function result:", tx);
      await tx.wait()
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
      const tx = await gameContract.play();
      await tx.wait()
      console.log("play result:", tx);
      return true
  } catch (error) {
      console.error("Error calling 'playGame' function:", error);
      return false
  }
}

//
// const tokenAddress = "0x587D89f48c8B9f8ca1cbE9BD7037FBcdF57D80bB";
const tokenAddress = process.env.TOKEN_CONTRACT_ADDR || '0xB568AD7C4dEe6A79136507E13fC8672fa2399018'
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
  approve,
}