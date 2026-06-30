import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ key: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { key } = await params;
    const page = await Page.findOne({ key });
    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: page });
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
    const { key } = await params;
    const body = await request.json();

    const page = await Page.findOneAndUpdate({ key }, body, { new: true, runValidators: true });
    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
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
    const { key } = await params;

    const CORE_PAGES = ["ezy_checkout", "about", "terms", "privacy", "contact_info", "bkash_settings", "smtp_settings", "home_solutions", "home_at_glance", "offer_popup"];
    if (CORE_PAGES.includes(key)) {
      return NextResponse.json({ success: false, error: "Cannot delete core system settings pages" }, { status: 400 });
    }

    const page = await Page.findOneAndDelete({ key });
    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Page deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
