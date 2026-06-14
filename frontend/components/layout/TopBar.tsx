"use client";

import { useMe, useLogout } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import Button from "@/components/ui/Button";

export default function TopBar() {
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div>
        <p className="text-sm text-gray-400">
          Welcome back{user ? `, ${user.full_name.split(" ")[0]}` : ""}
        </p>
      </div>

      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>
    </header>
  );
}