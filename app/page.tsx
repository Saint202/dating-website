"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="text-4xl font-semibold text-foreground">
          Welcome back <span className="inline-block">👋</span>
        </h1>
        <p className="mt-3 text-lg text-muted">
          Ready to find your next match?
        </p>
        <Link
          href="/browse"
          className="mt-8 rounded-full bg-coral px-8 py-3 font-semibold text-white shadow-lg shadow-coral/30 transition hover:bg-coral-dark"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-couple.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-foreground/40" />

      <div className="relative z-10">
        <span className="mb-4 inline-block rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-foreground backdrop-blur-sm">
          ✦ A simpler way to meet people
        </span>
        <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
          Find your <span className="text-coral">match</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-foreground/80">
          Create a profile, swipe, match, and start chatting — all in one
          place. No games, no gimmicks.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-coral px-8 py-3 font-semibold text-white shadow-lg shadow-coral/30 transition hover:bg-coral-dark"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border bg-white px-8 py-3 font-semibold text-foreground transition hover:bg-background"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}