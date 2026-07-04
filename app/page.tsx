"use client";

import { Check, Clipboard, PlugZap, RefreshCw, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  defaultProduct,
  generateListing,
  makeImageText,
  normalizeImageUrls,
  presets,
  type Platform,
  type ProductInput
} from "@/lib/listing";
import type { EbayDraftPreview } from "@/lib/ebay";

type CopyKey =
  | "mercariTitle"
  | "mercariDescription"
  | "ebayTitle"
  | "ebayDescription"
  | "japaneseSpecs"
  | "englishSpecs";

type ConfigState = {
  status: "idle" | "checking" | "ok" | "error";
  message: string;
  missing: string[];
  offerMissing: string[];
};

const toggleFields: Array<{ key: keyof ProductInput; label: string }> = [
  { key: "usbC", label: "USB-C" },
  { key: "dataTransfer", label: "データ転送" },
  { key: "reversibleUsbC", label: "両面認識" },
  { key: "tapticEngine", label: "Taptic" },
  { key: "bluetooth", label: "Bluetooth" },
  { key: "imod", label: "iMod" }
];

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Home() {
  const [product, setProduct] = useState<ProductInput>(defaultProduct);
  const [selectedPresetId, setSelectedPresetId] = useState("classic-7-256-usbc");
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [draft, setDraft] = useState<EbayDraftPreview | null>(null);
  const [configState, setConfigState] = useState<ConfigState>({
    status: "idle",
    message: "未確認",
    missing: [],
    offerMissing: []
  });

  const generated = useMemo(() => generateListing(product), [product]);

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setProduct((current) => ({ ...current, [key]: value }));
    setDraft(null);
  }

  function applyPreset(id: string) {
    const preset = presets.find((item) => item.id === id);
    if (preset) {
      setSelectedPresetId(id);
      setProduct({ ...preset.product, imageUrls: product.imageUrls });
      setDraft(null);
    }
  }

  async function copyText(key: CopyKey, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1200);
  }

  async function checkEbayConfig() {
    setConfigState({ status: "checking", message: "確認中...", missing: [], offerMissing: [] });
    const response = await fetch("/api/ebay/config-check", { cache: "no-store" });
    const data = (await response.json()) as {
      ok: boolean;
      message: string;
      missing: string[];
      offerCreationMissingEnv: string[];
    };
    setConfigState({
      status: data.ok ? "ok" : "error",
      message: data.message,
      missing: data.missing || [],
      offerMissing: data.offerCreationMissingEnv || []
    });
  }

  async function createDraftPreview() {
    const response = await fetch("/api/ebay/draft-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    const data = (await response.json()) as { draft: EbayDraftPreview };
    setDraft(data.draft);
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-5 lg:px-8">
        <header className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-pine">iPod custom listing workbench</p>
            <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">出品作業台</h1>
          </div>
          <button
            type="button"
            onClick={checkEbayConfig}
            className="inline-flex h-11 items-center justify-center gap-2 rounded border border-pine bg-white px-4 text-sm font-bold text-pine shadow-sm active:scale-[0.99]"
          >
            {configState.status === "checking" ? <RefreshCw size={17} className="animate-spin" /> : <PlugZap size={17} />}
            eBay設定チェック
          </button>
        </header>

        <StatusPanel state={configState} />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-5">
            <section className="rounded border border-line bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Wand2 size={18} className="text-coral" />
                <h2 className="text-lg font-bold">商品入力</h2>
              </div>

              <label className="mb-4 flex flex-col gap-1 text-sm font-semibold text-slate-700">
                iPodプリセット
                <select
                  value={selectedPresetId}
                  onChange={(event) => applyPreset(event.target.value)}
                  className="h-12 rounded border border-line bg-white px-3 text-base outline-none focus:border-pine"
                >
                  {presets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="productCategory" value={product.productCategory} onChange={(value) => update("productCategory", value)} />
                <TextField label="model" value={product.model} onChange={(value) => update("model", value)} />
                <TextField label="modelNumber 任意" value={product.modelNumber} onChange={(value) => update("modelNumber", value)} />
                <TextField label="generation" value={product.generation} onChange={(value) => update("generation", value)} />
                <TextField label="color" value={product.color} onChange={(value) => update("color", value)} />
                <TextField label="condition" value={product.condition} onChange={(value) => update("condition", value)} />
                <NumberField label="storageGb" value={product.storageGb} onChange={(value) => update("storageGb", value)} />
                <NumberField label="batteryMah" value={product.batteryMah} onChange={(value) => update("batteryMah", value)} />
                <NumberField label="purchasePrice" value={product.purchasePrice} onChange={(value) => update("purchasePrice", value)} />
                <NumberField label="salePrice" value={product.salePrice} onChange={(value) => update("salePrice", value)} />
                <NumberField
                  label="shippingChargedToBuyer"
                  value={product.shippingChargedToBuyer}
                  onChange={(value) => update("shippingChargedToBuyer", value)}
                />
                <NumberField label="shippingCost" value={product.shippingCost} onChange={(value) => update("shippingCost", value)} />
                <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                  platform
                  <select
                    value={product.platform}
                    onChange={(event) => update("platform", event.target.value as Platform)}
                    className="h-12 rounded border border-line bg-white px-3 text-base outline-none focus:border-pine"
                  >
                    <option value="both">both</option>
                    <option value="mercari">mercari</option>
                    <option value="ebay">ebay</option>
                  </select>
                </label>
                <TextField label="accessories" value={product.accessories} onChange={(value) => update("accessories", value)} />
              </div>

              <fieldset className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {toggleFields.map((field) => (
                  <label key={String(field.key)} className="flex min-h-12 items-center gap-2 rounded border border-line px-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(product[field.key])}
                      onChange={(event) => update(field.key, event.target.checked as never)}
                      className="h-5 w-5 accent-pine"
                    />
                    {field.label}
                  </label>
                ))}
              </fieldset>

              <div className="mt-4 grid gap-3">
                <TextArea label="notes" value={product.notes} onChange={(value) => update("notes", value)} rows={4} />
                <TextArea
                  label="imageUrls"
                  value={makeImageText(product.imageUrls)}
                  onChange={(value) => update("imageUrls", normalizeImageUrls(value))}
                  rows={4}
                />
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <OutputPanel
                title="メルカリ"
                titleText={generated.mercariTitle}
                description={generated.mercariDescription}
                titleKey="mercariTitle"
                descriptionKey="mercariDescription"
                copied={copied}
                onCopy={copyText}
              />
              <OutputPanel
                title="eBay"
                titleText={generated.ebayTitle}
                description={generated.ebayDescription}
                titleKey="ebayTitle"
                descriptionKey="ebayDescription"
                copied={copied}
                onCopy={copyText}
              />
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            <ProfitPanel generated={generated} />
            <SpecPanel
              japaneseSpecs={generated.japaneseSpecs}
              englishSpecs={generated.englishSpecs}
              copied={copied}
              onCopy={copyText}
            />
            <button
              type="button"
              onClick={createDraftPreview}
              className="h-12 rounded bg-coral px-4 text-sm font-bold text-white shadow-sm active:scale-[0.99]"
            >
              eBay下書き相当プレビュー
            </button>
            {draft ? <DraftPanel draft={draft} /> : null}
          </aside>
        </section>
      </div>
    </main>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded border border-line bg-white px-3 text-base text-ink outline-none focus:border-pine"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      {label}
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(toNumber(event.target.value))}
        className="h-12 rounded border border-line bg-white px-3 text-base text-ink outline-none focus:border-pine"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      {label}
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded border border-line bg-white px-3 py-2 text-base text-ink outline-none focus:border-pine"
      />
    </label>
  );
}

