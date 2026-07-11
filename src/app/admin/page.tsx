"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Eye,
  BarChart3,
  FolderKanban,
  Tags,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { MOCK_POSTS } from "@/lib/mockPosts";

export default function AdminDashboard() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sidebar Links
  const sidebarItems = [
    {
      name: "Overview",
      href: "#",
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: activeTab === "dashboard",
    },
    {
      name: "All Posts",
      href: "#",
      icon: <FileText className="w-4 h-4" />,
      active: activeTab === "posts",
    },
    {
      name: "Categories",
      href: "#",
      icon: <FolderKanban className="w-4 h-4" />,
      active: activeTab === "categories",
    },
    {
      name: "Tags",
      href: "#",
      icon: <Tags className="w-4 h-4" />,
      active: activeTab === "tags",
    },
    {
      name: "Settings",
      href: "#",
      icon: <Settings className="w-4 h-4" />,
      active: activeTab === "settings",
    },
  ];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  // Analytics Metrics
  const stats = [
    { label: "Total Posts", value: posts.length, icon: <FileText className="w-5 h-5" /> },
    {
      label: "Total Views",
      value: posts.reduce((sum, p) => sum + p.viewCount, 0),
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: "Drafts",
      value: posts.filter((p) => !p.published).length,
      icon: <Edit3 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-zinc-50 dark:bg-black transition-colors">
      {/* Sidebar Panel */}
      <Sidebar title="Admin Control" items={sidebarItems} />

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Admin Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage your content, monitor views, and publish drafts.
            </p>
          </div>
          <button className="flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-3 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between"
            >
              <div>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </span>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                  {stat.value}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Posts Table */}
        <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
              Recent Publications
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900/40 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 border-b border-zinc-250 dark:border-zinc-850">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {posts.map((post) => (
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
                      {post.viewCount}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                          title="View post"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                          title="Edit post"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-red-650 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                          title="Delete post"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
