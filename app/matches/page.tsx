"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Match = {
  matchId: string;
  userId: string;
  name: string;
  photoUrl: string | null;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-background">
        <p className="text-muted">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">Your Matches</h1>
        <p className="mt-1 text-sm text-muted">
          {matches.length === 0
            ? "No matches yet — go browse and swipe!"
            : `${matches.length} ${matches.length === 1 ? "match" : "matches"} waiting to chat`}
        </p>

        {matches.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-white/50 p-10 text-center">
            <p className="text-muted">Nobody yet — but your next match could be one swipe away.</p>
            <Link
              href="/browse"
              className="mt-4 inline-block rounded-full bg-coral px-6 py-2.5 font-semibold text-white shadow-md shadow-coral/25 hover:bg-coral-dark"
            >
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {matches.map((match) => (
              <Link
                key={match.matchId}
                href={`/chat/${match.matchId}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                {match.photoUrl ? (
                  <img
                    src={match.photoUrl}
                    alt={match.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background text-muted">
                    ?
                  </div>
                )}
                <div className="flex-1">
                  <span className="font-semibold text-foreground">{match.name}</span>
                  <p className="text-sm text-muted">Say hi 👋</p>
                </div>
                <span className="text-coral">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}