export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    listingType: 'rent' | 'sell' | 'both';
    rentPrice?: number;
    buyPrice?: number;
    rentStock: number;
    sellStock: number;
    rating: number;
    reviewsCount: number;
    reviews: Review[];
    imageUrl: string;
    images: string[];
    specs: { label: string; value: string; icon: string }[];
    isActive?: boolean;
    sortOrder?: number;
}

export const products: Product[] = [
    {
        id: "1",
        title: "The Nomad Sanctuary",
        subtitle: "All-Season Premium Canvas Tent",
        description: "Experience the wilderness without sacrificing comfort. Our breathable, waterproof canvas tent offers a spacious retreat designed to withstand the elements while keeping you cool in summer and warm in winter. Perfect for family getaways or luxury glamping setups.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 4500,
        buyPrice: 85000,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1504280506541-aca1cd4c04e3?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff5f?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "SIZE", value: "16ft Diameter", icon: "Ruler" },
            { label: "CAPACITY", value: "4-6 People", icon: "Users" },
            { label: "WATERPROOF", value: "3000mm", icon: "Droplets" },
            { label: "WEIGHT", value: "28 kg", icon: "Weight" },
        ]
    },
    {
        id: "2",
        title: "Lumen Beacon Pro",
        subtitle: "High-Intensity LED Camping Lantern",
        description: "Don't let the darkness stop your adventure. The Lumen Beacon Pro offers 1000 lumens of brightness with a 48-hour battery life. Features solar charging, USB output for phones, and water resistance.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 500,
        buyPrice: 12000,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "BRIGHTNESS", value: "1000 Lumens", icon: "Flame" },
            { label: "BATTERY", value: "48 Hours", icon: "Battery" },
            { label: "WEIGHT", value: "0.5 kg", icon: "Weight" },
            { label: "WATERPROOF", value: "IPX6", icon: "Droplets" },
        ]
    },
    {
        id: "3",
        title: "Alpine Zero Sleeping Bag",
        subtitle: "Extreme Cold Weather Down Bag",
        description: "Stay warm even in freezing conditions. The Alpine Zero is rated for -15°C and features ultra-light 800-fill down insulation. Compact, durable, and essential for high-altitude treks.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 1500,
        buyPrice: 35000,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1623910287718-4795325c34cb?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1623910287718-4795325c34cb?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517173708304-7a0ce5169996?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "TEMP RATING", value: "-15°C", icon: "Thermometer" },
            { label: "INSULATION", value: "800-Fill Down", icon: "ShieldCheck" },
            { label: "WEIGHT", value: "1.2 kg", icon: "Weight" },
            { label: "SIZE", value: "Regular", icon: "Ruler" },
        ]
    },
    {
        id: "4",
        title: "Trailblazer 65L Pack",
        subtitle: "Ergonomic Hiking Backpack",
        description: "Designed for the long haul. The Trailblazer 65L features a custom-fit suspension system, breathable back panel, and ample storage for multi-day expeditions. Includes a rain cover.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 1200,
        buyPrice: 28000,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1622489819777-743777595304?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "VOLUME", value: "65 Liters", icon: "ShieldCheck" },
            { label: "WEIGHT", value: "1.8 kg", icon: "Weight" },
            { label: "MATERIAL", value: "Nylon Ripstop", icon: "ShieldCheck" },
            { label: "FIT", value: "Adjustable", icon: "Ruler" },
        ]
    },
    {
        id: "5",
        title: "Pocket Rocket Stove",
        subtitle: "Ultralight Canister Camp Stove",
        description: "Small size, big power. This pocket-sized stove boils 1 liter of water in just 3.5 minutes. Essential for backpackers who need a hot meal fast.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 400,
        buyPrice: 8500,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff5f?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff5f?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "BOIL TIME", value: "3.5 min/1L", icon: "Flame" },
            { label: "WEIGHT", value: "73 g", icon: "Weight" },
            { label: "FUEL", value: "IsoPro", icon: "Flame" },
            { label: "IGNITION", value: "Manual", icon: "ShieldCheck" },
        ]
    },
    {
        id: "6",
        title: "CloudNest Hammock",
        subtitle: "Double Parachute Nylon Hammock",
        description: "Relax in the trees. The CloudNest is made from durable 70D nylon and holds up to 400lbs. Comes with tree-friendly straps for easy setup.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 600,
        buyPrice: 15000,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1517865288-978fcb780652?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1517865288-978fcb780652?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "CAPACITY", value: "400 lbs", icon: "Weight" },
            { label: "WEIGHT", value: "19 oz", icon: "Weight" },
            { label: "MATERIAL", value: "70D Nylon", icon: "ShieldCheck" },
            { label: "SIZE", value: "Double", icon: "Ruler" },
        ]
    },
    {
        id: "7",
        title: "Backcountry First Aid",
        subtitle: "Medical Kit for Multi-Day Trips",
        description: "Be prepared for anything. This kit contains essential medical supplies for treating common injuries in the field. Housed in a waterproof case.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 350,
        buyPrice: 9500,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1603510529944-e222f7193a0d?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1603510529944-e222f7193a0d?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "GROUP SIZE", value: "1-4 People", icon: "Users" },
            { label: "DURATION", value: "1-7 Days", icon: "Calendar" },
            { label: "WEIGHT", value: "0.8 kg", icon: "Weight" },
            { label: "CASE", value: "Waterproof", icon: "Droplets" },
        ]
    },
    {
        id: "8",
        title: "Carbon Trek Poles",
        subtitle: "Shock-Absorbing Hiking Poles",
        description: "Save your knees on the descent. These carbon fiber poles are ultra-lightweight and feature cork grips for all-day comfort. Adjustable length.",
        listingType: "both",
        rentStock: 10,
        sellStock: 10,
        reviews: [],
        rentPrice: 800,
        buyPrice: 18000,
        rating: 0,
        reviewsCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1502472584811-0a2f2ca84626?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1502472584811-0a2f2ca84626?auto=format&fit=crop&q=80&w=800"
        ],
        specs: [
            { label: "MATERIAL", value: "Carbon Fiber", icon: "ShieldCheck" },
            { label: "WEIGHT", value: "200g / pair", icon: "Weight" },
            { label: "GRIP", value: "Cork", icon: "ShieldCheck" },
            { label: "LENGTH", value: "60-135cm", icon: "Ruler" },
        ]
    }
];
