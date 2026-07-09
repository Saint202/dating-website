"use client";

import { useEffect, useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0);
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
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleSwipe = async (liked: boolean) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    const res = await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: currentProfile.userId, liked }),
    });

    const data = await res.json();

    if (data.isMatch) {
      setMatchMessage(`You and ${currentProfile.name} matched!`);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading profiles...</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {matchMessage && (
        <div className="mb-4 rounded bg-green-100 p-3 text-center text-green-800">
          {matchMessage}
        </div>
      )}

      {currentProfile ? (
        <div className="w-full max-w-sm rounded-lg bg-white shadow-md">
          {currentProfile.photoUrl ? (
            <img
              src={currentProfile.photoUrl}
              alt={currentProfile.name ?? "Profile photo"}
              className="h-80 w-full rounded-t-lg object-cover"
            />
          ) : (
            <div className="flex h-80 w-full items-center justify-center rounded-t-lg bg-gray-200 text-gray-400">
              No photo
            </div>
          )}

          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentProfile.name}, {currentProfile.age}
            </h2>
            {currentProfile.bio && (
              <p className="mt-2 text-gray-600">{currentProfile.bio}</p>
            )}
          </div>

          <div className="flex gap-4 p-4 pt-0">
            <button
              onClick={() => handleSwipe(false)}
              className="flex-1 rounded border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Pass
            </button>
            <button
              onClick={() => handleSwipe(true)}
              className="flex-1 rounded bg-black py-3 font-medium text-white hover:bg-gray-800"
            >
              Like
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No more profiles to show right now.</p>
          <button
            onClick={fetchProfiles}
            className="mt-4 rounded bg-black px-4 py-2 text-white"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}