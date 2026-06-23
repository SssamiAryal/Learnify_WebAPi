"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  BookOpen,
  BarChart3,
  User,
  Search,
  Bell,
  Flame,
  CheckCircle,
  MessageSquare,
  Award,
  LogOut,
  Shield,
  Play,
  Clock,
  ChevronRight,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  const initials = user?.fullName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm flex-shrink-0">

        {/* Logo */}
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

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu</p>
          <SidebarItem icon={<Home size={18} />} title="Dashboard" active />
          <SidebarItem icon={<BookOpen size={18} />} title="Lessons" />
          <SidebarItem icon={<BarChart3 size={18} />} title="Progress" />
          <SidebarItem icon={<Bell size={18} />} title="Notifications" />

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-5 mb-2">Account</p>
          <SidebarItem
            icon={<User size={18} />}
            title="Profile"
            onClick={() => router.push("/dashboard/profile")}
          />
          <SidebarItem icon={<Shield size={18} />} title="Security" />
        </nav>

        {/* Start lesson CTA */}
        <div className="px-4 pb-3">
          <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-violet-200">
            <Zap size={16} />
            Start Daily Lesson
          </button>
        </div>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-300 hover:text-red-400 transition-colors"
            >
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
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search lessons…"
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 w-64 text-slate-700 placeholder:text-slate-400 transition-all"
              />
            </div>
            <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {initials}
            </div>
          </div>
        </header>

        <div className="px-8 py-8 max-w-7xl mx-auto">

          {/* Welcome + stats row */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Welcome back</p>
            <div className="flex items-end justify-between">
              <h1 className="text-3xl font-bold text-slate-900">
                Hello, {user?.fullName?.split(" ")[0] || "there"} 👋
              </h1>
              <p className="text-sm text-slate-400">Your journey is <span className="text-violet-600 font-semibold">65% complete</span> — keep going!</p>
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard label="Day Streak" value="12" icon={<Flame size={20} className="text-orange-500" />} bg="bg-orange-50" accent="text-orange-500" />
            <StatCard label="Lessons Done" value="38" icon={<CheckCircle size={20} className="text-emerald-500" />} bg="bg-emerald-50" accent="text-emerald-500" />
            <StatCard label="Minutes Today" value="25" icon={<Clock size={20} className="text-blue-500" />} bg="bg-blue-50" accent="text-blue-500" />
            <StatCard label="XP Earned" value="1,240" icon={<TrendingUp size={20} className="text-violet-500" />} bg="bg-violet-50" accent="text-violet-500" />
          </div>

          <div className="grid grid-cols-12 gap-6">

            {/* LEFT COLUMN */}
            <div className="col-span-8 space-y-6">

              {/* Active course card */}
              <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-violet-200">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
                />
                <div className="relative flex items-center gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"
                    className="w-36 h-24 object-cover rounded-xl opacity-90 shadow-md flex-shrink-0"
                    alt="Course"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-1">Continue where you left off</p>
                    <h2 className="text-2xl font-bold leading-tight">Advanced Conversational French</h2>
                    <p className="text-violet-200 text-sm mt-1">Unit 4 · Business Environments</p>

                    <div className="mt-3 mb-4">
                      <div className="flex justify-between text-xs text-violet-200 mb-1">
                        <span>Unit progress</span>
                        <span>68%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-[68%]" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="bg-white text-violet-700 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-violet-50 transition-colors flex items-center gap-2 shadow-sm">
                        <Play size={14} /> Continue Lesson
                      </button>
                      <button className="border border-white/30 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
                        Review Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Recommended for You</h3>
                  <button className="text-sm text-violet-600 font-semibold hover:text-violet-800 flex items-center gap-1 transition-colors">
                    View all <ChevronRight size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CourseCard
                    image="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"
                    title="Idiomatic Expressions"
                    description="Master native phrases"
                    duration="22 min"
                    tag="Vocabulary"
                  />
                  <CourseCard
                    image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500"
                    title="Listening Skills"
                    description="Real conversations practice"
                    duration="15 min"
                    tag="Listening"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-4 space-y-5">

              {/* Daily goal */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-slate-800">Daily Goal</p>
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">40%</span>
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-3xl font-bold text-slate-900">25</span>
                  <span className="text-slate-400 text-sm mb-1">/ 60 min</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full w-[40%] transition-all" />
                </div>
                <p className="text-xs text-slate-400 mt-2">35 minutes left to hit your goal</p>
              </div>

              {/* Streak */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">Current Streak</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-slate-900">12</span>
                      <span className="text-slate-400 text-sm mb-1">days</span>
                    </div>
                    <p className="text-xs text-orange-500 font-medium mt-1">🔥 Best: 21 days</p>
                  </div>
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <Flame size={32} className="text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <ActivityItem
                    icon={<CheckCircle size={16} />}
                    color="bg-emerald-50 text-emerald-600"
                    title='Completed "Grammar Quiz"'
                    subtitle="2 hours ago"
                  />
                  <ActivityItem
                    icon={<MessageSquare size={16} />}
                    color="bg-blue-50 text-blue-600"
                    title='Joined "Study Group"'
                    subtitle="5 hours ago"
                  />
                  <ActivityItem
                    icon={<Award size={16} />}
                    color="bg-yellow-50 text-yellow-600"
                    title="Earned Streak Badge"
                    subtitle="Yesterday"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, bg, accent }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className={`text-xl font-bold text-slate-900`}>{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title, active = false, onClick }: any) {
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
      {title}
    </button>
  );
}

function CourseCard({ image, title, description, duration, tag }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
      <div className="relative overflow-hidden">
        <img src={image} className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300" alt={title} />
        <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 backdrop-blur-sm text-violet-700 px-2.5 py-1 rounded-lg">
          {tag}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-slate-400 text-xs mt-1">{description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            {duration}
          </div>
          <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-0.5 transition-colors">
            Start <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, color, title, subtitle }: any) {
  return (
    <div className="flex gap-3 items-start">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 leading-tight">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}