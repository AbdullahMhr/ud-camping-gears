"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useToast } from "../../../context/ToastContext";

export default function AdminSettingsPage() {
    const { showToast } = useToast();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            showToast("Please fill in both password fields.", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        if (newPassword.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        setIsLoading(false);

        if (error) {
            showToast(error.message, "error");
        } else {
            showToast("Password updated successfully!", "success");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    return (
        <div className="space-y-8 font-sans max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500">Manage your admin preferences.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Security</h2>
                    <p className="text-sm text-gray-500">Update your password securely.</p>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] bg-gray-50"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] bg-gray-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleUpdatePassword}
                        disabled={isLoading}
                        className={`flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition font-bold shadow-md shadow-teal-900/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save className="h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">General</h2>
                    <p className="text-sm text-gray-500">Site-wide configurations.</p>
                </div>
                <div className="p-8">
                    <p className="text-gray-500 italic">No general settings available yet.</p>
                </div>
            </div>
        </div>
    );
}
