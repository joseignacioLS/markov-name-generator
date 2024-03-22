"use client";

import { useContext } from "react";
import PredictionCard from "../components/PredictionCard/PredictionCard";
import styles from "../page.module.scss";
import { favoritesContext } from "../context/favorites.contexts";

const Home = () => {
  const { favorites } = useContext(favoritesContext);
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Favoritos</h1>
      <div className={styles.predictor}>
        <h2>Favoritos Guardados</h2>
        <div className={styles.predictionsWrapper}>
          {favorites.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
