"use client";

import { Share } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./toggle-mode";
import Login from "./o-auth-button";
import { useCurrentUser } from "@/hooks/use-auth";

export function NavActions() {
  const { data: user, isLoading: loading } = useCurrentUser();

  if (!user && loading) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      {user && (
        <Button variant="ghost" className="rounded-full cursor-pointer">
          Share
          <Share />
        </Button>
      )}
      {!user && !loading && <Login />}
      <ModeToggle />
    </div>
  );
}
