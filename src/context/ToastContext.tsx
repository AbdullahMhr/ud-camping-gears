"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full shadow-lg text-white font-medium
              animate-in fade-in slide-in-from-top-5 duration-300
              ${toast.type === "success" ? "bg-green-600" :
                                toast.type === "error" ? "bg-red-600" : "bg-blue-600"}
            `}
                    >
                        {toast.type === "success" && <CheckCircle className="h-5 w-5" />}
                        {toast.type === "error" && <XCircle className="h-5 w-5" />}
                        {toast.type === "info" && <Info className="h-5 w-5" />}
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
