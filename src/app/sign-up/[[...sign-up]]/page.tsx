"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-foreground text-background hover:bg-[#383838]",
          },
        }}
        routing="path"
        path="/sign-up"
      />
    </div>
  );
}
