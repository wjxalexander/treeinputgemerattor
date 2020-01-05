import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { FormTable } from "./demo2";
function App() {
  return (
    <div className="App">
      <FormTable />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
