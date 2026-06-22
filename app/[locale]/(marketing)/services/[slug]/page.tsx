import { notFound } from "next/navigation";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { 
  Code, 
  Cloud, 
  Layers, 
  Cpu, 
  ArrowLeft, 
  CheckCircle,
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

export const dynamic = "force-dynamic";

const SERVICES_DETAIL = {
  // Services
  "custom-software": {
    icon: Code,
    titleEn: "Custom Software Development",
    titleBn: "কাস্টম সফটওয়্যার ডেভেলপমেন্ট",
    descEn: "We construct enterprise-grade frontend applications and highly optimized API layers.",
    descBn: "আমরা এন্টারপ্রাইজ-গ্রেড ফ্রন্টএন্ড অ্যাপ্লিকেশন এবং অত্যন্ত অপ্টিমাইজড এপিআই লেয়ার তৈরি করি।",
    featuresEn: ["Next.js App Router Integration", "TypeScript Strict Compliance", "Vibrant Theme Engine Integration", "Tailwind CSS Performance Budgets"],
    featuresBn: ["নেক্সট.জেএস অ্যাপ রাউটার ইন্টিগ্রেশন", "টাইপস্ক্রিপ্ট কঠোর নিয়ম মেনে চলা", "প্রাণবন্ত থিম ইঞ্জিন ইন্টিগ্রেশন", "টেইলউইন্ড সিএসএস পারফরম্যান্স বাজেট"]
  },
  "cloud-engineering": {
    icon: Cloud,
    titleEn: "Cloud & Infrastructure Engineering",
    titleBn: "ক্লাউড ও ইনফ্রাস্ট্রাকচার ইঞ্জিনিয়ারিং",
    descEn: "Deploy serverless nodes and static indexes globally closer to your consumers.",
    descBn: "আপনার ভোক্তাদের আরও কাছাকাছি বিশ্বব্যাপী সার্ভারহীন নোড এবং স্ট্যাটিক ইনডেক্স স্থাপন করুন।",
    featuresEn: ["Cloudflare Workers & KV Storage", "Zero-cold starts execution", "Pagefind localized indexes", "Wrangler automation deployments"],
    featuresBn: ["ক্লাউডফ্লেয়ার ওয়ার্কার্স ও কেভি স্টোরেজ", "জিরো-কোল্ড স্টার্টস এক্সিকিউশন", "পেজফাইন্ড স্থানীয় সূচকসমূহ", "র‍্যাঙ্গলার অটোমেশন ডেপ্লয়মেন্ট"]
  },
  "design-systems": {
    icon: Layers,
    titleEn: "White-Label Design Systems",
    titleBn: "হোয়াইট-লেবেল ডিজাইন সিস্টেম",
    descEn: "Build customizable theme states and interactive utility blocks for massive scale.",
    descBn: "ব্যাপক স্কেলের জন্য কাস্টমাইজযোগ্য থিম স্টেট এবং ইন্টারেক্টিভ ইউটিলিটি ব্লক তৈরি করুন।",
    featuresEn: ["Sleek custom HSL color maps", "Radix-ui components access", "Dark and Light zero-flash script", "Tailwind v4 tokens engine"],
    featuresBn: ["মসৃণ কাস্টম এইচএসএল কালার ম্যাপ", "র‍্যাডিক্স-ইউআই কম্পোনেন্ট অ্যাক্সেস", "ডার্ক এবং লাইট জিরো-ফ্ল্যাশ স্ক্রিপ্ট", "টেইলউইন্ড ভি৪ টোকেন ইঞ্জিন"]
  },
  "system-integration": {
    icon: Cpu,
    titleEn: "Legacy System Modernization",
    titleBn: "লিগ্যাসি সিস্টেম আধুনিকীকরণ",
    descEn: "Upgrade legacy code blocks to standard cloud-friendly architectures without downtime.",
    descBn: "ডাউনটাইম ছাড়াই লিগ্যাসি কোড ব্লকগুলোকে স্ট্যান্ডার্ড ক্লাউড-বান্ধব আর্কিটেকচারে আপগ্রেড করুন।",
    featuresEn: ["Rigid automated unit testing", "Refactoring and cleaning technical debt", "API bridging layers", "Playwright E2E security audit"],
    featuresBn: ["কোর স্বয়ংক্রিয় ইউনিট টেস্টিং", "টেকনিক্যাল ঋণ রিফ্যাক্টরিং এবং পরিষ্কারকরণ", "এপিআই ব্রিজিং লেয়ার", "প্লেরাইট ইটুই নিরাপত্তা অডিট"]
  },

  // Products
  "dokan-multivendor": {
    icon: Store,
    titleEn: "Dokan Multivendor",
    titleBn: "Dokan Multivendor",
    descEn: "Build your dream multi vendor marketplace using WooCommerce.",
    descBn: "আপনার স্বপ্নের মাল্টি-ভেন্ডর মার্কেটপ্লেস তৈরি করুন উওকমার্স দিয়ে।",
    featuresEn: ["Multi-vendor commission setup", "Independent vendor dashboards", "Comprehensive shipping & tax options", "E-commerce coupon & review systems"],
    featuresBn: ["মাল্টি-ভেন্ডর কমিশন সেটআপ", "স্বাধীন বিক্রেতা ড্যাশবোর্ড", "বিস্তারিত শিপিং ও ট্যাক্স অপশন", "কুপন ও রিভিউ সিস্টেম"]
  },
  "wp-user-frontend-pro": {
    icon: UserCheck,
    titleEn: "WP User Frontend Pro",
    titleBn: "WP User Frontend Pro",
    descEn: "Ultimate frontend dashboard solution for WordPress registration, profiles & post submissions.",
    descBn: "ওয়ার্ডপ্রেস রেজিস্ট্রেশন, প্রোফাইল এবং ফ্রন্টএন্ড থেকে পোস্ট সাবমিশন করার সেরা সমাধান।",
    featuresEn: ["Frontend post submission forms", "User profile builder & registration", "Content restrictions & subscriptions", "Drag and drop form creator"],
    featuresBn: ["ফ্রন্টএন্ড পোস্ট সাবমিশন ফর্ম", "ইউজার প্রোফাইল বিল্ডার ও রেজিস্ট্রেশন", "কন্টেন্ট রেস্ট্রিকশন ও সাবস্ক্রিপশন", "ড্র্যাগ অ্যান্ড ড্রপ ফর্ম ক্রিয়েটর"]
  },
  "happy-addons": {
    icon: Smile,
    titleEn: "Happy Addons",
    titleBn: "Happy Addons",
    descEn: "Powerful Elementor widgets and features to create beautiful, responsive websites.",
    descBn: "অসাধারণ ও রেসপনসিভ ওয়েবসাইট তৈরির জন্য শক্তিশালী এলিমেন্টর উইজেট ও প্রিসেট সমূহ।",
    featuresEn: ["100+ creative Elementor widgets", "Floating effects & CSS animations", "Presets, section nesting & copy-paste", "Cross-domain copy paste feature"],
    featuresBn: ["১০০+ ক্রিয়েটিভ এলিমেন্টর উইজেট", "ফ্লোটিং ইফেক্টস ও সিএসএস অ্যানিমেশন", "প্রিসেট, সেকশন নেস্টিং ও কপি-পেস্ট", "ক্রস-ডোমেন কপি পেস্ট ফিচার"]
  },
  "wp-project-manager-pro": {
    icon: FolderKanban,
    titleEn: "WP Project Manager Pro",
    titleBn: "WP Project Manager Pro",
    descEn: "Full-scale project management tool to organize tasks, track time, and collaborate in teams.",
    descBn: "টাস্ক অর্গানাইজ করা, সময় ট্র্যাকিং এবং টিমে সমন্বয় করার পূর্ণাঙ্গ প্রজেক্ট ম্যানেজমেন্ট টুল।",
    featuresEn: ["Gantt charts & Kanban boards", "Time tracking & task lists", "Milestones & file sharing tools", "Interactive team collaboration"],
    featuresBn: ["গ্যান্ট চার্ট ও কানবান বোর্ড", "টাইম ট্র্যাকিং ও টাস্ক লিস্ট", "মাইলস্টোন ও ফাইল শেয়ারিং টুল", "ইন্টারেক্টিভ টিম কোলাবরেশন"]
  },
  "wemail": {
    icon: Mail,
    titleEn: "weMail",
    titleBn: "weMail",
    descEn: "Simplified email marketing tool for WordPress to send campaigns and manage subscribers.",
    descBn: "ওয়ার্ডপ্রেসের মাধ্যমে অত্যন্ত সহজ উপায়ে ইমেল মার্কেটিং ক্যাম্পেইন ও সাবস্ক্রাইবার পরিচালনা করুন।",
    featuresEn: ["Multiple email sending gateways", "Responsive email template builder", "Audience segmenting & analytics", "Automated email campaigns"],
    featuresBn: ["একাধিক ইমেল সেন্ডিং গেটওয়ে", "রেসপনসিভ ইমেল টেমপ্লেট বিল্ডার", "অডিয়েন্স সেগমেন্টেশন ও অ্যানালিটিক্স", "স্বয়ংক্রিয় ইমেল ক্যাম্পেইন"]
  },
  "wp-erp": {
    icon: Building2,
    titleEn: "WP ERP",
    titleBn: "WP ERP",
    descEn: "Enterprise Resource Planning system to automate HR, CRM, and Accounting operations.",
    descBn: "আপনার কোম্পানির এইচআর, সিআরএম এবং অ্যাকাউন্টিং কার্যক্রম স্বয়ংক্রিয় করার পূর্ণাঙ্গ ইআরপি সিস্টেম।",
    featuresEn: ["HR Management & employee profile", "CRM for customer lead tracking", "Accounting module & reporting", "Leave management & workflows"],
    featuresBn: ["এইচআর ম্যানেজমেন্ট ও কর্মচারী প্রোফাইল", "কাস্টমার লিড ট্র্যাকিংয়ের জন্য সিআরএম", "অ্যাকাউন্টিং মডিউল ও রিপোর্টিং", "ছুটি ব্যবস্থাপনা ও ওয়ার্কফ্লো"]
  },
  "appsero": {
    icon: BarChart3,
    titleEn: "Appsero",
    titleBn: "Appsero",
    descEn: "WP analytics, license management, and automated deployment tool for developers.",
    descBn: "ওয়ার্ডপ্রেস ডেভেলপারদের জন্য অ্যানালিটিক্স, লাইসেন্সিং ও স্বয়ংক্রিয় ডিপ্লয়মেন্ট প্ল্যাটফর্ম।",
    featuresEn: ["Detailed analytics for themes/plugins", "Software license management", "Automatic deployment to WordPress.org", "Deactivation stats & feedback loops"],
    featuresBn: ["থিম/প্লাগইনের জন্য বিস্তারিত অ্যানালিটিক্স", "সফটওয়্যার লাইসেন্স ব্যবস্থাপনা", "ওয়ার্ডপ্রেস ওআরজি-তে স্বয়ংক্রিয় ডিপ্লয়মেন্ট", "ডিঅ্যাক্টিভেশন পরিসংখ্যান ও ফিডব্যাক লুপ"]
  },
  "wepos": {
    icon: Tablet,
    titleEn: "wePOS",
    titleBn: "wePOS",
    descEn: "Fast, responsive Point of Sale system for WooCommerce stores to manage outlets.",
    descBn: "উওকমার্স স্টোরের জন্য আউটলেট ও কাউন্টার পরিচালনা করার দ্রুত ও রেসপনসিভ পিওএস (POS) সিস্টেম।",
    featuresEn: ["Responsive POS user interface", "Barcode scanner integration", "Multiple outlet & counter management", "Offline receipt generation & printing"],
    featuresBn: ["রেসপনসিভ পিওএস ইউজার ইন্টারফেস", "বারকোড স্ক্যানার ইন্টিগ্রেশন", "একাধিক আউটলেট ও কাউন্টার ম্যানেজমেন্ট", "অফলাইন রসিদ জেনারেশন ও প্রিন্টিং"]
  },
  "wedocs": {
    icon: FileText,
    titleEn: "weDocs",
    titleBn: "weDocs",
    descEn: "Create beautiful, searchable, and structured documentation pages for products.",
    descBn: "আপনার পণ্যের জন্য চমৎকার, সার্চযোগ্য এবং সুগঠিত ডকুমেন্টেশন পেজ তৈরি করুন।",
    featuresEn: ["Interactive multi-level organization", "Fast Ajax live search capability", "SEO-optimized documentation pages", "Feedback helpful thumbs voting"],
    featuresBn: ["ইন্টারেক্টিভ মাল্টি-লেভেল অর্গানাইজেশন", "দ্রুত অ্যাজ্যাক্স লাইভ সার্চ ক্ষমতা", "এসইও-অপ্টিমাইজড ডকুমেন্টেশন পেজ", "ফিডব্যাক হেল্পফুল থাম্বস ভোটিং"]
  },
  "flywp": {
    icon: Send,
    titleEn: "Ecare Host (FlyWP)",
    titleBn: "Ecare Host (FlyWP)",
    descEn: "Customizable, developer-focused managed WordPress cloud hosting server provider.",
    descBn: "ডেভেলপার-বান্ধব এবং দ্রুত গতির কাস্টমাইজযোগ্য ওয়ার্ডপ্রেস ক্লাউড হোস্টিং ও সার্ভার সমাধান।",
    featuresEn: ["Server provisioning on AWS/DigitalOcean", "Automatic SSL, firewall & updates", "Site cloning & staging setups", "Daily backups & server monitoring"],
    featuresBn: ["এডব্লিউএস/ডিজিটালওশেন-এ সার্ভার প্রোভিশনিং", "স্বয়ংক্রিয় এসএসএল, ফায়ারওয়াল ও আপডেট", "সাইট ক্লোনিং ও স্টেজিং সেটআপ", "দৈনিক ব্যাকআপ ও সার্ভার মনিটরিং"]
  },
  "inboxwp": {
    icon: Inbox,
    titleEn: "InboxWP",
    titleBn: "InboxWP",
    descEn: "Ensure high-deliverability and timely delivery for transactional WordPress emails.",
    descBn: "ওয়ার্ডপ্রেসের গুরুত্বপূর্ণ ইমেলগুলোর শতভাগ সময়মতো ইনবক্সে পৌঁছানো নিশ্চিত করুন।",
    featuresEn: ["High email deliverability rates", "Transactional email delivery", "Spam filter checks & compliance", "Real-time delivery logs & tracking"],
    featuresBn: ["উচ্চ ইমেল ডেলিভারি রেট", "ট্রানজ্যাকশনাল ইমেল ডেলিভারি", "স্প্যাম ফিল্টার চেক ও কমপ্লায়েন্স", "রিয়েল-টাইম ডেলিভারি লগ ও ট্র্যাকিং"]
  },
  "klasio": {
    icon: GraduationCap,
    titleEn: "Klasio",
    titleBn: "Klasio",
    descEn: "Launch and manage online courses, lectures, student dashboards, and lessons instantly.",
    descBn: "অনলাইন কোর্স, লেকচার এবং পেমেন্ট ম্যানেজমেন্ট সহ তাৎক্ষণিকভাবে লার্নিং সাইট তৈরি করুন।",
    featuresEn: ["Course creation & lecture manager", "Interactive quizzes & assignments", "Payment gateway configurations", "Student progress dashboards"],
    featuresBn: ["কোর্স তৈরি ও লেকচার ম্যানেজার", "ইন্টারেক্টিভ কুইজ ও অ্যাসাইনমেন্ট", "পেমেন্ট গেটওয়ে কনফিগারেশন", "শিক্ষার্থীদের অগ্রগতি ড্যাশবোর্ড"]
  }
};

export async function generateStaticParams() {
  return Object.keys(SERVICES_DETAIL).map((slug) => ({ slug }));
}

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  const service = SERVICES_DETAIL[slug as keyof typeof SERVICES_DETAIL];

  if (!service) {
    notFound();
  }

  const title = locale === "bn" ? service.titleBn : service.titleEn;
  const desc = locale === "bn" ? service.descBn : service.descEn;
  const features = locale === "bn" ? service.featuresBn : service.featuresEn;
  const Icon = service.icon;

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Section className="border-b border-border bg-muted/10 py-12">
          <Container className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">{desc}</p>
              </div>
            </div>
          </Container>
        </Section>

        <Section padding="md">
          <Container className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Key Capabilities & Deliverables</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center space-y-4">
              <h3 className="text-xl font-bold">Interested in this?</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">Let's schedule a brief consultation to map your requirements and get started.</p>
              <Button variant="glow" size="lg" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
