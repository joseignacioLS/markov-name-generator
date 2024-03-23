"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateId } from "../utils/other";
import { Markov } from "../utils/markov";
import { EPredictor, IPrediction } from "../types";
import { EToastType, toastContext } from "./toast.context";
import { sources } from "../utils/dataSources";
import { getRequest } from "../services/request.service";

interface IValue {
  config: any;
  setConfig: any;
  predictions: IPrediction[];
  getTrainData: (source: string) => Promise<void>;
  initModel: (config: any) => Promise<void>;
  handleNameCreation: () => void;
}

export const predictorContext = createContext<IValue>({
  config: {},
  setConfig: () => {},
  predictions: [],
  getTrainData: (source: string) => new Promise((resolve) => resolve()),
  initModel: (config: any) => new Promise((resolve) => resolve()),
  handleNameCreation: () => {},
});

interface IProps {
  children: ReactNode;
}
export const PredictorProvider = ({ children }: IProps) => {
  const [config, setConfig] = useState<{
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
  const [predictor, setPredictor] = useState<Markov | undefined>(new Markov());
  const [predictions, setPredictions] = useState<IPrediction[]>([]);
  const [trainData, setTrainData] = useState<string[]>([]);

  const { addToast } = useContext(toastContext);

  const handleNameCreation = (): void => {
    if (!predictor) {
      addToast(
        "El modelo no se ha cargado correctamente. Refresca la página",
        EToastType.ERR
      );
      return;
    }
    const newName: string = predictor.predict(
      +config.minLength,
      +config.maxLength
    );
    if (newName === "") {
      addToast(
        "Ha habido un problema con la generación. Vuelve a intentarlo",
        EToastType.WRN
      );
      return;
    }
    setPredictions((oldState: any) => {
      return [
        ...oldState,
        {
          id: generateId(),
          value: newName,
          method: EPredictor.MARKOV,
          length: newName.length,
          window: +config.window,
          source: sources.find((s) => s.value === config.source)?.name,
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

  const initModel = async (config: any): Promise<void> => {
    if (trainData.length === 0 || !predictor) return;
    setPredictions([]);
    predictor.generateMarkov(trainData, +config.window).then(() => {
      addToast(`Modelo de predición generado con éxito`, EToastType.MSG);

      for (let i = 0; i < 10; i++) {
        handleNameCreation();
      }
    });
  };

  useEffect(() => {
    getTrainData(config.source);
  }, [config.source]);

  useEffect(() => {
    initModel(config);
  }, [trainData, config.window, config.maxLength, config.minLength]);

  return (
    <predictorContext.Provider
      value={{
        predictions,
        handleNameCreation,
        getTrainData,
        initModel,
        config,
        setConfig,
      }}
    >
      {children}
    </predictorContext.Provider>
  );
};
