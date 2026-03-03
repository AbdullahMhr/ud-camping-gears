export default function AboutPage() {
    return (
        <div className="bg-white overflow-hidden">
            <style>{`
                @keyframes natureZoom {
                    0% { transform: scale(1); filter: brightness(0.6); }
                    100% { transform: scale(1.1); filter: brightness(0.4); }
                }
                @keyframes floatLeaf {
                    0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
                    20% { opacity: 0.8; }
                    80% { opacity: 0.8; }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(150px); opacity: 0; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-nature-zoom { animation: natureZoom 25s ease-out forwards; }
                .animate-fade-in-up { animation: fadeInUp 1.2s ease-out forwards; opacity: 0; }
                .delay-300 { animation-delay: 300ms; }
                .delay-500 { animation-delay: 500ms; }
            `}</style>

            {/* Hero Section */}
            <div className="relative bg-[#051812] py-32 sm:py-40 flex items-center min-h-[70vh]">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/images/about-hero-new.jpg"
                        alt="Serene nature camping background"
                        className="h-full w-full object-cover object-center opacity-40 animate-nature-zoom"
                    />
                </div>

                {/* Floating Leaves Animation Layer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                    {[...Array(8)].map((_, i) => (
                        <svg key={i} className="absolute text-[#a5c07b]/30 fill-current" style={{
                            left: `${5 + Math.random() * 90}%`,
                            width: `${20 + Math.random() * 20}px`,
                            animation: `floatLeaf ${12 + Math.random() * 8}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }} viewBox="0 0 24 24">
                            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C12 20 17 17 19 12C20.66 7.82 22 2 22 2C22 2 18.66 1.8 17 8Z" />
                        </svg>
                    ))}
                </div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center z-20">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl animate-fade-in-up drop-shadow-2xl">
                        About UD Camping Gears
                    </h1>
                    <p className="mt-8 text-xl leading-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-up delay-300 drop-shadow-md">
                        Your trusted partner for outdoor adventures. We provide premium gear rentals to make your camping experience unforgettable and deeply connected to nature.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="animate-fade-in-up delay-500">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-600 leading-relaxed text-pretty">
                            At UD Camping Gears, we believe that nature should be accessible to everyone without the hassle of owning and storing expensive equipment.
                            Our mission is to provide high-quality, sanitized, and reliable camping gear for rent, empowering you to explore the wild with confidence.
                            By fostering a deep appreciation for the outdoors, we hope to inspire the next generation of eco-conscious adventurers.
                        </p>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96 lg:h-[500px] animate-fade-in-up delay-500 group">
                        <img
                            src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800"
                            alt="Camping team in the woods"
                            className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-green-50/50 py-24 sm:py-32 relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-16 animate-fade-in-up">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-green-900/5 hover:-translate-y-2 transition-transform duration-300 border border-green-100 animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30 transform -rotate-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Premium Quality</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">We stock only the best, most durable brands to ensure your safety and comfort in any environment.</p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-green-900/5 hover:-translate-y-2 transition-transform duration-300 border border-green-100 animate-fade-in-up delay-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Flexible Rentals</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">Rent for a day, a weekend, or a longer expedition. Our rental periods fit your lifestyle and schedule.</p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-green-900/5 hover:-translate-y-2 transition-transform duration-300 border border-green-100 animate-fade-in-up delay-500">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30 transform rotate-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Expert Support</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">Our deeply experienced team is available to assist you in selecting the right gear for your trip.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
