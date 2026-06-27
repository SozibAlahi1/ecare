import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order, Portfolio } from "@/lib/models";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Missing download token", { status: 400 });
    }

    await dbConnect();
    const order = await Order.findOne({ downloadToken: token, paymentStatus: "paid" });

    if (!order) {
      return new NextResponse("Invalid or expired download link", { status: 400 });
    }

    // Find the product related to this order items
    const firstItem = order.items[0];
    let downloadFilePath = "";
    let productTitle = "plugin";

    if (firstItem) {
      productTitle = firstItem.title;
      
      const queryOr: any[] = [
        { slug: firstItem.productId },
        { slug: "/" + firstItem.productId }
      ];
      
      if (mongoose.isValidObjectId(firstItem.productId)) {
        queryOr.push({ _id: firstItem.productId });
      }

      const product = await Portfolio.findOne({ $or: queryOr }).lean();

      if (product && product.downloadFile) {
        downloadFilePath = product.downloadFile;
      }
    }

    // Resolve target path
    let finalPath = "";
    if (downloadFilePath) {
      if (downloadFilePath.startsWith("/uploads/")) {
        finalPath = path.join(process.cwd(), "public", downloadFilePath);
      } else {
        finalPath = path.join(process.cwd(), "public", "uploads", path.basename(downloadFilePath));
      }
    } else {
      finalPath = path.join(process.cwd(), "public", "uploads", "ezy-checkout-pro.zip");
    }

    const downloadName = downloadFilePath ? path.basename(downloadFilePath) : `${productTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.zip`;

    if (!fs.existsSync(finalPath)) {
      // Fallback dummy file stream if actual plugin isn't uploaded yet so it doesn't crash
      return new NextResponse(`Mock Plugin Binary Container: ${productTitle}`, {
        headers: {
          "Content-Disposition": `attachment; filename=${downloadName}`,
          "Content-Type": "application/zip",
        },
      });
    }

    const fileStream = fs.readFileSync(finalPath);
    return new NextResponse(fileStream, {
      headers: {
        "Content-Disposition": `attachment; filename=${downloadName}`,
        "Content-Type": "application/zip",
      },
    });
  } catch (error: any) {
    return new NextResponse(`Download processing error: ${error.message}`, { status: 500 });
  }
}
