"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Filter, Eye, EyeOff } from "lucide-react";
import { useProduct } from "../../../context/ProductContext";
import { useToast } from "../../../context/ToastContext";

export default function AdminProductsPage() {
    const { products, deleteProduct, updateProduct } = useProduct();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteProduct(id);
            showToast("Product deleted successfully", "success");
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleStatus = (id: string, currentStatus: boolean | undefined) => {
        const productToUpdate = products.find(p => p.id === id);
        if (productToUpdate) {
            updateProduct({ ...productToUpdate, isActive: !currentStatus });
            showToast(`Product marked as ${!currentStatus ? 'Active' : 'Hidden'}`, "success");
        }
    };

    const updateSortOrder = (id: string, newOrder: number) => {
        const productToUpdate = products.find(p => p.id === id);
        if (productToUpdate) {
            updateProduct({ ...productToUpdate, sortOrder: newOrder });
            showToast("Sort order updated", "success");
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500">Manage your product inventory.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-teal-900/20 font-bold"
                >
                    <Plus className="h-5 w-5" />
                    Add Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition"
                    />
                </div>
                {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
                    <Filter className="h-4 w-4" /> Filters
                </button> */}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-16 text-center">Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rent Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Buy Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className={`hover:bg-gray-50 transition group ${product.isActive === false ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="number"
                                            value={product.sortOrder || 0}
                                            onChange={(e) => updateSortOrder(product.id, parseInt(e.target.value) || 0)}
                                            className="w-16 p-1 text-center border border-gray-200 rounded-md focus:ring-2 focus:ring-[#0b3c2e] focus:border-[#0b3c2e] outline-none transition"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{product.title}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.subtitle}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(product.id, product.isActive)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${product.isActive !== false ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-200'}`}
                                            title="Click to toggle visibility"
                                        >
                                            {product.isActive !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            {product.isActive !== false ? 'Active' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">LKR {product.rentPrice}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">LKR {(product.buyPrice || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/products/edit/${product.id}`}
                                                className="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-green-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 text-gray-300" />
                                            <p>No products found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
