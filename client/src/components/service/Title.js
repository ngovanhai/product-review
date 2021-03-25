import React, { Component } from "react";
import "../../css/style.css";
import { Heading } from "@shopify/polaris";

class Title extends Component {
  render() {
    return <Heading element="h1">{this.props.title}</Heading>;
  }
}

export default Title;
