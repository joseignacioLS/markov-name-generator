import { IPredictor } from "../types";

export class Markov implements IPredictor {
  private starters: string[] = [];
  private data: {
    [key: string]: { [key: number]: { [key: string]: number } };
  } = {};
  public trained: boolean = false;

  constructor() {}

  private initValues(): void {
    this.starters = [];
    this.data = {};
    this.trained = false;
  }

  private processWord(raw_word: string): void {
    const MAX_WINDOW = 32;
    const MAX_PREDICTION_WINDOW = 6;

    // for position in word
    for (let position = 0; position < raw_word.length; position += 1) {
      // for window length
      for (let window = 1; window <= MAX_WINDOW; window += 1) {
        if (position + window > raw_word.length + 1) {
          continue;
        }
        const predictionInput: string = raw_word.slice(
          position,
          position + window
        );
        if (position === 0) {
          this.starters.push(predictionInput);
        }
        // for forward window length
        for (
          let predictionWindow = 1;
          predictionWindow <= MAX_PREDICTION_WINDOW;
          predictionWindow += 1
        ) {
          const predictionOutput = raw_word.slice(
            position + window,
            position + window + predictionWindow
          );
          // add dot if word end
          const finalPredictionOutput =
            predictionOutput.length < predictionWindow
              ? predictionOutput + "."
              : predictionOutput;

          // initialize object if needed
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
  private processWords(words: string[]): void {
    words.forEach((word) => this.processWord(word));
  }

  async trainModel(trainData: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.initValues();

        this.processWords(trainData);

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
        const total: number = Object.keys(this.data[key][keyWindow]).reduce(
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

  private growPrediction(base: string, windowPrediction: number): string {
    const options = this.data[base][windowPrediction];
    const n = Math.random();

    let t_prob: number = 0;
    for (let key in options) {
      if (t_prob + options[key] >= n) {
        return key;
      } else {
        t_prob += options[key];
      }
    }
    return "";
  }

  private recursiveGeneratePrediction(
    prediction: string,
    window: number,
    windowPrediction: number,
    minLength: number,
    maxLength: number
  ): string {
    const closed: boolean = prediction.at(-1) === ".";
    const longEnough: boolean = prediction.length > minLength;
    const shortEnough: boolean = prediction.length <= maxLength + 1;

    if (!shortEnough) {
      return "";
    }

    if (closed && longEnough && shortEnough)
      return this.validatePrediction(prediction);
    else if (closed) {
      return "";
    }

    const basePrediction: string = this.getPredictionWindow(prediction, window);
    const grownPrediction: string =
      prediction + this.growPrediction(basePrediction, windowPrediction);
    return this.recursiveGeneratePrediction(
      grownPrediction,
      window,
      windowPrediction,
      minLength,
      maxLength
    );
  }

  private validatePrediction(prediction: string): string {
    if (prediction.at(-1) !== ".") {
      return "";
    }
    return prediction.replace(".", "");
  }

  private predictionHandler(
    config: {
      window: number;
      windowPredict: number;
      minLength: number;
      maxLength: number;
    },
    epoch = 1,
    maxEpochs = 150
  ): string {
    if (maxEpochs < epoch) return "";
    const prediction: string = this.recursiveGeneratePrediction(
      this.initPrediction(config.window),
      config.window,
      config.windowPredict,
      config.minLength,
      config.maxLength
    );
    return prediction === ""
      ? this.predictionHandler(config, epoch + 1, maxEpochs)
      : prediction;
  }

  predict(config: {
    window: number;
    windowPredict: number;
    minLength: number;
    maxLength: number;
    maxTries?: number;
  }): string {
    return this.predictionHandler(config);
  }
}
