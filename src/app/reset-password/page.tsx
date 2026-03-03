"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        // Supabase will automatically parse the #access_token from the URL hash
        // and set the session. We just need to wait for it.
        const hash = window.location.hash;
        if (!hash || !hash.includes("access_token")) {
            // Optional: You could redirect if no token is found, but sometimes 
            // the session recovers gracefully. We'll rely on Supabase's `updateUser`.
        }
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        if (password.length < 6) {
            showToast("Password must be at least 6 characters long.", "error");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        setIsLoading(false);

        if (error) {
            showToast(error.message, "error");
        } else {
            showToast("Password updated successfully! You can now log in.", "success");
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] font-sans p-4">
            <div className="w-full max-w-[400px] bg-white p-10 rounded-3xl shadow-2xl shadow-black/5">
                <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-[#0b3c2e] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-900/20 transform rotate-3">
                        <ShieldCheck className="h-8 w-8 -rotate-3" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Set New Password</h1>
                    <p className="text-gray-500 text-sm">Enter your new secure password below.</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider ml-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            placeholder="••••••••••"
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#0b3c2e] focus:ring-1 focus:ring-[#0b3c2e] focus:bg-white transition-all outline-none font-medium text-gray-900 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 mb-2">
                        <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider ml-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={6}
                            placeholder="••••••••••"
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#0b3c2e] focus:ring-1 focus:ring-[#0b3c2e] focus:bg-white transition-all outline-none font-medium text-gray-900 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-bold py-3.5 mt-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-xl ${isLoading ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed' : 'bg-[#0b3c2e] text-white shadow-[#0b3c2e]/20 hover:bg-[#07271e] hover:-translate-y-0.5'}`}
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
