chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      // read `newIconPath` from request and read `tab.id` from sender
      //alert("good");
      if(request.message == "loadingIcon"){
        chrome.browserAction.setIcon({
          path: "kelioLoading.png",
          tabId: sender.tab.id
        });
      }
      else if(request.message == "errorIcon"){
        chrome.browserAction.setIcon({
          path: "kelioError.png",
          tabId: sender.tab.id
        });
      }
      else if(request.message == "validateIcon"){
        chrome.browserAction.setIcon({
          path: "kelioValidate.png",
          tabId: sender.tab.id
        });
      }
});
