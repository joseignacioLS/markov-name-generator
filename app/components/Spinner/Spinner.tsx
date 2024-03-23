import styles from "./styles.module.scss";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <span className="material-symbols-outlined">refresh</span>
    </div>
  );
};

export default Spinner;
