"use client";

import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Trash2, Plus, Minus, X, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getCartItems, removeFromCart, updateCartQuantity, CartItem } from "@/lib/cart";
import { useTranslations } from "next-intl";

export default function CartBadge() {
  const t = useTranslations("Cart");
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadCart = () => {
    setItems(getCartItems());
  };

  useEffect(() => {
    loadCart();

    // Listen to changes in cart from other components
    window.addEventListener("ecare_cart_change", loadCart);
    return () => {
      window.removeEventListener("ecare_cart_change", loadCart);
    };
  }, []);

  // Handle click outside to close mini cart
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => {
    let price = item.price;
    if (item.extendSupport) {
      price += item.supportPrice;
    }
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95 transition-all cursor-pointer"
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0c101b] border border-border/80 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5 mb-3">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              {t("title")}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <ShoppingCart className="w-10 h-10 mx-auto opacity-20 mb-2" />
              {t("empty")}
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {items.map((item) => {
                  const itemPrice = item.price + (item.extendSupport ? item.supportPrice : 0);
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-3 border-b border-border/40 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-500">
                          <span>
                            {item.licenseType === "regular" ? t("regular") : t("extended")}
                          </span>
                          {item.extendSupport && (
                            <span className="text-primary font-medium">
                              + {t("support")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-lg bg-slate-50 dark:bg-slate-800/40">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 dark:text-white w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                            ৳{(itemPrice * item.quantity * 120).toFixed(0)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="self-start p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border/40 mt-3 pt-3 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">{t("subtotal")}</span>
                  <span className="font-extrabold text-slate-800 dark:text-white text-base">
                    ৳{(subtotal * 120).toFixed(0)}
                  </span>
                </div>
                <Button
                  asChild
                  className="w-full text-xs font-bold uppercase tracking-wider h-10 rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout">
                    {t("checkout")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
