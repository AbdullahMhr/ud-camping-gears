import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    price: string;
    originalPrice?: string;
    imageAlt: string;
    imageUrl?: string;
    onAddToCart?: () => void;
}

export default function ProductCard({
    id,
    title,
    description,
    price,
    originalPrice,
    imageAlt,
    imageUrl = "https://placehold.co/600x400/png",
    onAddToCart
}: ProductCardProps) {
    return (
        <div className="group relative block rounded-xl p-[1.5px] bg-gray-100 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-500 flex flex-col h-full">
            <div className="bg-white w-full h-full rounded-[10.5px] overflow-hidden flex flex-col">
                <div className="relative h-64 sm:h-72 shrink-0">
                    <Link href={`/products/${id}`}>
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            style={{ viewTransitionName: `product-image-${id}` }}
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 cursor-pointer"
                        />
                    </Link>
                </div>

                <div className="relative p-6 bg-white border-t border-gray-100 flex flex-col flex-1">
                    <h3 className="mt-1.5 text-lg font-medium text-gray-900">
                        <Link href={`/products/${id}`} className="hover:underline">
                            {title}
                        </Link>
                    </h3>

                    <p className="mt-1.5 line-clamp-3 text-sm text-gray-500 flex-1">
                        {description}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[var(--color-primary)]">
                            {price}
                        </span>
                        {originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                {originalPrice}
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart?.();
                            }}
                            className="flex-1 rounded bg-black/5 p-3 text-sm font-medium text-gray-900 transition hover:bg-black/10 flex items-center justify-center gap-1"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Add
                        </button>
                        <Link
                            href={`/products/${id}`}
                            className="flex-[2] rounded bg-[var(--color-primary)] p-3 text-sm font-medium text-white transition hover:bg-opacity-90 text-center"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
