"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/context/ProductContext";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Product } from "@/data/products";
import ProductForm from "@/app/admin/components/ProductForm";

export default function EditProductPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const { products, updateProduct, isInitialized } = useProduct();
    const router = useRouter();
    const { showToast } = useToast();

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
                <Loader2 className="h-12 w-12 text-[var(--color-primary)] animate-spin mb-4" />
                <p className="text-gray-500 font-medium tracking-wide">Connecting to Supabase Cloud...</p>
            </div>
        );
    }

    const product = products.find(p => p.id === id);

    const handleUpdateProduct = async (updatedData: Omit<Product, "id">) => {
        if (!product) return;

        try {
            const updatedProduct: Product = {
                id: product.id,
                ...updatedData
            };

            await updateProduct(updatedProduct);
            showToast("Product updated securely in the Cloud!", "success");
            router.push("/admin/dashboard");
        } catch (error) {
            console.error(error);
            showToast("Failed to update product", "error");
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full border border-red-100">
                    <p className="text-red-500 font-bold text-lg mb-2">Product Not Found</p>
                    <p className="text-gray-500 text-sm mb-6">This product ID ({id}) does not exist in the cloud database.</p>
                    <Link href="/admin/dashboard" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="font-bold text-xl text-gray-900">Edit Product: {product.title}</h1>
                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium transition">
                        <ArrowLeft className="h-4 w-4" /> Cancel
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <ProductForm
                    initialData={product}
                    onSubmit={handleUpdateProduct}
                    isEditing={true}
                />
            </main>
        </div>
    );
}
