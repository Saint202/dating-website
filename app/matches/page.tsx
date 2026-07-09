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
        setMatches(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Your Matches</h1>

      {matches.length === 0 ? (
        <p className="text-gray-500">No matches yet — go browse and swipe!</p>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => (
            <Link
              key={match.matchId}
              href={`/chat/${match.matchId}`}
              className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm hover:bg-gray-100"
            >
              {match.photoUrl ? (
                <img
                  src={match.photoUrl}
                  alt={match.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                  ?
                </div>
              )}
              <span className="font-medium text-gray-900">{match.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}