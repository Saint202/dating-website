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

    const alreadySwiped = await prisma.like.findMany({
      where: { fromUserId: currentUserId },
      select: { toUserId: true },
    });

    const excludedIds = [
      currentUserId,
      ...alreadySwiped.map((like) => like.toUserId),
    ];

    const profiles = await prisma.profile.findMany({
      where: {
        userId: { notIn: excludedIds },
        name: { not: null },
      },
      take: 10,
    });

    return NextResponse.json(profiles, { status: 200 });
  } catch (error) {
    console.error("Browse error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}