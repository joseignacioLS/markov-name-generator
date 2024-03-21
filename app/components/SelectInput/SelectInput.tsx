import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";

interface IProps {
  options: { name: string; value: string }[];
  name: string;
  value: string;
  label?: string;
  setValue: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput = ({ options, name, value, label, setValue }: IProps) => {
  return (
    <div className={styles.wrapper}>
      <span>{label}</span>
      <select
        className={styles.select}
        name={name}
        value={value}
        onChange={setValue}
      >
        {options.map((o) => {
          return (
            <option key={o.value} value={o.value}>
              {o.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectInput;
