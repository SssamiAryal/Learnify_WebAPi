"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Camera, Home, BookOpen, BarChart3, User, Edit3, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  // editable fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [password] = useState("********");

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  // fill form when user loads
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
      <div className="flex h-screen items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/v1/auth/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Updated:", data);

      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-indigo-600">Learnify</h1>

          <div className="mt-8 flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {user?.fullName?.charAt(0) || "U"}
            </div>

            <div>
              <p className="font-semibold">{user?.fullName}</p>
              <p className="text-sm text-gray-600">Student</p>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 space-y-2">
          <SidebarItem icon={<Home size={20} />} title="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem icon={<BookOpen size={20} />} title="Lessons" />
          <SidebarItem icon={<BarChart3 size={20} />} title="Progress" />
          <SidebarItem icon={<User size={20} />} title="Profile" active />
        </div>

        <div className="mt-auto p-5">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
            >
              {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          {/* PROFILE IMAGE */}
          <div className="mt-6 flex flex-col items-center">
            <div className="relative w-28 h-28">
              <div className="w-28 h-28 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.fullName?.charAt(0) || "U"
                )}
              </div>

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
                  <Camera size={16} className="text-indigo-600" />
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="mt-8 grid grid-cols-2 gap-4">

            <Input label="Full Name" value={fullName} setValue={setFullName} disabled={!isEditing} />
            <Input label="Email" value={email} setValue={setEmail} disabled={!isEditing} />

            <Input
              label="Date of Birth"
              value={dateOfBirth}
              setValue={setDateOfBirth}
              type="date"
              disabled={!isEditing}
            />

            <select
              className="p-3 border rounded-xl"
              value={gender}
              disabled={!isEditing}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <Input label="Password" value={password} disabled />
          </div>
        </div>
      </main>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, value, setValue, disabled = false, type = "text" }: any) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 border rounded-xl disabled:bg-gray-100"
      />
    </div>
  );
}

/* SIDEBAR */
function SidebarItem({ icon, title, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
        active
          ? "bg-indigo-100 text-indigo-600 font-semibold"
          : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}