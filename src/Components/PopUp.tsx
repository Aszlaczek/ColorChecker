import React from "react";
import { Color } from "../App";

type PopProps = {
  color: Color;
};

export default class Popup extends React.Component<PopProps> {
  render() {
    const { color } = this.props;
    return (
      <div className="popup">
        <h1>Color Added</h1>
        <span>Successfully added to your collection</span>
        <div className="toast-color-badge">
          <span
            className="badge-dot"
            style={{ backgroundColor: color.hex }}
          ></span>
          <span>{color.hex}</span>
        </div>
      </div>
    );
  }
}
