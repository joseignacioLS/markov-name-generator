import { MouseEvent, ReactNode } from "react";
import styles from "./styles.module.scss";

interface IProps {
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  size?: string;
}

const Button = ({ children, onClick, disabled = false, size = "" }: IProps) => {
  return (
    <button
      className={`${styles.button} ${size === "big" && styles.big} ${
        size === "small" && styles.small
      } ${size === "verysmall" && styles.verysmall}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
