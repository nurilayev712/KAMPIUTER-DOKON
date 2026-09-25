"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, Clock, MapPin, Mail, Download, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ORDER_STATUSES = [
  "Buyurtma qabul qilindi",
  "Yig'ilmoqda",
  "Tekshirilmoqda",
  "Yo'lda",
  "Yetkazib berildi",
];

function OrderProgress({ status }: { status: string }) {
  const currentIdx = ORDER_STATUSES.indexOf(status);
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        {ORDER_STATUSES.map((s, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < currentIdx ? "bg-green-600 border-green-600 text-white" :
              i === currentIdx ? "bg-red-600 border-red-600 text-white scale-110 shadow-lg shadow-red-600/40" :
              "bg-gray-800 border-gray-600 text-gray-500"
            }`}>
              {i < currentIdx ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-2 text-center hidden md:block leading-tight ${i === currentIdx ? "text-white font-bold" : i < currentIdx ? "text-green-400" : "text-gray-600"}`}>
              {s}
            </span>
          </div>
        ))}
      </div>
      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-700 rounded-full mt-1 hidden md:block">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIdx / (ORDER_STATUSES.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {/* Mobile current status */}
      <div className="mt-3 md:hidden text-center">
        <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold border border-red-600/30">{status}</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) { router.push("/login"); }
    else {
      setUser(currentUser);
      fetch(`/api/orders?user=${currentUser}`)
        .then(r => r.json())
        .then(data => setOrders([...data].reverse()));
    }
  }, [router]);

  if (!user) return null;

  const downloadInvoice = async (orderId: string) => {
    const element = document.getElementById(`invoice-${orderId}`);
    if (element) {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#111827" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`UPGRADE_Invoice_${orderId}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-500" />
            <span>Shaxsiy Kabinet</span>
          </h1>
          <Link href="/" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white transition-colors text-sm">Orqaga</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
              <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="font-bold text-xl">{user}</h2>
              <p className="text-gray-400 text-sm mt-1">{orders.length} ta buyurtma</p>
            </div>
          </div>

          {/* Orders */}
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-yellow-500" />
              <span>Buyurtmalar tarixi</span>
            </h2>

            {orders.length === 0 ? (
              <div className="bg-gray-800 p-10 rounded-xl border border-gray-700 text-center">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Siz hali hech narsa sotib olmadingiz.</p>
                <Link href="/" className="text-blue-500 hover:underline">Katalogga o'tish</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    id={`invoice-${order.id}`}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition relative"
                  >
                    <button onClick={() => downloadInvoice(order.id)}
                      className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white flex items-center space-x-1 text-xs transition-colors">
                      <Download className="w-3 h-3" /><span>PDF</span>
                    </button>

                    <div className="pr-20 mb-4">
                      <div className="text-blue-400 font-bold text-sm">UPG RADE INVOICE</div>
                      <div className="font-mono text-xs text-gray-500">{order.id}</div>
                      <div className="text-sm text-gray-400 mt-1">{new Date(order.date).toLocaleString("uz-UZ")}</div>
                      {order.email && <div className="text-xs text-gray-500 flex items-center mt-1"><Mail className="w-3 h-3 mr-1" />{order.email}</div>}
                      {order.address && order.address !== ", , " && (
                        <div className="text-xs text-gray-500 flex items-center mt-1"><MapPin className="w-3 h-3 mr-1" />{order.address}</div>
                      )}
                    </div>

                    {/* Order tracking progress bar */}
                    <div className="mb-4 border-b border-gray-700 pb-4">
                      <OrderProgress status={order.status || "Buyurtma qabul qilindi"} />
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm bg-gray-900/50 p-2.5 rounded border border-gray-700/50">
                          <span>{item.name} <span className="text-gray-500">×{item.quantity}</span></span>
                          <span className="text-gray-300">{(item.price * item.quantity).toLocaleString()} UZS</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Jami to'langan:</div>
                        <div className="text-2xl font-bold text-yellow-400">{order.total?.toLocaleString()} UZS</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
