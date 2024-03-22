import { IPrediction } from "@/app/types";
import React, { MouseEvent, useContext } from "react";
import PredictionDetail from "../PredictionDetail/PredictionDetail";
import { modalContext } from "@/app/context/modal.context";

import styles from "./styles.module.scss";
import Button from "../Button/Button";
import { favoritesContext } from "@/app/context/favorites.contexts";

const windowToColor: { [key: number]: string } = {
  1: "#001C47", // Substituted for background color
  2: "#193559",
  3: "#32416C",
  4: "#4B5D7F",
  5: "#647992",
  6: "#7D95A5", // Substituted for highlight color
};

interface IProps {
  prediction: IPrediction;
}

const PredictionCard = ({ prediction }: IProps) => {
  const { showModal } = useContext(modalContext);
  const { isFav, handleFav } = useContext(favoritesContext);

  const handleShowDetail = () => {
    showModal(<PredictionDetail prediction={prediction} />);
  };

  const handleFavClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    handleFav(prediction);
  };

  return (
    <div
      key={prediction.id}
      className={styles.prediction}
      onClick={handleShowDetail}
      data-tooltip={`Word: ${prediction.value}\nWindow: ${prediction.window}`}
      style={{
        backgroundColor: windowToColor[prediction.window],
      }}
    >
      <span>{prediction.value}</span>
      <div className={styles.favButton}>
        <Button onClick={handleFavClick} size="small">
          <span
            className={`material-symbols-outlined ${
              isFav(prediction.value) && styles.fav
            }`}
          >
            {isFav(prediction.value) ? "cancel" : "save"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PredictionCard;
