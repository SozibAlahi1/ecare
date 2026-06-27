import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Testimonial } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: testimonial });
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
    const { logo, avatar, rating, videoUrl, en, bn } = body;

    let groupTestimonials = [];
    let translationGroupId = "";

    if (id.startsWith("group_")) {
      translationGroupId = id;
      groupTestimonials = await Testimonial.find({ translationGroupId });
    } else {
      const firstTestimonial = await Testimonial.findById(id);
      if (!firstTestimonial) {
        return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
      }
      if (firstTestimonial.translationGroupId) {
        translationGroupId = firstTestimonial.translationGroupId;
        groupTestimonials = await Testimonial.find({ translationGroupId });
      } else {
        translationGroupId = "group_" + Math.random().toString(36).substring(2, 15);
        firstTestimonial.translationGroupId = translationGroupId;
        await firstTestimonial.save();
        groupTestimonials = [firstTestimonial];
      }
    }

    // Handle English version
    const existingEn = groupTestimonials.find(t => t.locale === "en");
    if (en && en.author) {
      if (existingEn) {
        await Testimonial.findByIdAndUpdate(existingEn._id, {
          author: en.author,
          company: en.company,
          quote: en.quote || "Video Review",
          logo: logo || "",
          avatar: avatar || "",
          rating: rating || 5,
          videoUrl: videoUrl || ""
        });
      } else {
        await Testimonial.create({
          author: en.author,
          company: en.company,
          quote: en.quote || "Video Review",
          logo: logo || "",
          avatar: avatar || "",
          rating: rating || 5,
          videoUrl: videoUrl || "",
          locale: "en",
          translationGroupId
        });
      }
    } else if (existingEn) {
      await Testimonial.findByIdAndDelete(existingEn._id);
    }

    // Handle Bengali version
    const existingBn = groupTestimonials.find(t => t.locale === "bn");
    if (bn && bn.author) {
      if (existingBn) {
        await Testimonial.findByIdAndUpdate(existingBn._id, {
          author: bn.author,
          company: bn.company,
          quote: bn.quote || "Video Review",
          logo: logo || "",
          avatar: avatar || "",
          rating: rating || 5,
          videoUrl: videoUrl || ""
        });
      } else {
        await Testimonial.create({
          author: bn.author,
          company: bn.company,
          quote: bn.quote || "Video Review",
          logo: logo || "",
          avatar: avatar || "",
          rating: rating || 5,
          videoUrl: videoUrl || "",
          locale: "bn",
          translationGroupId
        });
      }
    } else if (existingBn) {
      await Testimonial.findByIdAndDelete(existingBn._id);
    }

    return NextResponse.json({ success: true, message: "Testimonial translation group updated successfully" });
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
      const result = await Testimonial.deleteMany({ translationGroupId: id });
      return NextResponse.json({ success: true, message: `Deleted ${result.deletedCount} testimonials in the translation group` });
    }

    const firstTestimonial = await Testimonial.findById(id);
    if (!firstTestimonial) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }

    if (firstTestimonial.translationGroupId) {
      const result = await Testimonial.deleteMany({ translationGroupId: firstTestimonial.translationGroupId });
      return NextResponse.json({ success: true, message: `Deleted ${result.deletedCount} testimonials in the translation group` });
    }

    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
