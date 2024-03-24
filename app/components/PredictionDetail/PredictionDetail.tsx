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
    </div>
  );
};

export default PredictionDetail;
