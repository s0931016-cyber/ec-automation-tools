export type Platform = "mercari" | "ebay" | "both";

export type ProductInput = {
  productCategory: string;
  model: string;
  modelNumber: string;
  generation: string;
  color: string;
  storageGb: number;
  batteryMah: number;
  usbC: boolean;
  dataTransfer: boolean;
  reversibleUsbC: boolean;
  tapticEngine: boolean;
  bluetooth: boolean;
  imod: boolean;
  condition: string;
  accessories: string;
  purchasePrice: number;
  salePrice: number;
  shippingChargedToBuyer: number;
  shippingCost: number;
  platform: Platform;
  notes: string;
  imageUrls: string[];
};

export type Preset = {
  id: string;
  label: string;
  product: ProductInput;
};

export type ProfitResult = {
  mercari: {
    salePrice: number;
    fee: number;
    shipping: number;
    net: number;
    purchasePrice: number;
    profit: number;
  };
  ebay: {
    total: number;
    fee: number;
    net: number;
    purchasePrice: number;
    shippingCost: number;
    profit: number;
  };
};

export type GeneratedListing = {
  mercariTitle: string;
  mercariDescription: string;
  ebayTitle: string;
  ebayDescription: string;
  japaneseSpecs: string;
  englishSpecs: string;
  profit: ProfitResult;
};

const baseProduct: ProductInput = {
  productCategory: "デジタルオーディオプレーヤー",
  model: "iPod classic",
  modelNumber: "",
  generation: "第7世代",
  color: "シルバー",
  storageGb: 256,
  batteryMah: 2000,
  usbC: true,
  dataTransfer: true,
  reversibleUsbC: true,
  tapticEngine: false,
  bluetooth: false,
  imod: false,
  condition: "目立った傷や汚れなし",
  accessories: "USB-Cケーブル",
  purchasePrice: 0,
  salePrice: 36500,
  shippingChargedToBuyer: 0,
  shippingCost: 300,
  platform: "both",
  notes: "動作確認済み。詳細な状態は画像をご確認ください。",
  imageUrls: []
};

export const presets: Preset[] = [
  {
    id: "classic-6-128-usbc",
    label: "第6世代 128GB SSD USB-C",
    product: {
      ...baseProduct,
      generation: "第6世代",
      storageGb: 128,
      salePrice: 32800,
      notes: "第6世代ベースの128GB SSD USB-Cカスタムです。"
    }
  },
  {
    id: "classic-7-256-usbc",
    label: "第7世代 256GB SSD USB-C",
    product: {
      ...baseProduct,
      generation: "第7世代",
      storageGb: 256,
      salePrice: 36500,
      notes: "第7世代ベースの256GB SSD USB-Cカスタムです。"
    }
  },
  {
    id: "video-55-256-usbc",
    label: "第5.5世代 256GB SSD USB-C",
    product: {
      ...baseProduct,
      model: "iPod Video",
      generation: "第5.5世代",
      storageGb: 256,
      salePrice: 39800,
      notes: "Wolfson DAC搭載世代の256GB SSD USB-Cカスタムです。"
    }
  },
  {
    id: "video-55-512-imod-typec",
    label: "第5.5世代 iMod 512GB Type-C",
    product: {
      ...baseProduct,
      model: "iPod Video",
      generation: "第5.5世代",
      storageGb: 512,
      imod: true,
      salePrice: 59800,
      accessories: "USB-Cケーブル",
      notes: "Wolfson DAC搭載世代のiMod音質カスタムです。"
    }
  }
];

export const defaultProduct = presets[1].product;

export function normalizeImageUrls(raw: string): string[] {
  return raw
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}

export function makeImageText(urls: string[]): string {
  return urls.join("\n");
}

export function generateSku(product: ProductInput, now = new Date()): string {
  const model = sanitizeSkuPart(product.model, 8) || "IPOD";
  const gen = sanitizeSkuPart(product.generation, 6) || "GEN";
  const imod = product.imod ? "IMOD" : "STD";
  const stamp = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `${model}-${gen}-${product.storageGb}GB-${imod}-${stamp}`;
}

function sanitizeSkuPart(value: string, length: number): string {
  return value.replace(/[^a-z0-9]/gi, "").slice(0, length).toUpperCase();
}

