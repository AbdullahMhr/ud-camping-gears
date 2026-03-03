"use client";

import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, MessageCircle, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0b3c2e] text-white font-sans">
            {/* SVG definitions for gradient strokes */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <linearGradient id="footer-insta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#facc15" /> {/* yellow-400 */}
                        <stop offset="50%" stopColor="#ef4444" /> {/* red-500 */}
                        <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
                    </linearGradient>
                </defs>
            </svg>

            <div className="container mx-auto px-4 py-16 md:px-6">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand / About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-white">UD</span> Camping Gears
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Premium gear for your next adventure. We provide high-quality camping equipment rentals to make your outdoor experience unforgettable.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="font-bold text-lg mb-4 text-white">Quick Links</p>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300">Home</Link></li>
                            <li><Link href="/products" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300">Catalog</Link></li>
                            <li><Link href="/login" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300">Login</Link></li>
                            <li><Link href="/login" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <p className="font-bold text-lg mb-4 text-white">Contact Us</p>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3 group cursor-pointer">
                                <MapPin className="h-5 w-5 text-white shrink-0 transition-colors duration-300 group-hover:[stroke:url(#footer-insta-gradient)]" />
                                <span className="text-gray-300 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500">57/3, Marikkar Mawatha, Hinguloya, Mawanella</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Phone className="h-5 w-5 text-white shrink-0 transition-colors duration-300 group-hover:[stroke:url(#footer-insta-gradient)]" />
                                <a href="tel:+94777239936" className="text-gray-300 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500">+94 77 723 9936</a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Mail className="h-5 w-5 text-white shrink-0 transition-colors duration-300 group-hover:[stroke:url(#footer-insta-gradient)]" />
                                <a href="mailto:hello@udcamping.com" className="text-gray-300 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500">hello@udcamping.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <p className="font-bold text-lg mb-4 text-white">Follow Us</p>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/ud_camping_gears_mw" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300 group">
                                <Instagram className="h-5 w-5 text-white" />
                            </a>
                            <a href="#" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300 group">
                                <Facebook className="h-5 w-5 text-white" />
                            </a>
                            <a href="https://wa.me/94777239936" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300 group">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-center md:text-left text-xs text-gray-400">
                        © 2026 UD Camping Gears. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-400">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
