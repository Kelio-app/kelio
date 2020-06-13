/*global chrome*/

class Store {
  get(key,from,cb){
    if(chrome && chrome.storage){
      if(from === "sync"){
        chrome.storage.sync.get(key, function(result) {
          if(cb){
            cb( (result[key] || []) );
          }
       });
      }
      else if( from === "local"){
        chrome.storage.local.get(key, function(result) {
          if(cb){
            cb( (result[key] || []) );
          }
          console.log("result from get",result);
       });
      }
    }
    else{
      if(cb){
        cb(JSON.parse(localStorage.getItem(key)));
      }
    }
  }
  set(key,value,from,cb){
    if(chrome && chrome.storage){
      let data = {};
      data[key] = value;
      console.log("from "+from)
      if(from === "sync"){
        chrome.storage.sync.set(data, function() {
          if(cb){
            cb(value);
          }
        });
      }
      else if( from === "local"){
        chrome.storage.local.set(data, function() {
          if(cb){
            cb(value);
          }
        });
      }
    }
    else{
      localStorage.setItem(key,JSON.stringify(value));
      if(cb){
        cb(localStorage.getItem(key));
      }

    }
  }
}
const service = new Store();
export default service;
