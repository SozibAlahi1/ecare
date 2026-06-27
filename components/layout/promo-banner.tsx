"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { X, Flame } from "lucide-react";

interface PromoBannerProps {
  text: string;
  linkText: string;
  suffix: string;
  locale: string;
}

export default function PromoBanner({ text, linkText, suffix, locale }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 12, seconds: 51 });

  useEffect(() => {
    // Check if dismissed
    const isDismissed = localStorage.getItem("promo-banner-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }

    // Persistent target date
    let targetTime = localStorage.getItem("promo-banner-target");
    if (!targetTime) {
      // 48h 12m 51s from now
      const duration = (48 * 60 * 60 + 12 * 60 + 51) * 1000;
      targetTime = (Date.now() + duration).toString();
      localStorage.setItem("promo-banner-target", targetTime);
    }

    const targetDate = parseInt(targetTime, 10);

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsVisible(false);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("promo-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  // Formatting utility for digits to Bengali if needed
  const formatNumber = (num: number) => {
    const formatted = num.toString().padStart(2, "0");
    if (locale === "bn") {
      const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      return formatted.replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
    }
    return formatted;
  };

  const hoursLabel = locale === "bn" ? "ঘ" : "h";
  const minutesLabel = locale === "bn" ? "মি" : "m";
  const secondsLabel = locale === "bn" ? "সে" : "s";

  return (
    <div className="relative w-full bg-primary text-primary-foreground py-2.5 px-4 text-center text-xs md:text-sm font-semibold select-none flex items-center justify-center gap-1.5 overflow-hidden transition-all duration-300">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span>{text}</span>
        <Link href="/services" className="underline hover:opacity-90 transition-colors font-bold text-white">
          {linkText}
        </Link>
        <span className="flex items-center gap-1 font-bold text-yellow-300">
          <Flame className="w-4 h-4 fill-yellow-300 animate-pulse text-yellow-300 inline" />
          <span>{suffix}</span>
        </span>
        <div className="inline-flex gap-1 font-mono bg-black/20 dark:bg-white/15 px-2 py-0.5 rounded text-white text-[11px] md:text-xs">
          <span>{formatNumber(timeLeft.hours)}{hoursLabel}</span>
          <span>{formatNumber(timeLeft.minutes)}{minutesLabel}</span>
          <span>{formatNumber(timeLeft.seconds)}{secondsLabel}</span>
        </div>
      </div>
      <button 
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-all"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
