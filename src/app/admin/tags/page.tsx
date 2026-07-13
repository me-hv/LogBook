import { prisma } from "@/lib/prisma";
import { TagsManager } from "./TagsManager";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  const serializedTags = tags.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
  }));

  return <TagsManager initialTags={serializedTags} />;
}
