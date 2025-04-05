import { connectWallet, getWalletAddress, initPlayer } from "@/utils/wallet";

export default function ConnectWallet() {
  const handleConnect = async () => {
    await connectWallet()

    const address = await getWalletAddress()
    if (!address) {
      console.error("failed to get wallet address")
      return
    }
    const res = await initPlayer(address)
    if (!res) {
      console.error("failed to init player")
      return
    }
  }

  return (
    <button className="btn" onClick={handleConnect}>Connect wallet</button>
  )
}