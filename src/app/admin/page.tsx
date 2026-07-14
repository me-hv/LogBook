import { FileText, Edit3, BarChart3, Eye, Plus, Calendar, AlertCircle, UserCheck, ShieldAlert, History } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalPosts,
    draftPosts,
    publishedPosts,
    totalViewsResult,
    recentPosts,
    inReviewPosts,
    scheduledPosts,
    pendingInvites,
    recentActivity
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.post.findMany({
      where: { status: "in_review" },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { author: true },
    }),
    prisma.post.findMany({
      where: { status: "scheduled" },
      take: 5,
      orderBy: { scheduledAt: "asc" },
      include: { author: true },
    }),
    prisma.invitation.count({ where: { expiresAt: { gt: new Date() } } }),
    prisma.activityLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalViews = totalViewsResult._sum.views || 0;

  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: <FileText className="w-5 h-5 text-zinc-650" />,
    },
    {
      title: "Published",
      value: publishedPosts,
      icon: <Eye className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: "Under Review",
      value: inReviewPosts.length,
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
    },
    {
      title: "Pending Invites",
      value: pendingInvites,
      icon: <UserCheck className="w-5 h-5 text-indigo-650" />,
    },
  ];

  const tableHeaders = ["Title", "Category", "Views", "Status", "Actions"];

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        title="Editorial Dashboard"
        description="Collaborate on drafts, publish articles, and moderate reader comments."
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
        <h2 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Recent Publications
        </h2>

        {recentPosts.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-550 dark:text-zinc-400">No posts found. Create your first post!</p>
          </div>
        ) : (
          <DataTable headers={tableHeaders}>
            {recentPosts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-550 max-w-xs truncate">
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
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
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
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-xs font-bold text-zinc-900 dark:text-zinc-50 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>

      {/* Collaboration side-by-side section */}
      <div className="grid md:grid-cols-2 gap-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        {/* Editorial Queues */}
        <div className="space-y-6">
          {/* Awaiting Review Queue */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                Awaiting Editorial Review ({inReviewPosts.length})
              </h3>
            </div>

            {inReviewPosts.length === 0 ? (
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/10 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl text-center text-zinc-400 text-xs italic">
                No articles currently awaiting review.
              </div>
            ) : (
              <div className="space-y-2.5">
                {inReviewPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl flex justify-between items-center hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
                        by {post.author.name || post.author.email}
                      </p>
                    </div>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="px-3 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-[10px] font-bold hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Posts queue */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-500" />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                Scheduled Publications ({scheduledPosts.length})
              </h3>
            </div>

            {scheduledPosts.length === 0 ? (
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/10 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl text-center text-zinc-400 text-xs italic">
                No publications currently scheduled.
              </div>
            ) : (
              <div className="space-y-2.5">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl flex justify-between items-center"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
                        scheduled for {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 text-[9px] font-bold uppercase tracking-wider">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Audit Activity Timeline */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
              Recent Team Activity
            </h3>
          </div>

          <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-5 space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((log) => (
                <div key={log.id} className="text-xs space-y-0.5 border-b border-zinc-100 dark:border-zinc-900/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>{log.user.name || log.user.email}</span>
                    <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-350">{log.details}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-zinc-400 italic text-xs">
                No activity records logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
