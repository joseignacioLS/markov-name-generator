import { IPrediction } from "@/app/types";
import styles from "./styles.module.scss";

interface IProps {
  prediction: IPrediction;
}

const PredictionDetail = ({ prediction }: IProps) => {
  const config = prediction.predictor?.config;
  return (
    <div className={styles.wrapper}>
      <h2>{prediction.value}</h2>
      {config?.source && (
        <p>
          <span>Fuente:</span>
          <span>{config?.source}</span>
        </p>
      )}
      {config?.window && (
        <p>
          <span>Fidelidad:</span>
          <span>{config?.window}</span>
        </p>
      )}
      {(prediction?.prob || 0) > 0 && (
        <p>
          <span>Probabilidad:</span>
          <span>{Math.floor((prediction.prob || 0) * 1000000) / 10000}%</span>
        </p>
      )}
    </div>
  );
};

export default PredictionDetail;
