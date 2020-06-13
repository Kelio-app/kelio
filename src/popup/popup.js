import React from 'react';
import Header from './header/header.js';
import Workflows from "./pages/workflows";
import History from "./pages/history";
import WorkflowEdit from "./pages/workflowEdit";
import "./popup.scss";

export default class Popup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      page : 0,
    }
  }
  render(){
    return(
      <div className="popup">
        <Header pageSelected={this.state.page} onPageChange={(page)=>this.setState({page:page})}  />
        <div className="content">
          {this.state.page === 0 && <Workflows onPageChange={(page)=>this.setState({page:page})}/>}
          {this.state.page === 1 && <History />}
          {this.state.page === 2 && <WorkflowEdit onValidate={()=>this.setState({page:0})}/>}
        </div>
      </div>
    )
  }
}