function generationLabel(product: ProductInput): string {
  const number = product.modelNumber.trim();
  return number ? `${product.generation}（${number}）` : product.generation;
}

function mercariFeatureTitle(product: ProductInput): string {
  const mods = ["SSD換装"];
  if (product.usbC) mods.push("USB-C");
  if (product.imod) mods.push("iMod");
  if (product.bluetooth) mods.push("Bluetooth");
  return `【大容量${product.storageGb}GB】${product.model} ${product.generation} ${mods.join(" ")}`.slice(0, 80);
}

function ebayFeatureTitle(product: ProductInput): string {
  const mods = [`${product.storageGb}GB SSD`];
  if (product.usbC) mods.push("USB-C");
  if (product.imod) mods.push("iMod");
  if (product.bluetooth) mods.push("Bluetooth");
  if (hasWolfsonDac(product)) mods.push("Wolfson DAC");
  return `${product.model} ${product.generation} ${mods.join(" ")} Custom from Japan`.slice(0, 80);
}

function hasWolfsonDac(product: ProductInput): boolean {
  return product.generation.includes("5") || product.model.toLowerCase().includes("video");
}

export function calculateProfit(product: ProductInput): ProfitResult {
  const mercariFee = Math.round(product.salePrice * 0.1);
  const mercariShipping = 300;
  const mercariNet = product.salePrice - mercariFee - mercariShipping;
  const ebayTotal = product.salePrice + product.shippingChargedToBuyer;
  const ebayFee = Math.round(ebayTotal * 0.18);
  const ebayNet = ebayTotal - ebayFee;

  return {
    mercari: {
      salePrice: product.salePrice,
      fee: mercariFee,
      shipping: mercariShipping,
      net: mercariNet,
      purchasePrice: product.purchasePrice,
      profit: mercariNet - product.purchasePrice
    },
    ebay: {
      total: ebayTotal,
      fee: ebayFee,
      net: ebayNet,
      purchasePrice: product.purchasePrice,
      shippingCost: product.shippingCost,
      profit: ebayNet - product.purchasePrice - product.shippingCost
    }
  };
}

