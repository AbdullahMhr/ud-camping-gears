"use client";

import { useState } from "react";
import { MessageCircle, Phone, Facebook, Instagram, X, MessageSquare } from "lucide-react";

export default function QuickContact() {
    const [isOpen, setIsOpen] = useState(false);

    const socialLinks = [
        {
            name: "WhatsApp",
            icon: <MessageCircle className="h-6 w-6" />,
            color: "bg-green-500",
            href: "https://wa.me/94777239936",
        },
        {
            name: "Instagram",
            icon: <Instagram className="h-6 w-6" />,
            color: "bg-pink-600",
            href: "https://instagram.com/ud_camping_gears_mw",
        },
        {
            name: "Facebook",
            icon: <Facebook className="h-6 w-6" />,
            color: "bg-blue-600",
            href: "#", // Placeholder
        },
        {
            name: "Call Us",
            icon: <Phone className="h-6 w-6" />,
            color: "bg-gray-700",
            href: "tel:+94777239936",
        },
    ];

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Expanded Icons */}
            <div
                className={`absolute bottom-[100%] right-0 pb-4 flex flex-col items-end gap-3 transition-all duration-300 origin-bottom ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
                    }`}
            >
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${link.color} text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group`}
                    >
                        {link.icon}
                        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
                            <span className="pl-2 pr-1 text-sm font-medium">{link.name}</span>
                        </span>
                    </a>
                ))}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 text-white hover:scale-110 hover:rotate-12 ${isOpen ? "bg-red-500 rotate-90" : "bg-[var(--color-primary)]"
                    }`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </button>
        </div>
    );
}
