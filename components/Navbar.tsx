"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (status === "loading") return null;

  const wrapperClass = isAuthPage
    ? "absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4"
    : "flex items-center justify-between border-b border-border bg-white/80 px-6 py-4 backdrop-blur-sm";

  const logoClass = isAuthPage
    ? "flex items-center gap-1.5 text-lg font-semibold text-white drop-shadow-sm"
    : "flex items-center gap-1.5 text-lg font-semibold text-foreground";

  const linkClass = isAuthPage
    ? "text-sm font-medium text-white/90 drop-shadow-sm hover:text-white"
    : "text-sm font-medium text-foreground/80 hover:text-foreground";

  if (!session) {
    return (
      <nav className={wrapperClass}>
        <Link href="/" className={logoClass}>
          <span>💕</span> DatingApp
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className={linkClass}>
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
    <nav className={wrapperClass}>
      <Link href="/browse" className={logoClass}>
        <span>💕</span> DatingApp
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/browse" className={linkClass}>Browse</Link>
        <Link href="/matches" className={linkClass}>Matches</Link>
        <Link href="/profile" className={linkClass}>Profile</Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/10"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}