"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export interface GalleryImage {
    id: string;
    image_url: string;
    user_id: string;
    created_at: string;
}

interface GalleryContextType {
    images: GalleryImage[];
    isLoading: boolean;
    refreshImages: () => Promise<void>;
    deleteImage: (id: string, imageUrl: string) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchImages = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("gallery_images")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setImages(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchImages();

        // Set up realtime subscription for new images
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'gallery_images'
                },
                () => {
                    fetchImages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const deleteImage = async (id: string, imageUrl: string) => {
        try {
            // 1. Delete the logical row in DB (Requires Admin RLS)
            const { error: dbError } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Extract path & Delete the physical file from Supabase storage
            // The url looks like: https://[URL].supabase.co/storage/v1/object/public/product-images/gallery/[filename.jpg]
            try {
                const urlParts = imageUrl.split('/product-images/');
                if (urlParts.length === 2) {
                    const filePath = urlParts[1]; // e.g., "gallery/filename.jpg"
                    await supabase.storage.from('product-images').remove([filePath]);
                }
            } catch (storageError) {
                console.error("Storage deletion issue (DB row deleted):", storageError);
            }

            // Update local state proactively
            setImages(prev => prev.filter(img => img.id !== id));

        } catch (error) {
            console.error("Failed to delete image:", error);
            throw error;
        }
    };

    return (
        <GalleryContext.Provider value={{ images, isLoading, refreshImages: fetchImages, deleteImage }}>
            {children}
        </GalleryContext.Provider>
    );
}

export function useGallery() {
    const context = useContext(GalleryContext);
    if (context === undefined) {
        throw new Error("useGallery must be used within a GalleryProvider");
    }
    return context;
}
