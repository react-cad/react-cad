import React from "react";
import styles from "./styles.module.css";

interface Props {
  show?: any;
}

const Toast: React.FC<Props> = ({ show }) => {
  const [localShow, setLocalShow] = React.useState(false);

  React.useEffect(() => {
    setLocalShow(Boolean(show));
  }, [show]);

  React.useEffect(() => {
    if (localShow) {
      setTimeout(() => setLocalShow(false), 1000);
    }
  }, [localShow]);

  const classNames = [styles.toast, localShow ? styles.show : styles.hide].join(
    " "
  );

  return <div className={classNames}>Code copied to URL</div>;
};

export default Toast;
