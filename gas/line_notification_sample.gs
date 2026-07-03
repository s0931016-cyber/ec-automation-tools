// Google Apps Script sample for LINE Messaging API push notification.
// Do not commit real access tokens. Store them in Script Properties.

function sendLineMessageSample() {
  const userId = PropertiesService.getScriptProperties().getProperty('LINE_USER_ID');
  const token = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');

  if (!userId || !token) {
    throw new Error('Missing LINE_USER_ID or LINE_CHANNEL_ACCESS_TOKEN in Script Properties.');
  }

  const payload = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: 'EC workflow notification test.'
      }
    ]
  };

  const response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + token
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());
}
