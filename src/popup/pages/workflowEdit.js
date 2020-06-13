import React from 'react';
import { Input,Select } from 'components/input/input.js';
import "./style.scss";
import imgService from 'services/imgService';
import workflowService from 'services/workflowService';

export default class WorkflowEdit extends React.Component{
  constructor(props){
    super(props);
    let workflow = false;
    if(props.workflowId){
      workflow = workflowService.getWorkflow(props.workflowId);
    }
    this.state = {
      id : workflow?workflow.id:"",
      name : workflow?workflow.name:"",
      keyword : workflow?workflow.keyword:"",
      emoji : workflow?workflow.emoji:"",
      args : workflow?workflow.args:[],
      webhook : workflow?workflow.webhook:"",
    }
    this.save = this.save.bind(this);
  }
  changeArgs(index,key,value){
    let args = this.state.args;
    if(args[index]){
      args[index][key] = value;
      this.setState({args:args});
    }
  }
  save(){
    if(this.props.workflowId){
      workflowService.updateWorkflow(this.state,this.props.onValidate);
    }
    else{
      console.log("add");
      workflowService.addWorkflow(this.state,this.props.onValidate);
    }
  }
  render(){
    return(
      <div className={this.props.workflowId?"":"page"}>
        <div className="title">
          { !this.props.workflowId && <div className="textTitle">Add new workflow</div>}
          { this.props.workflowId && <div className="textTitle">Edit workflow</div>}
        </div>
        <div className="flexBlock flexWrapped" style={{margin:"0px -8px"}}>
          <div className="inputBloc">
            <Input key={"nameInput"} label={"Name"} value={this.state.name} onChange={(evt)=>this.setState({name:evt.target.value})} />
          </div>
          <div className="inputBloc">
            <Input key={"keywordInput"} label={"Keyword"} value={this.state.keyword} onChange={(evt)=>this.setState({keyword:evt.target.value})} />
          </div>
        </div>
        <div className="flexBlock flexWrapped" style={{margin:"0px -8px"}}>
          <div className="inputBloc">
            <Input label={"Emoji"} value={this.state.emoji} onChange={(evt)=>this.setState({emoji:evt.target.value})} />
          </div>
          <div className="inputBloc">
            <Input label={"Url"} value={this.state.webhook} onChange={(evt)=>this.setState({webhook:evt.target.value})} />
          </div>
        </div>
        <div className="parameters">
          <div style={{display:"flex"}}>
            <div className="label" style={{marginRight:"8px",lineHeight: "25px"}} >
              {"Parameter"+(this.state.args.length>1?"s":"")}
            </div>
            <div className="btn"  onClick={()=>{this.state.args.push({name:"",keyword:"",mode:"manual"});this.setState({})}}>
              <img alt="add" src={imgService.geturl('/img/plus.svg')} />
            </div>
          </div>
          <div>
            {
              this.state.args.map((arg,index)=>(
                <div className="argument" key={"arg-"+index}>
                  <div className="flexBlock" style={{margin:"0px -8px"}}>
                    <div className="inputBloc" style={{flex:"0.35"}}>
                      <Input label={"Name"} value={arg.name} onChange={(evt)=>this.changeArgs(index,"name",evt.target.value)}/>
                    </div>
                    <div className="inputBloc" style={{flex:"0.35"}}>
                      <Input label={"Keyword"} value={arg.keyword} onChange={(evt)=>this.changeArgs(index,"keyword",evt.target.value)}/>
                    </div>
                    <div className="inputBloc" style={{flex:"0.3"}}>
                      <Select label={"Mode"} value={arg.mode} options={["manual","fix","auto"]} onChange={(evt)=>this.changeArgs(index,"mode",evt.target.value)}/>
                    </div>
                  </div>
                  { arg.mode === "fix" && <div className="inputBloc paramValue" style={{width: "90%"}}><Input className="flex" label={"Value"} value={arg.value} onChange={(evt)=>this.changeArgs(index,"value",evt.target.value)}/></div> }
                  { arg.mode === "auto" && <div className="inputBloc paramValue" style={{width: "90%"}}><Input className="flex" label={"Pattern"} help={"https://www.notion.so/Help-089d506d858a4c8fb1c2c3cca9bfbb67#882fb1da47454d50bc6a24ef4561c0a3"} value={arg.pattern} onChange={(evt)=>this.changeArgs(index,"pattern",evt.target.value)}/></div> }
                  <div className="btn inline squared absolute"  onClick={()=>{this.state.args.splice(index,1);this.setState({})}}>
                      <img className="delete" alt="delete" src={imgService.geturl('/img/trash.svg')} />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:"16px"}}>
          <div className="btn colored inline"  onClick={this.save}>
              Save
          </div>
        </div>
      </div>
    )
  }
}
