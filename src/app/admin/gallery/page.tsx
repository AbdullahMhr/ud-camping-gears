"use client";

import { useGallery } from "../../../context/GalleryContext";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { Trash2, AlertTriangle, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminGalleryPage() {
    const { images, isLoading, deleteImage } = useGallery();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Hardcoded safety net: only load interface if they are the designated admin
    if (!user || user.email !== 'abdullahmhr64@gmail.com') {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center text-gray-400">
                <AlertTriangle className="h-16 w-16 mb-4 text-orange-500 opacity-50" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Protocol</h2>
                <p>This panel is restricted exclusively to administrative personnel.</p>
            </div>
        );
    }

    const handleDelete = async (id: string, url: string) => {
        if (!confirm("Are you absolutely certain you wish to permanently vaporize this community image from both the active database and cloud storage bucket? This action is irreversible.")) return;

        setDeletingId(id);
        try {
            await deleteImage(id, url);
            showToast("Community asset successfully wiped.", "success");
        } catch (error) {
            console.error("Failed to delete asset:", error);
            showToast("Failed to delete asset. Ensure you hold remote RLS authorizations.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <ImageIcon className="h-8 w-8 text-[#0b3c2e]" />
                        Gallery Moderation
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide">
                        Monitor user uploads and globally eradicate rogue imagery.
                    </p>
                </div>
                <div className="bg-[#0b3c2e]/5 px-6 py-4 rounded-3xl border border-[#0b3c2e]/10 text-center hidden md:block">
                    <div className="text-3xl font-black text-[#0b3c2e]">{images.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#0b3c2e]/60">Live Assets</div>
                </div>
            </div>

            {images.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 flex flex-col items-center">
                    <ImageIcon className="w-16 h-16 text-gray-200 mb-6" />
                    <h3 className="text-xl font-bold text-gray-800 mb-3">No Gallery Data</h3>
                    <p className="text-gray-500">The community gallery timeline is currently empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                            <img
                                src={img.image_url}
                                alt="Gallery upload"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-3 truncate">
                                    ID: {img.id.split('-')[0]}
                                </p>
                                <button
                                    onClick={() => handleDelete(img.id, img.image_url)}
                                    disabled={deletingId === img.id}
                                    className="w-full bg-red-500/90 hover:bg-red-500 backdrop-blur-sm text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
                                >
                                    {deletingId === img.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span>Obliterate</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

