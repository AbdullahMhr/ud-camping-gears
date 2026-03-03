"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useProduct } from "../../context/ProductContext";

function ProductsContent() {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { products } = useProduct();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || "";

    const filteredProducts = products
        .filter(p => p.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .filter(product =>
            product.title.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery) ||
            product.subtitle.toLowerCase().includes(searchQuery)
        );

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Premium Gear for Your Next Adventure</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Explore our curated collection of high-quality equipment available for rent and sale.
                    Gear up for the wild with confidence.
                </p>
                {searchQuery && (
                    <p className="mt-4 text-emerald-700 font-medium bg-emerald-50 inline-block px-4 py-2 rounded-lg">
                        Showing results for: "{searchParams.get('search')}"
                    </p>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-lg">
                    No products found matching your search.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            description={product.description}
                            price={`LKR ${product.rentPrice}`}
                            originalPrice={product.id === "1" || product.id === "3" ? `LKR ${Math.round((product.rentPrice || 0) * 1.2)}` : undefined}
                            imageAlt={product.title}
                            imageUrl={product.imageUrl}
                            onAddToCart={() => {
                                addToCart({
                                    id: `${product.id}-rent`,
                                    name: `${product.title} (Rental)`,
                                    price: product.rentPrice || 0,
                                    image: product.imageUrl,
                                    description: product.subtitle,
                                    unit: "rental",
                                    maxStock: product.rentStock
                                });
                                showToast(`Added ${product.title} to cart!`, "success");
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b3c2e]"></div></div>}>
            <ProductsContent />
        </Suspense>
    );
}
