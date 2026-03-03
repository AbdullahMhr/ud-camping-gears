"use client";

import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header / Hero Section */}
            <div className="bg-gray-50 py-16 sm:py-24">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--color-primary)] sm:text-5xl mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ready for the Outdoors? Let's plan your next adventure.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
                        <p className="text-gray-600 mb-8">
                            Fill out the form below and our team will get back to you within 24 hours.
                        </p>

                        <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const text = `*New Website Message*\n\n*Name:* ${formData.get('first-name')} ${formData.get('last-name')}\n*Email:* ${formData.get('email')}\n*Message:* ${formData.get('message')}`;
                            window.open(`https://wa.me/94777239936?text=${encodeURIComponent(text)}`, '_blank');
                        }}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                                    <input type="text" name="first-name" id="first-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm px-4 py-3 bg-gray-50" placeholder="Jane" />
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                                    <input type="text" name="last-name" id="last-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm px-4 py-3 bg-gray-50" placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm px-4 py-3 bg-gray-50" placeholder="jane@example.com" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea id="message" name="message" required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm px-4 py-3 bg-gray-50" placeholder="Build us a custom quote..."></textarea>
                            </div>
                            <button type="submit" className="w-full flex justify-center items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3 text-base font-bold text-white shadow hover:bg-opacity-90 transition">
                                Send Message to WhatsApp
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map Section */}
                    <div className="space-y-12">
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="group bg-gray-50 p-6 rounded-2xl hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:-translate-y-1 cursor-pointer">
                                <MapPin className="h-8 w-8 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300 mb-4" />
                                <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2">Visit Us</h3>
                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm">
                                    57/3, Marikkar Mawatha<br />
                                    Hinguloya, Mawanella
                                </p>
                            </div>
                            <div className="group bg-gray-50 p-6 rounded-2xl hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:-translate-y-1 cursor-pointer">
                                <Phone className="h-8 w-8 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300 mb-4" />
                                <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2">Call Us</h3>
                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm">
                                    +94 77 723 9936<br />
                                    Mon-Sun, 8am - 8pm
                                </p>
                            </div>
                            <div className="group bg-gray-50 p-6 rounded-2xl hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:-translate-y-1 cursor-pointer" onClick={() => window.open('https://wa.me/94777239936', '_blank')}>
                                <MessageSquare className="h-8 w-8 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300 mb-4" />
                                <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2">Live Chat</h3>
                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm">
                                    Chat with an expert<br />
                                    Available 24/7 via WhatsApp
                                </p>
                            </div>
                            <div className="group bg-gray-50 p-6 rounded-2xl hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:-translate-y-1 cursor-pointer" onClick={() => window.open('mailto:hello@udcamping.com', '_blank')}>
                                <Mail className="h-8 w-8 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300 mb-4" />
                                <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2">Email Us</h3>
                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm">
                                    hello@udcamping.com<br />
                                    We reply within 24 hours
                                </p>
                            </div>
                        </div>

                        {/* Map Integration */}
                        <div className="bg-gray-200 rounded-3xl overflow-hidden h-[300px] w-full relative">
                            <iframe
                                src="https://maps.google.com/maps?q=57%2F3,+Marikkar+Mawatha,+Hinguloya,+Mawanella&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

import Link from "next/link";
