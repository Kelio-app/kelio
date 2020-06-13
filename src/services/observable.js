export default class Observable {
  constructor() {
    this.observableName = 'observable';
    this.observableListenersList = [];
    this.onFirstListener = null;
    this.onLastListener = null;
  }
  setObservableName(name) {
    this.observableName = name;
  }
  addListener(listener) {
    console.log("add to "+this.observableName,listener);
    if (this.observableListenersList.length === 0 && this.onFirstListener) {
      this.onFirstListener();
    }
    this.observableListenersList.push(listener);
  }
  removeListener(listener) {
    console.log("remove to "+this.observableName,listener);
    var index = this.observableListenersList.indexOf(listener);
    if (index > -1) {
      this.observableListenersList.splice(index, 1);
    }
    if (this.observableListenersList.length === 0 && this.onLastListener) {
      this.onLastListener();
    }
  }
  notify(force) {
    for (var i = 0; i < this.observableListenersList.length; i++) {
      var data = {};
      data[this.observableName] = this;
      this.observableListenersList[i].setState(data);
    }
  }
}
