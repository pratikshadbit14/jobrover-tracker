"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (login.isPending) return;
    login.mutate({ email, password });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-white mb-6">Sign in</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {login.isError && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            Invalid email or password
          </p>
        )}

        <Button
          type="submit"
          loading={login.isPending}
          disabled={login.isPending}
          className="w-full mt-2"
          size="lg"
        >
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
          Register
        </Link>
      </p>
    </div>
  );
}