import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Portfolio } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Portfolio.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
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

    let groupProducts = [];
    let translationGroupId = "";

    if (id.startsWith("group_")) {
      translationGroupId = id;
      groupProducts = await Portfolio.find({ translationGroupId });
    } else {
      const firstProduct = await Portfolio.findById(id);
      if (!firstProduct) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      if (firstProduct.translationGroupId) {
        translationGroupId = firstProduct.translationGroupId;
        groupProducts = await Portfolio.find({ translationGroupId });
      } else {
        translationGroupId = "group_" + Math.random().toString(36).substring(2, 15);
        firstProduct.translationGroupId = translationGroupId;
        await firstProduct.save();
        groupProducts = [firstProduct];
      }
    }

    // Handle English version
    const existingEn = groupProducts.find(p => p.locale === "en");
    if (en && en.title) {
      if (existingEn) {
        await Portfolio.findByIdAndUpdate(existingEn._id, {
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
          productType: productType || "external"
        });
      } else {
        await Portfolio.create({
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
      }
    } else if (existingEn) {
      await Portfolio.findByIdAndDelete(existingEn._id);
    }

    // Handle Bengali version
    const existingBn = groupProducts.find(p => p.locale === "bn");
    if (bn && bn.title) {
      if (existingBn) {
        await Portfolio.findByIdAndUpdate(existingBn._id, {
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
          productType: productType || "external"
        });
      } else {
        await Portfolio.create({
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
      }
    } else if (existingBn) {
      await Portfolio.findByIdAndDelete(existingBn._id);
    }

    return NextResponse.json({ success: true, message: "Product translation group updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    if (id.startsWith("group_")) {
      const result = await Portfolio.deleteMany({ translationGroupId: id });
      return NextResponse.json({ success: true, message: `Deleted ${result.deletedCount} products in the translation group` });
    }

    const firstProduct = await Portfolio.findById(id);
    if (!firstProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    if (firstProduct.translationGroupId) {
      const result = await Portfolio.deleteMany({ translationGroupId: firstProduct.translationGroupId });
      return NextResponse.json({ success: true, message: `Deleted ${result.deletedCount} products in the translation group` });
    }

    await Portfolio.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
