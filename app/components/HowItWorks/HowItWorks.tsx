"use client";

import { ChangeEvent, useEffect, useState } from "react";
import RangeInput from "../RangeInput/RangeInput";
import styles from "./styles.module.scss";
import SelectInput from "../SelectInput/SelectInput";
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
  const exampleWord = "testimonio";

  const [input, setInput] = useState({
    window: 1,
  });

  const [generatedWord, setGeneratedWord] = useState(
    exampleWord.slice(0, +input.window)
  );

  const [selectedNGram, setSelectedNGram] = useState(
    generatedWord.slice(generatedWord.length - +input.window)
  );

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((oldState) => {
      return { ...oldState, [name]: value };
    });
    setGeneratedWord(exampleWord.slice(0, +value));
  };

  const handleGenerateStep = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === "") return;
    setGeneratedWord((oldValue) => oldValue + value);
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

  useEffect(() => {
    setSelectedNGram(generatedWord.slice(generatedWord.length - +input.window));
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
            Usa el slider de abajo para ver como la palabra se divide en los
            diferentes grupos.
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
          De esta forma obtenemos grupos de letras de tamaño n ({input.window}{" "}
          en este caso) y la siguiente letra que aparece en la palabra
        </p>
      </section>
      <section className={styles.howToBlock}>
        <h2>Determinar siguientes letras para cada N-grama</h2>
        <p>
          Una vez analizadas todas las palabras, sabremos para cada n-grama
          todas las posibles letras que pueden venir después, y con que
          frecuencia
        </p>
        <div className={styles.interactiveExample}>
          <div className={styles.ngramTable}>
            <span>N-Grama</span>
            <span>Opciones</span>
            {Object.keys(processedWord)
              .filter((k) => {
                return k.length === +input.window;
              })
              .map((k, i) => {
                return (
                  <>
                    <span
                      key={k + i}
                      style={{
                        backgroundColor: selectedNGram === k ? color[1] : "",
                      }}
                    >
                      {k}
                    </span>
                    <div key={k + "__options"} className={styles.ngramOptions}>
                      {Object.keys(processedWord[k]).map((sk) => {
                        return (
                          <span
                            key={k + "_" + sk}
                          >{`'${sk}': ${processedWord[k][sk]}`}</span>
                        );
                      })}
                    </div>
                  </>
                );
              })}
          </div>
        </div>

        <span className={styles.caption}>Tabla de N-gramas y sus opciones</span>
      </section>
      <section className={styles.howToBlock}>
        <h2>Predecir</h2>
        <p>
          Usando esta información podemos generar palabras al azar, haciendo
          crecer nuestra palabra en base a las posibilidades y sus frecuencias.
        </p>
        <div className={styles.interactiveExample}>
          <div className={styles.splittedWordWrapper}>
            {generatedWord.split("").map((chr, i) => {
              return (
                <span
                  key={i + chr}
                  style={{
                    backgroundColor:
                      i >= generatedWord.length - input.window ? color[1] : "",
                  }}
                >
                  {chr}
                </span>
              );
            })}
          </div>
          {/* <SelectInput
            name="options"
            value=""
            setValue={handleGenerateStep}
            options={[
              { name: "Siguiente", value: "" },
              ...Object.keys(
                processedWord[
                  generatedWord.slice(generatedWord.length - input.window)
                ]
              )
                .filter((k) => k !== ".")
                .map((k) => {
                  return {
                    name: k,
                    value: k,
                  };
                }),
            ]}
          /> */}
          <div
            style={{
              justifySelf: "right",
              display: "flex",
              gap: ".5rem",
            }}
          >
            <Button
              onClick={resetGeneratedWord}
              size="small"
              disabled={generatedWord.length <= +input.window}
            >
              <span className="material-symbols-outlined filled">undo</span>
            </Button>
            {/* <Button onClick={addLetterToWord} size="small" disabled>
              <span className="material-symbols-outlined filled">sync</span>
            </Button> */}
            <Button onClick={addLetterToWord} size="small">
              <span className="material-symbols-outlined filled">redo</span>
            </Button>
          </div>
        </div>
        <span className={styles.caption}>Predicción interactiva</span>
        <p>
          Cuanto mayor sea el tamaño del N-grama, más fiel a la palabra original
          será la predicción y menos opciones (incluso ninguna) habrá para hacer
          crecer la palabra.
        </p>
      </section>
    </div>
  );
};

export default HowItWorks;
