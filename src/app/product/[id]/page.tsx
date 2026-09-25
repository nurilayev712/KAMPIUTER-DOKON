"use client";

import { useStore } from "@/context/StoreContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { products, addToCart } = useStore();
  
  const id = params?.id as string;
  const product = products.find(p => p.id === id);

  const [reviews, setReviews] = useState<{id: string, user: string, rating: number, text: string, date: string}[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/reviews?productId=${id}`)
        .then(r => r.json())
        .then(data => setReviews(data));
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Mahsulot topilmadi</h1>
        <Link href="/" className="text-red-500 hover:underline">Asosiy sahifaga qaytish</Link>
      </div>
    );
  }

  const handleAddReview = async () => {
    const user = localStorage.getItem("currentUser") || "Mehmon";
    const newReview = { productId: id, user, rating: newRating, text: newText };
    
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview)
    });
    
    if (res.ok) {
      const data = await res.json();
      setReviews(prev => [...prev, data.review]);
      setNewText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-950 border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center space-x-2 w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            <span>Orqaga qaytish</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 py-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex flex-col md:flex-row mb-12 shadow-2xl"
        >
          <div className="md:w-1/2 h-96 md:h-auto bg-gray-700 p-8 flex items-center justify-center">
            {product.image ? (
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src={product.image} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform" 
              />
            ) : (
              <div className="text-gray-500 text-2xl">Rasm kiritilmagan</div>
            )}
          </div>
          
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="uppercase text-sm text-red-500 font-bold tracking-wider mb-2">{product.category}</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex text-yellow-500">
                <Star fill="currentColor" className="w-5 h-5" />
                <Star fill="currentColor" className="w-5 h-5" />
                <Star fill="currentColor" className="w-5 h-5" />
                <Star fill="currentColor" className="w-5 h-5" />
                <Star fill="currentColor" className="w-5 h-5" />
              </div>
              <span className="text-gray-400 text-sm">({reviews.length} ta izoh)</span>
            </div>
            
            <div className="text-3xl font-bold text-yellow-400 mb-6 bg-gray-900/50 p-4 rounded-lg inline-block border border-gray-700 w-fit">
              {product.price.toLocaleString()} UZS
            </div>
            
            <div className="prose prose-invert mb-8">
              <h3 className="text-xl font-bold mb-2 border-b border-gray-700 pb-2">Texnik xususiyatlar:</h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>
            
            <div className="flex space-x-4 mt-auto">
              <button onClick={() => addToCart(product)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all border border-gray-600 flex justify-center items-center space-x-2">
                <span>Savatga</span>
              </button>
              <button onClick={() => { addToCart(product); router.push('/cart'); }} className="flex-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-red-900/50">
                Hozir sotib olish
              </button>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-800 p-8 rounded-2xl border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center space-x-2 border-b border-gray-700 pb-4">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <span>Mijozlar fikri ({reviews.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-400 italic">Hali hech kim izoh qoldirmagan. Birinchi bo'lib fikringizni bildiring!</p>
              ) : (
                reviews.map((rev, idx) => (
                  <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-blue-400 mr-2">{rev.user}</span>
                        {rev.date && <span className="text-xs text-gray-500">{new Date(rev.date).toLocaleDateString("uz-UZ")}</span>}
                      </div>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} fill={i < rev.rating ? "currentColor" : "none"} className="w-4 h-4" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{rev.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 h-fit">
              <h3 className="font-bold mb-4">Fikr qoldirish</h3>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Baho (1 dan 5 gacha)</label>
                <input 
                  type="range" 
                  min="1" max="5" 
                  value={newRating} 
                  onChange={e => setNewRating(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
                <div className="flex text-yellow-500 justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill={i < newRating ? "currentColor" : "none"} className="w-6 h-6" />
                  ))}
                </div>
              </div>
              <textarea 
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Mahsulot haqida fikringiz..."
                className="w-full bg-gray-800 border border-gray-600 rounded p-3 mb-4 focus:border-blue-500 outline-none h-24 text-sm"
              ></textarea>
              <button 
                onClick={handleAddReview}
                disabled={!newText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Jo'natish
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
