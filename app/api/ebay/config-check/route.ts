import { NextResponse } from "next/server";
import { getEbayConfigCheck, getMissingOfferEnv } from "@/lib/ebay";

export async function GET() {
  const config = getEbayConfigCheck();

  return NextResponse.json({
    ok: config.ok,
    env: config.env,
    apiBaseUrl: config.apiBaseUrl,
    missing: config.missing,
    configured: config.configured,
    offerCreationMissingEnv: getMissingOfferEnv(),
    message: config.ok
      ? "eBay API settings are present. Secret values are hidden."
      : "eBay API settings are incomplete. Only missing variable names are shown."
  });
}
