"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./components/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAdmin, session } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let isMounted = true;
        // Allow public access to login page
        if (pathname === "/admin") {
            if (isMounted) setIsChecking(false);
            return;
        }

        // Check if user is logged in and is specifically an Admin
        if (!session || !isAdmin) {
            if (isMounted) router.replace("/admin");
        } else {
            if (isMounted) setIsChecking(false);
        }

        return () => { isMounted = false; };
    }, [pathname, router, session, isAdmin]);

    // Public Route (Login)
    if (pathname === "/admin") {
        return <>{children}</>;
    }

    // Protected Routes - Loading State
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b3c2e]"></div>
            </div>
        );
    }

    // Protected Routes - Authorized (session && isAdmin)
    if (session && isAdmin) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <div className="hidden md:block fixed inset-y-0 left-0 z-50">
                    <AdminSidebar />
                </div>
                <main className="flex-1 md:ml-20 p-8 overflow-y-auto h-screen">
                    {children}
                </main>
            </div>
        );
    }

    return null;
}
