"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Tent } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
    const { showToast } = useToast();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            }
        });
        if (error) {
            showToast(error.message, "error");
        }
        setIsLoading(false);
    };

    const handleEmailLogin = async () => {
        if (!email || !password) {
            showToast("Please enter your email and password.", "error");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setIsLoading(false);
        if (error) {
            showToast(error.message, "error");
        } else {
            showToast("Logged in successfully!", "success");
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Column - Immersive Image (Desktop Only) */}
            <div className="hidden lg:block relative w-1/2 min-h-screen overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
                    style={{ backgroundImage: 'url("https://cdnp.flypgs.com/files/Ekstrem_Sporlar/camping-kampcilik-nedir.jpg")' }}
                ></div>
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="absolute inset-0 flex flex-col justify-between p-16 text-white z-10">
                    {/* Logo Removed as per user request */}
                    <div></div>

                    <div>
                        <blockquote className="text-4xl font-serif leading-tight mb-6">
                            "The clearest way into the Universe is through a forest wilderness."
                        </blockquote>
                        <cite className="not-italic text-white/70 font-medium tracking-wide block mb-2">— John Muir</cite>
                        <div className="h-1 w-12 bg-white rounded-full mt-8"></div>
                    </div>

                    <div className="text-xs text-white/50 tracking-wider">
                        © 2026 UD CAMPING GEARS. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8 xl:p-12">
                <div className="max-w-md w-full mx-auto">
                    {/* Brand Name for Mobile */}
                    <div className="lg:hidden flex items-center justify-center mb-6 border-b border-gray-100 pb-4">
                        <span className="font-extrabold tracking-widest uppercase text-lg text-[#0b3c2e]">UD Camping Gears</span>
                    </div>

                    <div className="mb-5">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 text-sm">Enter your details to access your account.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-900 font-bold py-2.5 rounded-xl transition-all group text-sm ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer'}`}
                        >
                            <svg className="h-5 w-5 opacity-90 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="group-hover:text-black transition-colors">Sign in with Google</span>
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider font-medium">Or continue with email</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }}>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#0b3c2e] focus:ring-1 focus:ring-[#0b3c2e] focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 font-medium text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#0b3c2e] focus:ring-1 focus:ring-[#0b3c2e] focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 font-medium text-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between pb-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0b3c2e] focus:ring-[#0b3c2e]" />
                                    <span className="text-[13px] text-gray-500 font-medium">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-[13px] font-bold text-[#0b3c2e] hover:underline">Forgot password?</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-[#0b3c2e] text-white font-bold py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group text-sm ${!isLoading ? 'hover:bg-[#092e23] hover:-translate-y-0.5 shadow-green-900/20' : 'opacity-70 cursor-not-allowed shadow-none'}`}
                            >
                                {isLoading ? "Logging in..." : "Log in to my account"}
                                {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>

                    <div className="mt-5 text-center">
                        <p className="text-gray-500 font-medium text-sm">
                            Don't have an account? <Link href="/register" className="text-[#0b3c2e] font-bold hover:underline">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
