# Decisions 2026-07-05

## ChatGPT / Codex / GitHub 運用方針

### 決定

ChatGPTとの会話で仕様やアイデアを整理し、ユーザーが決定事項として確定し、それをGitHubへ保存する。
CodexはGitHub上の仕様書・指示書を読んで実装する。

## 役割

| Actor | Role |
|---|---|
| User | 実務判断者。商売に役立つか、実際に使えるかを最終判断する。 |
| ChatGPT | 設計士・仕様整理担当。会話から仕様、優先順位、注意点を抽出する。 |
| GitHub | 正式な仕様書、進捗、コードの保管場所。 |
| Codex | 実装担当。GitHubの指示書を読んでコードを書く。 |

## 基本フロー

1. UserとChatGPTで仕様相談する
2. Userが決定事項として確定する
3. ChatGPTが決定事項をMarkdown/JSON/プロジェクト文書に整理する
4. GitHubへ保存する
5. CodexがGitHubの文書を読んで実装する
6. Userが実物を確認する
7. 修正点をChatGPTと再整理する

## 原則

- GitHubに置いた内容を正とする
- 会話ログそのものではなく、整理済みの決定事項を共有する
- Codexには毎回、AGENTS.md、PROJECT_CONTEXT.md、TASKS.md、EBAY_SETUP.md、MERCARI_TEMPLATE_GUIDE.md、PROJECT_PROGRESS.mdを読ませる
- クレジット節約のため、Codexには短く明確な作業指示を渡す
- 実務で使えない機能は作らない

## Replitの扱い

Replitは試作扱い。
本命開発はGitHubリポジトリ `s0931016-cyber/ec-automation-tools` で行う。

## 現在の実装前提

2026-07-05時点でGitHub上に `package.json` が存在しない場合、Next.jsアプリ本体は未作成と判断する。
その場合、CodexはPhase 1 Task 1のNext.js初期構成から始める。

## eBay安全方針

- まずはeBay側を固める
- 未公開Offer作成までを目標にする
- `createOrReplaceInventoryItem` と `createOffer` まで
- `publishOffer` は絶対に実行しない
- ライブ出品は行わない
- APIキー、Client Secret、User Token、Refresh TokenはGitHub、画面、ログに出さない
