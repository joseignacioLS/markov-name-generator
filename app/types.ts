export enum EPredictor {
  MARKOV = "MARKOV",
}

export interface IPredictor {
  trained: boolean;
  predict: (config: {
    window: number;
    windowPredict: number;
    minLength: number;
    maxLength: number;
  }) => string | Promise<string>;
  trainModel: (trainData: string[], config?: any) => Promise<boolean>;
}

export interface IPrediction {
  id: number;
  value: string;
  length: number;
  date: Date;
  prob?: number;
  predictor: {
    method: EPredictor;
    config: any;
  };
}
