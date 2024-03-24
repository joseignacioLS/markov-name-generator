export enum EPredictor {
  MARKOV = "MARKOV"
}

export interface IPredictor {
  trained: boolean;
  predict: (window: number, minLength: number, maxLenght: number) => string | Promise<string>
  trainModel: (value: string[]) => Promise<boolean>
}

export interface IPrediction {
  id: number;
  value: string;
  length: number;
  date: Date;
  predictor: {
    method: EPredictor,
    config: any
  }
}