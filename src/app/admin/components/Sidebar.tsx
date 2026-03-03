"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, LogOut, MessageSquare, Image as ImageIcon } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="group w-20 hover:w-64 bg-gray-900 text-white flex flex-col min-h-screen transition-all duration-300 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex items-center gap-3 whitespace-nowrap h-[81px]">
                <span className="font-bold text-xl tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">UD Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden ${isActive
                                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-teal-900/20"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <item.icon className={`h-6 w-6 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                            <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 whitespace-nowrap overflow-hidden">
                <button
                    onClick={() => {
                        sessionStorage.removeItem("adminAuth");
                        localStorage.removeItem("adminAuth"); // Just in case
                        window.location.href = "/admin";
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all overflow-hidden"
                >
                    <LogOut className="h-6 w-6 flex-shrink-0" />
                    <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full text-left">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
