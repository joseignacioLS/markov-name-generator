import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

interface IProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ children, onClick, disabled = false }: IProps) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
