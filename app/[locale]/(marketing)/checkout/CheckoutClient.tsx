"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getCartItems, clearCart, CartItem } from "@/lib/cart";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Lock, X } from "lucide-react";

export default function CheckoutClient() {
  const t = useTranslations("Checkout");
  const tCart = useTranslations("Cart");
  const tAuth = useTranslations("Auth");
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderComplete, setOrderComplete] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [user, setUser] = useState<any>(null);
  
  // Billing Form State
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  // bKash Checkout Modal Flow
  const [bkashModal, setBkashModal] = useState(false);
  const [bkashStep, setBkashStep] = useState<"number" | "otp" | "pin" | "processing">("number");
  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashOtp, setBkashOtp] = useState("");
  const [bkashPin, setBkashPin] = useState("");
  const [bkashError, setBkashError] = useState("");

  useEffect(() => {
    setItems(getCartItems());
    const storedUser = localStorage.getItem("ecare_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setBilling((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
    }
    setLoading(false);
  }, []);

  const subtotal = items.reduce((acc, item) => {
    let price = item.price;
    if (item.extendSupport) {
      price += item.supportPrice;
    }
    return acc + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!billing.name.trim()) errors.name = "Name is required";
    if (!billing.email.trim() || !/\S+@\S+\.\S+/.test(billing.email)) errors.email = "Valid email is required";
    if (!billing.phone.trim() || billing.phone.length < 11) errors.phone = "Valid phone number is required (min 11 digits)";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBilling({ ...billing, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setBkashModal(true);
    setBkashStep("number");
    setBkashError("");
  };

  const handleBkashSubmit = () => {
    setBkashError("");
    if (bkashStep === "number") {
      if (!/^(01)[3-9]\d{8}$/.test(bkashNumber)) {
        setBkashError("Invalid bKash number. Must be a valid 11-digit Bangladeshi mobile number.");
        return;
      }
      setBkashStep("otp");
    } else if (bkashStep === "otp") {
      if (bkashOtp.length !== 6 || !/^\d+$/.test(bkashOtp)) {
        setBkashError("OTP must be 6 digits.");
        return;
      }
      setBkashStep("pin");
    } else if (bkashStep === "pin") {
      if (bkashPin.length !== 4 || !/^\d+$/.test(bkashPin)) {
        setBkashError("PIN must be 4 digits.");
        return;
      }
      
      setBkashStep("processing");
      
      // Simulate API call to bKash PGW
      setTimeout(() => {
        const randTxn = "BKSH" + Math.random().toString(36).substring(2, 10).toUpperCase();
        setTxnId(randTxn);
        clearCart();
        setOrderComplete(true);
        setBkashModal(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-transparent">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Require user authentication
  if (!user && !orderComplete) {
    return (
      <div className="flex-grow py-16 bg-[#f8fafc] dark:bg-transparent flex items-center">
        <Container className="max-w-md">
          <div className="bg-white dark:bg-[#0c101b] border border-border/80 rounded-3xl p-8 text-center space-y-6 shadow-xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">
                {tAuth("required")}
              </h1>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {tAuth("requiredDesc")}
              </p>
            </div>
            <Button asChild className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold uppercase tracking-wider text-xs">
              <Link href="/login?redirect=/checkout">
                {tAuth("proceedToLogin")}
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex-grow py-10 bg-[#f8fafc] dark:bg-transparent">
      <Container>
        {orderComplete ? (
          /* Success confirmation screen */
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#0c101b] border border-border/80 rounded-2xl p-8 text-center space-y-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                {t("success")}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                {t("successDesc")}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 inline-block text-left border border-border">
              <div className="flex justify-between gap-8 text-xs font-semibold">
                <span className="text-slate-500">{t("transactionId")}:</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono">{txnId}</span>
              </div>
              <div className="flex justify-between gap-8 text-xs font-semibold mt-2 border-t border-border/50 pt-2">
                <span className="text-slate-500">{t("total")}:</span>
                <span className="text-[#e2136e] font-extrabold">৳{(total * 120).toFixed(0)}</span>
              </div>
            </div>

            <div>
              <Button asChild className="px-6 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white">
                <Link href="/">{t("backHome")}</Link>
              </Button>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart Warning state */
          <div className="max-w-md mx-auto bg-white dark:bg-[#0c101b] border border-border/80 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <h1 className="text-xl font-bold">{tCart("empty")}</h1>
            <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl">
              <Link href="/products">Go to Products</Link>
            </Button>
          </div>
        ) : (
          /* Core Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Billing and Payment */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-[#0c101b] border border-border/85 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-border/40 pb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  {t("billing")}
                </h2>
                
                <form onSubmit={handlePayClick} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t("name")}</label>
                      <input
                        type="text"
                        name="name"
                        value={billing.name}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g. John Doe"
                      />
                      {formErrors.name && <p className="text-red-500 text-[10px] font-semibold">{formErrors.name}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t("email")}</label>
                      <input
                        type="email"
                        name="email"
                        value={billing.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g. john@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-[10px] font-semibold">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t("phone")}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={billing.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g. 01712345678"
                      />
                      {formErrors.phone && <p className="text-red-500 text-[10px] font-semibold">{formErrors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t("company")}</label>
                      <input
                        type="text"
                        name="company"
                        value={billing.company}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Options Section */}
              <div className="bg-white dark:bg-[#0c101b] border border-border/85 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-border/40 pb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  {t("payment")}
                </h2>
                
                {/* bKash Radio Selector Box */}
                <div className="border-2 border-[#e2136e] bg-[#e2136e]/5 dark:bg-[#e2136e]/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#e2136e] flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e2136e]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">bKash Payment</h4>
                      <p className="text-[11px] text-muted-foreground">Pay securely via bKash Account, Verification Code & PIN</p>
                    </div>
                  </div>
                  {/* bKash SVG Logo */}
                  <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 shrink-0 flex items-center">
                    <svg width="85" height="24" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2L1 14H10V2Z" fill="#E2136E" />
                      <path d="M12 2V14H21L12 2Z" fill="#B10E5B" />
                      <path d="M10 16L1 28H10V16Z" fill="#E2136E" />
                      <path d="M12 16V28H21L12 16Z" fill="#B10E5B" />
                      <text x="28" y="23" fill="#E2136E" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">
                        bKash
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-[#0c101b] border border-border/85 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-border/40 pb-3 flex items-center gap-2">
                  {t("orderSummary")}
                </h2>
                
                {/* Items List */}
                <div className="divide-y divide-border/40 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const itemPrice = item.price + (item.extendSupport ? item.supportPrice : 0);
                    return (
                      <div key={item.id} className="py-3 flex justify-between gap-4 text-sm first:pt-0 last:pb-0">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
                          <p className="text-[10px] text-slate-500">
                            {item.licenseType === "regular" ? tCart("regular") : tCart("extended")}
                            {item.extendSupport && ` + ${tCart("support")}`}
                          </p>
                          <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white shrink-0">৳{(itemPrice * item.quantity * 120).toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Calculations */}
                <div className="border-t border-border/40 pt-4 space-y-2.5 text-sm font-medium">
                  <div className="flex justify-between text-slate-500">
                    <span>{tCart("subtotal")}</span>
                    <span className="text-slate-800 dark:text-slate-200">৳{(subtotal * 120).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>{t("tax")}</span>
                    <span className="text-slate-800 dark:text-slate-200">৳{(tax * 120).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold border-t border-border/40 pt-3">
                    <span className="text-slate-800 dark:text-white">{t("total")}</span>
                    <span className="text-[#e2136e]">৳{(total * 120).toFixed(0)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handlePayClick}
                  className="w-full h-12 bg-[#e2136e] hover:bg-[#c10e5b] text-white font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  {t("placeOrder")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* Simulated bKash PGW Modal Overlay */}
      {bkashModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#e2136e] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-stretch text-white animate-in zoom-in-95 duration-200">
            
            {/* bKash Logo Header */}
            <div className="bg-white py-4 px-8 flex justify-between items-center relative border-b border-slate-100">
              <svg width="105" height="30" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L1 14H10V2Z" fill="#E2136E" />
                <path d="M12 2V14H21L12 2Z" fill="#B10E5B" />
                <path d="M10 16L1 28H10V16Z" fill="#E2136E" />
                <path d="M12 16V28H21L12 16Z" fill="#B10E5B" />
                <text x="28" y="23" fill="#E2136E" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">
                  bKash
                </text>
              </svg>
              <button 
                onClick={() => setBkashModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Merchant / Payment Summary Banner */}
            <div className="bg-[#b10e5b] py-3.5 px-6 flex justify-between text-xs font-bold border-t border-white/10">
              <span className="opacity-90">Amount: ৳{(total * 120).toFixed(0)}</span>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 flex flex-col space-y-4">
              {bkashStep === "number" && (
                <div className="space-y-4">
                  <div className="space-y-1 text-center">
                    <h3 className="font-bold text-sm">{t("bkashNumber")}</h3>
                    <p className="text-[11px] opacity-75">Enter your active bKash personal wallet number</p>
                  </div>
                  <input
                    type="tel"
                    maxLength={11}
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-white text-slate-800 text-lg font-bold border-none focus:ring-4 focus:ring-white/20 outline-none"
                    placeholder={t("bkashPlaceholder")}
                  />
                </div>
              )}

              {bkashStep === "otp" && (
                <div className="space-y-4">
                  <div className="space-y-1 text-center">
                    <h3 className="font-bold text-sm">{t("bkashOtp")}</h3>
                    <p className="text-[11px] opacity-75">Enter the 6-digit OTP sent to your mobile</p>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={bkashOtp}
                    onChange={(e) => setBkashOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-white text-slate-800 text-lg font-bold tracking-widest border-none focus:ring-4 focus:ring-white/20 outline-none"
                    placeholder={t("otpPlaceholder")}
                  />
                </div>
              )}

              {bkashStep === "pin" && (
                <div className="space-y-4">
                  <div className="space-y-1 text-center">
                    <h3 className="font-bold text-sm">{t("bkashPin")}</h3>
                    <p className="text-[11px] opacity-75">Enter your secure 4-digit bKash PIN code</p>
                  </div>
                  <input
                    type="password"
                    maxLength={4}
                    value={bkashPin}
                    onChange={(e) => setBkashPin(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-white text-slate-800 text-lg font-bold tracking-widest border-none focus:ring-4 focus:ring-white/20 outline-none"
                    placeholder={t("pinPlaceholder")}
                  />
                </div>
              )}

              {bkashStep === "processing" && (
                <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-white" />
                  <p className="text-sm font-bold tracking-wide">{t("processing")}</p>
                </div>
              )}

              {/* bKash Errors */}
              {bkashError && (
                <p className="text-xs font-semibold text-center bg-white/20 py-2 px-3 rounded-lg border border-white/10 text-white animate-pulse">
                  {bkashError}
                </p>
              )}

              {/* bKash Actions */}
              {bkashStep !== "processing" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (bkashStep === "number") setBkashModal(false);
                      if (bkashStep === "otp") setBkashStep("number");
                      if (bkashStep === "pin") setBkashStep("otp");
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-white/20 text-xs font-bold hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    CLOSE
                  </button>
                  <button
                    onClick={handleBkashSubmit}
                    className="flex-1 py-2.5 bg-white text-[#e2136e] rounded-xl text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                  >
                    PROCEED
                  </button>
                </div>
              )}
            </div>

            {/* bKash Safety Banner */}
            <div className="bg-[#b10e5b] py-3 text-center text-[10px] opacity-80 border-t border-white/10">
              🔒 Safe & Secure simulated transaction
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
