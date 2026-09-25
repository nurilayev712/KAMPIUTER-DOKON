"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { Lock, User, LogIn } from "lucide-react";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, action: "login" }),
      });
      const data = await res.json();

      if (res.ok) {
        // Also keep localStorage for compatibility with existing pages
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", data.login);
        toast(`Xush kelibsiz, ${data.login}! 👋`, "success");
        router.push("/");
      } else {
        toast(data.error || "Login yoki parol xato", "error");
      }
    } catch {
      toast("Server xatoligi. Qayta urinib ko'ring.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-red-500 mb-2">UPG<span className="text-white"> RADE</span></h1>
          <p className="text-gray-400 text-sm">Tizimga kirish</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
            <LogIn className="w-6 h-6 text-red-500" />
            <span>Kirish</span>
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 flex items-center"><User className="w-4 h-4 mr-1" /> Login</label>
              <input type="text" value={login} onChange={e => setLogin(e.target.value)} required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Loginingizni kiriting" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5 flex items-center"><Lock className="w-4 h-4 mr-1" /> Parol</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Parolingizni kiriting" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
              ) : (
                <><LogIn className="w-5 h-5" /><span>Kirish</span></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Akkauntingiz yo'qmi?{" "}
            <Link href="/register" className="text-red-500 hover:text-red-400 font-bold">Ro'yxatdan o'tish</Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          🔐 JWT Token bilan himoyalangan xavfsiz tizim
        </p>
      </div>
    </div>
  );
}
