import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  const baseOrigin = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  if (status !== "success" || !paymentID) {
    return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed`);
  }

  try {
    const apiUrl = process.env.BKASH_API_URL || "https://tokenized.sandbox.bka.sh/v1.2.0-beta";
    const username = process.env.BKASH_USERNAME;
    const password = process.env.BKASH_PASSWORD;
    const appKey = process.env.BKASH_APP_KEY;
    const appSecret = process.env.BKASH_APP_SECRET;

    if (!username || !password || !appKey || !appSecret) {
      return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed&error=missing_credentials`);
    }

    // Step 1: Grant Token to authorize Execute Payment
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
      return NextResponse.redirect(`${baseOrigin}/checkout?paymentStatus=failed&error=token_grant_failed`);
    }

    const idToken = tokenData.id_token;

    // Step 2: Execute Payment
    const executeRes = await fetch(`${apiUrl}/checkout/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: idToken,
        "X-APP-Key": appKey
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
