export interface IPrediction {
  id: number;
  value: string;
  length: number;
  window: number;
  source: string;
}