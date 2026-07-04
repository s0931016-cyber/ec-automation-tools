# CODEX_NEXT_PROMPT.md

次回Codexに渡す短い作業指示。

```text
AGENTS.md、PROJECT_CONTEXT.md、TASKS.md、EBAY_SETUP.md、MERCARI_TEMPLATE_GUIDE.md、PROJECT_PROGRESS.mdを読んでください。

現在のリポジトリが s0931016-cyber/ec-automation-tools であることを確認してください。

まず以下を確認してください。

pwd
git remote -v
git branch --show-current
ls AGENTS.md PROJECT_CONTEXT.md TASKS.md EBAY_SETUP.md MERCARI_TEMPLATE_GUIDE.md PROJECT_PROGRESS.md
ls package.json app/page.tsx app/layout.tsx tailwind.config.ts tsconfig.json

現状、package.json が無ければ Next.js アプリ本体は未作成です。
その場合は Phase 1 Task 1 から始めてください。

今回の作業:

1. Next.js / TypeScript / React / Tailwind CSS の初期構成を作る
2. package.json、app/page.tsx、app/layout.tsx、app/globals.css、tailwind.config.ts、tsconfig.json、postcss.config.js を作る
3. Macで npm run dev -- --host 0.0.0.0 できる構成にする
4. iPhone Safariで使いやすいレスポンシブUIを前提にする
5. 商品入力フォームを作る
6. iPodプリセットを入れる
   - 第6世代 128GB SSD USB-C
   - 第7世代 256GB SSD USB-C
   - 第5.5世代 256GB SSD USB-C
   - 第5.5世代 iMod 512GB Type-C
7. メルカリ用タイトル・説明文を生成する
8. eBay用英語タイトル・説明文を生成する
9. コピー機能を付ける
10. Mercari/eBay別の利益計算を入れる
11. eBay下書き相当プレビューを作る
12. .env.local 前提のeBay設定チェックを作る。ただし秘密情報の値は絶対に画面・ログ・GitHubに出さない

重要:

- publishOffer は絶対に実装しない
- ライブ出品は絶対に行わない
- APIキー、Client Secret、User Token、Refresh Tokenは表示しない
- モデルナンバーは任意。未入力なら文面に出さない
- 第7世代固定にしない。第5世代、5.5世代、6世代、6.5世代、7世代に対応する
- Taptic Engineはチェックがtrueの場合だけ説明文に出す。falseなら一切出さない
- 実装後、npm install、npm run build、可能ならnpm run lintを実行して結果を報告してください
```
