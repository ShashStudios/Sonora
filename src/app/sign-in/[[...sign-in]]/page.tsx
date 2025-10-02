"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-foreground text-background hover:bg-[#383838]",
          },
        }}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}
