"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getLessonById } from "@/lib/api/lesson";
import {
  completeLesson,
  getMyProgress,
} from "@/lib/api/progress";
import {
    Home,
    BookOpen,
    BarChart3,
    User,
    Bell,
    LogOut,
    Shield,
    Zap,
    ArrowLeft,
    PlayCircle,
    CheckCircle2,
    Layers,
    Clock,
} from "lucide-react";

const LEVEL_STYLES: Record<string, string> = {
    beginner: "bg-violet-50 text-violet-700",
    intermediate: "bg-blue-50 text-blue-700",
    advanced: "bg-orange-50 text-orange-700",
};

export default function LessonDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [completing, setCompleting] = useState(false);

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
  const fetchLesson = async () => {
    try {
      setLoading(true);

      const lessonData = await getLessonById(id as string);
      setLesson(lessonData?.data || lessonData);

      const progressData = await getMyProgress();

      const progressList = progressData?.data || [];

      const isCompleted = progressList.some(
        (item: any) =>
          item.lessonId?._id === id ||
          item.lessonId === id
      );

      setCompleted(isCompleted);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchLesson();
  }
}, [id]);

    const handleComplete = async () => {
        try {
            setCompleting(true);

            await completeLesson(id as string);

            setCompleted(true);

            alert("Lesson completed successfully!");
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setCompleting(false);
        }
    };

    const initials =
        user?.fullName
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "U";

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm font-medium">Loading lesson…</p>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <BookOpen size={40} className="mx-auto mb-3 text-slate-200" />
                    <p className="font-semibold text-slate-600">Lesson not found</p>
                    <button
                        onClick={() => router.push("/dashboard/lessons")}
                        className="mt-4 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                        ← Back to Lessons
                    </button>
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
                    <SidebarItem icon={<BookOpen size={18} />} title="Lessons" active onClick={() => router.push("/dashboard/lessons")} />
                    <SidebarItem
                        icon={<BarChart3 size={18} />}
                        title="Progress"
                        onClick={() => router.push("/dashboard/progress")}
                    />                    <SidebarItem icon={<Bell size={18} />} title="Notifications" />

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
                    <button
                        onClick={() => router.push("/dashboard/lessons")}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-violet-600 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Lessons
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {initials}
                    </div>
                </header>

                <div className="px-8 py-8 max-w-4xl mx-auto">

                    {/* Lesson header card */}
                    <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-violet-200 mb-6">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)",
                                backgroundSize: "32px 32px",
                            }}
                        />
                        <div className="relative flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                <BookOpen size={26} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-lg capitalize">
                                        {lesson.level}
                                    </span>
                                    <span className="text-xs font-semibold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-lg">
                                        Lesson {lesson.order}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{lesson.title}</h1>
                                <p className="text-violet-100 text-sm mt-2">{lesson.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Layers size={16} className="text-violet-500" />
                            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Lesson Content</h2>
                        </div>
                        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-700">
                            <p className="whitespace-pre-line">{lesson.content}</p>
                        </div>
                    </div>

                    {/* Action bar */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock size={15} />
                            Take your time — you can revisit this lesson anytime
                        </div>

                        {completed ? (
                            <span className="flex items-center gap-2 text-emerald-600 font-semibold text-sm bg-emerald-50 px-5 py-3 rounded-xl">
                                <CheckCircle2 size={18} />
                                Lesson Completed
                            </span>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-violet-200 transition-opacity disabled:opacity-60"
                            >
                                <PlayCircle size={18} />
                                {completing ? "Marking as complete…" : "Complete Lesson"}
                            </button>
                        )}
                    </div>
                </div>
            </main>
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