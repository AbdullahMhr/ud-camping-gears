"use client";

import { useRouter } from "next/navigation";
import { useProduct } from "@/context/ProductContext";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Product } from "@/data/products";
import ProductForm from "@/app/admin/components/ProductForm";

export default function AddProductPage() {
    const { addProduct, products } = useProduct();
    const router = useRouter();
    const { showToast } = useToast();

    const handleCreateProduct = async (productData: Omit<Product, "id">) => {
        try {
            // Generate UUID natively for the new product matching postgres text id
            const newId = crypto.randomUUID();

            const newProduct: Product = {
                id: newId,
                ...productData
            };

            await addProduct(newProduct);
            showToast("Product added to Cloud successfully!", "success");
            router.push("/admin/dashboard");
        } catch (error) {
            console.error(error);
            showToast("Failed to save product to Cloud", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="font-bold text-xl text-gray-900">Add New Product</h1>
                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm">
                        <ArrowLeft className="h-4 w-4" /> Cancel
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <ProductForm onSubmit={handleCreateProduct} />
            </main>
        </div>
    );
}
