import React from "react";
import styles from "./styles.module.css";
import appStyles from "../App/styles.module.css";

interface Props {
  accept: () => void;
}

const Warning: React.FC<Props> = ({ accept }) => (
  <div className={styles.overlay}>
    <div className={styles.container}>
      <p>
        This code was written by a user of ReactCAD Playground. If you accept
        this warning their code will be executed in your browser, including
        downloading and executing any imported NPM packages.
      </p>
      <p>
        Care has been taken to minimize the risk of executing such code,
        including a Content Security Policy which prevents requests to third
        party servers, as well as the fact that this website deals with no
        sensitive data or login details.
      </p>
      <p>
        However, malicious code can still crash your browser tab or completely
        change the behavior of this page. Please check the code to make sure
        you're comfortable running it.
      </p>
      <button
        onClick={accept}
        className={`${appStyles.action} ${styles.button}`}
      >
        I accept the risks
      </button>
    </div>
  </div>
);

export default React.memo(Warning);