export function generateListing(product: ProductInput): GeneratedListing {
  const tapticJa = product.tapticEngine
    ? "\nTaptic Engine搭載しております。元のクリック音は撤去し、コツコツっとした振動のみ伝わる仕様です。\n"
    : "";
  const imodJa = product.imod
    ? "\n音質カスタム（iMod）仕様です。対応環境でラインアウト音質を重視した構成です。\n"
    : "";
  const dataTransferLine = product.dataTransfer ? "・USB-Cデータ転送" : "";
  const reversibleText = product.reversibleUsbC
    ? "両面認識にも対応しているので\n純正dockコネクタ（片面）の煩わしさから解放されます。"
    : "データ転送は片面のみの認識となります。ご理解お願いいたします。";
  const typeCLine = product.usbC
    ? `■ Type-Cポート搭載（充電・iTunes同期${product.dataTransfer ? "、データ転送対応" : ""}）\n→ 現在主流のUSB-Cケーブルで使用可能\n${reversibleText}`
    : "■ 充電ポート\n純正仕様のポート構成です。";

  const mercariDescription = [
    "ご覧いただきありがとうございます。",
    "",
    `${product.model} ${generationLabel(product)}をベースに${product.storageGb}GB SSDへ換装したカスタムモデルです。`,
    "",
    "◽️HDDからSSDへ変更",
    "動作の安定性・耐久性が向上し従来モデルよりも快適にご使用いただけます。",
    tapticJa.trim(),
    imodJa.trim(),
    typeCLine,
    "",
    "【状態】",
    "",
    "■ 動作確認済み",
    "・音楽再生",
    "・ボタン操作",
    "・PC（iTunes）同期",
    "・充電",
    dataTransferLine,
    "",
    "■ 新品交換部品",
    `・前面パネル  ${product.color}`,
    "・背面パネル",
    "・クリックホイール",
    "・イヤホンジャックケーブル",
    `・バッテリー（${product.batteryMah}mAh）`,
    "",
    "【その他】",
    "・初期化（工場出荷状態）して発送いたします",
    "・カーナビ等、iPod対応機器であれば接続可能です",
    product.accessories ? `・付属品: ${product.accessories}` : "",
    product.notes ? `・${product.notes}` : "・詳細は画像をご確認ください",
    "",
    "【発送・保証】",
    "・新品パーツでも初期傷や換装時に伴い若干の傷が入る場合がございます。完璧な美品をお求めの方はご購入をお控えください。",
    "・背面と画面に簡易保護シート＋緩衝材で梱包しダンボールにて発送いたします",
    "・初期不良があった場合は評価前にご連絡ください（返品対応可）",
    "",
    `#Apple #iPod #${product.generation.replace(/\s/g, "")} #iPodClassic #${product.storageGb}GB #カスタムiPod #ポータブルプレーヤー`
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const tapticEn = product.tapticEngine
    ? "\nThis iPod has been upgraded with a Taptic Engine, replacing the original click sound with subtle vibration feedback.\n"
    : "";
  const imodEn = product.imod
    ? "\nThis unit includes an iMod-style audio customization for buyers who value line-out sound quality.\n"
    : "";
  const wolfsonEn = hasWolfsonDac(product)
    ? "This generation is known for its Wolfson DAC, which is valued by many iPod audio enthusiasts."
    : "";
  const ebayDescription = [
    `Custom ${product.model} ${product.generation} shipped from Japan.`,
    "",
    `Base model: ${product.model} ${generationLabel(product)}`,
    `Storage: ${product.storageGb}GB SSD`,
    `Battery: ${product.batteryMah}mAh`,
    product.usbC ? `USB-C: Charging${product.dataTransfer ? " and data transfer" : ""}` : "USB-C: No",
    product.usbC ? `Reversible USB-C: ${product.reversibleUsbC ? "Yes" : "No"}` : "",
    product.bluetooth ? "Bluetooth: Yes" : "",
    product.imod ? "iMod: Yes" : "",
    wolfsonEn,
    tapticEn.trim(),
    imodEn.trim(),
    "",
    "Condition:",
    `- ${product.condition}`,
    "- Tested for music playback, button operation, charging, and computer sync.",
    "- This is a used custom item, so minor signs of use may be present.",
    "",
    "Included:",
    product.accessories ? `- ${product.accessories}` : "- Please check photos for included items.",
    "",
    "Notes:",
    product.notes ? `- ${product.notes}` : "- Please review the photos carefully before purchase.",
    "- Import duties, taxes, and customs charges are the buyer's responsibility."
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const japaneseSpecs = [
    `モデル: ${product.model}`,
    `世代: ${generationLabel(product)}`,
    `カラー: ${product.color}`,
    `容量: ${product.storageGb}GB SSD`,
    `バッテリー: ${product.batteryMah}mAh`,
    product.usbC ? "USB-C: 対応" : "USB-C: 非対応",
    product.dataTransfer ? "データ転送: 対応" : "データ転送: 非対応",
    product.reversibleUsbC ? "両面認識: 対応" : "両面認識: 非対応",
    product.bluetooth ? "Bluetooth: 対応" : "",
    product.imod ? "iMod: 対応" : "",
    product.tapticEngine ? "Taptic Engine: 搭載" : "",
    `状態: ${product.condition}`
  ]
    .filter(Boolean)
    .join("\n");

  const englishSpecs = [
    `Model: ${product.model}`,
    `Generation: ${generationLabel(product)}`,
    `Color: ${product.color}`,
    `Storage: ${product.storageGb}GB SSD`,
    `Battery: ${product.batteryMah}mAh`,
    `USB-C: ${product.usbC ? "Yes" : "No"}`,
    `Data transfer: ${product.dataTransfer ? "Yes" : "No"}`,
    `Reversible USB-C: ${product.reversibleUsbC ? "Yes" : "No"}`,
    product.bluetooth ? "Bluetooth: Yes" : "",
    product.imod ? "iMod: Yes" : "",
    product.tapticEngine ? "Taptic Engine: Yes" : "",
    `Condition: ${product.condition}`
  ]
    .filter(Boolean)
    .join("\n");

  return {
    mercariTitle: mercariFeatureTitle(product),
    mercariDescription,
    ebayTitle: ebayFeatureTitle(product),
    ebayDescription,
    japaneseSpecs,
    englishSpecs,
    profit: calculateProfit(product)
  };
}
