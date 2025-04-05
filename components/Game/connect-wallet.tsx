import { connectWallet } from "@/utils/wallet";

export default function ConnectWallet() {
  return (
    <button className="btn" onClick={connectWallet}>Connect wallet</button>
  )
}