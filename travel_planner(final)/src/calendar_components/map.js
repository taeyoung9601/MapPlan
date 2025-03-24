import React, { useContext, useCallback } from 'react';
import styles from './map.module.css';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useLoadScript } from '../LoadScriptContext';
import { Map_Marker, Map_calculDistance, Map_Data, MapDataSearch } from './index';
import { Navigate } from 'react-router-dom';


function Map() {

    const { setMap, location } = useLoadScript();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const onLoad = useCallback(function callback(map) {
        if (location) {
            map.setCenter(location);
            map.setZoom(11);
        }
        setMap(map);
    }, [location]);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, [])

    const mapOptions = {
        streetViewControl: false,
        mapTypeCotrol: false,
        zoomControl: true,
        zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER
        }
    };

    return (
        <div className={styles.mapstyle}>
            {/* {isLoaded && location ? ( */}
                {location ? ( // 재 랜더링 시, location이 초기화 됨.
                <GoogleMap
                    mapContainerClassName={styles.mapContainer}
                    center={location}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    zoom={11}
                    options={mapOptions}
                >
                    { /* 마커, 정보창 등의 자식 컴포넌트 */}
                    <Map_Marker />
                    <Map_calculDistance />
                    <Map_Data />
                    <MapDataSearch/>
                </GoogleMap>
            ) : 
            <Navigate  to="/" replace /> // 재 랜더링 시, location이 초기화 됨. 때문에 최초 화면으로 이동
            }
        </div>
    );
}

export default Map;