
// const label_name = ""

function myFunction() {

  const searchQuery = 'category:promotions';
  const threads = GmailApp.search(searchQuery,0,480);
  // Logger.info(threads.length)
  // Logger.info(threads[0].getMessages()[0].getSubject());
  threads.forEach(function(value){
    // Logger.log(value.getFirstMessageSubject());
    value.moveToTrash();
  });
  // for(var i = 0; i < threads.length; i++){
  //   var sub = threads.threads[i].getMessages()[i].getSubject
  //   threads[i].moveToTrash();
  //   Logger.info(sub + "がゴミ箱に移動されました")
  // } 

  // if (threads.length === 0) {
  //   Logger.log("該当するメールはありません。");
  //   return;
  // }
}
