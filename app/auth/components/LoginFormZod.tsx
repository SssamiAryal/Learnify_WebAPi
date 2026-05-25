"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { z } from "zod";
import { motion } from "framer-motion";

type LoginType = z.infer<typeof loginSchema>;

export default function LoginFormZod() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginType) => {
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
            Learn. Grow. Succeed.
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
                src="/assets/images/login_image.png"
                alt="Login"
                width={260}
                height={260}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </motion.div>

            <p className="text-sm text-white/90 leading-relaxed">
              "The capacity to learn is a gift; the ability to learn is a skill;
              the willingness to learn is a choice"
            </p>

          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE (UPDATED CLEAN FORM) */}
      <div className="w-full lg:w-[42%] flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-10 py-14 relative"
        >

          {/* LOGO (NO BACKGROUND BOX NOW) */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <Image
                src="/assets/images/learnify.png"
                alt="Learnify"
                width={120}
                height={500}
                className="rounded-xl drop-shadow-md"
              />
            </motion.div>
          </div>

          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-8">
            Welcome back
          </h2>

          <p className="text-center text-gray-500 text-sm mt-1 mb-8">
            Login to your Learnify account
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
              <p className="text-xs text-red-500 mt-1">
                {errors.email?.message}
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              />
              <p className="text-xs text-red-500 mt-1">
                {errors.password?.message}
              </p>
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#5B3DF5]" />
                Remember me
              </label>

              <button type="button" className="text-[#5B3DF5] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#5B3DF5] hover:bg-[#4a2fe0] text-white py-3 rounded-xl font-medium transition"
            >
              Login
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
              <Image src="/assets/images/google.png" width={18} height={18} alt="Google" />
              Google
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
              <Image src="/assets/images/facebook.png" width={18} height={18} alt="Facebook" />
              Facebook
            </button>
          </div>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#5B3DF5] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}