"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/** No backend for this challenge — submit is a deliberate no-op. */
export function SignInForm() {
  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="you@company.com"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />
      <Button type="submit" variant="primary" className="mt-2 w-full">
        Sign in
      </Button>
    </form>
  );
}
