"use client";

import { useContext } from "react";
import { toastContext } from "../../context/toast.context";
import styles from "./styles.module.scss";

const Toast = () => {
  const { messages } = useContext(toastContext);
  return (
    <div className={styles.wrapper}>
      {messages.map((m) => {
        return (
          <p
            key={m.id}
            className={`${styles.toast} ${m.expired && styles.expired} ${
              m.type === "wrn" && styles.wrn
            } ${m.type === "err" && styles.err}`}
          >
            {m.message}
          </p>
        );
      })}
    </div>
  );
};

export default Toast;
