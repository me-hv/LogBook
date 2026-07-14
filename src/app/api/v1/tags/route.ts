import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKeyAndRateLimit, corsHeaders } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await validateApiKeyAndRateLimit(req);
  if (!auth.authorized && auth.errorResponse) {
    return auth.errorResponse;
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: { where: { post: { status: "published" } } } },
        },
      },
    });

    return NextResponse.json({ success: true, data: tags }, { headers: corsHeaders() });
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
