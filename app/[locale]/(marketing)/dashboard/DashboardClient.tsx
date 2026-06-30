"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { Download, Key, Calendar, ShoppingBag, CreditCard, LifeBuoy, ArrowRight, User as UserIcon } from "lucide-react";

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"downloads" | "orders" | "profile">("downloads");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("ecare_user");
      if (!storedUser) {
        router.push("/login?redirect=/dashboard");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch user orders
      fetch(`/api/user/orders?email=${encodeURIComponent(parsedUser.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    }
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading || !user) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 min-h-[60vh] bg-slate-50 dark:bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get items (downloads) for any order that has download tokens and license keys generated
  const downloadsList = orders
    .filter((o) => o.downloadToken && o.licenseKeys && o.licenseKeys.length > 0)
    .flatMap((order) => 
      order.items.map((item: any, idx: number) => ({
        ...item,
        orderId: order._id,
        downloadToken: order.downloadToken,
        licenseKey: order.licenseKeys[idx] || "N/A",
        purchaseDate: order.createdAt
      }))
    );

  return (
    <div className="flex-grow py-12 bg-slate-50 dark:bg-transparent min-h-[70vh]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar Profile Card & Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#0c101b] border border-border/80 rounded-3xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white flex items-center justify-center text-3xl font-extrabold uppercase border border-primary/20">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{user.email}</p>
              {user.phone && <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-[#0c101b] border border-border/80 rounded-3xl p-3 shadow-sm flex flex-col gap-1">
              <button
                onClick={() => setActiveTab("downloads")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === "downloads"
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <Download className="w-4 h-4" />
                My Downloads
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Order History
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                My Profile
              </button>
            </div>
          </div>

          {/* Right Column: Main Content Area */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0c101b] border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[400px]">
            
            {/* 1. Downloads Tab */}
            {activeTab === "downloads" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">My Downloads</h3>
                  <p className="text-xs text-slate-500 mt-1">Access all your purchased plugins, templates, and license keys.</p>
                </div>

                {downloadsList.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border/80 rounded-2xl space-y-4">
                    <Download className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm font-medium">You haven't purchased any downloads yet.</p>
                    <Button asChild className="bg-primary hover:bg-primary-hover text-white rounded-xl">
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {downloadsList.map((item, idx) => (
                      <div key={idx} className="p-5 border border-border/80 rounded-2xl space-y-4 hover:border-primary/30 transition-all bg-slate-50/20 dark:bg-transparent">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-extrabold text-slate-800 dark:text-white text-base">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              Purchased on: {new Date(item.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                          {item.downloadToken && (
                            <a
                              href={`/api/payment/download?token=${item.downloadToken}`}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md shrink-0"
                            >
                              <Download className="w-4 h-4" />
                              Download ZIP
                            </a>
                          )}
                        </div>

                        {/* License Key box */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border/80">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Key className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="text-[11px] font-bold text-slate-500 shrink-0">LICENSE KEY:</span>
                            <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">{item.licenseKey}</code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.licenseKey)}
                            className="text-[10px] font-black uppercase text-primary hover:text-primary-hover shrink-0 cursor-pointer"
                          >
                            {copiedKey === item.licenseKey ? "Copied!" : "Copy Key"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Order History</h3>
                  <p className="text-xs text-slate-500 mt-1">Review your billing history and invoices.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border/80 rounded-2xl space-y-4">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm font-medium">No order history found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-border/80">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border/80 text-slate-600 dark:text-slate-400 font-bold">
                          <th className="p-4 text-xs uppercase">Order ID</th>
                          <th className="p-4 text-xs uppercase">Date</th>
                          <th className="p-4 text-xs uppercase">Total</th>
                          <th className="p-4 text-xs uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                              #{order._id.substring(0, 10)}...
                            </td>
                            <td className="p-4 text-slate-500 text-xs">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 font-bold text-slate-800 dark:text-white text-xs">
                              ৳{order.totalAmount}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.paymentStatus === "paid"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : order.paymentStatus === "pending"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">My Profile</h3>
                  <p className="text-xs text-slate-500 mt-1">Review your personal details and account status.</p>
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-transparent border border-border/80 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Full Name</span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.phone || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Account Type</span>
                      <p className="text-sm font-bold text-primary capitalize">{user.role || "customer"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-transparent border border-border/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Need support or customization?</h4>
                    <p className="text-xs text-slate-500">Contact our development team for assistance or integration queries.</p>
                  </div>
                  <Button asChild className="bg-primary hover:bg-primary-hover text-white rounded-xl flex items-center gap-1">
                    <Link href="/contact">
                      Contact Support <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </Container>
    </div>
  );
}
