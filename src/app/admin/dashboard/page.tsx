"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2, LogOut, Package } from "lucide-react";
import { useProduct } from "../../../context/ProductContext";
import { useToast } from "../../../context/ToastContext";

export default function AdminDashboard() {
    const { products, deleteProduct } = useProduct();
    const router = useRouter();
    const { showToast } = useToast();

    // Auth is handled in AdminLayout now

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteProduct(id);
            showToast("Product deleted successfully", "success");
        }
    };



    // Calc Stats
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.buyPrice || 0), 0);

    return (
        <div className="space-y-8 font-sans">
            {/* Header / Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500">Overview of your inventory and products.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-teal-900/20 font-bold"
                >
                    <Plus className="h-5 w-5" />
                    Add Product
                </Link>
            </div>

            {/* Dashboard Stats Only */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Package className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <span className="text-2xl font-bold">LKR</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Inventory Value</p>
                            <p className="text-2xl font-bold text-gray-900">{totalInventoryValue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">More analytics coming soon...</p>
            </div>
        </div>
    );
}
