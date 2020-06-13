import React from 'react';
import workflowService from 'services/workflowService';
import Emojione from 'components/Emojione/Emojione';
import imgService from 'services/imgService';
import WorkflowDetail from './workflowDetail';
import "./style.scss";

export default class Workflows extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      workflowService : workflowService,
      workflowSelected : null,
    }
    workflowService.addListener(this);
  }
  componentWillUnmount(){
    workflowService.removeListener(this);
  }
  render(){
    return(
      <div className="page workflowPage">
        {
          this.state.workflowSelected &&
          <WorkflowDetail
            workflowId={this.state.workflowSelected}
            back={()=>this.setState({workflowSelected:false})}
            delete={()=>{this.setState({workflowSelected:false});workflowService.deleteWorkflow(this.state.workflowSelected)}}
          />
        }
        {
          !this.state.workflowSelected && (
            Object.values(workflowService.workflowsById).length>0 ?
              (Object.values(workflowService.workflowsById) || []).map((wkfl)=>(
                <Workflow onClick={()=>this.setState({workflowSelected:wkfl.id})} workflow={wkfl} />
              ))
            :
              <div style={{color:"#9a9a9a"}}>you do not yet have a workflow set up. Add one <a style={{color:"#FF7E7D"}} onClick={()=>this.props.onPageChange(2)}>here</a> </div>
          )
        }
      </div>
    )
  }
}


function Workflow(props){
  return(
    <div className="pageLine workflow" onClick={props.onClick}>
      <Emojione type={props.workflow.emoji}/>
      <div className="workflowName">
        {props.workflow.name}
      </div>
      <div className="arrow">
        <img alt="Show more" src={imgService.geturl("/img/arrow-right.svg")} />
      </div>
    </div>
  )
}
