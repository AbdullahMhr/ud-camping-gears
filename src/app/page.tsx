"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "./components/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useProduct } from "../context/ProductContext";

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products } = useProduct();
  const featuredProducts = products
    .filter(p => p.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .slice(0, 4);
  const [explosion, setExplosion] = useState<{ activeBtn: string, particles: any[] } | null>(null);

  const handleExplosionLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string, btnName: string) => {
    e.preventDefault();

    // Camp / Smoke colors for the explosion effect
    const smokeColors = ['#ffffff', '#f1f5f9', '#cbd5e1', '#0b3c2e', '#94a3b8'];

    // Generate 30 particles expanding from button center
    const particles = Array.from({ length: 30 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 40 + Math.random() * 80; // Pixels to travel outward
      return {
        id: i,
        tx: `${Math.cos(angle) * velocity}px`,
        ty: `${Math.sin(angle) * velocity}px`,
        color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
        size: 10 + Math.random() * 20
      };
    });

    setExplosion({ activeBtn: btnName, particles });

    // Transition slightly before animation finishes so it feels seamless
    setTimeout(() => {
      router.push(href);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="/hero_camping.jpg"
          alt="UD Camping Gears Setup"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-20 container mx-auto px-4 max-w-4xl">
          <style>{`
            @keyframes smokeOut {
              0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.9; }
              100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5); opacity: 0; }
            }
          `}</style>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Adventure Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Experience the wild in unparalleled comfort with our premium rental gear.
            From yurts to ultra-light sleeping bags, we equip your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              onClick={(e) => handleExplosionLink(e, "/products", "rent")}
              className="relative px-8 py-4 font-bold rounded-full transition-all transform hover:scale-105 bg-[var(--color-primary)] text-white shadow-lg"
            >
              <span className="relative z-10">Rent Gear</span>
              {explosion?.activeBtn === "rent" && (
                <div className="absolute inset-0 z-0 overflow-visible pointer-events-none">
                  {explosion.particles.map(p => (
                    <span
                      key={p.id}
                      className="absolute left-1/2 top-1/2 rounded-full animate-[smokeOut_0.5s_ease-out_forwards]"
                      style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        '--tx': p.tx,
                        '--ty': p.ty
                      } as any}
                    />
                  ))}
                </div>
              )}
            </Link>
            <Link
              href="/about"
              onClick={(e) => handleExplosionLink(e, "/about", "learn")}
              className="relative px-8 py-4 font-bold rounded-full transition-all transform hover:scale-105 bg-white text-[var(--color-primary)] hover:bg-gray-100 shadow-lg"
            >
              <span className="relative z-10">Learn More</span>
              {explosion?.activeBtn === "learn" && (
                <div className="absolute inset-0 z-0 overflow-visible pointer-events-none">
                  {explosion.particles.map(p => (
                    <span
                      key={p.id}
                      className="absolute left-1/2 top-1/2 rounded-full animate-[smokeOut_0.5s_ease-out_forwards]"
                      style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        '--tx': p.tx,
                        '--ty': p.ty
                      } as any}
                    />
                  ))}
                </div>
              )}
            </Link>
          </div>
        </div>
      </section>



      {/* Featured Gear Section */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Featured Gear</h2>
          <Link href="/products" className="text-[var(--color-primary)] font-medium hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
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
      </section>
    </div>
  );
}
