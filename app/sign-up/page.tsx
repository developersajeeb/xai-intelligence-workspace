import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up — Xai",
  description: "Create your Xai Intelligence Workspace account.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Structured intelligence, from day one."
      description="Join teams who trust Xai to turn scattered, unstructured data into a living map of insight — automatically."
      title="Create your account"
      subtitle="Start turning raw data into decisive intelligence"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
