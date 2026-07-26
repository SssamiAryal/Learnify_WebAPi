import Link from "next/link";
import {
  BookOpen,
  MessageSquareText,
  ClipboardCheck,
  Sparkles,
  Flame,
  ArrowRight,
  Check,
  Users,
  Languages,
  Trophy,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* NAV */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Learnify
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-opacity shadow-sm shadow-violet-200"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(124,58,237,0.08), transparent 45%), radial-gradient(circle at 85% 25%, rgba(79,70,229,0.08), transparent 40%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={13} />
            AI-powered language learning
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight max-w-3xl mx-auto">
            Learn a language your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              brain actually keeps
            </span>
          </h1>

          <p className="text-lg text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
            Structured lessons, adaptive quizzes, and an AI tutor that answers the moment you're
            confused — not a rigid course that leaves you guessing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white px-7 py-3.5 rounded-xl text-base font-semibold transition-opacity shadow-md shadow-violet-200"
            >
              Start your first lesson
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-700 px-7 py-3.5 rounded-xl text-base font-semibold transition-colors"
            >
              I already have an account
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-5">No credit card required · Free lessons to start</p>
        </div>

        {/* Preview card */}
        <div className="max-w-4xl mx-auto px-6 -mt-2 pb-20">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Today's lesson</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Ordering Food at a Café</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                <BookOpen size={18} />
              </div>
            </div>

            <div className="space-y-3">
              <PreviewRow
                prompt="How do you politely ask for the bill?"
                answer="“L'addition, s'il vous plaît.”"
                correct
              />
              <PreviewRow
                prompt="Translate: 'I'd like a coffee, please.'"
                answer="“Je voudrais un café, s'il vous plaît.”"
                correct
              />
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Flame size={15} className="text-orange-500" />
                12-day streak
              </div>
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                <Check size={15} /> 2/2 correct
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          <Stat icon={<Users size={18} className="text-violet-600" />} value="12,000+" label="Active learners" />
          <Stat icon={<Languages size={18} className="text-violet-600" />} value="8" label="Languages supported" />
          <Stat icon={<Trophy size={18} className="text-violet-600" />} value="94%" label="Lesson completion rate" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-2">Why Learnify</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Everything you need to actually stick with it
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<BookOpen size={22} className="text-violet-600" />}
            bg="bg-violet-50"
            title="Interactive Lessons"
            description="Bite-sized, structured lessons that build on each other — no wasted repetition, no dead ends."
          />
          <FeatureCard
            icon={<ClipboardCheck size={22} className="text-blue-600" />}
            bg="bg-blue-50"
            title="Smart Quizzes"
            description="Every lesson ends with a quiz that adapts to what you actually got wrong, not a generic test."
          />
          <FeatureCard
            icon={<MessageSquareText size={22} className="text-emerald-600" />}
            bg="bg-emerald-50"
            title="AI Learning Assistant"
            description="Stuck on a phrase at 11pm? Ask the AI tutor and get an answer in seconds, not tomorrow's class."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Three steps. No overwhelm.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              title="Pick a starting level"
              description="Tell us where you're at — Learnify places you into lessons that match, not a course built for everyone."
            />
            <StepCard
              step="2"
              title="Learn in short sessions"
              description="10–15 minutes a day. Read, listen, respond — then a quiz locks it in before you move on."
            />
            <StepCard
              step="3"
              title="Track real progress"
              description="See your streak, completed lessons, and what to review next — not just a vague percentage."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Your first lesson takes less time than reading this page took.
            </h2>
            <p className="text-violet-100 mt-4 max-w-md mx-auto">
              Start free. No credit card, no long onboarding — just your first lesson.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 px-7 py-3.5 rounded-xl text-base font-semibold transition-colors mt-8 shadow-sm"
            >
              Start Your Learning Journey
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700">Learnify</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Learnify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ icon, value, label }: any) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, bg, title, description }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: any) {
  return (
    <div className="text-center md:text-left">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center mx-auto md:mx-0 mb-4">
        {step}
      </div>
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 leading-relaxed">{description}</p>
    </div>
  );
}

function PreviewRow({ prompt, answer, correct }: { prompt: string; answer: string; correct?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-sm text-slate-500">{prompt}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm font-medium text-slate-800">{answer}</p>
        {correct && (
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Check size={12} />
          </span>
        )}
      </div>
    </div>
  );
}