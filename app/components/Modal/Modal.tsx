"use client";

import { useContext } from "react";
import styles from "./styles.module.scss";
import { modalContext } from "@/app/context/modal.context";
import Button from "../Button/Button";

const Modal = () => {
  const { content, isShown, hideModal } = useContext(modalContext);
  if (!isShown) {
    return;
  }
  return (
    <div className={styles.wrapper} onClick={hideModal}>
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        <div className={styles.buttonWrapper}>
          <Button onClick={hideModal} size="verysmall">
            X
          </Button>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Modal;
