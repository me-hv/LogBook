import { prisma } from "../lib/prisma";

/**
 * Fetch list of posts, sorted by creation date descending.
 * Can filter by status (default: 'published').
 */
export async function getPosts(options?: { status?: "draft" | "published" | "all" }) {
  const statusFilter = options?.status ?? "published";
  
  const whereClause: any = {};
  if (statusFilter !== "all") {
    whereClause.status = statusFilter;
  }

  try {
    return await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error in getPosts:", error);
    return [];
  }
}

/**
 * Fetch a single post by its slug.
 */
export async function getPostBySlug(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error in getPostBySlug for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all categories.
 */
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

/**
 * Fetch all tags.
 */
export async function getTags() {
  try {
    return await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error in getTags:", error);
    return [];
  }
}
