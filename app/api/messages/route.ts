import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Fetch messages for a given match
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
      return NextResponse.json({ error: "matchId is required" }, { status: 400 });
    }

    // Verify this user is actually part of this match
    const match = await prisma.match.findUnique({ where: { id: matchId } });

    if (
      !match ||
      (match.user1Id !== session.user.id && match.user2Id !== session.user.id)
    ) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { matchId, content } = await request.json();

    if (!matchId || !content) {
      return NextResponse.json(
        { error: "matchId and content are required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.findUnique({ where: { id: matchId } });

    if (
      !match ||
      (match.user1Id !== session.user.id && match.user2Id !== session.user.id)
    ) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: session.user.id,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}