import { SignIn } from "@clerk/nextjs";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-[family-name:var(--font-sora)] font-bold text-xl tracking-tight">
          PYQ<span className="text-indigo-600">Lab</span>
        </span>
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to start solving previous year questions
        </p>
      </div>

      <SignIn
        routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-none border border-border rounded-xl",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />

    </div>
  );
}