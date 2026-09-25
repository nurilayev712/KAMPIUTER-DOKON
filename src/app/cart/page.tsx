"use client";

import { useStore } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Mail, MapPin, ChevronRight } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, clearCart, cartTotal, t } = useStore();
  const { toast } = useToast();
  const [step, setStep] = useState<"cart" | "address" | "payment" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"payme" | "click">("payme");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({ region: "", district: "", street: "", phone: "" });

  const applyPromo = () => {
    if (promo.toUpperCase() === "UPGRADE10") {
      setDiscount(0.10);
      toast("Promokod qabul qilindi! 10% chegirma ✅", "success");
    } else {
      toast("Xato yoki muddati o'tgan promokod ❌", "error");
    }
  };

  const finalTotal = cartTotal * (1 - discount);
  const addressStr = `${address.region}, ${address.district}, ${address.street}`;

  const handlePayment = async () => {
    const user = localStorage.getItem("currentUser") || "Unknown";
    const newOrder = {
      id: "ORD-" + Date.now(),
      user,
      email,
      address: addressStr,
      date: new Date().toISOString(),
      total: finalTotal,
      items: cart,
      status: "Buyurtma qabul qilindi",
    };

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    if (email) {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, orderId: newOrder.id, total: finalTotal, items: cart }),
      });
    }

    clearCart();
    setStep("success");
  };

  const steps = ["cart", "address", "payment", "success"];
  const stepIdx = steps.indexOf(step);

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <div className="bg-green-500/20 text-green-400 p-8 rounded-full mb-6">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold mb-3">Buyurtma qabul qilindi!</h2>
        <p className="text-gray-400 mb-2 text-center max-w-md">
          Buyurtmangiz "Yig'ilmoqda" bosqichida. Holat o'zgarishi haqida sizga xabar beriladi.
        </p>
        {email && <p className="text-blue-400 flex items-center mb-2 text-sm"><Mail className="w-4 h-4 mr-2" />{email} ga tasdiq xati yuborildi</p>}
        {address.street && <p className="text-gray-400 flex items-center text-sm mb-8"><MapPin className="w-4 h-4 mr-2" />{addressStr}</p>}
        <div className="flex space-x-4">
          <Link href="/" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-white font-bold">{t("home")}</Link>
          <Link href="/profile" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full text-white font-bold">Buyurtmalarim</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <ShoppingCart className="w-8 h-8 text-red-500" />
            <span>{t("cart")}</span>
          </h1>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">{t("home")}</Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {["Savat", "Manzil", "To'lov"].map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${stepIdx > i ? "bg-green-600" : stepIdx === i ? "bg-red-600" : "bg-gray-700"}`}>
                {stepIdx > i ? "✓" : i + 1}
              </div>
              <span className={`ml-2 text-sm ${stepIdx === i ? "text-white font-bold" : "text-gray-500"}`}>{label}</span>
              {i < 2 && <ChevronRight className="w-4 h-4 text-gray-600 mx-3" />}
            </div>
          ))}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
            <ShoppingCart className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-6">{t("empty_cart")}</p>
            <Link href="/" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold inline-block">{t("home")}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart items or forms */}
            <div className="lg:col-span-2 space-y-4">
              {step === "cart" && (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-gray-400 text-sm">{item.price.toLocaleString()} UZS × {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-yellow-500">{(item.price * item.quantity).toLocaleString()} UZS</span>
                        <button onClick={() => { removeFromCart(item.id); toast("Savatdan olib tashlandi", "info"); }}
                          className="text-red-500 hover:text-red-400 text-sm">O'chirish</button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right">
                    <button onClick={() => { clearCart(); toast("Savat tozalandi", "info"); }}
                      className="text-gray-500 hover:text-red-500 text-xs transition-colors">Savatchani tozalash</button>
                  </div>
                </>
              )}

              {step === "address" && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                    <MapPin className="w-6 h-6 text-blue-400" />
                    <span>Yetkazib berish manzili</span>
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Email manzil</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="pochta@mail.com"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Telefon raqami *</label>
                      <input type="tel" required value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="+998 90 000 00 00"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Viloyat *</label>
                        <select value={address.region} onChange={e => setAddress({ ...address, region: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-blue-500 outline-none">
                          <option value="">Tanlang</option>
                          {["Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan", "Farg'ona", "Qashqadaryo", "Surxondaryo", "Navoiy", "Xorazm", "Sirdaryo", "Jizzax", "Qoraqalpog'iston"].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Tuman/Shahar *</label>
                        <input type="text" value={address.district} onChange={e => setAddress({ ...address, district: e.target.value })} placeholder="Tuman nomi"
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-blue-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Ko'cha va uy raqami *</label>
                      <input type="text" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} placeholder="Ko'cha nomi, uy raqami"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-blue-500 outline-none" />
                    </div>
                    {/* Map embed */}
                    <div className="rounded-xl overflow-hidden border border-gray-700">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.7!2d69.2793!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b4a8b8b8b8b%3A0x1!2sAlisher%20Navoiy%20ko'chasi%2037%2C%20Toshkent!5e0!3m2!1suz!2suz!4v1"
                        width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade" className="opacity-80"
                      ></iframe>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center"><MapPin className="w-3 h-3 mr-1" />Do'konimiz: Toshkent, Alisher Navoiy ko'chasi 37</p>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-bold mb-6">To'lov usulini tanlang</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {(["payme", "click"] as const).map(pm => (
                      <button key={pm} onClick={() => setPaymentMethod(pm)}
                        className={`p-6 rounded-xl border-2 font-bold text-lg transition-all ${paymentMethod === pm ? "border-blue-500 bg-blue-500/10 text-blue-400 scale-105" : "border-gray-600 hover:border-gray-500 text-gray-400"}`}>
                        {pm === "payme" ? "💙 Payme" : "🟢 Click"}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400">To'lov amalga oshirilgach buyurtmangiz avtomatik "Yig'ilmoqda" holatiga o'tadi.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit space-y-4">
              <h2 className="text-xl font-bold border-b border-gray-700 pb-4">{t("total")}</h2>

              {step === "cart" && (
                <div className="flex space-x-2">
                  <input type="text" value={promo} onChange={e => setPromo(e.target.value)}
                    placeholder={`${t("promo")} (UPGRADE10)`}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none" />
                  <button onClick={applyPromo} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">Qo'llash</button>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Mahsulotlar:</span>
                  <span>{cartTotal.toLocaleString()} UZS</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Chegirma (10%):</span>
                    <span>-{(cartTotal * discount).toLocaleString()} UZS</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Yetkazib berish:</span>
                  <span className="text-green-400">Bepul</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-xl border-t border-gray-700 pt-4">
                <span>{t("total")}:</span>
                <span className="text-yellow-400">{finalTotal.toLocaleString()} UZS</span>
              </div>

              {step === "cart" && (
                <button onClick={() => setStep("address")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Manzil kiritish →
                </button>
              )}
              {step === "address" && (
                <button
                  onClick={() => {
                    if (!address.region || !address.street || !address.phone) {
                      toast("Iltimos, barcha maydonlarni to'ldiring", "error"); return;
                    }
                    setStep("payment");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                  To'lov usuliga o'tish →
                </button>
              )}
              {step === "payment" && (
                <button onClick={handlePayment}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/20">
                  {paymentMethod === "payme" ? "💙 Payme" : "🟢 Click"} orqali to'lash
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
