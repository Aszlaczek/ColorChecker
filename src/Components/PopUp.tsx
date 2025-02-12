import React from "react";
import { Color } from "../App";

type Pop = {
  color: Color;
};

export default class Popup extends React.Component<Pop> {
  render() {
    return (
      <div className="popup">
        <h1>You have successful added new color</h1>
        <div>
          <h4>HEX</h4>
          <span>Color HEX: {this.props.color.hex}</span>
          <h4>RGB values</h4>
          <span>{`r: ${this.props.color.rgb.r} g: ${this.props.color.rgb.g} b: ${this.props.color.rgb.b}`}</span>
          <h4>Saturation:</h4>
          <span>{this.props.color.hsl.s}%</span>
        </div>
      </div>
    );
  }
}
