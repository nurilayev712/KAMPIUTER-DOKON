"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Monitor, ChevronRight, Star } from "lucide-react";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("isLoggedIn"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 z-0 opacity-10"
        style={{ backgroundImage: "linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
      </div>

      {/* Glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-extrabold text-red-500 tracking-tighter"
        >
          UPG<span className="text-white"> RADE</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-3"
        >
          {isLoggedIn ? (
            <Link href="/store" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105">
              Do'konga kirish →
            </Link>
          ) : (
            <>
              <Link href="/login" className="border border-gray-600 hover:border-gray-400 px-5 py-2 rounded-full text-sm transition-colors text-gray-300 hover:text-white">
                Kirish
              </Link>
              <Link href="/register" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105">
                Ro'yxatdan o'tish
              </Link>
            </>
          )}
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center bg-red-600/10 border border-red-600/30 text-red-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" /> O'zbekiston №1 Gaming Do'koni
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            O'yin<span className="text-red-500">ingizni</span><br />
            yangi bosqichga<br />
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              olib chiqing
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Eng zamonaviy gaming kompyuterlar, noutbuklar va aksessuarlar. 
            O'zingizning orzuingizdagi kompyuteringizni yig'ing yoki tayyor variantlardan tanlang.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={isLoggedIn ? "/store" : "/register"}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-2xl shadow-red-600/30 flex items-center">
              Hozir boshlash <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href={isLoggedIn ? "/builder" : "/login"}
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-colors flex items-center">
              <Cpu className="w-5 h-5 mr-2" /> PC Yig'ish
            </Link>
          </div>
        </motion.div>

        {/* Floating PC illustration */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-10 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 to-blue-600/5" />
            <div className="grid grid-cols-3 gap-6 relative z-10">
              {[
                { icon: <Cpu className="w-8 h-8" />, label: "Intel Core i9", sub: "13900K", color: "text-blue-400" },
                { icon: <Monitor className="w-8 h-8" />, label: "NVIDIA RTX", sub: "4090 24GB", color: "text-green-400" },
                { icon: <Zap className="w-8 h-8" />, label: "DDR5 RAM", sub: "64GB 6000MHz", color: "text-yellow-400" },
              ].map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  className="text-center"
                >
                  <div className={`${spec.color} flex justify-center mb-3`}>{spec.icon}</div>
                  <div className="font-bold text-white">{spec.label}</div>
                  <div className="text-gray-400 text-sm">{spec.sub}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex justify-center relative z-10">
              <div className="text-3xl font-extrabold text-yellow-400">85,000,000 UZS</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-extrabold text-center mb-14">Nima uchun <span className="text-red-500">UPG RADE</span>?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Shield className="w-10 h-10 text-red-500" />, title: "2 Yil Kafolat", desc: "Barcha mahsulotlar rasmiy kafolatga ega. Nosoz chiqsa — bepul ta'mirlash yoki almashtirish." },
            { icon: <Zap className="w-10 h-10 text-yellow-500" />, title: "Tez Yetkazib Berish", desc: "Toshkent bo'yicha 24 soat, viloyatlar bo'yicha 3 kun ichida yetkazib beramiz." },
            { icon: <Cpu className="w-10 h-10 text-blue-500" />, title: "Custom PC Yig'ish", desc: "Mutaxassislarimiz siz uchun istalgan konfiguratsiyada kompyuter yig'ib beradi." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gray-800/50 border border-gray-700 hover:border-red-500/50 rounded-2xl p-8 text-center transition-all hover:bg-gray-800"
            >
              <div className="flex justify-center mb-5">{f.icon}</div>
              <h4 className="text-xl font-bold mb-3">{f.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-extrabold text-center mb-12">Mijozlar fikri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Alisher T.", text: "Eng zo'r gaming kompyuterni shu yerdan oldim. Bir yildan beri muammo yo'q!", stars: 5 },
            { name: "Dilnoza M.", text: "Yetkazib berish juda tez bo'ldi. Xodimlar ham juda yordam berdi.", stars: 5 },
            { name: "Jasur K.", text: "PC Builder funksiyasi ajoyib! O'zim yig'dim va juda mos keldi.", stars: 4 },
          ].map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex text-yellow-500 mb-3">
                {[...Array(r.stars)].map((_, si) => <Star key={si} className="w-4 h-4" fill="currentColor" />)}
              </div>
              <p className="text-gray-300 text-sm mb-4 italic">"{r.text}"</p>
              <div className="font-bold text-white">— {r.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-900/40 to-gray-900 border border-red-900/30 rounded-3xl max-w-3xl mx-auto p-12"
        >
          <h3 className="text-4xl font-extrabold mb-4">Hozir boshlash vaqti!</h3>
          <p className="text-gray-400 mb-8">Birinchi xaridingizda <strong className="text-yellow-400">UPGRADE10</strong> promokodi bilan 10% chegirma oling.</p>
          <Link href={isLoggedIn ? "/store" : "/register"}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full text-lg font-bold inline-block transition-transform hover:scale-105 shadow-xl shadow-red-600/30">
            {isLoggedIn ? "Do'konga o'tish" : "Bepul ro'yxatdan o'tish"} →
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-8 text-gray-600 text-sm border-t border-gray-800">
        © 2026 UPG RADE — Toshkent, Alisher Navoiy ko'chasi 37
      </footer>
    </div>
  );
}
