# PROJECT_CONTEXT.md

# EC Automation Tools / iPod Custom Sales Support

## 目的

このリポジトリは、iPod Classic / iPod Video / iPod nano などのカスタム販売業務を効率化するための開発プロジェクトです。

ChatGPTで仕様・販売文・運用方針を整理し、Codex/GitHubで実装・管理できる状態にすることを目的とします。

---

## プロジェクトの主目的

仕様と写真だけで、eBay出品下書き相当まで作れるローカルWebアプリを作る。

まずはMacでローカル起動し、同じWi-Fi内のiPhone Safariから操作できる作業台を目指す。

---

## 役割分担

- User: 実務判断者。使えるかどうか、商売に役立つかどうかを最終判断する。
- ChatGPT: 設計士・仕様整理担当。会話から仕様を抽出し、Codexに渡せる指示書へ変換する。
- Codex: 実装担当。GitHubの仕様書を読んでコードを書く。
- GitHub: 正式な仕様書、進捗、コードの保管場所。

---

## 運用方針

基本運用は以下。

1. UserとChatGPTで仕様相談する
2. Userが決定事項として確定する
3. ChatGPTが決定事項をMarkdown、JSON、AGENTS.md、TASKS.md、PROJECT_CONTEXT.mdなどに整理する
4. GitHubへ保存する
5. CodexがGitHub上の説明書・仕様書・タスクを読んで実装・修正・検証を行う
6. Userが実物を確認する
7. 修正点をChatGPTと再整理する

短く言うと、ChatGPTで仕様を固め、GitHubに図面を置き、Codexに作らせる。

---

## 運用原則

- ふわっとしたアイデアはまずChatGPTと会話で詰める
- その場でいきなりCodexに投げず、決定事項にしてから渡す
- GitHubに置いた内容を正とする
- Codexには毎回、AGENTS.md、PROJECT_CONTEXT.md、TASKS.md、EBAY_SETUP.md、MERCARI_TEMPLATE_GUIDE.md、PROJECT_PROGRESS.mdを読ませてから作業させる
- 会話ログそのものではなく、整理済みの決定事項を共有する
- 実務で使えない機能は作らない
- クレジット節約のため、Codexには短く明確な作業指示を渡す

---

## 対象業務

主な対象は以下です。

- iPod Classic / iPod Video / iPod nano のカスタム販売
- SSD化、USB-C化、バッテリー交換、Taptic Engine、iMod、Bluetooth MOD などの仕様管理
- メルカリ、eBay、Yahoo!フリマ、Etsy、Shopify などの出品文・商品管理
- 商品画像、説明文、保証書、納品書、PDFなどの作成補助
- 将来的な価格分析、利益計算、CSV管理、API連携

---

## 現在の開発戦略

まずはeBay側を固める。

- Mercari: ChatGPT側で下書き作成できるため、作業台では補助扱い
- eBay: API連携で未公開Offer作成までを目標にする
- Yahoo!フリマ: いったん保留。将来はコピー用文面生成を検討
- Etsy: API下書き作成の可能性はあるが、いったん保留
- Replit: 試作扱い。本命開発には使わない

---

## 最重要方針

最初から大規模に作り込まず、まず実用できる小さい成果物を作る。

優先順位は以下。

1. 入力しやすい
2. 出品文をすぐ作れる
3. 商品情報を残せる
4. 利益計算できる
5. 後から拡張しやすい

---

## 初期開発のゴール

最初に作るべきものは、iPod商品テンプレート生成ツールです。

### 入力項目

- 商品カテゴリ
- 世代 / モデル
- カラー
- ストレージ容量
- バッテリー容量
- USB-C対応有無
- データ転送対応有無
- 両面認識対応有無
- Taptic Engine有無
- Bluetooth有無
- iMod有無
- 外装状態
- 付属品
- 仕入価格
- 販売予定価格
- 販売先
- メモ

### 出力項目

- メルカリ用タイトル
- メルカリ用説明文
- eBay用タイトル
- eBay用英語説明文
- 日本語スペック一覧
- 英語スペック一覧
- 利益計算

---

## 商品説明テンプレート方針

説明文は、誇張しすぎず、事実ベースで信頼感を出す。

特に重要な表現。

- 動作確認済み
- USB-Cで充電・データ転送可能
- SSD化済み
- 大容量バッテリー搭載
- 外装・ホイール・イヤホンケーブル交換済みの場合は明記
- 中古ベースのため微細な傷はある可能性を明記
- 海外向けには関税・輸入税は購入者負担と明記

