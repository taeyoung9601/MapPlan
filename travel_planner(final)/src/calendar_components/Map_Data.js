import { useLoadScript } from '../LoadScriptContext';
import styles from './Map_Data.module.css';

const Map_Data = () => {
  const { savePlaces,
  } = useLoadScript();

  return (
    <button onClick={() => {
      savePlaces();
      //placeAddInDate();
    }} className={styles.save_button}>
      일정에 등록
    </button>
  );
};

export default Map_Data;