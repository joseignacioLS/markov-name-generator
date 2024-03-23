import { ChangeEvent } from "react";
import RangeInput from "../RangeInput/RangeInput";
import SelectInput from "../SelectInput/SelectInput";

import styles from "./styles.module.scss";

interface IProps {
  input: { [key: string]: any };
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void;
  selectOptions: { value: string; name: string }[];
  mode?: "edit" | "filter";
}

const MarkovInputs = ({
  input,
  handleInputChange,
  selectOptions,
  mode = "edit",
}: IProps) => {
  return (
    <>
      <SelectInput
        label="Dataset"
        name="source"
        value={input.source}
        setValue={handleInputChange}
        options={selectOptions}
      />
      <RangeInput
        name="window"
        min={mode === "edit" ? "1" : "0"}
        max="6"
        value={input.window}
        label="Fidelidad"
        setValue={handleInputChange}
      />
      {mode === "filter" && (
        <RangeInput
          name="length"
          min="0"
          max="24"
          value={input.length}
          label="Longitud"
          setValue={handleInputChange}
        />
      )}
      {mode === "edit" && (
        <RangeInput
          name="minLength"
          min="1"
          max={`${input.maxLength}`}
          value={input.minLength}
          label="Mínima Longitud"
          setValue={handleInputChange}
        />
      )}
      {mode === "edit" && (
        <RangeInput
          name="maxLength"
          min={`${input.minLength}`}
          max="24"
          value={input.maxLength}
          label="Máxima Longitud"
          setValue={handleInputChange}
        />
      )}
    </>
  );
};

export default MarkovInputs;
