"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <nav className="flex items-center justify-between bg-white p-4 shadow-sm">
        <Link href="/" className="text-lg font-bold text-gray-900">
          💕 DatingApp
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:underline">
            Log in
          </Link>
          <Link href="/signup" className="text-gray-700 hover:underline">
            Sign up
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-sm">
      <Link href="/browse" className="text-lg font-bold text-gray-900">
        💕 DatingApp
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/browse" className="text-gray-700 hover:underline">
          Browse
        </Link>
        <Link href="/matches" className="text-gray-700 hover:underline">
          Matches
        </Link>
        <Link href="/profile" className="text-gray-700 hover:underline">
          Profile
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}