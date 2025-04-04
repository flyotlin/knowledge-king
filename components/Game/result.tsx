import Link from "next/link";
import { ethers } from "ethers";
import { useState } from "react";

export default function GameResult({ correctAnswers }: { correctAnswers: number }) {
  const [account, setAccount] = useState<string>('')

  async function connectWallet() {
    // Check if the Ethereum provider is available
    if (window.ethereum) {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected account:", accounts[0]);
            setAccount(accounts[0])
            return accounts[0]; // Return the connected account
        } catch (error) {
            console.error("User denied account access:", error);
        }
    } else {
        console.error("No Ethereum provider found. Install MetaMask.");
    }
}

  return (
    <div className="w-96 bg-white p-6 rounded-lg shadow-md mb-4 mx-auto text-center">
      <h2 className="text-lg font-bold">
        {correctAnswers >= 8 ? "Get your token!" : "Try again!"}
      </h2>
      <div>Account: {account || 'Wallet not connected'} </div>
      <button className="btn" onClick={connectWallet}>Connect wallet</button>
      <p className="text-gray-800">You answered {correctAnswers} questions correctly.</p>
      <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Go Back to Home
      </Link>
    </div>
  )
}