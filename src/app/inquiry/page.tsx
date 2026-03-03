"use client";

import Link from "next/link";
import { Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function InquiryCartPage() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const total = getCartTotal();

    const handleWhatsAppInquiry = () => {
        if (cartItems.length === 0) return;

        const dateStr = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
        let message = `*Inquiry Date:* ${dateStr}\n\nHello, I would like to inquire about the following order:\n\n`;
        cartItems.forEach((item, index) => {
            const productId = item.id.replace('-rent', '').replace('-sell', '');
            const productLink = `${window.location.origin}/products/${productId}`;

            let rentalDatesInfo = "";
            if (item.unit === "rental" && item.description.includes("Dates:")) {
                const datesMatch = item.description.match(/Dates:\s*(.+)/);
                if (datesMatch) {
                    rentalDatesInfo = `*Booking Dates:* ${datesMatch[1].trim()}\n`;
                }
            }

            message += `${index + 1}. ${item.name}\nQuantity: ${item.quantity}\nBase Price: LKR ${item.price}\nTotal: LKR ${item.price * item.quantity}\n${rentalDatesInfo}Product Link: ${productLink}\n\n`;
        });
        message += `*Grand Total: LKR ${total}.00*\n\nPlease confirm availability.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/94777239936?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Your Inquiry Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Browsing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>
                                                <Link href={`/products/details`}>{item.name}</Link>
                                            </h3>
                                            <p className="ml-4">LKR {item.price * item.quantity}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">LKR {item.price}/{item.unit}</p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="px-3 py-1 hover:bg-gray-50 transition text-gray-600"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 py-1 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.maxStock ? Math.min(item.maxStock, item.quantity + 1) : item.quantity + 1)}
                                                className={`px-3 py-1 hover:bg-gray-50 transition ${item.quantity >= (item.maxStock || Infinity) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                                                disabled={item.quantity >= (item.maxStock || Infinity)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] mt-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary / Inquiry Form */}
                    <div className="bg-gray-50 p-6 rounded-xl h-fit">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Inquiry Summary</h2>

                        <div className="flow-root">
                            <dl className="-my-4 text-sm divide-y divide-gray-200">
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-gray-600">Subtotal</dt>
                                    <dd className="font-medium text-gray-900">LKR {total}.00</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-gray-600">Tax estimate</dt>
                                    <dd className="font-medium text-gray-900">LKR 0.00</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between border-t border-gray-200">
                                    <dt className="text-base font-medium text-gray-900">Order Total</dt>
                                    <dd className="text-base font-medium text-gray-900">LKR {total}.00</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleWhatsAppInquiry}
                                className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                            >
                                Send Inquiry to WhatsApp
                            </button>
                        </div>

                        <p className="mt-4 text-center text-xs text-gray-500">
                            This is a preliminary inquiry. No payment is required at this stage.
                            We will check availability and confirm with you shortly.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
