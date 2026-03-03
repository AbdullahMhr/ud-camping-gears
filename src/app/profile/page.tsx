"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../context/ToastContext";
import { LogOut, User, MapPin, Phone, Save, Cloud, Mountain, TreePine, Tent } from "lucide-react";

export default function ProfilePage() {
    const { session, user, signOut } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [profile, setProfile] = useState({
        full_name: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        if (!session) {
            router.replace("/login");
            return;
        }

        const loadProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, phone, address')
                .eq('id', user?.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    phone: data.phone || "",
                    address: data.address || ""
                });
            }
        };

        loadProfile();
    }, [session, user, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: profile.full_name,
                phone: profile.phone,
                address: profile.address
            })
            .eq('id', user?.id);

        setIsLoading(false);

        if (error) {
            showToast("Failed to update profile.", "error");
        } else {
            showToast("Profile updated successfully!", "success");
        }
    };

    const handleLogout = async () => {
        await signOut();
        showToast("Logged out successfully", "success");
        router.push("/");
    };

    if (!session) return null;

    return (
        <div className="min-h-screen pt-28 pb-20 font-sans bg-[#f8faf9] relative overflow-hidden selection:bg-green-500/30">
            {/* Custom Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes floatCloud {
                    0% { transform: translateX(-10vw); }
                    100% { transform: translateX(110vw); }
                }
                @keyframes floatCloudReverse {
                    0% { transform: translateX(110vw); }
                    100% { transform: translateX(-10vw); }
                }
                @keyframes swayTree {
                    0% { transform: rotate(-3deg); transform-origin: bottom center; }
                    100% { transform: rotate(3deg); transform-origin: bottom center; }
                }
                @keyframes pulseTent {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02) translateY(-2px); }
                }
                @keyframes floatCard {
                    0%, 100% { transform: translateY(0); box-shadow: 0 10px 30px rgba(11,60,46,0.04); }
                    50% { transform: translateY(-20px); box-shadow: 0 40px 60px rgba(11,60,46,0.12); }
                }
            `}} />

            {/* Camping / Nature Animated Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Floating Clouds */}
                <div className="absolute top-[15%] w-full opacity-[0.03] text-[#0b3c2e] z-0">
                    <Cloud className="w-48 h-48 absolute top-0" style={{ animation: 'floatCloud 45s linear infinite' }} />
                    <Cloud className="w-64 h-64 absolute top-20" style={{ animation: 'floatCloudReverse 60s linear infinite' }} />
                    <Cloud className="w-32 h-32 absolute top-10" style={{ animation: 'floatCloud 30s linear infinite 15s' }} />
                </div>

                {/* Mountains Background Base */}
                <div className="absolute bottom-0 w-full flex justify-between items-end opacity-[0.02] text-[#0b3c2e] -mb-10 scale-150 transform-origin-bottom">
                    <Mountain className="w-96 h-96 -ml-20" />
                    <Mountain className="w-80 h-80 -mr-20" />
                </div>

                {/* Animated Trees & Tent */}
                <div className="absolute bottom-0 w-full h-[40vh] flex items-end justify-center gap-4 sm:gap-12 opacity-[0.04] text-[#0b3c2e]">
                    <TreePine className="w-32 h-40 sm:w-48 sm:h-64 mb-10" style={{ animation: 'swayTree 4s ease-in-out infinite alternate' }} />
                    <div className="flex flex-col items-center justify-end z-10 mb-8 sm:mb-12" style={{ animation: 'pulseTent 4s ease-in-out infinite' }}>
                        <Tent className="w-24 h-24 sm:w-32 sm:h-32 text-[#0b3c2e]" />
                    </div>
                    <TreePine className="w-24 h-32 sm:w-40 sm:h-56 mb-8" style={{ animation: 'swayTree 5s ease-in-out infinite alternate-reverse' }} />
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left hover:scale-[1.02] transition-transform duration-500">
                        <div className="relative">
                            {/* Green Avatar Ring */}
                            <div className="absolute inset-0 bg-[#0b3c2e] rounded-full blur-md opacity-20"></div>
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#0b3c2e] to-emerald-400 p-[3px] shadow-xl overflow-hidden">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white relative z-10">
                                    <User className="w-12 h-12 text-[#0b3c2e]" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0b3c2e] tracking-tight mb-2 font-serif">
                                {profile.full_name || "Unknown Explorer"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-gray-500">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0b3c2e]"></span>
                                </span>
                                <span className="text-sm font-medium tracking-wider uppercase text-gray-500">{user?.email}</span>
                            </div>
                        </div>
                    </div>
                    {/* Clean Green Disconnect */}
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-emerald-50 text-gray-600 hover:text-[#0b3c2e] border border-gray-200 hover:border-emerald-200 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-xs font-bold tracking-widest uppercase">Disconnect</span>
                    </button>
                </div>

                {/* Solid White Structural Form Card (Animated Floating effect) */}
                <div
                    className="bg-white/95 border border-gray-100/80 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-xl w-full mx-auto"
                    style={{ animation: 'floatCard 6s ease-in-out infinite' }}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-[#0b3c2e] to-emerald-300"></div>

                    <div className="mb-10 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                            <MapPin className="w-6 h-6 text-[#0b3c2e]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Expedition Details</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage your identification and delivery coordinates.</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-8 relative z-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Email (Read-only) */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Authentication Identity</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-gray-500 font-medium cursor-not-allowed text-sm"
                                />
                            </div>

                            {/* Full Name */}
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold text-[#0b3c2e] uppercase tracking-widest mb-3 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0b3c2e]">
                                        <User className="h-4 w-4 text-gray-400 group-focus-within:text-[#0b3c2e] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#0b3c2e]/30 focus:ring-4 focus:ring-[#0b3c2e]/10 transition-all text-gray-900 text-sm font-medium outline-none placeholder:text-gray-400 shadow-sm"
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Comms Link <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0b3c2e]">
                                        <Phone className="h-4 w-4 text-gray-400 group-focus-within:text-[#0b3c2e] transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#0b3c2e]/30 focus:ring-4 focus:ring-[#0b3c2e]/10 transition-all text-gray-900 text-sm font-medium outline-none placeholder:text-gray-400 shadow-sm"
                                        placeholder="Mobile number"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Basecamp Location <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <div className="relative group">
                                    <div className="absolute top-5 left-0 pl-5 pointer-events-none transition-colors group-focus-within:text-[#0b3c2e]">
                                        <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-[#0b3c2e] transition-colors" />
                                    </div>
                                    <textarea
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#0b3c2e]/30 focus:ring-4 focus:ring-[#0b3c2e]/10 transition-all text-gray-900 text-sm font-medium min-h-[120px] resize-y outline-none placeholder:text-gray-400 shadow-sm"
                                        placeholder="Enter your detailed shipping coordinates..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative overflow-hidden flex items-center gap-3 bg-[#0b3c2e] text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(11,60,46,0.3)] ${!isLoading ? 'hover:shadow-[0_8px_30px_rgba(11,60,46,0.5)] hover:-translate-y-1' : 'opacity-70 cursor-not-allowed'}`}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <Save className="w-4 h-4 relative z-10" />
                                <span className="relative z-10 tracking-wide uppercase">{isLoading ? "Synchronizing..." : "Update Coordinates"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
