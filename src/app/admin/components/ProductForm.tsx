"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Product } from "../../../data/products";
import { Save, Upload, X, Ruler, Users, Droplets, Weight, Flame, Battery, Thermometer, ShieldCheck, Calendar, Info, Link as LinkIcon, Loader2, Package, ShoppingBag } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { supabase } from "../../../lib/supabaseClient";

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (product: Omit<Product, "id">) => Promise<void> | void;
    isEditing?: boolean;
}

// Available icons for specs
const AVAILABLE_ICONS = [
    { label: "Ruler (Size)", value: "Ruler", icon: Ruler },
    { label: "Users (Capacity)", value: "Users", icon: Users },
    { label: "Droplets (Waterproof)", value: "Droplets", icon: Droplets },
    { label: "Weight", value: "Weight", icon: Weight },
    { label: "Flame (Heat/Fuel)", value: "Flame", icon: Flame },
    { label: "Battery", value: "Battery", icon: Battery },
    { label: "Thermometer (Temp)", value: "Thermometer", icon: Thermometer },
    { label: "Shield (Material)", value: "ShieldCheck", icon: ShieldCheck },
    { label: "Calendar", value: "Calendar", icon: Calendar },
    { label: "Info (General)", value: "Info", icon: Info },
];

export default function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
    const { showToast } = useToast();

    // Basic fields
    const [title, setTitle] = useState(initialData?.title || "");
    const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
    const [description, setDescription] = useState(initialData?.description || "");

    // Listing Type: "rent", "sell", "both"
    const [listingType, setListingType] = useState<'rent' | 'sell' | 'both'>(initialData?.listingType || "both");
    const [rentPrice, setRentPrice] = useState(initialData?.rentPrice?.toString() || "");
    const [buyPrice, setBuyPrice] = useState(initialData?.buyPrice?.toString() || "");
    const [rentStock, setRentStock] = useState(initialData?.rentStock?.toString() || "10");
    const [sellStock, setSellStock] = useState(initialData?.sellStock?.toString() || "10");

    // Images
    const [images, setImages] = useState<{ url: string, file?: File }[]>(
        initialData?.images?.map(url => ({ url })) || []
    );
    const [newImageUrl, setNewImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Specs
    const [specs, setSpecs] = useState<{ label: string; value: string; icon: string }[]>(initialData?.specs || []);
    const [newSpecLabel, setNewSpecLabel] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");
    const [newSpecIcon, setNewSpecIcon] = useState("Info");

    const [isSaving, setIsSaving] = useState(false);

    // Handle Image Upload Action
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            if (images.length + files.length > 4) {
                showToast("Maximum 4 images allowed", "error");
                return;
            }
            const newImages = Array.from(files).map(file => ({
                url: URL.createObjectURL(file), // Generate instant local preview
                file
            }));
            setImages(prev => [...prev, ...newImages]);
        }
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    };

    const addImageUrl = () => {
        if (!newImageUrl) return;
        if (images.length >= 4) {
            showToast("Maximum 4 images allowed", "error");
            return;
        }
        setImages([...images, { url: newImageUrl }]);
        setNewImageUrl("");
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Handle Spec Add
    const addSpec = () => {
        if (!newSpecLabel || !newSpecValue) {
            showToast("Please fill label and value", "error");
            return;
        }
        setSpecs([...specs, { label: newSpecLabel, value: newSpecValue, icon: newSpecIcon }]);
        setNewSpecLabel("");
        setNewSpecValue("");
        setNewSpecIcon("Info");
    };

    const removeSpec = (index: number) => {
        setSpecs(prev => prev.filter((_, i) => i !== index));
    };

    // Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!title) {
            showToast("Title is required", "error");
            return;
        }

        if (listingType === 'rent' || listingType === 'both') {
            if (!rentPrice || parseFloat(rentPrice) < 0) {
                showToast("Valid Rent Price (>= 0) is required", "error");
                return;
            }
            if (!rentStock || parseInt(rentStock) < 0) {
                showToast("Valid Rent Stock (>= 0) is required", "error");
                return;
            }
        }

        if (listingType === 'sell' || listingType === 'both') {
            if (!buyPrice || parseFloat(buyPrice) < 0) {
                showToast("Valid Buy Price (>= 0) is required", "error");
                return;
            }
            if (!sellStock || parseInt(sellStock) < 0) {
                showToast("Valid Sell Stock (>= 0) is required", "error");
                return;
            }
        }

        if (images.length === 0) {
            showToast("At least one image is required", "error");
            return;
        }

        setIsSaving(true);
        try {
            // Helper to shrink images before pushing to cloud
            const compressImage = (file: File, maxWidth = 1000, quality = 0.8): Promise<File> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            let width = img.width;
                            let height = img.height;

                            if (width > maxWidth) {
                                height = Math.round((height * maxWidth) / width);
                                width = maxWidth;
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext("2d");
                            if (!ctx) return resolve(file); // fallback to original if canvas fails

                            // Fill white background for transparent PNGs converted to JPEG
                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0, width, height);

                            // Always compress to JPEG for optimal file size reduction
                            canvas.toBlob(
                                (blob) => {
                                    if (!blob) return resolve(file);
                                    // Construct new File
                                    const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                                    const compressedFile = new File([blob], newFileName, {
                                        type: "image/jpeg",
                                        lastModified: Date.now(),
                                    });
                                    resolve(compressedFile);
                                },
                                "image/jpeg",
                                quality
                            );
                        };
                        img.onerror = (error) => reject(error);
                        img.src = event.target?.result as string;
                    };
                    reader.onerror = (error) => reject(error);
                });
            };

            // Upload local files to Supabase Storage
            const finalImageUrls: string[] = [];
            for (const img of images) {
                if (img.file) {
                    // Compress BEFORE network upload to save Bucket storage and bandwidth
                    const compressedFile = await compressImage(img.file);

                    const fileExt = compressedFile.name.split('.').pop();
                    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                    const customFilePath = `products/${fileName}`;

                    const { data, error } = await supabase.storage
                        .from('product-images')
                        .upload(customFilePath, compressedFile);

                    if (error) {
                        console.error('Upload Error:', error);
                        showToast(`Failed to upload ${img.file.name}`, "error");
                        throw new Error("Upload Failed");
                    }

                    const { data: publicUrlData } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(customFilePath);

                    finalImageUrls.push(publicUrlData.publicUrl);
                } else {
                    finalImageUrls.push(img.url);
                }
            }

            const productData = {
                title,
                subtitle,
                description,
                listingType,
                rentPrice: listingType !== 'sell' ? parseFloat(rentPrice) : undefined,
                buyPrice: listingType !== 'rent' ? parseFloat(buyPrice) : undefined,
                rentStock: listingType !== 'sell' ? parseInt(rentStock) : 0,
                sellStock: listingType !== 'rent' ? parseInt(sellStock) : 0,
                rating: initialData?.rating || 0,
                reviewsCount: initialData?.reviewsCount || 0,
                reviews: initialData?.reviews || [],
                imageUrl: finalImageUrls[0], // Primary image is first one
                images: finalImageUrls,
                specs,
                isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
                sortOrder: initialData?.sortOrder || 0,
            };

            await onSubmit(productData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 space-y-12 mb-20">
            {/* 1. Basic Info */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><Info className="h-5 w-5 text-[#0b3c2e]" /></div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Basic Information</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Product Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#0b3c2e] focus:ring-4 focus:ring-[#0b3c2e]/10 outline-none transition-all font-medium text-gray-900"
                            placeholder="e.g. Nomad Tent 4000"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Subtitle <span className="text-gray-400 normal-case tracking-normal font-medium">(Optional)</span></label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#0b3c2e] focus:ring-4 focus:ring-[#0b3c2e]/10 outline-none transition-all font-medium text-gray-900"
                            placeholder="e.g. All-Season Premium Shelter"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Listing Type & Inventory */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><Package className="h-5 w-5 text-[#0b3c2e]" /></div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Pricing & Inventory</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${listingType === 'rent' ? 'border-[#0b3c2e] bg-[#0b3c2e]/5 shadow-md shadow-green-900/5' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}>
                        <input type="radio" value="rent" checked={listingType === 'rent'} onChange={() => setListingType('rent')} className="text-[#0b3c2e] w-5 h-5 focus:ring-[#0b3c2e]" />
                        <div>
                            <span className="block font-bold text-gray-900 text-lg">Rent Only</span>
                            <span className="text-xs text-gray-500 font-medium tracking-wide">Daily rate model</span>
                        </div>
                    </label>
                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${listingType === 'sell' ? 'border-[#0b3c2e] bg-[#0b3c2e]/5 shadow-md shadow-green-900/5' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}>
                        <input type="radio" value="sell" checked={listingType === 'sell'} onChange={() => setListingType('sell')} className="text-[#0b3c2e] w-5 h-5 focus:ring-[#0b3c2e]" />
                        <div>
                            <span className="block font-bold text-gray-900 text-lg">Sell Only</span>
                            <span className="text-xs text-gray-500 font-medium tracking-wide">Direct purchase model</span>
                        </div>
                    </label>
                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${listingType === 'both' ? 'border-[#0b3c2e] bg-[#0b3c2e]/5 shadow-md shadow-green-900/5' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}>
                        <input type="radio" value="both" checked={listingType === 'both'} onChange={() => setListingType('both')} className="text-[#0b3c2e] w-5 h-5 focus:ring-[#0b3c2e]" />
                        <div>
                            <span className="block font-bold text-gray-900 text-lg">Both</span>
                            <span className="text-xs text-gray-500 font-medium tracking-wide">Hybrid distribution</span>
                        </div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Rent Inputs */}
                    {(listingType === 'rent' || listingType === 'both') && (
                        <div className="space-y-5 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Rental Logistics</h4>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Rent Price (LKR / Day)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={rentPrice}
                                    onChange={(e) => setRentPrice(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0b3c2e] focus:ring-2 focus:ring-[#0b3c2e]/20 outline-none transition-all font-bold text-gray-900 text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Rent Stock Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={rentStock}
                                    onChange={(e) => setRentStock(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0b3c2e] focus:ring-2 focus:ring-[#0b3c2e]/20 outline-none transition-all font-bold text-gray-900 text-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Sell Inputs */}
                    {(listingType === 'sell' || listingType === 'both') && (
                        <div className="space-y-5 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gray-400" /> Sales Logistics</h4>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Buy Price (LKR)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={buyPrice}
                                    onChange={(e) => setBuyPrice(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0b3c2e] focus:ring-2 focus:ring-[#0b3c2e]/20 outline-none transition-all font-bold text-[#0b3c2e] text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Sell Stock Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={sellStock}
                                    onChange={(e) => setSellStock(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0b3c2e] focus:ring-2 focus:ring-[#0b3c2e]/20 outline-none transition-all font-bold text-[#0b3c2e] text-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Description */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><Info className="h-5 w-5 text-[#0b3c2e]" /></div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Narrative</h3>
                </div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#0b3c2e] focus:ring-4 focus:ring-[#0b3c2e]/10 outline-none transition-all font-medium text-gray-900 resize-y"
                    placeholder="Enter the comprehensive product storyline and details..."
                />
            </div>

            {/* 4. Images */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><Upload className="h-5 w-5 text-[#0b3c2e]" /></div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Gallery <span className="text-gray-400 font-medium text-sm ml-2">(Max 4 slots)</span></h3>
                </div>

                {/* Visual Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 group bg-white shadow-sm">
                            <img src={img.url} alt={`Product ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:bg-red-50 hover:scale-110"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    {images.length < 4 && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 bg-white rounded-2xl hover:bg-gray-50 hover:border-[#0b3c2e] hover:text-[#0b3c2e] text-gray-400 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-green-50 flex items-center justify-center transition-colors">
                                <Upload className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold">Upload Local</span>
                        </button>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                />

                {/* Add by URL */}
                {images.length < 4 && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="...or paste a secure 'https://' Image URL"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="flex-1 px-5 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#0b3c2e] focus:ring-4 focus:ring-[#0b3c2e]/10 outline-none font-medium text-gray-900 transition-all"
                        />
                        <button
                            type="button"
                            onClick={addImageUrl}
                            className="bg-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <LinkIcon className="h-4 w-4" />
                            Attach Web Link
                        </button>
                    </div>
                )}
            </div>

            {/* 5. Specifications */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><ShieldCheck className="h-5 w-5 text-[#0b3c2e]" /></div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Technical Specifications</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {specs.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm group">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 group-hover:bg-green-50 group-hover:text-[#0b3c2e] transition-colors">
                                {(() => {
                                    const IconComponent = AVAILABLE_ICONS.find(i => i.value === spec.icon)?.icon || Info;
                                    return <IconComponent className="h-5 w-5 text-gray-500 group-hover:text-[#0b3c2e]" />;
                                })()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{spec.label}</p>
                                <p className="text-sm font-bold text-gray-900 truncate">{spec.value}</p>
                            </div>
                            <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    {specs.length === 0 && <div className="col-span-2 text-center py-6 text-gray-400 font-medium">No technical specifications applied mapping. Build one below.</div>}
                </div>

                {/* Add New Spec */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Append Specification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select
                            value={newSpecIcon}
                            onChange={(e) => setNewSpecIcon(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0b3c2e] focus:ring-2 focus:ring-[#0b3c2e]/20 outline-none transition-all font-medium text-gray-700"
                        >
                            {AVAILABLE_ICONS.map(icon => (
                                <option key={icon.value} value={icon.value}>{icon.label}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={newSpecLabel}
                            onChange={(e) => setNewSpecLabel(e.target.value)}
                            placeholder="Attribute (e.g. Dimensions)"
                            className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0b3c2e] focus:ring-2 focus:ring-[#0b3c2e]/20 outline-none transition-all font-medium text-gray-900"
                        />
                        <input
                            type="text"
                            value={newSpecValue}
                            onChange={(e) => setNewSpecValue(e.target.value)}
                            placeholder="Value (e.g. 5m x 5m)"
                            className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0b3c2e] focus:ring-2 focus:ring-[#0b3c2e]/20 outline-none transition-all font-medium text-gray-900"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addSpec}
                        className="mt-4 w-full bg-gray-900 text-white font-bold tracking-wide uppercase text-xs py-3 rounded-xl hover:bg-black transition-all shadow-md active:scale-[0.98]"
                    >
                        Save Specification Mapping
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#0b3c2e] to-emerald-900 text-white font-bold py-4 px-10 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-teal-900/30 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95"
                >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    <span className="tracking-widest uppercase text-xs">{isSaving ? "Persisting to Cloud..." : "Commit Data to DB"}</span>
                </button>
            </div>
        </form>
    );
}
