/*global chrome*/

import React from 'react';
import "./global.scss";
import * as shlex from "shlex";
import { Shortcut } from "./component";
import Emojione from 'components/Emojione/Emojione';
import API from 'services/api';
import historyService from "services/historyService";
import $ from 'jquery';

export default class GlobalContent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchValue : "",
      indexSelected : -1,
      workflowSelected : false,
      searchIsOpen : false,
      currentToolTip : -1,
      availableWorkflows: [],
      workflows : [],
    };
    this.input = null;
    var that = this;
    chrome.storage.local.get("workflows", function(result) {
      if(Array.isArray(result.workflows)){
        that.state.workflows = result.workflows;
      }
   });
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDownInput = this.handleKeyDownInput.bind(this);
    this.manageToolTip = this.manageToolTip.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }
  componentDidMount(){
    var that = this;
    document.onkeydown = function(event){
      if( (event.metaKey || event.ctrlKey) && event.which===75){
        that.state.searchIsOpen = !that.state.searchIsOpen;
        if(that.state.searchIsOpen){
          that.state.selectedText = window.getSelection();
          chrome.storage.sync.get("workflows", function(result) {
            if(Array.isArray(result.workflows)){
              that.state.workflows = result.workflows;
            }
            that.setState({
              searchValue : "",
              indexSelected : -1,
              workflowSelected : false,
              currentToolTip : -1,
              availableWorkflows: that.state.workflows,
            });
            that.input.focus();
          });
         }
        if(!that.state.searchIsOpen){
          that.setState({});
        }
      }
      if(event.which===27){
        that.setState({searchIsOpen:false});
      }
    }
  }
  handleInputChange(evt){
    const value = evt.target.value;
    if(this.state.workflowSelected && this.state.searchValue.indexOf(this.state.workflowSelected.keyword)>=0){
      // we are searching on param
      if(this.state.availableWorkflows.length>1){
        this.setState({
          availableWorkflows : [this.state.workflowSelected],
          indexSelected : 0,
          searchValue : value,
        })
      }
      this.setState({
        searchValue : value,
      });
      this.manageToolTip();
    }
    else{
      // we are searching a command
      let index = this.state.indexSelected;
      let newWorkflows = null;
      let workflowSelected = this.state.workflowSelected
      if(this.state.workflowSelected){
        workflowSelected = null;
      }
      if(this.state.searchValue.length>0){
        newWorkflows = this.state.workflows.filter( (w) => w.keyword.search(value)>-1 );
      }
      else{
        newWorkflows = this.state.workflows;
      }
      if(this.state.availableWorkflows.length>0 && this.state.indexSelected<0){
        index = 0;
      }
      this.setState({
        workflowSelected : workflowSelected,
        availableWorkflows : newWorkflows,
        searchValue: value,
        indexSelected : index
      });
    }
  }
  handleKeyDownInput(evt){
    if(evt.which===27){
      // esc
      this.setState({searchIsOpen:false});
    }
    else if(evt.which === 40 || evt.which === 38){
      // up & down arrow key
      this.setState({indexSelected : (this.state.indexSelected + this.state.availableWorkflows.length + (evt.which - 39)) % this.state.availableWorkflows.length})
      evt.preventDefault();
      evt.stopPropagation();
    }
    else if(evt.which === 9){
      // tab
      if(this.state.indexSelected>-1){
        const workflowSelected = this.state.availableWorkflows[this.state.indexSelected];
        let value = "";
        if(workflowSelected.args && workflowSelected.args.length>0){
          value = workflowSelected.keyword;
        }
        else{
          value = workflowSelected.keyword;
        }
        this.setState({
          searchValue : value,
          workflowSelected : workflowSelected,
        });
      }
      evt.preventDefault();
      evt.stopPropagation();
    }
    else if(evt.which === 27){
      // esc
      this.setState({searchIsOpen:false});
    }
    else if(evt.which === 13){
      //enter key
      this.handleEnter();
    }
  }
  manageToolTip(){
    let paramsTxt = this.state.searchValue.split(this.state.workflowSelected.keyword);
    let params;
    try{
      params = shlex.split(paramsTxt[1]);
    }catch(e){
      if((paramsTxt[1].match(/"/g)|| []).length%2 !== 0){
        // if quote is note finished
        try{
          params = shlex.split(paramsTxt[1]+'"');
        }catch(e){
          throw(e);
        }
      }
    }
    if(!params){
      return;
    }
    if(params.length !== this.state.currentToolTip+1){
      this.setState({currentToolTip : params.length-1});
    }
  }
  handleEnter(){
    let workflowSelected = this.state.workflowSelected;
    if(!workflowSelected && this.state.availableWorkflows[this.state.indexSelected]){
      // if no tab before enter
      workflowSelected = this.state.availableWorkflows[this.state.indexSelected];
    }
    let paramsTxt = this.state.searchValue.split(this.state.workflowSelected.keyword);
    let params = {};
    if(workflowSelected.args && workflowSelected.args.length>0){
      paramsTxt = shlex.split(paramsTxt[1]);
      for(let i=0;i<workflowSelected.args.length;i++){
        const arg = workflowSelected.args[i];
        if(arg.mode === "manual"){
          params[arg.keyword] = paramsTxt[i];
        }
        if(arg.mode === "fix"){
          params[arg.keyword] = arg.value;
        }
        if(arg.mode === "auto"){
          let value = arg.pattern;
          if(value === "{url}"){
            value = window.location.href;
          }
          else if(value === "{selection}"){
            value = this.state.selectedText.toString();
          }
          else{
            const result = $(value);
            if(result.length>0){
              value = result[0].innerText;
            }
            else{
              historyService.newCall(workflowSelected,params,{response:"Can not find '"+value+"' in the page"});
              return;
            }
          }
          params[arg.keyword] = value;
        }
      }
    }
    console.log("workflow selected",workflowSelected)
    console.log("sending to... "+workflowSelected.webhook)
    API.post(workflowSelected.webhook,params,(res)=>{
      console.log("res : ",res);
      historyService.newCall(workflowSelected,params,res);
    },(res)=>{
      console.log("res error: ",res);
      historyService.newCall(workflowSelected,params,res);
    });
    this.setState({searchIsOpen:false});
  }
  render() {
    console.log("wk selected",this.state.workflowSelected);
      if(!this.state.searchIsOpen){
        return "";
      }
      return (
        <div id="blocKelio" onClick={(evt)=>{this.setState({searchIsOpen:false});}}>
          <div id="kelio" onClick={(evt)=>{evt.preventDefault();evt.stopPropagation();}}>
            <div className="blocInputKelio">
              <div class='relativeBloc' style={{display : "flex"}}>
                <img alt="Kelio" style={{width:"18px",height:"29px",marginRight:"3px",marginTop:"16px",marginLeft:"3px"}} src={chrome.runtime.getURL("/img/kelioLogo.svg")}/>
                <input className='inputKelio' ref={(r)=>this.input = r} autocomplete='off' value={this.state.searchValue} onKeyDown={this.handleKeyDownInput} onChange={(evt)=>this.handleInputChange(evt)} />
                <div className="shortcutContainer">
                  <Shortcut cmd={true} letter={"K"}/>
                </div>
              </div>
            </div>
            <div id='propositions'>
            {
              (this.state.availableWorkflows || []).map((w,index)=>(
                <div class={'proposition '+(this.state.indexSelected === index?"selected":"")}>
                  <div className="emoji">
                    <Emojione type={w.emoji}/>
                  </div>
                  <div class='propositionTxt'>{w.name}
                    {
                      w.args && w.args.filter(arg => arg.mode === "manual").map((arg,index)=>(
                        <div class={'tooltip '+((this.state.workflowSelected && this.state.workflowSelected.id===w.id && index===this.state.currentToolTip)?"tooltipSelected":"")}>{arg.name}</div>
                      ))
                    }
                  </div>
                  {
                    (this.state.indexSelected === index) && <Shortcut enter={true}/>
                  }
                </div>
              ))
            }
            </div>
          </div>
        </div>
      )
  }
}
