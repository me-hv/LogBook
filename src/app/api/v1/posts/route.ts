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
    
    // Pagination params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    // Sorting
    const sortBy = searchParams.get("sortBy") || "publishedAt"; // "publishedAt" | "views" | "title"
    const order = searchParams.get("order") || "desc"; // "asc" | "desc"

    // Field selection
    const fields = searchParams.get("fields")?.split(",").map(f => f.trim()) || [];

    // Query builder
    const where: any = { status: "published" };

    if (category) {
      where.category = { name: { equals: category, mode: "insensitive" } };
    }
    if (tag) {
      where.tags = { some: { tag: { name: { equals: tag, mode: "insensitive" } } } };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === "views") {
      orderBy.views = order;
    } else if (sortBy === "title") {
      orderBy.title = order;
    } else {
      orderBy.publishedAt = order;
    }

    // Select builder based on field selection query
    let select: any = undefined;
    if (fields.length > 0) {
      select = { id: true }; // default
      fields.forEach((field) => {
        // Enforce valid database schema field selections
        if (["title", "slug", "excerpt", "content", "coverImage", "publishedAt", "views", "readingTime"].includes(field)) {
          select[field] = true;
        }
      });
    }

    const queryOptions: any = {
      where,
      orderBy,
      skip,
      take: limit,
    };

    if (select) {
      queryOptions.select = select;
    } else {
      queryOptions.include = {
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true } } } },
        author: { select: { name: true, image: true } },
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany(queryOptions),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders() }
    );
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
