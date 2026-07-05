"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/** No backend for this challenge — submit is a deliberate no-op. */
export function SignUpForm() {
  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      <Input label="Full name" type="text" name="name" placeholder="Amara Kwan" autoComplete="name" required />
      <Input
        label="Work email"
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
        autoComplete="new-password"
        required
      />
      <Button type="submit" variant="primary" className="mt-2 w-full">
        Create account
      </Button>
    </form>
  );
}
