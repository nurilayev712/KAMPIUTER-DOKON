"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import { motion } from "framer-motion";
import { Search, Monitor, Laptop, Keyboard, LogOut, ShoppingCart, ShieldAlert, Globe, Heart, Flame } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const { products, cart, addToCart, lang, setLang, t, wishlist, addToWishlist, removeFromWishlist, isWishlisted } = useStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(50000000);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("currentUser");
    if (!loggedIn) { router.push("/login"); }
    else { setIsAuth(true); setCurrentUser(user || ""); }
  }, [router]);

  if (!isAuth) return null;

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    const matchBrand = brandFilter === "all" || (p.brand || "").toLowerCase() === brandFilter.toLowerCase();
    const matchPrice = p.price <= priceRange;
    return matchSearch && matchCat && matchBrand && matchPrice;
  });

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast(`"${item.name}" savatga qo'shildi!`, "success");
  };

  const handleWishlist = (item: any) => {
    if (isWishlisted(item.id)) {
      removeFromWishlist(item.id);
      toast("Sevimlilardan olib tashlandi", "info");
    } else {
      addToWishlist(item);
      toast(`"${item.name}" sevimlilarga qo'shildi! ❤️`, "success");
    }
  };

  const categories = [
    { id: "all", label: t("all"), icon: null },
    { id: "kompyuter", label: "Kompyuterlar", icon: <Monitor className="w-4 h-4 mr-1 inline" /> },
    { id: "noutbuk", label: "Noutbuklar", icon: <Laptop className="w-4 h-4 mr-1 inline" /> },
    { id: "aksessuar", label: "Aksessuarlar", icon: <Keyboard className="w-4 h-4 mr-1 inline" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-950/90 backdrop-blur-md border-b border-gray-800 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center gap-4">
          <Link href="/">
            <h1 className="text-2xl font-extrabold text-red-600 tracking-tighter hover:scale-105 transition-transform whitespace-nowrap">
              UPG<span className="text-white"> RADE</span>
            </h1>
          </Link>

          <div className="flex-1 max-w-lg relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder={t("search_placeholder")} value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors" />
          </div>

          <nav className="hidden lg:flex items-center space-x-4 text-sm">
            {currentUser === "nurilayev712" && (
              <Link href="/admin" className="text-yellow-500 hover:text-yellow-400 font-bold flex items-center">
                <ShieldAlert className="w-4 h-4 mr-1" />{t("admin")}
              </Link>
            )}
            <Link href="/builder" className="text-blue-400 hover:text-blue-300 font-bold">{t("builder")}</Link>
            <Link href="/landing" className="text-gray-400 hover:text-white">Landing</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
              className="flex items-center text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-700">
              <Globe className="w-3 h-3 mr-1" />{lang.toUpperCase()}
            </button>

            <Link href="/wishlist" className="relative text-gray-400 hover:text-red-400 transition-colors">
              <Heart className="w-6 h-6" fill={wishlist.length > 0 ? "currentColor" : "none"} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{wishlist.length}</span>
              )}
            </Link>

            <Link href="/profile" className="text-gray-300 hover:text-white text-sm hidden sm:block">{currentUser}</Link>
            <button onClick={() => { localStorage.removeItem("isLoggedIn"); localStorage.removeItem("currentUser"); router.push("/login"); }}
              className="text-gray-500 hover:text-red-400 transition-colors" title={t("logout")}>
              <LogOut className="w-5 h-5" />
            </button>
            <Link href="/cart" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg shadow-red-600/20 transition-transform hover:scale-105">
              <ShoppingCart className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{t("cart")} ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="w-full md:w-56 flex-shrink-0 space-y-6 bg-gray-800/40 p-5 rounded-2xl border border-gray-800 h-fit">
          <div>
            <h3 className="font-bold mb-3 text-gray-300 text-sm uppercase tracking-widest">Toifalar</h3>
            <div className="flex flex-col space-y-1">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
                  className={`text-left px-3 py-2 rounded-lg transition-colors text-sm ${categoryFilter === cat.id ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}>
                  {cat.icon}{cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-gray-300 text-sm uppercase tracking-widest">Brendlar</h3>
            <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm focus:border-red-500 outline-none">
              <option value="all">Barcha brendlar</option>
              <option value="asus">ASUS</option>
              <option value="msi">MSI</option>
              <option value="razer">Razer</option>
              <option value="apple">Apple</option>
              <option value="hp">HP</option>
              <option value="lenovo">Lenovo</option>
            </select>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-gray-300 text-sm uppercase tracking-widest">Narx chegarasi</h3>
            <input type="range" min="500000" max="50000000" step="500000"
              value={priceRange} onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-red-600" />
            <div className="text-yellow-500 font-bold text-center text-sm mt-2">
              {(priceRange / 1000000).toFixed(1)} mln UZS
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-900/40 via-gray-900 to-gray-900 border border-red-900/30 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-red-400 font-bold text-sm uppercase tracking-widest mb-2">O'zbekiston №1 Gaming Do'koni</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">
                <span className="text-red-500">PRO</span> Geymerlar tanlovi
              </h2>
              <p className="text-gray-400 mb-5 max-w-lg text-sm leading-relaxed">
                Zamonaviy kompyuter texnikalari. "UPGRADE10" promokodi bilan 10% chegirma!
              </p>
              <Link href="/builder" className="inline-block bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-transform hover:scale-105">
                O'z kompyuteringizni yig'ing →
              </Link>
            </div>
          </motion.div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
              <Search className="w-14 h-14 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Mahsulot topilmadi</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((item: any, idx) => {
                const hasDiscount = item.discount && item.discount > 0;
                const discountedPrice = hasDiscount ? Math.round(item.price * (1 - item.discount / 100)) : item.price;

                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-red-500 transition-all flex flex-col group hover:shadow-lg hover:shadow-red-900/20 relative"
                  >
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <Flame className="w-3 h-3 mr-1" />-{item.discount}%
                      </div>
                    )}
                    <Link href={`/product/${item.id}`}>
                      <div className="h-48 bg-gray-900 flex items-center justify-center p-4 relative">
                        {item.brand && <span className="absolute top-2 right-2 bg-blue-900/60 text-blue-300 text-xs px-2 py-0.5 rounded font-bold">{item.brand}</span>}
                        {item.image ? (
                          <motion.img whileHover={{ scale: 1.08 }} src={item.image} alt={item.name} className="object-contain h-full w-full duration-300" />
                        ) : (
                          <span className="text-gray-600 text-sm">Rasm yo'q</span>
                        )}
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/product/${item.id}`}>
                        <h4 className="font-bold mb-1 group-hover:text-red-400 transition-colors line-clamp-1">{item.name}</h4>
                      </Link>
                      <p className="text-gray-400 text-xs mb-4 flex-1 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          {hasDiscount ? (
                            <>
                              <div className="text-gray-500 line-through text-xs">{item.price.toLocaleString()} UZS</div>
                              <div className="text-yellow-400 font-bold">{discountedPrice.toLocaleString()} UZS</div>
                            </>
                          ) : (
                            <span className="text-yellow-500 font-bold">{item.price.toLocaleString()} UZS</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleWishlist(item)}
                            className={`p-1.5 rounded-lg transition-colors ${isWishlisted(item.id) ? "text-red-500 bg-red-500/10" : "text-gray-500 hover:text-red-400 bg-gray-700"}`}>
                            <Heart className="w-4 h-4" fill={isWishlisted(item.id) ? "currentColor" : "none"} />
                          </button>
                          <button onClick={() => handleAddToCart({ ...item, price: discountedPrice })}
                            className="bg-gray-700 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors group-hover:bg-red-600">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-950 border-t border-gray-800 p-8 mt-12 text-center text-gray-600 text-sm">
        <p>&copy; 2026 UPG RADE. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
