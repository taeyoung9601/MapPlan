import { useState, useRef, useContext, useEffect } from "react";
import styles from './Map_Data_Search.module.css';
import { Autocomplete, useJsApiLoader, Marker } from "@react-google-maps/api";
import { LoadScriptContext } from '../LoadScriptContext';


const MapDataSearch = ({ onPlaceSelect = () => { }, mapRef = { current: null } }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autocompleteRef = useRef(null);
  const { setLocation, addMarker, location } = useContext(LoadScriptContext);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });
  useEffect(() => {
    if (location && autocompleteRef.current) {
      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(location.lat - 0.1, location.lng - 0.1),
        new window.google.maps.LatLng(location.lat + 0.1, location.lng + 0.1)
      );
      autocompleteRef.current.setBounds(bounds);
    }
  }, [location]);

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

      // 지도 자동완성 검색 시 마커 추가
      addMarker({
        lat: location.lat,
        lng: location.lng,
        placeId: location.placeId,
        address: location.address,
      });

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

  const autocompleteOptions = {
    // types: ['tourist_attraction', 
    //     'point_of_interest', 
    //     'restaurant', 
    //     'amusement_park',  
    //     'landmark',],
    fields: ['geometry', 'name', 'place_id'],
    bounds: location ? new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(location.lat - 0.2, location.lng - 0.2),
      new window.google.maps.LatLng(location.lat + 0.2, location.lng + 0.2)
    ) : null,
    strictBounds: true
  };

  const clearInput = () => {
    setInputValue("");
    setSelectedPlace(null);
  };

  return (
    <Autocomplete
      onLoad={(autocompleteInstance) => {
        if (autocompleteInstance) {
          autocompleteRef.current = autocompleteInstance;
        }
      }}
      onPlaceChanged={onPlaceChanged}
      options={autocompleteOptions}
    >
      <div className={styles.Map_Data_Search_input_container}>
        <input
          className={styles.destination}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSelectedPlace(null);
          }}
          onBlur={handleBlur}
          placeholder=''
        />
        <div className={styles.Map_Data_Search_input_text}>
          <span className={`${styles.placeholder} ${inputValue ? styles.hidden : ''}`}>여행지 검색</span>
        </div>
        {inputValue ? (
          <button className={styles.clearBtn} onClick={clearInput}>
            ✕
          </button>
        ) : null}
      </div>
    </Autocomplete>
  );
};

export default MapDataSearch;