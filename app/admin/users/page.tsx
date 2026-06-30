"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} from "@/lib/api/admin/user";
import {
    Users,
    BookOpen,
    LogOut,
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Shield,
    X,
} from "lucide-react";

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [meta, setMeta] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        gender: "male",
        role: "user",
    });

    const [creating, setCreating] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth/login");
    };

    const loadUsers = async (searchValue = "", currentPage = page) => {
        try {
            setLoading(true);
            const response = await getAllUsers({
                page: currentPage,
                limit: 10,
                search: searchValue,
            });
            setUsers(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        try {
            setCreating(true);
            await createUser(formData);
            alert("User created successfully!");
            setOpenCreateModal(false);
            setFormData({ fullName: "", email: "", password: "", dateOfBirth: "", gender: "male", role: "user" });
            loadUsers(search, page);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateUser = async () => {
        try {
            setUpdating(true);
            if (!editingUserId) return;
            const updateData: any = {
                fullName: formData.fullName,
                email: formData.email,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                role: formData.role,
            };
            if (formData.password.trim() !== "") {
                updateData.password = formData.password;
            }
            await updateUser(editingUserId, updateData);
            alert("User updated successfully!");
            setOpenCreateModal(false);
            setEditingUserId(null);
            setFormData({ fullName: "", email: "", password: "", dateOfBirth: "", gender: "male", role: "user" });
            loadUsers(search, page);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;
        try {
            await deleteUser(id);
            alert("User deleted successfully!");
            loadUsers(search, page);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const resetAndClose = () => {
        setOpenCreateModal(false);
        setEditingUserId(null);
        setFormData({ fullName: "", email: "", password: "", dateOfBirth: "", gender: "male", role: "user" });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadUsers(search, page);
        }, 400);
        return () => clearTimeout(timer);
    }, [search, page]);

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
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-violet-50 text-violet-700 font-semibold">
                        <Users size={18} className="text-violet-600" />
                        Users
                    </button>
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

                {/* Top bar */}
                <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Admin</p>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">User Management</h1>
                    </div>
                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-violet-200 transition-opacity"
                    >
                        <Plus size={16} />
                        Create User
                    </button>
                </header>

                <div className="px-8 py-8">

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
                                <Users size={20} className="text-violet-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{meta.total}</p>
                                <p className="text-xs text-slate-400">Total Users</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <Users size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === "user").length}</p>
                                <p className="text-xs text-slate-400">Students</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center">
                                <Shield size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === "admin").length}</p>
                                <p className="text-xs text-slate-400">Admins</p>
                            </div>
                        </div>
                    </div>

                    {/* Table card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                        {/* Search bar inside card */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-700">All Users</p>
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email…"
                                    value={search}
                                    onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 w-72 text-slate-700 placeholder:text-slate-400 transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-left">
                                        <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-7 h-7 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                                                    <p className="text-slate-400 text-sm">Loading users…</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                                    #{user._id.slice(-6).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                                                        </div>
                                                        <span className="font-medium text-slate-800">{user.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                                                        user.role === "admin"
                                                            ? "bg-orange-50 text-orange-600"
                                                            : "bg-violet-50 text-violet-600"
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                                                        user.status === "active"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-xs">
                                                    {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingUserId(user._id);
                                                                setFormData({
                                                                    fullName: user.fullName,
                                                                    email: user.email,
                                                                    password: "",
                                                                    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
                                                                    gender: user.gender,
                                                                    role: user.role,
                                                                });
                                                                setOpenCreateModal(true);
                                                            }}
                                                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-16 text-slate-400">
                                                <Users size={36} className="mx-auto mb-3 text-slate-200" />
                                                <p className="font-medium">No users found</p>
                                                <p className="text-xs mt-1">Try adjusting your search</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-400">
                                Showing page <span className="font-semibold text-slate-600">{page}</span> of <span className="font-semibold text-slate-600">{meta.totalPages}</span> · {meta.total} total users
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                                    {page}
                                </div>
                                <button
                                    disabled={page === meta.totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL */}
            {openCreateModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
                    onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
                >
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

                        {/* Modal header */}
                        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingUserId ? "Edit User" : "Create User"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {editingUserId ? "Update the user's details below." : "Fill in the details to create a new user."}
                                </p>
                            </div>
                            <button
                                onClick={resetAndClose}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-5 space-y-4">
                            <ModalInput
                                label="Full Name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(v: string) => setFormData({ ...formData, fullName: v })}
                            />
                            <ModalInput
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(v: string) => setFormData({ ...formData, email: v })}
                            />
                            <ModalInput
                                label={editingUserId ? "New Password (leave blank to keep)" : "Password"}
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(v: string) => setFormData({ ...formData, password: v })}
                            />
                            <ModalInput
                                label="Date of Birth"
                                type="date"
                                placeholder=""
                                value={formData.dateOfBirth}
                                onChange={(v: string) => setFormData({ ...formData, dateOfBirth: v })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-slate-800"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-slate-800"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="px-6 pb-6 flex justify-end gap-3">
                            <button
                                onClick={resetAndClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingUserId ? handleUpdateUser : handleCreateUser}
                                disabled={creating || updating}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60"
                            >
                                {editingUserId
                                    ? updating ? "Saving…" : "Save Changes"
                                    : creating ? "Creating…" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ModalInput({ label, type, placeholder, value, onChange }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-slate-800 placeholder:text-slate-300"
            />
        </div>
    );
}