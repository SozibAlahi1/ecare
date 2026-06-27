import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Testimonial } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    const query: any = {};
    if (locale) query.locale = locale;

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials });
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

    const { logo, avatar, rating, videoUrl, en, bn } = body;

    if ((!en || !en.author) && (!bn || !bn.author)) {
      return NextResponse.json({ success: false, error: "At least one testimonial version (English or Bengali) must be provided" }, { status: 400 });
    }

    const translationGroupId = "group_" + Math.random().toString(36).substring(2, 15);
    const createdTestimonials = [];

    // Create English version
    if (en && en.author) {
      if (!en.company) {
        return NextResponse.json({ success: false, error: "English version requires author and company" }, { status: 400 });
      }
      const testimonialEn = await Testimonial.create({
        author: en.author,
        company: en.company,
        quote: en.quote || "",
        logo: logo || "",
        avatar: avatar || "",
        rating: rating || 5,
        videoUrl: videoUrl || "",
        locale: "en",
        translationGroupId
      });
      createdTestimonials.push(testimonialEn);
    }

    // Create Bengali version
    if (bn && bn.author) {
      if (!bn.company) {
        return NextResponse.json({ success: false, error: "Bengali version requires author and company" }, { status: 400 });
      }
      const testimonialBn = await Testimonial.create({
        author: bn.author,
        company: bn.company,
        quote: bn.quote || "",
        logo: logo || "",
        avatar: avatar || "",
        rating: rating || 5,
        videoUrl: videoUrl || "",
        locale: "bn",
        translationGroupId
      });
      createdTestimonials.push(testimonialBn);
    }

    return NextResponse.json({ success: true, data: createdTestimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
