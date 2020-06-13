import React from 'react';
import workflowService from 'services/workflowService';
import Emojione from 'components/Emojione/Emojione';
import imgService from 'services/imgService';
import moment from "moment";
import "./style.scss";


export default class HistoryDetail extends React.Component{
  render(){
    const workflow = workflowService.getWorkflow(this.props.call.workflow);
    return(
      <div className="pageDetail historyDetail">
        <div className="title">
          <div className="btn arrow" onClick={this.props.back}>
            <img alt="Back" src={imgService.geturl("/img/arrow-left.svg")} />
          </div>
          <div className="textTitle">
            <Emojione type={workflow.emoji}/>
            <span style={{marginLeft:"4px"}}>
              {workflow.name}
            </span>
          </div>
        </div>
        <div className="content">
          <div className="date">Date : {moment(this.props.call.timestamp).format("L")}</div>
          <div className="success">Succes :  { this.props.call.success ? <Emojione type={":white_check_mark:"} /> : <Emojione type={":x:"} /> }</div>
          <div className="parameters">Parameters : {JSON.stringify(this.props.call.parameters)}</div>
          <div className="result">Code : {this.props.call.result.status}</div>
          <div className="result">Response : {this.props.call.result.response}</div>
        </div>
      </div>
    )
  }
}
