import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

window.onload = () => {
  const userProvidedCode = location.hash.startsWith("#code");

  ReactDOM.render(<App userProvidedCode={userProvidedCode} />, document.body);
};
