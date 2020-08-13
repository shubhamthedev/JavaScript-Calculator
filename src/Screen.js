import React, { Component } from "react";

class Screen extends Component {
  render() {
    return (
      <div className="screen">
        <div className="formula-screen">{this.props.formula}</div>
        <div className="output-screen" id="display">
          {this.props.currentValue}
        </div>
      </div>
    );
  }
}
export default Screen;
