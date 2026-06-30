"use client";

import { useEffect, useState, useRef } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { User, LogOut, LayoutDashboard, Settings, Download, LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function AuthButton() {
  const t = useTranslations("Header");
  const tAuth = useTranslations("Auth");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadUser = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("ecare_user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  };

  useEffect(() => {
    loadUser();

    // Re-check when cart/auth events are dispatched
    window.addEventListener("ecare_cart_change", loadUser);
    
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("ecare_cart_change", loadUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ecare_user");
    // Clear user session cookie
    document.cookie = "user_session=; path=/; max-age=0";
    setUser(null);
    setIsOpen(false);
    window.dispatchEvent(new Event("ecare_cart_change"));
    router.push("/");
  };
  if (user) {
    const isAdmin = user.role === "admin" || user.email?.includes("admin");
    const dashboardLink = isAdmin ? "/admin/dashboard" : "/dashboard";

    return (
      <div 
        className="relative"
        ref={dropdownRef}
      >
        <button 
          className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white text-xs font-black uppercase select-none border border-primary/20 hover:scale-105 transition-all shadow-md cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user.name ? user.name.charAt(0) : "U"}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
              <p className="text-xs font-black text-slate-800 dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
            </div>
            
            <Link 
              href={dashboardLink}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
            </Link>
            
            <Link 
              href={isAdmin ? "/admin/pages" : "/admin/pages"}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              {locale === "bn" ? "সেটিংস" : "Settings"}
            </Link>
            
            <Link 
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {locale === "bn" ? "মাই ডাউনলোড" : "My Downloads"}
            </Link>
            
            <Link 
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              {locale === "bn" ? "সাপোর্ট" : "Support"}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors text-left cursor-pointer border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              {locale === "bn" ? "লগআউট" : "Logout"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="cursor-pointer flex items-center gap-1.5"
      asChild
    >
      <Link href="/login">
        <User className="w-4 h-4" />
        {t("login")}
      </Link>
    </Button>
  );
}
