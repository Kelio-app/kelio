import store from 'services/store';
import Observable from "./observable";
import { v4 as uuidv4 } from 'uuid';

class Workflow extends Observable{
  constructor(){
    super();
    this.workflowsById = {};
    this.observableName = "workflowService";
    this.onFirstListener = this.init;
  }
  init(){
    console.log("init");
    const that = this;
    store.get("workflows","local",(res)=>{
      console.log("res",res);
      if(res && Array.isArray(res)){
        that.workflowsById = {}
        for(const workflow of res){
          that.workflowsById[workflow.id] = workflow
        }
      }
      that.notify();
    })
  }
  getWorkflow(id){
    if(this.workflowsById[id]){
      return this.workflowsById[id];
    }
    return false;
  }
  addWorkflow(workflow,cb){
    workflow.id = uuidv4();
    this.workflowsById[workflow.id] = workflow;
    console.log("this.workflowsById ",this.workflowsById);
    this.saveWorkflows(cb);
  }
  updateWorkflow(workflows, cb){
    if(this.workflowsById[workflows.id]){
      this.workflowsById[workflows.id] = workflows;
      this.saveWorkflows(cb);
    }
  }
  deleteWorkflow(workflowId,cb){
    if(this.workflowsById[workflowId]){
      delete this.workflowsById[workflowId]
      this.saveWorkflows(cb);
    }
  }
  saveWorkflows(cb){
    const that = this;
    store.set("workflows",Object.values(this.workflowsById),"local",(res)=>{
      that.notify();
      if(cb){
        cb();
      }
    });
  }
}

const service = new Workflow();
export default service;
