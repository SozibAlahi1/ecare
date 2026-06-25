"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Mail, Check, Copy } from "lucide-react";

import { usePathname } from "next/navigation";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
  delay: number;
  color: string;
  isStar: boolean;
}

export default function OfferPopup() {
  const pathname = usePathname();
  const t = useTranslations("OfferPopup");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Dynamic promo configuration
  const [promo, setPromo] = useState({
    title: "",
    subtitle: "",
    discountPercent: "20",
    discountCode: "GROWTH20",
    isActive: "true"
  });

  // Prevent popup on admin routes
  const isAdminRoute = pathname?.includes("/admin");

  useEffect(() => {
    if (isAdminRoute) return;

    let timer: NodeJS.Timeout;

    const fetchSettingsAndCheckPopup = async () => {
      try {
        const res = await fetch("/api/admin/pages/offer_popup");
        const data = await res.json();
        if (data.success && data.data) {
          const content = data.data.content;
          const currentLang = pathname?.startsWith("/bn") ? "bn" : "en";
          let localized: any = {};
          try {
            localized = JSON.parse(content[currentLang] || "{}");
          } catch (e) {
            localized = {};
          }

          const promoData = {
            title: localized.title || t("title"),
            subtitle: localized.subtitle || t("subtitle"),
            discountPercent: localized.discountPercent || "20",
            discountCode: localized.discountCode || "GROWTH20",
            isActive: localized.isActive ?? "true"
          };

          setPromo(promoData);

          // Default acting behavior: check localStorage so it doesn't pop up repeatedly
          if (promoData.isActive !== "false") {
            const dismissedUntil = localStorage.getItem("welcome_offer_dismissed_until");
            const now = Date.now();
            const shouldShow = !dismissedUntil || now >= parseInt(dismissedUntil);

            if (shouldShow) {
              timer = setTimeout(() => {
                setIsOpen(true);
              }, 4000); // 4 seconds delay for premium experience
            }
          }
        }
      } catch (err) {
        console.error("Failed to load welcome offer popup details:", err);
      }
    };

    fetchSettingsAndCheckPopup();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pathname, isAdminRoute]);

  if (isAdminRoute) {
    return null;
  }

  const handleClose = (openState: boolean) => {
    setIsOpen(openState);
    if (!openState) {
      // Set dismissal expiration to 5 hours in the future (5 * 60 * 60 * 1000 ms)
      const expireTime = Date.now() + 5 * 60 * 60 * 1000;
      localStorage.setItem("welcome_offer_dismissed_until", expireTime.toString());
      setIsSubmitted(false);
      setParticles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Also save dismissal cooldown on successful subscription submission
    const expireTime = Date.now() + 5 * 60 * 60 * 1000;
    localStorage.setItem("welcome_offer_dismissed_until", expireTime.toString());

    try {
      // Save subscription dynamically to DB contacts collection
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: email,
          subject: "Newsletter Subscription Request",
          message: `This user subscribed to the newsletter using the dynamic welcome popup offer. Required discount code: ${promo.discountCode}.`,
          supportType: "newsletter",
          product: `Discount ${promo.discountPercent}%`
        })
      });
    } catch (err) {
      console.error("Failed to register newsletter subscription in database:", err);
    }

    // Generate particles for full screen explosion (85 particles)
    const newParticles = Array.from({ length: 85 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 450; // Spread out across the screen
      return {
        id: i,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        rotate: Math.random() * 360,
        size: 8 + Math.random() * 16,
        delay: Math.random() * 0.25,
        color: ["#FBBF24", "#34D399", "#60A5FA", "#F472B6", "#A78BFA", "#F59E0B", "#10B981"][Math.floor(Math.random() * 7)],
        isStar: Math.random() > 0.4
      };
    });
    setParticles(newParticles);
    setIsSubmitted(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promo.discountCode || "GROWTH20");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      {/* Self-contained CSS injection for cross-environment compatibility */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-particle {
          0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(calc(var(--x) * 0.25), calc(var(--y) * 0.25)) scale(1.2) rotate(calc(var(--rotate) * 0.25));
          }
          100% {
            transform: translate(var(--x), calc(var(--y) + 300px)) scale(0.2) rotate(var(--rotate));
            opacity: 0;
          }
        }
        .sparkle-burst {
          animation: float-particle 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}} />

      {/* Explosion Particle Emitter Container (Fixed to the entire viewport, outside DialogContent to prevent overflow clipping) */}
      {isSubmitted && (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center w-screen h-screen">
          <div className="relative w-1 h-1">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute sparkle-burst"
                style={{
                  "--x": `${p.x}px`,
                  "--y": `${p.y}px`,
                  "--rotate": `${p.rotate}deg`,
                  animationDelay: `${p.delay}s`,
                  left: 0,
                  top: 0,
                } as React.CSSProperties}
              >
                {p.isStar ? (
                  <Sparkles 
                    style={{ width: p.size, height: p.size, color: p.color, fill: p.color }} 
                    className="drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)]"
                  />
                ) : (
                  <div 
                    style={{ 
                      width: p.size / 2, 
                      height: p.size / 2, 
                      backgroundColor: p.color,
                      borderRadius: "50%"
                    }}
                    className="drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-gradient-to-b from-primary to-secondary text-white rounded-2xl shadow-2xl">
          <div className="relative p-6 sm:p-8 flex flex-col items-center text-center">
            {/* Decorative background gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-72 h-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

            {/* Gift Icon Badge */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-inner animate-bounce">
              <Gift className="h-8 w-8 text-accent" />
            </div>

            {!isSubmitted ? (
              <>
                <DialogHeader className="space-y-3 mb-6">
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl font-extrabold text-white flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-5 h-5 text-accent fill-accent shrink-0 animate-pulse" />
                    {promo.title || t("title")}
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                    {promo.subtitle || t("subtitle")}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="w-full space-y-3 relative z-10">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type="email"
                      required
                      placeholder={t("placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-accent hover:bg-accent-hover text-accent-foreground font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/20"
                  >
                    {t("button")}
                  </Button>
                </form>
              </>
            ) : (
              <div className="w-full space-y-6 relative z-10 py-2">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl font-extrabold text-white">
                    {t("successTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                    {t("successSubtitle")}
                  </DialogDescription>
                </DialogHeader>

                {/* Promo Code Box */}
                <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl p-4 font-mono text-xl sm:text-2xl font-bold tracking-widest text-center shadow-inner relative overflow-hidden group">
                  <span className="text-accent select-all mx-auto pl-6">{promo.discountCode || "GROWTH20"}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white shrink-0 cursor-pointer"
                    title="Copy code"
                  >
                    {isCopied ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <Button
                  onClick={() => handleClose(false)}
                  className="w-full py-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
