# AGENTS.md

## 作業前の確認

このリポジトリで作業する前に、必ず以下を読むこと。

- PROJECT_CONTEXT.md
- TASKS.md
- EBAY_SETUP.md
- MERCARI_TEMPLATE_GUIDE.md
- PROJECT_PROGRESS.md

## 作業対象

対象リポジトリ:

```text
s0931016-cyber/ec-automation-tools
```

作業前に以下を確認すること。

```bash
pwd
git remote -v
git branch --show-current
ls AGENTS.md PROJECT_CONTEXT.md TASKS.md EBAY_SETUP.md MERCARI_TEMPLATE_GUIDE.md PROJECT_PROGRESS.md
```

対象リポジトリでない場合、作業を進めずに停止すること。

## 基本方針

- 小さく動くものから実装する
- 既存ファイルを壊さない
- 不明点はREADME.mdまたはTASKS.mdに仮定を書く
- 型安全を重視する
- UIは実用性を優先する
- 過度に複雑化しない
- 会話で決まった重要な進捗や判断はPROJECT_PROGRESS.mdに保管する

## メルカリ説明文

メルカリ説明文は短く簡略化しすぎない。

必ず `MERCARI_TEMPLATE_GUIDE.md` の構成に従い、以下を含めること。

- 挨拶
- ベース機種とカスタム内容
- HDDからSSDへ変更した説明
- Type-Cポート説明
- 状態 / 動作確認
- 新品交換部品
- その他
- 発送・保証

### 重要

- メルカリ説明文を第7世代固定にしない
- 第5世代 / 第5.5世代 / 第6世代 / 第6.5世代 / 第7世代に対応する
- モデルナンバーは任意扱いにする
- モデルナンバーが未入力の場合は文面に出さない
- `{modelNumber}` などの未置換プレースホルダーを出力しない

## セキュリティ

以下を絶対にGitHubへコミットしない。

- `.env.local`
- APIキー
- Client Secret
- User Token
- Refresh Token
- credentials.json
- token.json

秘密情報は画面・ログ・APIレスポンスにも表示しない。

## eBay API

- 最初は読み取り専用API接続確認まで
- 未公開Offer作成は `createOrReplaceInventoryItem` と `createOffer` まで
- `publishOffer` は絶対に実行しない
- 出品・更新などの実行処理は、確認画面と明示的な実行ボタンができるまで行わない

## 利益計算

メルカリ:

- 販売価格から10%手数料を引く
- 送料300円を引く
- 入金見込み額から仕入価格を引いて利益表示

eBay:

- 送料込み合計から18%手数料を引く
- 入金見込み額から仕入価格と実送料を引いて利益表示
