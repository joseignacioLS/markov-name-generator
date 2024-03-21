import { hyphenate } from "hyphen/es";

export class Markov {
  private window: number;
  private starters: string[];
  private data: { [key: string]: { [key: string]: number } };

  constructor() {
    this.window = 1;
    this.starters = [];
    this.data = {};
  }

  private init_values(): void {
    this.window = 1;
    this.starters = [];
    this.data = {};
  }

  private async process_word_by_syllables(raw_name: string): Promise<void> {
    const syllables: string[] = [];

    for (const word of raw_name.split(" ")) {
      const splittedWord = await (await hyphenate(word)).split("-");
      syllables.push(...splittedWord);
      syllables.push(" ");
    }
    syllables[syllables.length - 1] = ".";

    for (let i = 0; i < syllables.length - this.window; i++) {
      const base = syllables.slice(i, i + this.window).join("");
      if (i === 0) {
        this.starters.push(base);
      }
      if (!this.data[base]) {
        this.data[base] = {};
      }
      const next_syllable = syllables[i + this.window];
      if (!this.data[base][next_syllable]) {
        this.data[base][next_syllable] = 0;
      }
      this.data[base][next_syllable]++;
    }
  }

  private process_word(raw_name: string): void {
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

  generate_markov(words: string[], window: number): void {
    this.init_values();
    this.window = window;

    for (const name of words) {
      this.process_word(name);
    }

    this.adjust_probs();
  }

  private adjust_probs(): void {
    for (const key in this.data) {
      let total = 0;
      for (const subkey in this.data[key]) {
        total += this.data[key][subkey];
      }

      for (const subkey in this.data[key]) {
        this.data[key][subkey] /= total;
      }
    }
  }

  private init_prediction(): string {
    return this.starters[Math.floor(Math.random() * this.starters.length)];
  }

  private get_prediction_window(prediction: string, window: number): string {
    return prediction.slice(-window);
  }

  private grow_prediction(prediction: string): string {
    const base_prediction = this.get_prediction_window(prediction, this.window);
    const options = this.data[base_prediction];

    const n = Math.random();

    let t_prob = 0;
    let addition = "";

    for (const key in options) {
      if (t_prob + options[key] >= n) {
        addition = key;
        break;
      } else {
        t_prob += options[key];
      }
    }
    return prediction + addition;
  }

  predict(min_length: number = 6, max_length: number = 10): string {
    let prediction = this.init_prediction();
    let safe = 1000;
    while (safe > 0) {
      safe--;
      prediction = this.grow_prediction(prediction);
      if (prediction.length > max_length + 1) {
        prediction = this.init_prediction();
      }
      if (prediction.slice(-1) === ".") {
        if (prediction.length >= min_length) {
          break;
        } else {
          prediction = this.init_prediction();
        }
      }
    }

    if (safe === 0) {
      return "-error-";
    }
    return prediction.replace(".", "");
  }
}
