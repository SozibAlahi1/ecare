import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const { amount, payerReference } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { success: false, error: "Amount is required" },
        { status: 400 }
      );
    }

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
    const tokenRes = await fetch(`${apiUrl}/checkout/token/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        username,
        password
      },
      body: JSON.stringify({
        app_key: appKey,
        app_secret: appSecret
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.id_token) {
      return NextResponse.json(
        { success: false, error: tokenData.errorMessage || "Failed to grant bKash token" },
        { status: 400 }
      );
    }

    const idToken = tokenData.id_token;

    // Step 2: Create Payment Session
    const callbackOrigin = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const callbackURL = `${callbackOrigin}/api/payment/bkash/callback`;
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const createRes = await fetch(`${apiUrl}/checkout/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: idToken,
        "X-APP-Key": appKey
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: payerReference || "guest_reference",
        callbackURL,
        amount: String(amount),
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
