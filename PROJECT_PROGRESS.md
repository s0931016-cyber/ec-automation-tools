# PROJECT_PROGRESS.md

# Project Progress Notes

このファイルは、ChatGPT側で決めた進捗・判断・次回作業を保管するためのメモです。

Codexは作業前に `AGENTS.md`、`PROJECT_CONTEXT.md`、`TASKS.md`、`EBAY_SETUP.md`、`MERCARI_TEMPLATE_GUIDE.md` とあわせてこのファイルを読むこと。

---

## 現在の全体方針

このプロジェクトは、iPodカスタム商品の出品作業台を作る。

優先する販路は当面 eBay。

- Mercari: ChatGPTのメルカリ連携で下書き作成できるため、作業台側では補助扱い
- eBay: API連携で未公開Offer作成までを目標にする
- Yahoo!フリマ: いったん保留。将来はコピー用文面生成を検討
- Etsy: いったん保留。将来はcreateDraftListingを検討

---

## 2026-07-05 方針変更: Replitは試作扱い

Replit版は試作として扱い、今後の本命開発には使わない。

本命はこのGitHubリポジトリ `s0931016-cyber/ec-automation-tools` で管理するWebアプリとする。

目標運用は以下。

1. CodexでGitHub管理のWebアプリを実装・修正する
2. Macでローカル起動する
3. 同じWi-Fi内のiPhone Safariから操作する
4. 必要になった段階でVercel、Replit、Renderなどへのデプロイを検討する

Replit Agentの有料枠や中断に依存しない。
Replitに残っている試作品の内容は参考にしてよいが、Replit側を本線として更新しない。

ローカル起動時は、iPhoneから開けるようにホストを外部バインドする想定。

```bash
npm run dev -- --host 0.0.0.0
```

同じWi-Fi内のiPhoneからは、MacのローカルIPを使って以下のように開く。

```text
http://<MacのローカルIP>:3000
```

UIはiPhone Safariで実用できるレスポンシブ設計を優先する。

---

## 2026-07-05 現在のGitHub状態

このリポジトリには設計書と作業指示書はあるが、Next.jsアプリ本体はまだ作られていない。

確認できている既存ファイル。

- `README.md`
- `PROJECT_CONTEXT.md`
- `TASKS.md`
- `AGENTS.md`
- `EBAY_SETUP.md`
- `MERCARI_TEMPLATE_GUIDE.md`
- `PROJECT_PROGRESS.md`
- `docs/workflow.md`
- `templates/ipod_listing_template.md`
- `templates/buyer_messages.md`
- `scripts/profit_calculator.py`
- `gas/line_notification_sample.gs`

重要な不足ファイル。

- `package.json`
- `app/page.tsx`
- `app/layout.tsx`
- `tailwind.config.ts`
- `tsconfig.json`

意味。

- `package.json` はNext.js/ReactなどのWebアプリで使う設定ファイル。
- アプリの起動方法、使用ライブラリ、ビルド方法、プロジェクト情報を管理する。
- 現時点では `package.json` がないため、`npm install` や `npm run dev` で起動できるNext.jsアプリ本体は未作成。

以前の「Codex初回実装済み」という記録は、現在のGitHub状態とは一致しないため採用しない。
次回Codex作業では、必ずPhase 1 Task 1のNext.js初期構成から開始する。

---

## 次回Codex作業前の確認

Codexにはまず以下を確認させる。

```bash
pwd
git remote -v
git branch --show-current
ls AGENTS.md PROJECT_CONTEXT.md TASKS.md EBAY_SETUP.md MERCARI_TEMPLATE_GUIDE.md PROJECT_PROGRESS.md
ls package.json app/page.tsx app/layout.tsx tailwind.config.ts tsconfig.json
```

対象リポジトリは以下。

```text
s0931016-cyber/ec-automation-tools
```

対象リポジトリでない場合、作業を進めず停止する。

---

## 次にやること

### 1. Next.js初期構成を作る

作成するファイル。

- `package.json`
- `app/page.tsx`
- `app/layout.tsx`
- `tailwind.config.ts`
- `tsconfig.json`
- 必要に応じて `app/globals.css`、`postcss.config.js`、`.gitignore`、`.env.example`

最低限のゴール。

- `npm install` が通る
- `npm run dev` が通る
- `npm run dev -- --host 0.0.0.0` でMacから起動できる
- 同じWi-Fi内のiPhone Safariから `http://<MacのローカルIP>:3000` で開ける前提のUIにする
- `npm run build` が通る

---

### 2. 商品入力フォーム

`TASKS.md` に従い、iPodカスタム商品用の入力フォームを作る。

最低限含める項目。

- productCategory
- model
- generation
- color
- storageGb
- batteryMah
- usbC
- dataTransfer
- reversibleUsbC
- tapticEngine
- bluetooth
- imod
- condition
- accessories
- purchasePrice
- salePrice
- platform
- notes

---

### 3. iPodプリセット

以下のプリセットを最初から用意する。

- 第6世代 128GB SSD USB-C
- 第7世代 256GB SSD USB-C
- 第5.5世代 256GB SSD USB-C
- 第5.5世代 iMod 512GB Type-C

---

### 4. メルカリ説明文

`MERCARI_TEMPLATE_GUIDE.md` に従い、過去出品に近い構成へ修正する。

