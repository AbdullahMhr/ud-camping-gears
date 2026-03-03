"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Review } from "../data/products";
import { supabase } from "../lib/supabaseClient";

interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (updatedProduct: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addReview: (productId: string, review: Omit<Review, "id" | "date">) => Promise<void>;
    isInitialized: boolean;
    refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ensureDefaults = (p: any): Product => ({
    ...p,
    rentStock: p.rentStock !== undefined ? p.rentStock : 10,
    sellStock: p.sellStock !== undefined ? p.sellStock : 10,
    reviews: p.reviews || [],
    images: p.images || [],
    specs: p.specs || [],
    isActive: p.is_active !== undefined ? p.is_active : true,
    sortOrder: p.sort_order !== undefined ? p.sort_order : 0,
});

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const refreshProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching products:", error);
            } else if (data) {
                setProducts(data.map(ensureDefaults));
            }
        } catch (e) {
            console.error("Failed to fetch products from Supabase", e);
        } finally {
            setIsInitialized(true);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    const mapToDB = (p: Product) => {
        const payload: any = { ...p, is_active: p.isActive, sort_order: p.sortOrder };
        delete payload.isActive;
        delete payload.sortOrder;
        return payload;
    };

    const addProduct = async (product: Product) => {
        const p = ensureDefaults(product);
        const { error } = await supabase.from('products').insert([mapToDB(p)]);
        if (error) throw error;
        await refreshProducts();
    };

    const updateProduct = async (updatedProduct: Product) => {
        const p = ensureDefaults(updatedProduct);
        const { error } = await supabase.from('products').update(mapToDB(p)).eq('id', p.id);
        if (error) throw error;
        await refreshProducts();
    };

    const deleteProduct = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await refreshProducts();
    };

    const addReview = async (productId: string, review: Omit<Review, "id" | "date">) => {
        const p = products.find(prod => prod.id === productId);
        if (!p) throw new Error("Product not found");

        const newReview: Review = {
            ...review,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString()
        };

        // 10/10 Security Patch: We execute a Stored Procedure to safely append the review server-side,
        // preventing malicious actors from hijacking an UPDATE call to alter rentPrices or inventory.
        const { error } = await supabase.rpc('add_product_review', {
            p_id: productId,
            p_review: newReview
        });

        if (error) {
            console.error("Failed to add review safely via RPC:", error);
            throw error;
        }

        await refreshProducts();
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview, isInitialized, refreshProducts }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
}
