# Google Apps Script Notes

This folder stores Google Apps Script examples for EC workflow automation.

## Current Sample

- `line_notification_sample.gs`: LINE Messaging API push notification sample

## Secret Handling

Do not write real tokens directly in code.

Use Apps Script:

1. Project Settings
2. Script Properties
3. Add keys such as:
   - `LINE_USER_ID`
   - `LINE_CHANNEL_ACCESS_TOKEN`

## Future Ideas

- Spreadsheet row check and LINE notification
- eBay order memo formatting
- Sourcing alert from CSV or Google Sheets
- Daily sales summary
