"use client";

import { useTransition } from "react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  variant?: "primary" | "secondary" | "ghost";
}

export function SignOutButton({ variant = "ghost" }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleSignOut}
      isLoading={isPending}
    >
      Sign Out
    </Button>
  );
}
