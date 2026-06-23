"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  BookOpen,
  BarChart3,
  User,
  Search,
  Bell,
  Settings,
  Flame,
  CheckCircle,
  MessageSquare,
  Award,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <aside className="w-72 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-indigo-600">Learnify</h1>

          <div className="mt-8 flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {user?.fullName?.charAt(0) || "S"}
            </div>

            <div>
              <p className="font-semibold text-black">{user?.fullName}</p>
              <p className="text-sm text-gray-600">Student</p>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4">
          <p className="text-sm text-gray-500 mb-4">Continue your learning</p>

          <nav className="space-y-2">
            <SidebarItem icon={<Home size={20} />} title="Dashboard" active />
            <SidebarItem icon={<BookOpen size={20} />} title="Lessons" />
            <SidebarItem icon={<BarChart3 size={20} />} title="Progress" />
            <SidebarItem
              icon={<User size={20} />}
              title="Profile"
              onClick={() => router.push("/dashboard/profile")}
            />
          </nav>
        </div>

        <div className="mt-auto p-5">
          <p className="text-indigo-600 text-sm font-medium mb-3">
            Ready For More?
          </p>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700">
            Start Daily Lesson
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 text-black">
        <div className="flex items-center justify-between mb-8">
          <div />

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                placeholder="Search Lesson"
                className="pl-10 pr-4 py-2 bg-white rounded-full border outline-none w-72 text-black"
              />
            </div>

            <Settings className="text-indigo-600 cursor-pointer" />
            <Bell className="text-indigo-600 cursor-pointer" />

            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
              {user?.fullName?.charAt(0) || "S"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-black">
                Hello, {user?.fullName || "Samir"}!
              </h1>

              <p className="text-gray-600 mt-3">
                Your journey is 65% complete, keep going!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm text-black">
              <div className="flex justify-between items-center">
                <div className="flex gap-6 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"
                    className="w-40 h-28 object-cover rounded-xl"
                  />

                  <div>
                    <h2 className="text-3xl font-bold text-black">
                      Advanced Conversational French
                    </h2>

                    <p className="text-gray-600 mt-3">
                      Unit 4: Business Environments
                    </p>

                    <div className="flex gap-4 mt-6">
                      <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
                        Continue Lesson
                      </button>

                      <button className="border px-6 py-3 rounded-xl text-black">
                        Review Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold text-black">
                  Recommended for You
                </h3>

                <button className="text-indigo-600">View More →</button>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <CourseCard
                  image="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"
                  title="Idiomatic Expressions"
                  description="Master native phrases"
                  duration="22 min"
                />

                <CourseCard
                  image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500"
                  title="Listening Skills"
                  description="Real conversations practice"
                  duration="15 min"
                />
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 text-black">
              <p className="font-semibold text-lg">Current Streak</p>

              <div className="flex justify-between items-center mt-4">
                <div>
                  <h2 className="text-6xl text-indigo-600 font-bold">12</h2>
                  <p className="text-gray-600">Days</p>
                </div>

                <div className="bg-orange-100 p-4 rounded-full">
                  <Flame size={40} className="text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 text-black">
              <p className="font-semibold mb-4">Daily Goal</p>

              <div className="flex justify-between mb-3">
                <span>25/60 min</span>
                <span className="text-indigo-600">40%</span>
              </div>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[40%]" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 text-black">
              <h3 className="font-bold text-2xl mb-5">Recent Activity</h3>

              <ActivityItem
                icon={<CheckCircle />}
                color="bg-green-100 text-green-600"
                title='Completed "Grammar Quiz"'
                subtitle="2 hours ago"
              />

              <ActivityItem
                icon={<MessageSquare />}
                color="bg-blue-100 text-blue-600"
                title='Joined "Study Group"'
                subtitle="5 hours ago"
              />

              <ActivityItem
                icon={<Award />}
                color="bg-yellow-100 text-yellow-600"
                title='Earned Badge'
                subtitle="Yesterday"
              />
            </div>
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
        active
          ? "bg-indigo-100 text-indigo-600 font-semibold"
          : "hover:bg-gray-100 text-black"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}

function CourseCard({ image, title, description, duration }: any) {
  return (
    <div className="bg-white rounded-3xl p-4 text-black">
      <img src={image} className="h-44 w-full object-cover rounded-2xl" />
      <h4 className="font-bold text-xl mt-4">{title}</h4>
      <p className="text-gray-600 text-sm mt-2">{description}</p>
      <p className="text-indigo-600 mt-4 font-medium">{duration}</p>
    </div>
  );
}

function ActivityItem({ icon, color, title, subtitle }: any) {
  return (
    <div className="flex gap-4 mb-5 text-black">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}