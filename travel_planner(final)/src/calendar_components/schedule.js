import styles from './schedule.module.css';
import { useLoadScript } from '../LoadScriptContext';

function Schedule({ date, selectedPlaces, onPlaceDelete }) {
    const { showCalendar } = useLoadScript();

    return (
        <>
            { showCalendar ? <> </> :
            <div className={styles.schedule_container}>
                <div className={styles.detail_schedule}>
                    <h3>📅 {date} 일정</h3>
                    <button onClick={() => onPlaceDelete(date, selectedPlaces.id)}>삭제</button>
                </div>

                <ol className={styles.list}>
                    {selectedPlaces.map((place) => (
                        <li key={place.id}>
                            {place.details.name}
                        </li>
                    ))}
                </ol>
            </div>
                }
        </>
    );
}

export default Schedule;