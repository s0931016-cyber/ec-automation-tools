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

The initial Next.js app has been created.

Important app files:

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

## Double-Click Launcher On Mac

You can start the local workbench without typing commands by double-clicking:

```text
start-ipod-workbench.command
```

The launcher will:

- move into this repository directory
- install dependencies if `node_modules` is missing
- use `npm` when available
- fall back to `pnpm` when `npm` is unavailable or install/start fails
- run `npm run dev -- --host 0.0.0.0` or `pnpm run dev -- --host 0.0.0.0`
- open `http://localhost:3000` in Safari after a few seconds

If macOS blocks the file the first time, right-click it and choose Open.

## Open From iPhone Safari

Keep the launcher window open, then find your Mac local IP address:

```bash
ipconfig getifaddr en0
```

If that prints nothing, try:

```bash
ipconfig getifaddr en1
```

Open this from iPhone Safari on the same Wi-Fi:

```text
http://<Mac local IP>:3000
```

Example:

```text
http://192.168.1.23:3000
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

## Current Features

- iPhone Safari friendly responsive UI
- Product input form for custom iPod listings
- iPod presets:
  - 第6世代 128GB SSD USB-C
  - 第7世代 256GB SSD USB-C
  - 第5.5世代 256GB SSD USB-C
  - 第5.5世代 iMod 512GB Type-C
- Mercari title and description generation
- eBay English title and description generation
- Copy buttons for generated text and specs
- Separate Mercari and eBay profit calculation
- eBay draft-like preview with SKU generation
- `.env.local` based eBay configuration check that shows only missing variable names

## Future Work

- Save product records locally
- Add product list and edit screens
- Add richer image management
- Resolve exact eBay category IDs via Taxonomy API
- Add read-only eBay API connection checks
- Later, add unpublished inventory item / offer creation only with a confirmation screen
- Never implement `publishOffer` without a new explicit redesign

## Useful Next Prompt

See `CODEX_NEXT_PROMPT.md` for the next compact instruction to give Codex.
