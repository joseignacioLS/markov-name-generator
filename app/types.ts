export enum EPredictor {
  MARKOV
}

export interface IPrediction {
  id: number;
  value: string;
  method: EPredictor;
  length: number;
  window?: number;
  source: string;
}