import React from "react";

import styles from "./styles.module.css";

const Header: React.FC = () => (
  <header className={styles.header}>
    <h1>ReactCAD Playground</h1>
    <p>
      Get the full version at{" "}
      <a href="https://react-cad.github.io/">react-cad.github.io</a>
    </p>
  </header>
);

export default React.memo(Header);
