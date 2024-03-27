"use client";

import { ChangeEvent, useEffect, useState } from "react";
import RangeInput from "../RangeInput/RangeInput";
import styles from "./styles.module.scss";
import Button from "../Button/Button";

const color: { [key: number]: string } = {
  0: "#559955",
  1: "#995599",
};

const processWord = (
  raw_name: string,
  window: number
): { [key: string]: { [key: string]: number } } => {
  const chars = Array.from(raw_name);

  const data: { [key: string]: { [key: string]: number } } = {};

  for (let i = 0; i < chars.length; i++) {
    for (let j = 1; j <= Math.min(window, chars.length - 1); j++) {
      const word = chars.slice(i, i + j).join("");
      if (!data[word]) {
        data[word] = {};
      }
      if (i === chars.length - j) {
        if (!data[word]["."]) {
          data[word]["."] = 0;
        }
        data[word]["."]++;
        break;
      }
      const next_char = chars[j + i];
      if (!data[word][next_char]) {
        data[word][next_char] = 0;
      }
      data[word][next_char]++;
    }
  }
  return data;
};

interface IProps {}
const HowItWorks = ({}: IProps) => {
  const exampleWord = "temperamento";

  const [input, setInput] = useState({
    window: 1,
  });

  const [generatedWord, setGeneratedWord] = useState(
    exampleWord.slice(0, +input.window)
  );

  const [selectedNGram, setSelectedNGram] = useState(
    generatedWord.slice(generatedWord.length - +input.window)
  );

  const [disableButtons, setDisableButtons] = useState({
    next: false,
    change: true,
    back: true,
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((oldState) => {
      return { ...oldState, [name]: value };
    });
    setGeneratedWord(exampleWord.slice(0, +value));
    setSelectedNGram(() => {
      const word = exampleWord.slice(0, +value);
      return word.slice(word.length - +value);
    });
  };

  const resetGeneratedWord = () => {
    setGeneratedWord((oldState) =>
      oldState.length <= +input.window
        ? oldState
        : oldState.slice(0, oldState.length - 1)
    );
  };

  const addLetterToWord = () => {
    setGeneratedWord((oldState) => {
      const base = oldState.slice(oldState.length - +input.window);
      const options = Object.keys(processedWord[base]).filter((v) => v !== ".");
      if (options.length === 0) {
        return oldState;
      }
      return oldState + options[Math.floor(Math.random() * options.length)];
    });
  };

  const modifyLastLetter = () => {
    setGeneratedWord((oldState) => {
      const base = oldState.slice(
        oldState.length - (+input.window + 1),
        oldState.length - 1
      );
      const options = Object.keys(processedWord[base]).filter(
        (v) => v !== "." && v !== oldState[oldState.length - 1]
      );
      if (options.length === 0) {
        return oldState;
      }
      return (
        oldState.slice(0, oldState.length - 1) +
        options[Math.floor(Math.random() * options.length)]
      );
    });
  };

  useEffect(() => {
    const ngram = generatedWord.slice(generatedWord.length - +input.window);
    setSelectedNGram(ngram);
    const back = generatedWord.length === +input.window;
    const prevNGram =
      !back &&
      generatedWord.slice(
        generatedWord.length - +input.window - 1,
        generatedWord.length - 1
      );
    const prevOptions = prevNGram ? Object.keys(processedWord[prevNGram]) : [];
    const change = back || prevOptions.length < 2;

    const options = Object.keys(processedWord[ngram]).filter((v) => v !== ".");
    const next = options.length < 1;
    setDisableButtons((oldState) => {
      return { ...oldState, back, change, next };
    });
  }, [generatedWord]);

  const processedWord = processWord(exampleWord, input.window);

  return (
    <div className={styles.wrapper}>
      <section className={styles.howToBlock}>
        <h2>Procesar palabras</h2>
        <div>
          <p>
            Cada palabra del set de entramiento se analiza de forma individual.
          </p>
          <p>
            Para ello, las palabras se separan en n-gramas (grupos de n-letras).
          </p>
        </div>
        <div className={styles.interactiveExample}>
          <div className={styles.splittedWordWrapper}>
            {exampleWord.split("").map((chr, i) => {
              return (
                <span
                  key={i + chr}
                  style={{
                    backgroundColor: color[Math.floor(i / input.window) % 2],
                  }}
                >
                  {chr}
                </span>
              );
            })}
          </div>
          <RangeInput
            name="window"
            value={`${input.window}`}
            setValue={handleInput}
            min="1"
            max={`${Math.floor(exampleWord.length / 2)}`}
          />
        </div>

        <span className={styles.caption}>
          Generación de N-gramas interactiva
        </span>
        <p>
          De esta forma se obtienen n-gramas de tamaño n ({input.window} en este
          caso).
        </p>
      </section>
      <section className={styles.howToBlock}>
        <h2>Determinar siguientes letras para cada N-grama</h2>
        <p>
          Una vez analizadas todas las palabras, se obtiene para cada n-grama
          diferente todas las posibles letras que pueden venir después.
        </p>
        <div className={styles.interactiveExample}>
          <div className={styles.ngramTable}>
            <div className={styles.row}>
              <span>N-Grama</span>
              <span>Opciones</span>
            </div>
            {Object.keys(processedWord)
              .filter((k) => {
                return k.length === +input.window;
              })
              .map((k, i) => {
                return (
                  <div key={k + i} className={styles.row}>
                    <span>{k}</span>
                    <div className={styles.ngramOptions}>
                      {Object.keys(processedWord[k]).map((sk) => {
                        return <span key={k + "_" + sk}>{sk}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <span className={styles.caption}>Tabla de N-gramas y sus opciones</span>
      </section>
      <section className={styles.howToBlock}>
        <h2>Predecir</h2>
        <p>
          Usando esta información se generan palabras al azar, haciendo crecer
          la palabra en base al último n-grama que la conforma.
        </p>
        <div className={styles.interactiveExample}>
          <div className={styles.splittedWordWrapper}>
            {generatedWord.split("").map((chr, i) => {
              if (i === generatedWord.length - 1) {
                let otherOptions: string[] = [];
                if (generatedWord.length > +input.window) {
                  const prevNGram = generatedWord.slice(
                    generatedWord.length - +input.window - 1,
                    generatedWord.length - 1
                  );
                  otherOptions = Object.keys(processedWord[prevNGram]).filter(
                    (v) => v !== chr
                  );
                }
                const nextOptions = Object.keys(
                  processedWord[selectedNGram] || {}
                );
                return (
                  <div key={i + chr} style={{ display: "flex" }}>
                    <div>
                      <span
                        style={{
                          backgroundColor: color[1],
                        }}
                      >
                        {chr}
                      </span>
                      {otherOptions.map((o) => {
                        return (
                          <span
                            key={o}
                            style={{
                              opacity: ".75",
                              backgroundColor: color[0],
                            }}
                          >
                            {o}
                          </span>
                        );
                      })}
                    </div>
                    <div>
                      {nextOptions.map((o) => {
                        return (
                          <span
                            key={o}
                            style={{
                              opacity: ".75",
                              backgroundColor: color[1],
                            }}
                          >
                            {o}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <span
                  key={i + chr}
                  style={{
                    backgroundColor:
                      i >= generatedWord.length - +input.window ? color[1] : "",
                  }}
                >
                  {chr}
                </span>
              );
            })}
          </div>
          <div
            style={{
              justifySelf: "right",
              flexDirection: "column",
              display: "flex",
              gap: ".5rem",
            }}
          >
            <Button
              onClick={addLetterToWord}
              size="small"
              disabled={disableButtons.next}
            >
              <span className="material-symbols-outlined filled">redo</span>
            </Button>
            <Button
              onClick={modifyLastLetter}
              size="small"
              disabled={disableButtons.change}
            >
              <span className="material-symbols-outlined filled">sync</span>
            </Button>
            <Button
              onClick={resetGeneratedWord}
              size="small"
              disabled={disableButtons.back}
            >
              <span className="material-symbols-outlined filled">undo</span>
            </Button>
          </div>
        </div>
        <span className={styles.caption}>Predicción interactiva</span>
        <p>
          Cuanto mayor sea el tamaño del n-grama más fiel a la palabra original
          será la predicción y menos opciones (incluso ninguna) habrá para hacer
          crecer la palabra.
        </p>
      </section>
    </div>
  );
};

export default HowItWorks;
