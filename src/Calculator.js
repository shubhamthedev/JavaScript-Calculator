import React, { Component } from "react";
import Buttons from "./Buttons";
import Screen from "./Screen";

const isOperator = /[x/+‑]/,
  endsWithOperator = /[x+‑/]$/,
  endsWithNegativeSign = /[x/+]‑$/;

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: "0",
      prevVal: "",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false,
    };
    this.handleOperators = this.handleOperators.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.initialize = this.initialize.bind(this);
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
  }
  maxDigitWarning() {
    this.setState({
      currentValue: "Max Digit Limit Reached",
      prevVal: this.state.currentValue,
    });
    setTimeout(() => this.setState({ currentValue: this.state.prevVal }), 1000);
  }
  handleOperators(e) {
    if (!this.state.currentValue.includes("Max")) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = this.state;
      this.setState({ currentValue: value, evaluated: false });
      if (evaluated) {
        this.setState({ formula: prevVal + value });
      } else if (!endsWithOperator.test(formula)) {
        this.setState({
          prevVal: formula,
          formula: formula + value,
        });
      } else if (!endsWithNegativeSign.test(formula)) {
        this.setState({
          formula:
            (endsWithNegativeSign.test(formula + value) ? formula : prevVal) +
            value,
        });
      } else if (value !== "‑") {
        this.setState({
          formula: prevVal + value,
        });
      }
    }
  }
  handleNumbers(e) {
    if (!this.state.currentValue.includes("Max")) {
      const { currentValue, formula, evaluated } = this.state;
      const value = e.target.value;
      this.setState({ evaluated: false });
      if (currentValue.length > 21) {
        this.maxDigitWarning();
      } else if (evaluated) {
        this.setState({
          currentValue: value,
          formula: value !== "0" ? value : "",
        });
      } else {
        this.setState({
          currentValue:
            currentValue === "0" || isOperator.test(currentValue)
              ? value
              : currentValue + value,
          formula:
            currentValue === "0" && value === "0"
              ? formula === ""
                ? value
                : formula
              : /([^.0-9]0|^0)$/.test(formula)
              ? formula.slice(0, -1) + value
              : formula + value,
        });
      }
    }
  }
  handleEvaluate() {
    if (!this.state.currentValue.includes("Limit")) {
      let expression = this.state.formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
      // eslint-disable-next-line
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      console.log(answer);
      this.setState({
        currentValue: answer.toString(),
        formula:
          expression.replace(/\*/g, "⋅").replace(/-/g, "‑") + " = " + answer,
        prevVal: answer,
        evaluated: true,
      });
    }
  }
  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        currentValue: "0.",
        formula: "0.",
        evaluated: false,
      });
    } else if (
      !this.state.currentValue.includes(".") &&
      !this.state.currentValue.includes("Limit")
    ) {
      this.setState({ evaluated: false });
      if (this.state.currentValue.length > 21) {
        this.maxDigitWarning();
      } else if (
        endsWithOperator.test(this.state.formula) ||
        (this.state.currentValue === "0" && this.state.formula === "")
      ) {
        this.setState({
          currentValue: "0.",
          formula: this.state.formula + "0.",
        });
      } else {
        this.setState({
          currentValue: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
          formula: this.state.formula + ".",
        });
      }
    }
  }
  initialize() {
    this.setState({
      currentValue: "0",
      formula: "",
      prevVal: "0",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false,
    });
  }
  render() {
    return (
      <div className="calculator">
        <Screen
          formula={this.state.formula.replace(/x/g, "*")}
          currentValue={this.state.currentValue}
        />
        <Buttons
          handleNumbers={this.handleNumbers}
          initialize={this.initialize}
          handleOperators={this.handleOperators}
          handleEvaluate={this.handleEvaluate}
          handleDecimal={this.handleDecimal}
        />
      </div>
    );
  }
}
export default Calculator;
