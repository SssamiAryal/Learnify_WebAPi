"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Camera,
  Home,
  BookOpen,
  BarChart3,
  User,
  Edit3,
  Save,
  Key,
  LogOut,
  Shield,
  Bell,
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, setUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setDateOfBirth(user.dateOfBirth || "");
      setGender(user.gender || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);
    if (imageFile) formData.append("profileImage", imageFile);

    await fetch("/api/v1/auth/update", {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });

    const res = await fetch("/api/v1/auth/whoami", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setUser(data.user);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = await fetch("/api/v1/auth/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Password updated");
      setShowPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(data.message || "Error");
    }
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm">

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
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu</p>
          <SidebarItem icon={<Home size={18} />} title="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem icon={<BookOpen size={18} />} title="Lessons" />
          <SidebarItem icon={<BarChart3 size={18} />} title="Progress" />
          <SidebarItem icon={<Bell size={18} />} title="Notifications" />

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-5 mb-2">Account</p>
          <SidebarItem icon={<User size={18} />} title="Profile" active />
          <SidebarItem icon={<Shield size={18} />} title="Security" />
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
            <LogOut size={15} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">

          {/* Page header */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Account</p>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage your personal information and account settings.</p>
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Cover banner */}
            <div className="h-28 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
              />
            </div>

            {/* Avatar + header actions */}
            <div className="px-8 pb-6">
              <div className="flex items-end justify-between -mt-12 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" />
                    ) : user?.profileImage ? (
                      <img src={`http://localhost:5000/uploads/${user.profileImage}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white">{initials}</span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 hover:bg-violet-700 rounded-xl flex items-center justify-center cursor-pointer shadow-md transition-colors">
                      <Camera size={14} className="text-white" />
                      <input type="file" hidden onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>

                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    isEditing
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                >
                  {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                  {isEditing ? "Save changes" : "Edit profile"}
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 mb-6" />

              {/* Form grid */}
              <div className="grid grid-cols-2 gap-5">
                <ProfileInput
                  label="Full Name"
                  value={fullName}
                  setValue={setFullName}
                  disabled={!isEditing}
                />
                <ProfileInput
                  label="Email Address"
                  value={email}
                  setValue={setEmail}
                  disabled={!isEditing}
                />
                <ProfileInput
                  label="Date of Birth"
                  value={dateOfBirth}
                  setValue={setDateOfBirth}
                  type="date"
                  disabled={!isEditing}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Gender</label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none
                      ${!isEditing
                        ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-slate-800"
                      }`}
                    value={gender}
                    disabled={!isEditing}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-5 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Security</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage your password and login settings.</p>
            </div>
            <div className="px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Key size={18} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Password</p>
                  <p className="text-xs text-slate-400">Last updated recently</p>
                </div>
              </div>
              <button
                onClick={() => setShowPassword(true)}
                className="text-sm font-semibold text-violet-600 hover:text-violet-800 px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors"
              >
                Change password
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* PASSWORD MODAL */}
      {showPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPassword(false); }}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Key size={18} className="text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                  <p className="text-xs text-slate-400">Enter your current password to continue.</p>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <ModalInput
                label="Current Password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={setOldPassword}
              />
              <ModalInput
                label="New Password"
                placeholder="Choose a strong password"
                value={newPassword}
                onChange={setNewPassword}
              />
              <ModalInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPassword(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-sm"
              >
                Update password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileInput({ label, value, setValue, disabled = false, type = "text" }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none
          ${disabled
            ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-slate-800"
          }`}
      />
    </div>
  );
}

function ModalInput({ label, placeholder, value, onChange }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</label>
      <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
      />
    </div>
  );
}

function SidebarItem({ icon, title, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
        active
          ? "bg-violet-50 text-violet-700 font-semibold"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <span className={active ? "text-violet-600" : ""}>{icon}</span>
      {title}
    </button>
  );
}