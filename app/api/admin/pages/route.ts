import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Auto-create contact_info page settings if not present
    const contactInfo = await Page.findOne({ key: "contact_info" });
    if (!contactInfo) {
      await Page.create({
        key: "contact_info",
        content: {
          en: JSON.stringify({
            phone: "+880 1234 56789",
            email: "info@ecare.com",
            address: "Dhanmondi, Dhaka",
            hours: "Sat - Thu: 9 AM - 6 PM",
          }),
          bn: JSON.stringify({
            phone: "+৮৮০ ১২৩৪ ৫৬৭৮৯",
            email: "info@ecare.com",
            address: "ধানমন্ডি, ঢাকা",
            hours: "শনি - বৃহস্পতি: সকাল ৯টা - সন্ধ্যা ৬টা",
          }),
        }
      });
    }

    // Auto-create offer_popup settings if not present
    const offerPopup = await Page.findOne({ key: "offer_popup" });
    if (!offerPopup) {
      await Page.create({
        key: "offer_popup",
        content: {
          en: JSON.stringify({
            title: "Special Welcome Offer! 🎉",
            subtitle: "Get 20% flat discount on your first service with us. Subscribe to our newsletter to unlock your discount code.",
            discountPercent: "20",
            discountCode: "GROWTH20",
            isActive: "true"
          }),
          bn: JSON.stringify({
            title: "বিশেষ স্বাগতম অফার! 🎉",
            subtitle: "আমাদের সাথে আপনার প্রথম সার্ভিসে ফ্ল্যাট ২০% ডিসকাউন্ট পান। আপনার ডিসকাউন্ট কোডটি আনলক করতে আমাদের নিউজলেটারে সাবস্ক্রাইব করুন।",
            discountPercent: "২০",
            discountCode: "GROWTH20",
            isActive: "true"
          }),
        }
      });
    }

    // Auto-create home_solutions settings if not present
    const homeSolutions = await Page.findOne({ key: "home_solutions" });
    if (!homeSolutions) {
      const defaultSolutionsEn = [
        { name: "WP User Frontend", desc: "Ultimate Frontend Solution for WordPress", color: "text-[#00a884] hover:text-[#008c6e]", logoUrl: "/user-frontend-logo.svg", learnMoreUrl: "/services" },
        { name: "WP ERP", desc: "Open source ERP solution built specially for small businesses", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/erp-logo-color.svg", learnMoreUrl: "/services" },
        { name: "dokan", desc: "Build your dream multi vendor marketplace", color: "text-[#f35c7e] hover:text-[#d74567]", logoUrl: "/dokan-logo.svg", learnMoreUrl: "/services" },
        { name: "appsero", desc: "Perfect companion for WordPress developers", color: "text-[#06b6d4] hover:text-[#0891b2]", logoUrl: "/appsero-logo.svg", learnMoreUrl: "/services" },
        { name: "wePOS", desc: "Fastest POS System for WooCommerce", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/wepos-logo.png", learnMoreUrl: "/services" },
        { name: "WP Project Manager", desc: "Project Management tool for your team", color: "text-[#7a58f4] hover:text-[#5d3be3]", logoUrl: "/pm-logo.svg", learnMoreUrl: "/services" },
        { name: "Conversion Tracking", desc: "Track WooCommerce conversion data without any coding", color: "text-[#b06ab3] hover:text-[#97539a]", logoUrl: "/wct-logo.svg", learnMoreUrl: "/services" }
      ];

      const defaultSolutionsBn = [
        { name: "WP User Frontend", desc: "ওয়ার্ডপ্রেসের জন্য সেরা ফ্রন্টএন্ড সমাধান", color: "text-[#00a884] hover:text-[#008c6e]", logoUrl: "/user-frontend-logo.svg", learnMoreUrl: "/services" },
        { name: "WP ERP", desc: "ক্ষুদ্র ব্যবসার জন্য বিশেষভাবে তৈরি ওপেন সোর্স ইআরপি সমাধান", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/erp-logo-color.svg", learnMoreUrl: "/services" },
        { name: "dokan", desc: "আপনার স্বপ্নের মাল্টি-ভেন্ডর মার্কেটপ্লেস তৈরি করুন", color: "text-[#f35c7e] hover:text-[#d74567]", logoUrl: "/dokan-logo.svg", learnMoreUrl: "/services" },
        { name: "appsero", desc: "ওয়ার্ডপ্রেস ডেভেলপারদের জন্য উপযুক্ত সহযোগী", color: "text-[#06b6d4] hover:text-[#0891b2]", logoUrl: "/appsero-logo.svg", learnMoreUrl: "/services" },
        { name: "wePOS", desc: "উকমার্সের জন্য দ্রুততম পিওএস সিস্টেম", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/wepos-logo.png", learnMoreUrl: "/services" },
        { name: "WP Project Manager", desc: "আপনার টিমের জন্য প্রজেক্ট ম্যানেজমেন্ট টুল", color: "text-[#7a58f4] hover:text-[#5d3be3]", logoUrl: "/pm-logo.svg", learnMoreUrl: "/services" },
        { name: "Conversion Tracking", desc: "কোন কোডিং ছাড়াই উকমার্স কনভার্শন ডাটা ট্র্যাক করুন", color: "text-[#b06ab3] hover:text-[#97539a]", logoUrl: "/wct-logo.svg", learnMoreUrl: "/services" }
      ];

      await Page.create({
        key: "home_solutions",
        content: {
          en: JSON.stringify(defaultSolutionsEn),
          bn: JSON.stringify(defaultSolutionsBn),
        }
      });
    }

    // Auto-create home_at_glance settings if not present
    const homeAtGlance = await Page.findOne({ key: "home_at_glance" });
    if (!homeAtGlance) {
      const defaultAtGlanceEn = [
        { val: "98+", lbl: "Team Members", icon: "Users" },
        { val: "20+", lbl: "Amazing Products", icon: "Puzzle" },
        { val: "8.5 M+", lbl: "Free Downloads", icon: "Download" },
        { val: "424k+", lbl: "Happy Customers", icon: "Smile" },
        { val: "160+", lbl: "Countries Worldwide", icon: "Globe" },
        { val: "15+", lbl: "Years of Journey", icon: "Award" }
      ];

      const defaultAtGlanceBn = [
        { val: "৯৮+", lbl: "টিম মেম্বার", icon: "Users" },
        { val: "২০+", lbl: "অসাধারণ প্রোডাক্ট", "icon": "Puzzle" },
        { val: "৮.৫ মি.+", lbl: "ফ্রি ডাউনলোড", icon: "Download" },
        { val: "৪২৪কে+", lbl: "সন্তুষ্ট কাস্টমার", icon: "Smile" },
        { val: "১৬০+", lbl: "বিশ্বজুড়ে দেশসমূহ", icon: "Globe" },
        { val: "১৫+", lbl: "বছরের পথচলা", icon: "Award" }
      ];

      await Page.create({
        key: "home_at_glance",
        content: {
          en: JSON.stringify(defaultAtGlanceEn),
          bn: JSON.stringify(defaultAtGlanceBn),
        }
      });
    }

    // Auto-create ezy_checkout settings if not present
    const ezyCheckout = await Page.findOne({ key: "ezy_checkout" });
    if (!ezyCheckout) {
      await Page.create({
        key: "ezy_checkout",
        content: {
          en: JSON.stringify({
            // Hero Section
            heroBadge: "WooCommerce PopUp Checkout",
            heroTitle: "Increase WooCommerce Conversion by 40% with PopUp Checkout",
            heroSub: "Ezy Checkout is the ultimate WooCommerce PopUp checkout plugin. Simplify checking out in less than 15 seconds.",
            heroCtaText: "Try Ezy Checkout Free",
            heroImage: "/heroimage-transparent.png",
            
            // Features Section
            featuresBadge: "Unique Features",
            featuresTitle: "Supercharge WooCommerce Experience",
            featuresList: [
              { title: "One Page Popup Checkout", desc: "No more multi-step redirect friction. Customers complete checkout on the spot.", icon: "ShoppingBag" },
              { title: "Smart Coupon Engine", desc: "Validate discount codes instantly inside the popup form to reduce order abandonment.", icon: "Sparkles" },
              { title: "Address Validation", desc: "Verify shipping inputs and calculate dynamic shipping rates in real-time.", icon: "ShieldCheck" },
              { title: "Ajax Processing", desc: "Fast asynchronous form submission ensures zero page reload delays.", icon: "Cpu" },
              { title: "Multi-site Licensing", desc: "Easily integrate Ezy Checkout across multiple staging or production client stores.", icon: "Layers" },
              { title: "Developer Hook Filters", desc: "Extensible codebase allowing developers to add custom checkout fields and rules.", icon: "Clock" }
            ],
            
            // Product Overview
            aboutBadge: "Product Overview",
            aboutTitle: "Beautiful PopUp Form & Settings Dashboard",
            aboutImage: "https://www.youtube.com/watch?v=s8m6oHByjjI",
            
            // Pricing Details
            pricingTitle: "Flexible License Plans",
            pricingSub: "Start improving your checkout experience for your business today.",
            planFree: "Free Version",
            planFreeDesc: "Basic popup layout and standard checkout form features.",
            freePrice: "0",
            freeLifetime: "Lifetime",
            freeFeature1: "Ready-to-use checkout popup layout",
            freeFeature2: "Instant warnings for incorrect details",
            freeFeature3: "Superfast checkout without page reloads",
            freeFeature4: "Change product quantity inside the popup",
            freeFeature5: "Enable or disable extra order notes field",
            downloadNow: "Download Now",
            planPro: "Pro Version",
            planProDesc: "Unlimited styling control, coupon validation, priority support and multi-site licenses.",
            proPrice: "2,800",
            proLifetime: "Lifetime (3 Sites)",
            proFeature1: "Fully customize colors, borders & styling",
            proFeature2: "Show instant discounts when coupons are applied",
            proFeature3: "Calculate shipping charges automatically by address",
            proFeature4: "Show extra attractive offers to boost sales",
            proFeature5: "Compatible with bKash, Rocket, Nagad & standard gateways",
            proFeature6: "Works smoothly with any theme or page builder",
            proFeature7: "1 year of direct priority support & updates",
            getPro: "Ezy Checkout Pro",
            recTag: "Recommended",
            
            // FAQs
            faqTitle: "Frequently Asked Questions",
            faqsList: [
              { q: "Is WooCommerce required?", a: "Yes. Ezy Checkout is specifically built as a popup addition for WooCommerce shops." },
              { q: "Does it replace default checkout?", a: "No. It provides a quick checkout popup alternative, keeping your standard page functional." },
              { q: "Is my customer data safe?", a: "Completely. All calculations and submissions process securely on your own server." }
            ]
          }),
          bn: JSON.stringify({
            // Hero Section
            heroBadge: "পপআপ উকমার্স চেকআউট",
            heroTitle: "পপআপ চেকআউট দিয়ে আপনার সেলস বৃদ্ধি করুন ৪০% পর্যন্ত",
            heroSub: "Ezy Checkout হলো উকমার্সের জন্য চূড়ান্ত পপআপ চেকআউট প্লাগইন। অর্ডার সম্পন্ন করুন ১৫ সেকেন্ডের মধ্যে।",
            heroCtaText: "ফ্রি ট্রায়াল শুরু করুন",
            heroImage: "/heroimage-transparent.png",
            
            // Features Section
            featuresBadge: "ইউনিক ফিচারসমূহ",
            featuresTitle: "আমাদের প্লাগিনের শক্তিশালী ফিচারসমূহ",
            featuresList: [
              { title: "পপআপ উকমার্স চেকআউট", desc: "পপআপ চেকআউট ফ্লো কাস্টমারকে এক পেজেই অর্ডার কমপ্লিট করার সুবিধা দেয়।", icon: "ShoppingBag" },
              { title: "স্মার্ট কুপন ইঞ্জিন", desc: "পপআপ চেকআউটের ভেতরেই সরাসরি কুপন কোড ব্যবহার করার সুবিধা ও সিকিউরিটি চেক।", icon: "Sparkles" },
              { title: "শিপিং এবং ভ্যালিডেশন", desc: "অ্যাড্রেস ইনপুটের লাইভ সার্ভার-সাইড ভ্যালিডেশন এবং ডায়নামিক শিপিং মেথড আপডেট।", icon: "ShieldCheck" },
              { title: "অ্যাডমিন এজ্যাক্স সেটিংস", desc: "খুব সহজেই প্লাগিনের স্টাইল, কালার, লেআউট এবং টেক্সট কন্ট্রোল করার জন্য ড্যাশবোর্ড সেটিংস।", icon: "Cpu" },
              { title: "মাল্টি-সাইট লাইসেন্সিং", desc: "খুব সহজেই একাধিক ক্লায়েন্ট WooCommerce স্টোরে পপআপ চেকআউট রান করুন।", icon: "Layers" },
              { title: "ডেভেলপার ডকুমেন্টেশন", desc: "সহজেই প্লাগিনের ডাটা ও ফিল্ড কাস্টমাইজ করতে এক্সটেনসিবল হুক ও ফিল্টার সুবিধা।", icon: "Clock" }
            ],
            
            // Product Overview
            aboutBadge: "প্রোডাক্ট ওভারভিউ",
            aboutTitle: "আকর্ষণীয় পপআপ ফর্ম এবং সেটিংস ড্যাশবোর্ড",
            aboutImage: "https://www.youtube.com/watch?v=s8m6oHByjjI",
            
            // Pricing Details
            pricingTitle: "সহজ ও সাশ্রয়ী লাইসেন্স প্ল্যান",
            pricingSub: "আপনার ব্যবসার জন্য সেরা পপআপ চেকআউট অভিজ্ঞতা নিয়ে কাজ শুরু করুন এখনই।",
            planFree: "ফ্রি ভার্সন",
            planFreeDesc: "বেসিক পপআপ লেআউট এবং স্ট্যান্ডার্ড চেকআউট ফর্ম সুবিধা।",
            freePrice: "০",
            freeLifetime: "আজীবন",
            freeFeature1: "সহজ ও সুন্দর রেডিমেড পপআপ ফর্ম",
            freeFeature2: "ভুল তথ্য দিলে স্বয়ংক্রিয় সতর্কবার্তা",
            freeFeature3: "পেজ লোড ছাড়াই দ্রুত অর্ডার সম্পন্ন করা",
            freeFeature4: "পপআপ থেকেই পণ্যের সংখ্যা কমানো-বাড়ানোর সুবিধা",
            freeFeature5: "অর্ডারের সাথে বাড়তি মেসেজ লেখার ঘর অন/অফ করার সুবিধা",
            downloadNow: "এখনই ডাউনলোড করুন",
            planPro: "প্রো ভার্সন",
            planProDesc: "আনলিমিটেড স্টাইলিং কন্ট্রোল, কুপন ভ্যালিডেশন, প্রায়োরিটি সাপোর্ট এবং মাল্টি-সাইট লাইসেন্স।",
            proPrice: "২,৮০০",
            proLifetime: "আজীবন (৩টি সাইট)",
            proFeature1: "প্লাগিনের রঙ ও ডিজাইন মনের মতো সাজানোর সুবিধা",
            proFeature2: "কুপন কোড লিখলেই সাথে সাথে ডিসকাউন্ট হিসাব",
            proFeature3: "ঠিকানা অনুযায়ী শিপিং চার্জ স্বয়ংক্রিয়ভাবে হিসাব করা",
            proFeature4: "অর্ডার করার সময় অতিরিক্ত আকর্ষণীয় অফার দেখানোর সুযোগ",
            proFeature5: "বিকাশ, রকেট, নগদ বা যেকোনো পেমেন্ট গেটওয়ের সাথে কাজ করার সুবিধা",
            proFeature6: "যেকোনো থিম বা পেজ বিল্ডারের সাথে ঝামেলাহীনভাবে কাজ করার সুবিধা",
            proFeature7: "১ বছর যেকোনো প্রয়োজনে সরাসরি আমাদের সাপোর্ট ও আপডেট",
            getPro: "Ezy Checkout প্রো নিন",
            recTag: "প্রস্তাবিত",
            
            // FAQs
            faqTitle: "সচরাচর জিজ্ঞাস্য প্রশ্নাবলী",
            faqsList: [
              { q: "Ezy Checkout ব্যবহার করতে কি WooCommerce প্রয়োজন?", a: "হ্যাঁ, এটি সরাসরি WooCommerce-এর সাথে কাজ করে। WooCommerce-এর ব্যাকএন্ড এপিআই ব্যবহার করে নিরাপদভাবে অর্ডার তৈরি করা হয়।" },
              { q: "এটি কি ডিফল্ট WooCommerce চেকআউট পেজকে রিপ্লেস করে?", a: "না, এটি দ্রুত পপআপ চেকআউটের একটি বিকল্প অপশন যোগ করে, তবে আপনার ডিফল্ট চেকআউট পেজটি আগের মতোই সচল থাকবে।" },
              { q: "গ্রাহকের তথ্য কি এখানে নিরাপদ?", a: "হ্যাঁ। সকল তথ্য সরাসরি আপনার নিজস্ব হোস্টিং সার্ভারে প্রসেস করা হয়। প্লাগিনটি বাইরের কোনো সার্ভারে গ্রাহকের তথ্য পাঠায় না।" }
            ]
          }),
        }
      });
    }

    const pages = await Page.find({});
    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    if (!body.key || !body.content || !body.content.en || !body.content.bn) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Check if key exists
    const existing = await Page.findOne({ key: body.key });
    if (existing) {
      return NextResponse.json({ success: false, error: "Page key already exists" }, { status: 400 });
    }

    const page = await Page.create(body);
    return NextResponse.json({ success: true, data: page });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
