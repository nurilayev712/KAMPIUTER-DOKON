"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  brand?: string;
  description: string;
  image: string;
};

export type CartItem = Product & { quantity: number };

interface StoreContextType {
  products: Product[];
  addProduct: (p: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  // Wishlist
  wishlist: Product[];
  addToWishlist: (p: Product) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  // Language
  lang: "uz" | "ru";
  setLang: (lang: "uz" | "ru") => void;
  t: (key: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const dictionary = {
  uz: {
    home: "Asosiy",
    cart: "Savatcha",
    builder: "PC Yig'ish",
    admin: "Admin",
    wishlist: "Sevimlilar",
    search_placeholder: "Mahsulotlarni qidirish...",
    logout: "Chiqish",
    add_to_cart: "Savatga",
    buy_now: "Hozir sotib olish",
    empty_cart: "Savatingiz bo'sh",
    total: "Jami",
    checkout: "Rasmiylashtirish",
    promo: "Promokod",
    reviews: "Mijozlar fikri",
    profile: "Kabinet",
    all: "Barchasi",
  },
  ru: {
    home: "Главная",
    cart: "Корзина",
    builder: "Сборка ПК",
    admin: "Админ",
    wishlist: "Избранное",
    search_placeholder: "Поиск товаров...",
    logout: "Выйти",
    add_to_cart: "В корзину",
    buy_now: "Купить сейчас",
    empty_cart: "Ваша корзина пуста",
    total: "Итого",
    checkout: "Оформить",
    promo: "Промокод",
    reviews: "Отзывы",
    profile: "Кабинет",
    all: "Все",
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [lang, setLang] = useState<"uz" | "ru">("uz");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem("upg_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedLang = localStorage.getItem("upg_lang");
    if (savedLang === "ru") setLang("ru");
    const savedWishlist = localStorage.getItem("upg_wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const t = (key: string) => (dictionary[lang] as any)[key] || key;

  const handleSetLang = (l: "uz" | "ru") => {
    setLang(l);
    localStorage.setItem("upg_lang", l);
  };

  const addProduct = async (p: Product) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    await fetchProducts();
  };

  const removeProduct = async (id: string) => {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    await fetchProducts();
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("upg_cart", JSON.stringify(newCart));
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("upg_cart", JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("upg_cart");
  };

  const addToWishlist = (product: Product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      localStorage.setItem("upg_wishlist", JSON.stringify(newWishlist));
    }
  };

  const removeFromWishlist = (id: string) => {
    const newWishlist = wishlist.filter(p => p.id !== id);
    setWishlist(newWishlist);
    localStorage.setItem("upg_wishlist", JSON.stringify(newWishlist));
  };

  const isWishlisted = (id: string) => wishlist.some(p => p.id === id);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products, addProduct, removeProduct,
      cart, addToCart, removeFromCart, clearCart, cartTotal,
      wishlist, addToWishlist, removeFromWishlist, isWishlisted,
      lang, setLang: handleSetLang, t,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
