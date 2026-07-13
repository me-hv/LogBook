import { FileText, Edit3, BarChart3, Eye, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalPosts, draftPosts, publishedPosts, totalViewsResult, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

  const totalViews = totalViewsResult._sum.views || 0;

  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />,
    },
    {
      title: "Published",
      value: publishedPosts,
      icon: <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: "Drafts",
      value: draftPosts,
      icon: <Edit3 className="w-5 h-5 text-amber-650 dark:text-amber-400" />,
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: <BarChart3 className="w-5 h-5 text-blue-655 dark:text-blue-400" />,
    },
  ];

  const tableHeaders = ["Title", "Category", "Views", "Status", "Actions"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Admin Dashboard"
        description="Manage your content, monitor views, and publish drafts."
        actionLabel="New Post"
        actionHref="/admin/posts/new"
        actionIcon={<Plus className="w-4 h-4" />}
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Recent Posts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Recent Publications
        </h2>

        {recentPosts.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No posts found. Create your first post!</p>
          </div>
        ) : (
          <DataTable headers={tableHeaders}>
            {recentPosts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50 max-w-xs truncate">
                  {post.title}
                </td>
                <td className="px-6 py-4 text-zinc-650 dark:text-zinc-400">
                  {post.category?.name || "Uncategorized"}
                </td>
                <td className="px-6 py-4 font-mono text-zinc-650 dark:text-zinc-400">
                  {post.views}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      post.status === "published"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/posts?edit=${post.id}`}
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </div>
  );
}
