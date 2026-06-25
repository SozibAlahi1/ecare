"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { 
  Sparkles, CheckCircle2, ChevronDown, ArrowRight, Play, Cpu, 
  Layers, ShoppingBag, ShieldCheck, Check, Clock, Star, HelpCircle,
  ChevronLeft, ChevronRight, User, Smartphone, Zap, Calendar, History
} from "lucide-react";

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || HelpCircle;
};

export default function EzyCheckoutClient({ initialData }: { initialData?: any }) {
  const t = useTranslations("EzyCheckout");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const defaultFeatures = [
    { icon: ShoppingBag, title: t("feat1"), desc: t("feat1Desc"), color: "bg-primary/10 text-primary" },
    { icon: Sparkles, title: t("feat2"), desc: t("feat2Desc"), color: "bg-primary/10 text-primary" },
    { icon: ShieldCheck, title: t("feat3"), desc: t("feat3Desc"), color: "bg-primary/10 text-primary" },
    { icon: Cpu, title: t("feat4"), desc: t("feat4Desc"), color: "bg-primary/10 text-primary" },
    { icon: Layers, title: t("feat5"), desc: t("feat5Desc"), color: "bg-primary/10 text-primary" },
    { icon: Clock, title: t("feat6"), desc: t("feat6Desc"), color: "bg-primary/10 text-primary" },
  ];

  const featuresList = initialData?.featuresList && initialData.featuresList.length > 0
    ? initialData.featuresList.map((item: any) => ({
        icon: getIconComponent(item.icon),
        title: item.title,
        desc: item.desc,
        color: "bg-primary/10 text-primary"
      }))
    : defaultFeatures;

  const defaultFaqs = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") }
  ];

  const faqsList = initialData?.faqsList && initialData.faqsList.length > 0
    ? initialData.faqsList
    : defaultFaqs;

  const maxIndex = Math.max(0, featuresList.length - itemsPerView);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay slider logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="overflow-hidden bg-[#fafbfe] dark:bg-transparent text-slate-800 dark:text-slate-200">
      
      {/* 1. Hero Section (Center Hero Layout inspired by Appix) */}
      <section className="relative pt-20 pb-32 bg-gradient-to-b from-[#eef2ff]/80 to-[#fafbfe] dark:from-[#0a0f1d] dark:to-transparent flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Animated background glowing spheres */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-40 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none"
        />

        <Container className="max-w-4xl relative z-10 flex flex-col items-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-extrabold uppercase tracking-widest mb-6 border border-primary/25 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {initialData?.heroBadge || "WooCommerce PopUp Checkout"}
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-800 dark:text-white leading-tight"
          >
            {initialData?.heroTitle || t("heroTitle")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed"
          >
            {initialData?.heroSub || t("heroSub")}
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4 items-center justify-center"
          >
            <Button 
              asChild
              className="px-8 h-13 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider text-xs shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <a href="#">
                <Play className="w-4 h-4 fill-white" />
                {initialData?.heroCtaText || t("livePreview")}
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="px-8 h-13 rounded-2xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-xs cursor-pointer active:scale-95"
            >
              {t("download")}
            </Button>
          </motion.div>

          {/* Hero Preview Image (Clean raw image view, no container box or borders) */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="w-full mt-16 max-w-3xl aspect-[16/10] relative"
          >
            <Image
              src={initialData?.heroImage || "/heroimage-transparent.png"}
              alt="Ezy Checkout Hero Preview"
              fill
              sizes="(max-width: 1200px) 100vw, 768px"
              className="object-contain"
              priority
            />
          </motion.div>
        </Container>
      </section>

      {/* 2. Key Features Showcase Grid (Animated Slider Section) */}
      <section className="py-24 bg-slate-50 dark:bg-[#0a0f1d] text-slate-800 dark:text-white relative transition-colors duration-300">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <Container className="relative z-10">
          
          {/* Slider Container Row Wrapped in a Large Card */}
          <div className="-mt-24 sm:-mt-36 relative z-20 p-6 sm:p-12">
            
            {/* Section Headers outside the Card Container */}
            <div className="text-center space-y-3 mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider">
                {initialData?.featuresBadge || t("uniqueFeatures")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white leading-tight">
                {initialData?.featuresTitle || t("powerfulFeatures")}
              </h2>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuresList.map((feature: any, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  className="bg-slate-50 dark:bg-slate-950/40 backdrop-blur-md text-slate-800 dark:text-white rounded-2xl p-8 min-h-[260px] flex flex-col justify-start text-left border border-slate-200/60 dark:border-slate-800/40 transition-colors duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/15 text-primary flex items-center justify-center mb-8 shadow-inner">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </Container>
      </section>

      {/* 2.5 Product Overview / Showcase Section (New Section) */}
      <section className="py-24 bg-[#fdfbf7] dark:bg-[#070b15] text-slate-800 dark:text-slate-200 relative overflow-hidden transition-colors duration-300">
        {/* Glow effect */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <Container className="relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
              {initialData?.aboutBadge || t("aboutUs")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              {initialData?.aboutTitle || t("appInterfaceHeader")}
            </h2>
          </div>

          {/* Large Centered Image/Video Showcase */}
          <div className="flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-5xl rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0c101b] p-1.5 shadow-sm"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-slate-900">
                {(() => {
                  const mediaUrl = initialData?.aboutImage || "https://assets.mixkit.co/videos/preview/mixkit-dashboard-on-a-computer-screen-40742-large.mp4";
                  const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") || mediaUrl.endsWith(".ogg") || mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be") || mediaUrl.includes("vimeo.com") || mediaUrl.includes("assets.mixkit.co");

                  if (isVideo) {
                    if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be") || mediaUrl.includes("vimeo.com")) {
                      let embedUrl = mediaUrl;
                      if (mediaUrl.includes("youtube.com/watch?v=")) {
                        embedUrl = mediaUrl.replace("youtube.com/watch?v=", "youtube.com/embed/");
                      } else if (mediaUrl.includes("youtu.be/")) {
                        embedUrl = mediaUrl.replace("youtu.be/", "youtube.com/embed/");
                      }
                      return (
                        <iframe
                          src={embedUrl}
                          title="Ezy Checkout Showcase Video"
                          className="w-full h-full border-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }
                    return (
                      <video
                        src={mediaUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    );
                  }

                  return (
                    <Image
                      src={mediaUrl}
                      alt="Ezy Checkout Admin Dashboard Screenshot"
                      fill
                      sizes="(max-width: 1200px) 100vw, 1024px"
                      className="object-contain"
                      priority
                    />
                  );
                })()}
              </div>
            </motion.div>
          </div>

        </Container>
      </section>

      {/* 3. Premium Services Section (Replacing How It Works) */}
      <section className="py-24 bg-slate-50 dark:bg-[#070b15] text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-600/5 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <Container className="relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20 flex flex-col items-center">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold tracking-wide">
              {t("servicesTab")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white leading-[1.15] tracking-tight">
              {t("premiumServicesHeader")}
            </h2>
          </div>
 
          {/* Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side Content (5 cols) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-center items-start text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold shadow-sm">
                <svg className="w-3.5 h-3.5 fill-primary" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
                </svg>
                {t("popupCheckoutBadge")}
              </span>
              
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight tracking-tight">
                {t("quickCheckoutHeader")}
              </h3>
              
              <p className="text-sm text-[#475569] dark:text-slate-400 leading-relaxed font-medium">
                {t("quickCheckoutDesc")}
              </p>
 
              {/* Service list items */}
              <div className="space-y-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-white">{t("instantCheckoutTitle")}</h4>
                    <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1 font-medium">{t("instantCheckoutDesc")}</p>
                  </div>
                </div>
 
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-white">{t("couponShippingTitle")}</h4>
                    <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1 font-medium">{t("couponShippingDesc")}</p>
                  </div>
                </div>
              </div>
 
              {/* Button with offset double shadow look */}
              <button className="px-8 py-3.5 rounded-2xl bg-primary text-white font-extrabold text-sm tracking-wide shadow-[4px_4px_0px_var(--color-primary-hover)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
                {t("downloadBadge")}
              </button>
            </div>
 
            {/* Right Side Mockup Graphic (7 cols) */}
            <div className="lg:col-span-7 flex justify-center items-center relative py-2">
              {/* Feature image preview */}
              <div className="w-full z-10">
                <Image
                  src="/ezy-checkout-hero.png"
                  alt="Ezy Checkout Feature Showcase"
                  width={1051}
                  height={856}
                  className="w-full h-auto rounded-2xl border border-slate-100 dark:border-slate-800"
                  priority
                />
              </div>
            </div>
 
          </div>
 
        </Container>
      </section>

      {/* 3.5. Project Management / Schedule Meeting Section */}
      <section className="py-24 bg-[#fdfbf7] dark:bg-[#0c101b] text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-emerald-600/5 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side: Mockup Graphic (Col span 7) */}
            <div className="lg:col-span-7 flex justify-center items-center relative">
              <div className="w-full max-w-[680px] z-10">
                <Image
                  src="/ezy-checkout-hero.png"
                  alt="Ezy Checkout Schedule Mockup"
                  width={1051}
                  height={856}
                  className="w-full h-auto rounded-xl border border-slate-100 dark:border-slate-800"
                  priority
                />
              </div>
            </div>

            {/* Right Side: Content (Col span 5) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-center items-start text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                {t("scheduleMeeting")}
              </span>
              
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-white leading-tight tracking-tight">
                {t("manageTitle")}
              </h3>
              
              <p className="text-sm text-[#475569] dark:text-slate-400 leading-relaxed font-medium">
                {t("manageSub")}
              </p>

              {/* Service list items */}
              <div className="space-y-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{t("managePoint1")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{t("managePoint2")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{t("managePoint3")}</p>
                  </div>
                </div>
              </div>

              {/* Button with offset double shadow look */}
              <button className="px-8 py-3.5 rounded-2xl bg-primary text-white font-extrabold text-sm tracking-wide shadow-[4px_4px_0px_var(--color-primary-hover)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
                {t("download")}
              </button>
            </div>

          </div>
        </Container>
      </section>

      {/* 3.6. Transaction History / Task Creation Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#070b15] text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-indigo-600/5 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side: Content (Col span 5) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-center items-start text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold shadow-sm">
                <History className="w-3.5 h-3.5" />
                {t("historyBadge")}
              </span>
              
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-white leading-tight tracking-tight">
                {t("historyTitle")}
              </h3>
              
              <p className="text-sm text-[#475569] dark:text-slate-400 leading-relaxed font-medium">
                {t("historySub")}
              </p>

              {/* Service list items */}
              <div className="space-y-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{t("historyPoint1")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{t("historyPoint2")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{t("historyPoint3")}</p>
                  </div>
                </div>
              </div>

              {/* Button with offset double shadow look */}
              <button className="px-8 py-3.5 rounded-2xl bg-primary text-white font-extrabold text-sm tracking-wide shadow-[4px_4px_0px_var(--color-primary-hover)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
                {t("startFreeTrial")}
              </button>
            </div>

            {/* Right Side: Mockup Graphic (Col span 7) */}
            <div className="lg:col-span-7 flex justify-center items-center relative">
              <div className="w-full z-10">
                <Image
                  src="/ezy-checkout-hero.png"
                  alt="Ezy Checkout Feature Showcase"
                  width={1051}
                  height={856}
                  className="w-full h-auto rounded-3xl border border-slate-100 dark:border-slate-800"
                  priority
                />
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 3.7. Sticky Testimonial Section */}
      <section className="py-24 bg-[#fdfbf7] dark:bg-[#0c101b] text-slate-800 dark:text-slate-200 transition-colors duration-300 relative">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Side: Sticky Info Card (Col span 5) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 flex flex-col justify-center items-start text-left self-start">
              <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold tracking-wide shadow-sm">
                {t("testimonialBadge")}
              </span>
              
              <h3 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white leading-[1.15] tracking-tight">
                {t("testimonialTitle")}
              </h3>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 stroke-amber-500" />
                  ))}
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2 mt-0.5">
                    {t("testimonialRating")}
                  </span>
                </div>
                <a href="#" className="inline-flex items-center text-sm font-extrabold text-primary hover:underline">
                  {t("testimonialTotal")} <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
 
              {/* Smile Curve Vector Line */}
              <div className="pt-6">
                <svg className="w-24 h-12 text-primary" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left eye */}
                  <circle cx="30" cy="18" r="4.5" fill="currentColor" />
                  {/* Right eye */}
                  <circle cx="65" cy="18" r="4.5" fill="currentColor" />
                  {/* Smile curve */}
                  <path d="M15 28C32 44 60 44 78 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Right Side: Scrollable Testimonial Cards List (Col span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1 */}
              <div className="bg-white dark:bg-[#070b15] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                      <Image
                        src="/static/images/team/sojib.jpg"
                        alt={t("testName1")}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight">{t("testName1")}</h4>
                      <p className="text-xs text-[#64748b] dark:text-slate-400 font-medium mt-0.5">{t("testTitle1")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#475569] dark:text-slate-400 leading-relaxed font-medium">
                  {t("testText1")}
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-[#070b15] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                      <Image
                        src="/static/images/team/josim.jpg"
                        alt={t("testName2")}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight">{t("testName2")}</h4>
                      <p className="text-xs text-[#64748b] dark:text-slate-400 font-medium mt-0.5">{t("testTitle2")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#475569] dark:text-slate-400 leading-relaxed font-medium">
                  {t("testText2")}
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-[#070b15] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                      <Image
                        src="/static/images/team/maruf.jpg"
                        alt={t("testName3")}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight">{t("testName3")}</h4>
                      <p className="text-xs text-[#64748b] dark:text-slate-400 font-medium mt-0.5">{t("testTitle3")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#475569] dark:text-slate-400 leading-relaxed font-medium">
                  {t("testText3")}
                </p>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* 4. Pricing Plans */}
      <section className="py-24 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 dark:bg-primary/5 blur-[130px] rounded-full pointer-events-none" />

        <Container className="relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
              {initialData?.pricingTitle || t("pricingTitle")}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
              {initialData?.pricingSub || t("pricingSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-[#0c101b] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-md hover:shadow-xl flex flex-col justify-between transition-all duration-300"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                    {initialData?.planFree || t("planFree")}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed min-h-[40px]">
                    {initialData?.planFreeDesc || t("planFreeDesc")}
                  </p>
                </div>
                
                <div className="flex items-baseline text-slate-800 dark:text-white py-2 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    ${initialData ? initialData.freePrice : "0"}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 font-normal ml-2">
                    / {initialData?.freeLifetime || t("freeLifetime")}
                  </span>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{initialData?.freeFeature1 || t("freeFeature1")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{initialData?.freeFeature2 || t("freeFeature2")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{initialData?.freeFeature3 || t("freeFeature3")}</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mt-8 cursor-pointer">
                {initialData?.downloadNow || t("downloadNow")}
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-[#0c101b] border-2 border-primary rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between relative transition-all duration-300"
            >
              {/* Popular tag */}
              <span className="absolute -top-3 right-8 px-3.5 py-1 rounded-full bg-primary text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse-slow">
                {t("recTag")}
              </span>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                    {initialData?.planPro || t("planPro")}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed min-h-[40px]">
                    {initialData?.planProDesc || t("planProDesc")}
                  </p>
                </div>

                <div className="flex items-baseline text-slate-800 dark:text-white py-2 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    ${initialData ? initialData.proPrice : "24"}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 font-normal ml-2">
                    / {initialData?.proLifetime || t("proLifetime")}
                  </span>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{initialData?.proFeature1 || t("proFeature1")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{initialData?.proFeature2 || t("proFeature2")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{initialData?.proFeature3 || t("proFeature3")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{initialData?.proFeature4 || t("proFeature4")}</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all mt-8 cursor-pointer">
                {initialData?.getPro || t("getPro")}
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 5. Interactive FAQ Accordion */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/10 border-t border-border">
        <Container className="max-w-3xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white">
              {initialData?.faqTitle || t("faqTitle")}
            </h2>
          </div>

          <div className="space-y-4">
            {faqsList.map((faq: any, i: number) => (
              <div 
                key={i} 
                className="bg-white dark:bg-[#0c101b] border border-border/80 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between font-extrabold text-sm sm:text-base text-slate-800 dark:text-white hover:text-primary text-left cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4.5 h-4.5 text-slate-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-13">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Container>
      </section>
      
    </div>
  );
}
