import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Page } from "@/lib/models";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  const baseOrigin = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  if (status !== "success" || !paymentID) {
    return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed`);
  }

  try {
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
      return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed&error=missing_credentials`);
    }

    // Step 1: Grant Token to authorize Execute Payment
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
    if (!tokenRes.ok || !tokenData.id_token) {
      return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed&error=token_grant_failed`);
    }

    const idToken = tokenData.id_token;

    // Step 2: Execute Payment
    const executeRes = await fetch(`${apiUrl}/tokenized/checkout/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: idToken,
        "X-APP-Key": appKey,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({ paymentID })
    });

    const executeData = await executeRes.json();

    // bKash returns transaction details on success. The trxID is inside executeData.trxID
    if (!executeRes.ok || executeData.statusCode !== "0000" || !executeData.trxID) {
      console.error("bKash Payment Execution Failed:", executeData);
      return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed&error=${executeData.statusMessage || "execution_failed"}`);
    }

    // Redirect user to success page with transaction ID
    return NextResponse.redirect(
      `${baseOrigin}/checkout?paymentStatus=success&trxID=${executeData.trxID}`
    );
  } catch (error: any) {
    console.error("bKash Callback Processing Exception:", error);
    return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed&error=exception`);
  }
}
