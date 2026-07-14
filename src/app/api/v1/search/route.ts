import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKeyAndRateLimit, corsHeaders } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await validateApiKeyAndRateLimit(req);
  if (!auth.authorized && auth.errorResponse) {
    return auth.errorResponse;
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json(
        { success: false, error: "Search query 'q' parameter is required." },
        { status: 400, headers: corsHeaders() }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true } } } },
        author: { select: { name: true, image: true } },
      },
      take: 20,
    });

    return NextResponse.json({ success: true, data: posts }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders() });
}
export const dynamic = "force-dynamic";
