"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();
    const { session, isAdmin } = useAuth();

    // Auto-redirect if already logged in as admin
    useEffect(() => {
        if (session && isAdmin) {
            router.replace("/admin/dashboard");
        }
    }, [session, isAdmin, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Force log out any existing session so we strictly trigger `onAuthStateChange` for AuthContext
        await supabase.auth.signOut();

        const { error, data } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            showToast(error.message, "error");
            setIsLoading(false);
            return;
        }

        if (data.session) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', data.session.user.id)
                .single();

            if (profile?.is_admin) {
                showToast("Admin access granted", "success");
                // Intentionally stall here. 
                // We let the `useEffect` above handle the `router.replace` once `AuthContext` globally syncs `isAdmin = true`.
            } else {
                showToast("Access denied: You are not an administrator.", "error");
                await supabase.auth.signOut();
                setIsLoading(false);
            }
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            showToast("Please enter your email above to reset password.", "error");
            return;
        }
        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
            showToast(error.message, "error");
        } else {
            showToast("Password reset email sent! Check your inbox.", "success");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] font-sans">
            <div className="w-full max-w-[400px] bg-white p-12 rounded-3xl shadow-2xl shadow-black/5">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">UD Admin</h1>
                    <p className="text-gray-500">Sign in to manage your inventory</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 font-medium"
                            placeholder="Admin Email"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 font-medium"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gray-900 text-white font-bold py-4 rounded-xl transition-all transform ${!isLoading ? 'hover:bg-black active:scale-[0.98]' : 'opacity-70 cursor-not-allowed'}`}
                    >
                        {isLoading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-3 flex flex-col items-center">
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={isLoading}
                        className="text-sm font-medium text-[#0b3c2e] hover:underline transition"
                    >
                        Forgot Password?
                    </button>
                    <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">Back to Store</a>
                </div>
            </div>
        </div>
    );
}
