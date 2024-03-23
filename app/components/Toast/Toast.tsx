"use client";

import { useContext } from "react";
import { toastContext, IToast, EToastType } from "../../context/toast.context";
import styles from "./styles.module.scss";

const classNameByType: { [key in IToast["type"]]: string } = {
  [EToastType.MSG]: "",
  [EToastType.WRN]: styles.wrn,
  [EToastType.ERR]: styles.err,
};

const Toast = () => {
  const { messages } = useContext(toastContext);
  return (
    <div className={styles.wrapper}>
      {messages.map((m) => {
        return (
          <p
            key={m.id}
            className={`${styles.toast} ${m.expired && styles.expired} ${
              classNameByType[m.type]
            }`}
          >
            {m.message}
          </p>
        );
      })}
    </div>
  );
};

export default Toast;
