"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <nav className="flex items-center justify-between bg-white/30 px-6 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
          <span>💕</span> DatingApp
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white shadow-md shadow-coral/25 transition hover:bg-coral-dark"
          >
            Sign up
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between bg-white/30 px-6 py-4 backdrop-blur-md">
      <Link href="/browse" className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
        <span>💕</span> DatingApp
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/browse" className="text-sm font-medium text-foreground/80 hover:text-foreground">Browse</Link>
        <Link href="/matches" className="text-sm font-medium text-foreground/80 hover:text-foreground">Matches</Link>
        <Link href="/profile" className="text-sm font-medium text-foreground/80 hover:text-foreground">Profile</Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full border border-foreground/20 px-4 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm transition hover:bg-white/40"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}