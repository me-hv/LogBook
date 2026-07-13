import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "./CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    postCount: cat._count.posts,
  }));

  return <CategoriesManager initialCategories={serializedCategories} />;
}
