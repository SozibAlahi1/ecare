import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wifi, Wallet, Award, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface CareersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Careers");

  // Load static positions
  const positions = [
    {
      title: locale === "bn" ? "সিনিয়র নেক্সট.জেএস ডেভেলপার" : "Senior Next.js Developer",
      type: locale === "bn" ? "ফুল-টাইম / রিমোট" : "Full-Time / Remote",
      desc: locale === "bn" 
        ? "এন্টারপ্রাইজ স্কেল ডিজিটাল প্রোডাক্টের ফ্রন্টএন্ড বাস্তবায়নে নেতৃত্ব দিন।" 
        : "Lead the frontend implementation of enterprise scale digital products."
    },
    {
      title: locale === "bn" ? "ক্লাউড সলিউশনস আর্কিটেক্ট" : "Cloud Solutions Architect",
      type: locale === "bn" ? "ফুল-টাইম / রিমোট" : "Full-Time / Remote",
      desc: locale === "bn"
        ? "ক্লাউডফ্লেয়ার এবং এডাব্লুএস-এ নিরাপদ, শক্তিশালী অবকাঠামো ডিজাইন করুন।"
        : "Design secure, robust infrastructure workflows on Cloudflare and AWS."
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Section className="bg-radial from-primary/10 via-transparent to-transparent py-16 md:py-24">
          <Container className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{t("title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
          </Container>
        </Section>

        {/* Perks */}
        <Section padding="md" className="border-t border-border">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("perks")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center p-6 space-y-3 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Wifi className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">{t("perk1Title")}</h3>
                <p className="text-sm text-muted-foreground">{t("perk1Desc")}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 space-y-3 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">{t("perk2Title")}</h3>
                <p className="text-sm text-muted-foreground">{t("perk2Desc")}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 space-y-3 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Continuous Learning</h3>
                <p className="text-sm text-muted-foreground">Unlimited access to specialized training courses, certifications, and books.</p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Open Positions */}
        <Section padding="md" className="bg-muted/10 border-t border-border">
          <Container className="max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("openPositions")}</h2>
            </div>
            <div className="space-y-6">
              {positions.map((pos, idx) => (
                <Card key={idx} className="hover:border-primary/50 transition-all duration-300">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold">{pos.title}</CardTitle>
                      <CardDescription className="text-primary font-medium text-sm">{pos.type}</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/contact">
                        {t("applyNow")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm">{pos.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
