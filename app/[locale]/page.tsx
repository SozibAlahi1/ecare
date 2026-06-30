import { getTranslations } from "next-intl/server";
import * as Icons from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getTestimonials, getTeams, getPortfolios, getCaseStudies, getPageContent } from "@/lib/content";
import TestimonialsSlider from "@/components/blocks/testimonials-slider";
import CompanyMarquee from "@/components/blocks/company-marquee";
import { 
  Star, 
  CheckCircle, 
  Code, 
  Cloud, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowRight,
  Lightbulb,
  HeartHandshake,
  Puzzle,
  RefreshCw,
  Settings,
  Download,
  Smile,
  Globe,
  Quote
} from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  // Fetch content dynamically from Velite helpers
  const testimonials = await getTestimonials(locale);
  const teamMembers = (await getTeams(locale)).slice(0, 3);
  const portfolios = (await getPortfolios(locale)).slice(0, 3);
  const caseStudies = getCaseStudies(locale).slice(0, 2);

  // Load dynamic consulting cta from DB
  let consultingCta: any = null;
  try {
    const rawCta = await getPageContent("home_consulting_cta", locale);
    if (rawCta) {
      consultingCta = JSON.parse(rawCta);
    }
  } catch (e) {
    console.error("Failed to parse dynamic consulting cta:", e);
  }
  if (!consultingCta) {
    consultingCta = locale === "bn" ? {
      image: "/nextzen_team.webp",
      badge: "আমাদের জানুন",
      title: "প্রযুক্তিগত পরামর্শে ১৫+ বছরের অভিজ্ঞতা",
      description: "প্রায় দুই দশকের প্রমাণিত দক্ষতার সাথে, আমরা বিশ্বস্ত, উদ্ভাবনী এবং স্কেলেবল প্রযুক্তিগত সমাধান প্রদান করি যা ব্যবসার চাহিদার জন্য উপযুক্ত।",
      trustText: "আমরা বিশ্বাস করি যে সম্পর্কে বিশ্বাসই সর্বাগ্রে। আমরা আপনার ডেটার মালিক নই বা বিক্রি করি না এবং আমরা অবশ্যই বিজ্ঞাপন-ভিত্তিক ব্যবসায়িক মডেলের উপর নির্ভর করি না। আমাদের অর্থ উপার্জনের একমাত্র উপায় হলো আপনার দেওয়া সফ্টওয়্যার লাইসেন্স ফি।",
      btn1Text: "অ্যাপয়েন্টমেন্ট নিন",
      btn1Url: "/contact",
      btn2Text: "আমাদের সাথে যোগাযোগ করুন",
      btn2Url: "/contact"
    } : {
      image: "/nextzen_team.webp",
      badge: "GET TO KNOW US",
      title: "15+ Years of Experience in Technology Consulting",
      description: "With nearly two decades of proven expertise, we deliver reliable, innovative, and scalable technology solutions tailored to business needs.",
      trustText: "We believe that trust is paramount in a relationship. We do not own or sell your data, and we most certainly do not bank on advertising-based business models. The only way we make money is from the software license fees you pay us.",
      btn1Text: "Get Appointment",
      btn1Url: "/contact",
      btn2Text: "Contact Us",
      btn2Url: "/contact"
    };
  }

  // Load dynamic solutions from DB
  let solutionsList: any[] = [];
  try {
    const rawSolutions = await getPageContent("home_solutions", locale);
    if (rawSolutions) {
      solutionsList = JSON.parse(rawSolutions);
    }
  } catch (e) {
    console.error("Failed to parse homepage solutions:", e);
  }

  // Fallback to static list if empty
  if (!solutionsList || solutionsList.length === 0) {
    solutionsList = locale === "bn" ? [
      { name: "WP User Frontend", desc: "ওয়ার্ডপ্রেসের জন্য সেরা ফ্রন্টএন্ড সমাধান", color: "text-[#00a884] hover:text-[#008c6e]", logoUrl: "/user-frontend-logo.svg", learnMoreUrl: "/services" },
      { name: "WP ERP", desc: "ক্ষুদ্র ব্যবসার জন্য বিশেষভাবে তৈরি ওপেন সোর্স ইআরপি সমাধান", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/erp-logo-color.svg", learnMoreUrl: "/services" },
      { name: "dokan", desc: "আপনার স্বপ্নের মাল্টি-ভেন্ডর মার্কেটপ্লেস তৈরি করুন", color: "text-[#f35c7e] hover:text-[#d74567]", logoUrl: "/dokan-logo.svg", learnMoreUrl: "/services" },
      { name: "appsero", desc: "ওয়ার্ডপ্রেস ডেভেলপারদের জন্য উপযুক্ত সহযোগী", color: "text-[#06b6d4] hover:text-[#0891b2]", logoUrl: "/appsero-logo.svg", learnMoreUrl: "/services" },
      { name: "wePOS", desc: "উকমার্সের জন্য দ্রুততম পিওএস সিস্টেম", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/wepos-logo.png", learnMoreUrl: "/services" },
      { name: "WP Project Manager", desc: "আপনার টিমের জন্য প্রজেক্ট ম্যানেজমেন্ট টুল", color: "text-[#7a58f4] hover:text-[#5d3be3]", logoUrl: "/pm-logo.svg", learnMoreUrl: "/services" },
      { name: "Conversion Tracking", desc: "কোন কোডিং ছাড়াই উকমার্স কনভার্শন ডাটা ট্র্যাক করুন", color: "text-[#b06ab3] hover:text-[#97539a]", logoUrl: "/wct-logo.svg", learnMoreUrl: "/services" }
    ] : [
      { name: "WP User Frontend", desc: "Ultimate Frontend Solution for WordPress", color: "text-[#00a884] hover:text-[#008c6e]", logoUrl: "/user-frontend-logo.svg", learnMoreUrl: "/services" },
      { name: "WP ERP", desc: "Open source ERP solution built specially for small businesses", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/erp-logo-color.svg", learnMoreUrl: "/services" },
      { name: "dokan", desc: "Build your dream multi vendor marketplace", color: "text-[#f35c7e] hover:text-[#d74567]", logoUrl: "/dokan-logo.svg", learnMoreUrl: "/services" },
      { name: "appsero", desc: "Perfect companion for WordPress developers", color: "text-[#06b6d4] hover:text-[#0891b2]", logoUrl: "/appsero-logo.svg", learnMoreUrl: "/services" },
      { name: "wePOS", desc: "Fastest POS System for WooCommerce", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/wepos-logo.png", learnMoreUrl: "/services" },
      { name: "WP Project Manager", desc: "Project Management tool for your team", color: "text-[#7a58f4] hover:text-[#5d3be3]", logoUrl: "/pm-logo.svg", learnMoreUrl: "/services" },
      { name: "Conversion Tracking", desc: "Track WooCommerce conversion data without any coding", color: "text-[#b06ab3] hover:text-[#97539a]", logoUrl: "/wct-logo.svg", learnMoreUrl: "/services" }
    ];
  }

  // Distribute solutions across 3 columns dynamically
  const col1 = solutionsList.filter((_, i) => i % 3 === 0);
  const col2 = solutionsList.filter((_, i) => i % 3 === 1);
  const col3 = solutionsList.filter((_, i) => i % 3 === 2);

  // Load dynamic At A Glance from DB
  let atGlanceList: any[] = [];
  try {
    const rawAtGlance = await getPageContent("home_at_glance", locale);
    if (rawAtGlance) {
      atGlanceList = JSON.parse(rawAtGlance);
    }
  } catch (e) {
    console.error("Failed to parse homepage at-a-glance stats:", e);
  }

  // Fallback to static list if empty
  if (!atGlanceList || atGlanceList.length === 0) {
    atGlanceList = locale === "bn" ? [
      { val: "৯৮+", lbl: "টিম মেম্বার", icon: "Users" },
      { val: "২০+", lbl: "অসাধারণ প্রোডাক্ট", icon: "Puzzle" },
      { val: "৮.৫ মি.+", lbl: "ফ্রি ডাউনলোড", icon: "Download" },
      { val: "৪২৪কে+", lbl: "সন্তুষ্ট কাস্টমার", icon: "Smile" },
      { val: "১৬০+", lbl: "বিশ্বজুড়ে দেশসমূহ", icon: "Globe" }
    ] : [
      { val: "98+", lbl: "Team Members", icon: "Users" },
      { val: "20+", lbl: "Amazing Products", icon: "Puzzle" },
      { val: "8.5 M+", lbl: "Free Downloads", icon: "Download" },
      { val: "424k+", lbl: "Happy Customers", icon: "Smile" },
      { val: "160+", lbl: "Countries Worldwide", icon: "Globe" }
    ];
  }

  // Filter database testimonials to only those with videoUrl
  const dbVideoTestimonials = testimonials.filter(t => !!t.videoUrl);

  // Fallbacks if no data exists yet
  const fallbackTestimonials = locale === "bn" ? [
    {
      author: "অ্যালিস ভ্যান্স",
      company: "একমি কর্পোরেশন",
      quote: "ইকেয়ার আমাদের ডেভেলপার ওয়ার্কফ্লো পরিবর্তন করেছে এবং তাৎক্ষণিকভাবে খরচ কমিয়েছে।",
      rating: 5,
      avatar: "/static/images/testimonials/alice.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      author: "বব মিলার",
      company: "গ্লোবেক্স ইনক",
      quote: "আমাদের নতুন সাইটে চমৎকার গ্রাহক সহায়তা এবং বিদ্যুৎ-গতির পেজ লোড স্পিড পেয়েছি।",
      rating: 4,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      author: "সারাহ জেনকিন্স",
      company: "টেকফ্লো",
      quote: "ইকেয়ার আমাদের জন্য যে কাস্টম ইন্টিগ্রেশনগুলো তৈরি করেছে তা আমাদের কার্যকারিতা দ্বিগুণ করে তুলেছে।",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ] : [
    {
      author: "Alice Vance",
      company: "Acme Corp",
      quote: "Ecare transformed our developer workflow and cut costs immediately.",
      rating: 5,
      avatar: "/static/images/testimonials/alice.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      author: "Bob Miller",
      company: "Globex Inc",
      quote: "Excellent support and lightning-fast loading speeds on our new site.",
      rating: 4,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      author: "Sarah Jenkins",
      company: "TechFlow",
      quote: "The custom integrations Ecare built for us have doubled our efficiency.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ];

  // Show at most 3 dynamic video testimonials on the homepage, or use fallback if empty
  const displayTestimonials = dbVideoTestimonials.length > 0 
    ? dbVideoTestimonials.slice(0, 3) 
    : fallbackTestimonials;

  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* 1. HERO SECTION */}
        <Section className="relative overflow-x-clip pt-8 pb-8 md:pt-12 md:pb-12 bg-[#f8fafc]/60 dark:bg-[#0b0f19]/40">
          {/* Glowing background blobs to match reference screenshot */}
          <div className="absolute top-[-20%] left-[-15%] w-[45%] aspect-square bg-cyan-200/35 dark:bg-cyan-500/5 rounded-full blur-[120px] md:blur-[160px] pointer-events-none" />
          <div className="absolute top-[-10%] right-[-15%] w-[55%] aspect-square bg-purple-200/35 dark:bg-purple-500/5 rounded-full blur-[140px] md:blur-[180px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[25%] w-[35%] aspect-square bg-pink-200/25 dark:bg-pink-500/5 rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />
          
          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headings & Badges */}
              <div className="lg:col-span-6 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
                <h1 className="text-3xl md:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-tight text-foreground">
                  {t.rich("titleHtml", {
                    highlight1: (chunks) => (
                      <span className="relative inline text-primary after:absolute after:bottom-1 after:left-0 after:right-0 after:h-2 after:bg-primary/20 after:-z-10 px-1">
                        {chunks}
                      </span>
                    ),
                    highlight2: (chunks) => (
                      <span className="relative inline text-purple-600 dark:text-purple-400 after:absolute after:bottom-1 after:left-0 after:right-0 after:h-2 after:bg-purple-500/20 after:-z-10 px-1">
                        {chunks}
                      </span>
                    ),
                  })}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  {t("subtitle")}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-0.5">
                  <Button variant="glow" size="lg" asChild>
                    <Link href="/contact">{t("greeting")}</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/services">
                      {t("learnMore")}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* Trust Badge / Partner logos */}
                <div className="pt-3">
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#0c101b] shadow-[0_30px_80px_0_rgba(0,0,0,0.04)] dark:shadow-[0_30px_80px_0_rgba(0,0,0,0.5)] max-w-md space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.rich("heroBadgeHtml", {
                        bold: (chunks) => <strong className="text-foreground font-bold">{chunks}</strong>
                      })}
                    </p>
                    
                    {/* CSS styles for the hero-badge-marquee */}
                    <style dangerouslySetInnerHTML={{ __html: `
                      @keyframes hero-marquee-slide {
                        0% {
                          transform: translateX(0);
                        }
                        100% {
                          transform: translateX(calc(-50% - 0.75rem));
                        }
                      }
                      .hero-marquee-track {
                        display: flex;
                        width: max-content;
                        gap: 1.5rem;
                        animation: hero-marquee-slide 25s linear infinite;
                      }
                      .hero-marquee-track:hover {
                        animation-play-state: paused;
                      }
                    `}} />

                    {/* Marquee Container with fade masks */}
                    <div className="relative overflow-hidden w-full">
                      {/* Left and right fade gradients for a premium feel */}
                      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#0c101b] to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#0c101b] to-transparent z-10 pointer-events-none" />
                      
                      <div className="flex gap-6 overflow-hidden py-1">
                        <div className="hero-marquee-track">
                          {/* Original Set */}
                          {[
                            { src: "/company/Logo-1.png", alt: "Luxor Cosmetics" },
                            { src: "/company/Logo-2.png", alt: "Saifex" },
                            { src: "/company/Logo3.png", alt: "HBCI" },
                            { src: "/company/Logo4.png", alt: "Nandanik" },
                            { src: "/company/Logo5.png", alt: "Logo 5" },
                            { src: "/company/Logo6.png", alt: "Logo 6" },
                            { src: "/company/Logo7.png", alt: "Logo 7" },
                            { src: "/company/Logo8.png", alt: "Logo 8" },
                            { src: "/company/Logo9.png", alt: "Logo 9" },
                            { src: "/company/Logo10.png", alt: "Logo 10" },
                            { src: "/company/Logo11.png", alt: "Logo 11" },
                            { src: "/company/Logo12.png", alt: "Logo 12" },
                            { src: "/company/Logo13.png", alt: "Logo 13" },
                          ].map((logo, idx) => (
                            <div key={`hero-logo-1-${idx}`} className="relative h-7 w-20 flex-shrink-0 filter grayscale dark:invert opacity-70 hover:filter-none hover:opacity-100 transition-all duration-300 cursor-pointer">
                              <Image
                                src={logo.src}
                                alt={logo.alt}
                                fill
                                className="object-contain"
                                sizes="80px"
                              />
                            </div>
                          ))}
                          {/* Duplicate Set for Loop */}
                          {[
                            { src: "/company/Logo-1.png", alt: "Luxor Cosmetics" },
                            { src: "/company/Logo-2.png", alt: "Saifex" },
                            { src: "/company/Logo3.png", alt: "HBCI" },
                            { src: "/company/Logo4.png", alt: "Nandanik" },
                            { src: "/company/Logo5.png", alt: "Logo 5" },
                            { src: "/company/Logo6.png", alt: "Logo 6" },
                            { src: "/company/Logo7.png", alt: "Logo 7" },
                            { src: "/company/Logo8.png", alt: "Logo 8" },
                            { src: "/company/Logo9.png", alt: "Logo 9" },
                            { src: "/company/Logo10.png", alt: "Logo 10" },
                            { src: "/company/Logo11.png", alt: "Logo 11" },
                            { src: "/company/Logo12.png", alt: "Logo 12" },
                            { src: "/company/Logo13.png", alt: "Logo 13" },
                          ].map((logo, idx) => (
                            <div key={`hero-logo-2-${idx}`} className="relative h-7 w-20 flex-shrink-0 filter grayscale dark:invert opacity-70 hover:filter-none hover:opacity-100 transition-all duration-300 cursor-pointer" aria-hidden="true">
                              <Image
                                src={logo.src}
                                alt={logo.alt}
                                fill
                                className="object-contain"
                                sizes="80px"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Orbit Rocket Graphics */}
              <div className="lg:col-span-6 flex justify-center relative">
                <div className="relative w-full max-w-[700px] aspect-[590/548] flex items-center justify-center">
                  <Image 
                    src="/hero-feature-img01.png" 
                    alt="weDevs Innovative Tools" 
                    width={590} 
                    height={548} 
                    priority 
                    className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                  />
                  {/* Floating Animating Icons Overlay (Parallax depth effect) */}
                  <div className="absolute top-[40%] left-[-4%] z-20 animate-float w-[75px] md:w-[90px] aspect-square">
                    <Image 
                      src="/dokan-3d.png" 
                      alt="Dokan 3D" 
                      width={90} 
                      height={90}
                      priority
                      className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                    />
                  </div>

                  <div className="absolute top-[8%] right-[16%] z-20 animate-float-delayed w-[40px] md:w-[48px] aspect-square">
                    <Image 
                      src="/wemail.png" 
                      alt="weMail" 
                      width={48} 
                      height={48}
                      priority
                      className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                    />
                  </div>

                  <div className="absolute bottom-[6%] left-[30%] z-20 animate-float [animation-delay:1.5s] w-[70px] md:w-[85px] aspect-square">
                    <Image 
                      src="/user-frontend.png" 
                      alt="WP User Frontend" 
                      width={85} 
                      height={85}
                      priority
                      className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>

        </Section>

        {/* 2. OUR SOLUTIONS */}
        <Section className="bg-[#f8fafc]/60 dark:bg-[#0b0f19]/40 border-b border-border/40" padding="md">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {t.rich("solutionsTitleHtml", {
                  highlight: (chunks) => <span className="text-primary">{chunks}</span>
                })}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {t("solutionsSub")}
              </p>
            </div>

            {/* Masonry-Style Staggered Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Column 1 */}
              <div className="flex flex-col gap-8 md:mt-12">
                {col1.map((prod, idx) => {
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center text-center p-8 md:p-10 bg-white dark:bg-[#121824] border border-transparent shadow-[0_10px_35px_rgba(0,0,0,0.025)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)] hover:scale-[1.01] transition-all duration-300 rounded-3xl">
                      <div className="h-12 flex items-center justify-center mb-6 w-full">
                        <img 
                          src={prod.logoUrl} 
                          alt={prod.name} 
                          className="h-9 md:h-10 w-auto object-contain select-none pointer-events-none"
                        />
                      </div>
                      <p className="text-sm md:text-base text-[#637178] dark:text-[#98a3b3] mb-6 max-w-[280px] leading-relaxed min-h-[48px]">
                        {prod.desc}
                      </p>
                      <Link href={prod.learnMoreUrl || "/services"} className={`text-sm font-bold ${prod.color || "text-[#00a884] hover:text-[#008c6e]"} transition-colors duration-200 inline-flex items-center gap-1`}>
                        {t("learnMoreLink")} &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-8">
                {col2.map((prod, idx) => {
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center text-center p-8 md:p-10 bg-white dark:bg-[#121824] border border-transparent shadow-[0_10px_35px_rgba(0,0,0,0.025)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)] hover:scale-[1.01] transition-all duration-300 rounded-3xl">
                      <div className="h-12 flex items-center justify-center mb-6 w-full">
                        <img 
                          src={prod.logoUrl} 
                          alt={prod.name} 
                          className="h-9 md:h-10 w-auto object-contain select-none pointer-events-none"
                        />
                      </div>
                      <p className="text-sm md:text-base text-[#637178] dark:text-[#98a3b3] mb-6 max-w-[280px] leading-relaxed min-h-[48px]">
                        {prod.desc}
                      </p>
                      <Link href={prod.learnMoreUrl || "/services"} className={`text-sm font-bold ${prod.color || "text-[#f35c7e] hover:text-[#d74567]"} transition-colors duration-200 inline-flex items-center gap-1`}>
                        {t("learnMoreLink")} &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-8 md:mt-12">
                {col3.map((prod, idx) => {
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center text-center p-8 md:p-10 bg-white dark:bg-[#121824] border border-transparent shadow-[0_10px_35px_rgba(0,0,0,0.025)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)] hover:scale-[1.01] transition-all duration-300 rounded-3xl">
                      <div className="h-12 flex items-center justify-center mb-6 w-full">
                        <img 
                          src={prod.logoUrl} 
                          alt={prod.name} 
                          className="h-9 md:h-10 w-auto object-contain select-none pointer-events-none"
                        />
                      </div>
                      <p className="text-sm md:text-base text-[#637178] dark:text-[#98a3b3] mb-6 max-w-[280px] leading-relaxed min-h-[48px]">
                        {prod.desc}
                      </p>
                      <Link href={prod.learnMoreUrl || "/services"} className={`text-sm font-bold ${prod.color || "text-[#7a58f4] hover:text-[#5d3be3]"} transition-colors duration-200 inline-flex items-center gap-1`}>
                        {t("learnMoreLink")} &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center pt-12">
              <Link href="/services">
                <Button size="lg" className="rounded-full font-semibold bg-[#e11d48] hover:bg-[#be123c] text-white px-8 flex items-center gap-2 mx-auto">
                  {t("exploreSolutionsBtn")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* 4. WHAT'S SO SPECIAL */}
        <Section className="relative overflow-hidden bg-white dark:bg-transparent" padding="lg">
          {/* Faint Floating Background Hexagons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Hexagon Left 1 */}
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-primary/5 dark:text-primary/2 absolute top-[15%] left-[4%] rotate-[15deg] blur-[0.5px] fill-current">
              <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
            </svg>
            {/* Hexagon Left 2 */}
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-purple-500/5 dark:text-purple-500/2 absolute top-[45%] left-[8%] rotate-[-12deg] blur-[1px] fill-current">
              <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
            </svg>
            {/* Hexagon Right 1 */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-sky-500/5 dark:text-sky-500/2 absolute bottom-[25%] right-[5%] rotate-[35deg] blur-[0.5px] fill-current">
              <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
            </svg>
            {/* Hexagon Right 2 */}
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-amber-500/5 dark:text-amber-500/2 absolute top-[30%] right-[9%] rotate-[-20deg] fill-current">
              <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
            </svg>
          </div>

          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {t.rich("whatsSpecialTitleHtml", {
                  highlight: (chunks) => <span className="text-primary">{chunks}</span>
                })}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {t("whatsSpecialSub")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  titleKey: "whatsSpecialCard1",
                  icon: Code,
                  bgClass: "bg-[#f3f0fd] dark:bg-[#1b172b]/60",
                  textClass: "text-[#6f42c1] dark:text-[#a78bfa]",
                  gradientClass: "from-[#a78bfa] to-[#8b5cf6] shadow-[#8b5cf6]/20",
                  maxWidth: "max-w-[150px]"
                },
                {
                  titleKey: "whatsSpecialCard2",
                  icon: Lightbulb,
                  bgClass: "bg-[#edf5fd] dark:bg-[#111f33]/60",
                  textClass: "text-[#0366d6] dark:text-[#60a5fa]",
                  gradientClass: "from-[#60a5fa] to-[#2563eb] shadow-[#2563eb]/20",
                  maxWidth: "max-w-[150px]"
                },
                {
                  titleKey: "whatsSpecialCard3",
                  icon: HeartHandshake,
                  bgClass: "bg-[#eef8fe] dark:bg-[#0e2238]/60",
                  textClass: "text-[#005cbf] dark:text-[#38bdf8]",
                  gradientClass: "from-[#38bdf8] to-[#0ea5e9] shadow-[#0ea5e9]/20",
                  maxWidth: "max-w-[160px]"
                },
                {
                  titleKey: "whatsSpecialCard4",
                  icon: Puzzle,
                  bgClass: "bg-[#fdf1f1] dark:bg-[#2b1619]/60",
                  textClass: "text-[#b31d28] dark:text-[#fb7185]",
                  gradientClass: "from-[#fb7185] to-[#e11d48] shadow-[#e11d48]/20",
                  maxWidth: "max-w-[180px]"
                },
                {
                  titleKey: "whatsSpecialCard5",
                  icon: RefreshCw,
                  bgClass: "bg-[#edfbf4] dark:bg-[#0e2b1b]/60",
                  textClass: "text-[#1b7c4d] dark:text-[#34d399]",
                  gradientClass: "from-[#34d399] to-[#059669] shadow-[#059669]/20",
                  maxWidth: "max-w-[180px]"
                },
                {
                  titleKey: "whatsSpecialCard6",
                  icon: Settings,
                  bgClass: "bg-[#faf5ee] dark:bg-[#261d12]/60",
                  textClass: "text-[#a05a00] dark:text-[#fbbf24]",
                  gradientClass: "from-[#fbbf24] to-[#ea580c] shadow-[#ea580c]/20",
                  maxWidth: "max-w-[180px]"
                }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-start text-left p-8 md:p-10 rounded-[24px] ${item.bgClass} hover:scale-[1.01] hover:shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all duration-300`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${item.gradientClass} shadow-md text-white flex items-center justify-center mb-6`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-bold text-xl md:text-2xl tracking-tight leading-tight ${item.textClass} ${item.maxWidth}`}>
                    {t(item.titleKey)}
                  </h3>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* 5. AT A GLANCE */}
        <Section padding="lg" className="bg-[#fcfdfd] dark:bg-transparent border-y border-border/40 relative overflow-hidden">
          <Container className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center text-foreground mb-16">
              {t.rich("atGlanceTitleHtml", {
                highlight: (chunks) => <span className="text-primary">{chunks}</span>
              })}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 items-stretch text-center">
              {atGlanceList.map((stat, i) => {
                const IconComponent = (Icons as any)[stat.icon] || Icons.HelpCircle;
                const styleIndex = i % 6;
                const styles = [
                  { iconColor: "text-[#ea580c] dark:text-[#f97316]", bgClass: "bg-transparent border border-transparent" },
                  { iconColor: "text-[#8b5cf6] dark:text-[#a78bfa]", bgClass: "bg-[#f8f7fd] dark:bg-[#181528]/50 border border-transparent" },
                  { iconColor: "text-[#10b981] dark:text-[#34d399]", bgClass: "bg-transparent border border-transparent" },
                  { iconColor: "text-[#e11d48] dark:text-[#fb7185]", bgClass: "bg-[#fdf7f8] dark:bg-[#281518]/50 border border-transparent" },
                  { iconColor: "text-[#007cf5] dark:text-[#60a5fa]", bgClass: "bg-transparent border border-transparent" },
                  { iconColor: "text-amber-500 dark:text-amber-400", bgClass: "bg-[#fefaf0] dark:bg-[#2b2214]/50 border border-transparent" }
                ];
                const currentStyle = styles[styleIndex];
                return (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-[32px] ${currentStyle.bgClass} hover:scale-[1.01] transition-all duration-300`}
                  >
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1a2333] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-center mb-6">
                      <IconComponent className={`w-6 h-6 ${currentStyle.iconColor}`} />
                    </div>
                    <div className="text-3xl md:text-[36px] font-black text-foreground mb-2 select-none tracking-tight">
                      {stat.val}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-medium max-w-[130px] leading-relaxed">
                      {stat.lbl}
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* 6. WHAT PEOPLE THINK ABOUT OUR PRODUCTS */}
        <Section padding="lg" className="bg-[#fcfdfd]/80 dark:bg-[#0b0f19]/30 border-t border-border/40 relative overflow-hidden">
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {t.rich("whatPeopleThinkTitleHtml", {
                  highlight: (chunks) => <span className="text-primary">{chunks}</span>
                })}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {t("whatPeopleThinkSub")}
              </p>
            </div>

            <TestimonialsSlider testimonials={displayTestimonials} />
          </Container>
        </Section>

        {/* 7. OUR PRODUCTS ARE HIGHLY RATED BY THOUSANDS OF CUSTOMERS */}
        <Section padding="md" className="border-t border-border">
          <Container className="text-center space-y-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("highlyRatedTitle")}</h2>
              <p className="text-muted-foreground">{t("highlyRatedSub")}</p>
            </div>

            <CompanyMarquee />
          </Container>
        </Section>

        {/* 8. CTA SECTION */}
        <Section padding="none" className="relative overflow-hidden bg-white dark:bg-[#070b13] pb-16 border-t border-border">
          {/* Team Image Banner with Gradient Fade */}
          <div className="relative w-full h-[240px] sm:h-[320px] md:h-[400px]">
            <Image
              src={consultingCta.image || "/nextzen_team.webp"}
              alt="Ecare Team"
              fill
              className="object-cover object-top"
              priority
            />
            {/* Smooth mask to transition the image into the white/dark background */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-[#070b13] dark:via-[#070b13]/50 pointer-events-none" />
          </div>

          <Container className="relative z-10 -mt-12 md:-mt-20 text-center max-w-4xl mx-auto space-y-6">
            <div className="space-y-3.5">
              <span className="text-[10px] md:text-xs font-extrabold text-primary dark:text-white/85 tracking-widest uppercase block">
                {consultingCta.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[36px] font-extrabold text-primary dark:text-white tracking-tight leading-tight max-w-3xl mx-auto">
                {consultingCta.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                {consultingCta.description}
              </p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto pt-1">
              <p className="text-[12px] sm:text-xs text-muted-foreground leading-relaxed">
                {consultingCta.trustText}
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              {consultingCta.btn1Text && (
                <Button variant="outline" className="border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] sm:text-xs font-bold tracking-wider uppercase h-10 px-6 rounded shadow-sm" asChild>
                  <Link href={consultingCta.btn1Url || "/contact"}>{consultingCta.btn1Text}</Link>
                </Button>
              )}
              {consultingCta.btn2Text && (
                <Button variant="outline" className="border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] sm:text-xs font-bold tracking-wider uppercase h-10 px-6 rounded shadow-sm" asChild>
                  <Link href={consultingCta.btn2Url || "/contact"}>{consultingCta.btn2Text}</Link>
                </Button>
              )}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
