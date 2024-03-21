import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

interface IProps {
  children: ReactNode;
  onClick: () => void;
}

const Button = ({ children, onClick }: IProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
