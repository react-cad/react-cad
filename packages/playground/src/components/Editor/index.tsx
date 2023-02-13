import React from "react";

import styles from "./styles.module.css";

interface Props {
  setup: (id: string) => void;
}

const Editor: React.FC<Props> = ({ setup }) => {
  React.useEffect(() => setup(styles.editor), []);

  return (
    <div
      className={styles.wrapper}
      dangerouslySetInnerHTML={{ __html: `<div  id="${styles.editor}"></div>` }}
    />
  );
};

export default React.memo(Editor);
