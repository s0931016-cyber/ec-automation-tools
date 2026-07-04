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

function englishGenerationLabel(product: ProductInput): string {
  const number = product.modelNumber.trim();
  const generation = toEnglishGeneration(product.generation);
  return number ? `${generation} (${number})` : generation;
}

function toEnglishGeneration(value: string): string {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("5.5")) return "5.5th generation";
  if (normalized.includes("6.5")) return "6.5th generation";
  if (normalized.includes("第5") || normalized.includes("5th")) return "5th generation";
  if (normalized.includes("第6") || normalized.includes("6th")) return "6th generation";
  if (normalized.includes("第7") || normalized.includes("7th")) return "7th generation";

  return value
    .replace(/第/g, "")
    .replace(/世代/g, "generation")
    .replace(/[（）]/g, "")
    .trim();
}

function englishColor(value: string): string {
  const color = value.trim();
  const map: Record<string, string> = {
    シルバー: "Silver",
    ブラック: "Black",
    ホワイト: "White",
    黒: "Black",
    白: "White",
    銀: "Silver"
  };
  return map[color] || (hasJapaneseText(color) ? "See photos" : color);
}

function englishCondition(value: string): string {
  const condition = value.trim();
  const map: Record<string, string> = {
    新品: "New",
    未使用: "Unused",
    未使用に近い: "Used - like new",
    目立った傷や汚れなし: "Used - good condition",
    やや傷や汚れあり: "Used - minor signs of use",
    傷や汚れあり: "Used - visible signs of use",
    全体的に状態が悪い: "Used - for repair or parts"
  };
  return map[condition] || (hasJapaneseText(condition) ? "Used custom item. Please check photos for details." : condition);
}

function englishAccessories(value: string): string {
  const accessories = value.trim();
  if (!accessories) return "Please check photos for included items.";

  return accessories
    .replace(/USB-Cケーブル/g, "USB-C cable")
    .replace(/ケーブル/g, "cable")
    .replace(/なし|無し/g, "None")
    .replace(/、/g, ", ");
}

function englishNotes(product: ProductInput): string {
  const notes = product.notes.trim();
  if (!notes) return "Please review the photos carefully before purchase.";

  if (!hasJapaneseText(notes)) return notes;

  const features = [`${product.storageGb}GB SSD`];
  if (product.usbC) features.push("USB-C");
  if (product.imod) features.push("iMod audio customization");
  if (hasWolfsonDac(product)) features.push("Wolfson DAC generation");

  return `Custom ${product.model} ${englishGenerationLabel(product)} with ${features.join(", ")}. Fully tested. Please check photos for details.`;
}

function hasJapaneseText(value: string): boolean {
  return /[ぁ-んァ-ヶ一-龠]/.test(value);
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
  return `${product.model} ${englishGenerationLabel(product)} ${mods.join(" ")} Custom from Japan`.slice(0, 80);
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

  const typeCEn = product.usbC
    ? [
        "- USB-C port installed",
        `- Supports charging and iTunes/Finder sync via USB-C${product.dataTransfer ? "" : ""}`,
        product.dataTransfer ? "- Supports USB-C data transfer" : "",
        product.reversibleUsbC
          ? "- Reversible USB-C connection supported"
          : "- USB-C connection may be one-sided depending on cable orientation"
      ]
    : ["- Original charging port configuration"];
  const wolfsonEn = hasWolfsonDac(product)
    ? "If this unit is a 5th / 5.5th generation iPod Video model, it uses the Wolfson DAC generation, which is highly regarded by many iPod audio enthusiasts."
    : "";
  const tapticEn = product.tapticEngine
    ? "This iPod has been upgraded with a Taptic Engine. The original click sound has been removed, and the unit provides subtle vibration feedback instead."
    : "";
  const imodEn = product.imod
    ? "This unit includes an iMod-style audio customization for buyers who value line-out sound quality."
    : "";
  const ebayDescription = [
    "Thank you for viewing this listing.",
    "",
    `This is a custom iPod based on the ${product.model} ${englishGenerationLabel(product)}, upgraded with a large-capacity SSD.`,
    "",
    "The original HDD has been replaced with an SSD, improving durability, stability, and daily usability compared with the original hard drive model.",
    "",
    "Main Custom Specifications:",
    `- Base model: ${product.model} ${englishGenerationLabel(product)}`,
    `- Storage: ${product.storageGb}GB SSD`,
    `- Battery: ${product.batteryMah}mAh`,
    `- Color: ${englishColor(product.color)}`,
    ...typeCEn,
    product.bluetooth ? "- Bluetooth installed" : "",
    product.imod ? "- iMod audio customization" : "",
    product.tapticEngine ? "- Taptic Engine installed" : "",
    hasWolfsonDac(product) ? "- Wolfson DAC generation" : "",
    "",
    "Replaced / Upgraded Parts:",
    "- SSD storage upgrade",
    "- Front panel replaced",
    "- Back panel replaced",
    "- Click wheel replaced",
    "- Earphone jack cable replaced",
    `- Battery replaced / upgraded (${product.batteryMah}mAh)`,
    "",
    wolfsonEn,
    tapticEn,
    imodEn,
    "",
    "Condition:",
    `- ${englishCondition(product.condition)}`,
    "- Tested for music playback",
    "- Tested for button operation",
    "- Tested for charging",
    "- Tested for computer / iTunes sync",
    "- Initialized before shipping",
    "- This is a used custom item, so minor marks or small signs of handling may be present",
    "- Please check the photos carefully for the actual condition",
    "",
    "Included Items:",
    `- ${englishAccessories(product.accessories)}`,
    "",
    "Compatibility Notes:",
    "This iPod can be used with iTunes / Finder sync depending on your computer environment.",
    "It may also work with compatible car audio systems, docks, and speakers that support iPod connection, but compatibility depends on each device.",
    "",
    "Additional Notes:",
    `- ${englishNotes(product)}`,
    "",
    "Shipping:",
    "The item will usually be shipped by FedEx from Japan.",
    "Estimated delivery time is about 1 week after shipment, depending on the destination country, customs processing, and local delivery conditions.",
    "",
    "Customs / Import Duties:",
    "Import duties, taxes, VAT, customs fees, and any additional charges are the buyer's responsibility.",
    "These charges are not included in the item price or shipping cost.",
    "Please check your country's import rules before purchasing.",
    "",
    "Important:",
    "This is a custom-modified used iPod, not a brand-new factory item.",
    "Please purchase only if you understand the nature of custom electronics.",
    "If there is any issue upon arrival, please contact me before leaving feedback."
  ]
    .filter(Boolean)
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
    `Generation: ${englishGenerationLabel(product)}`,
    `Color: ${englishColor(product.color)}`,
    `Storage: ${product.storageGb}GB SSD`,
    `Battery: ${product.batteryMah}mAh`,
    `USB-C: ${product.usbC ? "Yes" : "No"}`,
    `Data transfer: ${product.dataTransfer ? "Yes" : "No"}`,
    `Reversible USB-C: ${product.reversibleUsbC ? "Yes" : "No"}`,
    product.bluetooth ? "Bluetooth: Yes" : "",
    product.imod ? "iMod: Yes" : "",
    product.tapticEngine ? "Taptic Engine: Yes" : "",
    `Condition: ${englishCondition(product.condition)}`
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
