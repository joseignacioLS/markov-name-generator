import { IPredictor } from "../types";

export class Markov implements IPredictor {
  private starters: string[] = [];
  private data: { [key: string]: { [key: string]: number } } = {};
  public trained: boolean = false;

  constructor() {
  }

  private initValues(): void {
    this.starters = [];
    this.data = {};
    this.trained = false;
  }

  private processWord(raw_name: string): void {
    const MAX_WINDOW = 32;
    const chars = Array.from(raw_name);

    for (let j = 1; j <= Math.min(MAX_WINDOW, chars.length - 1); j++) {
      this.starters.push(raw_name.slice(0, j));
    }
    for (let i = 0; i < chars.length; i++) {
      for (let j = 1; j <= Math.min(MAX_WINDOW, chars.length - 1); j++) {

        const word = chars.slice(i, i + j).join("");
        if (!this.data[word]) {
          this.data[word] = {};
        }
        if (i === chars.length - j) {
          if (!this.data[word]["."]) {
            this.data[word]["."] = 0;
          }
          this.data[word]["."]++;
          break;
        }
        const next_char = chars[j + i];
        if (!this.data[word][next_char]) {
          this.data[word][next_char] = 0;
        }
        this.data[word][next_char]++;
      }
    }
  }

  async trainModel(trainData: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.initValues();

      for (const name of trainData) {
        this.processWord(name);
      }

      this.adjustProbs();

      this.trained = true;
      resolve(true);
    });
  }

  private adjustProbs(): void {
    for (const key in this.data) {
      const total = Object.keys(this.data[key]).reduce((acc, subkey) => acc + this.data[key][subkey], 0);
      Object.keys(this.data[key]).forEach((subkey) => this.data[key][subkey] /= total);
    }
  }

  private initPrediction(window: number): string {
    const startersByLength = this.starters.filter(st => st.length === window)
    return startersByLength[Math.floor(Math.random() * startersByLength.length)];
  }

  private getPredictionWindow(prediction: string, window: number): string {
    return prediction?.slice(-window) || "";
  }

  private growPrediction(prediction: string, window: number): string {
    const base_prediction = this.getPredictionWindow(prediction, window);
    if (base_prediction === "") return prediction
    const options = this.data[base_prediction];

    const n = Math.random();

    let t_prob = 0;
    for (const key in options) {
      if (t_prob + options[key] >= n) {
        return prediction + key;
      } else {
        t_prob += options[key];
      }
    }
    return prediction
  }

  predict(config: { window: number, minLength: number, maxLength: number }): string {
    let prediction = this.initPrediction(config.window);
    let safe = 1000;
    while (safe > 0) {
      safe--;

      prediction = this.growPrediction(prediction, config.window);
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
