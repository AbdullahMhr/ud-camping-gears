"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Search, User, LogOut, Tent } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { getCartCount } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        // Initialize immediately
        handleScroll();

        // Listen for scroll passively for performance
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]); // Reset / evaluate when navigating paths

    const handleSignOut = async () => {
        await signOut();
        showToast("Logged out successfully.", "info");
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 font-sans relative">
            <div className="w-full px-4 md:px-8">
                {/* SVG definitions for gradient strokes */}
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient id="insta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#facc15" /> {/* yellow-400 */}
                            <stop offset="50%" stopColor="#ef4444" /> {/* red-500 */}
                            <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
                        </linearGradient>
                    </defs>
                </svg>

                <div className="flex h-20 items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center gap-1 group">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-100 transition">
                            {/* Animated Logo Icon - 3D Hovering */}
                            <div className="relative h-12 w-12 rounded-full overflow-visible p-0.5 group">
                                {/* Intense Gradient Glow behind Logo - Always active but pulses */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full blur-md opacity-70 group-hover:opacity-100 group-hover:blur-lg animate-pulse transition-all duration-500"></div>

                                {/* Logo Image Container with 3D Hover Float */}
                                <div
                                    className="relative h-full w-full rounded-full border-2 border-white overflow-hidden shadow-xl"
                                    style={{
                                        animation: 'floatHover 6s ease-in-out infinite'
                                    }}
                                >
                                    <style>{`
                                        @keyframes floatHover {
                                            0% { transform: translateY(0px) rotate(0deg) scale(1); }
                                            33% { transform: translateY(-4px) rotate(2deg) scale(1.05); }
                                            66% { transform: translateY(2px) rotate(-2deg) scale(0.98); }
                                            100% { transform: translateY(0px) rotate(0deg) scale(1); }
                                        }
                                    `}</style>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10 mix-blend-overlay"></div>
                                    <img
                                        src="/icon-camp.png"
                                        alt="UD Camping Gears Logo"
                                        className="relative h-full w-full object-cover rounded-full z-0 pointer-events-none"
                                    />
                                </div>
                            </div>

                            <span className="hidden md:flex font-bold text-xl tracking-tight text-[var(--color-primary)] gap-1.5 items-center">
                                <span>
                                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500 transition-all duration-300">U</span>D
                                </span>
                                <span>
                                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500 transition-all duration-300">C</span>amping
                                </span>
                                <span>
                                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500 transition-all duration-300">G</span>ears
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-2 text-base font-medium text-[#0b3c2e]">
                                {["Home", "Catalog", "Gallery", "About Us", "Contact"].map((item) => {
                                    const itemPath = item === "Home" ? "/" : item === "Catalog" ? "/products" : item === "About Us" ? "/about" : `/${item.toLowerCase()}`;
                                    const isActive = pathname === itemPath || (item === "Catalog" && pathname.startsWith("/products/"));

                                    return (
                                        <li key={item}>
                                            <Link
                                                href={itemPath}
                                                className="group relative flex items-center justify-center px-5 py-2 font-medium text-[#0b3c2e] transition-all duration-300 rounded-full"
                                            >
                                                {/* Gradient Outline Animation (Pill Shape) */}
                                                <span className={`absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 transition-all duration-300 ease-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}></span>
                                                {/* Inner White Background to Hollow it out, creating border */}
                                                <span className={`absolute inset-[2px] rounded-full bg-white transition-all duration-300 ease-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}></span>

                                                <span className={`relative z-10 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 font-semibold' : ''}`}>
                                                    {item}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative z-50">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="group relative flex items-center justify-center p-2 text-[#0b3c2e] transition-all duration-300"
                                aria-label="Search"
                            >
                                <Search className="h-6 w-6 relative z-10 transition-colors duration-300 group-hover:[stroke:url(#insta-gradient)]" />
                                {/* Tooltip */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                                    Search
                                </span>
                            </button>

                            {/* Search Bar Dropdown */}
                            <div className={`absolute right-0 top-full mt-4 w-80 bg-white shadow-xl rounded-lg border border-gray-100 p-3 transition-all duration-300 origin-top-right ${isSearchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                <form className="relative" onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim()) {
                                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                    }
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Search gear..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-white text-gray-900"
                                        autoFocus={isSearchOpen}
                                    />
                                    <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-[var(--color-primary)] transition-colors" aria-label="Submit search">
                                        <Search className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                        aria-label="Close search"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        <Link href="/inquiry" className="group relative flex items-center justify-center p-2 text-[#0b3c2e] transition-all duration-300">
                            <ShoppingBag className="h-6 w-6 relative z-10 transition-colors duration-300 group-hover:[stroke:url(#insta-gradient)]" />
                            {/* Tooltip */}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                                Cart
                            </span>
                            {getCartCount() > 0 && (
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white z-20 shadow-sm border border-white">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <Link href="/profile" className="group relative flex items-center justify-center p-2 text-[#0b3c2e] transition-all duration-300">
                                <User className="h-6 w-6 relative z-10 transition-colors duration-300 group-hover:[stroke:url(#insta-gradient)]" />
                                {/* Tooltip */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                                    Profile
                                </span>
                            </Link>
                        ) : (
                            <Link href="/login" className="group relative flex items-center justify-center p-2 text-[#0b3c2e] transition-all duration-300">
                                <User className="h-6 w-6 relative z-10 transition-colors duration-300 group-hover:[stroke:url(#insta-gradient)]" />
                                {/* Tooltip */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                                    Sign In
                                </span>
                            </Link>
                        )}

                        <div className="block md:hidden ml-1">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="group relative flex items-center justify-center p-2 text-[#0b3c2e] transition-all duration-300"
                                aria-label="Menu"
                            >
                                {isOpen ? <X className="h-6 w-6 relative z-10 transition-colors duration-300 group-hover:[stroke:url(#insta-gradient)]" /> : <Menu className="h-6 w-6 relative z-10 transition-colors duration-300 group-hover:[stroke:url(#insta-gradient)]" />}
                                {/* Tooltip */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                                    Menu
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div
                    className={`absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-100 overflow-hidden transition-all duration-300 md:hidden z-[100] ${isOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible pointer-events-none'
                        }`}
                >
                    <nav aria-label="Mobile Global">
                        <ul className="flex flex-col p-4 space-y-2">
                            {["Home", "Catalog", "Gallery", "About Us", "Contact"].map((item) => {
                                const itemPath = item === "Home" ? "/" : item === "Catalog" ? "/products" : item === "About Us" ? "/about" : `/${item.toLowerCase()}`;
                                const isActive = pathname === itemPath || (item === "Catalog" && pathname.startsWith("/products/"));

                                return (
                                    <li key={item}>
                                        <Link
                                            href={itemPath}
                                            className={`group relative flex items-center py-3 px-6 font-bold text-lg rounded-xl transition-all duration-300 border ${isActive
                                                ? 'bg-[#0b3c2e] border-transparent text-white shadow-md'
                                                : 'bg-white border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="relative z-10 w-full text-center tracking-wide">
                                                {item}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Drawer Footer (Auth & Profile) */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                            {user ? (
                                <Link
                                    href="/profile"
                                    className="flex items-center justify-center gap-3 w-full bg-[#0b3c2e] hover:bg-emerald-900 text-white p-3 rounded-xl font-bold transition-colors shadow-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="h-5 w-5" />
                                    <span>My Profile</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-3 w-full bg-[#0b3c2e] hover:bg-emerald-900 text-white p-3 rounded-xl font-bold transition-colors shadow-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="h-5 w-5" />
                                    <span>Sign In</span>
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
