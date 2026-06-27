import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Page, Order } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const { billing, items } = await request.json();

    if (!billing || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Billing details and items are required" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce((acc: number, item: any) => {
      let price = Number(item.price);
      if (item.extendSupport) {
        price += Number(item.supportPrice || 0);
      }
      return acc + price * Number(item.quantity);
    }, 0);
    const tax = subtotal * 0.15;
    const amountBDT = Math.round(subtotal + tax);

    await dbConnect();
    const dbSettingsDoc = await Page.findOne({ key: "bkash_settings" });
    let dbSettings: any = {};
    if (dbSettingsDoc && dbSettingsDoc.content && dbSettingsDoc.content.en) {
      try {
        dbSettings = JSON.parse(dbSettingsDoc.content.en);
      } catch (e) {
        dbSettings = {};
      }
    }

    const apiUrl = dbSettings.apiUrl || process.env.BKASH_API_URL || "https://tokenized.sandbox.bka.sh/v1.2.0-beta";
    const username = dbSettings.username || process.env.BKASH_USERNAME;
    const password = dbSettings.password || process.env.BKASH_PASSWORD;
    const appKey = dbSettings.appKey || process.env.BKASH_APP_KEY;
    const appSecret = dbSettings.appSecret || process.env.BKASH_APP_SECRET;

    if (!username || !password || !appKey || !appSecret) {
      return NextResponse.json(
        { success: false, error: "bKash configuration credentials are missing. Please configure them in the Admin Settings panel." },
        { status: 500 }
      );
    }

    // Step 1: Grant Token
    const tokenRes = await fetch(`${apiUrl}/tokenized/checkout/token/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "username": username,
        "password": password,
        "app_key": appKey,
        "app_secret": appSecret,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        app_key: appKey,
        app_secret: appSecret
      })
    });

    const tokenData = await tokenRes.json();
    console.log("bKash token grant status:", tokenRes.status);
    console.log("bKash token grant data:", tokenData);

    if (!tokenRes.ok || !tokenData.id_token) {
      const errorMsg = tokenData.statusMessage || tokenData.errorMessage || `Failed to grant bKash token (HTTP ${tokenRes.status})`;
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const idToken = tokenData.id_token;

    // Step 2: Create Payment Session
    const callbackOrigin = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const callbackURL = `${callbackOrigin}/api/payment/bkash/callback`;
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const createRes = await fetch(`${apiUrl}/tokenized/checkout/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: idToken,
        "X-APP-Key": appKey,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: billing.phone || "guest_reference",
        callbackURL,
        amount: String(amountBDT),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: invoiceNumber
      })
    });

    const createData = await createRes.json();
    if (!createRes.ok || !createData.paymentID || !createData.bkashURL) {
      return NextResponse.json(
        { success: false, error: createData.errorMessage || "Failed to create bKash payment session" },
        { status: 400 }
      );
    }

    // Save Pending Order
    await Order.create({
      name: billing.name,
      email: billing.email,
      phone: billing.phone,
      company: billing.company || "",
      items: items.map((item: any) => ({
        productId: item.id,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
        extendSupport: !!item.extendSupport
      })),
      totalAmount: amountBDT,
      paymentStatus: "pending",
      paymentID: createData.paymentID
    });

    return NextResponse.json({
      success: true,
      paymentID: createData.paymentID,
      bkashURL: createData.bkashURL
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
