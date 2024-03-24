"use client";

import { ChangeEvent, UIEvent, useContext, useEffect } from "react";
import styles from "./page.module.scss";
import ToggleCard from "./components/ToggleCard/ToggleCard";
import { sources } from "./utils/dataSources";
import PredictionCard from "./components/PredictionCard/PredictionCard";
import MarkovInputs from "./components/MarkovInputs/MarkovInputs";
import SelectInput from "./components/SelectInput/SelectInput";
import { predictorContext } from "./context/predictor.context";
import Spinner from "./components/Spinner/Spinner";

export default function Home() {
  const {
    predictions,
    handleNameCreation,
    config: input,
    setConfig: setInput,
  } = useContext(predictorContext);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;

    setInput((oldState: any) => {
      return { ...oldState, [name]: value };
    });
  };

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, offsetHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= offsetHeight * 1.5) {
      handleNameCreation();
    }
  };
  const firstPredictionId = predictions[0]?.id;
  useEffect(() => {
    document.querySelector("#predictionWrapper")?.scrollTo({ top: 0 });
  }, [firstPredictionId]);

  return (
    <main>
      <section className={styles.titles}>
        <h1 className={styles.title}>Generador de Nombres</h1>
        <h2>Predictor {"Markov"}</h2>
        <h3>
          {input?.source && sources.find((s) => s.value === input.source)?.name}
        </h3>
      </section>
      <div
        id="predictionWrapper"
        onScroll={handleScroll}
        className={styles.predictionWrapper}
      >
        {predictions.map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
        <Spinner />
      </div>
      <ToggleCard title={"Ajustes"}>
        <div
          style={{
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
          }}
        >
          <SelectInput
            name="predictor"
            label="Predictor"
            value={"markov"}
            setValue={(e) => {}}
            options={[
              {
                name: "markov",
                value: "markov",
              },
            ]}
          />
          {input && (
            <MarkovInputs
              input={input}
              handleInputChange={handleInputChange}
              selectOptions={sources}
            />
          )}
        </div>
      </ToggleCard>
    </main>
  );
}
