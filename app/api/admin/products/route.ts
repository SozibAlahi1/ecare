import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Portfolio } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    const query: any = {};
    if (locale) query.locale = locale;

    const portfolios = await Portfolio.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: portfolios });
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

    const {
      category,
      cover,
      gallery,
      caseStudy,
      price,
      supportPrice,
      sales,
      rating,
      ratingsCount,
      demoUrl,
      videoUrl,
      icon,
      downloadFile,
      productType,
      en,
      bn
    } = body;

    if (!category || !cover) {
      return NextResponse.json({ success: false, error: "Missing required metadata fields" }, { status: 400 });
    }

    if ((!en || !en.title) && (!bn || !bn.title)) {
      return NextResponse.json({ success: false, error: "At least one product version (English or Bengali) must be provided" }, { status: 400 });
    }

    const translationGroupId = "group_" + Math.random().toString(36).substring(2, 15);
    const createdProducts = [];

    // Create English version
    if (en && en.title) {
      if (!en.slug) {
        return NextResponse.json({ success: false, error: "English version requires a slug" }, { status: 400 });
      }
      const existing = await Portfolio.findOne({ slug: en.slug });
      if (existing) {
        return NextResponse.json({ success: false, error: `English slug '${en.slug}' already exists` }, { status: 400 });
      }
      const productEn = await Portfolio.create({
        title: en.title,
        slug: en.slug,
        category,
        cover,
        gallery: gallery || [],
        caseStudy: caseStudy || "",
        content: en.content || "",
        excerpt: en.excerpt || "",
        price: price ?? 24,
        supportPrice: supportPrice ?? 7.13,
        sales: sales ?? 1442,
        rating: rating ?? 5.0,
        ratingsCount: ratingsCount ?? 101,
        features: en.features || ["Quality checked by Ecare", "Future updates included", "6 months support from Ecare"],
        demoUrl: demoUrl || "/services",
        videoUrl: videoUrl || "",
        icon: icon || "",
        downloadFile: downloadFile || "",
        productType: productType || "external",
        locale: "en",
        translationGroupId
      });
      createdProducts.push(productEn);
    }

    // Create Bengali version
    if (bn && bn.title) {
      if (!bn.slug) {
        return NextResponse.json({ success: false, error: "Bengali version requires a slug" }, { status: 400 });
      }
      const existing = await Portfolio.findOne({ slug: bn.slug });
      if (existing) {
        return NextResponse.json({ success: false, error: `Bengali slug '${bn.slug}' already exists` }, { status: 400 });
      }
      const productBn = await Portfolio.create({
        title: bn.title,
        slug: bn.slug,
        category,
        cover,
        gallery: gallery || [],
        caseStudy: caseStudy || "",
        content: bn.content || "",
        excerpt: bn.excerpt || "",
        price: price ?? 24,
        supportPrice: supportPrice ?? 7.13,
        sales: sales ?? 1442,
        rating: rating ?? 5.0,
        ratingsCount: ratingsCount ?? 101,
        features: bn.features || ["Quality checked by Ecare", "Future updates included", "6 months support from Ecare"],
        demoUrl: demoUrl || "/services",
        videoUrl: videoUrl || "",
        icon: icon || "",
        downloadFile: downloadFile || "",
        productType: productType || "external",
        locale: "bn",
        translationGroupId
      });
      createdProducts.push(productBn);
    }

    return NextResponse.json({ success: true, data: createdProducts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
