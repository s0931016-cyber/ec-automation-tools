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

## 注意

実装中に判断が必要な場合は、無理に複雑化しない。
まずは動くものを優先する。
