"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schema";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth-action";

type RegisterType = z.infer<typeof registerSchema>;

export default function RegisterFormZod() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterType) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      dateOfBirth: data.dob,
      gender: data.gender,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const result = await registerUser(payload);

    if (result.success) {
      setShowPopup(true);
    } else {
      alert(result.message);
    }
  };

  const inputStyle =
    "w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-black text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]";

  const dateStyle =
    "w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5] [color-scheme:light]";

  const selectStyle =
    "w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]";

  return (
    <div className="h-screen flex overflow-hidden bg-[#F5F6FA]">
      <div className="hidden lg:flex w-[58%] items-center justify-center bg-[#5B3DF5] px-14">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-center text-white space-y-6"
        >
          <h1 className="text-4xl font-semibold text-white">Start. Learn. Improve.</h1>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 shadow-xl space-y-6">
            <div className="flex justify-center">
              <Image
                src="/assets/images/register_image.png"
                alt="Register"
                width={260}
                height={260}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>

            <p className="text-sm text-white leading-relaxed">
              Join Learnify and start building structured learning habits with a modern experience.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="w-full lg:w-[42%] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-8 relative"
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <Image
              src="/assets/images/learnify.png"
              alt="Learnify"
              width={110}
              height={90}
              className="rounded-xl drop-shadow-md"
            />
          </div>

          <div className="mt-28">
            <h2 className="text-xl font-semibold text-center text-black">
              Create Account
            </h2>

            <p className="text-center text-black text-sm mt-2 mb-6">
              Join Learnify today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input {...register("fullName")} placeholder="Full Name" className={inputStyle} />
            <p className="text-xs text-black">{errors.fullName?.message}</p>

            <input {...register("email")} placeholder="Email Address" className={inputStyle} />
            <p className="text-xs text-black">{errors.email?.message}</p>

            <input type="date" {...register("dob")} className={dateStyle} />
            <p className="text-xs text-black">{errors.dob?.message}</p>

            <select {...register("gender")} className={selectStyle}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <p className="text-xs text-black">{errors.gender?.message}</p>

            <input type="password" {...register("password")} placeholder="Password" className={inputStyle} />
            <p className="text-xs text-black">{errors.password?.message}</p>

            <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" className={inputStyle} />
            <p className="text-xs text-black">{errors.confirmPassword?.message}</p>

            <div className="flex items-center gap-2 text-xs text-black">
              <input type="checkbox" />
              <span>I agree to terms</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5B3DF5] hover:bg-[#4a2fe0] text-white py-2.5 rounded-xl text-sm font-medium"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-xs text-black mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#5B3DF5] font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl p-6 text-center w-[300px]"
            >
              <h2 className="text-lg font-semibold text-black">
                Account Created 🎉
              </h2>

              <p className="text-sm text-black mt-2">
                Your account has been successfully created.
              </p>

              <button
                onClick={() => router.push("/auth/login")}
                className="mt-4 w-full bg-[#5B3DF5] text-white py-2 rounded-xl text-sm hover:bg-[#4a2fe0]"
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}