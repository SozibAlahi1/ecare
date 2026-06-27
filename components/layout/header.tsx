import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import dbConnect from "@/lib/db";
import { Portfolio } from "@/lib/models";
import * as LucideIcons from "lucide-react";
import { 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Store, 
  UserCheck, 
  Smile, 
  FolderKanban, 
  Mail, 
  Building2, 
  BarChart3, 
  Tablet, 
  FileText, 
  Send, 
  Inbox, 
  GraduationCap, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LocaleSwitcher from "./locale-switcher";
import ThemeToggle from "./theme-toggle";
import MobileMenu from "./mobile-menu";
import PromoBanner from "./promo-banner";
import CartBadge from "./cart-badge";
import AuthButton from "./auth-button";

export default async function Header() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Header" });
  const tPromo = await getTranslations({ locale, namespace: "PromoBanner" });
  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get("theme")?.value as "light" | "dark" | "system") || "system";

  const menuItems = [
    { label: t("home"), href: "/" },
    { label: t("services"), href: "/services" },
    { label: t("portfolio"), href: "/products" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
    { label: t("blog"), href: "/blog" },
  ];

  let dbProducts: any[] = [];
  try {
    await dbConnect();
    const rawProducts = await Portfolio.find({ locale: locale as "en" | "bn" }).sort({ createdAt: 1 }).lean();
    dbProducts = JSON.parse(JSON.stringify(rawProducts));
  } catch (err) {
    console.error("Failed to load header products from DB:", err);
  }

  return (
    <>
      <PromoBanner 
        text={tPromo("text")}
        linkText={tPromo("linkText")}
        suffix={tPromo("suffix")}
        locale={locale}
      />
      <header className="sticky top-0 z-40 w-full border-b border-border">
        {/* Background layer with backdrop blur separated to prevent creating a containing block for fixed elements */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md -z-10 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 active:scale-95 transition-all"
            >
              <div className="relative h-7 w-28">
                <Image
                  src="/logo.png"
                  alt="Ecare Logo"
                  fill
                  className="object-contain dark:invert"
                  sizes="120px"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground h-full">
            <Link
              href="/"
              className="hover:text-foreground transition-colors py-5"
            >
              {t("home")}
            </Link>

            <Link
              href="/services"
              className="hover:text-foreground transition-colors py-5"
            >
              {t("services")}
            </Link>

            {/* Portfolio / Products hover mega menu dropdown */}
            <div className="relative group h-full flex items-center">
              <Link
                href="/products"
                className="hover:text-foreground transition-colors flex items-center gap-1 py-5"
              >
                {t("portfolio")}
                <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              {/* Mega Dropdown Container */}
              <div className="absolute top-full left-1/2 -translate-x-[35%] w-[920px] bg-white dark:bg-[#0c101b] border border-border/50 rounded-b-2xl rounded-t-none shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-6">
                <div className="grid grid-cols-4 gap-x-6 gap-y-5">
                  {dbProducts.map((prod: any, index: number) => {
                    const isExternal = prod.productType === "external" || (prod._id && prod.productType !== "internal");
                    const href = isExternal ? (prod.demoUrl || "#") : `/products/${prod.slug}`;
                    const LinkComponent = isExternal ? "a" : Link;
                    const linkProps = isExternal 
                      ? { href, target: "_blank", rel: "noopener noreferrer" } 
                      : { href };

                    return (
                      <LinkComponent
                        key={index}
                        {...linkProps}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group/item"
                      >
                        {(() => {
                          const iconVal = prod.icon || "";
                          if (!iconVal) {
                            return (
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
                                <Store className="w-4.5 h-4.5" />
                              </div>
                            );
                          }
                          if (iconVal.startsWith("/") || iconVal.startsWith("http")) {
                            return (
                              <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                                <img src={iconVal} alt={prod.title} className="w-full h-full object-cover" />
                              </div>
                            );
                          }
                          const lookupKey = iconVal.charAt(0).toUpperCase() + iconVal.slice(1);
                          const IconComponent = (LucideIcons as any)[lookupKey] || (LucideIcons as any)[iconVal] || Store;
                          return (
                            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-foreground/80 shadow-xs shrink-0 border border-slate-200 dark:border-slate-800">
                              <IconComponent className="w-4.5 h-4.5" />
                            </div>
                          );
                        })()}
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                             {prod.title}
                           </h4>
                          {prod.excerpt && (
                            <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                              {prod.excerpt}
                            </p>
                          )}
                        </div>
                      </LinkComponent>
                    );
                  })}
                </div>
                
                {/* View all products footer */}
                <div className="mt-6 pt-4 border-t border-border/40 flex justify-end">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary hover:text-primary-hover bg-primary/10 dark:bg-primary/20 rounded-xl transition-colors active:scale-95 transition-all"
                  >
                    {t("view_all_products")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors py-5"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors py-5"
            >
              {t("contact")}
            </Link>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors py-5"
            >
              {t("blog")}
            </Link>
          </nav>

          {/* Switchers & Actions */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle initialTheme={initialTheme} />

            {/* Cart & Login (Desktop only) */}
            <div className="hidden md:flex items-center gap-3 ml-1">
              <AuthButton />
              <CartBadge />
            </div>

            <MobileMenu items={menuItems} dbProducts={dbProducts} />
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
