"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { PhoneCall, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
      });
      toast("So'rovingiz qabul qilindi. Tez orada aloqaga chiqamiz!", "success");
      setIsOpen(false);
      setPhone("");
      setName("");
    } catch {
      toast("Xatolik yuz berdi", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-red-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold">Biz bilan aloqa</h3>
              <button onClick={() => setIsOpen(false)} className="hover:text-red-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-4">Raqamingizni qoldiring, menejerlarimiz sizga tez orada aloqaga chiqishadi!</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Ismingiz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-red-500 outline-none text-sm"
                />
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-red-500 outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg shadow-red-600/50 transition-transform transform hover:scale-110 z-50 flex items-center justify-center group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <PhoneCall className="w-6 h-6 animate-pulse" />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-gray-800 text-sm px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700 shadow-xl">
            Qayta qo'ng'iroq!
          </span>
        )}
      </button>
    </>
  );
}
