"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, BookOpen, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, Check, X } from "lucide-react";

type Strength = "weak" | "fair" | "strong";

function getPasswordStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return "weak";
  if (score <= 3) return "fair";
  return "strong";
}

const STRENGTH_CONFIG: Record<Strength, { label: string; color: string; width: string }> = {
  weak: { label: "Weak", color: "bg-red-400", width: "w-1/3" },
  fair: { label: "Fair", color: "bg-yellow-400", width: "w-2/3" },
  strong: { label: "Strong", color: "bg-emerald-500", width: "w-full" },
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  const passwordChecks = useMemo(
    () => [
      { label: "At least 8 characters", passed: newPassword.length >= 8 },
      { label: "One uppercase letter", passed: /[A-Z]/.test(newPassword) },
      { label: "One number", passed: /[0-9]/.test(newPassword) },
    ],
    [newPassword]
  );

  const validate = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (newPassword && confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ confirmPassword: data.message || "Failed to reset password. Please try again." });
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 1800);
    } catch {
      setErrors({ confirmPassword: "Something went wrong. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Learnify
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {success ? (
            <SuccessState email={email} />
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock size={24} className="text-violet-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
                <p className="text-sm text-slate-500 mt-2">Create a new password for</p>
                <p className="font-semibold text-slate-700">{email || "your account"}</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                      }}
                      className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none focus:ring-2 transition-all text-slate-800 placeholder:text-slate-300 ${
                        errors.newPassword
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-xs text-red-500 mt-1.5">{errors.newPassword}</p>}

                  {newPassword && !errors.newPassword && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${STRENGTH_CONFIG[strength].color} ${STRENGTH_CONFIG[strength].width}`}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{STRENGTH_CONFIG[strength].label}</span>
                      </div>
                      <div className="space-y-1">
                        {passwordChecks.map((check) => (
                          <div key={check.label} className="flex items-center gap-1.5 text-xs">
                            {check.passed ? (
                              <Check size={12} className="text-emerald-500 flex-shrink-0" />
                            ) : (
                              <X size={12} className="text-slate-300 flex-shrink-0" />
                            )}
                            <span className={check.passed ? "text-slate-500" : "text-slate-400"}>{check.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                      className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none focus:ring-2 transition-all text-slate-800 placeholder:text-slate-300 ${
                        errors.confirmPassword
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword}</p>}
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-violet-200 transition-opacity disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Resetting…" : "Reset Password"}
                </button>

                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessState({ email }: { email: string }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={26} className="text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Password Reset</h1>
      <p className="text-slate-500 text-sm mt-2">
        Your password for <span className="font-semibold text-slate-700">{email}</span> has been updated successfully.
      </p>
      <p className="text-xs text-slate-400 mt-6">Redirecting you to login…</p>
    </div>
  );
}