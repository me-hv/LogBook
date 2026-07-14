"use client";

import { useEffect, useState, useTransition } from "react";
import { getNotificationsList, markNotificationAsRead, markAllNotificationsAsRead } from "@/app/admin/actions";
import { Bell, BellOff, Check, Loader2 } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  entityId: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadNotifications = async () => {
    setLoading(true);
    const res = await getNotificationsList();
    if (res.success) {
      setNotifications(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
    // Poll notifications every 60 seconds
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      const res = await markNotificationAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const res = await markAllNotificationsAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    });
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors cursor-pointer"
        aria-label="Toggle notifications menu"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white leading-none scale-90">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
              <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={isPending}
                  className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-zinc-100 dark:divide-zinc-900/60 pr-1">
              {loading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !item.read && handleMarkRead(item.id)}
                    className={`pt-2.5 first:pt-0 flex items-start gap-2.5 transition-colors cursor-pointer group`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <span
                        className={`block w-2 h-2 rounded-full ${
                          item.read
                            ? "bg-transparent"
                            : "bg-zinc-900 dark:bg-zinc-50"
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-zinc-850 dark:text-zinc-300 leading-normal select-none">
                        {item.type === "comment" ? (
                          <span>A reader commented on your blog publication.</span>
                        ) : (
                          <span>Someone replied to your comment thread.</span>
                        )}
                      </p>
                      <span className="block text-[9px] text-zinc-450 dark:text-zinc-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-xs italic space-y-2 flex flex-col items-center">
                  <BellOff className="w-6 h-6 text-zinc-300 dark:text-zinc-800" />
                  <span>All caught up! No notifications.</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
