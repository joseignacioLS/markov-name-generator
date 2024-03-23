"use client";

import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import { Markov } from "./utils/markov";
import { generateId } from "./utils/other";
import ToggleCard from "./components/ToggleCard/ToggleCard";
import Button from "./components/Button/Button";
import { sources } from "./utils/dataSources";
import { EPredictor, IPrediction } from "./types";
import { EToastType, toastContext } from "./context/toast.context";
import { getRequest } from "./services/request.service";
import PredictionCard from "./components/PredictionCard/PredictionCard";
import MarkovInputs from "./components/MarkovInputs/MarkovInputs";

const markov = new Markov();

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
    source: sources[0].value,
  });

  const { addToast } = useContext(toastContext);

  const predictionsRef = useRef(null);

  const resetPredictionsScroll = () => {
    if (!predictionsRef?.current) return;
    const element = predictionsRef.current as any;
    setTimeout(() => {
      element.scrollTo({ top: 0 });
    }, 0);
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
        EToastType.ERR
      );
      return;
    }
    const newName: string = markov.predict(+input.minLength, +input.maxLength);
    if (newName === "") {
      addToast(
        "Ha habido un problema con la generación. Vuelve a intentarlo",
        EToastType.WRN
      );
      return;
    }
    setPredictions((oldState) => {
      return [
        {
          id: generateId(),
          value: newName,
          method: EPredictor.MARKOV,
          length: newName.length,
          window: +input.window,
          source: sources.find((s) => s.value === input.source)?.name || "",
        },
        ...oldState.slice(0, 25),
      ];
    });
    resetPredictionsScroll();
  };

  const getTrainData = async (source: string): Promise<void> => {
    const response = (await getRequest(source)) as string;
    if (response === "") {
      addToast("Ha habido un error cargando el set de datos", EToastType.ERR);
      return;
    }
    addToast(
      `Datos de "${
        sources.find((s) => s.value === source)?.name
      }" cargados con éxito`,
      EToastType.MSG
    );
    const formattedData = response
      .split("\n")
      .map((n: string) => n.toLowerCase().replace("\r", ""));
    setTrainData(formattedData);
  };

  const initModel = async (): Promise<void> => {
    if (trainData.length === 0) return;
    setMarkovTraining(true);
    markov.generateMarkov(trainData, +input.window).then(() => {
      setMarkovTraining(false);

      addToast(`Modelo de predición generado con éxito`, EToastType.MSG);
    });
  };

  useEffect(() => {
    getTrainData(input.source);
  }, [input.source]);

  useEffect(() => {
    initModel();
  }, [trainData, input.window, input.maxLength, input.minLength]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Generador de Nombres</h1>
      <div className={styles.predictor}>
        <h2>
          Generando nombres para{" "}
          {sources.find((s) => s.value === input.source)?.name}
        </h2>
        <Button
          onClick={handleNameCreation}
          disabled={markovTraining || !markov}
          size="big"
        >
          <span className={"material-symbols-outlined"}>add</span>
        </Button>
        <div ref={predictionsRef} className={styles.predictionsWrapper}>
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      </div>
      <ToggleCard title={"Ajustes"}>
        <MarkovInputs
          input={input}
          handleInputChange={handleInputChange}
          selectOptions={sources}
        />
      </ToggleCard>
    </main>
  );
}
