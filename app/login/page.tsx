"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-background px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="stack-card w-full max-w-sm space-y-5 p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in to keep swiping</p>
        </div>

        {error && (
          <p className="rounded-lg bg-coral/10 p-3 text-sm text-coral-dark">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-white p-2.5 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-white p-2.5 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-coral py-3 font-semibold text-white shadow-md shadow-coral/25 transition hover:bg-coral-dark disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="font-medium text-coral hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}