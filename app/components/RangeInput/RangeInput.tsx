import { ChangeEvent } from "react";
import styles from "./styles.module.scss";

interface IProps {
  value: string;
  setValue: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  min: string;
  max: string;
  label?: string;
  vertical?: boolean;
}

const RangeInput = ({
  value,
  setValue,
  name,
  min,
  max,
  label,
  vertical = false,
}: IProps) => {
  return (
    <div className={`${styles.wrapper} ${vertical && styles.vertical}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      <input
        className={styles.input}
        type="range"
        value={value}
        onChange={setValue}
        min={min}
        max={max}
        name={name}
      />
    </div>
  );
};

export default RangeInput;
