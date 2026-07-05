import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in — Xai",
  description: "Sign in to your Xai Intelligence Workspace.",
};

export default function SignInPage() {
  return (
    <AuthShell
      heading="Turn raw data into decisive intelligence."
      description="Pick up right where you left off — your workspace, your signals, your intelligence, all resolved and waiting."
      title="Welcome back"
      subtitle="Sign in to your Xai workspace"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-accent hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
