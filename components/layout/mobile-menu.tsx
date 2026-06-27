"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import * as LucideIcons from "lucide-react";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
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
  GraduationCap 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  items: MenuItem[];
  dbProducts?: any[];
}

export default function MobileMenu({ items, dbProducts = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isServicesOpen, setIsServicesOpen] = React.useState(false);
  const t = useTranslations("Header");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const products = [
    {
      titleKey: "dokan_title",
      descKey: "dokan_desc",
      href: "/services/dokan-multivendor",
      iconBg: "from-pink-500 to-purple-600",
      Icon: Store,
    },
    {
      titleKey: "wpuf_title",
      descKey: "wpuf_desc",
      href: "/services/wp-user-frontend-pro",
      iconBg: "from-emerald-400 to-teal-600",
      Icon: UserCheck,
    },
    {
      titleKey: "happy_title",
      descKey: "happy_desc",
      href: "/services/happy-addons",
      iconBg: "from-purple-500 to-pink-500",
      Icon: Smile,
    },
    {
      titleKey: "wppm_title",
      descKey: "wppm_desc",
      href: "/services/wp-project-manager-pro",
      iconBg: "from-violet-500 to-indigo-600",
      Icon: FolderKanban,
    },
    {
      titleKey: "wemail_title",
      descKey: "wemail_desc",
      href: "/services/wemail",
      iconBg: "from-blue-400 to-sky-600",
      Icon: Mail,
    },
    {
      titleKey: "wperp_title",
      descKey: "wperp_desc",
      href: "/services/wp-erp",
      iconBg: "from-cyan-500 to-blue-600",
      Icon: Building2,
    },
    {
      titleKey: "appsero_title",
      descKey: "appsero_desc",
      href: "/services/appsero",
      iconBg: "from-indigo-500 to-blue-600",
      Icon: BarChart3,
    },
    {
      titleKey: "wepos_title",
      descKey: "wepos_desc",
      href: "/services/wepos",
      iconBg: "from-sky-500 to-indigo-500",
      Icon: Tablet,
    },
    {
      titleKey: "wedocs_title",
      descKey: "wedocs_desc",
      href: "/services/wedocs",
      iconBg: "from-teal-500 to-cyan-500",
      Icon: FileText,
      isNew: true,
    },
    {
      titleKey: "flywp_title",
      descKey: "flywp_desc",
      href: "/services/flywp",
      iconBg: "from-purple-600 to-indigo-600",
      Icon: Send,
    },
    {
      titleKey: "inboxwp_title",
      descKey: "inboxwp_desc",
      href: "/services/inboxwp",
      iconBg: "from-blue-600 to-cyan-600",
      Icon: Inbox,
    },
    {
      titleKey: "klasio_title",
      descKey: "klasio_desc",
      href: "/services/klasio",
      iconBg: "from-blue-500 to-indigo-700",
      Icon: GraduationCap,
      isNew: true,
    },
    {
      titleKey: "ezy_checkout_title",
      descKey: "ezy_checkout_desc",
      href: "/ezy-checkout",
      iconBg: "",
      iconUrl: "/ezy-checkout-logo.png",
    },
  ];

  const menuContent = (
    <div 
      className={cn(
        "fixed inset-x-0 bottom-0 top-16 z-[9999] bg-white dark:bg-[#0b0f19] backdrop-blur-lg flex flex-col p-6 transition-all duration-300 ease-in-out border-t border-border/40 overflow-y-auto",
        isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
      onClick={() => setIsOpen(false)}
    >
      <nav 
        className="flex flex-col space-y-5 text-lg font-medium text-muted-foreground pt-4 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, index) => {
          const isServices = item.href === "/services";

          if (isServices) {
            return (
              <div key={index} className="border-b border-border/40 pb-2">
                {/* Accordion Trigger */}
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full py-3 hover:text-foreground transition-colors flex items-center justify-between text-left font-medium text-lg text-muted-foreground focus:outline-none cursor-pointer"
                >
                  <span className={cn(isServicesOpen && "text-primary font-bold")}>
                    {item.label}
                  </span>
                  <div className="h-7 w-7 rounded-lg border border-border/60 flex items-center justify-center bg-slate-50 dark:bg-slate-800/40">
                    {isServicesOpen ? (
                      <ChevronUp className="w-4 h-4 text-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Accordion Content (Products List) */}
                <div
                  className={cn(
                    "grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out",
                    isServicesOpen ? "max-h-[1400px] mt-2 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  )}
                >
                  {((dbProducts && dbProducts.length > 0) ? dbProducts : products).map((prod: any, pIdx) => {
                    const isDbProd = !!prod._id;
                    const isExternal = isDbProd 
                      ? (prod.productType === "external" || (prod._id && prod.productType !== "internal"))
                      : false;
                    const href = isDbProd 
                      ? (isExternal ? (prod.demoUrl || "#") : `/products/${prod.slug}`)
                      : prod.href;
                    const title = isDbProd ? prod.title : t(prod.titleKey);
                    const desc = isDbProd ? prod.excerpt : t(prod.descKey);
                    const linkProps = isExternal 
                      ? { href, target: "_blank", rel: "noopener noreferrer" } 
                      : { href };
                    const LinkComponent = isExternal ? "a" : Link;

                    const totalItems = (dbProducts && dbProducts.length > 0) ? dbProducts.length : products.length;

                    return (
                      <LinkComponent
                        key={pIdx}
                        {...linkProps}
                        className={cn(
                          "flex items-start gap-3 py-4 text-left transition-colors active:scale-[0.99] transition-all",
                          pIdx < totalItems - 1 && "border-b border-border/20"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shadow-sm shrink-0 overflow-hidden",
                          (isDbProd ? prod.icon : prod.iconUrl) ? "bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800" : `bg-gradient-to-br ${prod.iconBg || 'from-pink-500 to-purple-600'} text-white`
                        )}>
                          {(() => {
                            const iconVal = isDbProd ? (prod.icon || "") : (prod.iconUrl || "");
                            if (!iconVal) {
                              const IconComp = prod.Icon || Store;
                              return <IconComp className="w-5 h-5" />;
                            }
                            if (iconVal.startsWith("/") || iconVal.startsWith("http")) {
                              return <img src={iconVal} alt="" className="w-full h-full object-cover" />;
                            }
                            const lookupKey = iconVal.charAt(0).toUpperCase() + iconVal.slice(1);
                            const IconComponent = (LucideIcons as any)[lookupKey] || (LucideIcons as any)[iconVal] || Store;
                            return <IconComponent className="w-5 h-5" />;
                          })()}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5 leading-none">
                            {title}
                            {prod.isNew && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                                New
                              </span>
                            )}
                          </h4>
                          {desc && (
                            <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                              {desc}
                            </p>
                          )}
                        </div>
                      </LinkComponent>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "py-3 border-b border-border/40 hover:text-foreground transition-colors text-left flex items-center justify-between",
                item.href === "/blog" && "text-primary font-bold border-b-primary/25"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>{item.label}</span>
              <span className="text-xs text-muted-foreground opacity-50">→</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -mr-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all focus:outline-none rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer"
        aria-label="Toggle Menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mounted && typeof document !== "undefined"
        ? createPortal(menuContent, document.body)
        : null}
    </div>
  );
}
