import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKeyAndRateLimit, corsHeaders } from "@/lib/api-auth";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const auth = await validateApiKeyAndRateLimit(req);
  if (!auth.authorized && auth.errorResponse) {
    return auth.errorResponse;
  }

  try {
    const { slug } = await params;
    
    const post = await prisma.post.findFirst({
      where: {
        slug,
        status: "published",
      },
      include: {
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true } } } },
        author: { select: { name: true, image: true, email: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found or is currently a draft." },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json({ success: true, data: post }, { headers: corsHeaders() });
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
