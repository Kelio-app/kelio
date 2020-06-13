import React from 'react';
import "./style.scss";
import historyService from "services/historyService";
import workflowService from "services/workflowService";
import imgService from 'services/imgService';
import Emojione from 'components/Emojione/Emojione';
import "./style.scss"
import moment from "moment";
import HistoryDetail from "./historyDetail";

export default class History extends React.Component{
  constructor(props){
    super(props);
    this.state={
      historyService : historyService,
      workflowService : workflowService,
      callSelected : false,
    };
    historyService.addListener(this);
    workflowService.addListener(this);
  }
  componentWillUnmount(){
    historyService.removeListener(this);
    workflowService.removeListener(this);
  }
  render(){
    return(
      <div className="page">
        {
          this.state.callSelected ?
            <HistoryDetail call={this.state.callSelected} back={()=>this.setState({callSelected:false})} />
          :
            historyService.history.map(h=> <HistoryLine call={h} onClick={()=>this.setState({callSelected:h})}/>).reverse()
        }
      </div>
    )
  }
}

const HistoryLine = (props)=>{
  const date = moment(props.call.timestamp);
  const workflow = workflowService.getWorkflow(props.call.workflow);
  return(
    <div className="pageLine history" onClick={()=>props.onClick()}>
      <div className="status">
        { props.call.success ? <Emojione type={":white_check_mark:"} /> : <Emojione type={":x:"} /> }
      </div>
      <div className="date">
        {
          date.diff(moment(),"days")===0 ?
            date.format("LT")
          :
            date.format("L")
        }
      </div>
      <div className="workflowIdentity">
        {
          workflow ?
            <div className="">
              <Emojione type={workflow.emoji}/>
              <div className="workflowName">{workflow.name}</div>
            </div>
          :
            "Unknown"
        }
      </div>
      <div className="arrow">
        <img alt="Show more" src={imgService.geturl("/img/arrow-right.svg")} />
      </div>
  </div>
  )
}
