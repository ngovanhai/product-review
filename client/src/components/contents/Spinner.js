import React, { Fragment } from "react";
import spinner from "./spinner.gif";
const Spinner = (props) => (
  <Fragment>
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: props.show,
      }}
    >
      <img
        src={spinner}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          top: "30%",
          width: "130px",
        }}
        alt="loading"
      />
    </div>
  </Fragment>
);
export default Spinner;
