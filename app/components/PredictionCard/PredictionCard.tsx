import { IPrediction } from "@/app/types";
import { MouseEvent, useContext } from "react";
import PredictionDetail from "../PredictionDetail/PredictionDetail";
import { modalContext } from "@/app/context/modal.context";

import styles from "./styles.module.scss";
import Button from "../Button/Button";
import { favoritesContext } from "@/app/context/favorites.context";
import { windowToColor } from "@/app/utils/other";

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
      style={{
        backgroundColor: windowToColor[prediction?.window || "1"],
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
