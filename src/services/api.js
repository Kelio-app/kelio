class API {
  get(url,cbSuccess,cbFail){
    var http = new XMLHttpRequest();
    http.open('GET', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState === 4 && http.status === 200) {
          if(cbSuccess){
            cbSuccess(JSON.parse(http.responseText));
          }
      }
      else if(http.readyState === 4){
        if(cbFail){
          cbFail({status:http.status,response:http.responseText});
        }
      }
    }
    http.send();
  }
  post(url,data,cbSuccess,cbFail){
    var http = new XMLHttpRequest();
    var params = JSON.stringify(data);
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState === 4 && http.status === 200) {
            if(cbSuccess){
              cbSuccess({status:200,response : JSON.stringify(http.responseText)});
            }
        }
        else if(http.readyState === 4){
          if(cbFail){
            cbFail({status:http.status,response:JSON.stringify(http.responseText)});
          }
        }
    }
    http.send(params);
  }
}
const service = new API();
export default service;
