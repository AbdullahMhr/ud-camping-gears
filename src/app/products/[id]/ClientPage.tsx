"use client";

import { useState, use, useEffect } from "react";

import { Star, Calendar, ShoppingBag, MessageCircle, ShieldCheck, Ruler, Users, Droplets, Weight, Battery, Thermometer, Flame, X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { useProduct } from "../../../context/ProductContext";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabaseClient";
const iconMap: any = {
    Ruler: <Ruler className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    Droplets: <Droplets className="h-5 w-5" />,
    Weight: <Weight className="h-5 w-5" />,
    Battery: <Battery className="h-5 w-5" />,
    Thermometer: <Thermometer className="h-5 w-5" />,
    ShieldCheck: <ShieldCheck className="h-5 w-5" />,
    Flame: <Flame className="h-5 w-5" />,
    Calendar: <Calendar className="h-5 w-5" />
};

import { useParams } from "next/navigation";

export default function ProductDetail() {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const { products, isInitialized, addReview } = useProduct();
    const product = products.find((p) => p.id === id);
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { user, isAdmin } = useAuth();

    // Layout States
    const [mainImage, setMainImage] = useState("");
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Set initial image when product loads
    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    // Modes and Inventory States
    const [buyingMode, setBuyingMode] = useState<'rent' | 'sell' | undefined>(undefined);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            if (product.listingType === 'sell') setBuyingMode('sell');
            else if (product.listingType === 'rent') setBuyingMode('rent');
            else setBuyingMode('rent'); // default for both
            setQuantity(1);
        }
    }, [product]);

    // Dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(tomorrow);

    // Reviews
    const [isReviewing, setIsReviewing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [dbReviews, setDbReviews] = useState<any[]>([]);



    const fetchReviews = async () => {
        if (!product) return;
        const { data, error } = await supabase
            .from('reviews')
            .select('*, profiles(full_name)')
            .eq('product_id', product.id)
            .order('created_at', { ascending: false });
        if (!error && data) {
            setDbReviews(data);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [product]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
                    <Link href="/products" className="block mt-4 text-gray-500 hover:text-gray-900 font-medium">
                        Back to Catalog
                    </Link>
                </div>
            </div>
        );
    }

    const currentStock = buyingMode === 'sell' ? product.sellStock : product.rentStock;
    const isOutOfStock = currentStock === undefined || currentStock <= 0;

    const calculateDays = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        const diffTime = e.getTime() - s.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };
    const days = calculateDays(startDate, endDate);

    const price = buyingMode === 'sell' ? product.buyPrice : product.rentPrice;
    const totalPrice = (price || 0) * (buyingMode === 'rent' ? days : 1) * quantity;

    const handleAddToCart = () => {
        if (isOutOfStock) {
            showToast("Sorry, this item is out of stock", "error");
            return;
        }
        // Iterate and add multiple times if quantity > 1 (Since our cart logic increments identically ID'd items)
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: `${product.id}-${buyingMode}`, // Unique ID for Mode
                name: `${product.title} (${buyingMode === 'sell' ? 'Purchase' : 'Rental'})`,
                price: buyingMode === 'rent' ? (price! * days) : price!, // Passing total price per unit action
                image: product.imageUrl,
                description: buyingMode === 'rent' ? `For ${days} days (${startDate} to ${endDate})` : `Buying New`,
                unit: buyingMode === 'rent' ? 'rental' : 'item',
                maxStock: currentStock
            });
        }
        showToast(`Added ${quantity} item(s) to cart!`, "success");
    };

    const submitReview = async () => {
        if (!reviewComment.trim()) {
            showToast("Review comment cannot be empty", "error");
            return;
        }
        if (!user) {
            showToast("You must be logged in to review.", "error");
            return;
        }

        if (editingReviewId) {
            const { error } = await supabase.from('reviews').update({
                rating: reviewRating,
                comment: reviewComment
            }).eq('id', editingReviewId);

            if (error) {
                showToast(error.message, "error");
                return;
            }
            showToast("Review updated successfully!", "success");
        } else {
            const { error } = await supabase.from('reviews').insert({
                product_id: product.id,
                user_id: user.id,
                rating: reviewRating,
                comment: reviewComment
            });

            if (error) {
                showToast(error.message, "error");
                return;
            }
            showToast("Review submitted successfully!", "success");
        }

        setIsReviewing(false);
        setEditingReviewId(null);
        setReviewComment("");
        setReviewRating(5);
        fetchReviews();
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) {
            showToast(error.message, "error");
            return;
        }
        showToast("Review deleted successfully!", "success");
        fetchReviews();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            {/* Lightbox */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition p-2 z-[70]"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <img
                        src={mainImage}
                        alt={product.title}
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl relative z-[65]"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                {/* Left Column: Gallery */}
                <div className="space-y-4">
                    <div
                        className="aspect-square relative overflow-hidden rounded-3xl bg-gray-100 cursor-zoom-in group border border-gray-200"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={product.title}
                                style={{ viewTransitionName: `product-image-${id}` }}
                                className="object-cover w-full h-full transition duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-white/90 backdrop-blur text-gray-900 px-6 py-3 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                View Fullscreen
                            </div>
                        </div>
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-2xl bg-gray-100 overflow-hidden cursor-pointer border-2 transition-all duration-200 ${mainImage === img ? 'border-[#0b3c2e] ring-1 ring-[#0b3c2e]' : 'border-transparent hover:border-gray-200'}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt="" className="object-cover w-full h-full" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Info */}
                <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0b3c2e] mb-1 leading-tight tracking-tight">
                        {product.title}
                    </h1>
                    <p className="text-base text-gray-400 mb-5 font-medium">{product.subtitle}</p>

                    {/* Dynamic Pricing Mode Selection */}
                    {product.listingType === 'both' && (
                        <div className="flex gap-3 mb-5">
                            <button
                                className={`flex-1 p-3 rounded-xl border-2 transition text-left ${buyingMode === 'rent' ? 'border-[#0b3c2e] bg-green-50 shadow-md transform -translate-y-0.5' : 'border-gray-200 hover:border-[#0b3c2e]/50 hover:bg-gray-50'}`}
                                onClick={() => { setBuyingMode('rent'); setQuantity(1); }}
                            >
                                <span className="block text-[10px] font-bold text-[#0b3c2e]/60 tracking-wider mb-0.5 uppercase">RENT</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-[#0b3c2e]">LKR {product.rentPrice}</span>
                                    <span className="text-xs text-gray-500">/day</span>
                                </div>
                            </button>
                            <button
                                className={`flex-1 p-3 rounded-xl border-2 transition text-left ${buyingMode === 'sell' ? 'border-[#0b3c2e] bg-green-50 shadow-md transform -translate-y-0.5' : 'border-gray-200 hover:border-[#0b3c2e]/50 hover:bg-gray-50'}`}
                                onClick={() => { setBuyingMode('sell'); setQuantity(1); }}
                            >
                                <span className="block text-[10px] font-bold text-[#0b3c2e]/60 tracking-wider mb-0.5 uppercase">BUY NEW</span>
                                <span className="text-xl font-bold text-[#0b3c2e]">LKR {product.buyPrice?.toLocaleString()}</span>
                            </button>
                        </div>
                    )}

                    {product.listingType !== 'both' && (
                        <div className="flex items-center gap-6 mb-5 pb-5 border-b border-gray-100">
                            {buyingMode === 'rent' && (
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 tracking-wider mb-0.5 uppercase">RENT ONLY</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl md:text-3xl font-bold text-[#0b3c2e]">LKR {product.rentPrice}</span>
                                        <span className="text-gray-400 text-xs font-medium">/ day</span>
                                    </div>
                                </div>
                            )}
                            {buyingMode === 'sell' && (
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 tracking-wider mb-0.5 uppercase">BUY ONLY</span>
                                    <span className="text-2xl md:text-3xl font-bold text-[#0b3c2e]">LKR {product.buyPrice?.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <p className="text-gray-600 leading-relaxed text-sm mb-6">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {product.specs && product.specs.map((spec) => (
                            <div key={spec.label} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                                <div className="text-[#0b3c2e]">
                                    {iconMap[spec.icon] || <ShieldCheck className="h-5 w-5" />}
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">{spec.label}</span>
                                    <span className="font-bold text-gray-900 text-xs sm:text-sm">{spec.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stock & Quantity Control */}
                    <div className="flex items-center gap-5 mb-5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">QUANTITY</span>
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white w-28">
                                <button
                                    className="px-3 py-3 hover:bg-gray-100 disabled:opacity-30 transition"
                                    disabled={quantity <= 1 || isOutOfStock}
                                    onClick={() => setQuantity(q => q - 1)}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <div className="flex-1 text-center font-bold">{isOutOfStock ? 0 : quantity}</div>
                                <button
                                    className="px-3 py-3 hover:bg-gray-100 disabled:opacity-30 transition"
                                    disabled={quantity >= (currentStock || 0) || isOutOfStock}
                                    onClick={() => setQuantity(q => q + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end h-full pt-5">
                            {isOutOfStock ? (
                                <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg text-xs">Out of Stock</span>
                            ) : (
                                <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
                                    {currentStock} available {buyingMode === 'rent' ? 'for rent' : 'to buy'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Date Picker (Only for Rent) */}
                    {buyingMode === 'rent' && !isOutOfStock && (
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Rental Dates</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 hover:border-[#0b3c2e] transition">
                                    <label className="text-xs text-gray-500 font-medium block">From</label>
                                    <input
                                        type="date"
                                        min={today}
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            if (e.target.value >= endDate) {
                                                const nextDay = new Date(new Date(e.target.value).getTime() + 86400000).toISOString().split('T')[0];
                                                setEndDate(nextDay);
                                            }
                                        }}
                                        className="w-full text-base font-bold text-[#0b3c2e] outline-none"
                                    />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 hover:border-[#0b3c2e] transition relative">
                                    <label className="text-xs text-gray-500 font-medium block">To</label>
                                    <input
                                        type="date"
                                        min={new Date(new Date(startDate).getTime() + 86400000).toISOString().split('T')[0]}
                                        value={endDate}
                                        onChange={(e) => {
                                            if (e.target.value <= startDate) {
                                                setEndDate(new Date(new Date(startDate).getTime() + 86400000).toISOString().split('T')[0]);
                                            } else {
                                                setEndDate(e.target.value);
                                            }
                                        }}
                                        className="w-full text-base font-bold text-[#0b3c2e] outline-none bg-transparent"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0b3c2e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none">
                                        {days} Days
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-auto">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`flex-1 font-bold rounded-xl py-3 px-4 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-xl ${isOutOfStock ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed' : 'bg-[#0b3c2e] hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 text-white shadow-md hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'}`}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            {isOutOfStock ? 'Unavailable' : `Add to Cart - LKR ${totalPrice.toLocaleString()}`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section - Always Visible */}
            <div className="mt-16 pt-12 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-[#0b3c2e]">Customer Reviews</h2>
                    {user && !isAdmin && !isReviewing && (
                        <button
                            onClick={() => {
                                setIsReviewing(true);
                                setEditingReviewId(null);
                                setReviewRating(5);
                                setReviewComment("");
                            }}
                            className="bg-white border-2 border-[#0b3c2e] text-[#0b3c2e] font-bold py-2 px-5 rounded-xl text-sm hover:bg-[#0b3c2e] hover:text-white transition"
                        >
                            Write a Review
                        </button>
                    )}
                    {!user && (
                        <div className="text-sm text-gray-500 border border-gray-200 px-4 py-3 rounded-lg bg-gray-50 inline-block">
                            Please <Link href="/login" className="text-[#0b3c2e] font-bold underline">log in</Link> to leave a review.
                        </div>
                    )}
                </div>

                {isReviewing && (
                    <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-100 relative">
                        <button onClick={() => {
                            setIsReviewing(false);
                            setEditingReviewId(null);
                        }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X className="h-5 w-5" /></button>
                        <h3 className="font-bold text-gray-900 mb-3 text-sm">{editingReviewId ? 'Edit your rating' : 'Leave your rating'}</h3>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setReviewRating(star)}>
                                    <Star className={`h-6 w-6 transition ${star <= reviewRating ? 'fill-yellow-400 text-yellow-500 transform scale-110' : 'text-gray-300 hover:text-yellow-200'}`} />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                            placeholder="Tell us what you think..."
                            className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-[#0b3c2e] outline-none mb-3 text-sm"
                        ></textarea>
                        <button onClick={submitReview} className="bg-[#0b3c2e] text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-[#06241b] transition">
                            {editingReviewId ? 'Update Review' : 'Submit Review'}
                        </button>
                    </div>
                )}

                {dbReviews.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Summary */}
                        <div className="lg:col-span-1">
                            {(() => {
                                const avgRating = dbReviews.length > 0 ? (dbReviews.reduce((acc, r) => acc + r.rating, 0) / dbReviews.length) : 0;
                                return (
                                    <>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-5xl font-bold text-[#0b3c2e]">{avgRating > 0 ? avgRating.toFixed(1) : "0.0"}</span>
                                            <div className="text-sm text-gray-500 font-medium">out of 5</div>
                                        </div>
                                        <div className="flex text-yellow-400 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-5 w-5 ${i < Math.round(avgRating) ? 'fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm font-medium">{dbReviews.length} {dbReviews.length === 1 ? 'Review' : 'Reviews'}</p>

                                        <div className="space-y-2.5">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = dbReviews.filter(r => r.rating === star).length || 0;
                                                const total = dbReviews.length || 1;
                                                const percent = (count / total) * 100;

                                                return (
                                                    <div key={star} className="flex items-center gap-4 text-sm">
                                                        <span className="font-bold text-gray-500 w-3">{star}</span>
                                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                                                style={{ width: `${percent}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Review List */}
                        <div className="lg:col-span-2 space-y-6">
                            {dbReviews.map((review: any) => (
                                <div key={review.id} className="border-b border-gray-100 pb-6 hover:bg-gray-50/50 p-3 rounded-xl transition-colors -ml-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-[#0b3c2e] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                {review.profiles?.full_name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{review.profiles?.full_name || "Anonymous User"}</div>
                                                <div className="text-[11px] text-gray-500">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm ml-11 text-pretty mb-3">
                                        "{review.comment}"
                                    </p>
                                    {user && user.id === review.user_id && (
                                        <div className="ml-11 flex gap-3 text-xs font-bold">
                                            <button onClick={() => {
                                                setEditingReviewId(review.id);
                                                setReviewRating(review.rating);
                                                setReviewComment(review.comment);
                                                setIsReviewing(true);
                                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll down to review form
                                            }} className="text-gray-400 hover:text-[#0b3c2e] transition">Edit</button>
                                            <button onClick={() => deleteReview(review.id)} className="text-gray-400 hover:text-red-500 transition">Delete</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
