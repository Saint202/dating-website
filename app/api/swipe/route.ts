import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { toUserId, liked } = await request.json();

    if (!toUserId || typeof liked !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Record this swipe (like or pass)
    await prisma.like.create({
      data: {
        fromUserId: currentUserId,
        toUserId,
        liked,
      },
    });

    // Only check for a match if this was a like
    let isMatch = false;

    if (liked) {
      const mutualLike = await prisma.like.findFirst({
        where: {
          fromUserId: toUserId,
          toUserId: currentUserId,
          liked: true,
        },
      });

      if (mutualLike) {
        isMatch = true;

        // Store the match, ordering IDs consistently to avoid duplicates
        const [user1Id, user2Id] = [currentUserId, toUserId].sort();

        await prisma.match.upsert({
          where: {
            user1Id_user2Id: { user1Id, user2Id },
          },
          update: {},
          create: { user1Id, user2Id },
        });
      }
    }

    return NextResponse.json({ isMatch }, { status: 200 });
  } catch (error) {
    console.error("Swipe error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}