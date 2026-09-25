"use client";

import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, t } = useStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
            <span>{t("wishlist")}</span>
          </h1>
          <Link href="/" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white transition-colors">
            {t("home")}
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
            <Heart className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-6">Sevimlilar ro'yxatingiz bo'sh</p>
            <Link href="/" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 inline-block">
              Katalogga o'tish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-red-500 transition-all flex flex-col group"
              >
                <Link href={`/product/${item.id}`}>
                  <div className="h-48 bg-gray-900 flex items-center justify-center p-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="object-contain h-full w-full" />
                    ) : (
                      <span className="text-gray-600">Rasm yo'q</span>
                    )}
                  </div>
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <Link href={`/product/${item.id}`}>
                    <h4 className="font-bold text-lg mb-1 group-hover:text-red-400 transition-colors">{item.name}</h4>
                  </Link>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="text-yellow-500 font-bold text-lg mb-4">{item.price.toLocaleString()} UZS</div>
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t("add_to_cart")}</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
