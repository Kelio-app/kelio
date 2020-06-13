import React from 'react';
import './input.scss';

export function Input(props){
  return(
    <div className="inputContainer">
      <div className="label">{props.label}{props.help && <a href={props.help} className="helpLink">?</a>}</div>
      <input className="input" value={props.value} onChange={props.onChange} />
    </div>
  )
}

export function Select(props){
  return(
    <div className="inputContainer">
      <div className="label">{props.label}{props.help && <a href={props.help} className="helpLink">?</a>}</div>
      <select value={props.value} onChange={props.onChange}>
        {
          props.options.map((opt)=>(
            <option value={opt}>{opt}</option>
          ))
        }
      </select>
    </div>
  )
}
