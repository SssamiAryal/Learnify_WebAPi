"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schema";
import { z } from "zod";
import { motion } from "framer-motion";

type RegisterType = z.infer<typeof registerSchema>;

export default function RegisterFormZod() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterType) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex bg-[#F5F6FA]">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-[58%] items-center justify-center bg-[#5B3DF5] px-16">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-center text-white space-y-8"
        >

          <h1 className="text-4xl font-semibold tracking-tight">
            Start. Learn. Improve.
          </h1>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl space-y-5">

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="overflow-hidden rounded-2xl"
            >
              <Image
                src="/assets/images/register_image.png"
                alt="Register Illustration"
                width={280}
                height={280}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </motion.div>

            <p className="text-sm text-white/90 leading-relaxed">
              Join Learnify and start building your skills with structured,
              focused and modern learning experience.
            </p>

          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-[42%] flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-10 py-12 relative"
        >

          {/* LOGO (same style as login) */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <Image
              src="/assets/images/learnify.png"
              alt="Learnify"
              width={70}
              height={70}
              className="rounded-xl drop-shadow-md"
            />
          </div>

          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-8">
            Create Account
          </h2>

          <p className="text-center text-gray-500 text-sm mt-1 mb-8">
            Join Learnify and start learning
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* FULL NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              />
              <p className="text-xs text-red-500 mt-1">{errors.fullName?.message}</p>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              />
              <p className="text-xs text-red-500 mt-1">{errors.email?.message}</p>
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob")}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              />
              <p className="text-xs text-red-500 mt-1">{errors.dob?.message}</p>
            </div>

            {/* GENDER */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <p className="text-xs text-red-500 mt-1">{errors.gender?.message}</p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create password"
                {...register("password")}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              />
              <p className="text-xs text-red-500 mt-1">{errors.password?.message}</p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              />
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword?.message}
              </p>
            </div>

            {/* TERMS */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-[#5B3DF5]" />
              <span>I agree to the terms & conditions</span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#5B3DF5] hover:bg-[#4a2fe0] text-white py-3 rounded-xl font-medium transition"
            >
              Create Account
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#5B3DF5] font-medium hover:underline"
            >
              Login
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}