import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import Shape from "./Shape";

document.body.innerHTML = '<div id="app"></div>';
const appDiv = document.getElementById("app")!;

// Render your React component instead
const root = createRoot(appDiv);
root.render(<App shape={<Shape />} reset={true} />);
