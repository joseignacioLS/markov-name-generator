import { IPrediction } from "@/app/types";
import styles from "./styles.module.scss";

interface IProps {
  prediction: IPrediction;
}

const PredictionDetail = ({ prediction }: IProps) => {
  return (
    <div className={styles.wrapper}>
      <h2>{prediction.value}</h2>
      <p>
        <span>Fuente:</span>
        <span>{prediction.source}</span>
      </p>
      <p>
        <span>Fidelidad:</span>
        <span>{prediction.window}</span>
      </p>
    </div>
  );
};

export default PredictionDetail;
