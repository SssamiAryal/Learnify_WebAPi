"use client";

import { useEffect, useState, useMemo } from "react";
import {
    getQuizByLesson,
    createQuiz,
    updateQuiz,
    deleteQuiz,
} from "@/lib/api/admin/quiz";
import { getAllLessons } from "@/lib/api/admin/lesson";
import {
    HelpCircle,
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Layers,
    X,
    CheckCircle2,
} from "lucide-react";

const PAGE_SIZE = 10;

type QuizForm = {
    lessonId: string;
    question: string;
    options: string[];
    correctAnswer: string;
};

const EMPTY_FORM: QuizForm = {
    lessonId: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
};

type FormErrors = {
    lessonId?: string;
    question?: string;
    options?: string;
    correctAnswer?: string;
};

export default function AdminQuizPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [openModal, setOpenModal] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState<QuizForm>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});

    // Your backend only exposes GET /api/v1/quizzes/:lessonId (no "get all" route),
    // so we build the full quiz list by checking every lesson for a quiz.
    // Lessons with no quiz yet are simply skipped (404 is expected and ignored).
    const loadQuizzes = async (lessonList: any[]) => {
        try {
            setLoading(true);
            const results = await Promise.all(
                lessonList.map(async (lesson) => {
                    try {
                        const data = await getQuizByLesson(lesson._id);
                        const quizData = Array.isArray(data) ? data : data?.data || data;
                        if (!quizData) return null;
                        // Normalize: some backends return an array per lesson, some a single object
                        const quizArray = Array.isArray(quizData) ? quizData : [quizData];
                        return quizArray
                            .filter(Boolean)
                            .map((q: any) => ({ ...q, lessonId: q.lessonId || lesson._id }));
                    } catch {
                        return null; // no quiz for this lesson yet
                    }
                })
            );
            setQuizzes(results.filter(Boolean).flat());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadLessons = async () => {
        try {
            const data = await getAllLessons();
            const lessonList = Array.isArray(data) ? data : data?.data || [];
            setLessons(lessonList);
            await loadQuizzes(lessonList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadLessons();
    }, []);

    const refresh = () => loadLessons();

    const lessonTitle = (lessonId: string) => {
        const found = lessons.find((l) => l._id === lessonId);
        return found?.title || "Unknown Lesson";
    };

    const filteredQuizzes = useMemo(() => {
        if (!search.trim()) return quizzes;
        const q = search.trim().toLowerCase();
        return quizzes.filter(
            (item) =>
                item.question?.toLowerCase().includes(q) ||
                lessonTitle(item.lessonId?._id || item.lessonId).toLowerCase().includes(q)
        );
    }, [quizzes, search, lessons]);

    const totalPages = Math.max(1, Math.ceil(filteredQuizzes.length / PAGE_SIZE));
    const paginatedQuizzes = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredQuizzes.slice(start, start + PAGE_SIZE);
    }, [filteredQuizzes, page]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const validate = () => {
        const newErrors: FormErrors = {};

        if (!formData.lessonId) {
            newErrors.lessonId = "Please select a lesson.";
        }

        if (!formData.question.trim()) {
            newErrors.question = "Question is required.";
        } else if (formData.question.trim().length < 5) {
            newErrors.question = "Question must be at least 5 characters.";
        }

        const filledOptions = formData.options.map((o) => o.trim()).filter(Boolean);
        if (filledOptions.length < 2) {
            newErrors.options = "Provide at least 2 options.";
        } else if (new Set(filledOptions).size !== filledOptions.length) {
            newErrors.options = "Options must be unique.";
        }

        if (!formData.correctAnswer.trim()) {
            newErrors.correctAnswer = "Select the correct answer.";
        } else if (!formData.options.map((o) => o.trim()).includes(formData.correctAnswer.trim())) {
            newErrors.correctAnswer = "Correct answer must match one of the options.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validate()) return;
        try {
            setCreating(true);
            await createQuiz(formData);
            alert("Quiz created successfully!");
            closeModal();
            refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleUpdate = async () => {
        if (!validate()) return;
        if (!editingQuizId) return;
        try {
            setUpdating(true);
            await updateQuiz(editingQuizId, formData);
            alert("Quiz updated successfully!");
            closeModal();
            refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this quiz question?");
        if (!confirmDelete) return;
        try {
            await deleteQuiz(id);
            alert("Quiz deleted successfully!");
            refresh();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const openCreateModal = () => {
        setEditingQuizId(null);
        setFormData(EMPTY_FORM);
        setErrors({});
        setOpenModal(true);
    };

    const openEditModal = (quiz: any) => {
        setEditingQuizId(quiz._id);
        setFormData({
            lessonId: quiz.lessonId?._id || quiz.lessonId || "",
            question: quiz.question || "",
            options: quiz.options?.length ? quiz.options : ["", "", "", ""],
            correctAnswer: quiz.correctAnswer || "",
        });
        setErrors({});
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setEditingQuizId(null);
        setFormData(EMPTY_FORM);
        setErrors({});
    };

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...formData.options];
        const previousValue = updated[index];
        updated[index] = value;

        const correctAnswer =
            formData.correctAnswer === previousValue ? value : formData.correctAnswer;

        setFormData({ ...formData, options: updated, correctAnswer });
    };

    const addOptionField = () => {
        setFormData({ ...formData, options: [...formData.options, ""] });
    };

    const removeOptionField = (index: number) => {
        if (formData.options.length <= 2) return;
        const removedValue = formData.options[index];
        const updated = formData.options.filter((_, i) => i !== index);
        const correctAnswer = formData.correctAnswer === removedValue ? "" : formData.correctAnswer;
        setFormData({ ...formData, options: updated, correctAnswer });
    };

    return (
        <>
            <TopBar onCreateClick={openCreateModal} />

            <div className="px-8 py-8">
                <StatsRow quizzes={quizzes} lessonsCount={lessons.length} />

                <QuizTable
                    loading={loading}
                    quizzes={paginatedQuizzes}
                    search={search}
                    onSearchChange={setSearch}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    lessonTitle={lessonTitle}
                />

                <PaginationBar
                    page={page}
                    totalPages={totalPages}
                    total={filteredQuizzes.length}
                    onPrev={() => setPage(page - 1)}
                    onNext={() => setPage(page + 1)}
                />
            </div>

            {openModal && (
                <QuizModal
                    isEditing={!!editingQuizId}
                    formData={formData}
                    setFormData={setFormData}
                    lessons={lessons}
                    errors={errors}
                    creating={creating}
                    updating={updating}
                    onClose={closeModal}
                    onSubmit={editingQuizId ? handleUpdate : handleCreate}
                    onOptionChange={handleOptionChange}
                    onAddOption={addOptionField}
                    onRemoveOption={removeOptionField}
                />
            )}
        </>
    );
}

function TopBar({ onCreateClick }: { onCreateClick: () => void }) {
    return (
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
                <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Admin</p>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Quiz Management</h1>
            </div>
            <button
                onClick={onCreateClick}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-violet-200 transition-opacity"
            >
                <Plus size={16} />
                Create Quiz
            </button>
        </header>
    );
}

function StatsRow({ quizzes, lessonsCount }: { quizzes: any[]; lessonsCount: number }) {
    const lessonsWithQuiz = new Set(quizzes.map((q) => q.lessonId?._id || q.lessonId)).size;
    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard icon={<HelpCircle size={20} className="text-violet-600" />} bg="bg-violet-50" value={quizzes.length} label="Total Quiz Questions" />
            <StatCard icon={<Layers size={20} className="text-emerald-600" />} bg="bg-emerald-50" value={lessonsWithQuiz} label="Lessons With Quizzes" />
            <StatCard icon={<Layers size={20} className="text-orange-500" />} bg="bg-orange-50" value={lessonsCount} label="Total Lessons" />
        </div>
    );
}

function StatCard({ icon, bg, value, label }: any) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
            <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
            </div>
        </div>
    );
}

function QuizTable({ loading, quizzes, search, onSearchChange, onEdit, onDelete, lessonTitle }: any) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">All Quiz Questions</p>
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by question or lesson…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 w-80 text-slate-700 placeholder:text-slate-400 transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-left">
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Question</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Options</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Correct Answer</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-7 h-7 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-slate-400 text-sm">Loading quizzes…</p>
                                    </div>
                                </td>
                            </tr>
                        ) : quizzes.length > 0 ? (
                            quizzes.map((quiz: any) => (
                                <tr key={quiz._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                        #{quiz._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                                                <HelpCircle size={14} />
                                            </div>
                                            <span className="font-medium text-slate-800 truncate">{quiz.question}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {quiz.lessonId?.title || lessonTitle(quiz.lessonId)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                                            {quiz.options?.length || 0} options
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 max-w-[160px] truncate">
                                            <CheckCircle2 size={12} className="flex-shrink-0" />
                                            <span className="truncate">{quiz.correctAnswer}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(quiz)}
                                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(quiz._id)}
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
                                    <HelpCircle size={36} className="mx-auto mb-3 text-slate-200" />
                                    <p className="font-medium">No quiz questions found</p>
                                    <p className="text-xs mt-1">Try adjusting your search</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PaginationBar({ page, totalPages, total, onPrev, onNext }: any) {
    return (
        <div className="px-6 py-4 bg-white border border-t-0 border-slate-100 rounded-b-2xl -mt-px flex items-center justify-between">
            <p className="text-xs text-slate-400">
                Showing page <span className="font-semibold text-slate-600">{page}</span> of{" "}
                <span className="font-semibold text-slate-600">{totalPages}</span> · {total} total quiz questions
            </p>
            <div className="flex items-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={onPrev}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                    {page}
                </div>
                <button
                    disabled={page === totalPages}
                    onClick={onNext}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

function QuizModal({
    isEditing,
    formData,
    setFormData,
    lessons,
    errors,
    creating,
    updating,
    onClose,
    onSubmit,
    onOptionChange,
    onAddOption,
    onRemoveOption,
}: any) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">

                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEditing ? "Edit Quiz Question" : "Create Quiz Question"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isEditing ? "Update the question's details below." : "Fill in the details to add a new quiz question."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors flex-shrink-0"
                    >
                        <X size={15} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lesson</label>
                        <select
                            value={formData.lessonId}
                            onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all text-slate-800 ${
                                errors.lessonId
                                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                    : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                            }`}
                        >
                            <option value="">Select a lesson…</option>
                            {lessons.map((lesson: any) => (
                                <option key={lesson._id} value={lesson._id}>
                                    {lesson.title}
                                </option>
                            ))}
                        </select>
                        {errors.lessonId && <p className="text-xs text-red-500 mt-1.5">{errors.lessonId}</p>}
                    </div>

                    <ModalTextarea
                        label="Question"
                        placeholder="e.g. What is the past tense of 'go'?"
                        value={formData.question}
                        onChange={(v: string) => setFormData({ ...formData, question: v })}
                        error={errors.question}
                        rows={2}
                    />

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Options
                            </label>
                            <button
                                onClick={onAddOption}
                                className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                            >
                                <Plus size={13} /> Add Option
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">Select the radio button next to the correct option.</p>

                        <div className="space-y-2">
                            {formData.options.map((option: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={!!option.trim() && formData.correctAnswer === option}
                                        onChange={() => setFormData({ ...formData, correctAnswer: option })}
                                        disabled={!option.trim()}
                                        className="w-4 h-4 text-violet-600 flex-shrink-0 disabled:opacity-30"
                                        title="Mark as correct answer"
                                    />
                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => onOptionChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-slate-800"
                                    />
                                    {formData.options.length > 2 && (
                                        <button
                                            onClick={() => onRemoveOption(index)}
                                            className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                                            title="Remove option"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.options && <p className="text-xs text-red-500 mt-2">{errors.options}</p>}
                        {errors.correctAnswer && <p className="text-xs text-red-500 mt-1">{errors.correctAnswer}</p>}
                    </div>
                </div>

                <div className="px-6 pb-6 pt-4 flex justify-end gap-3 flex-shrink-0 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={creating || updating}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60"
                    >
                        {isEditing
                            ? updating ? "Saving…" : "Save Changes"
                            : creating ? "Creating…" : "Create Quiz"}
                    </button>
                </div>
            </div>
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