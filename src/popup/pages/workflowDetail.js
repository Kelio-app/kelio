import React from 'react';
import workflowService from 'services/workflowService';
import Emojione from 'components/Emojione/Emojione';
import imgService from 'services/imgService';
import WorkflowEdit from "./workflowEdit";
import "./style.scss";


export default class WorkflowDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      workflowService : workflowService,
      isEditing : false
    }
  }
  render(){
    if(this.state.isEditing){
      return(
        <WorkflowEdit workflowId={this.props.workflowId} onValidate={()=>{
          this.setState({isEditing:false});
        }} />
      )
    }
    const workflow = workflowService.getWorkflow(this.props.workflowId);
    return(
      <div className="pageDetail workflowDetail">
        <div className="title">
          <div className="btn arrow" onClick={this.props.back}>
            <img alt="Back"  src={imgService.geturl("/img/arrow-left.svg")} />
          </div>
          <div className="textTitle">
            <Emojione type={workflow.emoji}/>
            <span style={{marginLeft:"4px"}}>
              {workflow.name}
            </span>
          </div>
        </div>
        <div className="content">
          <div className="keywork">{workflow.keyword}</div>
          <div className="webhook">{workflow.webhook}</div>
          {
          workflow.args &&  <div className="params">
            {workflow.args.map((arg)=>(
              <div className="argument">
                <div className="">{arg.name}</div>
                <div className="">{arg.keyword}</div>
                <div className="">{arg.mode}</div>
              </div>
            ))}
          </div>
          }
          <div className="btnBlock">
            <div className="btn inline colored" onClick={()=>this.setState({isEditing : true})}>edit</div>
            <div className="btn inline colored red" onClick={()=>this.props.delete()}>Delete</div>
          </div>
        </div>
      </div>
    )
  }
}
