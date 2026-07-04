# ec-automation-tools

EC automation tools and templates for custom iPod resale operations.

## Purpose

This repository is the working base for an iPod custom listing workbench.

The main goal is to create a local web app that can turn product specs and photos into practical listing drafts, especially for eBay.

## Current Direction

- Build the real app in this GitHub repository.
- Treat Replit as a prototype only.
- Run locally on a Mac.
- Operate from iPhone Safari on the same Wi-Fi network when useful.
- Focus on eBay first.
- Keep Mercari support as a helper because ChatGPT can already help create Mercari drafts.

## Current Status

Design and instruction files exist, but the Next.js app itself may still need to be created.

If `package.json` is missing, start from the initial Next.js setup.

Important expected files for the app:

- `package.json`
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `tailwind.config.ts`
- `tsconfig.json`
- `postcss.config.js`

## Core Workflow

1. Discuss rough ideas with ChatGPT.
2. Turn decisions into clear project instructions.
3. Save decisions in GitHub.
4. Let Codex read the instruction files and implement.
5. Test the result locally.
6. Use feedback to update the instructions and code.

Short version: ChatGPT designs, GitHub stores the plan, Codex builds.

## Required Reading Before Codex Work

Codex should read these files before making changes:

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `TASKS.md`
- `EBAY_SETUP.md`
- `MERCARI_TEMPLATE_GUIDE.md`
- `PROJECT_PROGRESS.md`
- `CODEX_NEXT_PROMPT.md` when present

## Local Development Goal

Run on Mac:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Then open from iPhone Safari on the same Wi-Fi:

```text
http://<Mac local IP>:3000
```

## eBay Safety Policy

The app may prepare eBay draft-like data and eventually create unpublished inventory/offer records.

It must not publish live listings.

Forbidden unless explicitly redesigned later:

- `publishOffer`
- live listing publication
- exposing API secrets in UI, logs, GitHub, or responses

Secrets must stay in local `.env.local` only.
Use `.env.example` for key names only.

## Useful Next Prompt

See `CODEX_NEXT_PROMPT.md` for the next compact instruction to give Codex.
