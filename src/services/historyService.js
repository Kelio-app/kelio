import store from 'services/store';
import Observable from "./observable";

class History extends Observable {
  constructor(){
    super();
    this.observableName = "historyService";
    this.history = [];
    this.onFirstListener = this.get
  }
  newCall(workflow,data,result){
    if(this.history.length<=0){
      console.log("no history ");
      const that = this;
      this.get(()=>{
        console.log("history loaded");
        that.pushHistory(workflow,data,result)
      });
      return;
    }
    this.pushHistory(workflow,data,result);
  }
  pushHistory(workflow,data,result){
    let success = true;
    if(result.status !== 200){
      success = false;
    }
    this.history.push({
      workflow : workflow.id,
      timestamp : new Date().valueOf(),
      parameters : data,
      result : result,
      success : success
    });
    this.saveHistory();
  }

  saveHistory(cb){
    const that = this;
    store.set("history",this.history,"local",(res)=>{
      that.notify();
      if(cb){
        cb();
      }
    });
  }
  get(cb){
    let that = this;
    store.get("history","local",(res)=>{
      console.log("history ",res);
      if(res){
        console.log("history from store : ",res);
        that.history = res;
        if(cb){
          cb()
        }
        that.notify();
      }
    });
  }
}

const service = new History();
export default service;
