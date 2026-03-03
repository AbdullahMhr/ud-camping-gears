"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Tent } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPasswordPage() {
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            showToast("Please enter your email address.", "error");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        setIsLoading(false);
        if (error) {
            showToast(error.message, "error");
        } else {
            setIsSent(true);
            showToast("Password reset link sent to your email.", "success");
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans items-center justify-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="flex justify-center mb-10 text-[#0b3c2e] border-b border-gray-100 pb-4">
                    <span className="font-extrabold tracking-widest uppercase text-xl text-[#0b3c2e]">UD Camping Gears</span>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
                    <p className="text-gray-500 text-sm">
                        {isSent
                            ? "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder."
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#0b3c2e] focus:ring-1 focus:ring-[#0b3c2e] focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 font-medium text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#0b3c2e] text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed shadow-none' : 'hover:bg-[#092e23] hover:-translate-y-0.5 shadow-green-900/20'}`}
                        >
                            {isLoading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => { setIsSent(false); setEmail(""); }}
                        className="w-full bg-white border-2 border-gray-200 text-gray-900 font-bold py-3 rounded-xl transition-all hover:bg-gray-50 text-sm"
                    >
                        Try another email
                    </button>
                )}

                <div className="mt-8 text-center">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0b3c2e] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
