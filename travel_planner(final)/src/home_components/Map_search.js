import { useState, useRef, useContext } from "react";
import styles from './Map_search.module.css';
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { LoadScriptContext } from '../LoadScriptContext';


const Map_search = ({ onPlaceSelect, mapRef }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autocompleteRef = useRef(null);
  const { setLocation } = useContext(LoadScriptContext);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id,
        address: place.formatted_address || ''
      };
      setInputValue(place.formatted_address);
      onPlaceSelect(location);
      setLocation(location);

      if (mapRef.current) {
        if (place.geometry.viewport) {
          mapRef.current.fitBounds(place.geometry.viewport);
        } else {
          mapRef.current.setCenter(location);
          mapRef.current.setZoom(6);
        }
      }
    }
  };

  const handleBlur = () => {
    if (!selectedPlace) {
      setInputValue("");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const autocompleteOptions = {
    types: ['locality', 'country', 'administrative_area_level_1'],
    fields: ['geometry', 'name', 'formatted_address', 'place_id']
  };
  
  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={onPlaceChanged}
      options={autocompleteOptions}
    >
      <div className={styles.input_container}>
        <input
          id={styles.destination}
          type="text"
          value={inputValue}
          onChange={(e) => {setInputValue(e.target.value);
            setSelectedPlace(null);
          }}
          onBlur={handleBlur}
          placeholder=''
        />
        <div className={styles.input_text}>
          <span className={styles.title} >목적지</span>
          <span className={`${styles.placeholder} ${inputValue ? styles.hidden : ''}`}>예: 제주, 파리, 후쿠오카</span>
        </div>
      </div>
    </Autocomplete>
  );
};

export default Map_search;


{/* <div className={`${styles.input_text} ${inputValue ? styles.hidden:''}`}> */}
/* <Map_search onPlaceSelect={handlePlaceSelect} /> */ // << 부모 컴포넌트 태그 형태.

/* const onPlaceSelect = (location) => {
    // 마커 추가
    addMarker(location);
    // 지도 이동
    mapRef.current.panTo(location);
    // 기타 필요한 작업 수행
}; */ // 부모 컴포넌트에 그대로 추가 
    
    
    
// addMarker, mapRef : 매개변수 ( 부모에서 props로 쓸 때 // 참고용)

