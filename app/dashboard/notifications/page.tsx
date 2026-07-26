"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  BookOpen,
  BarChart3,
  Bell,
  User,
  Shield,
  LogOut,
  Zap,
  CheckCircle2,
  Trophy,
  Clock,
  BookMarked,
  Check,
} from "lucide-react";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: any;
  color: string;
  bg: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Lesson Completed",
    message: "You successfully completed Greetings and Introductions.",
    time: "2 minutes ago",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    read: false,
  },
  {
    id: 2,
    title: "Quiz Completed",
    message: "Great job! You scored 2/2 in the Lesson Quiz.",
    time: "15 minutes ago",
    icon: Trophy,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    read: false,
  },
  {
    id: 3,
    title: "New Lesson Available",
    message: "Lesson 5: Ordering Food is now available.",
    time: "Today",
    icon: BookMarked,
    color: "text-blue-600",
    bg: "bg-blue-50",
    read: false,
  },
  {
    id: 4,
    title: "Daily Reminder",
    message: "Keep your 5-day learning streak alive by completing today's lesson.",
    time: "Yesterday",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50",
    read: true,
  },
  {
    id: 5,
    title: "Progress Milestone",
    message: "Congratulations! You've completed 50% of the Beginner course.",
    time: "2 days ago",
    icon: Trophy,
    color: "text-violet-600",
    bg: "bg-violet-50",
    read: true,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, filter]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm flex-shrink-0">

        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Learnify
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu</p>
          <SidebarItem icon={<Home size={18} />} title="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem icon={<BookOpen size={18} />} title="Lessons" onClick={() => router.push("/dashboard/lessons")} />
          <SidebarItem icon={<BarChart3 size={18} />} title="Progress" onClick={() => router.push("/dashboard/progress")} />
          <SidebarItem icon={<Bell size={18} />} title="Notifications" active badge={unreadCount} />

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-5 mb-2">Account</p>
          <SidebarItem icon={<User size={18} />} title="Profile" onClick={() => router.push("/dashboard/profile")} />
          <SidebarItem icon={<Shield size={18} />} title="Security" />
        </nav>

        <div className="px-4 pb-3">
          <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-violet-200">
            <Zap size={16} />
            Start Daily Lesson
          </button>
        </div>

        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-slate-300 hover:text-red-400 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Notifications</p>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Stay Updated</h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
            >
              <Check size={15} />
              Mark all as read
            </button>
          )}
        </header>

        <div className="px-8 py-8 max-w-3xl mx-auto">

          {/* Summary hero */}
          <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-violet-200 mb-8">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Bell size={26} />
              </div>
              <div>
                <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-1">Learning activity</p>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                    : "You're all caught up"}
                </h2>
                <p className="text-violet-100 text-sm mt-1">Here's what's happened recently.</p>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-6">
            <FilterTab label="All" active={filter === "all"} onClick={() => setFilter("all")} count={notifications.length} />
            <FilterTab label="Unread" active={filter === "unread"} onClick={() => setFilter("unread")} count={unreadCount} />
          </div>

          {/* Notification list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Bell size={36} className="mx-auto mb-3 text-slate-200" />
                <p className="font-medium">
                  {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                </p>
                <p className="text-xs mt-1">You'll see updates about your lessons and progress here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredNotifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onMarkRead={() => markAsRead(notification.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, title, active = false, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
        active
          ? "bg-violet-50 text-violet-700 font-semibold"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <span className={active ? "text-violet-600" : ""}>{icon}</span>
      <span className="flex-1 text-left">{title}</span>
      {!!badge && (
        <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function FilterTab({ label, active, onClick, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
        active
          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-200"
          : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
      }`}
    >
      {label}
      <span
        className={`text-xs px-1.5 py-0.5 rounded-md ${
          active ? "bg-white/20" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function NotificationRow({ notification, onMarkRead }: { notification: NotificationItem; onMarkRead: () => void }) {
  const Icon = notification.icon;

  return (
    <div
      onClick={!notification.read ? onMarkRead : undefined}
      className={`flex gap-4 px-6 py-5 transition-colors ${
        !notification.read ? "bg-violet-50/40 hover:bg-violet-50 cursor-pointer" : "hover:bg-slate-50"
      }`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.bg}`}>
        <Icon className={notification.color} size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-slate-800">{notification.title}</h3>
          <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">{notification.time}</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">{notification.message}</p>
      </div>

      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" title="Unread" />
      )}
    </div>
  );
}