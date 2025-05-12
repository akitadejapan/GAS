/**
 * 定期的サイクルでメールをチェックしてLINEグループに送信する処理
 * 送信先：グループ
 * 送信内容：会社メールの転送
 */

function checkNotify() {
  // スクリプトプロパティからグループIDとアクセストークンを取得
  const scriptProperties = PropertiesService.getScriptProperties();
  const groupId = scriptProperties.getProperty("LINE_GROUP_ID");
  const accessToken = scriptProperties.getProperty("LINE_ACCESS_TOKEN");
  const label_name = scriptProperties.getProperty("LABEL_NAME");

  if (!groupId || !accessToken) {
    Logger.log("グループIDまたはアクセストークンが設定されていません。");
    Logger.log(groupId);
    Logger.log(accessToken);
    return;
  }

  // Gmailで指定した条件に合致するメールを検索（1日以内に受信）
  // * 条件は適宜変更してください。
  // const searchQuery = 'label:'+ label_name + ' newer_than:5d';
  const searchQuery = 'label:'+ label_name;
  const threads = GmailApp.search(searchQuery,0,10);
  if (threads.length === 0) {
    Logger.log("該当するメールはありません。");
    return;
  }

  // 最新のメールスレッドを取得
  const messages = threads[0].getMessages();
  // Logger.log(threads.length);
  // Logger.log(threads[0].getMessages()[1].getSubject());
  // Logger.log(threads[0].getMessages()[1].getBody());
  const latestMessage = messages[messages.length - 1];
  const subject = latestMessage.getSubject();
  // const body = latestMessage.getPlainBody();
  // 現状は最新の1つだけなので、複数あった場合はぐるぐる回して件名をメールの数だけ表示させたい

  // LINEに通知するメッセージ
  const notificationMessage = `メールが来てます。\n\n件名:${subject}\n\n毎日12時に定期実行しています。`;
  
  // LINEに通知
  sendLineMessage(groupId, accessToken, notificationMessage);
}

function sendLineMessage(groupId,accessToken,notificationMessage) {
  let url = "https://api.line.me/v2/bot/message/push";
  let headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + accessToken
  };
  let postData = {
    "to": groupId,
    "messages": [{
      "type": "text",
      "text": notificationMessage
    }]
  };
  let options = {
    "method" : "post",
    "headers": headers,
    "payload" : JSON.stringify(postData)
  };
  UrlFetchApp.fetch(url, options);
}
