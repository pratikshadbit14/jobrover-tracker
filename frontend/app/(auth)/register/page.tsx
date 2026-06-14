"use client";

import { useState } from "react";
import Link from "next/link";
import { useRegister } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name:     "",
    email:         "",
    password:      "",
    current_title: "",
  });

  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (register.isPending || register.isSuccess) return;
    register.mutate(form);
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-white mb-6">Create account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full name"
          placeholder="Your name"
          value={form.full_name}
          onChange={set("full_name")}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          required
        />
        <Input
          label="Current title (optional)"
          placeholder="Final year B.E. CSE"
          value={form.current_title}
          onChange={set("current_title")}
        />

        {register.isError && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            Registration failed. Email may already be in use.
          </p>
        )}

        {register.isSuccess && (
          <p className="text-sm text-green-400 bg-green-900/20 border border-green-800 rounded-lg px-3 py-2">
            Account created! Redirecting to login...
          </p>
        )}

        <Button
          type="submit"
          loading={register.isPending}
          disabled={register.isPending || register.isSuccess}
          className="w-full mt-2"
          size="lg"
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}