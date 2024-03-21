import React, { ReactNode, useState } from "react";
import styles from "./styles.module.scss";

interface IProps {
  title?: string;
  children: ReactNode;
}

const ToggleCard = ({ title = "", children }: IProps) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((v) => !v);
  return (
    <div className={`${styles.wrapper} ${show && styles.show}`}>
      <div className={styles.topBar} onClick={toggleShow}>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
};

export default ToggleCard;