必ず含める。

- 挨拶
- ベース機種とカスタム内容
- HDDからSSDへ変更した説明
- Type-Cポート説明
- 状態 / 動作確認
- 新品交換部品
- その他
- 発送・保証

重要。

- 第7世代固定にしない
- 第5世代 / 第5.5世代 / 第6世代 / 第6.5世代 / 第7世代に対応する
- モデルナンバーは任意扱い
- モデルナンバー未入力なら文面に出さない
- `{modelNumber}` などの未置換プレースホルダーを出さない

---

### 5. eBay側を固める

当面はeBay側を優先する。

やること。

- eBay用タイトルと英語説明文をiPodカスタム販売向けに調整
- eBay下書き相当プレビューを整える
- `.env.local` のeBay API設定チェック表示を改善
- 未公開Offer作成の設計を維持
- `publishOffer` は絶対に実行しない
- APIキー、Client Secret、User Token、Refresh Tokenは画面・ログ・GitHubに出さない

---

## 利益計算方針

### Mercari

```text
mercariNet = salePrice - (salePrice * 0.10) - 300
mercariProfit = mercariNet - purchasePrice
```

表示する項目。

- 販売価格
- メルカリ手数料10%
- 送料300円
- 入金見込み額
- 仕入価格
- 利益額

### eBay

```text
ebayTotal = salePrice + shippingChargedToBuyer
ebayFee = ebayTotal * 0.18
ebayNet = ebayTotal - ebayFee
ebayProfit = ebayNet - purchasePrice - shippingCost
```

初期版では送料込み販売として、`salePrice` を送料込み合計額として扱う。

表示する項目。

- 送料込み合計金額
- eBay手数料18%
- 入金見込み額
- 仕入価格
- 実送料
- 利益額

---

## Taptic Engine 条件分岐

`tapticEngine` が true の場合だけ、メルカリ説明文とeBay説明文にTaptic Engine搭載説明を追加する。

日本語例。

```text
Taptic Engine搭載しております。元のクリック音は撤去し、コツコツっとした振動のみ伝わる仕様です。
```

英語例。

```text
This iPod has been upgraded with a Taptic Engine, replacing the original click sound with subtle vibration feedback.
```

`tapticEngine` が false の場合は、Taptic Engineに関する文言を一切出さない。

---

## eBay下書き作成方針

eBay APIでは以下を目標にする。

- `createOrReplaceInventoryItem`
- `createOffer`
- `publishOffer` は実行しない

標準条件。

- marketplace: EBAY_US
- price: 299 USD
- quantity: 1
- condition: Used
- category: iPods & MP3 Players 系
- shipping: Standard Shipping
- return: 30-day free returns
- payment: eBay側のPayment Policy
- item location: Japan / merchantLocationKey
- images: まずはHTTPS画像URL方式

必要な `.env.local` 値。

- EBAY_PAYMENT_POLICY_ID
- EBAY_RETURN_POLICY_ID
- EBAY_FULFILLMENT_POLICY_ID
- EBAY_MERCHANT_LOCATION_KEY

未設定の場合は未公開Offer作成を止め、不足項目名だけ表示する。
秘密情報の値は表示しない。

---

## 保留事項

### Replit

Replit版は本命開発から外す。
今後、Replitを使う場合は一時的なモックや外部公開テストに限定する。

### Yahoo!フリマ

現時点では直接下書き作成API/コネクタが使える前提にしない。
将来的にはコピー用文面生成を検討する。

---

## 2026-07-05 Codex実装メモ

GitHubリポジトリ `s0931016-cyber/ec-automation-tools` を確認し、Phase 1 Task 1からNext.jsアプリ本体を作成した。

追加した主な内容。

- Next.js / TypeScript / React / Tailwind CSS 初期構成
- `npm run dev -- --host 0.0.0.0` 用の起動ラッパー
- iPhone Safariを想定したレスポンシブUI
- 商品入力フォーム
- iPodプリセット
  - 第6世代 128GB SSD USB-C
  - 第7世代 256GB SSD USB-C
  - 第5.5世代 256GB SSD USB-C
  - 第5.5世代 iMod 512GB Type-C
- メルカリ用タイトル・説明文生成
- eBay用英語タイトル・説明文生成
- コピー機能
- Mercari / eBay 別の利益計算
- eBay下書き相当プレビュー
- `.env.local` 前提のeBay設定チェック

安全方針。

- `publishOffer` は実装していない
- ライブ出品処理は実装していない
- eBay秘密情報の値は画面/APIレスポンスに表示しない
- Taptic Engine文言は `tapticEngine` がtrueのときだけ出す
- モデルナンバーは任意で、未入力なら文面に出さない

第5/5.5世代はeBay説明文でWolfson DAC訴求を入れる。

### Etsy

公式APIには `createDraftListing` があり、技術的には下書き作成が可能。
ただし当面は保留。
EtsyでiPodを扱う場合は、ポリシー上 `hand-altered/customized vintage electronics` の見せ方を慎重に検討する。

---

## 運用メモ

ChatGPT側は設計士・現場監督。
Codex側は大工・職人。
GitHubは図面置き場兼現場。

今後も、会話で決まった重要な仕様・進捗はこのファイルまたは関連ドキュメントに追記して保管する。
