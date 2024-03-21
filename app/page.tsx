"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import { Markov } from "./utils/markov";
import RangeInput from "./components/RangeInput/RangeInput";
import { generateId } from "./utils/other";
import ToggleCard from "./components/ToggleCard/ToggleCard";
import SelectInput from "./components/SelectInput/SelectInput";
import Button from "./components/Button/Button";

const markov = new Markov();

const windowToColor: { [key: number]: string } = {
  1: "#001C47", // Substituted for background color
  2: "#193559",
  3: "#32416C",
  4: "#4B5D7F",
  5: "#647992",
  6: "#7D95A5", // Substituted for highlight color
};

interface IPrediction {
  id: number;
  value: string;
  length: number;
  window: number;
}

export default function Home() {
  const [markovTraining, setMarkovTraining] = useState(false);
  const [trainData, setTrainData] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<IPrediction[]>([]);
  const [input, setInput] = useState<{
    window: string;
    minLength: string;
    maxLength: string;
    source: string;
  }>({
    window: "3",
    minLength: "6",
    maxLength: "12",
    source: "/data/spain.txt",
  });

  const predictionsRef = useRef(null);

  const resetPredictionsScroll = () => {
    if (!predictionsRef?.current) return;
    const element = predictionsRef.current as any;
    element.scrollTo({ top: 0 });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;

    setInput((oldState) => {
      return { ...oldState, [name]: value };
    });
  };

  const handleNameCreation = (): void => {
    if (!markov) return;
    const newName: string = markov.predict(+input.minLength, +input.maxLength);
    setPredictions((oldState) => {
      return [
        {
          id: generateId(),
          value: newName,
          length: newName.length,
          window: +input.window,
        },
        ...oldState.slice(0, 25),
      ];
    });
    setTimeout(resetPredictionsScroll, 0);
  };

  const getTrainData = async (source = "/data/spain.txt"): Promise<void> => {
    const request = await fetch(source);
    const response: string = await request.text();

    setTrainData(
      response.split("\n").map((n) => n.toLowerCase().replace("\r", ""))
    );
  };

  const initModel = async (): Promise<void> => {
    setMarkovTraining(true);
    markov.generate_markov(trainData, +input.window).then((r) => {
      setMarkovTraining(false);
    });
  };

  useEffect(() => {
    getTrainData(input.source);
  }, [input.source]);

  useEffect(() => {
    initModel();
  }, [trainData, input]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Generador de Nombres de Ciudades</h1>
      <div className={styles.predictor}>
        <section className={styles.inputs}></section>
        <Button onClick={handleNameCreation} disabled={markovTraining}>
          +
        </Button>
        <div ref={predictionsRef} className={styles.predictionsWrapper}>
          {predictions.map((prediction) => (
            <p
              key={prediction.id}
              className={styles.prediction}
              data-tooltip={`Word: ${prediction.value}\nWindow: ${prediction.window}`}
              style={{
                backgroundColor: windowToColor[prediction.window],
              }}
            >
              {prediction.value}
            </p>
          ))}
        </div>
      </div>
      <ToggleCard title={"Ajustes"}>
        <RangeInput
          name="window"
          min="1"
          max="6"
          value={input.window}
          label="Window"
          setValue={handleInputChange}
        />
        <RangeInput
          name="minLength"
          min="1"
          max={`${input.maxLength}`}
          value={input.minLength}
          label="Min. Length"
          setValue={handleInputChange}
        />
        <RangeInput
          name="maxLength"
          min={`${input.minLength}`}
          max="24"
          value={input.maxLength}
          label="Max. Length"
          setValue={handleInputChange}
        />
        <SelectInput
          label="Source"
          name="source"
          value={input.source}
          setValue={handleInputChange}
          options={[
            { name: "Spanish Towns", value: "/data/spain.txt" },
            { name: "Tolkien Locations", value: "/data/tolkien.txt" },
          ]}
        />
      </ToggleCard>
    </main>
  );
}
