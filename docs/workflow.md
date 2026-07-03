# Workflow

This repo is the working base for EC automation and listing operations.

## Standard Flow

1. Collect item data and photos.
2. Choose a listing template from `templates/`.
3. Adjust specs, condition, storage, battery, and shipping terms.
4. Calculate target price and profit using scripts in `scripts/`.
5. Save final listing text and buyer-message templates.
6. Use GAS snippets in `gas/` when a workflow should notify LINE or process spreadsheet rows.

## Priority Areas

- Modified iPod listing templates
- eBay buyer messages with Japanese translation
- Return and damage-report response templates
- Profit calculation helpers
- CSV sourcing checks
- LINE notification automation

## Rules

- Do not commit API keys or account credentials.
- Do not commit buyer addresses or private order details.
- Keep templates reusable and easy to edit.
