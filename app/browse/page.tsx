"use client";

import { useEffect, useState } from "react";
import SwipeCard from "@/components/SwipeCard";

type Profile = {
  id: string;
  userId: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  photoUrl: string | null;
};

export default function BrowsePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchMessage, setMatchMessage] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const res = await fetch("/api/browse");
    const data = await res.json();
    setProfiles(data);
    setLoading(false);
  };

  const handleSwipe = async (liked: boolean) => {
    const currentProfile = profiles[0];
    if (!currentProfile) return;

    // Remove the swiped card from the stack immediately (optimistic UI)
    setProfiles((prev) => prev.slice(1));

    const res = await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: currentProfile.userId, liked }),
    });

    const data = await res.json();

    if (data.isMatch) {
      setMatchMessage(`You and ${currentProfile.name} matched! 🎉`);
      setTimeout(() => setMatchMessage(""), 3000);
    }
  };

  if (loading) {
    return (
       <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-8">
        <div className="relative h-[520px] w-full max-w-sm">
          <div className="stack-card h-full w-full animate-pulse overflow-hidden">
            <div className="h-full w-full bg-border/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-cente px-4 py-8">
      {matchMessage && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="stack-card mx-4 max-w-sm animate-in fade-in zoom-in duration-300 px-8 py-10 text-center">
            <span className="text-6xl">🎉</span>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              It's a match!
            </h2>
            <p className="mt-2 text-muted">{matchMessage}</p>
          </div>
        </div>
      )}

      <div className="relative h-[520px] w-full max-w-sm">
        {profiles.length > 0 ? (
          profiles
            .slice(0, 3)
            .map((profile, index) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                isTop={index === 0}
                stackIndex={index}
              />
            ))
            .reverse()
        ) : (
          <div className="stack-card flex h-full flex-col items-center justify-center px-8 text-center">
            <span className="text-5xl">✨</span>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              You're all caught up
            </h2>
            <p className="mt-2 text-muted">
              Check back soon for new people to meet.
            </p>
            <button
              onClick={fetchProfiles}
              className="mt-6 rounded-full bg-coral px-6 py-2.5 font-semibold text-white shadow-md shadow-coral/25 transition hover:bg-coral-dark"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {profiles.length > 0 && (
        <div className="mt-6 flex gap-6">
          <button
            onClick={() => handleSwipe(false)}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-white text-2xl shadow-md transition hover:scale-105"
          >
            ✕
          </button>
          <button
            onClick={() => handleSwipe(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-coral text-2xl text-white shadow-md shadow-coral/30 transition hover:scale-105"
          >
            ♥
          </button>
        </div>
      )}
    </div>
  );
}