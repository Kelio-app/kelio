/*global chrome*/


class ImgService {
  geturl(path){
    if(chrome && chrome.runtime && chrome.runtime.getURL){
      return chrome.runtime.getURL(path);
    }
    return path;
  }
}
const service = new ImgService();
export default service;
