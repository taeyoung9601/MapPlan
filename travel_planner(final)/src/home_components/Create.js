import { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Create.module.css';
import { Search } from './index';

const Create = () => {
    const mapRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handlePlaceSelect = (location) => {
        console.log('Selected location:', location);
        setSelectedLocation(location);
        setErrorMessage('');
    };

    const handleCreatePlan = (e) => {
        e.preventDefault();
        if (!selectedLocation) {
            setErrorMessage('여행하고싶은 장소를 적어주세요!');
        } else {
            // 선택된 위치의 좌표를 사용하여 다른 페이지로 이동
            navigate('/Plan', { state: { location: selectedLocation } });
        }
    };

    return (
        <div className={styles.create_plan}>
            <div className={styles.wrapper} />
            <div className={styles.text}>
                기본 지역을 선택해 일정을 계획해봅시다!
            </div>
            <div className={styles.search}>
                <Search onPlaceSelect={handlePlaceSelect} mapRef={mapRef} />
            </div>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            <div className={styles.buttons}>
                <NavLink to="/Plan" onClick={handleCreatePlan}>
                    일정 만들기
                </NavLink>
            </div>
        </div>
    )
}

export default Create
