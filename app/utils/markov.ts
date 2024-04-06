import { IPredictor } from "../types";

export class Markov implements IPredictor {
  private starters: string[] = [];
  private data: {
    [key: string]: { [key: number]: { [key: string]: number } };
  } = {};
  public trained: boolean = false;

  constructor() { }

  private initValues(): void {
    this.starters = [];
    this.data = {};
    this.trained = false;
  }

  private processWord(raw_name: string): void {
    const MAX_WINDOW = 32;
    const MAX_PREDICTION_WINDOW = 6;

    for (let position = 0; position < raw_name.length; position += 1) {
      for (let window = 1; window <= MAX_WINDOW; window += 1) {
        if (position + window > raw_name.length + 1) {
          continue;
        }
        const predictionInput = raw_name.slice(position, position + window);
        if (position === 0) {
          this.starters.push(predictionInput);
        }
        for (
          let predictionWindow = 1;
          predictionWindow <= MAX_PREDICTION_WINDOW;
          predictionWindow += 1
        ) {
          const predictionOutput = raw_name.slice(
            position + window,
            position + window + predictionWindow
          );
          const finalPredictionOutput =
            predictionOutput.length < predictionWindow
              ? predictionOutput + "."
              : predictionOutput;
          if (!this.data[predictionInput]) {
            this.data[predictionInput] = {};
          }
          if (!this.data[predictionInput][predictionWindow]) {
            this.data[predictionInput][predictionWindow] = {};
          }
          if (
            !this.data[predictionInput][predictionWindow][finalPredictionOutput]
          ) {
            this.data[predictionInput][predictionWindow][
              finalPredictionOutput
            ] = 0;
          }
          this.data[predictionInput][predictionWindow][finalPredictionOutput]++;
        }
      }
    }
  }

  async trainModel(trainData: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.initValues();

        for (const name of trainData) {
          this.processWord(name);
        }

        this.adjustProbs();

        this.trained = true;
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  private adjustProbs(): void {
    for (const key in this.data) {
      for (const keyWindow in this.data[key]) {
        const total = Object.keys(this.data[key][keyWindow]).reduce(
          (acc, subkey) => acc + this.data[key][keyWindow][subkey],
          0
        );
        Object.keys(this.data[key][keyWindow]).forEach(
          (subkey) => (this.data[key][keyWindow][subkey] /= total)
        );
      }
    }
  }

  private initPrediction(window: number): string {
    const startersByLength = this.starters.filter((st) => st.length === window);
    return startersByLength[
      Math.floor(Math.random() * startersByLength.length)
    ];
  }

  private getPredictionWindow(prediction: string, window: number): string {
    return prediction?.slice(-window) || "";
  }

  private growPrediction(
    prediction: string,
    window: number,
    windowPrediction: number = 1
  ): string {
    const basePrediction = this.getPredictionWindow(prediction, window);
    if (basePrediction === "") return prediction;
    const options = this.data[basePrediction][windowPrediction];

    const n = Math.random();

    let t_prob = 0;
    for (const key in options) {
      if (t_prob + options[key] >= n) {
        return prediction + key;
      } else {
        t_prob += options[key];
      }
    }
    return prediction;
  }

  predict(config: {
    window: number;
    windowPredict: number;
    minLength: number;
    maxLength: number;
  }): string {
    let prediction = this.initPrediction(config.window);
    let safe = 1000;
    while (safe > 0) {
      safe--;

      prediction = this.growPrediction(
        prediction,
        config.window,
        config.windowPredict
      );

      if (prediction.length > config.maxLength + 1) {
        prediction = this.initPrediction(config.window);
      }
      if (prediction.at(-1) === ".") {
        if (prediction.length > config.minLength) {
          break;
        } else {
          prediction = this.initPrediction(config.window);
        }
      }
    }

    if (safe === 0) {
      return "";
    }
    return prediction.replace(".", "");
  }
}
