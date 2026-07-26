"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const code = digits.join("");

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");
    if (!sanitized) {
      const updated = [...digits];
      updated[index] = "";
      setDigits(updated);
      return;
    }

    const updated = [...digits];
    updated[index] = sanitized[sanitized.length - 1];
    setDigits(updated);

    if (index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (error) setError(undefined);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const updated = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (updated[i] = char));
    setDigits(updated);
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
    if (error) setError(undefined);
  };

  const handleVerify = async () => {
    if (code.length !== CODE_LENGTH) {
      setError(`Please enter the ${CODE_LENGTH}-digit code.`);
      return;
    }
    setError(undefined);

    try {
      setVerifying(true);
      const res = await fetch("/api/v1/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid or expired code. Please try again.");
        return;
      }

      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setResending(true);
      // TODO: replace with your real resend endpoint, e.g.:
      // await sendPasswordResetCode(email);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array(CODE_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setResending(false);
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
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={26} className="text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Verify Code</h1>
            <p className="text-slate-500 text-sm mt-2">Enter the verification code sent to</p>
            <p className="font-semibold text-slate-700 mt-1">{email || "your email"}</p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold rounded-xl border outline-none focus:ring-2 transition-all text-slate-800 ${
                      error
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                    }`}
                  />
                ))}
              </div>
              {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-violet-200 transition-opacity disabled:opacity-60"
            >
              {verifying && <Loader2 size={16} className="animate-spin" />}
              {verifying ? "Verifying…" : "Verify Code"}
            </button>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending}
                  className="font-semibold text-violet-600 hover:text-violet-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resending ? "Resending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </p>
            </div>

            <Link
              href="/auth/forgot-password"
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors pt-3 border-t border-slate-100"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}