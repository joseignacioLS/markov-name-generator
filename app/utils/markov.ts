export class Markov {
  private window: number;
  private starters: string[];
  private data: { [key: string]: { [key: string]: number } };

  constructor() {
    this.window = 1;
    this.starters = [];
    this.data = {};
  }

  private initValues(): void {
    this.window = 1;
    this.starters = [];
    this.data = {};
  }

  private processWord(raw_name: string): void {
    const chars = Array.from(raw_name);
    if (raw_name.length <= this.window) {
      return;
    }

    this.starters.push(raw_name.slice(0, this.window));
    for (let i = 0; i < chars.length; i++) {
      const word = chars.slice(i, i + this.window).join("");
      if (!this.data[word]) {
        this.data[word] = {};
      }
      if (i === chars.length - this.window) {
        if (!this.data[word]["."]) {
          this.data[word]["."] = 0;
        }
        this.data[word]["."]++;
        break;
      }
      const next_char = chars[this.window + i];
      if (!this.data[word][next_char]) {
        this.data[word][next_char] = 0;
      }
      this.data[word][next_char]++;
    }
  }

  async generateMarkov(words: string[], window: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.initValues();
      this.window = window;

      for (const name of words) {
        this.processWord(name);
      }

      this.adjustProbs();
      resolve(true);
    });
  }

  private adjustProbs(): void {
    for (const key in this.data) {
      const total = Object.keys(this.data[key]).reduce((acc, subkey) => acc + this.data[key][subkey], 0);
      Object.keys(this.data[key]).forEach((subkey) => this.data[key][subkey] /= total);
    }
  }

  private initPrediction(): string {
    return this.starters[Math.floor(Math.random() * this.starters.length)];
  }

  private getPredictionWindow(prediction: string, window: number): string {
    return prediction.slice(-window);
  }

  private growPrediction(prediction: string): string {
    const base_prediction = this.getPredictionWindow(prediction, this.window);
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

  predict(min_length: number = 6, max_length: number = 10): string {
    let prediction = this.initPrediction();
    let safe = 1000;
    while (safe > 0) {
      safe--;
      prediction = this.growPrediction(prediction);
      if (prediction.length > max_length + 1) {
        prediction = this.initPrediction();
      }
      if (prediction.at(-1) === ".") {
        if (prediction.length >= min_length) {
          break;
        } else {
          prediction = this.initPrediction();
        }
      }
    }

    if (safe === 0) {
      return "";
    }
    return prediction.replace(".", "");
  }
}
