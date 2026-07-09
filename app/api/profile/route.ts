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

    const { name, age, bio, photoUrl } = await request.json();

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { name, age, bio, photoUrl },
      create: {
        userId: session.user.id,
        name,
        age,
        bio,
        photoUrl,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}