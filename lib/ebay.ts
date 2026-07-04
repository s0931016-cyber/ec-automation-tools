import { generateListing, generateSku, ProductInput } from "@/lib/listing";

export type EbayConfigCheck = {
  ok: boolean;
  env: string;
  apiBaseUrl: string;
  missing: string[];
  configured: {
    clientId: boolean;
    clientSecret: boolean;
    devId: boolean;
    runame: boolean;
    userToken: boolean;
  };
};

export type EbayDraftPreview = {
  sku: string;
  marketplace: string;
  title: string;
  description: string;
  price: {
    value: number;
    currency: string;
  };
  quantity: number;
  condition: string;
  category: {
    label: string;
    categoryIdRequired: boolean;
    categoryId?: string;
  };
  shipping: string;
  returns: string;
  payment: string;
  itemLocation: string;
  imageUrls: string[];
  offerCreation: {
    supportedLater: true;
    publishOfferImplemented: false;
    missingEnv: string[];
  };
};

const requiredConfig = [
  "EBAY_CLIENT_ID",
  "EBAY_CLIENT_SECRET",
  "EBAY_DEV_ID",
  "EBAY_RUNAME",
  "EBAY_USER_TOKEN",
  "EBAY_ENV",
  "EBAY_API_BASE_URL"
];

const offerEnv = [
  "EBAY_PAYMENT_POLICY_ID",
  "EBAY_RETURN_POLICY_ID",
  "EBAY_FULFILLMENT_POLICY_ID",
  "EBAY_MERCHANT_LOCATION_KEY"
];

export function getEbayConfigCheck(): EbayConfigCheck {
  const missing = requiredConfig.filter((key) => !process.env[key]);
  const env = process.env.EBAY_ENV || "not configured";
  const apiBaseUrl = process.env.EBAY_API_BASE_URL || "not configured";

  return {
    ok: missing.length === 0,
    env,
    apiBaseUrl,
    missing,
    configured: {
      clientId: Boolean(process.env.EBAY_CLIENT_ID),
      clientSecret: Boolean(process.env.EBAY_CLIENT_SECRET),
      devId: Boolean(process.env.EBAY_DEV_ID),
      runame: Boolean(process.env.EBAY_RUNAME),
      userToken: Boolean(process.env.EBAY_USER_TOKEN)
    }
  };
}

export function getMissingOfferEnv(): string[] {
  return offerEnv.filter((key) => !process.env[key]);
}

export function buildEbayDraftPreview(product: ProductInput): EbayDraftPreview {
  const generated = generateListing(product);
  const categoryId = process.env.EBAY_DEFAULT_CATEGORY_ID;

  return {
    sku: generateSku(product),
    marketplace: process.env.EBAY_MARKETPLACE_ID || "EBAY_US",
    title: generated.ebayTitle,
    description: generated.ebayDescription,
    price: {
      value: product.salePrice || Number(process.env.EBAY_DEFAULT_PRICE || 299),
      currency: process.env.EBAY_DEFAULT_CURRENCY || "USD"
    },
    quantity: Number(process.env.EBAY_DEFAULT_QUANTITY || 1),
    condition: "Used",
    category: {
      label: process.env.EBAY_DEFAULT_CATEGORY_LABEL || "iPods & MP3 Players",
      categoryIdRequired: !categoryId,
      ...(categoryId ? { categoryId } : {})
    },
    shipping: "Standard Shipping",
    returns: "30-day free returns",
    payment: "eBay Payment Policy",
    itemLocation: "Japan / merchantLocationKey",
    imageUrls: product.imageUrls.filter((url) => url.startsWith("https://")),
    offerCreation: {
      supportedLater: true,
      publishOfferImplemented: false,
      missingEnv: getMissingOfferEnv()
    }
  };
}
