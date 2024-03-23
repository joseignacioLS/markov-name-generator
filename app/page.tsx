"use client";

import { ChangeEvent, UIEvent, useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Markov } from "./utils/markov";
import { generateId } from "./utils/other";
import ToggleCard from "./components/ToggleCard/ToggleCard";
import { sources } from "./utils/dataSources";
import { EPredictor, IPrediction } from "./types";
import { EToastType, toastContext } from "./context/toast.context";
import { getRequest } from "./services/request.service";
import PredictionCard from "./components/PredictionCard/PredictionCard";
import MarkovInputs from "./components/MarkovInputs/MarkovInputs";
import SelectInput from "./components/SelectInput/SelectInput";

const markov = new Markov();

export default function Home() {
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
        ...oldState,
        {
          id: generateId(),
          value: newName,
          method: EPredictor.MARKOV,
          length: newName.length,
          window: +input.window,
          source: sources.find((s) => s.value === input.source)?.name || "",
        },
      ];
    });
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
    setPredictions([]);
    markov.generateMarkov(trainData, +input.window).then(() => {
      addToast(`Modelo de predición generado con éxito`, EToastType.MSG);

      for (let i = 0; i < 10; i++) {
        handleNameCreation();
      }
    });
  };

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, offsetHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= offsetHeight) {
      for (let i = 0; i < 4; i++) {
        handleNameCreation();
      }
    }
  };

  useEffect(() => {
    getTrainData(input.source);
  }, [input.source]);

  useEffect(() => {
    setPredictions([]);
    initModel();
  }, [trainData, input.window, input.maxLength, input.minLength]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Generador de Nombres</h1>
      <div
        id="predictionWrapper"
        onScroll={handleScroll}
        className={styles.predictor}
      >
        {predictions.map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
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
          <MarkovInputs
            input={input}
            handleInputChange={handleInputChange}
            selectOptions={sources}
          />
        </div>
      </ToggleCard>
    </main>
  );
}
