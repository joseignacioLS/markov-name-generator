"use client";

import {
  createContext,
  ReactNode,
  useCallback,
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
import { recover, store } from "../services/localstorage.service";
import { useEffectAfterInit } from "../hooks/useEffectAfterInit";

interface IValue {
  config: any;
  setConfig: any;
  predictions: IPrediction[];
  handleNameCreation: () => void;
}

const FALLBACK_CONFIG = {
  window: "3",
  minLength: "6",
  maxLength: "10",
  source: sources[0].value,
};

export const predictorContext = createContext<IValue>({
  config: {},
  setConfig: () => {},
  predictions: [],
  handleNameCreation: () => {},
});

interface IProps {
  children: ReactNode;
}
export const PredictorProvider = ({ children }: IProps) => {
  const [config, setConfig] = useState<IValue["config"]>(FALLBACK_CONFIG);
  const [predictor, setPredictor] = useState<Markov | undefined>(new Markov());
  const [predictions, setPredictions] = useState<IPrediction[]>([]);
  const [trainData, setTrainData] = useState<string[]>([]);

  const { addToast } = useContext(toastContext);

  const handleNameCreation = useCallback((): void => {
    if (!predictor) {
      addToast(
        "El modelo no se ha cargado correctamente. Refresca la página",
        EToastType.ERR
      );
      return;
    }
    const newName: string = predictor.predict(
      +config.window,
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
          length: newName.length,
          date: new Date(),
          predictor: {
            method: EPredictor.MARKOV,
            config: {
              window: +config.window,
              source: sources.find((s) => s.value === config.source)?.name,
            },
          },
        },
      ];
    });
  }, [predictor, config, setPredictions]);

  useEffect(() => {
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
    if (config?.source) {
      getTrainData(config.source);
    }
  }, [config?.source]);

  useEffect(() => {
    const initModel = async (): Promise<void> => {
      if (trainData.length === 0 || !predictor) return;
      setPredictions([]);
      predictor.trainModel(trainData).then(() => {
        addToast(`Modelo de predición generado con éxito`, EToastType.MSG);

        for (let i = 0; i < 10; i++) {
          handleNameCreation();
        }
      });
    };
    initModel();
  }, [trainData, predictor]);

  useEffect(() => {
    if (!predictor?.trained || config === undefined) return;
    setPredictions([]);
    for (let i = 0; i < 10; i++) {
      handleNameCreation();
    }
  }, [config?.window, config?.minLength, config?.maxLength]);

  useEffect(() => {
    const stored = recover("markov-names");
    if (!stored?.config || !stored?.favs) {
      store("markov-names", {
        favs: [],
        config: { ...FALLBACK_CONFIG },
      });
      return;
    }
    setConfig(stored.config);
  }, []);

  useEffectAfterInit(() => {
    const stored = recover("markov-names") || { favs: [], config: {} };
    store("markov-names", { ...stored, config });
  }, [config]);

  return (
    <predictorContext.Provider
      value={{
        predictions,
        handleNameCreation,
        config,
        setConfig,
      }}
    >
      {children}
    </predictorContext.Provider>
  );
};
