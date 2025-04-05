import Link from "next/link";
import { ethers } from "ethers";
import { useState } from "react";
import KnowledgeKingGameABI from "../../KnowledgeKingGameABI.json"
import KnowledgeKingTokenABI from "../../KnowledgeKingTokenABI.json"

export default function GameResult({ correctAnswers }: { correctAnswers: number }) {
  const [account, setAccount] = useState<string>('')

  // TODO: how do I enforce the wallet to use a specific blockchain network?

  // Replace with your contract's ABI and address
  // const gameABI = [ /* ABI goes here */ ];
  const gameABI = KnowledgeKingGameABI
  const tokenABI = KnowledgeKingTokenABI
  const gameAddress = "0xa5C05e3390ea6f85f9cdbeB3B62FD8df39DDd5f8";
  const tokenAddress = "0x37A00a8e37Cd8f0a1365728e181CD1EfAA7551Ee";


  async function callContractFunction() {
    if (!window.ethereum) {
      console.log("connect to your wallet first")
      return
    }

    // Connect to the Ethereum provider
    const provider = new ethers.BrowserProvider(window.ethereum)

    // const provider = new ethers.providers.xWeb3Provider(window.ethereum);

    // Get the signer (the user's wallet)
    const signer = await provider.getSigner();

    // Create a contract instance
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer)
    const addr = await signer.getAddress()
    let tokenResult = await tokenContract.balanceOf(addr);
    console.log(`Function result: ${tokenResult}`)


    const gameContract = new ethers.Contract(gameAddress, gameABI, signer);
    // console.log(contract.interface.fragments)
    try {
        // Call the function on the contract
        // const result = await contract.yourFunctionName(); // Replace with your function name
        const result = await gameContract.initPlayer(account);
        console.log("Function result:", result);
    } catch (error) {
        console.error("Error calling contract function:", error);
    }

    // tokenResult = await tokenContract.balanceOf(addr);
    // console.log(`Function result: ${tokenResult}`)
  }

  return (
    <div className="w-96 bg-white p-6 rounded-lg shadow-md mb-4 mx-auto text-center">
      <h2 className="text-lg font-bold">
        {correctAnswers >= 8 ? "Get your token!" : "Try again!"}
      </h2>
      <div>Account: {account || 'Wallet not connected'} </div>
      <button className="btn" onClick={callContractFunction}>Init Player</button>
      <p className="text-gray-800">You answered {correctAnswers} questions correctly.</p>
      <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Go Back to Home
      </Link>
    </div>
  )
}