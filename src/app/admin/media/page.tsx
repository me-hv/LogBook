import { getMediaList } from "../actions";
import { MediaManager } from "./MediaManager";

export default async function AdminMediaPage() {
  const list = await getMediaList();

  const serializedList = list.map((m) => ({
    id: m.id,
    filename: m.filename,
    originalName: m.originalName,
    url: m.url,
    size: m.size,
    mimeType: m.mimeType,
    createdAt: m.createdAt.toISOString(),
    uploadedBy: {
      name: m.uploadedBy.name,
      email: m.uploadedBy.email,
    },
  }));

  return <MediaManager initialMedia={serializedList} />;
}
