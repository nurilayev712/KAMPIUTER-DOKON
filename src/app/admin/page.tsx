"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, Product } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PlusCircle, Trash2, Package, TrendingUp, DollarSign, ShoppingBag, Tag, Truck, PhoneCall, Download } from "lucide-react";

const COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"];

const ORDER_STATUSES = [
  "Buyurtma qabul qilindi",
  "Yig'ilmoqda",
  "Tekshirilmoqda",
  "Yo'lda",
  "Yetkazib berildi",
];

export default function AdminPanel() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const { products, addProduct, removeProduct } = useStore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("kompyuter");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [discount, setDiscount] = useState("0");
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders" | "calls">("analytics");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [callbacks, setCallbacks] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user !== "nurilayev712") { router.push("/"); return; }
    
    setIsAuth(true);
    
    const fetchOrders = () => fetch("/api/orders").then(r => r.json()).then(data => setOrders(data.reverse()));
    const fetchCallbacks = () => fetch("/api/callbacks").then(r => r.json()).then(setCallbacks);

    fetchOrders();
    fetchCallbacks();

    // Real-time Dashboard Polling
    const interval = setInterval(() => { fetchOrders(); fetchCallbacks(); }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  if (!isAuth) return null;

  const downloadExcel = () => {
    // Generate simple CSV
    const headers = ["ID", "Foydalanuvchi", "Email", "Manzil", "Sana", "Summa", "Holat"];
    const rows = orders.map(o => [
      o.id,
      o.user,
      o.email || "",
      `"${o.address || ""}"`, // quote to handle commas
      new Date(o.date).toLocaleDateString(),
      o.total,
      o.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `upg_orders_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast("Excel formatida yuklandi!", "success");
  };

  const updateCallbackStatus = async (id: string, status: string) => {
    await fetch("/api/callbacks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    setCallbacks(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const monthlyMap: Record<string, number> = {};
  orders.forEach(o => {
    const month = new Date(o.date).toLocaleString("default", { month: "short", year: "2-digit" });
    monthlyMap[month] = (monthlyMap[month] || 0) + o.total;
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue }));

  const catMap: Record<string, number> = {};
  products.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let uploadedUrl = image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        uploadedUrl = data.url;
      }
    }

    await addProduct({
      id: Date.now().toString(),
      name, price: Number(price), category, brand, description, image: uploadedUrl,
      discount: Number(discount),
    } as any);
    setName(""); setPrice(""); setDescription(""); setImage(""); setBrand(""); setDiscount("0"); setImageFile(null);
    toast("Mahsulot muvaffaqiyatli qo'shildi!", "success");
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast(`Holat: "${newStatus}" ga o'zgartirildi`, "success");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="bg-gray-950 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-500">UPG RADE — Admin Panel</h1>
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white transition-colors text-sm">
            Asosiy sahifa
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-2 mb-8 bg-gray-800 p-1 rounded-xl w-fit">
          {[
            { id: "analytics", label: "Analitika", icon: <TrendingUp className="w-4 h-4 mr-1 inline" /> },
            { id: "products", label: "Mahsulotlar", icon: <Package className="w-4 h-4 mr-1 inline" /> },
            { id: "orders", label: "Buyurtmalar", icon: <ShoppingBag className="w-4 h-4 mr-1 inline" /> },
            { id: "calls", label: "Qo'ng'iroqlar", icon: <PhoneCall className="w-4 h-4 mr-1 inline" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${activeTab === tab.id ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}>
              {tab.icon}{tab.label}
              {tab.id === "calls" && callbacks.filter(c => c.status === "new").length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {callbacks.filter(c => c.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Umumiy daromad", value: totalRevenue.toLocaleString() + " UZS", icon: <DollarSign className="w-8 h-8 text-yellow-400" />, color: "border-yellow-500/30 bg-yellow-500/5" },
                { label: "Jami buyurtmalar", value: orders.length, icon: <ShoppingBag className="w-8 h-8 text-blue-400" />, color: "border-blue-500/30 bg-blue-500/5" },
                { label: "Jami mahsulotlar", value: products.length, icon: <Package className="w-8 h-8 text-green-400" />, color: "border-green-500/30 bg-green-500/5" },
              ].map((stat, i) => (
                <div key={i} className={`bg-gray-800 p-6 rounded-xl border ${stat.color} flex items-center justify-between`}>
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="font-bold text-lg mb-6">Oylik Daromad</h3>
                {monthlyData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-500 text-sm">Buyurtma mavjud emas</div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={v => (v / 1000000).toFixed(0) + "M"} />
                      <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} UZS`, "Daromad"]}
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
                      <Bar dataKey="revenue" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="font-bold text-lg mb-6">Toifalar bo'yicha</h3>
                {catData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-500 text-sm">Mahsulot yo'q</div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                        {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 md:col-span-1 h-fit">
              <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-green-400" /><span>Yangi Mahsulot</span>
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-3">
                {[
                  { label: "Nomi *", val: name, set: setName, type: "text", req: true },
                  { label: "Narxi (UZS) *", val: price, set: setPrice, type: "number", req: true },
                  { label: "Brend", val: brand, set: setBrand, type: "text", req: false },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-gray-400">{f.label}</label>
                    <input required={f.req} type={f.type} value={f.val as string} onChange={e => f.set(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded p-2 mt-1 focus:border-yellow-500 outline-none text-sm" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-400">Rasm yuklash</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 mt-1 focus:border-yellow-500 outline-none text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Yoki URL kiriting:</p>
                  <input type="text" value={image} onChange={e => setImage(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 mt-1 focus:border-yellow-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center"><Tag className="w-3 h-3 mr-1 text-red-400" /> Chegirma (%)</label>
                  <input type="number" min="0" max="90" value={discount} onChange={e => setDiscount(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 mt-1 focus:border-red-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Toifa</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 mt-1 outline-none text-sm">
                    <option value="kompyuter">Kompyuter</option>
                    <option value="noutbuk">Noutbuk</option>
                    <option value="aksessuar">Aksessuar</option>
                    <option value="qism">Ehtiyot qism</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Tavsif *</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 mt-1 outline-none h-20 text-sm" />
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors">
                  Qo'shish
                </button>
              </form>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 md:col-span-2">
              <h2 className="text-lg font-bold mb-4">Barcha Mahsulotlar ({products.length})</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {products.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700 hover:border-gray-600">
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.category} {p.brand && `| ${p.brand}`}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {p.discount > 0 && <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-0.5 rounded">-{p.discount}%</span>}
                      <span className="text-yellow-500 font-bold text-sm">{p.price.toLocaleString()} UZS</span>
                      <button onClick={() => { removeProduct(p.id); toast("Mahsulot o'chirildi", "error"); }}
                        className="text-red-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS with Status Tracking */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Barcha Buyurtmalar ({orders.length})</h2>
              <button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center font-bold">
                <Download className="w-4 h-4 mr-2" /> Excel ga yuklash
              </button>
            </div>
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-12">Hali hech qanday buyurtma yo'q</p>
            ) : (
              orders.map(o => (
                <div key={o.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="font-mono text-xs text-gray-500">{o.id}</div>
                      <div className="font-bold text-blue-400">{o.user}</div>
                      <div className="text-sm text-gray-400">{o.email && `📧 ${o.email}`}</div>
                      {o.address && <div className="text-sm text-gray-400 flex items-center mt-1"><Truck className="w-3 h-3 mr-1" />{o.address}</div>}
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <div className="font-bold text-yellow-400">{o.total?.toLocaleString()} UZS</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Holat:</span>
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-green-400 focus:border-yellow-500 outline-none"
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CALLS */}
        {activeTab === "calls" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold mb-6">Qayta qo'ng'iroq so'rovlari</h2>
            {callbacks.length === 0 ? (
              <p className="text-gray-400 text-center py-12">Hech qanday so'rov yo'q</p>
            ) : (
              callbacks.map(c => (
                <div key={c.id} className={`p-4 rounded-xl border flex justify-between items-center ${c.status === "new" ? "bg-red-500/10 border-red-500/30" : "bg-gray-800 border-gray-700"}`}>
                  <div>
                    <div className="font-bold text-lg">{c.phone}</div>
                    <div className="text-sm text-gray-400">Ismi: {c.name} | Sana: {new Date(c.date).toLocaleString("uz-UZ")}</div>
                  </div>
                  <div>
                    {c.status === "new" ? (
                      <button onClick={() => updateCallbackStatus(c.id, "done")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold">
                        Bajarildi (Qo'ng'iroq qilindi)
                      </button>
                    ) : (
                      <span className="text-green-500 font-bold flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> Qo'ng'iroq qilingan</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
