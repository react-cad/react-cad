import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import Shape from "./components/Shape";

document.body.innerHTML = '<div id="app"></div>';
document.body.style.padding = "0";
document.body.style.margin = "0";
const appDiv = document.getElementById("app")!;

// Render your React component instead
const root = createRoot(appDiv);
root.render(<App shape={<Shape />} />);
