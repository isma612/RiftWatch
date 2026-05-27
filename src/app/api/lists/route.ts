import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserLists } from "@/features/lists/services/lists.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);
  const lists = await getUserLists(session.user.id);
  return NextResponse.json(lists);
}
