import React, { useEffect } from "react";
import { Conditions } from "./TableColors";

const ShowFilterInfo = (props: { filters: Conditions }) => {
  return (
    <div className="show_filter">
      <p>Applied filters</p>
      <p>Red:{props.filters.red ? "True" : "False"}</p>
      <p>Green:{props.filters.green ? "True" : "False"}</p>
      <p>Blue:{props.filters.blue ? "True" : "False"}</p>
      <p>Saturation:{props.filters.saturation ? "True" : "False"}</p>
    </div>
  );
};

export default ShowFilterInfo;
