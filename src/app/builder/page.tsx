"use client";

import { useStore, Product } from "@/context/StoreContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Builder() {
  const { products, addToCart } = useStore();
  const router = useRouter();
  
  // Fake builder components filtered from products or hardcoded fallbacks
  const partsList = products.filter(p => p.category === "qism" || p.category.includes("kompyuter"));
  
  const [selectedCpu, setSelectedCpu] = useState<Product | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<Product | null>(null);
  const [selectedRam, setSelectedRam] = useState<Product | null>(null);

  const totalPrice = (selectedCpu?.price || 0) + (selectedGpu?.price || 0) + (selectedRam?.price || 0);

  const handleBuild = () => {
    if (selectedCpu || selectedGpu || selectedRam) {
      const customPc: Product = {
        id: "custom_" + Date.now(),
        name: "Custom Yig'ilgan Kompyuter",
        price: totalPrice,
        category: "kompyuter",
        description: `Protsessor: ${selectedCpu?.name || "Yo'q"}\nVideokarta: ${selectedGpu?.name || "Yo'q"}\nRAM: ${selectedRam?.name || "Yo'q"}`,
        image: ""
      };
      addToCart(customPc);
      router.push("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">PC Yig'ish (Configurator)</h1>
            <p className="text-gray-400 mt-2">O'zingiz xohlagan qismlarni tanlang va ideal kompyuteringizni yarating.</p>
          </div>
          <Link href="/" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white transition-colors">
            Orqaga
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* CPU */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Protsessor (CPU)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setSelectedCpu({ id: 'c1', name: 'Intel Core i5-12400F', price: 2000000, category: 'qism', description: '', image: '' })} className={`p-4 rounded border text-left ${selectedCpu?.id === 'c1' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="font-bold">Intel Core i5-12400F</div>
                  <div className="text-yellow-500">2,000,000 UZS</div>
                </button>
                <button onClick={() => setSelectedCpu({ id: 'c2', name: 'Intel Core i7-13700K', price: 5000000, category: 'qism', description: '', image: '' })} className={`p-4 rounded border text-left ${selectedCpu?.id === 'c2' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="font-bold">Intel Core i7-13700K</div>
                  <div className="text-yellow-500">5,000,000 UZS</div>
                </button>
              </div>
            </div>

            {/* GPU */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Videokarta (GPU)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setSelectedGpu({ id: 'g1', name: 'NVIDIA RTX 4060 8GB', price: 4500000, category: 'qism', description: '', image: '' })} className={`p-4 rounded border text-left ${selectedGpu?.id === 'g1' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="font-bold">NVIDIA RTX 4060 8GB</div>
                  <div className="text-yellow-500">4,500,000 UZS</div>
                </button>
                <button onClick={() => setSelectedGpu({ id: 'g2', name: 'NVIDIA RTX 4070 Ti', price: 11000000, category: 'qism', description: '', image: '' })} className={`p-4 rounded border text-left ${selectedGpu?.id === 'g2' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="font-bold">NVIDIA RTX 4070 Ti</div>
                  <div className="text-yellow-500">11,000,000 UZS</div>
                </button>
              </div>
            </div>

            {/* RAM */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Tezkor xotira (RAM)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setSelectedRam({ id: 'r1', name: '16GB (2x8GB) DDR4 3200MHz', price: 800000, category: 'qism', description: '', image: '' })} className={`p-4 rounded border text-left ${selectedRam?.id === 'r1' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="font-bold">16GB DDR4 3200MHz</div>
                  <div className="text-yellow-500">800,000 UZS</div>
                </button>
                <button onClick={() => setSelectedRam({ id: 'r2', name: '32GB (2x16GB) DDR5 6000MHz', price: 1800000, category: 'qism', description: '', image: '' })} className={`p-4 rounded border text-left ${selectedRam?.id === 'r2' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="font-bold">32GB DDR5 6000MHz</div>
                  <div className="text-yellow-500">1,800,000 UZS</div>
                </button>
              </div>
            </div>

          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-center border-b border-gray-700 pb-4">Sizning Konfiguratsiyangiz</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Protsessor:</span>
                <span className="font-bold text-right max-w-[150px] truncate">{selectedCpu ? selectedCpu.name : "Tanlanmagan"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Videokarta:</span>
                <span className="font-bold text-right max-w-[150px] truncate">{selectedGpu ? selectedGpu.name : "Tanlanmagan"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">RAM:</span>
                <span className="font-bold text-right max-w-[150px] truncate">{selectedRam ? selectedRam.name : "Tanlanmagan"}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg">Umumiy narx:</span>
                <span className="text-2xl font-bold text-yellow-500">{totalPrice.toLocaleString()} UZS</span>
              </div>
            </div>

            <button 
              onClick={handleBuild}
              disabled={totalPrice === 0}
              className={`w-full py-3 rounded font-bold transition-all transform ${totalPrice > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              Yig'ilgan kompyuterni sotib olish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
