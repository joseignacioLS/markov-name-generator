"use client";

import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import { Markov } from "./utils/markov";
import RangeInput from "./components/RangeInput/RangeInput";
import { generateId } from "./utils/other";
import ToggleCard from "./components/ToggleCard/ToggleCard";
import SelectInput from "./components/SelectInput/SelectInput";
import Button from "./components/Button/Button";
import { sources } from "./utils/dataSources";
import { modalContext } from "./context/modal.context";
import { IPrediction } from "./types";
import PredictionDetail from "./components/PredictionDetail/PredictionDetail";
import { toastContext } from "./context/toast.context";

const markov = new Markov();

const windowToColor: { [key: number]: string } = {
  1: "#001C47", // Substituted for background color
  2: "#193559",
  3: "#32416C",
  4: "#4B5D7F",
  5: "#647992",
  6: "#7D95A5", // Substituted for highlight color
};

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

  const { showModal } = useContext(modalContext);
  const { addToast } = useContext(toastContext);

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
    if (!markov) {
      addToast(
        "El modelo no se ha cargado correctamente. Refresca la página",
        "err"
      );
      return;
    }
    const newName: string = markov.predict(+input.minLength, +input.maxLength);
    if (newName === "") {
      addToast(
        "Ha habido un problema con la generación. Vuelve a intentarlo",
        "wrn"
      );
      return;
    }
    setPredictions((oldState) => {
      return [
        {
          id: generateId(),
          value: newName,
          length: newName.length,
          window: +input.window,
          source: sources.find((s) => s.value === input.source)?.name || "",
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
      <h1 className={styles.title}>Generador de Nombres</h1>
      <div className={styles.predictor}>
        <section className={styles.inputs}></section>
        <Button
          onClick={handleNameCreation}
          disabled={markovTraining}
          size="big"
        >
          +
        </Button>
        <div ref={predictionsRef} className={styles.predictionsWrapper}>
          {predictions.map((prediction) => (
            <p
              key={prediction.id}
              className={styles.prediction}
              onClick={() => {
                showModal(<PredictionDetail prediction={prediction} />);
              }}
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
          label="Fidelidad"
          setValue={handleInputChange}
        />
        <RangeInput
          name="minLength"
          min="1"
          max={`${input.maxLength}`}
          value={input.minLength}
          label="Mínima Longitud"
          setValue={handleInputChange}
        />
        <RangeInput
          name="maxLength"
          min={`${input.minLength}`}
          max="24"
          value={input.maxLength}
          label="Máxima Longitud"
          setValue={handleInputChange}
        />
        <SelectInput
          label="Dataset"
          name="source"
          value={input.source}
          setValue={handleInputChange}
          options={sources}
        />
      </ToggleCard>
    </main>
  );
}
