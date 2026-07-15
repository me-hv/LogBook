import { prisma } from "@/lib/prisma";
import { getActiveTenantId } from "@/lib/tenant-helper";
import { TagsManager } from "./TagsManager";

export default async function AdminTagsPage() {
  const tenantId = await getActiveTenantId();
  const tags = await prisma.tag.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });

  const serializedTags = tags.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
  }));

  return <TagsManager initialTags={serializedTags} />;
}
