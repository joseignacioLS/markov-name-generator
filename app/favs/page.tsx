"use client";

import { ChangeEvent, useContext, useState } from "react";
import PredictionCard from "../components/PredictionCard/PredictionCard";
import styles from "../page.module.scss";
import { favoritesContext } from "../context/favorites.context";
import { sources } from "../utils/dataSources";
import ToggleCard from "../components/ToggleCard/ToggleCard";
import MarkovInputs from "../components/MarkovInputs/MarkovInputs";

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
    <main>
      <header>
        <h1 className={styles.title}>Favoritos</h1>
      </header>
      <div className={styles.predictionWrapper}>
        {favorites
          .filter((prediction) => {
            const sourceFilter =
              input.source === "" ||
              sources.find((s) => s.value === input.source)?.name ===
                prediction.predictor?.config?.source;
            const windowFilter =
              input.window === "0" ||
              prediction.predictor?.config?.window === +input.window;
            const lengthFilter =
              input.length === "0" || prediction.length === +input.length;
            return sourceFilter && windowFilter && lengthFilter;
          })
          .map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
      </div>
      <ToggleCard title={"Filtros"}>
        <div
          style={{
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
          }}
        >
          <MarkovInputs
            input={input}
            handleInputChange={handleInputChange}
            selectOptions={[{ value: "", name: "Todos" }, ...sources]}
            mode="filter"
          />
        </div>
      </ToggleCard>
    </main>
  );
};

export default Home;
