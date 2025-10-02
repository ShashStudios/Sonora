"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarketPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-12">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight">Coming Soon</h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">We&apos;re building the first AI-native marketplace experience here. Check back shortly.</p>
      </div>
    </div>
  );
}
