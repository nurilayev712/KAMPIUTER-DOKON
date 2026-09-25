"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { Lock, User, UserPlus } from "lucide-react";

export default function Register() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast("Parol kamida 6 ta belgidan iborat bo'lishi kerak", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, action: "register" }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", data.login);
        toast(`Xush kelibsiz, ${data.login}! Ro'yxatdan o'tdingiz ✅`, "success");
        router.push("/");
      } else {
        toast(data.error || "Xatolik yuz berdi", "error");
      }
    } catch {
      toast("Server xatoligi", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-red-500 mb-2">UPG<span className="text-white"> RADE</span></h1>
          <p className="text-gray-400 text-sm">Yangi akkaunt yaratish</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
            <UserPlus className="w-6 h-6 text-blue-400" />
            <span>Ro'yxatdan o'tish</span>
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 flex items-center"><User className="w-4 h-4 mr-1" /> Yangi Login</label>
              <input type="text" value={login} onChange={e => setLogin(e.target.value)} required minLength={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Kamida 3 ta belgi" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 flex items-center"><Lock className="w-4 h-4 mr-1" /> Yangi Parol</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Kamida 6 ta belgi" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
              ) : (
                <><UserPlus className="w-5 h-5" /><span>Akkaunt yaratish</span></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Akkauntingiz bormi?{" "}
            <Link href="/login" className="text-red-500 hover:text-red-400 font-bold">Kirish</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
