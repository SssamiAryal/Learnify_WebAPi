"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyProgress } from "@/lib/api/progress";
import {
  Home,
  BookOpen,
  BarChart3,
  User,
  Search,
  Bell,
  LogOut,
  Shield,
  Zap,
  CheckCircle2,
  Flame,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-violet-50 text-violet-700",
  intermediate: "bg-blue-50 text-blue-700",
  advanced: "bg-orange-50 text-orange-700",
};

export default function ProgressPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getMyProgress();
        setProgress(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const filteredProgress = useMemo(() => {
    if (!search.trim()) return progress;
    const q = search.trim().toLowerCase();
    return progress.filter(
      (item) =>
        item.lessonId?.title?.toLowerCase().includes(q) ||
        item.lessonId?.description?.toLowerCase().includes(q)
    );
  }, [progress, search]);

  const levelCount = (level: string) =>
    progress.filter((item) => item.lessonId?.level === level).length;

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

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
          <SidebarItem icon={<BarChart3 size={18} />} title="Progress" active />
          <SidebarItem icon={<Bell size={18} />} title="Notifications" />

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
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Progress</p>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">My Progress</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search completed lessons…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 w-64 text-slate-700 placeholder:text-slate-400 transition-all"
              />
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {initials}
            </div>
          </div>
        </header>

        <div className="px-8 py-8 max-w-5xl mx-auto">

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
                <TrendingUp size={26} />
              </div>
              <div>
                <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-1">Keep up the momentum</p>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  You've completed {progress.length} {progress.length === 1 ? "lesson" : "lessons"}
                </h2>
                <p className="text-violet-100 text-sm mt-1">Every lesson brings you closer to fluency.</p>
              </div>
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Completed" value={progress.length} icon={<CheckCircle2 size={20} className="text-emerald-500" />} bg="bg-emerald-50" />
            <StatCard label="Beginner" value={levelCount("beginner")} icon={<BookOpen size={20} className="text-violet-500" />} bg="bg-violet-50" />
            <StatCard label="Intermediate" value={levelCount("intermediate")} icon={<BookOpen size={20} className="text-blue-500" />} bg="bg-blue-50" />
            <StatCard label="Advanced" value={levelCount("advanced")} icon={<Flame size={20} className="text-orange-500" />} bg="bg-orange-50" />
          </div>

          {/* Completed lessons list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Completed Lessons</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-7 h-7 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Loading progress…</p>
              </div>
            ) : filteredProgress.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <CheckCircle2 size={36} className="mx-auto mb-3 text-slate-200" />
                <p className="font-medium">
                  {search ? "No matching lessons" : "No lessons completed yet"}
                </p>
                <p className="text-xs mt-1">
                  {search ? "Try a different search term" : "Start a lesson to see your progress here"}
                </p>
                {!search && (
                  <button
                    onClick={() => router.push("/dashboard/lessons")}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    Browse Lessons <ChevronRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredProgress.map((item) => (
                  <ProgressItem key={item._id} item={item} router={router} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, bg }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900">{value}</p>
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

function ProgressItem({ item, router }: any) {
  const lesson = item.lessonId || {};
  return (
    <div
      onClick={() => lesson._id && router.push(`/dashboard/lessons/${lesson._id}`)}
      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={18} className="text-emerald-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{lesson.title}</p>
        <p className="text-sm text-slate-400 truncate">{lesson.description}</p>
      </div>

      {lesson.level && (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize flex-shrink-0 ${
            LEVEL_STYLES[lesson.level] || "bg-slate-100 text-slate-600"
          }`}
        >
          {lesson.level}
        </span>
      )}

      <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-400 transition-colors flex-shrink-0" />
    </div>
  );
}