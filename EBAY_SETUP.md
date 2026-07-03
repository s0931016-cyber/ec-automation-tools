# EBAY_SETUP.md

# eBay API Setup Guide

このファイルは、eBay APIをローカル環境で安全に使うための設定メモです。

## 重要

APIキー、Client Secret、User TokenはGitHubにコミットしないこと。

本物の値は、ローカルPCの `.env.local` にだけ保存します。

---

## 1. `.env.local` を作成する

リポジトリ直下で `.env.example` をコピーして `.env.local` を作ります。

```bash
cp .env.example .env.local
```

Windowsの場合は手動で `.env.example` をコピーして、名前を `.env.local` に変更してもOKです。

---

## 2. `.env.local` にProduction情報を貼る

```env
EBAY_CLIENT_ID=ここにProductionのApp ID / Client ID
EBAY_CLIENT_SECRET=ここにProductionのCert ID / Client Secret
EBAY_DEV_ID=ここにProductionのDev ID
EBAY_RUNAME=ここにProductionのRuName
EBAY_USER_TOKEN=ここにProductionのUser Token
EBAY_ENV=production
EBAY_API_BASE_URL=https://api.ebay.com
```

---

## 3. eBay下書き作成の標準設定

最初の標準パターンは、iPod classic 第7世代 256GB USB-C 2000mAhを想定します。

```env
EBAY_MARKETPLACE_ID=EBAY_US
EBAY_DEFAULT_CURRENCY=USD
EBAY_DEFAULT_PRICE=299
EBAY_DEFAULT_QUANTITY=1
EBAY_DEFAULT_CONDITION=USED
EBAY_DEFAULT_CATEGORY_LABEL=iPods & MP3 Players
EBAY_DEFAULT_CATEGORY_ID=
```

### 標準販売条件

- 価格: 299 USD
- 数量: 1
- 状態: Used
- カテゴリ: iPods & MP3 Players 系
- 画像: まずはHTTPS画像URL入力方式
- 発送: Standard Shipping
- 返品: 30-day free returns
- 支払い: eBay側のPayment Policy
- 発送元: Japan / merchantLocationKey

### Business Policy ID

eBay APIでOfferを作る場合、発送・返品・支払いポリシーは表示名ではなくIDが必要です。

```env
EBAY_PAYMENT_POLICY_ID=ここにPayment Policy ID
EBAY_RETURN_POLICY_ID=ここに30-day free returnsのReturn Policy ID
EBAY_FULFILLMENT_POLICY_ID=ここにStandard ShippingのFulfillment Policy ID
EBAY_MERCHANT_LOCATION_KEY=ここにJapan発送元のmerchantLocationKey
```

実装では、これらが未設定の場合はOffer作成を止め、秘密情報を表示せずに不足項目だけを案内します。

---

## 4. Sandboxを使う場合

Sandboxで検証する場合は、以下も設定します。

```env
EBAY_SANDBOX_CLIENT_ID=SandboxのApp ID / Client ID
EBAY_SANDBOX_CLIENT_SECRET=SandboxのCert ID / Client Secret
EBAY_SANDBOX_DEV_ID=SandboxのDev ID
EBAY_SANDBOX_RUNAME=SandboxのRuName
EBAY_SANDBOX_USER_TOKEN=SandboxのUser Token
EBAY_SANDBOX_API_BASE_URL=https://api.sandbox.ebay.com
```

---

## 5. GitHubに上げてはいけないもの

以下は絶対にコミットしないこと。

- `.env.local`
- `Client Secret`
- `User Token`
- `Refresh Token`
- `token.json`
- `credentials.json`

`.gitignore` で除外済みです。

---

## 6. 最初に実装するAPI機能

安全確認のため、最初は出品や更新ではなく読み取り系から実装します。

優先順位。

1. 環境変数の読み込み確認
2. eBay API接続確認
3. 自分の出品一覧取得
4. 注文一覧取得
5. 未公開Offer作成
6. 将来的に確認後の出品作成・更新

未公開Offer作成では `publishOffer` を実行しません。

---

## 7. トークンについて

チャットなどに一時的に貼ったUser Tokenは、作業後に再生成することを推奨します。

安全運用では、最終的にOAuthのRefresh Tokenを使ってAccess Tokenを更新する構成にします。

---

## Codexへの指示例

```text
PROJECT_CONTEXT.md、TASKS.md、EBAY_SETUP.mdを読んでください。
まずは .env.local からeBay API設定を読み込み、設定不足なら安全なエラーを出す実装を追加してください。
その後、読み取り専用のAPI接続確認機能を作ってください。
未公開Offer作成を実装する場合は、publishOfferを絶対に実行せず、作成前に確認画面を挟んでください。
```
