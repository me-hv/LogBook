"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { RegisterForm } from "@/components/RegisterForm";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/admin");
    }
  }, [session, router]);

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-black py-32">
        <div className="text-sm font-medium text-zinc-550 dark:text-zinc-400 animate-pulse">
          Verifying session...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-zinc-50 dark:bg-black transition-colors">
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/" className="w-12 h-12 flex items-center justify-center bg-zinc-900 dark:bg-zinc-50 rounded-2xl mb-4 transition-transform hover:scale-105">
          <BookOpen className="w-6 h-6 text-zinc-50 dark:text-zinc-900" />
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Create an account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Get started with LogBook blogging platform
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
