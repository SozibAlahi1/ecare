import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import EzyCheckoutClient from "../ezy-checkout/EzyCheckoutClient";
import dbConnect from "@/lib/db";
import { Page, Portfolio } from "@/lib/models";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageParams {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { locale, slug } = await params;
  
  const CORE_PAGES = ["about", "terms", "privacy", "contact_info", "bkash_settings", "smtp_settings", "home_solutions", "home_at_glance", "offer_popup"];
  if (CORE_PAGES.includes(slug)) {
    return {};
  }

  try {
    await dbConnect();
    const page = await Page.findOne({ key: slug }).lean();
    if (page && page.content) {
      const rawContent = page.content[locale as "en" | "bn"] || page.content.en || "{}";
      const pageData = JSON.parse(rawContent);
      return {
        title: `${pageData.heroTitle || "Landing Page"} - Ecare`,
        description: pageData.heroSub || "Custom landing page on Ecare website manager.",
      };
    }
  } catch (e) {
    // fallback
  }
  return {
    title: "Landing Page - Ecare",
  };
}

export default async function DynamicLandingPage({ params }: PageParams) {
  const { locale, slug } = await params;
  
  // Protect core settings pages from being loaded as public landing pages
  const CORE_PAGES = ["about", "terms", "privacy", "contact_info", "bkash_settings", "smtp_settings", "home_solutions", "home_at_glance", "offer_popup"];
  if (CORE_PAGES.includes(slug)) {
    notFound();
  }

  let pageData = null;
  let productData = null;

  try {
    await dbConnect();
    const page = await Page.findOne({ key: slug }).lean();
    if (!page || !page.content) {
      notFound();
    }

    // Verify it is a landing page config
    let isLanding = false;
    try {
      const parsedEn = JSON.parse(page.content.en);
      if (parsedEn && typeof parsedEn === "object" && "heroTitle" in parsedEn) {
        isLanding = true;
      }
    } catch (e) {
      // not a landing page
    }

    if (!isLanding) {
      notFound();
    }

    const rawContent = page.content[locale as "en" | "bn"] || page.content.en || "{}";
    pageData = JSON.parse(rawContent);

    // Get the product data for checkout integration
    const product = await Portfolio.findOne({ slug: { $in: ["ezy-checkout", "/ezy-checkout"] } }).lean();
    if (product) {
      productData = JSON.parse(JSON.stringify(product));
    }
  } catch (error) {
    console.error("Failed to load dynamic landing page from DB:", error);
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        <EzyCheckoutClient initialData={pageData} dbProduct={productData} />
      </main>
      <Footer />
    </>
  );
}