---

## 利益計算方針

販売先ごとに利益計算を分ける。

### メルカリ

メルカリは販売価格から10%手数料と送料300円を引いた入金見込み額を表示する。

```text
mercariNet = salePrice - (salePrice * 0.10) - 300
mercariProfit = mercariNet - purchasePrice
```

### eBay

eBayは送料込みの合計金額から18%手数料を引いた入金見込み額を表示する。

```text
ebayTotal = salePrice + shippingChargedToBuyer
ebayFee = ebayTotal * 0.18
ebayNet = ebayTotal - ebayFee
ebayProfit = ebayNet - purchasePrice - shippingCost
```

初期版では、送料込み販売の場合は `salePrice` を送料込み合計額として扱う。

---

## 代表的な商品仕様

### iPod Classic / Video

- SSD: 128GB / 256GB / 512GB / 1TB
- Battery: 2000mAh など
- USB-C: 充電 + データ転送対応
- Taptic Engine: 対応可能
- iMod: 5th / 5.5th系で対応可能
- DAC: 5th / 5.5th は Wolfson、6th / 7th は Cirrus

### 注意点

- 5.5th Video は Wolfson DAC として訴求価値が高い
- 7th Classic は実用性・曲数上限・安定性で訴求しやすい
- 6th / 6.5th はLBA制限に注意
- 商品説明では世代ごとの差異を正確に扱う

---

## eBay下書き作成方針

eBay API連携では、まず未公開Offer作成までを目標にする。

標準条件は以下。

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

実装では `createOrReplaceInventoryItem` と `createOffer` までを行い、`publishOffer` は絶対に実行しない。
公開処理は、明示的な確認画面と実行ボタンが別途合意されるまで作らない。

---

## セキュリティ方針

以下はGitHub、画面、ログ、APIレスポンスに出さない。

- APIキー
- Client Secret
- User Token
- Refresh Token
- credentials.json
- token.json
- `.env.local`

`.env.example` にはキー名だけを書く。
本物の値はローカルPCの `.env.local` のみに置く。

---

## 将来的に作りたい機能

- 商品登録画面
- 商品一覧
- 商品編集
- 出品文自動生成
- eBay英語説明文生成
- PDF保証書出力
- 納品書出力
- CSV出力
- 仕入価格・販売価格・送料・手数料から利益計算
- 相場メモ管理
- 画像管理
- QRコード / 管理番号発行
- Google Sheets連携
- eBay API連携
- Shopify / Etsy連携

---

## 技術スタック方針

初期候補。

- Next.js
- TypeScript
- React
- Tailwind CSS
- SQLite

将来的には必要に応じて以下を検討。

- PostgreSQL
- Prisma
- Vercel
- GitHub Actions
- Google Apps Script
- eBay API

---

## UI方針

画面はシンプルでよい。

優先すること。

1. スマホでも入力しやすい
2. 商品登録が速い
3. コピー用の出品文が見やすい
4. 難しい管理画面にしない
5. 後から項目追加しやすい

---

## Codexへの作業方針

Codexはこのファイルを最初に読むこと。

実装時は以下を守る。

- 小さく動くものから作る
- 既存ファイルを壊さない
- 不明点はREADMEまたはTASKS.mdに仮定を書く
- 型安全を重視する
- UIよりもまず機能を優先する
- ただし入力画面は実用性を優先する
- GitHub上の現在のファイル状態を確認してから作業する

---

## 現在の優先タスク

1. 最小構成のNext.jsアプリを作る
2. 商品登録フォームを作る
3. 入力内容からメルカリ説明文を生成する
4. 入力内容からeBay英語説明文を生成する
5. 生成文をコピーできるようにする
6. 商品データを一時保存できるようにする

---

## ChatGPTとの運用

このプロジェクトは、ChatGPTとの会話で仕様を追加・修正しながら進める。

重要な仕様変更があったら、この `PROJECT_CONTEXT.md`、`TASKS.md`、`PROJECT_PROGRESS.md` のいずれかに追記する。

Codexには毎回、以下のように指示するとよい。

```text
AGENTS.md、PROJECT_CONTEXT.md、TASKS.md、EBAY_SETUP.md、MERCARI_TEMPLATE_GUIDE.md、PROJECT_PROGRESS.mdを読んでください。
現在のリポジトリが s0931016-cyber/ec-automation-tools であることを確認してください。
GitHub上の現在のファイル状態を確認してから作業してください。
```
