import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Blog, Team, Testimonial, Portfolio, Page } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Seed Pages
    const pagesToSeed = [
        {
          key: "home_consulting_cta",
          content: {
            en: JSON.stringify({
              image: "/nextzen_team.webp",
              badge: "GET TO KNOW US",
              title: "15+ Years of Experience in Technology Consulting",
              description: "With nearly two decades of proven expertise, we deliver reliable, innovative, and scalable technology solutions tailored to business needs.",
              trustText: "We believe that trust is paramount in a relationship. We do not own or sell your data, and we most certainly do not bank on advertising-based business models. The only way we make money is from the software license fees you pay us.",
              btn1Text: "Get Appointment",
              btn1Url: "/contact",
              btn2Text: "Contact Us",
              btn2Url: "/contact"
            }),
            bn: JSON.stringify({
              image: "/nextzen_team.webp",
              badge: "আমাদের জানুন",
              title: "প্রযুক্তিগত পরামর্শে ১৫+ বছরের অভিজ্ঞতা",
              description: "প্রায় দুই দশকের প্রমাণিত দক্ষতার সাথে, আমরা বিশ্বস্ত, উদ্ভাবনী এবং স্কেলেবল প্রযুক্তিগত সমাধান প্রদান করি যা ব্যবসার চাহিদার জন্য উপযুক্ত।",
              trustText: "আমরা বিশ্বাস করি যে সম্পর্কে বিশ্বাসই সর্বাগ্রে। আমরা আপনার ডেটার মালিক নই বা বিক্রি করি না এবং আমরা অবশ্যই বিজ্ঞাপন-ভিত্তিক ব্যবসায়িক মডেলের উপর নির্ভর করি না। আমাদের অর্থ উপার্জনের একমাত্র উপায় হলো আপনার দেওয়া সফ্টওয়্যার লাইসেন্স ফি।",
              btn1Text: "অ্যাপয়েন্টমেন্ট নিন",
              btn1Url: "/contact",
              btn2Text: "আমাদের সাথে যোগাযোগ করুন",
              btn2Url: "/contact"
            })
          }
        },
        {
          key: "about",
          content: {
            en: JSON.stringify({
              title: "About Ecare",
              subtitle: "We are a client-first developer agency delivering high-integrity software.",
              ourStoryBody: "Founded with a mission to eliminate technical debt, Ecare builds robust software systems. We combine design excellence with rigid engineering standards to build long-lasting solutions.",
              ourGoalBody: "Since day one, Ecare has been committed to utilizing modern cloud architectures and high-fidelity frameworks to solve real-world business challenges. We combine deep engineering expertise and cutting-edge technologies to build powerful, scalable custom web applications. Whether you need an enterprise eCommerce platform, a custom business SaaS, or a robust integration API, we have you covered. Over time, we have grown into a trusted technology partner, delivering solutions that meet the evolving needs of our clients.",
              journeySubtitle: "How we built a legacy of premium engineering, one milestone at a time.",
              journey2026Title: "AI Integrations & Next-Gen Platforms",
              journey2026Desc: "Expanding our elite team to support cutting-edge AI integrations and developing high-performance next-gen web architectures.",
              journey2025Title: "Global Scale & SaaS Ecosystems",
              journey2025Desc: "Scaling our partner applications and SaaS platforms, serving millions of users worldwide with zero-downtime engineering.",
              journey2023Title: "The Inception of Ecare",
              journey2023Desc: "Founded with a core mission to eliminate technical debt, combining rigid engineering standards with client-first design.",
              atGlanceSub: "Ecare is a leading name in the SaaS and web software industry, empowering hundreds of thousands of businesses globally with high-performance digital tools."
            }),
            bn: JSON.stringify({
              title: "ইকেয়ার সম্পর্কে",
              subtitle: "আমরা একটি ক্লায়েন্ট-প্রথম ডেভেলপার এজেন্সি যা উচ্চ-মানের সফটওয়্যার সরবরাহ করে।",
              ourStoryBody: "প্রযুক্তিগত জটিলতা দূর করার লক্ষ্য নিয়ে ইকেয়ার প্রতিষ্ঠিত। আমরা দীর্ঘস্থায়ী সমাধান তৈরিতে চমৎকার ডিজাইন ও কঠোর ইঞ্জিনিয়ারিং মানকে একত্রিত করি।",
              ourGoalBody: "প্রথম দিন থেকেই, ইকেয়ার বাস্তবমুখী ব্যবসায়িক চ্যালেঞ্জ সমাধানের জন্য আধুনিক ক্লাউড আর্কিটেকচার এবং শক্তিশালী ফ্রেমওয়ার্ক ব্যবহার করতে প্রতিশ্রুতিবদ্ধ। আমরা শক্তিশালী ও স্কেলেবল কাস্টম ওয়েব অ্যাপ্লিকেশন তৈরি করতে গভীর ইঞ্জিনিয়ারিং দক্ষতা এবং অত্যাধুনিক প্রযুক্তির সমন্বয় করি। আপনার এন্টারপ্রাইজ ই-কমার্স প্ল্যাটফর্ম, কাস্টম বিজনেস SaaS বা শক্তিশালী ইন্টিগ্রেশন API-ই প্রয়োজন হোক না কেন, আমরা আপনার পাশে আছি। সময়ের সাথে সাথে, আমরা একটি নির্ভরযোগ্য প্রযুক্তিগত অংশীদার হয়ে উঠেছি, যা আমাদের ক্লায়েন্টদের ক্রমবর্ধমান চাহিদা পূরণ করতে সক্ষম।",
              journeySubtitle: "কীভাবে আমরা ধাপে ধাপে প্রিমিয়াম ইঞ্জিনিয়ারিংয়ের একটি দীর্ঘস্থায়ী মান তৈরি করেছি।",
              journey2026Title: "এআই ইন্টিগ্রেশন এবং নেক্সট-জেন প্ল্যাটফর্ম",
              journey2026Desc: "অত্যাধুনিক কৃত্রিম বুদ্ধিমত্তা (AI) ইন্টিগ্রেশন এবং অত্যন্ত দ্রুতগতির ওয়েব আর্কিটেকচার তৈরি করতে আমাদের বিশেষ দক্ষ ডেভেলপার টিম সম্প্রসারণ।",
              journey2025Title: "গ্লোবাল স্কেল ও SaaS ইকোসিস্টেম",
              journey2025Desc: "আমাদের পার্টনার অ্যাপ্লিকেশন এবং SaaS প্ল্যাটফর্মগুলোর স্কেলিং সম্পন্ন করা, যা বিশ্বব্যাপী লক্ষ লক্ষ গ্রাহককে শূন্য-ডাউনটাইম ইঞ্জিনিয়ারিং সেবা দিচ্ছে।",
              journey2023Title: "ইকেয়ার-এর পথচলার শুরু",
              journey2023Desc: "কোডের প্রযুক্তিগত ঋণ (Technical Debt) সম্পূর্ণ দূর করার লক্ষ্য নিয়ে প্রতিষ্ঠিত, যেখানে কঠোর ইঞ্জিনিয়ারিং মান ও ক্লায়েন্ট-প্রথম ডিজাইনকে একত্রিত করা হয়েছে।",
              atGlanceSub: "Ecare হলো SaaS এবং ওয়েব সফটওয়্যার শিল্পের একটি শীর্ষস্থানীয় নাম, যা বিশ্বজুড়ে লাখ লাখ ব্যবসায়ীকে শক্তিশালী ডিজিটাল টুলস দিয়ে সাহায্য করছে।"
            }),
          },
        },
        {
          key: "privacy",
          content: {
            en: `### Privacy Policy
Your privacy is important to us. It is Ecare's policy to respect your privacy regarding any information we may collect from you across our website.

#### Information We Collect
We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.`,
            bn: `### প্রাইভেসি পলিসি
আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমাদের ওয়েবসাইট থেকে আপনার যে কোনো তথ্য সংগ্রহের ক্ষেত্রে আপনার গোপনীয়তাকে সম্মান জানানো ইকেয়ার-এর পলিসি।

#### সংগৃহীত তথ্যসমূহ
যখন আপনার কোনো নির্দিষ্ট সেবা প্রদানের জন্য তথ্যের প্রয়োজন হয়, তখনই কেবল আমরা তা চেয়ে থাকি। আপনার সম্মতিতেই এই তথ্য সংগ্রহ করা হয়।`,
          },
        },
        {
          key: "terms",
          content: {
            en: `### Terms and Conditions
Welcome to Ecare. By accessing this website, we assume you accept these terms and conditions in full.

#### Use License
Permission is granted to temporarily download one copy of the materials on Ecare's website for personal, non-commercial transitory viewing only.`,
            bn: `### ব্যবহারের শর্তাবলী
ইকেয়ার-এ আপনাকে স্বাগতম। এই ওয়েবসাইটে প্রবেশের মাধ্যমে আমরা ধরে নিচ্ছি যে আপনি ব্যবহারের শর্তাবলী সম্পূর্ণভাবে মেনে নিচ্ছেন।

#### ব্যবহারের লাইসেন্স
ব্যক্তিগত এবং অবাণিজ্যিক ব্যবহারের জন্য সাময়িকভাবে ইকেয়ার-এর ওয়েবসাইটের তথ্যাবলীর একটি কপি ডাউনলোডের অনুমতি প্রদান করা হলো।`,
          },
        },
        {
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
          },
        },
        {
          key: "home_solutions",
          content: {
            en: JSON.stringify([
              { name: "WP User Frontend", desc: "Ultimate Frontend Solution for WordPress", color: "text-[#00a884] hover:text-[#008c6e]", logoUrl: "/user-frontend-logo.svg", learnMoreUrl: "/services" },
              { name: "WP ERP", desc: "Open source ERP solution built specially for small businesses", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/erp-logo-color.svg", learnMoreUrl: "/services" },
              { name: "dokan", desc: "Build your dream multi vendor marketplace", color: "text-[#f35c7e] hover:text-[#d74567]", logoUrl: "/dokan-logo.svg", learnMoreUrl: "/services" },
              { name: "appsero", desc: "Perfect companion for WordPress developers", color: "text-[#06b6d4] hover:text-[#0891b2]", logoUrl: "/appsero-logo.svg", learnMoreUrl: "/services" },
              { name: "wePOS", desc: "Fastest POS System for WooCommerce", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/wepos-logo.png", learnMoreUrl: "/services" },
              { name: "WP Project Manager", desc: "Project Management tool for your team", color: "text-[#7a58f4] hover:text-[#5d3be3]", logoUrl: "/pm-logo.svg", learnMoreUrl: "/services" },
              { name: "Conversion Tracking", desc: "Track WooCommerce conversion data without any coding", color: "text-[#b06ab3] hover:text-[#97539a]", logoUrl: "/wct-logo.svg", learnMoreUrl: "/services" }
            ]),
            bn: JSON.stringify([
              { name: "WP User Frontend", desc: "ওয়ার্ডপ্রেসের জন্য সেরা ফ্রন্টএন্ড সমাধান", color: "text-[#00a884] hover:text-[#008c6e]", logoUrl: "/user-frontend-logo.svg", learnMoreUrl: "/services" },
              { name: "WP ERP", desc: "ক্ষুদ্র ব্যবসার জন্য বিশেষভাবে তৈরি ওপেন সোর্স ইআরপি সমাধান", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/erp-logo-color.svg", learnMoreUrl: "/services" },
              { name: "dokan", desc: "আপনার স্বপ্নের মাল্টি-ভেন্ডর মার্কেটপ্লেস তৈরি করুন", color: "text-[#f35c7e] hover:text-[#d74567]", logoUrl: "/dokan-logo.svg", learnMoreUrl: "/services" },
              { name: "appsero", desc: "ওয়ার্ডপ্রেস ডেভেলপারদের জন্য উপযুক্ত সহযোগী", color: "text-[#06b6d4] hover:text-[#0891b2]", logoUrl: "/appsero-logo.svg", learnMoreUrl: "/services" },
              { name: "wePOS", desc: "উকমার্সের জন্য দ্রুততম পিওএস সিস্টেম", color: "text-[#007cf5] hover:text-[#0064c7]", logoUrl: "/wepos-logo.png", learnMoreUrl: "/services" },
              { name: "WP Project Manager", desc: "আপনার টিমের জন্য প্রজেক্ট ম্যানেজমেন্ট টুল", color: "text-[#7a58f4] hover:text-[#5d3be3]", logoUrl: "/pm-logo.svg", learnMoreUrl: "/services" },
              { name: "Conversion Tracking", desc: "কোন কোডিং ছাড়াই উকমার্স কনভার্শন ডাটা ট্র্যাক করুন", color: "text-[#b06ab3] hover:text-[#97539a]", logoUrl: "/wct-logo.svg", learnMoreUrl: "/services" }
            ]),
          },
        },
        {
          key: "home_at_glance",
          content: {
            en: JSON.stringify([
              { val: "98+", lbl: "Team Members", icon: "Users" },
              { val: "20+", lbl: "Amazing Products", icon: "Puzzle" },
              { val: "8.5 M+", lbl: "Free Downloads", icon: "Download" },
              { val: "424k+", lbl: "Happy Customers", icon: "Smile" },
              { val: "160+", lbl: "Countries Worldwide", icon: "Globe" },
              { val: "15+", lbl: "Years of Journey", icon: "Award" }
            ]),
            bn: JSON.stringify([
              { val: "৯৮+", lbl: "টিম মেম্বার", icon: "Users" },
              { val: "২০+", lbl: "অসাধারণ প্রোডাক্ট", icon: "Puzzle" },
              { val: "৮.৫ মি.+", lbl: "ফ্রি ডাউনলোড", icon: "Download" },
              { val: "৪২৪কে+", lbl: "সন্তুষ্ট কাস্টমার", icon: "Smile" },
              { val: "১৬০+", lbl: "বিশ্বজুড়ে দেশসমূহ", icon: "Globe" },
              { val: "১৫+", lbl: "বছরের পথচলা", icon: "Award" }
            ]),
          },
        },
    ];

    for (const p of pagesToSeed) {
      const exists = await Page.findOne({ key: p.key });
      if (!exists) {
        await Page.create(p);
      }
    }

    // 2. Seed Team if empty
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      await Team.insertMany([
        {
          name: "Mahbub Alam",
          role: "Co-Founder & Tech Lead",
          slug: "mahbub-alam-en",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
          bio: "Full stack engineer specializing in highly optimized React applications and Node.js backend systems.",
          skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
          socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
          locale: "en",
        },
        {
          name: "মাহবুব আলম",
          role: "কো-ফাউন্ডার ও টেক লিড",
          slug: "mahbub-alam-bn",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
          bio: "হাইলি অপ্টিমাইজড রিয়্যাক্ট অ্যাপ্লিকেশন এবং নোড জেএস ব্যাকএন্ড সিস্টেমের অভিজ্ঞ ফুল স্ট্যাক ইঞ্জিনিয়ার।",
          skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
          socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
          locale: "bn",
        },
      ]);
    }

    // 3. Seed Testimonials if empty
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany([
        {
          author: "Rahat Chowdhury",
          company: "Pathao Ltd",
          quote: "Ecare delivered our complex admin panel with flawless execution and incredible speed.",
          rating: 5,
          locale: "en",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        },
        {
          author: "রাহাত চৌধুরী",
          company: "পাঠাও লিমিটেড",
          quote: "ইকেয়ার অত্যন্ত নিখুঁত কাজের মাধ্যমে আমাদের জটিল অ্যাডমিন প্যানেলটি দ্রুততম সময়ে ডেলিভারি করেছে।",
          rating: 5,
          locale: "bn",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        },
      ]);
    }

    // 4. Seed Portfolios if empty
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      await Portfolio.insertMany([
        {
          title: "SaaS Analytics Dashboard",
          slug: "saas-analytics-en",
          category: "Web App Development",
          cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
          gallery: [],
          content: "<p>A high-performance SaaS analytics dashboard displaying modern user retention metrics, live revenue reporting, and interactive visualizations built with Next.js and Tailwind CSS.</p>",
          locale: "en",
          price: 24,
          supportPrice: 7.13,
          sales: 1442,
          rating: 5.0,
          ratingsCount: 101,
          features: ["Quality checked by Ecare", "Future updates included", "6 months support from Ecare"],
          demoUrl: "/services",
          videoUrl: "",
        },
        {
          title: "সাস অ্যানালিটিক্স ড্যাশবোর্ড",
          slug: "saas-analytics-bn",
          category: "ওয়েব অ্যাপ্লিকেশন",
          cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
          gallery: [],
          content: "<p>নেক্সট জেএস এবং টেলউইন্ড সিএসএস দিয়ে তৈরি আধুনিক ইউজার রিটেনশন মেট্রিক্স, লাইভ রেভিনিউ রিপোর্টিং এবং ইন্টারেক্টিভ ভিজ্যুয়ালাইজেশন প্রদর্শনকারী একটি হাই-পারফরম্যান্স সাস অ্যানালিটিক্স ড্যাশবোর্ড।</p>",
          locale: "bn",
          price: 24,
          supportPrice: 7.13,
          sales: 1442,
          rating: 5.0,
          ratingsCount: 101,
          features: ["ইকেয়ার দ্বারা মান যাচাইকৃত", "ভবিষ্যত আপডেট অন্তর্ভুক্ত", "ইকেয়ার থেকে ৬ মাসের সাপোর্ট"],
          demoUrl: "/services",
          videoUrl: "",
        },
      ]);
    }

    // 5. Seed Blogs if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany([
        {
          title: "Building Dynamic Node.js Apps on cPanel",
          slug: "cpanel-nodejs-apps",
          content: `Deploying a Next.js application on cPanel requires a standard Node.js Setup. By using MongoDB Atlas, developers can separate data persistence from shared hosting files.

#### Key Steps
1. Create a MongoDB Atlas cluster.
2. Configure environmental variables.
3. Hook up Mongoose within API routes.`,
          excerpt: "Learn how to successfully host Next.js apps connected to MongoDB inside cPanel Node environments.",
          author: "mahbub-alam-en",
          featuredImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600",
          locale: "en",
          draft: false,
          seo: { title: "cPanel Node.js Host Guide", description: "Hosting Next.js with MongoDB on cPanel" },
        },
        {
          title: "সিপ্যানেলে ডাইনামিক নোড জেএস অ্যাপস হোস্ট করার নিয়ম",
          slug: "cpanel-nodejs-apps-bn",
          content: `সিপ্যানেলে নেক্সট জেএস অ্যাপ্লিকেশন রান করার জন্য স্ট্যান্ডার্ড নোড জেএস সেটআপের প্রয়োজন হয়। মঙ্গোডিবি অ্যাটলাস ব্যবহার করে সহজেই ক্লাউড ডাটাবেস সংযুক্ত করা সম্ভব।

#### মূল পদক্ষেপসমূহ
১. মঙ্গোডিবি অ্যাটলাসে ক্লাস্টার তৈরি।
২. এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগারেশন।
৩. এপিআই রাউটে মাঙ্গুস ইন্টিগ্রেশন।`,
          excerpt: "সিপ্যানেল নোড জেএস হোস্টিংয়ে মঙ্গোডিবির সাথে নেক্সট জেএস অ্যাপলিকেশন চালুর সহজ গাইডলাইন।",
          author: "mahbub-alam-bn",
          featuredImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600",
          locale: "bn",
          draft: false,
          seo: { title: "সিপ্যানেল নোড জেএস হোস্ট গাইড", description: "সিপ্যানেল হোস্টিংয়ে নেক্সট জেএস ও মঙ্গোডিবি" },
        },
      ]);
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
