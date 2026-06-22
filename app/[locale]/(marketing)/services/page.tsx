import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Code, Cloud, Layers, Cpu, Globe, CheckCircle, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

const SERVICES_DATA = [
  {
    slug: "custom-software",
    icon: Code,
    titleEn: "Custom Software Development",
    titleBn: "কাস্টম সফটওয়্যার ডেভেলপমেন্ট",
    descEn: "High-performance web applications built with Next.js, React, and modular clean APIs.",
    descBn: "নেক্সট.জেএস, রিঅ্যাক্ট এবং মডুলার ক্লিন এপিআই দ্বারা নির্মিত উচ্চ-ক্ষমতাসম্পন্ন ওয়েব অ্যাপ্লিকেশন।"
  },
  {
    slug: "cloud-engineering",
    icon: Cloud,
    titleEn: "Cloud & Infrastructure Engineering",
    titleBn: "ক্লাউড ও ইনফ্রাস্ট্রাকচার ইঞ্জিনিয়ারিং",
    descEn: "Hyper-scalable, secure edge deployments on Cloudflare Workers and global CDNs.",
    descBn: "ক্লাউডফ্লেয়ার ওয়ার্কার্স এবং গ্লোবাল সিডিএন-এ হাইপার-স্কেলেবল ও নিরাপদ এজ ডেপ্লয়মেন্ট।"
  },
  {
    slug: "design-systems",
    icon: Layers,
    titleEn: "White-Label Design Systems",
    titleBn: "হোয়াইট-লেবেল ডিজাইন সিস্টেম",
    descEn: "Accessible, theme-aware component libraries optimized for complete brand customizability.",
    descBn: "সম্পূর্ণ ব্র্যান্ড কাস্টমাইজেশনের জন্য অপ্টিমাইজড অ্যাক্সেসিবল ও থিম-সচেতন কম্পোনেন্ট লাইব্রেরি।"
  },
  {
    slug: "system-integration",
    icon: Cpu,
    titleEn: "Legacy System Modernization",
    titleBn: "লিগ্যাসি সিস্টেম আধুনিকীকরণ",
    descEn: "Refactoring legacy code bases to serverless and modern modular standards.",
    descBn: "লিগ্যাসি কোড বেসকে সার্ভারহীন এবং আধুনিক মডুলার স্ট্যান্ডার্ডে রিফ্যাক্টর করা।"
  }
];

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Services");

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Section className="relative overflow-x-clip py-12 md:py-16 border-b border-border/50 bg-[#f8fafc]/60 dark:bg-[#0b0f19]/40">
          {/* Glowing background blobs to match homepage UI consistency */}
          <div className="absolute top-[-20%] left-[-15%] w-[45%] aspect-square bg-cyan-200/35 dark:bg-cyan-500/5 rounded-full blur-[120px] md:blur-[160px] pointer-events-none" />
          <div className="absolute top-[-10%] right-[-15%] w-[55%] aspect-square bg-purple-200/35 dark:bg-purple-500/5 rounded-full blur-[140px] md:blur-[180px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[25%] w-[35%] aspect-square bg-pink-200/25 dark:bg-pink-500/5 rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />
          
          <Container className="text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider animate-pulse-slow">
              <Zap className="w-3.5 h-3.5" />
              {t("title")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground via-foreground/90 to-primary/80 leading-none">
              {t("title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </Container>
        </Section>

        <Section padding="md">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES_DATA.map((service) => {
                const Icon = service.icon;
                const title = locale === "bn" ? service.titleBn : service.titleEn;
                const desc = locale === "bn" ? service.descBn : service.descEn;

                return (
                  <Card key={service.slug} className="flex flex-col justify-between hover:border-primary/50 transition-all duration-300">
                    <CardHeader className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                        <CardDescription className="text-base">{desc}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6 flex justify-between items-center">
                      <Button variant="outline" asChild>
                        <Link href={`/services/${service.slug}`}>{t("viewDetails")}</Link>
                      </Button>
                      <Button variant="glow" asChild>
                        <Link href="/contact">{t("contactBtn")}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
