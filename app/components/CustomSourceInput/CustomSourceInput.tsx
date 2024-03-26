import { ChangeEvent, useContext, useState } from "react";
import Button from "../Button/Button";
import styles from "./styles.module.scss";
import { modalContext } from "@/app/context/modal.context";
import { EToastType, toastContext } from "@/app/context/toast.context";
interface IProps {
  setTrainData: (value: string) => void;
}
const CustomSourceInput = ({ setTrainData }: IProps) => {
  const [input, setInput] = useState("");

  const { addToast } = useContext(toastContext);
  const { hideModal } = useContext(modalContext);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value);
  };
  const handleSubmit = () => {
    if (input.replace(/[\n\r ]+/g, "") === "") {
      addToast("El texto por defecto no puede estar vacio", EToastType.WRN);
      return;
    }
    setTrainData(input);
    hideModal();
  };
  return (
    <div className={styles.wrapper}>
      <h2>Custom Text</h2>
      <textarea value={input} onInput={handleInput}></textarea>
      <Button onClick={handleSubmit} size={"small"} disabled={input === ""}>
        <span className="material-symbols-outlined">save</span>
      </Button>
    </div>
  );
};

export default CustomSourceInput;
