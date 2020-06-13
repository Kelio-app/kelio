import React from 'react';
import ReactDOM from 'react-dom';
import GlobalContent from './content/global';
import "./content/global.scss";

const app = document.createElement('div');
app.id = "mycontent";
document.body.appendChild(app);
ReactDOM.render(<GlobalContent />, app);
