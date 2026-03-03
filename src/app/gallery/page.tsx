"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";
import { useGallery } from "../../context/GalleryContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabaseClient";

export default function GalleryPage() {
    const { images, isLoading } = useGallery();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            // Compress standard static images (JPEG/PNG) safely, but pass GIFs/SVGs straight through to preserve animation/vectors
            const shouldCompress = !['image/gif', 'image/svg+xml', 'image/webp'].includes(file.type);

            const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
                if (!shouldCompress) return Promise.resolve(file); // Bypass directly

                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            let width = img.width;
                            let height = img.height;

                            if (width > maxWidth) {
                                height = Math.round((height * maxWidth) / width);
                                width = maxWidth;
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext("2d");
                            if (!ctx) return resolve(file);

                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0, width, height);

                            canvas.toBlob(
                                (blob) => {
                                    if (!blob) return resolve(file);
                                    const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                                    const compressedFile = new File([blob], newFileName, {
                                        type: "image/jpeg",
                                        lastModified: Date.now(),
                                    });
                                    resolve(compressedFile);
                                },
                                "image/jpeg",
                                quality
                            );
                        };
                        img.onerror = (error) => reject(error);
                        img.src = event.target?.result as string;
                    };
                    reader.onerror = (error) => reject(error);
                });
            };

            const finalFile = await compressImage(file);
            const fileExt = finalFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const customFilePath = `gallery/${fileName}`;

            // 1. Upload to Supabase Storage Bucket
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(customFilePath, finalFile);

            if (uploadError) {
                console.error("Storage Error:", uploadError);
                throw new Error(`Storage Error: ${uploadError.message}`);
            }

            // 2. Get Public URL
            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(customFilePath);

            // 3. Insert Database Record bridging the file to the user
            const { error: dbError } = await supabase
                .from('gallery_images')
                .insert({
                    image_url: publicUrlData.publicUrl,
                    user_id: user.id
                });

            if (dbError) {
                console.error("Database Insert Error:", dbError);
                throw new Error(`Database Error: ${dbError.message}`);
            }

            showToast("Successfully added to the Community Gallery!", "success");
        } catch (error: any) {
            console.error("Gallery Upload Pipeline Error:", error);
            showToast(`Failed to upload: ${error.message || "Unknown error"}`, "error");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Adventure Gallery</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                    See where our gear can take you. Share your own moments with the community.
                </p>

                {/* Authenticated Upload Widget */}
                {user ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-3xl max-w-lg mx-auto transition-all hover:bg-emerald-50">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-[#0b3c2e]">
                            <ImagePlus className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Share Your Expedition</h3>
                        <p className="text-sm text-gray-500 mb-6 px-4">Upload a photo from your latest trip to be featured in the global community gallery.</p>

                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                        <button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            className="flex items-center gap-2 bg-[#0b3c2e] hover:bg-emerald-900 tracking-wider text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-teal-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {isUploading ? "Uploading..." : "Upload Photo"}
                        </button>
                    </div>
                ) : (
                    <div className="inline-block bg-gray-50 border border-gray-200 text-gray-500 text-sm font-medium px-6 py-3 rounded-full">
                        Sign in to upload your own photos to the gallery
                    </div>
                )}
            </div>

            {/* Dynamic Gallery Stream */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-medium tracking-wide uppercase text-sm">Loading Community Images...</p>
                </div>
            ) : images.length > 0 ? (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="break-inside-avoid relative group overflow-hidden rounded-2xl cursor-pointer shadow-sm border border-gray-100 bg-gray-50"
                            onClick={() => setSelectedImage(img.image_url)}
                        >
                            <img
                                src={img.image_url}
                                alt="Community Expedition"
                                className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                <span className="text-white font-medium text-lg tracking-wider transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                    View Photo
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    <ImagePlus className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No photos yet</h3>
                    <p>Be the first to share an adventure photo!</p>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 transition-all duration-300 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition bg-white/10 p-3 rounded-full hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="relative max-w-6xl w-full max-h-[90vh] rounded-lg overflow-hidden flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage}
                            alt="Full Screen Community View"
                            className="w-full h-full object-contain max-h-[90vh] shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
