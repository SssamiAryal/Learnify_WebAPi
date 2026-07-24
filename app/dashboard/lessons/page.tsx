"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllLessons } from "@/lib/api/lesson";
import {
  Home,
  BookOpen,
  BarChart3,
  User,
  Search,
  Bell,
  Flame,
  LogOut,
  Shield,
  Play,
  ChevronRight,
  Zap,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function LessonsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await getAllLessons();
      setLessons(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const matchesSearch =
        !search.trim() ||
        l.title?.toLowerCase().includes(search.toLowerCase()) ||
        l.description?.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === "all" || l.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [lessons, search, levelFilter]);

  const levelCount = (level: string) => lessons.filter((l) => l.level === level).length;

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

  const initials =
    user?.fullName
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
          <SidebarItem
            icon={<Home size={18} />}
            title="Dashboard"
            onClick={() => router.push("/dashboard")}
          />
          <SidebarItem icon={<BookOpen size={18} />} title="Lessons" active />
          <SidebarItem
            icon={<BarChart3 size={18} />}
            title="Progress"
            onClick={() => router.push("/dashboard/progress")}
          />          <SidebarItem icon={<Bell size={18} />} title="Notifications" />

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
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Lessons</p>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">English Lessons</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search lessons…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          {/* Stat pills */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Lessons" value={lessons.length} icon={<Layers size={20} className="text-violet-500" />} bg="bg-violet-50" />
            <StatCard label="Beginner" value={levelCount("beginner")} icon={<CheckCircle2 size={20} className="text-emerald-500" />} bg="bg-emerald-50" />
            <StatCard label="Intermediate" value={levelCount("intermediate")} icon={<CheckCircle2 size={20} className="text-blue-500" />} bg="bg-blue-50" />
            <StatCard label="Advanced" value={levelCount("advanced")} icon={<CheckCircle2 size={20} className="text-orange-500" />} bg="bg-orange-50" />
          </div>

          {/* Level filter tabs */}
          <div className="flex items-center gap-2 mb-6">
            {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${levelFilter === lvl
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-200"
                    : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
                  }`}
              >
                {lvl === "all" ? "All Levels" : lvl}
              </button>
            ))}
          </div>

          {/* Lesson list */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading lessons…</p>
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-24 text-center">
              <BookOpen size={36} className="mx-auto mb-3 text-slate-200" />
              <p className="font-medium text-slate-500">No lessons found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} />
              ))}
            </div>
          )}
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
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active
          ? "bg-violet-50 text-violet-700 font-semibold"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
    >
      <span className={active ? "text-violet-600" : ""}>{icon}</span>
      {title}
    </button>
  );
}

const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-violet-50 text-violet-700",
  intermediate: "bg-blue-50 text-blue-700",
  advanced: "bg-orange-50 text-orange-700",
};

function LessonCard({ lesson }: any) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
            <BookOpen size={18} />
          </div>

          <h2 className="text-lg font-bold text-slate-900 truncate">
            {lesson.title}
          </h2>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${LEVEL_STYLES[lesson.level] || "bg-slate-100 text-slate-600"
            }`}
        >
          {lesson.level}
        </span>
      </div>

      <p className="text-slate-400 text-sm mt-3 line-clamp-2">
        {lesson.description}
      </p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <span className="text-xs text-slate-400">
          Lesson {lesson.order ?? "—"}
        </span>

        <button
          onClick={() =>
            router.push(`/dashboard/lessons/${lesson._id}`)
          }
          className="text-sm font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
        >
          <Play size={13} />
          Start
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}