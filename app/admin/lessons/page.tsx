"use client";

import { useEffect, useState, useMemo } from "react";
import {
    getAllLessons,
    createLesson,
    updateLesson,
    deleteLesson,
} from "@/lib/api/admin/lesson";
import {
    BookOpen,
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Layers,
    X,
} from "lucide-react";

const PAGE_SIZE = 10;

type LessonForm = {
    title: string;
    description: string;
    level: string;
    content: string;
    order: number;
};

const EMPTY_FORM: LessonForm = {
    title: "",
    description: "",
    level: "beginner",
    content: "",
    order: 1,
};

export default function AdminLessonsPage() {
    const [allLessons, setAllLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState<LessonForm>(EMPTY_FORM);

    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        level?: string;
        content?: string;
        order?: string;
    }>({});
    const [creating, setCreating] = useState(false);

    const loadLessons = async () => {
        try {
            setLoading(true);
            const data = await getAllLessons();
            // Handles both a plain array response and a { data: [...] } wrapped response
            setAllLessons(Array.isArray(data) ? data : data?.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLessons();
    }, []);

    // Client-side search filter (title + description)
    const filteredLessons = useMemo(() => {
        if (!search.trim()) return allLessons;
        const q = search.trim().toLowerCase();
        return allLessons.filter(
            (l) =>
                l.title?.toLowerCase().includes(q) ||
                l.description?.toLowerCase().includes(q)
        );
    }, [allLessons, search]);

    // Client-side pagination
    const totalPages = Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
    const paginatedLessons = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredLessons.slice(start, start + PAGE_SIZE);
    }, [filteredLessons, page]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required.";
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters.";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters.";
        }

        if (!["beginner", "intermediate", "advanced"].includes(formData.level)) {
            newErrors.level = "Please select a valid level.";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required.";
        } else if (formData.content.trim().length < 20) {
            newErrors.content = "Content must be at least 20 characters.";
        }

        if (formData.order === null || formData.order === undefined || Number.isNaN(formData.order)) {
            newErrors.order = "Order is required.";
        } else if (formData.order < 1) {
            newErrors.order = "Order must be at least 1.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateLesson = async () => {
        if (!validate()) return;
        try {
            setCreating(true);
            await createLesson(formData);
            alert("Lesson created successfully!");
            setOpenCreateModal(false);
            setFormData(EMPTY_FORM);
            setErrors({});
            loadLessons();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateLesson = async () => {
        if (!validate()) return;
        try {
            setUpdating(true);
            if (!editingLessonId) return;
            await updateLesson(editingLessonId, formData);
            alert("Lesson updated successfully!");
            setOpenCreateModal(false);
            setEditingLessonId(null);
            setFormData(EMPTY_FORM);
            setErrors({});
            loadLessons();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteLesson = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this lesson?");
        if (!confirmDelete) return;
        try {
            await deleteLesson(id);
            alert("Lesson deleted successfully!");
            loadLessons();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const resetAndClose = () => {
        setOpenCreateModal(false);
        setEditingLessonId(null);
        setFormData(EMPTY_FORM);
        setErrors({});
    };

    const levelCount = (level: string) => allLessons.filter((l) => l.level === level).length;

    return (
        <>
            {/* Top bar */}
            <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div>
                    <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Admin</p>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight">Lesson Management</h1>
                </div>
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-violet-200 transition-opacity"
                >
                    <Plus size={16} />
                    Create Lesson
                </button>
            </header>

            <div className="px-8 py-8">

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
                            <BookOpen size={20} className="text-violet-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{allLessons.length}</p>
                            <p className="text-xs text-slate-400">Total Lessons</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Layers size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{levelCount("beginner")}</p>
                            <p className="text-xs text-slate-400">Beginner</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Layers size={20} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{levelCount("advanced")}</p>
                            <p className="text-xs text-slate-400">Advanced</p>
                        </div>
                    </div>
                </div>

                {/* Table card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">All Lessons</p>
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title or description…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 w-80 text-slate-700 placeholder:text-slate-400 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Level</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-7 h-7 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                                                <p className="text-slate-400 text-sm">Loading lessons…</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedLessons.length > 0 ? (
                                    paginatedLessons.map((lesson) => (
                                        <tr key={lesson._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                                #{lesson._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                                                        <BookOpen size={14} />
                                                    </div>
                                                    <span className="font-medium text-slate-800">{lesson.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 max-w-xs">
                                                <p className="truncate">{lesson.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                                                    lesson.level === "advanced"
                                                        ? "bg-orange-50 text-orange-600"
                                                        : lesson.level === "intermediate"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-violet-50 text-violet-600"
                                                }`}>
                                                    {lesson.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{lesson.order}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingLessonId(lesson._id);
                                                            setFormData({
                                                                title: lesson.title || "",
                                                                description: lesson.description || "",
                                                                level: lesson.level || "beginner",
                                                                content: lesson.content || "",
                                                                order: lesson.order ?? 1,
                                                            });
                                                            setErrors({});
                                                            setOpenCreateModal(true);
                                                        }}
                                                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLesson(lesson._id)}
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
                                        <td colSpan={6} className="text-center py-16 text-slate-400">
                                            <BookOpen size={36} className="mx-auto mb-3 text-slate-200" />
                                            <p className="font-medium">No lessons found</p>
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
                            Showing page <span className="font-semibold text-slate-600">{page}</span> of <span className="font-semibold text-slate-600">{totalPages}</span> · {filteredLessons.length} total lessons
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
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {openCreateModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}
                >
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">

                        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingLessonId ? "Edit Lesson" : "Create Lesson"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {editingLessonId ? "Update the lesson's details below." : "Fill in the details to create a new lesson."}
                                </p>
                            </div>
                            <button
                                onClick={resetAndClose}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors flex-shrink-0"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4 overflow-y-auto">
                            <ModalInput
                                label="Title"
                                type="text"
                                placeholder="Introduction to React"
                                value={formData.title}
                                onChange={(v: string) => setFormData({ ...formData, title: v })}
                                error={errors.title}
                            />

                            <ModalTextarea
                                label="Description"
                                placeholder="Short summary of what this lesson covers…"
                                value={formData.description}
                                onChange={(v: string) => setFormData({ ...formData, description: v })}
                                error={errors.description}
                                rows={2}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all text-slate-800 ${
                                            errors.level
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                                        }`}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    {errors.level && <p className="text-xs text-red-500 mt-1.5">{errors.level}</p>}
                                </div>
                                <ModalInput
                                    label="Order"
                                    type="number"
                                    placeholder="1"
                                    value={formData.order}
                                    onChange={(v: string) => setFormData({ ...formData, order: v === "" ? NaN : Number(v) })}
                                    error={errors.order}
                                />
                            </div>

                            <ModalTextarea
                                label="Content"
                                placeholder="Full lesson content…"
                                value={formData.content}
                                onChange={(v: string) => setFormData({ ...formData, content: v })}
                                error={errors.content}
                                rows={6}
                            />
                        </div>

                        <div className="px-6 pb-6 pt-2 flex justify-end gap-3 flex-shrink-0 border-t border-slate-100">
                            <button
                                onClick={resetAndClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingLessonId ? handleUpdateLesson : handleCreateLesson}
                                disabled={creating || updating}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60"
                            >
                                {editingLessonId
                                    ? updating ? "Saving…" : "Save Changes"
                                    : creating ? "Creating…" : "Create Lesson"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function ModalInput({ label, type, placeholder, value, onChange, error }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={Number.isNaN(value) ? "" : value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all text-slate-800 placeholder:text-slate-300 ${
                    error
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                }`}
            />
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>
    );
}

function ModalTextarea({ label, placeholder, value, onChange, error, rows = 3 }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</label>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all text-slate-800 placeholder:text-slate-300 resize-none ${
                    error
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                }`}
            />
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>
    );
}