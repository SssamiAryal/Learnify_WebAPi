"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return "Enter a valid email address.";
    return undefined;
  };

  const handleSendCode = async () => {
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(undefined);

    try {
      setSending(true);

      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      router.push(`/auth/verify-code?email=${email}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSending(false);
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
          {sent ? (
            <SuccessState email={email} onResend={handleSendCode} resending={sending} />
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-violet-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
                <p className="text-slate-500 text-sm mt-2">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(undefined);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all text-slate-800 placeholder:text-slate-300 ${error
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                      }`}
                  />
                  {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-violet-200 transition-opacity disabled:opacity-60"
                >
                  {sending && <Loader2 size={16} className="animate-spin" />}
                  {sending ? "Sending code…" : "Send Verification Code"}
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

function SuccessState({ email, onResend, resending }: { email: string; onResend: () => void; resending: boolean }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={26} className="text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Check Your Inbox</h1>
      <p className="text-slate-500 text-sm mt-2">
        We've sent a verification code to
      </p>
      <p className="text-sm font-semibold text-slate-800 mt-1">{email}</p>

      <div className="mt-8 space-y-3">
        <p className="text-xs text-slate-400">
          Didn't receive the code?{" "}
          <button
            onClick={onResend}
            disabled={resending}
            className="font-semibold text-violet-600 hover:text-violet-800 transition-colors disabled:opacity-60"
          >
            {resending ? "Resending…" : "Resend code"}
          </button>
        </p>

        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors pt-3 border-t border-slate-100"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}