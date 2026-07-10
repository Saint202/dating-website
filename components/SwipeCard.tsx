"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

type Profile = {
  id: string;
  userId: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  photoUrl: string | null;
};

type Props = {
  profile: Profile;
  onSwipe: (liked: boolean) => void;
  isTop: boolean;
  stackIndex: number;
};

export default function SwipeCard({ profile, onSwipe, isTop, stackIndex }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120) {
      onSwipe(true);
    } else if (info.offset.x < -120) {
      onSwipe(false);
    }
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - stackIndex,
      }}
      animate={{
        scale: 1 - stackIndex * 0.04,
        y: stackIndex * 12,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
    >
      <div className="stack-card relative h-full w-full overflow-hidden !rounded-3xl">
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.name ?? "Profile photo"}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background text-muted">
            No photo
          </div>
        )}

        {/* LIKE stamp */}
        {isTop && (
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute left-6 top-8 rotate-[-15deg] rounded-lg border-4 border-emerald-400 px-4 py-1 text-2xl font-bold text-emerald-400"
          >
            LIKE
          </motion.div>
        )}

        {/* NOPE stamp */}
        {isTop && (
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute right-6 top-8 rotate-[15deg] rounded-lg border-4 border-coral px-4 py-1 text-2xl font-bold text-coral"
          >
            NOPE
          </motion.div>
        )}

        {/* Gradient overlay + info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
          <h2 className="text-2xl font-semibold text-white">
            {profile.name}, {profile.age}
          </h2>
          {profile.bio && (
            <p className="mt-1 text-sm text-white/85">{profile.bio}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}