import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 p-10 rounded-lg shadow-lg">
      <h1 className="text-6xl font-extrabold text-white mb-4">Knowledge King</h1>
      <p className="text-xl text-white mb-6 text-center">Test your knowledge with 10 random questions.</p>
      <p className="text-lg text-white mb-8 text-center">Answer at least 8 questions correctly to become the Knowledge King!</p>
      <Link href="/game">
        <button className="bg-white text-blue-600 hover:bg-blue-100 transition duration-300 ease-in-out px-8 py-4 rounded-lg shadow-md text-lg font-semibold">
          Start Game
        </button>
      </Link>
    </div>
  );
}
