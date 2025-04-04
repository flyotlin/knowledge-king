import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import Link from "next/link";

export default function Home() {
  return (

    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div>Knowledge King</div>
      <div>Test your knowledge with 10 random questions</div>
      <div>Answer at least 8 questions correctly to become the Knowledge King!</div>
      <Link href="/game">
        <button className="btn">Start Game</button>
      </Link>
    </div>
  );
}
