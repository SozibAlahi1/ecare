"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Testimonial {
  author: string;
  company: string;
  quote: string;
  rating?: number;
  avatar?: string;
  videoUrl?: string;
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

const getYouTubeId = (url: string) => {
  if (!url) return "";
  if (url.includes("/shorts/")) {
    const parts = url.split("/shorts/");
    if (parts[1]) {
      return parts[1].split(/[?#]/)[0];
    }
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

export default function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [testimonials]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.clientWidth + 24;
        const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((testimonial, i) => {
          const videoId = getYouTubeId(testimonial.videoUrl || "");
          const isPlaying = playingIndex === i;

          return (
            <div 
              key={i} 
              className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] snap-start flex flex-col p-1.5 bg-white dark:bg-[#121824] border border-border/30 rounded-[20px] shadow-[0_15px_45px_rgba(0,0,0,0.015)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:border-transparent transition-all duration-300 relative overflow-hidden group"
            >
              {/* Video aspect card */}
              <div className="relative w-full aspect-[9/16] rounded-[16px] overflow-hidden bg-slate-900 border border-border/10 select-none">
                {videoId ? (
                  <>
                    <iframe
                      src={
                        isPlaying
                          ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&playsinline=1&modestbranding=1&rel=0`
                          : `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&modestbranding=1&rel=0`
                      }
                      className={`w-full h-full border-none ${isPlaying ? "" : "pointer-events-none"}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                    
                    {!isPlaying && (
                      <div 
                        className="absolute inset-0 bg-transparent flex items-center justify-center cursor-pointer z-10 group/btn"
                        onClick={() => setPlayingIndex(i)}
                      >
                        {/* Play Button Overlay */}
                        <div className="w-16 h-16 rounded-full bg-white hover:bg-white/95 text-slate-950 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/btn:scale-110 active:scale-95">
                          <Play className="w-6 h-6 fill-slate-900 text-slate-900 ml-1" />
                        </div>
                      </div>
                    )}
                  </>
                ) : testimonial.avatar ? (
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80"
                    sizes="(max-w-768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white/40 text-xl font-bold">
                    {testimonial.author}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button 
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`w-11 h-11 rounded-full flex items-center justify-center border border-border/60 bg-white dark:bg-[#121824] shadow-sm text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/60 active:scale-95 transition-all duration-200 ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`w-11 h-11 rounded-full flex items-center justify-center border border-border/60 bg-white dark:bg-[#121824] shadow-sm text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/60 active:scale-95 transition-all duration-200 ${!canScrollRight ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
