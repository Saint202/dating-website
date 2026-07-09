import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }],
      },
      orderBy: { createdAt: "desc" },
    });

    const otherUserIds = matches.map((match) =>
      match.user1Id === currentUserId ? match.user2Id : match.user1Id
    );

    const profiles = await prisma.profile.findMany({
      where: { userId: { in: otherUserIds } },
    });

    const result = matches.map((match) => {
      const otherUserId =
        match.user1Id === currentUserId ? match.user2Id : match.user1Id;
      const profile = profiles.find((p) => p.userId === otherUserId);

      return {
        matchId: match.id,
        userId: otherUserId,
        name: profile?.name ?? "Unknown",
        photoUrl: profile?.photoUrl ?? null,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Matches error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}