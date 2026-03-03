"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { Trash2, Star, RefreshCw } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { useProduct } from "../../../context/ProductContext";
import Image from "next/image";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const { products } = useProduct();

    const fetchReviews = async () => {
        setIsLoading(true);
        // Fetch base reviews and profile data. We avoid joining `products` directly in SQL 
        // to prevent strict foreign-key 500 errors if products were deleted or out of sync.
        const { data, error } = await supabase
            .from('reviews')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Map product metadata natively via Client Context
            const mappedReviews = data.map(review => {
                const matchedProduct = products.find(p => p.id === review.product_id);
                return {
                    ...review,
                    products: {
                        title: matchedProduct?.title || "Unknown Product",
                        images: matchedProduct?.images || []
                    }
                };
            });
            setReviews(mappedReviews);
        } else if (error) {
            showToast("Failed to fetch reviews: " + error.message, "error");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (products.length > 0) {
            fetchReviews();
        }
    }, [products]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this review?")) return;

        const { error } = await supabase.from('reviews').delete().eq('id', id);

        if (error) {
            showToast(error.message, "error");
            return;
        }

        showToast("Review deleted successfully.", "success");
        fetchReviews();
    };

    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0b3c2e] tracking-tight">Review Moderation</h1>
                    <p className="text-gray-500 mt-1">Manage and moderate all customer reviews across your catalog.</p>
                </div>
                <button
                    onClick={fetchReviews}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 transition shadow-sm"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-[#0b3c2e]' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100/80">
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Reviewer</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[300px]">Comment</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-400 font-medium">Loading reviews...</td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-400 font-medium">No reviews have been submitted yet.</td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-[#0b3c2e]/10 text-[#0b3c2e] rounded-full flex items-center justify-center font-bold text-sm">
                                                    {review.profiles?.full_name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm whitespace-nowrap">{review.profiles?.full_name || "Anonymous User"}</div>
                                                    <div className="text-[11px] text-gray-400">
                                                        {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                {review.products?.images?.[0] && (
                                                    <img src={review.products.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                                                )}
                                                <span className="font-medium text-gray-700 text-sm max-w-[200px] truncate block" title={review.products?.title}>
                                                    {review.products?.title || "Unknown Product"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex text-yellow-400 bg-yellow-50 w-fit px-2 py-1 rounded-lg border border-yellow-100">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-yellow-200/50'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