function CopyButton({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded border border-line bg-white text-pine active:scale-95"
      title="コピー"
      aria-label="コピー"
    >
      {copied ? <Check size={18} /> : <Clipboard size={18} />}
    </button>
  );
}

function OutputPanel({
  title,
  titleText,
  description,
  titleKey,
  descriptionKey,
  copied,
  onCopy
}: {
  title: string;
  titleText: string;
  description: string;
  titleKey: CopyKey;
  descriptionKey: CopyKey;
  copied: CopyKey | null;
  onCopy: (key: CopyKey, value: string) => void;
}) {
  return (
    <article className="rounded border border-line bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-700">Title</p>
          <CopyButton copied={copied === titleKey} onClick={() => onCopy(titleKey, titleText)} />
        </div>
        <p className="min-h-14 rounded border border-line bg-paper p-3 text-sm leading-6">{titleText}</p>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-700">Description</p>
          <CopyButton copied={copied === descriptionKey} onClick={() => onCopy(descriptionKey, description)} />
        </div>
        <pre className="max-h-[560px] min-h-80 overflow-auto whitespace-pre-wrap rounded border border-line bg-paper p-3 text-sm leading-6 text-ink">{description}</pre>
      </div>
    </article>
  );
}

function ProfitPanel({ generated }: { generated: ReturnType<typeof generateListing> }) {
  const { mercari, ebay } = generated.profit;

  return (
    <section className="rounded border border-line bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold">利益計算</h2>
      <div className="grid gap-3">
        <ProfitBlock
          title="Mercari"
          rows={[
            ["販売価格", yen(mercari.salePrice)],
            ["手数料10%", `-${yen(mercari.fee)}`],
            ["送料", `-${yen(mercari.shipping)}`],
            ["入金見込み", yen(mercari.net)],
            ["仕入価格", `-${yen(mercari.purchasePrice)}`],
            ["利益額", yen(mercari.profit)]
          ]}
        />
        <ProfitBlock
          title="eBay"
          rows={[
            ["送料込み合計", yen(ebay.total)],
            ["手数料18%", `-${yen(ebay.fee)}`],
            ["入金見込み", yen(ebay.net)],
            ["仕入価格", `-${yen(ebay.purchasePrice)}`],
            ["実送料", `-${yen(ebay.shippingCost)}`],
            ["利益額", yen(ebay.profit)]
          ]}
        />
      </div>
    </section>
  );
}

