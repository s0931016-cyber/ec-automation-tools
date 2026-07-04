import { NextResponse } from "next/server";
import { buildEbayDraftPreview } from "@/lib/ebay";
import type { ProductInput } from "@/lib/listing";

export async function POST(request: Request) {
  const product = (await request.json()) as ProductInput;

  return NextResponse.json({
    draft: buildEbayDraftPreview(product),
    message: "Draft preview only. publishOffer is not implemented."
  });
}
