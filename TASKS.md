# TASKS.md

# Current Development Tasks

Codexは `PROJECT_CONTEXT.md` を読んだうえで、このファイルのタスクを上から順に実行すること。

---

## Phase 1: 最小構成のアプリ作成

### 目的

まずはローカルで動く、iPod商品テンプレート生成ツールを作る。

---

## Task 1: Next.js / TypeScript の初期構成

以下の構成でアプリを作る。

- Next.js
- TypeScript
- React
- Tailwind CSS

最低限、以下ができればよい。

- `npm install`
- `npm run dev`
- ブラウザでトップページ表示

---

## Task 2: 商品入力フォーム

トップページに商品入力フォームを作る。

### 入力項目

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

## Task 3: メルカリ説明文生成

入力内容から日本語のメルカリ向け説明文を生成する。

### 方針

- 丁寧で信頼感のある文面
- 改造内容を箇条書き
- 中古品である注意書き
- 動作確認済みの表現
- 過度な誇張は避ける

---

## Task 4: eBay英語説明文生成

入力内容からeBay向けの英語説明文を生成する。

### 方針

- Clear and professional English
- Mention tested working condition
- Mention custom modifications
- Mention import duties/taxes are buyer's responsibility
- Avoid exaggerated claims

---

## Task 5: コピー機能

生成した説明文に対して、ワンクリックでコピーできるボタンを作る。

対象。

- メルカリ用タイトル
- メルカリ用説明文
- eBay用タイトル
- eBay用説明文

---

## Task 6: 利益計算

以下から簡易利益を計算する。

- salePrice
- purchasePrice

初期版では送料・手数料は未対応でよい。

将来的に以下を追加する。

- platformFee
- shippingCost
- partsCost
- exchangeRate

---

## Task 7: README更新

README.mdに以下を書く。

- このプロジェクトの目的
- セットアップ方法
- 開発コマンド
- 現在できること
- 今後追加予定の機能

---

## Doneの条件

Phase 1は以下を満たしたら完了。

- `npm run dev` で起動できる
- 商品情報を入力できる
- メルカリ説明文が生成される
- eBay説明文が生成される
- コピーできる
- READMEがある

---

## Phase 2: eBay API接続の土台作成

### 目的

eBay APIを安全に使えるようにする。

最初から出品作成や在庫更新などの書き込み処理は行わず、まずは環境変数の読み込みと読み取り系API接続確認を実装する。

---

## Task 8: eBay環境変数の読み込み

`.env.local` から以下を読み込む。

- EBAY_CLIENT_ID
- EBAY_CLIENT_SECRET
- EBAY_DEV_ID
- EBAY_RUNAME
- EBAY_USER_TOKEN
- EBAY_ENV
- EBAY_API_BASE_URL

### 方針

- 本物のキーはGitHubにコミットしない
- `.env.example` はサンプルとしてGitHubに置く
- 必須値が不足している場合は、秘密情報を表示せずに安全なエラーを出す

---

## Task 9: eBay API設定チェック機能

開発用に、eBay API設定が揃っているか確認できる処理を作る。

### 例

- APIキーが設定済みか
- User Tokenが設定済みか
- Production / Sandbox のどちらを使っているか
- API Base URLが正しいか

### 注意

Client SecretやUser Tokenの中身は画面やログに表示しない。

---

## Task 10: eBay読み取りAPI接続確認

最初は読み取り専用のAPIで接続確認する。

候補。

- 自分の出品一覧取得
- 注文一覧取得
- アカウント情報取得

実装時点で利用APIが決まっていない場合は、`EBAY_SETUP.md` に仮定を追記する。

---

## Task 11: eBay出品ドラフト作成の設計

Phase 1の商品入力フォームから、eBay出品ドラフト作成に必要な項目を整理する。

### 整理する項目

- title
- description
- categoryId
- condition
- price
- currency
- quantity
- item location
- shipping policy
- return policy
- payment policy
- images

### 標準値

初期の標準値は以下とする。

- price: 299
- currency: USD
- quantity: 1
- condition: USED
- category label: iPods & MP3 Players 系
- marketplace: EBAY_US
- shipping: Standard Shipping
- return: 30-day free returns
- payment: eBay側のPayment Policy
- item location: Japan / merchantLocationKey
- images: まずはHTTPS画像URL入力方式

### 注意

実際の出品作成は、確認画面と明示的な実行ボタンを用意してから行う。

---

## Task 12: eBay未公開Offer作成

商品仕様と画像URLから、eBayの下書き相当として未公開Offerを作成する。

### 方針

- 商品フォームの入力内容からeBay用タイトルと英語説明文を生成する
- SKUを自動生成する
- `createOrReplaceInventoryItem` でInventory Itemを作成する
- `createOffer` でOfferを作成する
- `publishOffer` は絶対に実行しない
- 作成前に確認画面を表示する
- APIキーやトークンはログや画面に表示しない
- 画像はまずHTTPS画像URL入力方式で実装する

### `.env.local` から読む値

- EBAY_MARKETPLACE_ID
- EBAY_DEFAULT_CURRENCY
- EBAY_DEFAULT_PRICE
- EBAY_DEFAULT_QUANTITY
- EBAY_DEFAULT_CONDITION
- EBAY_DEFAULT_CATEGORY_LABEL
- EBAY_DEFAULT_CATEGORY_ID
- EBAY_PAYMENT_POLICY_ID
- EBAY_RETURN_POLICY_ID
- EBAY_FULFILLMENT_POLICY_ID
- EBAY_MERCHANT_LOCATION_KEY

### 未設定時の動作

- Business Policy IDやmerchantLocationKeyが未設定なら、未公開Offer作成は実行しない
- 不足している項目名だけ表示する
- 秘密情報の値は表示しない

---

## Phase 2 Doneの条件

- `.env.local` を使う設計になっている
- 秘密情報がGitHubに入らない
- eBay API設定チェックができる
- 読み取り系APIの接続確認ができる
- 出品ドラフト作成に必要な項目が整理されている
- 未公開Offer作成では `publishOffer` を実行しない

---

## 注意

実装中に判断が必要な場合は、無理に複雑化しない。
まずは動くものを優先する。

APIキー、Client Secret、User Token、Refresh Tokenは絶対にGitHubへコミットしない。