function ProfitBlock({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="rounded border border-line bg-paper p-3">
      <h3 className="mb-2 text-sm font-bold text-pine">{title}</h3>
      <dl className="grid gap-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-slate-600">{label}</dt>
            <dd className="font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SpecPanel({
  japaneseSpecs,
  englishSpecs,
  copied,
  onCopy
}: {
  japaneseSpecs: string;
  englishSpecs: string;
  copied: CopyKey | null;
  onCopy: (key: CopyKey, value: string) => void;
}) {
  return (
    <section className="rounded border border-line bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold">スペック一覧</h2>
      <SpecBox title="日本語" text={japaneseSpecs} copyKey="japaneseSpecs" copied={copied} onCopy={onCopy} />
      <SpecBox title="English" text={englishSpecs} copyKey="englishSpecs" copied={copied} onCopy={onCopy} />
    </section>
  );
}

function SpecBox({
  title,
  text,
  copyKey,
  copied,
  onCopy
}: {
  title: string;
  text: string;
  copyKey: CopyKey;
  copied: CopyKey | null;
  onCopy: (key: CopyKey, value: string) => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-700">{title}</p>
        <CopyButton copied={copied === copyKey} onClick={() => onCopy(copyKey, text)} />
      </div>
      <pre className="whitespace-pre-wrap rounded border border-line bg-paper p-3 text-sm leading-6">{text}</pre>
    </div>
  );
}

function DraftPanel({ draft }: { draft: EbayDraftPreview }) {
  return (
    <section className="rounded border border-line bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold">eBay下書き相当</h2>
      <dl className="grid gap-2 text-sm">
        <DraftRow label="SKU" value={draft.sku} />
        <DraftRow label="Marketplace" value={draft.marketplace} />
        <DraftRow label="Price" value={`${draft.price.value} ${draft.price.currency}`} />
        <DraftRow label="Quantity" value={String(draft.quantity)} />
        <DraftRow label="Condition" value={draft.condition} />
        <DraftRow label="Category" value={draft.category.label} />
        <DraftRow label="Shipping" value={draft.shipping} />
        <DraftRow label="Return" value={draft.returns} />
        <DraftRow label="Location" value={draft.itemLocation} />
        <DraftRow label="HTTPS images" value={String(draft.imageUrls.length)} />
        <DraftRow label="publishOffer" value="Not implemented" />
      </dl>
      {draft.offerCreation.missingEnv.length ? (
        <p className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-900">
          未公開Offer作成に必要な不足項目: {draft.offerCreation.missingEnv.join(", ")}
        </p>
      ) : null}
    </section>
  );
}

function DraftRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[112px_1fr] gap-2 border-b border-line py-2 last:border-0">
      <dt className="font-bold text-slate-600">{label}</dt>
      <dd className="break-words text-ink">{value}</dd>
    </div>
  );
}

function StatusPanel({ state }: { state: ConfigState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <section
      className={`rounded border p-3 text-sm ${
        state.status === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      <p className="font-bold">{state.message}</p>
      {state.missing.length ? <p className="mt-1">不足: {state.missing.join(", ")}</p> : null}
      {state.offerMissing.length ? <p className="mt-1">未公開Offer用の不足: {state.offerMissing.join(", ")}</p> : null}
    </section>
  );
}

function yen(value: number): string {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}
