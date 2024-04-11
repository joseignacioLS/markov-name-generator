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
import { modalContext } from "./modal.context";
import CustomSourceInput from "../components/CustomSourceInput/CustomSourceInput";

interface IValue {
  config: any;
  updateConfig: any;
  predictions: IPrediction[];
  handleNameCreation: () => void;
}

const FALLBACK_CONFIG = {
  window: "3",
  windowPredict: "1",
  minLength: "6",
  maxLength: "10",
  source: sources[0].value,
};

export const predictorContext = createContext<IValue>({
  config: {},
  updateConfig: () => {},
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
  const { showModal } = useContext(modalContext);

  const handleNameCreation = useCallback((): void => {
    if (!predictor) {
      addToast(
        "El modelo no se ha cargado correctamente. Refresca la página",
        EToastType.ERR
      );
      return;
    }
    const newName: string = predictor.predict({
      window: +config.window,
      windowPredict: +config.windowPredict,
      minLength: +config.minLength,
      maxLength: +config.maxLength,
    });
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
          prob: predictor.evaluateProbability(newName, config),
          predictor: {
            method: EPredictor.MARKOV,
            config: {
              window: +config.window,
              windowPredict: +config.windowPredict,
              source: sources.find((s) => s.value === config.source)?.name,
            },
          },
        },
      ];
    });
  }, [predictor, config, setPredictions]);

  useEffect(() => {
    const processRetrievedData = (data: string) => {
      const formattedData = data
        .split("\n")
        .map((n: string) => n.toLowerCase().replace("\r", ""));
      setTrainData(formattedData);
    };
    const getTrainData = async (source: string): Promise<void> => {
      const response = (await getRequest(source)) as string;
      if (response === "") {
        addToast("Ha habido un error cargando el set de datos", EToastType.ERR);
        return;
      }

      processRetrievedData(response);
    };
    if (!config?.source) return;
    if (config.source === "custom") {
      showModal(<CustomSourceInput setTrainData={processRetrievedData} />);
      return;
    }
    getTrainData(config.source);
  }, [config?.source]);

  useEffect(() => {
    const initModel = async (): Promise<void> => {
      if (trainData.length === 0 || !predictor) return;
      setPredictions([]);
      predictor.trainModel(trainData).then(() => {
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
  }, [
    config?.window,
    config?.minLength,
    config?.maxLength,
    config?.windowPredict,
  ]);

  const updateConfig = (name: string, value: any) => {
    setConfig((oldState: any) => {
      if (name === "maxLength") {
        if (+oldState.window > +value) {
          addToast(
            "El valor de longitud máxima no puede ser inferior a la fidelidad",
            EToastType.WRN
          );
          return oldState;
        }
      }
      if (name === "window") {
        if (+oldState.maxLength < +value) {
          addToast(
            "El valor de fidelidad no puede ser superior a la longitud máxima",
            EToastType.WRN
          );
          return oldState;
        }
      }
      return { ...oldState, [name]: value };
    });
  };

  const checkStoredConfig = (config: any) => {
    return {
      window: +(config.window || FALLBACK_CONFIG.window),
      windowPredict: +(config.windowPredict || FALLBACK_CONFIG.windowPredict),
      minLength: +(config.minLength || FALLBACK_CONFIG.minLength),
      maxLength: +(config.maxLength || FALLBACK_CONFIG.maxLength),
      source: config.source || FALLBACK_CONFIG.source,
    };
  };

  useEffect(() => {
    const stored = recover("markov-names");
    if (!stored?.config || !stored?.favs) {
      store("markov-names", {
        favs: [],
        config: { ...FALLBACK_CONFIG },
      });
      return;
    }
    setConfig(checkStoredConfig(stored.config));
  }, []);

  useEffectAfterInit(() => {
    const stored = recover("markov-names") || { favs: [], config: {} };
    console.log({ config });
    store("markov-names", { ...stored, config });
  }, [config]);

  return (
    <predictorContext.Provider
      value={{
        predictions,
        handleNameCreation,
        config,
        updateConfig,
      }}
    >
      {children}
    </predictorContext.Provider>
  );
};
