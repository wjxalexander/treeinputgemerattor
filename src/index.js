import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { InputForm } from "./demo2";
function App() {
  return (
    <div className="App">
      <InputForm />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
