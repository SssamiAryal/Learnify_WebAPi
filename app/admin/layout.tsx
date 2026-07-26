"use client";

import { useRouter, usePathname } from "next/navigation";
import { Users, BookOpen, LogOut, Shield, HelpCircle } from "lucide-react";

const NAV_ITEMS = [
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Lessons", href: "/admin/lessons", icon: BookOpen },
    { label: "Quiz", href: "/admin/quiz", icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth/login");
    };

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
                    <div className="mt-3 flex items-center gap-1.5">
                        <Shield size={12} className="text-violet-400" />
                        <span className="text-xs font-semibold text-violet-500 uppercase tracking-wider">Admin Panel</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Management</p>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                    isActive
                                        ? "bg-violet-50 text-violet-700 font-semibold"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                            >
                                <Icon size={18} className={isActive ? "text-violet-600" : "text-slate-400"} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                        <LogOut size={18} className="group-hover:text-red-500 transition-colors" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}