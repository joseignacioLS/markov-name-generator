"use client";

import { ChangeEvent, useContext, useState } from "react";
import PredictionCard from "../components/PredictionCard/PredictionCard";
import styles from "../page.module.scss";
import { favoritesContext } from "../context/favorites.contexts";
import SelectInput from "../components/SelectInput/SelectInput";
import { sources } from "../utils/dataSources";
import ToggleCard from "../components/ToggleCard/ToggleCard";
import RangeInput from "../components/RangeInput/RangeInput";

const Home = () => {
  const [input, setInput] = useState<{
    source: string;
    window: string;
    length: string;
  }>({ source: "", window: "0", length: "0" });

  const { favorites } = useContext(favoritesContext);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;

    setInput((oldState) => {
      return { ...oldState, [name]: value };
    });
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Favoritos</h1>
      <div className={styles.predictor}>
        <div className={styles.predictionsWrapper}>
          {favorites
            .filter((prediction) => {
              const sourceFilter =
                input.source === "" ||
                sources.find((s) => s.value === input.source)?.name ===
                  prediction.source;
              const windowFilter =
                input.window === "0" || prediction.window === +input.window;
              const lengthFilter =
                input.length === "0" || prediction.length === +input.length;
              return sourceFilter && windowFilter && lengthFilter;
            })
            .map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
        </div>
      </div>
      <ToggleCard title={"Filtros"}>
        <div className={styles.inputWrapper}>
          <RangeInput
            name="window"
            min="0"
            max="6"
            value={input.window}
            label="Fidelidad"
            setValue={handleInputChange}
          />
          <RangeInput
            name="length"
            min="0"
            max="24"
            value={input.length}
            label="Longitud"
            setValue={handleInputChange}
          />
          <SelectInput
            label="Dataset"
            name="source"
            value={input.source}
            setValue={handleInputChange}
            options={[{ name: "Todos", value: "" }, ...sources]}
          />
        </div>
      </ToggleCard>
    </main>
  );
};

export default Home;
